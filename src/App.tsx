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
import PrimePropertyLogo from "./components/PrimePropertyLogo";

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
  const [user, setUser] = useState<{ username: string; fullName: string; role: UserRole } | null>(null);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // App Database States
  const [properties, setProperties] = useState<Property[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
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
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties || []);
      }
    } catch (e) {
      console.error("Gagal mendapatkan daftar unit properti.", e);
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
      const res = await fetch("/api/audit-logs");
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.auditLogs || []);
      }
    } catch (e) {
      console.error("Gagal sinkronisasi audit logs.", e);
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
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        setLoginUsername("");
        setLoginPassword("");
        handleNavigate("/agent/dashboard");
      } else {
        setLoginError(data.error || "Gagal masuk. Otorisasi salah.");
      }
    } catch (err: any) {
      setLoginError("Upps, gagal terhubung dengan server pengelola.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Auth: Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      // safe fallthrough
    }
    setUser(null);
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
    const res = await fetch("/api/public/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      return { success: true, message: data.message };
    } else {
      return { success: false, message: "", error: data.error };
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
      setGlobalBanner({ type: "error", text: "Terjadi kesalahan hubungan server." });
      return false;
    }
  };

  // DELETE (SOFT DELETE)
  const handlePropertyDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin mengarsipkan (soft-delete) properti ini? Properti tidak akan tampil di halaman publik tetapi tersimpan di arsip.")) {
      return;
    }

    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setGlobalBanner({ type: "success", text: "Properti berhasil diarsipkan (Soft Delete)." });
        await fetchProperties();
        await fetchAuditLogs();
      } else {
        setGlobalBanner({ type: "error", text: data.error || "Gagal mengarsipkan properti." });
      }
    } catch (e) {
      setGlobalBanner({ type: "error", text: "Terjadi kendala operasional." });
    }
  };

  // RESTORE PROPERTY
  const handlePropertyRestore = async (id: string) => {
    try {
      const res = await fetch(`/api/properties/${id}/restore`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setGlobalBanner({ type: "success", text: "Properti berhasil dipulihkan secara penuh." });
        await fetchProperties();
        await fetchAuditLogs();
      } else {
        setGlobalBanner({ type: "error", text: data.error || "Gagal memulihkan properti." });
      }
    } catch (e) {
      setGlobalBanner({ type: "error", text: "Gagal memproses pemulihan." });
    }
  };

  // --- ACCOUNTS / AGENT MANAGEMENT SERVICES ---
  
  const handleFetchAgentsList = async (): Promise<Agent[]> => {
    const res = await fetch("/api/agents");
    if (res.ok) {
      const data = await res.json();
      return data.agents || [];
    }
    throw new Error("Gagal mengambil daftar akun otorisasi.");
  };

  const handleCreateAgentAccount = async (payload: any) => {
    const res = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return { success: res.ok, error: data.error };
  };

  const handleUpdateAgentAccount = async (username: string, payload: any) => {
    const res = await fetch(`/api/agents/${username}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return { success: res.ok, error: data.error };
  };

  const handleDeleteAgentAccount = async (username: string) => {
    const res = await fetch(`/api/agents/${username}`, { method: "DELETE" });
    const data = await res.json();
    return { success: res.ok, error: data.error };
  };

  // --- CORE RENDER CONTROLLER ---
  const renderContent = () => {
    switch (currentPath) {
      case "/":
        return (
          <div className="flex flex-col">
            {/* Beranda: Real estate directory and search engine */}
            <section id="beranda-section" className="scroll-mt-20">
              <FeaturedProperties
                properties={properties}
                urlFilters={urlFilters}
                onFilterChange={handleUrlFilterChange}
              />
            </section>
            
            {/* Tentang Kami: Architectural values and corporate details */}
            <section id="about-section" className="bg-gradient-to-b from-luxury-black via-[#0c0c0d] to-[#0f0f10] border-t border-b border-luxury-gold/10 py-12 scroll-mt-20">
              <AboutUs />
            </section>
            
            {/* Hubungi Kami: Integrated feedback, location and consultation forms */}
            <section id="contact-section" className="bg-[#0f0f10] py-12 scroll-mt-20">
              <ContactForm onSubmitContact={handleContactSubmit} />
            </section>
          </div>
        );
      case "/about":
        // Redirect to single-page anchor
        setTimeout(() => handleNavigate("/?scroll=about-section"), 50);
        return <div className="text-center py-24 text-gray-400 font-light">Mengarahkan ke Tentang Kami...</div>;
      case "/contact":
        // Redirect to single-page anchor
        setTimeout(() => handleNavigate("/?scroll=contact-section"), 50);
        return <div className="text-center py-24 text-gray-400 font-light">Mengarahkan ke Hubungi Kami...</div>;

      case "/agent/login":
        if (user) {
          // Redirect if already authenticated
          setTimeout(() => handleNavigate("/agent/dashboard"), 100);
          return <div className="text-center py-24 text-gray-400">Menghubungkan ke portal...</div>;
        }
        return (
          <div className="max-w-md mx-auto py-16 px-4 sm:px-6">
            <div className="glass-panel p-8 sm:p-10 rounded-2xl border border-luxury-gold/30 gold-glow-strong">
              <div className="text-center space-y-3 mb-8">
                <div className="w-12 h-12 bg-luxury-gold/10 border border-luxury-gold flex items-center justify-center rounded-xl mx-auto text-luxury-gold shadow-md">
                  <Key className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-wide">Representatif Agen</h2>
                <p className="text-gray-400 text-xs font-light">
                  Berikan ID Kredensial operasional Anda untuk masuk.
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-luxury-red/15 border border-luxury-red/35 text-red-300 rounded-lg text-xs font-semibold mb-6 animate-fade-in leading-relaxed">
                  ⚠️ {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
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
                </div>

                <div>
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
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-luxury-gold hover:bg-luxury-gold-hover text-luxury-black font-bold uppercase text-xs tracking-wider rounded-lg shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50"
                  id="btn-submit-login"
                >
                  {authLoading ? "Memverifikasi..." : "Akses Sistem"}
                </button>
              </form>
            </div>
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
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
      <footer className="bg-luxury-black border-t border-luxury-gold/10 py-12 mt-16 text-center text-gray-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-4 flex flex-col items-center">
          <div className="flex items-center justify-center">
            <PrimePropertyLogo className="h-10 text-white" />
          </div>
        </div>
      </footer>
    </div>
  );
}
