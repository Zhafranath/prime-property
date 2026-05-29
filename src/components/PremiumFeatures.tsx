import { useState } from "react";
import { 
  Waves, ShieldCheck, Wifi, Cpu, Coins, 
  Sparkles, Truck, Train, Milestone, 
  Building2, Layers, Ruler, Wind, ArrowRight,
  TrendingUp, Compass, Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function PremiumFeatures() {
  const [activeTab, setActiveTab] = useState<"villa" | "ruko">("villa");

  const villaFacilities = [
    { title: "Kolam Renang Infinity", desc: "Private pool jernih dengan pemandangan terbuka eksklusif.", icon: Waves, highlight: true },
    { title: "One-Gate Smart Security", desc: "Sistem keamanan biometrik & RFID 24 jam patroli aktif.", icon: ShieldCheck, highlight: false },
    { title: "Fiber-Optic Gigabit Wi-Fi", desc: "Koneksi internet serat optik handal di setiap sudut ruang.", icon: Wifi, highlight: false },
    { title: "Automated Smart Home", desc: "Kontrol pencahayaan, tirai, AC dari layar perangkat genggam.", icon: Cpu, highlight: true },
    { title: "Genset Backup Otomatis", desc: "Transisi listrik darurat senyap tanpa kedip 12.000 VA.", icon: Milestone, highlight: false },
    { title: "Lantai Marmer Italia Utama", desc: "Hasil karya batuan alam pilihan nan sejuk tiada tanding.", icon: Sparkles, highlight: false }
  ];

  const rukoFacilities = [
    { title: "Void Lobby Tinggi Ganda", desc: "Ketinggian atap 6 meter lantai dasar yang elegan & prestisius.", icon: Building2, highlight: true },
    { title: "Keamanan Smart Locks & CCTV", desc: "Sistem enkripsi kunci elektronik dan pantauan kamera terintegrasi.", icon: ShieldCheck, highlight: false },
    { title: "Daya Serat Optik Enterprise", desc: "Jaringan data internet pita ultra-lebar khusus perkantoran.", icon: Wifi, highlight: false },
    { title: "Teras Atap Outdoor Lounge", desc: "Gaya ruko dengan roof deck terbuka untuk kafe atau lounge santai.", icon: Layers, highlight: true },
    { title: "Akses Loading Dock Belakang", desc: "Lajur terpisah bongkar barang tanpa menghalangi etalase depan.", icon: Truck, highlight: false },
    { title: "Instalasi Exhaust Terpisah", desc: "Saluran buang asap dapur vertikal aman bebas bau.", icon: Wind, highlight: false }
  ];

  const villaAdvantages = [
    { 
      no: "01",
      title: "Konektivitas Tol Utama Bandara", 
      desc: "Hanya perlu 8 menit berkendara menuju gerbang tol bypass, menghubungkan Anda ke pusat kota metropolitan atau bandara internasional dalam waktu singkat.",
      tag: "8 MENIT KENDARA"
    },
    { 
      no: "02",
      title: "Kawasan Elit Terpadu & Sunyi", 
      desc: "Kompleks residensial privat dengan pengamanan berlapis ganda, bebas kebisingan jalan besar, sangat tenang, sejuk, dan dikelilingi alam asri.",
      tag: "HIGH PRIVACY"
    },
    { 
      no: "03",
      title: "Drainase Anti-Banjir Permanen", 
      desc: "Sistem peresapan air tanah mandiri dengan lubang biopori dalam serta peninggian level fondasi lahan setinggi 1.5 meter di atas jalan umum.",
      tag: "SECURE TERRAIN"
    },
    { 
      no: "04",
      title: "Yield & Nilai ROI Menjanjikan", 
      desc: "Rata-rata kenaikan harga aset properti (capital gain) di kawasan prima ini stabil di angka 12% - 15% per tahun dengan ceruk pasar sewa ekspatriat melimpah.",
      tag: "PROYEKSI 15% ROI"
    }
  ];

  const rukoAdvantages = [
    { 
      no: "01",
      title: "Berdiri di Sisi Jalan Lingkar Tol", 
      desc: "Berlokasi tepat di lajur komersial simpang susun jalan gerbang tol niaga utama, ideal untuk kelancaran jalur distribusi logistik dan eksposur brand.",
      tag: "SIMPANG SUSUN NIAGA"
    },
    { 
      no: "02",
      title: "Interkoneksi Kereta Cepat Transit", 
      desc: "Dapat dijangkau hanya 10 menit dari stasiun MRT/LRT commuter utama, menarik trafik talenta kerja terbaik dan ribuan calon konsumen harian.",
      tag: "10-MIN ACCESS MRT"
    },
    { 
      no: "03",
      title: "Masterplan Bebas Banjir Terjamin", 
      desc: "Pembangunan di atas kawasan bisnis terintegrasi bersertifikasi internasional dengan gorong-gorong raksasa di bawah lajur jalan utama.",
      tag: "ZERO RUNOFF SYSTEM"
    },
    { 
      no: "04",
      title: "Sentra Bisnis Trafik Padat", 
      desc: "Bersebelahan dengan puluhan brand ritel multinasional dan residensial padat, menjamin rasio kunjungan harian maksimal untuk profitabilitas cepat.",
      tag: "HIGH TRAFFIC HUB"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16, filter: "blur(2px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const activeFacilities = activeTab === "villa" ? villaFacilities : rukoFacilities;
  const activeAdvantages = activeTab === "villa" ? villaAdvantages : rukoAdvantages;

  return (
    <div className="relative py-24 bg-gradient-to-b from-luxury-black via-[#0a0a0b] to-luxury-black border-t border-luxury-gold/15 select-none overflow-hidden" id="premium-features-section">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#C9A96103_1px,transparent_1px),linear-gradient(to_bottom,#C9A96103_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none"></div>
      <div className="absolute -left-[10%] top-[20%] w-[400px] h-[400px] rounded-full bg-luxury-gold/3 blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute -right-[15%] bottom-[10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/2 blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Modern Centered Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-luxury-gold/5 border border-luxury-gold/20 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
            <span className="text-[10px] font-bold tracking-[0.25em] text-luxury-gold uppercase">
              MASTERPLAN & SPESIFIKASI UNGGULAN
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-none">
            Kemewahan Fasilitas & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold via-[#e3c485] to-luxury-gold">
              Keuntungan Investasi Strategis
            </span>
          </h2>
          <p className="text-gray-400 font-light text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Kurasi fasilitas privat premium kelas wahid beserta nilai tambah lokasi emas yang memastikan kenyamanan terbaik dan apresiasi nilai investasi Anda.
          </p>
        </div>

        {/* Gorgeous Rounded Tab Selector */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-neutral-900 border border-luxury-gold/15 p-1 rounded-full shadow-2xl backdrop-blur-xl relative">
            <button
              onClick={() => setActiveTab("villa")}
              className={`relative px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer ${
                activeTab === "villa" ? "text-luxury-black" : "text-gray-400 hover:text-white"
              }`}
            >
              {activeTab === "villa" && (
                <motion.span 
                  layoutId="premiumLayoutTab"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 bg-gradient-to-r from-luxury-gold to-yellow-500 rounded-full shadow-[0_2px_15px_rgba(201,169,97,0.35)]"
                />
              )}
              <span className="relative z-10">VILLA RESIDENSIAL</span>
            </button>

            <button
              onClick={() => setActiveTab("ruko")}
              className={`relative px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer ${
                activeTab === "ruko" ? "text-luxury-black" : "text-gray-400 hover:text-white"
              }`}
            >
              {activeTab === "ruko" && (
                <motion.span 
                  layoutId="premiumLayoutTab"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 bg-gradient-to-r from-luxury-gold to-yellow-500 rounded-full shadow-[0_2px_15px_rgba(201,169,97,0.35)]"
                />
              )}
              <span className="relative z-10">RUKO KOMERSIAL</span>
            </button>
          </div>
        </div>

        {/* Side-by-Side Adaptive Grid (Masterful Layout Split) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch"
          >
            {/* LEFT SIDE: Value Advantages & Location Accessibility (Horizontal Grid Pipelines) */}
            <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono tracking-widest text-luxury-gold uppercase px-2 py-0.5 rounded bg-luxury-gold/5 border border-luxury-gold/30">
                    BENEFIT ANALYSIS
                  </span>
                  <h3 className="text-lg font-bold text-white uppercase tracking-widest">
                    AKSESIBILITAS &amp; NILAI INVESTASI
                  </h3>
                </div>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  Lokasi properti kami dipilih secara spesifik berdasarkan riset mikro-geografis guna menjamin pertumbuhan nilai valuasi tanah yang eksponensial.
                </p>
              </div>

              {/* Numbered Pipeline Lists */}
              <div className="space-y-5 flex-1 mt-6">
                {activeAdvantages.map((adv, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="group relative p-4 rounded-xl border border-luxury-gold/5 bg-gradient-to-r from-[#121213] to-neutral-900/60 hover:border-luxury-gold/25 transition-all duration-300 flex gap-4 items-start"
                  >
                    <div className="w-10 h-10 rounded-lg bg-neutral-950 border border-luxury-gold/15 flex items-center justify-center font-mono text-xs font-black text-luxury-gold flex-shrink-0 group-hover:bg-luxury-gold group-hover:text-luxury-black transition-all duration-300 shadow-[inset_0_1px_3px_rgba(255,255,255,0.05)]">
                      {adv.no}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wide group-hover:text-luxury-gold transition-colors duration-200">
                          {adv.title}
                        </h4>
                        <span className="text-[8px] font-black tracking-widest bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20 px-1.5 py-0.5 rounded uppercase font-mono">
                          {adv.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                        {adv.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Minimal Trust Badge */}
              <div className="mt-4 p-4 rounded-xl border border-white/[0.03] bg-neutral-900/30 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <p className="text-[10px] text-gray-400 leading-normal font-light">
                  Aset ini memiliki jaminan legalitas penuh dengan SHM per unit siap balik nama di bawah supervisi tim legal internal kami.
                </p>
              </div>
            </div>

            {/* RIGHT SIDE: Indulgent Premium Facilities (Bento Box Concept) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono tracking-widest text-luxury-gold uppercase px-2 py-0.5 rounded bg-luxury-gold/5 border border-luxury-gold/30">
                  PREMIUM SPECIFICATIONS
                </span>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest">
                  FASILITAS INTERNAL INTERNAL
                </h3>
              </div>

              {/* Asymmetrical Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeFacilities.map((fac, idx) => {
                  const Icon = fac.icon;
                  return (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ y: -3 }}
                      className={`group relative p-6 rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                        fac.highlight 
                          ? "bg-gradient-to-b from-[#161618] to-luxury-deep border-luxury-gold/25 col-span-1 md:col-span-2 shadow-[0_10px_30px_rgba(201,169,97,0.04)]" 
                          : "bg-luxury-deep border-white/[0.03] hover:border-luxury-gold/20"
                      }`}
                    >
                      {/* Floating Accent Ring inside highlighted items */}
                      {fac.highlight && (
                        <div className="absolute -right-10 -top-10 w-24 h-24 rounded-full bg-luxury-gold/5 border border-luxury-gold/10 pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
                      )}

                      <div className="space-y-4">
                        {/* Header icon block */}
                        <div className="flex items-center justify-between">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                            fac.highlight
                              ? "bg-luxury-gold text-luxury-black shadow-[0_4px_12px_rgba(201,169,97,0.3)]"
                              : "bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20"
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>

                          {/* Pulsing indicator/dots */}
                          <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <span className={`w-1.5 h-1.5 rounded-full ${fac.highlight ? 'bg-luxury-gold animate-ping' : 'bg-gray-600'}`}></span>
                            <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">CLASS-A</span>
                          </div>
                        </div>

                        {/* Title and Short description */}
                        <div className="space-y-2">
                          <h4 className={`text-sm font-bold uppercase tracking-wide flex items-center gap-2 ${fac.highlight ? "text-luxury-gold" : "text-white"}`}>
                            {fac.title}
                            {fac.highlight && <span className="text-[9px] bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30 px-1.5 py-0.5 rounded-full lowercase font-mono">featured</span>}
                          </h4>
                          <p className="text-xs text-gray-400 font-light leading-relaxed">
                            {fac.desc}
                          </p>
                        </div>
                      </div>

                      {/* Micro-detail highlight vector arrow */}
                      <div className="pt-4 mt-4 border-t border-white/[0.04] flex items-center justify-between text-gray-500 group-hover:text-luxury-gold transition-colors">
                        <span className="text-[9px] font-mono tracking-widest uppercase font-bold">Standardized Luxury</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-350" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
