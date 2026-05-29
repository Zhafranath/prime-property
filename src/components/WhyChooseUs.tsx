import { Shield, TrendingUp, Sparkles, UserCheck, Check } from "lucide-react";
import { motion } from "motion/react";

export default function WhyChooseUs() {
  const highlights = [
    {
      id: "advantage-legal",
      icon: Shield,
      title: "Jaminan Legalitas Mutlak",
      badge: "Sertifikasi Bersih",
      desc: "Semua properti dalam kurasi kami telah lolos verifikasi hukum berlapis. Bebas dari sengketa, bersertifikat aman, serta siap dialihkan hak miliknya tanpa kendala administrasi.",
      color: "from-amber-500/10 to-transparent",
    },
    {
      id: "advantage-yield",
      icon: TrendingUp,
      title: "Yield & Potensi Investasi Tertinggi",
      badge: "Komersial Unggul",
      desc: "Lini ruko komersial kami diposisikan strategis di pusat sentra lalu lintas komersial nasional berdensitas tinggi, memberikan garansi passive income dan capital gain eksponensial.",
      color: "from-yellow-500/10 to-transparent",
    },
    {
      id: "advantage-luxury",
      icon: Sparkles,
      title: "Standar Arsitektur Kelas Dunia",
      badge: "Desain Premium",
      desc: "Setiap villa dirancang eksklusif oleh arsitek ternama dengan material terpilih, menghadirkan estetika resor mewah bintang lima yang memadukan kenyamanan dan privasi ultimatif.",
      color: "from-yellow-400/10 to-transparent",
    },
    {
      id: "advantage-advisor",
      icon: UserCheck,
      title: "Private Advisors Berlisensi Resmi",
      badge: "Layanan Privat",
      desc: "Dukungan penuh oleh tim Wealth Advisors berlisensi nasional yang mengedepankan integritas tinggi, kenyamanan privasi, serta mengawal proses akuisisi aset bernilai tinggi Anda.",
      color: "from-amber-400/10 to-transparent",
    },
  ];

  const valStats = [
    { id: "stat-1", value: "100%", label: "Legalitas Terverifikasi" },
    { id: "stat-2", value: "24/7", label: "Pendampingan Advisory Privat" },
    { id: "stat-3", value: "0%", label: "Sengketa / Masalah Hukum" },
    { id: "stat-4", value: "15T+", label: "Total Nilai Portofolio Aset" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="relative py-20 overflow-hidden bg-gradient-to-b from-[#09090a] via-[#0d0d0f] to-[#0a0a0b] border-t border-luxury-gold/10">
      {/* Background design accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#C9A96103_1px,transparent_1px),linear-gradient(to_bottom,#C9A96103_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        {/* Header Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <motion.span
            variants={itemVariants}
            className="text-[10px] font-bold tracking-[0.25em] text-luxury-gold uppercase inline-block bg-luxury-gold/5 border border-luxury-gold/20 px-3 py-1.5 rounded-full gold-glow"
          >
            ✦ INVESTASI PRESTISIUS TANPA RISIKO
          </motion.span>
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            Kenapa Harus <span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold to-yellow-500 font-extrabold">Prime Property?</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-gray-400 font-light text-sm sm:text-base leading-relaxed"
          >
            Kami melampaui standar mediator biasa dengan menghadirkan ekosistem investasi terpadu yang aman, transparan, dan berkelas dunia demi masa depan kemakmuran Anda.
          </motion.p>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                id={item.id}
                variants={itemVariants}
                whileHover={{ y: -6, borderColor: "rgba(201, 169, 97, 0.4)" }}
                className="group relative bg-[#131315]/80 backdrop-blur-md rounded-2xl border border-luxury-gold/10 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-xl overflow-hidden"
              >
                {/* Sparkle Sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                
                {/* Abstract light spill */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-b ${item.color} blur-2xl opacity-60 pointer-events-none group-hover:scale-125 transition-transform duration-500`}></div>

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-luxury-gold/10 border border-luxury-gold/25 rounded-xl flex items-center justify-center text-luxury-gold group-hover:scale-110 group-hover:bg-luxury-gold/20 transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-luxury-gold/5 border border-luxury-gold/20 text-luxury-gold rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-luxury-gold transition-colors block">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Micro checklist decorative */}
                <div className="flex items-center space-x-2 pt-6 border-t border-white/[0.04] mt-6 relative z-10">
                  <span className="w-4 h-4 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-luxury-gold" />
                  </span>
                  <span className="text-[10px] font-mono tracking-wider font-semibold text-gray-400 uppercase">
                    Terakreditasi Penuh &amp; Sah
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section with glass aesthetics */}
        <motion.div
          variants={itemVariants}
          className="relative bg-gradient-to-r from-zinc-950 to-neutral-900 border border-luxury-gold/15 rounded-2xl p-8 sm:p-10 shadow-2xl overflow-hidden"
        >
          {/* Accent light grids */}
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/5 via-transparent to-transparent opacity-70"></div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 max-w-6xl mx-auto text-center divide-y lg:divide-y-0 lg:divide-x divide-luxury-gold/10">
            {valStats.map((stat, idx) => (
              <div
                key={stat.id}
                id={stat.id}
                className={`flex flex-col justify-center ${idx >= 2 ? "pt-6 lg:pt-0" : ""} ${idx < 2 ? "pb-6 lg:pb-0" : ""}`}
              >
                <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-luxury-gold via-yellow-400 to-yellow-600 font-mono tracking-tight block">
                  {stat.value}
                </span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-2 block">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
