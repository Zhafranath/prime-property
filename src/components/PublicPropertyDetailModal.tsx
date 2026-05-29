/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  X, Waves, ShieldCheck, Wifi, Cpu, Coins, Eye, Compass, 
  Sparkles, Check, Truck, Navigation, Train, Milestone, 
  Building2, ArrowRightLeft, FileCheck2, Info, MapPin, 
  Car, Layers, Ruler
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { Property } from "../types";
import { formatRupiah } from "./FeaturedProperties";
import ImageWithFallback from "./ImageWithFallback";

interface PublicPropertyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

// Map Unsplash images cleanly for each property
export function getPropertyImages(property: Property) {
  const isVilla = property.tipe === "Villa";
  const idNum = parseInt(property.id.replace("prop_", "")) || 1;

  // Extremely beautiful luxury villa images
  const villaImages = [
    {
      exterior: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
      interior: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
      blueprint: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80"
    },
    {
      exterior: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
      interior: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80",
      blueprint: "https://images.unsplash.com/photo-1504297050568-910d24c426d3?auto=format&fit=crop&w=800&q=80"
    },
    {
      exterior: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      interior: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      blueprint: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80"
    },
    {
      exterior: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      interior: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80",
      blueprint: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80"
    },
    {
      exterior: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
      interior: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      blueprint: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
    },
    {
      exterior: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      interior: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
      blueprint: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
    }
  ];

  // Verified sleek office/commercial store images
  const rukoImages = [
    {
      exterior: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
      interior: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      blueprint: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
    },
    {
      exterior: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=800&q=80",
      interior: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
      blueprint: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
    },
    {
      exterior: "https://images.unsplash.com/photo-1490237152597-8c4715f4e402?auto=format&fit=crop&w=800&q=80",
      interior: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=800&q=80",
      blueprint: "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?auto=format&fit=crop&w=800&q=80"
    },
    {
      exterior: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      interior: "https://images.unsplash.com/photo-1497215842964-222b430db214?auto=format&fit=crop&w=800&q=80",
      blueprint: "https://images.unsplash.com/photo-1503174971373-b1f69850bded?auto=format&fit=crop&w=800&q=80"
    },
    {
      exterior: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=800&q=80",
      interior: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=800&q=80",
      blueprint: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80"
    },
    {
      exterior: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
      interior: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
      blueprint: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
    }
  ];

  if (isVilla) {
    const index = (idNum - 1) % villaImages.length;
    return villaImages[index >= 0 ? index : 0];
  } else {
    const index = (idNum - 1) % rukoImages.length;
    return rukoImages[index >= 0 ? index : 0];
  }
}

export default function PublicPropertyDetailModal({ isOpen, onClose, property }: PublicPropertyDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"exterior" | "interior" | "blueprint">("exterior");
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab("exterior");
      if (backdropRef.current) backdropRef.current.scrollTop = 0;
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }
  }, [isOpen, property]);

  if (!isOpen || !property) return null;

  const isVilla = property.tipe === "Villa";
  const images = getPropertyImages(property);

  // Dynamic values based on type
  const designDetails = isVilla ? {
    exterior: {
      title: "Desain Eksterior: Tropical Modernism",
      desc: "Bangunan modern kontemporer yang diintegrasikan dengan lanskap tropis yang rimbun. Menggunakan panel kayu jati padat tahan cuaca, batu alam andesit bertekstur kasar, dan kaca temper ganda setinggi langit-langit (floor-to-ceiling double-glazed) untuk isolasi suhu dan suara maksimal.",
      highlights: ["Elevasi atap tinggi 4.2 Meter", "Sistem talang air flush tersembunyi", "Kanopi cantilever beton tanpa pilar penyangga"]
    },
    interior: {
      title: "Desain Interior: Haute-Couture Living Room",
      desc: "Tata ruang konsep terbuka (open-plan) yang luas dirancang demi kenyamanan elite. Dihiasi lantai marmer Carrara mewah asal Italia, panel dinding bertekstur suede hangat, pencahayaan LED tidak langsung melingkar, dan area dapur kering terintegrasi dengan countertop batu kuarsa murni.",
      highlights: ["Lantai Marmer Slab Besar asli Carrara", "Sistem Pendingin Daikin VRV otomatis tersembunyi", "Gagang Pintu kuningan custom buatan tangan"]
    },
    blueprint: {
      title: "Layout Struktur: Smart Functional Blueprint",
      desc: "Pembagian zona ruangan yang ideal antara area sosial publik di lantai dasar dan ruang privasi suite mewah di lantai atas. Blueprint dirancang untuk menahan guncangan gempa bermagnitudo tinggi lengkap dengan ruang utilitas bawah tanah tersembunyi.",
      highlights: ["Keamanan Pintu Utama Sidik Jari 3D", "Sistem Tata Udara Aliran Silang Aktif", "Instalasi Pengkabelan CAT-8 Kecepatan Gigalan"]
    }
  } : {
    exterior: {
      title: "Desain Arsitektur: High-Exposure Business Facade",
      desc: "Fasad komersial moderen dengan desain transparan pilar minimal yang memberikan porsi exposure kaca hingga 95% untuk efektivitas etalase promosi bisnis Anda. Konstruksi dilapisi aluminium panel komposit (ACP) tahan karat berlisensi PVDF jaminan tahan warna 15 tahun.",
      highlights: ["Kaca Tempered Frameless Modular", "Fasilitas pasang neon box dengan daya beban struktur standar", "Tangga akses depan lapang dengan batu granit anti slip"]
    },
    interior: {
      title: "Desain Interior: SOHO & Executive Office Loft",
      desc: "Sistem interior luwes yang mendukung fleksibilitas operasional bisnis modern baik ritel bervolume tinggi, lounge bisnis, maupun ruang kerja dinamis. Dilengkapi ketinggian void ganda (double-height ceiling) 6 meter pada lantai dasar dan tangga lingkar baja minimalis.",
      highlights: ["Lantai Terrazzo Polished Premium anti noda", "Peralatan Sanitasi Grohe & Toto Eco-washer", "Void Lobby Utama 6 Meter ideal untuk mezzanine"]
    },
    blueprint: {
      title: "Akses & Tata Letak: Logistic Optimization Blueprint",
      desc: "Konfigurasi ruko berorientasi kemudahan logistik dengan akses loading dock khusus di bagian belakang bangunan agar tidak mengganggu parkir pelanggan utama di area depan ruko.",
      highlights: ["Pintu Rolling Shutter otomatis tugas berat", "Jalur pembuangan udara dapur khusus (exhaust shaft)", "Struktur pondasi beton bertulang sanggup beban komersial"]
    }
  };

  const facilities = isVilla ? [
    { title: "Kolam Renang Infinity", desc: "Private pool jernih dengan pemandangan terbuka eksklusif.", icon: Waves },
    { title: "One-Gate Smart Security", desc: "Sistem keamanan biometrik & RFID 24 jam patroli aktif.", icon: ShieldCheck },
    { title: "Fiber-Optic Gigabit Wifi", desc: "Koneksi internet serat optik handal untuk semua sudut ruangan.", icon: Wifi },
    { title: "Automated Smart Home", desc: "Kontrol pencahayaan, tirai, AC dari layar perangkat genggam.", icon: Cpu },
    { title: "Genset Backup Otomatis", desc: "Transisi listrik darurat senap tanpa kedip 12.000 VA.", icon: Milestone },
    { title: "Lantai Marmer Italia Utama", desc: "Hasil karya batuan alam pilihan nan sejuk tiada tanding.", icon: Sparkles }
  ] : [
    { title: "Void Lobby Tinggi Ganda", desc: "Ketinggian atap 6 meter lantai dasar yang elegan & prestisius.", icon: Building2 },
    { title: "Keamanan Smart Locks & CCTV", desc: "Sistem enkripsi kunci elektronik dan pantauan kamera terintegrasi.", icon: ShieldCheck },
    { title: "Daya Serat Optik Enterprise", desc: "Jaringan data internet pita ultra-lebar khusus perkantoran.", icon: Wifi },
    { title: "Teras Atap Outdoor Lounge", desc: "Gaya ruko dengan roof deck terbuka untuk kafe atau melepas penat.", icon: Layers },
    { title: "Akses Loading Dock Belakang", desc: "Lajur terpisah bongkar barang tanpa menghalangi estalase depan.", icon: Truck },
    { title: "Instalasi Exhaust Terpisah", desc: "Saluran buang asap dapur vertikal aman bebas bau.", icon: WindIndicator }
  ];

  const advantages = isVilla ? [
    { title: "Sangat Dekat Pintu Gerbang Tol Utama", desc: "Hanya perlu 8 menit berkendara menuju gerbang tol bypass, menghubungkan Anda ke pusat kota metropoltan atau bandara dalam waktu singkat.", icon: Milestone },
    { title: "Kawasan Keamanan Elit Terpadu", desc: "Kompleks residensial privat dengan pengamanan berlapis ganda, bebas kebisingan jalan besar, sangat tenang dan menyejukkan hati.", icon: ShieldCheck },
    { title: "Struktur Bebas Banjir Permanen", desc: "Sistem peresapan air tanah mandiri dengan biopori dalam dan ketinggian tanah lahan 1.5 meter di atas level jalan umum.", icon: Ruler },
    { title: "Nilai ROI & Yield Sewa Fantastis", desc: "Rata-rata kenaikan harga aset properti (capital gain) di kawasan ini stabil di angka 12% - 15% per tahun dengan pasar sewa asing melimpah.", icon: Coins }
  ] : [
    { title: "Lokasi Strategis di Tepi Jalan Lingkar Tol", desc: "Tepat di sebelah simpang susun jalan gerbang tol niaga utama, ideal untuk kelancaran jalur distribusi logistik nasional maupun kantor representatif.", icon: Milestone },
    { title: "Aksesibilitas Kereta Cepat & Transit", desc: "Dapat dijangkau hanya 10 menit dari stasiun MRT/LRT commuter utama, menarik trafik talenta terbaik dan pelanggan.", icon: Train },
    { title: "Kawasan Bebas Banjir Terjamin", desc: "Berlokasi di masterplan bisnis terpadu berkelas internasional dengan instalasi gorong-gorong underpass saluran bawah tanah raksasa.", icon: Ruler },
    { title: "Sentra Bisnis Bervolume Tinggi", desc: "Dikelilingi puluhan brand multinasional, kawasan padat mahasiswa super-sibuk, menjamin rasio ROI investasi balik modal cepat.", icon: Coins }
  ];

  // Helper Custom Wind Icon
  function WindIndicator(props: any) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M12.8 19s2 0 2-1.3c0-1.2-1-2.2-2.2-2.2H2" />
        <path d="M11 4.8C11 3.8 11.8 3 12.8 3c1.3 0 2.3 1.1 2.3 2.4c0 1.4-1.1 2.4-2.3 2.4H2" />
        <path d="M20 12c.5 0 .9-.4.9-1s-.4-1-.9-1H2" />
      </svg>
    );
  }

  const handleContactAnchor = () => {
    onClose();
    // Smooth scroll down to contact section
    const contactSection = document.getElementById("contact-section");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return createPortal(
    <div ref={backdropRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-luxury-black rounded-2xl border border-luxury-gold/30 gold-glow-strong overflow-hidden my-6 max-h-[92vh] flex flex-col animate-scale-up" id="public-property-modal">
        {/* Header bar */}
        <div className="flex items-center justify-between p-5 border-b border-luxury-gold/15 bg-gradient-to-r from-neutral-900 via-luxury-deep to-luxury-black relative z-10 select-none">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-luxury-gold uppercase block mb-0.5">SPESIFIKASI UNIT &amp; CONTOH DESAIN</span>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">{property.nama_property || property.nama}</h3>
              <span className={`px-2 py-0.5 text-[8px] font-bold font-mono tracking-wider rounded ${
                property.tipe === "Villa" ? "bg-purple-950 text-purple-200 border border-purple-800" : "bg-amber-950 text-amber-200 border border-amber-800"
              }`}>
                {property.tipe}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            id="btn-close-public-detail"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content frame */}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-10 bg-[#0f0f10]">
          
          {/* Main design panels and images container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Architectural Example Designs with Image tabs */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-luxury-gold animate-pulse" />
                  <span>CONTOH ARSITEKTUR & PILIHAN DESAIN</span>
                </h4>
                <span className="text-[10px] bg-luxury-gold/5 border border-luxury-gold/20 text-luxury-gold px-2 py-0.5 rounded font-bold font-mono">
                  Brosur Model Terakreditasi
                </span>
              </div>

              {/* Design Image Frame */}
              <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden border border-luxury-gold/15 bg-neutral-900 group">
                <ImageWithFallback
                  src={images[activeTab]}
                  alt="Desain Visual Properti"
                  isVilla={property.tipe === "Villa"}
                  propertyName={property.nama_property || property.nama}
                  propertyGroup={property.group || ""}
                  className="group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>
                
                {/* Overlay text detail block */}
                <div className="absolute bottom-0 inset-x-0 p-4 space-y-1 relative z-10">
                  <span className="text-[10px] font-mono font-bold text-luxury-gold tracking-widest uppercase bg-luxury-black/60 px-2.5 py-1 rounded w-max block border border-luxury-gold/20">
                    {activeTab === "exterior" ? "Eksterior Modern" : activeTab === "interior" ? "Interior Pilihan" : "Skema Blueprint"}
                  </span>
                  <p className="text-xs text-white font-bold tracking-tight drop-shadow-sm line-clamp-1 mt-1">
                    {designDetails[activeTab].title}
                  </p>
                </div>
              </div>

              {/* Tabs navigation buttons */}
              <div className="grid grid-cols-3 gap-2">
                {(["exterior", "interior", "blueprint"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase border rounded-lg transition-all cursor-pointer ${
                      activeTab === tab 
                        ? "bg-luxury-gold text-luxury-black border-luxury-gold shadow-md shadow-luxury-gold/5" 
                        : "bg-luxury-deep text-gray-400 border-luxury-gold/10 hover:border-luxury-gold/30 hover:text-white"
                    }`}
                  >
                    {tab === "exterior" ? "Eksterior" : tab === "interior" ? "Interior" : "Cetak Biru / Layout"}
                  </button>
                ))}
              </div>

              {/* Detail desc explaining options */}
              <div className="p-4 bg-luxury-black rounded-xl border border-luxury-gold/5 space-y-3.5">
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  {designDetails[activeTab].desc}
                </p>
                
                {/* Specific bullets highlights */}
                <div className="space-y-1.5 pt-2 border-t border-luxury-gold/5">
                  {designDetails[activeTab].highlights.map((hlt, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-gray-400">
                      <Check className="w-3.5 h-3.5 text-luxury-gold mt-0.5 flex-shrink-0" />
                      <span className="font-medium">{hlt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Physical Specs & Price Tag */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121213] to-neutral-900 border border-luxury-gold/15 relative">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#C9A96103_1px,transparent_1px),linear-gradient(to_bottom,#C9A96103_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <MapPin className="w-4 h-4 text-luxury-gold" />
                      <span className="font-bold text-gray-200 uppercase tracking-widest">{property.kawasan}</span>
                      <span>•</span>
                      <span className="font-mono bg-luxury-deep px-2 py-0.5 rounded border border-gray-800 text-gray-300 font-semibold uppercase">ID: {property.unit}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-3 border-y border-luxury-gold/10">
                      {/* Dimensi */}
                      <div className="flex gap-2.5 items-center">
                        <div className="w-8 h-8 rounded-lg bg-luxury-gold/5 border border-luxury-gold/15 flex items-center justify-center text-luxury-gold flex-shrink-0">
                          <Ruler className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold">DIMENSI LAHAN</span>
                          <span className="text-xs font-bold text-white font-mono">{property.lebar} x {property.panjang} M <span className="text-[10px] text-gray-400 font-sans font-light">({property.lebar * property.panjang}m²)</span></span>
                        </div>
                      </div>

                      {/* Tingkat */}
                      <div className="flex gap-2.5 items-center">
                        <div className="w-8 h-8 rounded-lg bg-luxury-gold/5 border border-luxury-gold/15 flex items-center justify-center text-luxury-gold flex-shrink-0">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold">TOTAL TINGKAT</span>
                          <span className="text-xs font-bold text-white">{property.tingkat} Tingkat Lantai</span>
                        </div>
                      </div>

                      {/* Direction */}
                      <div className="flex gap-2.5 items-center">
                        <div className="w-8 h-8 rounded-lg bg-luxury-gold/5 border border-luxury-gold/15 flex items-center justify-center text-luxury-gold flex-shrink-0">
                          <Compass className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold">ARAH HADAP UNIT</span>
                          <span className="text-xs font-bold text-white flex items-center gap-1">Hadap {Array.isArray(property.hadap) ? property.hadap.join(", ") : property.hadap}</span>
                        </div>
                      </div>

                      {/* Carport */}
                      <div className="flex gap-2.5 items-center">
                        <div className="w-8 h-8 rounded-lg bg-luxury-gold/5 border border-luxury-gold/15 flex items-center justify-center text-luxury-gold flex-shrink-0">
                          <Car className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold">GARASI / CARPORT</span>
                          <span className="text-xs font-bold text-white">{property.carport ? "Ada Carport" : "Tanpa Carport"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-300 pt-1">
                      <span className="flex items-center gap-1.5 font-medium">
                        Kondisi: {property.siap === "siap_huni" ? (
                          <span className="text-green-400 font-bold">✓ Siap Huni (Ready Unit)</span>
                        ) : property.siap === "siap_huni_renovasi" ? (
                          <span className="text-orange-400 font-bold">✓ Tahap Renovasi (Refurbished)</span>
                        ) : (
                          <span className="text-yellow-500 font-bold">⏳ Siap Kosong / Pembangunan</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Golden Net Frame */}
                  <div className="mt-6 p-4 bg-luxury-gold/5 border border-luxury-gold/30 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="block text-[8px] uppercase font-mono tracking-widest text-[#C9A961] font-bold">PROYEKSI HARGA NETT</span>
                      <span className="text-[10px] text-gray-400 font-light block">Bebas Pajak Pemeliharaan &amp; Administrasi Awal</span>
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-luxury-gold tracking-tight font-mono">
                      {formatRupiah(property.price)}
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Modal footer view */}
        <div className="flex items-center justify-between p-4.5 border-t border-luxury-gold/15 bg-gradient-to-r from-neutral-900 to-luxury-black relative z-10 select-none">
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-gray-500 font-mono">
            <Info className="w-3.5 h-3.5 text-gray-600" />
            <span>Pemberdayaan resmi PT Graha Prima Propertindo</span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-luxury-gray-dark hover:bg-zinc-805 text-gray-350 rounded-lg text-xs font-bold cursor-pointer border border-gray-750 text-center"
            >
              Tutup Rincian
            </button>
            <button
              onClick={handleContactAnchor}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-luxury-gold hover:bg-luxury-gold-hover text-luxury-black font-extrabold uppercase text-xs tracking-wider rounded-lg transition-colors cursor-pointer text-center"
            >
              Hubungi Broker
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
