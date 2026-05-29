/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, Info, Mail, LogIn, LayoutDashboard, LogOut, Menu, X, Sparkles, Phone, ShieldCheck, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import PrimePropertyLogo from "./PrimePropertyLogo";
import { useLanguage } from "../context/LanguageContext";

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  user: { username: string; fullName: string; role: string } | null;
  onLogout: () => void;
}

export default function Navbar({ currentPath, onNavigate, user, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: t("nav.home"), path: "/", icon: Home },
    { label: t("nav.about"), path: "/about", icon: Info },
    { label: t("nav.contact"), path: "/contact", icon: Mail },
  ];

  const handleItemClick = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  const isItemActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/" || currentPath === "";
    }
    return currentPath === path;
  };

  const toggleLanguage = () => {
    setLanguage(language === "id" ? "en" : "id");
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-transform duration-300">
      
      {/* 1. Golden Accent Boundary Sweep Line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-luxury-gold to-transparent z-50 pointer-events-none" />

      {/* 2. Main Luxury Floating Wrapper */}
      <div className={`transition-all duration-700 ease-[0.16,1,0.3,1] ${
        scrolled 
          ? "px-4 sm:px-10 py-3 md:py-4" 
          : "px-0 py-0"
      }`}>
        <nav className={`transition-all duration-700 ease-[0.16,1,0.3,1] relative overflow-visible ${
          scrolled 
            ? "max-w-7xl mx-auto rounded-full bg-luxury-black/85 backdrop-blur-2xl border border-luxury-gold/30 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_15px_rgba(201,169,97,0.15)] py-1.5 px-8" 
            : "w-full bg-gradient-to-b from-black/95 to-[#121213]/40 backdrop-blur-md border-b border-white/[0.04] shadow-xl py-4.5 px-4 sm:px-8 lg:px-12"
        }`}
        id="luxury-primary-nav"
        >
          {/* Subtle Top Inner Highlight glow inside the navbar container */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-full pointer-events-none" />

          <div className="flex justify-between items-center h-16 relative z-10">
            
            {/* Left Brand Area */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => handleItemClick("/")} 
                className="flex items-center cursor-pointer group relative py-1.5"
                id="btn-brand-logo"
              >
                {/* Royal light aura on logo hover */}
                <div className="absolute inset-x-0 -bottom-2 h-full bg-luxury-gold/5 blur-xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <PrimePropertyLogo className="h-9 sm:h-10 text-white relative z-10 transition-transform duration-300 group-hover:scale-[1.01]" />
              </button>
              
              {/* Vertical boutique divider & tagline (visible unscrolled desktop) */}
              {!scrolled && (
                <div className="hidden xl:flex flex-col border-l border-white/10 pl-4 py-1 text-left">
                  <span className="text-[8px] font-mono tracking-[0.3em] text-[#C9A961] font-extrabold uppercase">
                    {t("nav.established")}
                  </span>
                  <span className="text-[9px] text-gray-500 font-light tracking-wide mt-0.5">
                    {t("nav.authorized")}
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Center Menu Links inside ultra-fine pill border */}
            <div className="hidden md:flex items-center bg-black/40 border border-[#C9A961]/15 px-1.5 py-1 rounded-full shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)] backdrop-blur-md">
              {navItems.map((item, idx) => {
                const isActive = isItemActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => handleItemClick(item.path)}
                    id={`nav-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`relative flex items-center space-x-2 px-5 py-2.5 rounded-full text-[10px] font-extrabold uppercase tracking-[0.24em] transition-all duration-300 cursor-pointer group ${
                      isActive
                        ? "text-[#C9A961]"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <span className="relative z-10">{item.label}</span>
                    
                    {/* Active sleek dynamic golden gliding pill using layouts */}
                    {isActive && (
                      <motion.span 
                        layoutId="activeNavTab"
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 bg-gradient-to-r from-luxury-gold/15 to-amber-500/10 border border-[#C9A961]/30 rounded-full shadow-[0_4px_20px_rgba(201,169,97,0.18)]"
                      />
                    )}
                    
                    {!isActive && (
                      <span className="absolute inset-0 bg-white/[0.01] border border-transparent rounded-full opacity-0 group-hover:opacity-100 group-hover:border-white/[0.05] transition-all duration-300 scale-95 group-hover:scale-100" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Action Hub: Secure Agent Portal */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 px-4 py-2 text-[10px] font-black tracking-widest text-gray-400 hover:text-white border border-white/10 rounded-full transition-all cursor-pointer bg-white/5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language.toUpperCase()}</span>
              </button>

              {user ? (
                <div className="flex items-center space-x-3 pl-3 border-l border-white/[0.08]">
                  <div className="text-right flex flex-col justify-center">
                    <div className="flex items-center justify-end space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                      <span className="block text-xs font-bold text-white tracking-widest uppercase">
                        {user.fullName.split(" ")[0]}
                      </span>
                    </div>
                    <span className="block text-[7px] tracking-[0.25em] text-[#C9A961] font-mono font-black uppercase bg-luxury-gold/5 px-2 py-0.5 rounded border border-luxury-gold/15 mt-1 leading-none">
                      {user.role}
                    </span>
                  </div>
                  
                  {currentPath !== "/agent/dashboard" && (
                    <button
                      onClick={() => handleItemClick("/agent/dashboard")}
                      className="flex items-center space-x-1.5 px-4.5 py-2.5 bg-gradient-to-r from-luxury-gold to-amber-600 hover:from-luxury-gold-hover hover:to-amber-700 text-luxury-black rounded-full text-[9px] font-extrabold uppercase tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(201,169,97,0.15)] hover:shadow-[0_0_25px_rgba(201,169,97,0.3)] hover:scale-[1.02] cursor-pointer"
                      id="btn-nav-dashboard"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>{t("nav.system")}</span>
                    </button>
                  )}
                  
                  <button
                    onClick={onLogout}
                    className="p-2 text-gray-400 hover:text-luxury-red hover:bg-luxury-red/5 rounded-full border border-white/[0.06] hover:border-luxury-red/15 transition-all duration-300 cursor-pointer"
                    title={t("nav.logout")}
                    id="btn-nav-logout"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleItemClick("/agent/login")}
                  className={`flex items-center space-x-2 px-5.5 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.2em] rounded-full border transition-all duration-300 cursor-pointer group ${
                    currentPath === "/agent/login"
                      ? "bg-luxury-gold border-luxury-gold text-luxury-black shadow-[0_0_20px_rgba(201,169,97,0.25)]"
                      : "border-luxury-gold/30 text-luxury-gold hover:bg-luxury-gold hover:border-luxury-gold hover:text-luxury-black hover:shadow-[0_0_20px_rgba(201,169,97,0.2)]"
                  }`}
                  id="btn-nav-login"
                >
                  <LogIn className="w-3 h-3" />
                  <span>{t("nav.portal")}</span>
                </button>
              )}
            </div>

            {/* Mobile burger button */}
            <div className="flex items-center md:hidden space-x-3">
              <button
                onClick={toggleLanguage}
                className="p-2 text-gray-400 border border-white/10 rounded-full bg-white/5"
              >
                <Globe className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 border border-white/[0.06] hover:border-white/15 rounded-full transition-all cursor-pointer"
                id="btn-mobile-menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-luxury-gold" />}
              </button>
            </div>

          </div>
        </nav>
      </div>

      {/* Mobile Luxury Sidebar Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-luxury-black/98 border-t border-luxury-gold/20 px-4 pt-4 pb-8 space-y-2 block absolute w-full left-0 right-0 shadow-2xl backdrop-blur-3xl z-40"
          >
            <div className="space-y-1 py-1">
              <span className="text-[8px] font-mono tracking-[0.25em] text-[#C9A961] uppercase block pl-4 pb-2 font-bold">DIREKTORI PORTAL</span>
              {navItems.map((item) => {
                const isActive = isItemActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => handleItemClick(item.path)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-[10px] font-extrabold uppercase tracking-[0.18em] transition-all cursor-pointer ${
                      isActive
                        ? "text-luxury-gold bg-luxury-gold/10 border-l-4 border-luxury-gold"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />}
                  </button>
                );
              })}
            </div>
            
            <div className="pt-4 border-t border-white/[0.08] mt-4 px-2">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-white/[0.02] p-4 rounded-xl border border-white/[0.04]">
                    <div>
                      <span className="block text-xs font-semibold text-white tracking-wider uppercase">
                        {user.fullName}
                      </span>
                      <span className="block text-[8px] tracking-[0.2em] font-mono text-luxury-gold uppercase mt-1">
                        {user.role}
                      </span>
                    </div>
                    <button
                      onClick={onLogout}
                      className="flex items-center space-x-1 py-1.5 px-3.5 text-[9px] font-extrabold uppercase tracking-widest text-luxury-red hover:bg-luxury-red/10 border border-luxury-red/25 rounded-md transition-colors cursor-pointer"
                      id="btn-mobile-logout"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>{t("nav.logout")}</span>
                    </button>
                  </div>
                  {currentPath !== "/agent/dashboard" && (
                    <button
                      onClick={() => handleItemClick("/agent/dashboard")}
                      className="w-full flex items-center justify-center space-x-2 py-3.5 bg-gradient-to-r from-luxury-gold to-amber-600 text-luxury-black rounded-full text-[10px] font-extrabold uppercase tracking-widest cursor-pointer"
                      id="btn-mobile-dashboard"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>{t("nav.system")}</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2.5">
                  <button
                    onClick={() => handleItemClick("/agent/login")}
                    className="w-full flex items-center justify-center space-x-2 py-3.5 bg-luxury-gold text-luxury-black rounded-full text-[10px] font-extrabold uppercase tracking-[0.2em] transition-all cursor-pointer font-bold shadow-lg"
                    id="btn-mobile-login"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{t("nav.portal")}</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
