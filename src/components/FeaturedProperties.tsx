/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, Compass, Grid, Layers, MapPin, Car, DollarSign, RefreshCw, Layers3, CheckCircle, Clock, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Property, PropertyType, PropertyStatus, CompassDirection } from "../types";
import PublicPropertyDetailModal, { getPropertyImages } from "./PublicPropertyDetailModal";
import ImageWithFallback from "./ImageWithFallback";

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
    }, 5000);
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

  return (
    <div className="w-full">
      {/* Hero Banner Section with Smooth Transitioning Property Background Slideshow */}
      <div className="relative py-24 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-luxury-gold/10 overflow-hidden flex items-center justify-center min-h-[460px]">
        {/* Slideshow backgrounds */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                idx === currentHeroIndex ? "opacity-35 scale-100" : "opacity-0 scale-105"
              } transform duration-[5000ms] pointer-events-none`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          {/* Subtle gradient layers for cinematic look & high contrast text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/75 to-black/50 z-1 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-luxury-black/95 z-1 pointer-events-none" />
        </div>

        {/* Hero Content (above slideshow) */}
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-luxury-gold/15 border border-luxury-gold/35 px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest text-luxury-gold uppercase gold-glow backdrop-blur-sm">
            <span>♛ PORTOFOLIO INVESTASI & AKUISISI ULTRA-LUKSU</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none drop-shadow-lg">
            Apresiasi Mahakarya Arsitektur <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold via-yellow-400 to-yellow-600">
              Modern & Luxury Elite
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
            Gerbang eksklusif kepemilikan Ruang Bisnis Komersial (Ruko) paling strategis serta Villa prestisius bersertifikasi hukum mutlak di kawasan episentrum pertumbuhan finansial Indonesia.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Real-time Filter Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-luxury-gold/20 shadow-xl gold-glow mb-12 animate-fade-in">
          {/* Flex header row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-luxury-gold/15 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Instrumen Filtrasi Aset Terintegrasi</h2>
              <p className="text-xs text-gray-400 mt-1">Konfigurasikan parameter filter di bawah untuk melakukan kurasi portofolio investasi Anda secara presisi</p>
            </div>
            
            {/* Control Cluster */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg border transition-all cursor-pointer ${
                  showAdvanced 
                    ? "bg-luxury-gold text-luxury-black border-luxury-gold" 
                    : "text-luxury-gold border-luxury-gold/30 hover:border-luxury-gold/60 bg-luxury-gold/5 hover:bg-luxury-gold/20"
                }`}
                id="btn-toggle-advanced"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filter Lanjutan</span>
                {showAdvanced ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
              </button>
              
              <button
                onClick={handleResetFilters}
                className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 py-2.5 rounded-lg transition-all cursor-pointer"
                id="btn-reset-filters"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Bersihkan</span>
              </button>
            </div>
          </div>

          {/* Core Simplified Filters (Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search Input */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Pencarian Unit Spesifik</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-luxury-gold" />
                <input
                  type="text"
                  placeholder="Masukkan nama komplek ruko, villa, kode blok..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-luxury-deep text-white text-sm pl-10 pr-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold focus:outline-none transition-all placeholder:text-gray-650 font-medium"
                  id="filter-search-input"
                />
              </div>
            </div>

            {/* Tipe Properti */}
            <div>
              <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Klasifikasi Aset</label>
              <div className="relative">
                <Grid className="absolute left-3.5 top-3.5 w-4 h-4 text-luxury-gold" />
                <select
                  value={tipe}
                  onChange={(e) => setTipe(e.target.value)}
                  className="w-full bg-luxury-deep text-white text-sm pl-10 pr-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold focus:outline-none transition-all cursor-pointer font-medium appearance-none"
                  id="filter-tipe-select"
                >
                  <option value="">Semua Goliaths (Ruko & Villa)</option>
                  <option value="Ruko">Ruko Komersial (High Yield)</option>
                  <option value="Villa">Villa Eksklusif (Luxurious Living)</option>
                </select>
              </div>
            </div>

            {/* Kawasan / Region Select */}
            <div>
              <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Kawasan</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-luxury-gold" />
                <select
                  value={kawasan}
                  onChange={(e) => setKawasan(e.target.value)}
                  className="w-full bg-luxury-deep text-white text-sm pl-10 pr-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold focus:outline-none transition-all cursor-pointer font-medium appearance-none"
                  id="filter-kawasan-select"
                >
                  <option value="">Semua Kawasan</option>
                  {availableKawasan.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Expandable Advanced Options (reveals smoothly when requested) */}
          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-luxury-gold/10 mt-6 animate-slide-down">
              {/* Status Properti */}
              <div>
                <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Status Properti</label>
                <div className="relative">
                  <Layers className="absolute left-3.5 top-3.5 w-4 h-4 text-luxury-gold" />
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-luxury-deep text-white text-sm pl-10 pr-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold focus:outline-none transition-all cursor-pointer font-medium appearance-none"
                    id="filter-status-select"
                  >
                    <option value="">Semua Status</option>
                    <option value="in_stock">Tersedia (In Stock)</option>
                    <option value="sold_out">Telah Terjual (Sold Out)</option>
                  </select>
                </div>
              </div>

              {/* Rentang Harga Minimum */}
              <div>
                <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Harga Minimum (Rp)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-3.5 w-4 h-4 text-luxury-gold" />
                  <input
                    type="number"
                    placeholder="Min (Contoh: 2 Miliar)"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-luxury-deep text-white text-sm pl-10 pr-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold focus:outline-none transition-all placeholder:text-gray-650 font-medium font-mono"
                    id="filter-minprice-input"
                  />
                </div>
              </div>

              {/* Rentang Harga Maksimum */}
              <div>
                <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Harga Maksimum (Rp)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-3.5 w-4 h-4 text-luxury-gold" />
                  <input
                    type="number"
                    placeholder="Max (Contoh: 15 Miliar)"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-luxury-deep text-white text-sm pl-10 pr-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold focus:outline-none transition-all placeholder:text-gray-650 font-medium font-mono"
                    id="filter-maxprice-input"
                  />
                </div>
              </div>

              {/* Arah Hadap */}
              <div>
                <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Arah Hadap</label>
                <div className="relative">
                  <Compass className="absolute left-3.5 top-3.5 w-4 h-4 text-luxury-gold" />
                  <select
                    value={hadap}
                    onChange={(e) => setHadap(e.target.value)}
                    className="w-full bg-luxury-deep text-white text-sm pl-10 pr-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold focus:outline-none transition-all cursor-pointer font-medium appearance-none"
                    id="filter-hadap-select"
                  >
                    <option value="">Semua Arah</option>
                    <option value="Utara">Hadap Utara</option>
                    <option value="Timur">Hadap Timur</option>
                    <option value="Selatan">Hadap Selatan</option>
                    <option value="Barat">Hadap Barat</option>
                  </select>
                </div>
              </div>

              {/* Carport */}
              <div>
                <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Kapasitas Carport / Garasi</label>
                <div className="relative">
                  <Car className="absolute left-3.5 top-3.5 w-4 h-4 text-luxury-gold" />
                  <select
                    value={carport}
                    onChange={(e) => setCarport(e.target.value)}
                    className="w-full bg-luxury-deep text-white text-sm pl-10 pr-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold focus:outline-none transition-all cursor-pointer font-medium appearance-none"
                    id="filter-carport-select"
                  >
                    <option value="">Semua Fasilitas</option>
                    <option value="ada">Kawasan dengan Carport</option>
                    <option value="tidak_ada">Kawasan tanpa Carport</option>
                  </select>
                </div>
              </div>

              {/* Readiness */}
              <div>
                <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Kesiapan Bangunan</label>
                <div className="relative">
                  <Layers3 className="absolute left-3.5 top-3.5 w-4 h-4 text-luxury-gold" />
                  <select
                    value={siap}
                    onChange={(e) => setSiap(e.target.value)}
                    className="w-full bg-luxury-deep text-white text-sm pl-10 pr-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold focus:outline-none transition-all cursor-pointer font-medium appearance-none"
                    id="filter-siap-select"
                  >
                    <option value="">Semua Kondisi</option>
                    <option value="siap_huni">Siap Huni (Ready)</option>
                    <option value="siap_kosong">Siap Kosong (Pembangunan)</option>
                    <option value="siap_huni_renovasi">Tahap Renovasi (Refurbished)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Listings Counter */}
        <div className="flex justify-between items-center mb-6 px-2 animate-fade-in">
          <div>
            <span className="text-sm text-gray-400">
              Menampilkan <span className="text-luxury-gold font-bold">{filteredProperties.length}</span> dari <span className="text-white font-semibold">{properties.filter(p => p.deleted_at === null).length}</span> pilihan properti aktif.
            </span>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((prop, index) => (
              <div
                key={prop.id}
                className="glass-panel rounded-xl overflow-hidden border border-luxury-gold/10 hover:border-luxury-gold/45 group transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col h-[525px] shadow-lg hover:shadow-luxury-gold/5"
                id={`property-card-${prop.id}`}
              >
                {/* Visual Header / Property Type Accent Card with Real Luxury Design Render */}
                <div className="relative h-44 border-b border-luxury-gold/10 flex flex-col justify-between p-6 overflow-hidden">
                  {/* Real-time high-end architectural exterior preview */}
                  <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                    <ImageWithFallback
                      src={getPropertyImages(prop).exterior}
                      alt={prop.nama_property || prop.nama}
                      isVilla={prop.tipe === "Villa"}
                      propertyName={prop.nama_property || prop.nama}
                      propertyGroup={prop.group || ""}
                    />
                  </div>
                  {/* Backdrop subtle dark-skew gloss overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/25 pointer-events-none"></div>
                  
                  {/* Premium Hover Light Sweep (Shine Effect) */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-10" />
                  
                  {/* Badges */}
                  <div className="flex justify-between items-center relative z-10 w-full">
                    <span className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-md ${
                      prop.tipe === "Villa" 
                        ? "bg-purple-950/80 text-purple-200 border border-purple-800/50 backdrop-blur-sm" 
                        : "bg-amber-950/80 text-amber-200 border border-amber-800/50 backdrop-blur-sm"
                    }`}>
                      {prop.tipe}
                    </span>
                    <span className={`px-2.5 py-0.5 text-[9px] font-bold font-mono tracking-wider rounded-full ${
                      prop.status === "in_stock"
                        ? "bg-green-950 text-green-300 border border-green-800/40"
                        : "bg-red-950/20 text-red-300 border border-red-950/30"
                    }`}>
                      {prop.status === "in_stock" ? "Tersedia" : "Terjual"}
                    </span>
                  </div>

                  {/* Large Icon Type representation inside luxury visual card */}
                  <div className="flex flex-col items-start relative z-10 mt-2">
                    {prop.group && (
                      <span className="text-[10px] font-mono tracking-widest text-[#C9A961] uppercase block mb-1 font-bold animate-pulse">
                        {prop.group}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-white tracking-tight line-clamp-1 group-hover:text-luxury-gold transition-colors duration-200">
                      {prop.nama_property || prop.nama}
                    </h3>
                  </div>
                </div>

                {/* Property Detail Parameters */}
                <div className="p-6 flex flex-col justify-between flex-1 bg-[#151515]/95">
                  <div className="space-y-4">
                    {/* Primary Location and Unit Info */}
                    <div className="flex items-center space-x-2 text-gray-400">
                      <MapPin className="w-4 h-4 text-luxury-gold flex-shrink-0" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-200">{prop.kawasan}</span>
                      {prop.unit && (
                        <>
                          <span className="text-gray-650 text-xs">•</span>
                          <span className="text-xs font-mono bg-luxury-gray-dark px-2 py-0.5 rounded text-gray-400 border border-gray-800">Unit: {prop.unit}</span>
                        </>
                      )}
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 pt-2 border-t border-luxury-gold/5">
                      {/* Dimensi */}
                      <div className="space-y-0.5">
                        <span className="block text-[10px] uppercase font-bold tracking-widest text-gray-500">DIMENSI LAHAN</span>
                        <span className="text-xs font-semibold text-white font-mono">
                          {prop.lebar} x {prop.panjang} M <span className="text-[10px] text-gray-400 font-sans font-light">({prop.lebar * prop.panjang} m²)</span>
                        </span>
                      </div>

                      {/* Arah Hadap */}
                      <div className="space-y-0.5">
                        <span className="block text-[10px] uppercase font-bold tracking-widest text-gray-500">ARAH HADAP</span>
                        <span className="text-xs font-semibold text-white flex items-center space-x-1.5 font-sans">
                          <Compass className="w-3.5 h-3.5 text-luxury-gold" />
                          <span>Hadap {Array.isArray(prop.hadap) ? prop.hadap.join(", ") : prop.hadap}</span>
                        </span>
                      </div>

                      {/* Lantai / Tingkat */}
                      <div className="space-y-0.5">
                        <span className="block text-[10px] uppercase font-bold tracking-widest text-gray-500">TINGKAT</span>
                        <span className="text-xs font-semibold text-white font-sans">
                          {prop.tingkat} Lantai
                        </span>
                      </div>

                      {/* Carport */}
                      <div className="space-y-0.5">
                        <span className="block text-[10px] uppercase font-bold tracking-widest text-gray-500">CARPORT</span>
                        <span className="text-xs font-semibold text-white flex items-center space-x-1.5 font-sans">
                          <Car className="w-3.5 h-3.5 text-luxury-gold" />
                          <span>{prop.carport ? "Ada Carport" : "Tanpa Carport"}</span>
                        </span>
                      </div>
                    </div>

                    {/* Ready state and Maps */}
                    <div className="flex items-center justify-between pt-3 border-t border-luxury-gold/5 text-xs">
                      <div className="flex items-center space-x-1.5 font-sans">
                        {prop.siap === "siap_huni" ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 font-medium">Siap Huni</span>
                          </>
                        ) : prop.siap === "siap_huni_renovasi" ? (
                          <>
                            <SlidersHorizontal className="w-4 h-4 text-orange-400 animate-pulse" />
                            <span className="text-orange-400 font-medium">Tahap Renovasi</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 text-yellow-500" />
                            <span className="text-yellow-500 font-medium">Siap Kosong</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pricing Footer with interactive design details toggle */}
                  <div className="mt-5 pt-4 border-t border-luxury-gold/15 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedDetailProperty(prop);
                        setIsDetailModalOpen(true);
                      }}
                      className="px-3.5 py-2.5 bg-luxury-gold/10 hover:bg-luxury-gold text-luxury-gold hover:text-luxury-black font-extrabold text-[10px] tracking-widest uppercase rounded-lg border border-luxury-gold/30 transition-all cursor-pointer shadow-sm hover:shadow-luxury-gold/20"
                      id={`btn-view-details-${prop.id}`}
                    >
                      Desain & Rincian
                    </button>
                    <div className="flex flex-col text-right">
                      <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">HARGA JUAL NETT</span>
                      <span className="text-base sm:text-lg font-black text-luxury-gold mt-0.5 font-mono">
                        {formatRupiah(prop.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel text-center py-16 px-6 rounded-2xl border border-luxury-gold/15 shadow-inner">
            <span className="text-4xl">🔍</span>
            <h3 className="text-white text-lg font-bold mt-4">Properti Tidak Ditemukan</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto mt-2">
              Tidak ada listing properti yang sesuai dengan parameter penyaringan Anda. Silakan coba mengubah jangkauan harga atau mencari kawasan lain.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 inline-flex items-center space-x-2 bg-luxury-gold text-luxury-black font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-md hover:bg-luxury-gold-hover transition-colors cursor-pointer"
            >
              <span>Atur Ulang Pencarian</span>
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
