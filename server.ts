/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { 
  Property, 
  Agent, 
  AuditLog, 
  ContactMessage, 
  UserRole,
  PropertyType,
  PropertyStatus,
  CompassDirection
} from "./src/types";

const app = express();
const PORT = 3000;

// Enable JSON body parsing with secure limits
app.use(express.json({ limit: "1mb" }));

// DB File setup
const DATA_FILE = path.join(process.cwd(), "data.json");

interface DatabaseSchema {
  agents: Record<string, Agent & { passwordHash: string; salt: string }>;
  properties: Property[];
  auditLogs: AuditLog[];
  contactMessages: ContactMessage[];
}

// Memory-based cache for rate limiting & lockout
interface LockoutInfo {
  attempts: number;
  lockUntil: number;
}
const failedLoginAttempts = new Map<string, LockoutInfo>();

interface RateLimitInfo {
  count: number;
  resetTime: number;
}
const globalRateLimit = new Map<string, RateLimitInfo>();
const contactRateLimit = new Map<string, RateLimitInfo>(); // IP -> Hour resets

// Helper: Hashing passwords with PBKDF2 (Matches cost factor 10+)
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 12000, 64, "sha256").toString("hex");
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

// XSS Sanitization helper
function cleanString(str: string): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

// Helper to normalize and migrate properties dynamically for AC-6.1 Schema Data Compliance
function normalizeProperty(p: any): Property {
  const norm: any = { ...p };

  // 1. nama_property & nama mapping
  if (!norm.nama_property && norm.nama) {
    norm.nama_property = norm.nama;
  }
  if (!norm.nama && norm.nama_property) {
    norm.nama = norm.nama_property;
  }
  if (!norm.nama_property) {
    norm.nama_property = "Properti Tanpa Nama";
    norm.nama = "Properti Tanpa Nama";
  }

  // 2. group
  norm.group = norm.group || "";

  // 3. lebar, panjang, tingkat (allow floats/decimals where needed)
  norm.lebar = typeof norm.lebar === "number" ? norm.lebar : parseFloat(norm.lebar) || 0;
  norm.panjang = typeof norm.panjang === "number" ? norm.panjang : parseFloat(norm.panjang) || 0;
  norm.tingkat = typeof norm.tingkat === "number" ? norm.tingkat : parseFloat(norm.tingkat) || 1;

  // 4. price (bigint integer rupiah stored safely)
  norm.price = typeof norm.price === "number" ? norm.price : parseInt(norm.price) || 0;

  // 5. carport (essential boolean Checkbox transition)
  if (typeof norm.carport === "boolean") {
    // Already migrated
  } else if (typeof norm.carport === "number") {
    norm.carport = norm.carport > 0;
  } else {
    norm.carport = norm.carport === "true" || !!norm.carport;
  }

  // 6. status: in_stock / sold_out
  if (norm.status === "in_stock" || norm.status === "sold_out") {
    // Already migrated
  } else {
    const s = String(norm.status).toLowerCase();
    if (s === "disewa" || s === "tersedia" || s === "in_stock" || s === "tersedia (aktif)") {
      norm.status = "in_stock";
    } else {
      norm.status = "sold_out";
    }
  }

  // 7. siap: siap_huni / siap_kosong / siap_huni_renovasi
  if (norm.siap === "siap_huni" || norm.siap === "siap_kosong" || norm.siap === "siap_huni_renovasi") {
    // Already migrated
  } else {
    const ready = String(norm.siap).toLowerCase();
    if (ready === "ya" || ready === "ready" || ready === "siap") {
      norm.siap = "siap_huni";
    } else if (ready === "progress" || ready === "pembangunan") {
      norm.siap = "siap_kosong";
    } else {
      norm.siap = "siap_kosong";
    }
  }

  // 8. hadap (enum multi - list array of combinations check)
  if (Array.isArray(norm.hadap)) {
    // filter valid directions
    const valid = ["Utara", "Timur", "Selatan", "Barat"];
    norm.hadap = norm.hadap.filter((dir: any) => valid.includes(dir));
    if (norm.hadap.length === 0) norm.hadap = ["Utara"];
  } else if (typeof norm.hadap === "string") {
    const valid = ["Utara", "Timur", "Selatan", "Barat"];
    const parsed = norm.hadap.split(/[\s,+/]+/).map((d: string) => d.trim()).filter((d: string) => valid.includes(d));
    norm.hadap = parsed.length > 0 ? parsed : ["Utara"];
  } else {
    norm.hadap = ["Utara"];
  }

  // 9. non-nullables/optional defaults
  norm.maps_link = norm.maps_link || "";
  norm.kawasan = norm.kawasan || "";
  norm.unit = norm.unit || "";
  norm.deleted_at = norm.deleted_at || null;

  return norm as Property;
}

// Initialize Database Function
function loadDB(): DatabaseSchema {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(data) as DatabaseSchema;
      // Real-time run translation migration on startup to match AC-6.1 Schema Rules
      if (parsed.properties && Array.isArray(parsed.properties)) {
        parsed.properties = parsed.properties.map(p => normalizeProperty(p));
      }
      return parsed;
    } catch (e) {
      console.error("Error loading DB, resetting data", e);
    }
  }

  // Seeding default database
  const defaultSaltSuper = generateSalt();
  const defaultSaltBudi = generateSalt();
  const defaultSaltSiti = generateSalt();

  const initialDB: DatabaseSchema = {
    agents: {
      superadmin: {
        username: "superadmin",
        fullName: "Ahmad Syarif",
        role: "superadmin",
        created_at: new Date().toISOString(),
        salt: defaultSaltSuper,
        passwordHash: hashPassword("password123", defaultSaltSuper)
      },
      agent_budi: {
        username: "agent_budi",
        fullName: "Budi Santoso",
        role: "admin",
        created_at: new Date().toISOString(),
        salt: defaultSaltBudi,
        passwordHash: hashPassword("password123", defaultSaltBudi)
      },
      agent_siti: {
        username: "agent_siti",
        fullName: "Siti Aminah",
        role: "admin",
        created_at: new Date().toISOString(),
        salt: defaultSaltSiti,
        passwordHash: hashPassword("password123", defaultSaltSiti)
      }
    },
    properties: [
      {
        id: "prop_1",
        nama: "Ruko Golden Boulevard Row 3",
        group: "Golden Boulevard Series",
        lebar: 5,
        panjang: 15,
        hadap: "Utara",
        tipe: "Ruko",
        tingkat: 3,
        price: 2450000000,
        carport: 2,
        status: "Tersedia",
        siap: "Ya",
        maps_link: "https://maps.google.com/?q=Gading+Serpong+Boulevard",
        kawasan: "Gading Serpong",
        unit: "C-12",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: "superadmin",
        deleted_at: null
      },
      {
        id: "prop_2",
        nama: "Villa Sanctuary Uluwatu Cliffs",
        group: "Sanctury Ocean Suites",
        lebar: 18,
        panjang: 32,
        hadap: "Selatan",
        tipe: "Villa",
        tingkat: 2,
        price: 15500000000,
        carport: 4,
        status: "Tersedia",
        siap: "Ya",
        maps_link: "https://maps.google.com/?q=Uluwatu+Bali",
        kawasan: "Canggu",
        unit: "Block E-3",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: "superadmin",
        deleted_at: null
      },
      {
        id: "prop_3",
        nama: "Ruko Cordoba Premium PIK",
        group: "Cordoba Lakefront",
        lebar: 6,
        panjang: 18,
        hadap: "Timur",
        tipe: "Ruko",
        tingkat: 4,
        price: 4950000000,
        carport: 3,
        status: "Tersedia",
        siap: "Ya",
        maps_link: "https://maps.google.com/?q=Pantai+Indah+Kapuk",
        kawasan: "PIK",
        unit: "A-5",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: "agent_budi",
        deleted_at: null
      },
      {
        id: "prop_4",
        nama: "Villa Lavender Ubud Forest View",
        group: "Lavender Valley Residence",
        lebar: 12,
        panjang: 25,
        hadap: "Barat",
        tipe: "Villa",
        tingkat: 2,
        price: 6800000000,
        carport: 2,
        status: "Disewa",
        siap: "Ya",
        maps_link: "https://maps.google.com/?q=Ubud+Jungle",
        kawasan: "Ubud",
        unit: "Suite A-9",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: "agent_budi",
        deleted_at: null
      },
      {
        id: "prop_5",
        nama: "Ruko Foresta Business Loft 5",
        group: "Foresta Signature",
        lebar: 8,
        panjang: 20,
        hadap: "Utara",
        tipe: "Ruko",
        tingkat: 5,
        price: 8200000000,
        carport: 5,
        status: "Tersedia",
        siap: "Progress",
        maps_link: "https://maps.google.com/?q=Foresta+BSD",
        kawasan: "BSD",
        unit: "FBL-51",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: "agent_siti",
        deleted_at: null
      },
      {
        id: "prop_6",
        nama: "Villa Seminyak Suite Royale",
        group: "Royale Heights Seminyak",
        lebar: 15,
        panjang: 30,
        hadap: "Selatan",
        tipe: "Villa",
        tingkat: 2,
        price: 11200000000,
        carport: 3,
        status: "Terjual",
        siap: "Ya",
        maps_link: "https://maps.google.com/?q=Seminyak+Beach",
        kawasan: "Seminyak",
        unit: "Villa 3",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: "superadmin",
        deleted_at: null
      },
      {
        id: "prop_7",
        nama: "Luxury Mansion Menteng Residence",
        group: "Menteng Heritage Estates",
        lebar: 25,
        panjang: 45,
        hadap: "Timur",
        tipe: "Villa",
        tingkat: 3,
        price: 45000000000,
        carport: 8,
        status: "Tersedia",
        siap: "Ya",
        maps_link: "https://maps.google.com/?q=Menteng+Jakarta",
        kawasan: "Menteng",
        unit: "M-45",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: "superadmin",
        deleted_at: null
      },
      {
        id: "prop_8",
        nama: "Ruko Madison Business Park BSD",
        group: "Madison Boulevard Line",
        lebar: 4.5,
        panjang: 16,
        hadap: "Barat",
        tipe: "Ruko",
        tingkat: 2,
        price: 1950000000,
        carport: 2,
        status: "Tersedia",
        siap: "Ya",
        maps_link: "https://maps.google.com/?q=BSD+City",
        kawasan: "BSD",
        unit: "M-18",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: "agent_siti",
        deleted_at: null
      },
      {
        id: "prop_9",
        nama: "Villa Bamboo Nest Canggu Breeze",
        group: "Bamboo Tropical Suites",
        lebar: 10,
        panjang: 22,
        hadap: "Utara",
        tipe: "Villa",
        tingkat: 2,
        price: 5200000000,
        carport: 1,
        status: "Disewa",
        siap: "Ya",
        maps_link: "https://maps.google.com/?q=Canggu+Beach",
        kawasan: "Canggu",
        unit: "C-4",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: "agent_budi",
        deleted_at: null
      },
      {
        id: "prop_10",
        nama: "Ruko Crown Plaza Gading Serpong",
        group: "Crown Boulevard Line",
        lebar: 5,
        panjang: 17,
        hadap: "Utara",
        tipe: "Ruko",
        tingkat: 3,
        price: 3600000000,
        carport: 3,
        status: "Tersedia",
        siap: "Ya",
        maps_link: "https://maps.google.com/?q=Gading+Serpong+Boulevard",
        kawasan: "Gading Serpong",
        unit: "D-2",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: "agent_siti",
        deleted_at: null
      },
      {
        id: "prop_11",
        nama: "Villa cliffside Uluwatu Blue",
        group: "Ocean view suites",
        lebar: 22,
        panjang: 35,
        hadap: "Selatan",
        tipe: "Villa",
        tingkat: 3,
        price: 28000000000,
        carport: 6,
        status: "Tersedia",
        siap: "Progress",
        maps_link: "https://maps.google.com/?q=Uluwatu",
        kawasan: "Canggu",
        unit: "Cliff-1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: "superadmin",
        deleted_at: null
      },
      {
        id: "prop_12",
        nama: "Ruko Gading Square Center",
        group: "Square Town Row",
        lebar: 6,
        panjang: 22,
        hadap: "Timur",
        tipe: "Ruko",
        tingkat: 4,
        price: 5400000000,
        carport: 4,
        status: "Tersedia",
        siap: "Ya",
        maps_link: "https://maps.google.com/?q=Gading+Serpong+Boulevard",
        kawasan: "Gading Serpong",
        unit: "H-8",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: "agent_budi",
        deleted_at: null
      }
    ],
    auditLogs: [
      {
        id: "log_1",
        action: "CREATE",
        property_id: "prop_1",
        property_nama: "Ruko Golden Boulevard Row 3",
        performed_by: "superadmin",
        details: "Initial seeded property created.",
        timestamp: new Date().toISOString()
      },
      {
        id: "log_2",
        action: "CREATE",
        property_id: "prop_2",
        property_nama: "Villa Sanctuary Uluwatu Cliffs",
        performed_by: "superadmin",
        details: "Initial seeded property created.",
        timestamp: new Date().toISOString()
      }
    ],
    contactMessages: [
      {
        id: "msg_1",
        fullName: "Hendra Wijaya",
        email: "hendra@example.com",
        phone: "08123456789",
        message: "Saya tertarik dengan Villa Sanctuary Uluwatu Cliffs. Mohon kirim detail penawarannya via email.",
        timestamp: new Date().toISOString()
      }
    ]
  };

  // Normalize properties dynamically to match AC-6.1 Schema Rules
  initialDB.properties = initialDB.properties.map(p => normalizeProperty(p));

  saveDB(initialDB);
  return initialDB;
}

function saveDB(data: DatabaseSchema) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

const db = loadDB();

// Global active sessions store (SessionID -> user info)
const activeSessions = new Map<string, {
  username: string;
  fullName: string;
  role: UserRole;
  createdAt: number;
}>();

// Global Rate Limiter: 100 req / minute / IP
app.use((req, res, next) => {
  const ip = req.ip || "unknown_ip";
  const now = Date.now();
  const limitWindow = 60 * 1000; // 1 minute

  let clientLimit = globalRateLimit.get(ip);
  if (!clientLimit || now > clientLimit.resetTime) {
    clientLimit = { count: 1, resetTime: now + limitWindow };
    globalRateLimit.set(ip, clientLimit);
  } else {
    clientLimit.count++;
  }

  if (clientLimit.count > 100) {
    return res.status(429).json({ error: "Sistem mendeteksi aktivitas berlebih. Silakan tunggu 1 menit sebelum mencoba lagi." });
  }
  next();
});

// Cookie Session Parser Helper
function parseCookies(req: express.Request): Record<string, string> {
  const list: Record<string, string> = {};
  const rc = req.headers.cookie;
  if (rc) {
    rc.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      list[parts.shift()!.trim()] = decodeURIComponent(parts.join("="));
    });
  }
  return list;
}

// Session Validation Middleware
function authenticateSession(req: express.Request, res: express.Response, next: express.NextFunction) {
  const cookies = parseCookies(req);
  const sessionToken = cookies["session_token"];
  
  if (!sessionToken || !activeSessions.has(sessionToken)) {
    return res.status(401).json({ error: "Sesi Anda telah kedaluwarsa atau tidak valid. Silakan masuk kembali." });
  }

  const session = activeSessions.get(sessionToken)!;
  
  // Enforce session validity (30 days)
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  if (Date.now() - session.createdAt > thirtyDays) {
    activeSessions.delete(sessionToken);
    res.clearCookie("session_token");
    return res.status(401).json({ error: "Sesi Anda telah berakhir (aktif lebih dari 30 hari). Silakan masuk kembali." });
  }

  req.user = {
    username: session.username,
    fullName: session.fullName,
    role: session.role
  };
  next();
}

// Extends express request to store user context
declare global {
  namespace Express {
    interface Request {
      user?: {
        username: string;
        fullName: string;
        role: UserRole;
      };
    }
  }
}

// Enforce role authorization
function authorizeRole(role: UserRole) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: "Akses ditolak. Anda tidak memiliki izin untuk melakukan aksi ini." });
    }
    next();
  };
}

// Log changes
function logPropertyChange(
  action: "CREATE" | "UPDATE" | "DELETE" | "RESTORE", 
  propId: string, 
  propNama: string, 
  performedBy: string, 
  details: string
) {
  const newLog: AuditLog = {
    id: "log_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    action,
    property_id: propId,
    property_nama: propNama,
    performed_by: performedBy,
    details,
    timestamp: new Date().toISOString()
  };
  db.auditLogs.unshift(newLog); // Put latest logs first
  saveDB(db);
}

// --- API ROUTES ---

// 1. PUBLIC LANDING PRESETS
app.get("/api/public/properties", (req, res) => {
  // Return all visible, non-softdeleted properties
  const activeProps = db.properties.filter(p => p.deleted_at === null);
  res.json({ properties: activeProps });
});

// 2. CONTACT US MSG (Rate limited to 3 / Hour / IP)
app.post("/api/public/contact", (req, res) => {
  const ip = req.ip || "unknown_ip";
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  let ipLimits = contactRateLimit.get(ip);
  if (!ipLimits || now > ipLimits.resetTime) {
    ipLimits = { count: 1, resetTime: now + oneHour };
    contactRateLimit.set(ip, ipLimits);
  } else {
    ipLimits.count++;
  }

  if (ipLimits.count > 3) {
    return res.status(429).json({ error: "Anda telah mengirimkan pesan 3 kali dalam satu jam ini. Mohon hubungi kami lagi di jam berikutnya." });
  }

  const { fullName, email, phone, message } = req.body;

  // XSS and field checks
  const cleanName = cleanString(fullName);
  const cleanEmail = cleanString(email);
  const cleanPhone = cleanString(phone);
  const cleanMsg = cleanString(message);

  if (!cleanName || !cleanEmail || !cleanPhone || !cleanMsg) {
    return res.status(400).json({ error: "Semua kolom input wajib diisi dengan benar." });
  }

  // Create message
  const newMessage: ContactMessage = {
    id: "msg_" + Date.now(),
    fullName: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    message: cleanMsg,
    timestamp: new Date().toISOString()
  };

  db.contactMessages.unshift(newMessage);
  saveDB(db);

  res.json({ success: true, message: "Pesan Anda telah berhasil dikirimkan. Tim kami akan segera menghubungi Anda." });
});

// 3. AUTH: LOGIN (Failed attempts rate lockout)
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const now = Date.now();

  const cleanUser = cleanString(username).toLowerCase();

  if (!cleanUser || !password) {
    return res.status(400).json({ error: "Username dan password wajib diisi." });
  }

  // Check Lockout
  const lockInfo = failedLoginAttempts.get(cleanUser);
  if (lockInfo && lockInfo.attempts >= 5 && now < lockInfo.lockUntil) {
    const minsLeft = Math.ceil((lockInfo.lockUntil - now) / 60000);
    return res.status(423).json({ 
      error: `Akun dikunci sementara karena 5x salah sandi. Silakan coba kembali dalam ${minsLeft} menit.` 
    });
  }

  const agent = db.agents[cleanUser];
  if (!agent) {
    // Increment fail
    const current = lockInfo ? lockInfo.attempts : 0;
    const newLock = {
      attempts: current + 1,
      lockUntil: current + 1 >= 5 ? now + 15 * 60 * 1000 : 0
    };
    failedLoginAttempts.set(cleanUser, newLock);

    return res.status(401).json({ 
      error: `ID Agen atau kata sandi salah. Sisa percobaan: ${5 - newLock.attempts}`
    });
  }

  // Verify Hash
  const hash = hashPassword(password, agent.salt);
  if (hash !== agent.passwordHash) {
    const current = lockInfo ? lockInfo.attempts : 0;
    const newLock = {
      attempts: current + 1,
      lockUntil: current + 1 >= 5 ? now + 15 * 60 * 1000 : 0
    };
    failedLoginAttempts.set(cleanUser, newLock);

    return res.status(401).json({ 
      error: `ID Agen atau kata sandi salah. Sisa percobaan: ${5 - newLock.attempts}`
    });
  }

  // Success: reset fails
  failedLoginAttempts.delete(cleanUser);

  // Generate Session ID
  const sessionToken = crypto.randomBytes(32).toString("hex");
  activeSessions.set(sessionToken, {
    username: agent.username,
    fullName: agent.fullName,
    role: agent.role,
    createdAt: now
  });

  // Set Cookie parameters (HttpOnly, SameSite=Lax, Max-Age 30 days)
  res.setHeader(
    "Set-Cookie",
    `session_token=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`
  );

  res.json({
    success: true,
    user: {
      username: agent.username,
      fullName: agent.fullName,
      role: agent.role
    }
  });
});

// 4. AUTH: LOGOUT
app.post("/api/auth/logout", (req, res) => {
  const cookies = parseCookies(req);
  const sessionToken = cookies["session_token"];
  if (sessionToken) {
    activeSessions.delete(sessionToken);
  }
  res.setHeader(
    "Set-Cookie",
    "session_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
  );
  res.json({ success: true });
});

// 5. AUTH: GET ME
app.get("/api/auth/me", (req, res) => {
  const cookies = parseCookies(req);
  const sessionToken = cookies["session_token"];
  
  if (!sessionToken || !activeSessions.has(sessionToken)) {
    return res.status(401).json({ error: "Sesi tidak ditemukan" });
  }

  const session = activeSessions.get(sessionToken)!;
  res.json({
    user: {
      username: session.username,
      fullName: session.fullName,
      role: session.role
    }
  });
});

// --- PROTECTED ROUTES (Admin + Superadmin) ---

// 6. INTERNAL FULL PROPERTIES (Including Soft-Deleted for phase 2 archive view)
app.get("/api/properties", authenticateSession, (req, res) => {
  // Let internal agents see everything including soft deleted archive properties
  res.json({ properties: db.properties });
});

// 7. GET AUDIT LOGS
app.get("/api/audit-logs", authenticateSession, (req, res) => {
  res.json({ auditLogs: db.auditLogs });
});

// --- PROTECTED ROUTES (Superadmin Only --- Full CRUD + Agent management) ---

// 8. CREATE PROPERTY (AC-6.1 compliant validation rules)
app.post("/api/properties", authenticateSession, authorizeRole("superadmin"), (req, res) => {
  const { 
    nama_property, nama, group, lebar, panjang, hadap, tipe, tingkat, 
    price, carport, status, siap, maps_link, kawasan, unit 
  } = req.body;

  // Server-side validations
  const finalNama = cleanString(nama_property || nama);
  const cleanGroup = cleanString(group || "");
  const cleanKawasan = cleanString(kawasan || "");
  const cleanUnit = cleanString(unit || "");
  const cleanMaps = cleanString(maps_link || "");

  const numLebar = parseFloat(lebar);
  const numPanjang = parseFloat(panjang);
  const numTingkat = parseFloat(tingkat);
  const numPrice = parseInt(price);
  
  // carport is a checkbox/boolean
  const isCarport = typeof carport === "boolean" ? carport : carport === "true" || !!carport;

  if (!finalNama || isNaN(numLebar) || isNaN(numPanjang) || isNaN(numPrice) || isNaN(numTingkat) || !cleanKawasan) {
    return res.status(400).json({ error: "Data properti tidak lengkap atau tidak valid. Kolom Nama, Dimensi, Harga, Tingkat, & Kawasan bersifat wajib." });
  }

  // Validate hadap (multiple enum combinations)
  const validDirections = ["Utara", "Timur", "Selatan", "Barat"];
  let finalHadap: CompassDirection[] = [];
  if (Array.isArray(hadap)) {
    finalHadap = hadap.filter((d: any) => validDirections.includes(d));
  } else if (typeof hadap === "string") {
    finalHadap = hadap.split(/[\s,+/]+/).map((d: string) => d.trim()).filter((d: string) => validDirections.includes(d)) as CompassDirection[];
  }
  if (finalHadap.length === 0) {
    return res.status(400).json({ error: "Arah hadap properti harus menyantumkan minimal satu arah valid: Utara, Timur, Selatan, Barat." });
  }

  // Validate types
  const validTipe: PropertyType[] = ["Ruko", "Villa"];
  if (!validTipe.includes(tipe)) {
    return res.status(400).json({ error: "Tipe properti harus Ruko atau Villa." });
  }

  // Validate status
  const validStatus: PropertyStatus[] = ["in_stock", "sold_out"];
  if (!validStatus.includes(status)) {
    return res.status(400).json({ error: "Status properti harus bernilai: in_stock atau sold_out." });
  }

  // Validate readiness status
  const validSiap: PropertySiap[] = ["siap_huni", "siap_kosong", "siap_huni_renovasi"];
  if (!validSiap.includes(siap)) {
    return res.status(400).json({ error: "Kesiapan unit harus bernilai: siap_huni, siap_kosong, atau siap_huni_renovasi." });
  }

  const newProperty: Property = {
    id: "prop_" + Date.now(),
    nama_property: finalNama,
    nama: finalNama, // Backwards-compatible duplicate
    group: cleanGroup,
    lebar: numLebar,
    panjang: numPanjang,
    hadap: finalHadap,
    tipe,
    tingkat: numTingkat,
    price: numPrice,
    carport: isCarport,
    status,
    siap,
    maps_link: cleanMaps,
    kawasan: cleanKawasan,
    unit: cleanUnit,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: req.user!.username,
    deleted_at: null
  };

  db.properties.push(newProperty);
  saveDB(db);

  // Write Audit Log
  logPropertyChange(
    "CREATE", 
    newProperty.id, 
    newProperty.nama_property, 
    req.user!.username, 
    `Membuat listing properti baru: ${newProperty.tipe} di kawasan ${newProperty.kawasan} dengan harga Rp ${newProperty.price.toLocaleString("id-ID")}`
  );

  res.json({ success: true, property: newProperty });
});

// 9. UPDATE PROPERTY (AC-6.1 compliant update validation rules)
app.put("/api/properties/:id", authenticateSession, authorizeRole("superadmin"), (req, res) => {
  const { id } = req.params;
  const propIndex = db.properties.findIndex(p => p.id === id);

  if (propIndex === -1) {
    return res.status(404).json({ error: "Properti tidak ditemukan" });
  }

  const existing = db.properties[propIndex];

  const { 
    nama_property, nama, group, lebar, panjang, hadap, tipe, tingkat, 
    price, carport, status, siap, maps_link, kawasan, unit 
  } = req.body;

  const finalNama = cleanString(nama_property || nama);
  const cleanGroup = cleanString(group || "");
  const cleanKawasan = cleanString(kawasan || "");
  const cleanUnit = cleanString(unit || "");
  const cleanMaps = cleanString(maps_link || "");

  const numLebar = parseFloat(lebar);
  const numPanjang = parseFloat(panjang);
  const numTingkat = parseFloat(tingkat);
  const numPrice = parseInt(price);
  
  // carport is a checkbox/boolean
  const isCarport = typeof carport === "boolean" ? carport : carport === "true" || !!carport;

  if (!finalNama || isNaN(numLebar) || isNaN(numPanjang) || isNaN(numPrice) || isNaN(numTingkat) || !cleanKawasan) {
    return res.status(400).json({ error: "Data properti tidak lengkap atau tidak valid." });
  }

  // Validate hadap (multiple enum combinations)
  const validDirections = ["Utara", "Timur", "Selatan", "Barat"];
  let finalHadap: CompassDirection[] = [];
  if (Array.isArray(hadap)) {
    finalHadap = hadap.filter((d: any) => validDirections.includes(d));
  } else if (typeof hadap === "string") {
    finalHadap = hadap.split(/[\s,+/]+/).map((d: string) => d.trim()).filter((d: string) => validDirections.includes(d)) as CompassDirection[];
  }
  if (finalHadap.length === 0) {
    return res.status(400).json({ error: "Arah hadap properti harus menyantumkan minimal satu arah valid." });
  }

  // Validate types
  const validTipe: PropertyType[] = ["Ruko", "Villa"];
  if (!validTipe.includes(tipe)) {
    return res.status(400).json({ error: "Tipe properti harus Ruko atau Villa." });
  }

  // Validate status
  const validStatus: PropertyStatus[] = ["in_stock", "sold_out"];
  if (!validStatus.includes(status)) {
    return res.status(400).json({ error: "Status properti tidak valid." });
  }

  // Validate readiness status
  const validSiap: PropertySiap[] = ["siap_huni", "siap_kosong", "siap_huni_renovasi"];
  if (!validSiap.includes(siap)) {
    return res.status(400).json({ error: "Kesiapan unit tidak valid." });
  }

  // Build changes list for audit logs
  const changesList: string[] = [];
  if (existing.nama_property !== finalNama) changesList.push(`Nama diubah dari "${existing.nama_property}" ke "${finalNama}"`);
  if (existing.price !== numPrice) changesList.push(`Harga diubah dari Rp ${existing.price.toLocaleString("id-ID")} ke Rp ${numPrice.toLocaleString("id-ID")}`);
  if (existing.status !== status) changesList.push(`Status diubah dari "${existing.status}" ke "${status}"`);
  if (existing.siap !== siap) changesList.push(`Siap huni diubah dari "${existing.siap}" ke "${siap}"`);
  if (existing.kawasan !== cleanKawasan) changesList.push(`Kawasan diubah dari "${existing.kawasan}" ke "${cleanKawasan}"`);

  const updatedProperty: Property = {
    ...existing,
    nama_property: finalNama,
    nama: finalNama, // Backwards-compatible duplicate
    group: cleanGroup,
    lebar: numLebar,
    panjang: numPanjang,
    hadap: finalHadap,
    tipe,
    tingkat: numTingkat,
    price: numPrice,
    carport: isCarport,
    status,
    siap,
    maps_link: cleanMaps,
    kawasan: cleanKawasan,
    unit: cleanUnit,
    updated_at: new Date().toISOString()
  };

  db.properties[propIndex] = updatedProperty;
  saveDB(db);

  // Write audit
  const changeDetails = changesList.length > 0 ? changesList.join(", ") : "Memperbaharui spesifikasi properti.";
  logPropertyChange("UPDATE", id, updatedProperty.nama_property, req.user!.username, changeDetails);

  res.json({ success: true, property: updatedProperty });
});

// 10. SOFT DELETE
app.delete("/api/properties/:id", authenticateSession, authorizeRole("superadmin"), (req, res) => {
  const { id } = req.params;
  const propIndex = db.properties.findIndex(p => p.id === id);

  if (propIndex === -1) {
    return res.status(404).json({ error: "Properti tidak ditemukan." });
  }

  const prop = db.properties[propIndex];
  if (prop.deleted_at !== null) {
    return res.status(400).json({ error: "Properti sudah diarsipkan sebelumnya." });
  }

  prop.deleted_at = new Date().toISOString();
  saveDB(db);

  logPropertyChange("DELETE", id, prop.nama, req.user!.username, "Mengarsipkan properti (Soft Delete).");

  res.json({ success: true, message: "Properti berhasil diarsipkan." });
});

// 11. RESTORE FROM ARCHIVE
app.post("/api/properties/:id/restore", authenticateSession, authorizeRole("superadmin"), (req, res) => {
  const { id } = req.params;
  const propIndex = db.properties.findIndex(p => p.id === id);

  if (propIndex === -1) {
    return res.status(404).json({ error: "Properti tidak ditemukan" });
  }

  const prop = db.properties[propIndex];
  if (prop.deleted_at === null) {
    return res.status(400).json({ error: "Properti masih aktif dan tidak berada di arsip." });
  }

  prop.deleted_at = null;
  saveDB(db);

  logPropertyChange("RESTORE", id, prop.nama, req.user!.username, "Memulihkan properti dari arsip.");

  res.json({ success: true, message: "Properti berhasil diaktifkan kembali." });
});

// 12. GET AGENTS LIST (Superadmin only)
app.get("/api/agents", authenticateSession, authorizeRole("superadmin"), (req, res) => {
  const agentsList = Object.values(db.agents).map((a) => ({
    username: a.username,
    fullName: a.fullName,
    role: a.role,
    created_at: a.created_at
  }));
  res.json({ agents: agentsList });
});

// 13. CREATE AGENT
app.post("/api/agents", authenticateSession, authorizeRole("superadmin"), (req, res) => {
  const { username, fullName, role, password } = req.body;

  const cleanUser = cleanString(username).toLowerCase().trim().replace(/[^a-z0-9_]/g, "");
  const cleanFull = cleanString(fullName);

  if (!cleanUser || cleanUser.length < 4) {
    return res.status(400).json({ error: "ID Agen minimal 4 karakter (huruf, angka, & underscore saja)." });
  }

  if (!cleanFull || cleanFull.length < 3) {
    return res.status(400).json({ error: "Nama lengkap agen harus valid." });
  }

  if (role !== "admin" && role !== "superadmin") {
    return res.status(400).json({ error: "Role agen tidak valid." });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Kata sandi operasional minimal 6 karakter." });
  }

  if (db.agents[cleanUser]) {
    return res.status(400).json({ error: "ID Agen (username) sudah terdaftar di sistem." });
  }

  const newSalt = generateSalt();
  const passwordHash = hashPassword(password, newSalt);

  db.agents[cleanUser] = {
    username: cleanUser,
    fullName: cleanFull,
    role: role as UserRole,
    created_at: new Date().toISOString(),
    salt: newSalt,
    passwordHash
  };
  saveDB(db);

  res.json({ 
    success: true, 
    agent: { 
      username: cleanUser, 
      fullName: cleanFull, 
      role, 
      created_at: db.agents[cleanUser].created_at 
    } 
  });
});

// 14. EDIT AGENT CREDENTIALS / DETAILS
app.put("/api/agents/:username", authenticateSession, authorizeRole("superadmin"), (req, res) => {
  const { username } = req.params;
  const { fullName, role, password } = req.body;

  const targetAgent = db.agents[username];
  if (!targetAgent) {
    return res.status(404).json({ error: "Agen tidak ditemukan" });
  }

  const cleanFull = cleanString(fullName);
  if (!cleanFull || cleanFull.length < 3) {
    return res.status(400).json({ error: "Nama lengkap agen harus valid." });
  }

  if (role !== "admin" && role !== "superadmin") {
    return res.status(400).json({ error: "Role tidak valid." });
  }

  targetAgent.fullName = cleanFull;
  targetAgent.role = role as UserRole;

  if (password && password.trim().length > 0) {
    if (password.length < 6) {
      return res.status(400).json({ error: "Kata sandi baru minimal 6 karakter." });
    }
    const newSalt = generateSalt();
    targetAgent.salt = newSalt;
    targetAgent.passwordHash = hashPassword(password, newSalt);
  }

  saveDB(db);
  res.json({ success: true, message: "Kredensial agen berhasil diperbaharui." });
});

// 15. DELETE AGENT
app.delete("/api/agents/:username", authenticateSession, authorizeRole("superadmin"), (req, res) => {
  const { username } = req.params;

  if (username === req.user!.username) {
    return res.status(400).json({ error: "Anda tidak dapat menghapus akun Anda sendiri." });
  }

  if (!db.agents[username]) {
    return res.status(404).json({ error: "Agen tidak ditemukan." });
  }

  delete db.agents[username];
  saveDB(db);

  res.json({ success: true, message: "Akun agen berhasil dihapus." });
});

// --- VITE MIDDLEWARE SETUP ---

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    // Production serving from bundler output
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Prime Property Backend] running at http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
