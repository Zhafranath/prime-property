/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, Info, Mail, LogIn, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import PrimePropertyLogo from "./PrimePropertyLogo";

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  user: { username: string; fullName: string; role: string } | null;
  onLogout: () => void;
}

export default function Navbar({ currentPath, onNavigate, user, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda-section");

  const navItems = [
    { label: "Beranda", path: "beranda-section", icon: Home },
    { label: "Tentang Kami", path: "about-section", icon: Info },
    { label: "Hubungi Kami", path: "contact-section", icon: Mail },
  ];

  // Dynamic Scroll Tracking (Scrollspy)
  useEffect(() => {
    // Only track if we are on the landing page
    if (currentPath !== "/" && currentPath !== "") return;

    const sections = ["beranda-section", "about-section", "contact-section"];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180; // offset for sticky navbar height
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run an initial check delayed slightly after rendering
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [currentPath]);

  const handleItemClick = (path: string) => {
    setMobileMenuOpen(false);

    // Is it a landing page section?
    if (path === "beranda-section" || path === "about-section" || path === "contact-section") {
      if (currentPath === "/" || currentPath === "") {
        const element = document.getElementById(path);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          setActiveSection(path);
        }
      } else {
        // Redirect back to "/" with scroll context query parameter
        onNavigate(`/?scroll=${path}`);
      }
    } else {
      // Direct routing
      onNavigate(path);
    }
  };

  const isItemActive = (path: string) => {
    if (currentPath !== "/" && currentPath !== "") {
      return false; // Section tabs inactive outside landing page
    }
    return activeSection === path;
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-luxury-gold/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Brand using custom SVG and text rendering matching image */}
          <div className="flex items-center">
            <button 
              onClick={() => handleItemClick("beranda-section")} 
              className="flex items-center cursor-pointer group"
              id="btn-brand-logo"
            >
              <PrimePropertyLogo className="h-10 text-white" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isItemActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => handleItemClick(item.path)}
                  id={`nav-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "text-luxury-gold bg-luxury-gold/10 border border-luxury-gold/30 gold-glow"
                      : "text-gray-300 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop Auth Portal Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3 pl-4 border-l border-luxury-gray-dark">
                <div className="text-right">
                  <span className="block text-xs font-semibold text-luxury-gold">
                    {user.fullName}
                  </span>
                  <span className="block text-[10px] text-gray-400 font-mono uppercase bg-luxury-gray-dark/50 px-1.5 py-0.5 rounded border border-gray-700 mt-0.5">
                    {user.role}
                  </span>
                </div>
                {currentPath !== "/agent/dashboard" && (
                  <button
                    onClick={() => handleItemClick("/agent/dashboard")}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-luxury-gold hover:bg-luxury-gold-hover text-luxury-black rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors duration-200 shadow-md cursor-pointer"
                    id="btn-nav-dashboard"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Portal</span>
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-luxury-red hover:bg-luxury-red/10 rounded-lg transition-colors duration-200 cursor-pointer"
                  title="Logout"
                  id="btn-nav-logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleItemClick("/agent/login")}
                className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-all duration-300 cursor-pointer ${
                  currentPath === "/agent/login"
                    ? "bg-luxury-gold border-luxury-gold text-luxury-black"
                    : "border-luxury-gold/40 text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black"
                }`}
                id="btn-nav-login"
              >
                <LogIn className="w-4 h-4" />
                <span>Portal Agen</span>
              </button>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-luxury-gray-dark focus:outline-none focus:ring-2 focus:ring-inset focus:ring-luxury-gold"
              aria-expanded="false"
              id="btn-mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu, show/hide based on menu state. */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-luxury-gold/10 px-2 pt-2 pb-4 space-y-1 block animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleItemClick(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "text-luxury-gold bg-luxury-gold/10 border-l-4 border-luxury-gold"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
          
          <div className="pt-4 border-t border-luxury-gold/10 mt-4 px-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-sm font-semibold text-luxury-gold">
                      {user.fullName}
                    </span>
                    <span className="block text-xs text-gray-400 font-mono uppercase mt-0.5">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-luxury-red hover:bg-luxury-red/10 border border-luxury-red/20 rounded-lg transition-colors cursor-pointer"
                    id="btn-mobile-logout"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar</span>
                  </button>
                </div>
                {currentPath !== "/agent/dashboard" && (
                  <button
                    onClick={() => handleItemClick("/agent/dashboard")}
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-luxury-gold text-luxury-black rounded-lg text-sm font-semibold tracking-wide cursor-pointer"
                    id="btn-mobile-dashboard"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Akses Portal Agen</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleItemClick("/agent/login")}
                className="w-full flex items-center justify-center space-x-2 py-3 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black rounded-lg text-sm font-semibold tracking-wide transition-all cursor-pointer"
                id="btn-mobile-login"
              >
                <LogIn className="w-5 h-5" />
                <span>Portal Agen</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
