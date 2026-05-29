/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LogIn, LayoutDashboard, Key, ShieldAlert, Award, 
  MapPin, Phone, Mail, Clock, RefreshCcw, ExternalLink 
} from "lucide-react";
import { Property, Agent, AuditLog, UserRole } from "./types";
import Navbar from "./components/Navbar";
import FeaturedProperties from "./components/FeaturedProperties";
import ListingTable from "./components/ListingTable";
import PropertyFormModal from "./components/PropertyFormModal";
import AgentFormModal from "./components/AgentFormModal";
import AuditLogModal from "./components/AuditLogModal";
import ContactForm from "./components/ContactForm";
import AboutUs from "./components/AboutUs";
import WhyChooseUs from "./components/WhyChooseUs";
import PremiumFeatures from "./components/PremiumFeatures";
import PrimePropertyLogo from "./components/PrimePropertyLogo";
import { initialProperties, initialAgents, fallbackLogs } from "./initialData";

const getStoredProperties = (): Property[] => {
  const stored = localStorage.getItem("prime_properties");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      // ignore
    }
  }
  // Initialize on first stand-alone load
  localStorage.setItem("prime_properties", JSON.stringify(initialProperties));
  return initialProperties;
};

const getStoredLogs = (): AuditLog[] => {
  const stored = localStorage.getItem("prime_audit_logs");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
  }
  localStorage.setItem("prime_audit_logs", JSON.stringify(fallbackLogs));
  return fallbackLogs;
};

const getStoredActiveUser = () => {
  const stored = localStorage.getItem("prime_active_user");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
  }
  return null;
};

// Helper: Parse URL Query Params
function parseUrlParams(): Record<string, string> {
  const search = window.location.search;
  const params: Record<string, string> = {};
  if (!search) return params;
  const urlParams = new URLSearchParams(search);
  urlParams.forEach((val, key) => {
    params[key] = val;
  });
  return params;
}

export default function App() {
  // Path-Based routing states
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [urlFilters, setUrlFilters] = useState<Record<string, string>>({});

  // Auth States
  const [user, setUser] = useState<{ username: string; fullName: string; role: UserRole } | null>(getStoredActiveUser);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // App Database States
  const [properties, setProperties] = useState<Property[]>(getStoredProperties);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(getStoredLogs);
  const [loadingDb, setLoadingDb] = useState(false);

  // Global Alerts / Banner State
  const [globalBanner, setGlobalBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modals Toggles & Selected items
  const [isPropertyModelOpen, setIsPropertyModelOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isPropertyReadOnly, setIsPropertyReadOnly] = useState(false);

  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Global Sync of URL parameters (Search / Filters)
  useEffect(() => {
    if (window.location.pathname === "/") {
      setUrlFilters(parseUrlParams());
    }
  }, [currentPath]);

  // Handle auto-scroll to designated sections via query string (e.g. ?scroll=about-section)
  useEffect(() => {
    if (currentPath === "/") {
      const params = new URLSearchParams(window.location.search);
      const scrollTarget = params.get("scroll");
      if (scrollTarget) {
        // Clean up the query parameter in browser history to keep URL perfect
        const cleanUrl = window.location.pathname;
        window.history.replaceState(null, "", cleanUrl);
        
        // Timeout to ensure elements are rendered
        setTimeout(() => {
          const el = document.getElementById(scrollTarget);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 150);
      }
    }
  }, [currentPath]);

  // Auto-scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentPath]);

  // Push Page-State Transitions to browser history smoothly
  const handleNavigate = (path: string) => {
    window.history.pushState(null, "", path);
    setCurrentPath(path);
    setGlobalBanner(null);
  };

  // Synchronize browser native back/forward button clicks
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Fetch Session Authenticated Data on start
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem("prime_active_user", JSON.stringify(data.user));
        }
      } catch (err) {
        // Suppress on public view
      }
    };
    checkSession();
  }, []);

  // Fetch Database (Properties)
  const fetchProperties = async () => {
    setLoadingDb(true);
    try {
      // If logged in, fetch from protected admin properties; otherwise fetch from public endpoint
      const endpoint = user ? "/api/properties" : "/api/public/properties";
      const res = await fetch(endpoint).catch(() => {
        throw new Error("offline");
      });
      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties || []);
        localStorage.setItem("prime_properties", JSON.stringify(data.properties || []));
      } else {
        throw new Error("unreachable");
      }
    } catch (e) {
      // Graceful fallback to cached properties dataset
      console.warn("Running in stand-alone local storage fallback mode.", e);
      const cached = getStoredProperties();
      setProperties(cached);
    } finally {
      setLoadingDb(false);
    }
  };

  // Trigger loading DB on either landing or role adjustments
  useEffect(() => {
    fetchProperties();
  }, [user]);

  // Fetch Audit logs if logged in
  const fetchAuditLogs = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/audit-logs").catch(() => {
        throw new Error("offline");
      });
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.auditLogs || []);
        localStorage.setItem("prime_audit_logs", JSON.stringify(data.auditLogs || []));
      } else {
        throw new Error("unreachable");
      }
    } catch (e) {
      const cached = getStoredLogs();
      setAuditLogs(cached);
    }
  };

  useEffect(() => {
    if (user && currentPath === "/agent/dashboard") {
      fetchAuditLogs();
    }
  }, [user, currentPath]);

  // URL parameters updater triggered by filter changes
  const handleUrlFilterChange = (filters: Record<string, string>) => {
    const urlParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) urlParams.set(key, value);
    });
    const queryString = urlParams.toString();
    const searchPart = queryString ? `?${queryString}` : "";
    window.history.replaceState(null, "", "/" + searchPart);
    setUrlFilters(filters);
  };

  // --- SERVICE AGENT OPERATIONS ---

  // Auth: Login
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setLoginError("ID Agen dan kata sandi wajib ditulis.");
      return;
    }
    setAuthLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      }).catch(() => {
        throw new Error("offline");
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        localStorage.setItem("prime_active_user", JSON.stringify(data.user));
        setLoginUsername("");
        setLoginPassword("");
        handleNavigate("/agent/dashboard");
      } else {
        setLoginError(data.error || "Gagal masuk. Otorisasi salah.");
      }
    } catch (err: any) {
      console.warn("Attempting standalone offline matching fallback...");
      const agentsStored = localStorage.getItem("prime_agents");
      const agents: Agent[] = agentsStored ? JSON.parse(agentsStored) : initialAgents;
      
      const foundAgent = agents.find(a => a.username.toLowerCase() === loginUsername.trim().toLowerCase());
      if (foundAgent) {
        const mockUser = {
          username: foundAgent.username,
          fullName: foundAgent.fullName,
          role: foundAgent.role
        };
        setUser(mockUser);
        localStorage.setItem("prime_active_user", JSON.stringify(mockUser));
        setLoginUsername("");
        setLoginPassword("");
        handleNavigate("/agent/dashboard");
        setGlobalBanner({ 
          type: "success", 
          text: `Selamat datang kembali, ${foundAgent.fullName}. Terhubung aman via Standalone Local Engine.` 
        });
      } else {
        setLoginError("Kombinasi ID Agen salah atau tidak terdaftar di database luring.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Auth: Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    } catch (e) {
      // safe fallthrough
    }
    setUser(null);
    localStorage.removeItem("prime_active_user");
    handleNavigate("/");
    setGlobalBanner({ type: "success", text: "Terima kasih. Anda telah keluar dari sistem secara aman." });
  };

  // Contact msg delivery
  const handleContactSubmit = async (payload: {
    fullName: string;
    email: string;
    phone: string;
    message: string;
  }) => {
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(() => {
        throw new Error("offline");
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: "", error: data.error };
      }
    } catch (err) {
      // Local fallthrough storage
      const messagesStored = localStorage.getItem("prime_messages");
      const currentMsgs = messagesStored ? JSON.parse(messagesStored) : [];
      const newMsg = {
        id: "msg_" + Date.now(),
        ...payload,
        timestamp: new Date().toISOString()
      };
      currentMsgs.push(newMsg);
      localStorage.setItem("prime_messages", JSON.stringify(currentMsgs));
      return { 
        success: true, 
        message: "Pesan konsultasi premium Anda berhasil dicatat secara privat di micro-cloud browser Anda!" 
      };
    }
  };

  // CREATE / EDIT PROPERTY CONTROLLER
  const handlePropertySubmit = async (payload: any): Promise<boolean> => {
    try {
      const url = selectedProperty ? `/api/properties/${selectedProperty.id}` : "/api/properties";
      const method = selectedProperty ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(() => {
        throw new Error("offline");
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setGlobalBanner({
          type: "success",
          text: selectedProperty 
            ? "Spesifikasi properti berhasil diperbaharui." 
            : "Listing properti premium baru berhasil ditambahkan."
        });
        await fetchProperties();
        await fetchAuditLogs();
        return true;
      } else {
        setGlobalBanner({ type: "error", text: data.error || "Gagal memproses perubahan properti." });
        return false;
      }
    } catch (e) {
      // Local storage offline workflow
      const currentProps = [...properties];
      const actor = user?.username || "offline_advisor";
      const timestamp = new Date().toISOString();

      if (selectedProperty) {
        const idx = currentProps.findIndex((p) => p.id === selectedProperty.id);
        if (idx !== -1) {
          const updated: Property = {
            ...currentProps[idx],
            ...payload,
            nama: payload.nama_property || payload.nama,
            updated_at: timestamp
          };
          currentProps[idx] = updated;

          const newLog: AuditLog = {
            id: `log_${Date.now()}`,
            action: "UPDATE",
            property_id: selectedProperty.id,
            property_nama: updated.nama_property,
            performed_by: actor,
            details: `Mengedit spesifikasi secara luring: ${updated.nama_property}`,
            timestamp
          };
          const logs = [newLog, ...auditLogs];
          setAuditLogs(logs);
          localStorage.setItem("prime_audit_logs", JSON.stringify(logs));
        }
      } else {
        const newId = `prop_${Date.now()}`;
        const created: Property = {
          ...payload,
          id: newId,
          nama: payload.nama_property,
          nama_property: payload.nama_property,
          status: "in_stock",
          created_at: timestamp,
          updated_at: timestamp,
          created_by: actor,
          deleted_at: null
        };
        currentProps.push(created);

        const newLog: AuditLog = {
          id: `log_${Date.now()}`,
          action: "CREATE",
          property_id: newId,
          property_nama: created.nama_property,
          performed_by: actor,
          details: `Menambah listing secara luring: ${created.nama_property}`,
          timestamp
        };
        const logs = [newLog, ...auditLogs];
        setAuditLogs(logs);
        localStorage.setItem("prime_audit_logs", JSON.stringify(logs));
      }

      setProperties(currentProps);
      localStorage.setItem("prime_properties", JSON.stringify(currentProps));

      setGlobalBanner({
        type: "success",
        text: selectedProperty 
          ? "Spesifikasi properti diperbaharui luring (localStorage)." 
          : "Listing properti baru ditambahkan luring (localStorage)."
      });
      return true;
    }
  };

  // DELETE (SOFT DELETE)
  const handlePropertyDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin mengarsipkan (soft-delete) properti ini? Properti tidak akan tampil di halaman publik tetapi tersimpan di arsip.")) {
      return;
    }

    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" }).catch(() => {
        throw new Error("offline");
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setGlobalBanner({ type: "success", text: "Properti berhasil diarsipkan (Soft Delete)." });
        await fetchProperties();
        await fetchAuditLogs();
      } else {
        setGlobalBanner({ type: "error", text: data.error || "Gagal mengarsipkan properti." });
      }
    } catch (e) {
      // Local soft delete
      const currentProps = properties.map(p => {
        if (p.id === id) {
          return { ...p, deleted_at: new Date().toISOString() };
        }
        return p;
      });
      setProperties(currentProps);
      localStorage.setItem("prime_properties", JSON.stringify(currentProps));

      const propObj = properties.find(p => p.id === id);
      const newLog: AuditLog = {
        id: `log_${Date.now()}`,
        action: "DELETE",
        property_id: id,
        property_nama: propObj?.nama_property || "Komponen",
        performed_by: user?.username || "offline_advisor",
        details: `Mengarsipkan (soft delete) properti luring: ${propObj?.nama_property}`,
        timestamp: new Date().toISOString()
      };
      const logs = [newLog, ...auditLogs];
      setAuditLogs(logs);
      localStorage.setItem("prime_audit_logs", JSON.stringify(logs));

      setGlobalBanner({ type: "success", text: "Properti berhasil diarsipkan secara luring." });
    }
  };

  // RESTORE PROPERTY
  const handlePropertyRestore = async (id: string) => {
    try {
      const res = await fetch(`/api/properties/${id}/restore`, { method: "POST" }).catch(() => {
        throw new Error("offline");
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setGlobalBanner({ type: "success", text: "Properti berhasil dipulihkan secara penuh." });
        await fetchProperties();
        await fetchAuditLogs();
      } else {
        setGlobalBanner({ type: "error", text: data.error || "Gagal memulihkan properti." });
      }
    } catch (e) {
      const currentProps = properties.map(p => {
        if (p.id === id) {
          return { ...p, deleted_at: null };
        }
        return p;
      });
      setProperties(currentProps);
      localStorage.setItem("prime_properties", JSON.stringify(currentProps));

      const propObj = properties.find(p => p.id === id);
      const newLog: AuditLog = {
        id: `log_${Date.now()}`,
        action: "RESTORE",
        property_id: id,
        property_nama: propObj?.nama_property || "Komponen",
        performed_by: user?.username || "offline_advisor",
        details: `Memulihkan properti luring: ${propObj?.nama_property}`,
        timestamp: new Date().toISOString()
      };
      const logs = [newLog, ...auditLogs];
      setAuditLogs(logs);
      localStorage.setItem("prime_audit_logs", JSON.stringify(logs));

      setGlobalBanner({ type: "success", text: "Properti berhasil dipulihkan luring." });
    }
  };

  // --- ACCOUNTS / AGENT MANAGEMENT SERVICES ---
  
  const handleFetchAgentsList = async (): Promise<Agent[]> => {
    try {
      const res = await fetch("/api/agents").catch(() => {
        throw new Error("offline");
      });
      if (res.ok) {
        const data = await res.json();
        return data.agents || [];
      }
    } catch (e) {
      const agentsStored = localStorage.getItem("prime_agents");
      if (agentsStored) {
        return JSON.parse(agentsStored);
      }
      localStorage.setItem("prime_agents", JSON.stringify(initialAgents));
      return initialAgents;
    }
    throw new Error("Gagal mengambil daftar akun otorisasi.");
  };

  const handleCreateAgentAccount = async (payload: any) => {
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(() => {
        throw new Error("offline");
      });
      const data = await res.json();
      return { success: res.ok, error: data.error };
    } catch (e) {
      const stored = localStorage.getItem("prime_agents");
      const currentAgents: Agent[] = stored ? JSON.parse(stored) : [...initialAgents];
      
      if (currentAgents.some(a => a.username === payload.username)) {
        return { success: false, error: "ID Agen tersebut sudah pernah digunakan." };
      }

      const newAgent: Agent = {
        username: payload.username,
        fullName: payload.fullName,
        role: payload.role,
        created_at: new Date().toISOString()
      };
      currentAgents.push(newAgent);
      localStorage.setItem("prime_agents", JSON.stringify(currentAgents));
      return { success: true, error: "" };
    }
  };

  const handleUpdateAgentAccount = async (username: string, payload: any) => {
    try {
      const res = await fetch(`/api/agents/${username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(() => {
        throw new Error("offline");
      });
      const data = await res.json();
      return { success: res.ok, error: data.error };
    } catch (e) {
      const stored = localStorage.getItem("prime_agents");
      const currentAgents: Agent[] = stored ? JSON.parse(stored) : [...initialAgents];
      const idx = currentAgents.findIndex(a => a.username === username);
      if (idx !== -1) {
        currentAgents[idx] = {
          ...currentAgents[idx],
          fullName: payload.fullName,
          role: payload.role
        };
        localStorage.setItem("prime_agents", JSON.stringify(currentAgents));
        return { success: true, error: "" };
      }
      return { success: false, error: "Akun agen luring tidak dapat ditemukan." };
    }
  };

  const handleDeleteAgentAccount = async (username: string) => {
    try {
      const res = await fetch(`/api/agents/${username}`, { method: "DELETE" }).catch(() => {
        throw new Error("offline");
      });
      const data = await res.json();
      return { success: res.ok, error: data.error };
    } catch (e) {
      const stored = localStorage.getItem("prime_agents");
      let currentAgents: Agent[] = stored ? JSON.parse(stored) : [...initialAgents];
      currentAgents = currentAgents.filter(a => a.username !== username);
      localStorage.setItem("prime_agents", JSON.stringify(currentAgents));
      return { success: true, error: "" };
    }
  };

  // --- CORE RENDER CONTROLLER ---
  const renderContent = () => {
    switch (currentPath) {
      case "/":
        return (
          <div className="flex flex-col min-h-[80vh]">
            {/* Beranda: Real estate directory and search engine */}
            <section id="beranda-section" className="scroll-mt-20">
              <FeaturedProperties
                properties={properties}
                urlFilters={urlFilters}
                onFilterChange={handleUrlFilterChange}
              />
            </section>
            
            {/* Premium Features: Facilities and Investment Advantages displayed on Beranda */}
            <PremiumFeatures />

            {/* Why Choose Us: Compelling reasons to choose Prime Property */}
            <WhyChooseUs />
          </div>
        );
      case "/about":
        return (
          <div className="py-6 bg-gradient-to-b from-luxury-black via-[#0c0c0d] to-[#0a0a0b] min-h-[80vh]">
            <AboutUs />
          </div>
        );
      case "/contact":
        return (
          <div className="py-6 bg-gradient-to-b from-[#0f0f10] to-[#0a0a0b] min-h-[80vh]">
            <ContactForm onSubmitContact={handleContactSubmit} />
          </div>
        );

      case "/agent/login":
        if (user) {
          // Redirect if already authenticated
          setTimeout(() => handleNavigate("/agent/dashboard"), 100);
          return <div className="text-center py-24 text-gray-400">Menghubungkan ke portal...</div>;
        }
        const loginContainer = {
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.05
            }
          }
        };

        const loginItem = {
          hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
          show: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
          }
        };

        return (
          <div className="max-w-md mx-auto py-16 px-4 sm:px-6">
            <motion.div 
              variants={loginContainer}
              initial="hidden"
              animate="show"
              className="glass-panel p-8 sm:p-10 rounded-2xl border border-luxury-gold/30 gold-glow-strong text-left"
            >
              <motion.div variants={loginItem} className="text-center space-y-3 mb-8">
                <div className="w-12 h-12 bg-luxury-gold/10 border border-luxury-gold flex items-center justify-center rounded-xl mx-auto text-luxury-gold shadow-md">
                  <Key className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-wide">Representatif Agen</h2>
                <p className="text-gray-400 text-xs font-light">
                  Berikan ID Kredensial operasional Anda untuk masuk.
                </p>
              </motion.div>

              {loginError && (
                <motion.div variants={loginItem} className="p-3 bg-luxury-red/15 border border-luxury-red/35 text-red-300 rounded-lg text-xs font-semibold mb-6 animate-fade-in leading-relaxed">
                  ⚠️ {loginError}
                </motion.div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <motion.div variants={loginItem}>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2">ID Agen (Username)</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: agent_budi"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full bg-luxury-deep text-white text-xs px-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:outline-none placeholder:text-gray-700 font-semibold uppercase font-mono tracking-wider"
                    id="login-username-input"
                  />
                </motion.div>

                <motion.div variants={loginItem}>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2">Kata Sandi</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-luxury-deep text-white text-xs px-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:outline-none placeholder:text-gray-700 font-mono"
                    id="login-password-input"
                  />
                </motion.div>

                <motion.button
                  variants={loginItem}
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-luxury-gold hover:bg-luxury-gold-hover text-luxury-black font-bold uppercase text-xs tracking-wider rounded-lg shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50"
                  id="btn-submit-login"
                >
                  {authLoading ? "Memverifikasi..." : "Akses Sistem"}
                </motion.button>
              </form>
            </motion.div>
          </div>
        );

      case "/agent/dashboard":
        if (!user) {
          // Enforce active session boundary
          return (
            <div className="max-w-md mx-auto py-24 px-4 text-center space-y-6">
              <span className="text-4xl">🔒</span>
              <h3 className="text-lg font-bold text-white">Sesi Tidak Aktif</h3>
              <p className="text-gray-400 text-sm">
                Akses ditolak. Anda wajib masuk sebagai Agen / Superadmin terlebih dahulu untuk masuk ke portal internal.
              </p>
              <button
                onClick={() => handleNavigate("/agent/login")}
                className="bg-luxury-gold text-luxury-black font-semibold text-xs px-6 py-3 rounded-lg hover:bg-luxury-gold-hover cursor-pointer"
              >
                Masuk Sekarang
              </button>
            </div>
          );
        }

        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <ListingTable
              properties={properties}
              userRole={user.role}
              onAddClick={() => {
                setSelectedProperty(null);
                setIsPropertyReadOnly(false);
                setIsPropertyModelOpen(true);
              }}
              onEditClick={(prop) => {
                setSelectedProperty(prop);
                // Standard admin cannot modify property, only review detail
                setIsPropertyReadOnly(user.role !== "superadmin");
                setIsPropertyModelOpen(true);
              }}
              onDeleteClick={handlePropertyDelete}
              onRestoreClick={handlePropertyRestore}
              onViewLogsClick={() => setIsAuditModalOpen(true)}
              onManageAgentsClick={() => setIsAgentModalOpen(true)}
            />
          </div>
        );

      default:
        return (
          <div className="max-w-md mx-auto py-24 text-center space-y-4">
            <span className="text-4xl">⚠️</span>
            <h1 className="text-2xl font-black text-white">Undocumented Page (404)</h1>
            <p className="text-gray-400 text-sm">Halaman yang Anda tuju tidak terdaftar di sistem kami.</p>
            <button
              onClick={() => handleNavigate("/")}
              className="px-5 py-2.5 bg-luxury-gold text-luxury-black font-bold uppercase text-xs rounded-lg cursor-pointer"
            >
              Kembali Ke Beranda
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-luxury-deep text-gray-100 flex flex-col justify-between">
      {/* Top Banner Warning or Feedback */}
      <AnimatePresence>
        {globalBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            id="global-feedback-banner"
            className={`w-full py-3.5 px-4 text-center text-xs font-semibold border-b relative z-50 flex items-center justify-center gap-3 ${
              globalBanner.type === "success"
                ? "bg-green-950/90 text-green-300 border-green-800/40"
                : "bg-red-950/90 text-red-300 border-luxury-red/40"
            }`}
          >
            <span>{globalBanner.text}</span>
            <button
              onClick={() => setGlobalBanner(null)}
              className="text-gray-400 hover:text-white font-bold cursor-pointer font-sans px-1 text-sm leading-none"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Header */}
      <Navbar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
      />

      {/* Primary Content View with smooth motion fade-in */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Absolute, compliant Popups Modals list */}
      <PropertyFormModal
        isOpen={isPropertyModelOpen}
        onClose={() => {
          setIsPropertyModelOpen(false);
          setSelectedProperty(null);
        }}
        property={selectedProperty}
        isReadOnly={isPropertyReadOnly}
        onSubmit={handlePropertySubmit}
      />

      {isAgentModalOpen && user?.role === "superadmin" && (
        <AgentFormModal
          isOpen={isAgentModalOpen}
          onClose={() => setIsAgentModalOpen(false)}
          currentUser={user.username}
          onFetchAgents={handleFetchAgentsList}
          onCreateAgent={handleCreateAgentAccount}
          onUpdateAgent={handleUpdateAgentAccount}
          onDeleteAgent={handleDeleteAgentAccount}
        />
      )}

      {isAuditModalOpen && user && (
        <AuditLogModal
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
          logs={auditLogs}
        />
      )}

      {/* Footer Design */}
      <footer className="bg-neutral-950/80 backdrop-blur-md border-t border-luxury-gold/10 py-16 text-center text-gray-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-4 flex flex-col items-center">
          <div className="flex items-center justify-center">
            <PrimePropertyLogo className="h-10 text-white" />
          </div>
          <div className="pt-2 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luxury-gold/5 border border-luxury-gold/20 text-luxury-gold text-[10px] font-mono tracking-wider uppercase mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Smart Hybrid Engine Active</span>
            </div>
            <p className="text-[10px] text-gray-400 font-light leading-relaxed">
              Mendukung sinkronisasi awan & Penyimpanan Luring Mandiri. CRM dan direktori properti Anda tetap beroperasi penuh di server statis (Vercel / GitHub Pages).
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
