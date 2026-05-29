/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, Compass, Grid, Layers, MapPin, Car, DollarSign, RefreshCw, Layers3, SlidersHorizontal, ChevronDown, ChevronUp, CheckCircle, Clock, Sparkles as SparklesIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Property, PropertyType, PropertyStatus, CompassDirection } from "../types";
import PublicPropertyDetailModal, { getPropertyImages } from "./PublicPropertyDetailModal";
import ImageWithFallback from "./ImageWithFallback";
import { useLanguage } from "../context/LanguageContext";

interface FeaturedPropertiesProps {
  properties: Property[];
  urlFilters: Record<string, string>;
  onFilterChange: (filters: Record<string, string>) => void;
}

export function formatRupiah(value: number): string {
  if (isNaN(value) || value === null) return "Rp 0";
  return "Rp " + Math.floor(value).toLocaleString("id-ID");
}

export default function FeaturedProperties({ properties, urlFilters, onFilterChange }: FeaturedPropertiesProps) {
  const { t } = useLanguage();
  // Public Detail Modal states
  const [selectedDetailProperty, setSelectedDetailProperty] = useState<Property | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Background Hero Images & Slideshow State
  const heroImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80"
  ];

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Local input states for instant responsiveness
  const [searchTerm, setSearchTerm] = useState(urlFilters.search || "");
  const [kawasan, setKawasan] = useState(urlFilters.kawasan || "");
  const [tipe, setTipe] = useState(urlFilters.tipe || "");
  const [status, setStatus] = useState(urlFilters.status || "");
  const [hadap, setHadap] = useState(urlFilters.hadap || "");
  const [siap, setSiap] = useState(urlFilters.siap || "");
  const [carport, setCarport] = useState(urlFilters.carport || "");
  const [minPrice, setMinPrice] = useState(urlFilters.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(urlFilters.maxPrice || "");

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize local state with URL filters (e.g., on URL transitions or back btn)
  useEffect(() => {
    setSearchTerm(urlFilters.search || "");
    setKawasan(urlFilters.kawasan || "");
    setTipe(urlFilters.tipe || "");
    setStatus(urlFilters.status || "");
    setHadap(urlFilters.hadap || "");
    setSiap(urlFilters.siap || "");
    setCarport(urlFilters.carport || "");
    setMinPrice(urlFilters.minPrice || "");
    setMaxPrice(urlFilters.maxPrice || "");
  }, [JSON.stringify(urlFilters)]);

  // Real-time 300ms debounce of inputs to trigger URL sync
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const updatedFilters: Record<string, string> = {};
      if (searchTerm) updatedFilters.search = searchTerm;
      if (kawasan) updatedFilters.kawasan = kawasan;
      if (tipe) updatedFilters.tipe = tipe;
      if (status) updatedFilters.status = status;
      if (hadap) updatedFilters.hadap = hadap;
      if (siap) updatedFilters.siap = siap;
      if (carport) updatedFilters.carport = carport;
      if (minPrice) updatedFilters.minPrice = minPrice;
      if (maxPrice) updatedFilters.maxPrice = maxPrice;

      onFilterChange(updatedFilters);
    }, 300);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchTerm, kawasan, tipe, status, hadap, siap, carport, minPrice, maxPrice]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setKawasan("");
    setTipe("");
    setStatus("");
    setHadap("");
    setSiap("");
    setCarport("");
    setMinPrice("");
    setMaxPrice("");
    onFilterChange({});
  };

  // Extract unique values dynamically for selection lists
  const availableKawasan = Array.from(new Set(properties.map(p => p.kawasan))).filter(Boolean);

  // Filter properties client-side based on actual filters
  const filteredProperties = properties.filter((prop) => {
    if (prop.deleted_at !== null) return false; // Hide inactive/deleted on public landing

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      const nameVal = prop.nama_property || prop.nama || "";
      const matchName = nameVal.toLowerCase().includes(s);
      const matchGroup = (prop.group || "").toLowerCase().includes(s);
      const matchUnit = (prop.unit || "").toLowerCase().includes(s);
      if (!matchName && !matchGroup && !matchUnit) return false;
    }

    if (kawasan && prop.kawasan !== kawasan) return false;
    if (tipe && prop.tipe !== tipe) return false;
    if (status && prop.status !== status) return false;
    if (hadap) {
      if (Array.isArray(prop.hadap)) {
        if (!prop.hadap.includes(hadap as CompassDirection)) return false;
      } else {
        if (prop.hadap !== hadap) return false;
      }
    }
    if (siap && prop.siap !== siap) return false;
    
    if (carport) {
      if (carport === "ada") {
        if (!prop.carport) return false;
      } else if (carport === "tidak_ada") {
        if (prop.carport) return false;
      }
    }

    if (minPrice) {
      const min = parseInt(minPrice);
      if (!isNaN(min) && prop.price < min) return false;
    }

    if (maxPrice) {
      const max = parseInt(maxPrice);
      if (!isNaN(max) && prop.price > max) return false;
    }

    return true;
  });

  const heroContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const heroItemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="w-full relative overflow-hidden bg-luxury-black">
      {/* Hero Banner Section with Smooth Transitioning Property Background Slideshow */}
      <div className="relative py-32 sm:py-40 px-4 sm:px-6 lg:px-8 border-b border-luxury-gold/10 overflow-hidden flex items-center justify-center min-h-[600px] noise-overlay">
        {/* Slideshow backgrounds */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentHeroIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.4, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImages[currentHeroIndex]})` }}
            />
          </AnimatePresence>
          {/* Subtle gradient layers for cinematic look & high contrast text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/60 to-transparent z-1 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-luxury-black/80 z-1 pointer-events-none" />
        </div>

        {/* Hero Content (above slideshow) */}
        <motion.div 
          variants={heroContainerVariants}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto text-center space-y-8 relative z-10"
        >
          <motion.div variants={heroItemVariants} className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.4em] text-white uppercase subheading-luxury">
              {t("hero.tag")}
            </span>
          </motion.div>
          
          <motion.h1 variants={heroItemVariants} className="text-5xl sm:text-7xl md:text-8xl font-black text-white leading-[0.9] heading-luxury">
            {t("hero.masterpiece")} <br />
            <span className="metallic-gold">
              {t("hero.modern")}
            </span>
          </motion.h1>
          
          <motion.p variants={heroItemVariants} className="text-sm sm:text-base md:text-xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed tracking-wide">
            {t("hero.desc")}
          </motion.p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        {/* Real-time Filter Panel - Transformed into a Sleek Dock */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass-dock p-8 sm:p-10 rounded-3xl shadow-2xl gold-glow-strong"
        >
          {/* Flex header row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/5 mb-8">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-white tracking-tight">{t("filter.title")}</h2>
              <p className="text-xs text-gray-400 font-medium tracking-wide">{t("filter.desc")}</p>
            </div>
            
            {/* Control Cluster */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl border transition-all cursor-pointer ${
                  showAdvanced 
                    ? "bg-white text-black border-white" 
                    : "text-white border-white/10 hover:border-luxury-gold/50 bg-white/5 hover:bg-white/10"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{t("filter.advanced")}</span>
                {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              
              <button
                onClick={handleResetFilters}
                className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 px-6 py-3 rounded-xl transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t("filter.reset")}</span>
              </button>
            </div>
          </div>

          {/* Core Simplified Filters (Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Search Input */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">{t("filter.search_label")}</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-luxury-gold transition-colors" />
                <input
                  type="text"
                  placeholder={t("filter.search_placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/[0.03] text-white text-xs pl-12 pr-4 py-4 rounded-xl border border-white/5 focus:border-luxury-gold/50 focus:outline-none transition-all placeholder:text-gray-600 font-semibold"
                />
              </div>
            </div>

            {/* Tipe Properti */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">{t("filter.type_label")}</label>
              <div className="relative group">
                <Grid className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-luxury-gold transition-colors" />
                <select
                  value={tipe}
                  onChange={(e) => setTipe(e.target.value)}
                  className="w-full bg-white/[0.03] text-white text-xs pl-12 pr-4 py-4 rounded-xl border border-white/5 focus:border-luxury-gold/50 focus:outline-none transition-all cursor-pointer font-semibold appearance-none"
                >
                  <option value="" className="bg-luxury-black">{t("filter.type_all")}</option>
                  <option value="Ruko" className="bg-luxury-black">{t("filter.type_ruko")}</option>
                  <option value="Villa" className="bg-luxury-black">{t("filter.type_villa")}</option>
                </select>
              </div>
            </div>

            {/* Kawasan / Region Select */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">{t("filter.region_label")}</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-luxury-gold transition-colors" />
                <select
                  value={kawasan}
                  onChange={(e) => setKawasan(e.target.value)}
                  className="w-full bg-white/[0.03] text-white text-xs pl-12 pr-4 py-4 rounded-xl border border-white/5 focus:border-luxury-gold/50 focus:outline-none transition-all cursor-pointer font-semibold appearance-none"
                >
                  <option value="" className="bg-luxury-black">{t("filter.region_all")}</option>
                  {availableKawasan.map((k) => (
                    <option key={k} value={k} className="bg-luxury-black">{k}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Expandable Advanced Options */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-8 border-t border-white/5 mt-8">
                  {/* Status Properti */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">{t("filter.status_label")}</label>
                    <div className="relative">
                      <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full bg-white/[0.03] text-white text-xs pl-12 pr-4 py-4 rounded-xl border border-white/5 focus:border-luxury-gold/50 focus:outline-none transition-all cursor-pointer font-semibold appearance-none"
                      >
                        <option value="" className="bg-luxury-black">{t("filter.status_all")}</option>
                        <option value="in_stock" className="bg-luxury-black">{t("filter.status_ready")}</option>
                        <option value="sold_out" className="bg-luxury-black">{t("filter.status_sold")}</option>
                      </select>
                    </div>
                  </div>

                  {/* Rentang Harga Minimum */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">{t("filter.min_price")}</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="number"
                        placeholder="Contoh: 5 Miliar"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full bg-white/[0.03] text-white text-xs pl-12 pr-4 py-4 rounded-xl border border-white/5 focus:border-luxury-gold/50 focus:outline-none transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Rentang Harga Maksimum */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">{t("filter.max_price")}</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="number"
                        placeholder="Contoh: 50 Miliar"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full bg-white/[0.03] text-white text-xs pl-12 pr-4 py-4 rounded-xl border border-white/5 focus:border-luxury-gold/50 focus:outline-none transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Arah Hadap */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">{t("filter.facing_label")}</label>
                    <div className="relative">
                      <Compass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <select
                        value={hadap}
                        onChange={(e) => setHadap(e.target.value)}
                        className="w-full bg-white/[0.03] text-white text-xs pl-12 pr-4 py-4 rounded-xl border border-white/5 focus:border-luxury-gold/50 focus:outline-none transition-all cursor-pointer font-semibold appearance-none"
                      >
                        <option value="" className="bg-luxury-black">{t("filter.facing_all")}</option>
                        <option value="Utara" className="bg-luxury-black">Utara</option>
                        <option value="Timur" className="bg-luxury-black">Timur</option>
                        <option value="Selatan" className="bg-luxury-black">Selatan</option>
                        <option value="Barat" className="bg-luxury-black">Barat</option>
                      </select>
                    </div>
                  </div>

                  {/* Carport */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">{t("filter.carport_label")}</label>
                    <div className="relative">
                      <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <select
                        value={carport}
                        onChange={(e) => setCarport(e.target.value)}
                        className="w-full bg-white/[0.03] text-white text-xs pl-12 pr-4 py-4 rounded-xl border border-white/5 focus:border-luxury-gold/50 focus:outline-none transition-all cursor-pointer font-semibold appearance-none"
                      >
                        <option value="" className="bg-luxury-black">{t("filter.carport_all")}</option>
                        <option value="ada" className="bg-luxury-black">{t("filter.carport_yes")}</option>
                        <option value="tidak_ada" className="bg-luxury-black">{t("filter.carport_no")}</option>
                      </select>
                    </div>
                  </div>

                  {/* Readiness */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">{t("filter.readiness_label")}</label>
                    <div className="relative">
                      <Layers3 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <select
                        value={siap}
                        onChange={(e) => setSiap(e.target.value)}
                        className="w-full bg-white/[0.03] text-white text-xs pl-12 pr-4 py-4 rounded-xl border border-white/5 focus:border-luxury-gold/50 focus:outline-none transition-all cursor-pointer font-semibold appearance-none"
                      >
                        <option value="" className="bg-luxury-black">{t("filter.readiness_all")}</option>
                        <option value="siap_huni" className="bg-luxury-black">{t("filter.readiness_ready")}</option>
                        <option value="siap_kosong" className="bg-luxury-black">{t("filter.readiness_process")}</option>
                        <option value="siap_huni_renovasi" className="bg-luxury-black">{t("filter.readiness_refurb")}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Section Header for Properties */}
        <div className="mt-24 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-luxury-gold" />
              <span className="text-[10px] font-black tracking-[0.3em] text-luxury-gold uppercase">{t("card.featured")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{t("card.curation")}</h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-gray-500 uppercase tracking-widest">
            <span className="text-white font-bold">{filteredProperties.length}</span> {t("card.found")}
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                }
              }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.03 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            {filteredProperties.map((prop) => (
              <motion.div
                key={prop.id}
                variants={{
                  hidden: { opacity: 0, y: 50, scale: 0.95 },
                  show: { 
                    opacity: 1, 
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                  }
                }}
                whileHover={{ y: -15 }}
                className="group relative flex flex-col h-[620px] rounded-[2.5rem] overflow-hidden bg-luxury-black border border-white/5 hover:border-luxury-gold/40 transition-all duration-700 shadow-2xl"
              >
                {/* Background Canvas */}
                <div className="absolute inset-0 z-0">
                  <ImageWithFallback
                    src={getPropertyImages(prop).exterior}
                    alt={prop.nama_property || prop.nama}
                    isVilla={prop.tipe === "Villa"}
                    propertyName={prop.nama_property || prop.nama}
                    propertyGroup={prop.group || ""}
                    className="group-hover:scale-110 transition-transform duration-[2s] brightness-[0.7] group-hover:brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-black/20 z-1" />
                </div>

                {/* Floating Branding & Status */}
                <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="px-5 py-2 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 text-[9px] font-black tracking-[0.3em] text-white uppercase">
                      {prop.tipe}
                    </span>
                  </div>

                  {/* Main Information Plate */}
                  <div className="space-y-8 translate-y-12 group-hover:translate-y-0 transition-transform duration-700">
                    <div className="space-y-3">
                      {prop.group && (
                        <span className="text-[10px] font-black tracking-[0.6em] text-luxury-gold uppercase block opacity-80 mb-1">
                          {prop.group}
                        </span>
                      )}
                      <h3 className="text-4xl font-black text-white tracking-tighter leading-[0.9] group-hover:metallic-gold transition-all duration-500">
                        {prop.nama_property || prop.nama}
                      </h3>
                      <div className="flex items-center space-x-2 text-gray-300 pt-2">
                        <MapPin className="w-4 h-4 text-luxury-gold" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{prop.kawasan}</span>
                      </div>
                    </div>

                    {/* Revealable Specs Table */}
                    <div className="grid grid-cols-2 gap-2 py-8 px-12 border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                      <div className="space-y-1 space-x-4">
                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em]">{t("card.land_area")}</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black text-white font-mono tracking-tighter">{prop.lebar * prop.panjang}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">M²</span>
                        </div>
                      </div>
                      <div className="space-y-1 border-l border-white/10 pl-8">
                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em]">{t("card.elevation")}</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black text-white tracking-tighter">{prop.tingkat}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">{t("card.levels")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Interaction Footer */}
                    <div className="flex items-center justify-between pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.5em] mb-1.5">{t("card.investment")}</span>
                        <span className="text-xl font-black text-white font-mono tracking-tighter">{formatRupiah(prop.price)}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedDetailProperty(prop);
                          setIsDetailModalOpen(true);
                        }}
                        className="px-8 py-4 bg-white text-black font-black text-[10px] tracking-[0.3em] uppercase rounded-xl shadow-2xl hover:bg-luxury-gold transition-all duration-300 cursor-pointer"
                      >
                        {t("card.explore")}
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Aesthetic Detail Lines */}
                <div className="absolute top-0 right-0 w-24 h-[1px] bg-luxury-gold/20" />
                <div className="absolute bottom-0 left-0 w-[1px] h-24 bg-luxury-gold/20" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="glass-panel text-center py-24 px-8 rounded-3xl border border-white/5 shadow-2xl">
            <Search className="w-12 h-12 text-gray-700 mx-auto mb-6" />
            <h3 className="text-white text-xl font-black tracking-tight">{t("card.not_found")}</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mt-3 font-medium">
              Parameter pencarian Anda terlalu spesifik. Silakan atur ulang filter untuk menemukan instrumen investasi lainnya.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-8 inline-flex items-center space-x-3 bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] px-8 py-4 rounded-xl shadow-2xl hover:bg-gray-200 transition-all cursor-pointer"
            >
              <span>{t("card.reset_btn")}</span>
            </button>
          </div>
        )}
      </div>

      {/* Public Property Detail Showcase Modal */}
      <PublicPropertyDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedDetailProperty(null);
        }}
        property={selectedDetailProperty}
      />
    </div>
  );
}
