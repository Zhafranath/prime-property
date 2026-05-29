/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Language = "id" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  id: {
    // Navbar
    "nav.home": "Beranda",
    "nav.about": "Tentang Kami",
    "nav.contact": "Hubungi Kami",
    "nav.portal": "PORTAL AGEN",
    "nav.system": "Sistem Portal",
    "nav.logout": "Keluar",
    "nav.established": "KEPERCAYAAN TERJAMIN",
    "nav.authorized": "Penyedia Estate Resmi",

    // Hero
    "hero.masterpiece": "Masterpiece of",
    "hero.modern": "Modern Business Living",
    "hero.desc": "Harmoni ruang usaha prestisius dan hunian luxury di episentrum investasi masa depan.",
    "hero.tag": "PENGUASAAN ESTATE & ARSITEKTUR",

    // Filter
    "filter.title": "Pencarian Instrumen Aset",
    "filter.desc": "Saring spesifikasi secara presisi melalui integrasi data real-time.",
    "filter.advanced": "Filter Lanjutan",
    "filter.reset": "Reset",
    "filter.search_label": "Spesifikasi Unit",
    "filter.search_placeholder": "Nama komplek, unit, atau tipe...",
    "filter.type_label": "Klasifikasi Aset",
    "filter.type_all": "Semua Tipe Aset",
    "filter.type_ruko": "Ruko Komersial (High Yield)",
    "filter.type_villa": "Villa Eksklusif (Ultra Lux)",
    "filter.region_label": "Area & Distrik",
    "filter.region_all": "Seluruh Indonesia",
    "filter.status_label": "Ketersediaan",
    "filter.status_all": "Status Unit",
    "filter.status_ready": "Tersedia (Ready)",
    "filter.status_sold": "Terarsip (Sold)",
    "filter.min_price": "Budget Min (Rp)",
    "filter.max_price": "Budget Max (Rp)",
    "filter.facing_label": "Vektor Hadap",
    "filter.facing_all": "Semua Vektor",
    "filter.carport_label": "Kapasitas Garasi",
    "filter.carport_all": "Semua Opsi",
    "filter.carport_yes": "Tersedia Carport",
    "filter.carport_no": "Tanpa Carport",
    "filter.readiness_label": "Fase Konstruksi",
    "filter.readiness_all": "Semua Fase",
    "filter.readiness_ready": "Siap Huni (Immediate)",
    "filter.readiness_process": "Fase Pembangunan",
    "filter.readiness_refurb": "Fase Refurbishment",

    // Cards
    "card.featured": "Featured Masterpieces",
    "card.curation": "Kurasi Aset Terpilih",
    "card.found": "Unit Ditemukan",
    "card.land_area": "Land Area",
    "card.surface": "Surface",
    "card.facing": "Facing",
    "card.elevation": "Elevation",
    "card.provision": "Provision",
    "card.private": "PRIVATE",
    "card.none": "NONE",
    "card.investment": "INVESTMENT",
    "card.explore": "EXPLORE",
    "card.ready": "ESTATE READY",
    "card.available": "AVAILABLE",
    "card.sold": "SOLD OUT",
    "card.levels": "Levels",
    "card.not_found": "Aset Tidak Ditemukan",
    "card.reset_btn": "Reset Instrumen",

    // Detail Modal
    "detail.back": "Kembali",
    "detail.description": "Deskripsi Properti",
    "detail.parameters": "Parameter Teknis",
    "detail.blueprint": "Skema Layout",
    "detail.contact": "Hubungi Broker",
    "detail.exterior": "Eksterior Modern",
    "detail.interior": "Interior Pilihan",
    "detail.blueprint_tab": "Cetak Biru / Layout"
  },
  en: {
    // Navbar
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.contact": "Contact Us",
    "nav.portal": "AGENT PORTAL",
    "nav.system": "Portal System",
    "nav.logout": "Logout",
    "nav.established": "ESTABLISHED TRUST",
    "nav.authorized": "Authorized Estate Provider",

    // Hero
    "hero.masterpiece": "Masterpiece of",
    "hero.modern": "Modern Business Living",
    "hero.desc": "Harmony of prestigious business space and luxury living in the epicentre of future investment.",
    "hero.tag": "ESTATE & ARCHITECTURAL MASTERY",

    // Filter
    "filter.title": "Asset Instrument Search",
    "filter.desc": "Filter specifications precisely through real-time data integration.",
    "filter.advanced": "Advanced Filter",
    "filter.reset": "Reset",
    "filter.search_label": "Unit Specifications",
    "filter.search_placeholder": "Complex name, unit, or type...",
    "filter.type_label": "Asset Classification",
    "filter.type_all": "All Asset Types",
    "filter.type_ruko": "Commercial Ruko (High Yield)",
    "filter.type_villa": "Exclusive Villa (Ultra Lux)",
    "filter.region_label": "Area & District",
    "filter.region_all": "All Indonesia",
    "filter.status_label": "Availability",
    "filter.status_all": "Unit Status",
    "filter.status_ready": "Available (Ready)",
    "filter.status_sold": "Archived (Sold)",
    "filter.min_price": "Min Budget (Rp)",
    "filter.max_price": "Max Budget (Rp)",
    "filter.facing_label": "Facing Vector",
    "filter.facing_all": "All Vectors",
    "filter.carport_label": "Garage Capacity",
    "filter.carport_all": "All Options",
    "filter.carport_yes": "Carport Available",
    "filter.carport_no": "No Carport",
    "filter.readiness_label": "Construction Phase",
    "filter.readiness_all": "All Phases",
    "filter.readiness_ready": "Move-in Ready (Immediate)",
    "filter.readiness_process": "Development Phase",
    "filter.readiness_refurb": "Refurbishment Phase",

    // Cards
    "card.featured": "Featured Masterpieces",
    "card.curation": "Selected Asset Curation",
    "card.found": "Units Found",
    "card.land_area": "Land Area",
    "card.surface": "Surface",
    "card.facing": "Facing",
    "card.elevation": "Elevation",
    "card.provision": "Provision",
    "card.private": "PRIVATE",
    "card.none": "NONE",
    "card.investment": "INVESTMENT",
    "card.explore": "EXPLORE",
    "card.ready": "ESTATE READY",
    "card.available": "AVAILABLE",
    "card.sold": "SOLD OUT",
    "card.levels": "Levels",
    "card.not_found": "Asset Not Found",
    "card.reset_btn": "Reset Instrument",

    // Detail Modal
    "detail.back": "Back",
    "detail.description": "Property Description",
    "detail.parameters": "Technical Parameters",
    "detail.blueprint": "Layout Schema",
    "detail.contact": "Contact Broker",
    "detail.exterior": "Modern Exterior",
    "detail.interior": "Selected Interior",
    "detail.blueprint_tab": "Blueprint / Layout"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("prime_lang");
    return (saved as Language) || "id";
  });

  useEffect(() => {
    localStorage.setItem("prime_lang", language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations["id"]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
