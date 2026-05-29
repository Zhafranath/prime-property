/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, Award, Compass, Gem, Lock, Briefcase, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export default function AboutUs() {
  const brandAssurances = [
    {
      title: "Verifikasi Legalitas 7 Lapis (Zero-Risk Guarantee)",
      desc: "Setiap aset komersial maupun pribadi yang tercantum dalam instrumen Prime Property telah melewati audit legalitas berlapis, sertifikat bebas sengketa agraria, serta verifikasi tata kota yang dipantau langsung oleh Konsorsium Penasihat Hukum Senior kami.",
      icon: ShieldCheck,
      tag: "COMPLIANCE SECURE"
    },
    {
      title: "Episentrum Pertumbuhan Modal Metropolitan & Resor",
      desc: "Kami membatasi kurasi pada wilayah dengan pertumbuhan kapital tertinggi di Indonesia — korporat suburban Jakarta (PIK, BSD, Gading Serpong) serta klaster gaya hidup prestisius tropis Bali (Ubud, Canggu, Cliffside Uluwatu). Menjamin likuiditas pasar puncak.",
      icon: Gem,
      tag: "HIGH CAP-GAIN"
    },
    {
      title: "Sistem Proteksi Privasi & Wealth Preservation",
      desc: "Sebagai perwakilan Private Client, kami memprioritaskan anonimitas penuh dalam proses negosiasi, tata kelola struktur akuisisi aset bernilai tinggi, hingga penyesuaian administrasi perpajakan real-estate formal tanpa biaya siluman tersembunyi.",
      icon: Lock,
      tag: "ANONYMITY INSURED"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-28 relative overflow-hidden"
    >
      {/* Decorative luxury backgrounds */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-luxury-gold/5 blur-3xl rounded-full pointer-events-none -z-10" />

      {/* Editorial Luxury Header */}
      <motion.div variants={itemVariants} className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center space-x-2">
          <span className="h-[1px] w-8 bg-luxury-gold/40" />
          <span className="text-[10px] font-extrabold tracking-[0.3em] text-luxury-gold uppercase">
            ✦ PRISTINE LEGACY & TRUST ✦
          </span>
          <span className="h-[1px] w-8 bg-luxury-gold/40" />
        </div>
        
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
          Kami Tidak Sekadar Memasarkan,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold via-yellow-200 to-amber-500">
            Kami Mengabadikan Warisan Anda.
          </span>
        </h1>
        
        <p className="text-gray-400 font-light text-sm sm:text-lg leading-relaxed max-w-3xl mx-auto">
          Prime Property berdiri di atas fondasi integritas absolut dan standar pelayanan kelas dunia. Kami adalah gerbang eksklusif bagi para investor global untuk meluncurkan kepemilikan mahakarya properti terbaik seantero nusantara.
        </p>
      </motion.div>

      {/* Grand Philosophy Quote Highlight Block (Bespoke Design Element) */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="relative p-10 sm:p-14 rounded-3xl border border-luxury-gold/25 bg-gradient-to-br from-[#161618] to-zinc-950 shadow-2xl gold-glow overflow-hidden group"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#C9A96102_1px,transparent_1px),linear-gradient(to_bottom,#C9A96102_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
        <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-luxury-gold/5 blur-3xl pointer-events-none transition-all group-hover:bg-luxury-gold/8" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-[#C9A961] uppercase font-extrabold">FILOSOFI KEPEMIMPINAN</span>
            <p className="text-lg sm:text-2xl text-white font-medium leading-relaxed tracking-wide">
              "Bagi kami, real-estate kelas ultra-premium bukanlah baris komoditas investasi biasa. Ia adalah prasasti pencapaian hidup agung, instrumen lindung nilai inflasi termutakhir, serta legacy berharga lintas generasi."
            </p>
            <div className="pt-2">
              <span className="block text-sm font-bold text-white tracking-wide">Sandiaga H. Wijaya</span>
              <span className="block text-xs font-mono text-luxury-gold">Managing Director & Wealth Advisor Specialist</span>
            </div>
          </div>
          <div className="lg:col-span-4 lg:border-l border-white/10 lg:pl-10 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className="block text-3xl font-extrabold text-luxury-gold font-mono tracking-tight">Rp12T+</span>
                <span className="block text-[8px] uppercase font-extrabold text-gray-500 tracking-wider mt-1">TRANSAKSI TERFASILITASI</span>
              </div>
              <div>
                <span className="block text-3xl font-extrabold text-white font-mono tracking-tight">150+</span>
                <span className="block text-[8px] uppercase font-extrabold text-gray-500 tracking-wider mt-1">UNIT PREMIUM AKTIF</span>
              </div>
              <div>
                <span className="block text-3xl font-extrabold text-white font-mono tracking-tight">100%</span>
                <span className="block text-[8px] uppercase font-extrabold text-gray-500 tracking-wider mt-1">LEGALITAS TERVERIFIKASI</span>
              </div>
              <div>
                <span className="block text-3xl font-extrabold text-luxury-gold font-mono tracking-tight">24/7</span>
                <span className="block text-[8px] uppercase font-extrabold text-gray-500 tracking-wider mt-1">CONCIERGE PRIVATE LINE</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

        {/* Right column: Assurance List Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-10"
        >
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#C9A961] uppercase">ALASAN TERBAIK MEMILIH KAMI</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">Pilar Jaminan Prime Property</h3>
            <p className="text-sm text-gray-450 leading-relaxed font-light">
              Kami menyelaraskan keahlian Private Advisors tersertifikasi dengan perlindungan hukum komprehensif, mengembalikan makna ketenangan dalam petualangan investasi real-estate bernilai strategis Anda.
            </p>
          </div>

          <div className="space-y-6">
            {brandAssurances.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div 
                  key={idx} 
                  variants={itemVariants}
                  whileHover={{ x: 8 }}
                  className="flex gap-5 p-4 rounded-2xl hover:bg-white/[0.015] border border-transparent hover:border-white/[0.03] transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-luxury-gold/5 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold flex-shrink-0 shadow-md">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-white tracking-wide">{val.title}</h4>
                      <span className="text-[8px] font-mono font-bold text-[#C9A961] bg-luxury-gold/5 px-2 py-0.5 border border-luxury-gold/15 rounded">
                        {val.tag}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed font-light">{val.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
    </motion.div>
  );
}
