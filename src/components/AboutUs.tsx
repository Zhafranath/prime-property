/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { ShieldCheck, Award, ThumbsUp, Users, Compass, Gem } from "lucide-react";

export default function AboutUs() {
  const brandValues = [
    {
      title: "Sertifikasi Hukum & Legalitas Mutlak",
      desc: "Setiap Ruko komersial dan Villa mewah dalam kurasi kami dilindungi oleh jaminan kepatuhan hukum penuh, sertifikasi bersih, dan jaminan bebas sengketa demi kenyamanan masa depan finansial Anda.",
      icon: ShieldCheck
    },
    {
      title: "Koleksi Aset Ultra-Strategis",
      desc: "Setiap ruko komersial berdiri kokoh di episentrum pertumbuhan ekonomi terpadu nasional, sedangkan lini villa kami melampaui standar rancangan kemewahan resor bintang lima dunia.",
      icon: Gem
    },
    {
      title: "Proteksi Finansial Premium",
      desc: "Menghadirkan rasa tenang melalui penataan database real-state modern nasional berverifikasi resmi, jaminan kepastian harga netto, serta bimbingan legal profesional tanpa biaya siluman.",
      icon: Award
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in space-y-20">
      {/* Hero section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-[10px] font-bold tracking-[0.25em] text-luxury-gold uppercase block bg-luxury-gold/5 border border-luxury-gold/20 px-3 py-1.5 rounded-full w-max mx-auto gold-glow">
          ✦ MARESTI & PRESTISE PRIME PROPERTY
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Gerbang Utama Portofolio Properti <span className="text-[#C9A961]">Ultra-Premium & Eksklusif</span>
        </h1>
        <p className="text-gray-400 font-light text-sm sm:text-base leading-relaxed">
          Kami mengintegrasikan ambisi investasi global Anda dengan koleksi properti elit termegah di Indonesia, menghadirkan kurasi aset berkelas yang melukiskan mahakarya pencapaian hidup Anda.
        </p>
      </div>

      {/* Main Philosophy Section split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative h-[380px] rounded-2xl bg-gradient-to-br from-[#1c1c1e] to-zinc-900 border border-luxury-gold/20 flex flex-col justify-between p-8 overflow-hidden group hover:border-luxury-gold/45 transition-all duration-300">
          {/* Subtle design details */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#C9A96105_1px,transparent_1px),linear-gradient(to_bottom,#C9A96105_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
          <div className="absolute -right-32 -bottom-32 w-80 h-80 rounded-full bg-luxury-gold/5 blur-3xl group-hover:bg-luxury-gold/10 transition-colors pointer-events-none"></div>

          <div className="space-y-4 relative z-10">
            <span className="text-[10px] font-mono tracking-widest text-[#C9A961] uppercase font-bold">PRINSIP & VISI UTAMA</span>
            <h3 className="text-2xl font-bold text-white tracking-tight">Persembahan Mahakarya Tanpa Kompromi</h3>
            <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
              Prime Property hadir bukan sekadar mediator iklan, melainkan curator aset berharga bersertifikasi resmi yang melayani transaksi bernilai tinggi. Kami memahami properti mewah adalah representasi pencapaian hidup agung serta instrumen lindung nilai inflasi terbaik.
            </p>
          </div>

          <div className="flex gap-4 border-t border-luxury-gold/10 pt-6 mt-4 relative z-10">
            <div>
              <span className="block text-xl font-bold text-luxury-gold font-mono">15T+</span>
              <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Aset Terkelola</span>
            </div>
            <div className="w-px h-10 bg-luxury-gold/10"></div>
            <div>
              <span className="block text-xl font-bold text-luxury-gold font-mono">150+</span>
              <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Koleksi Terkurasi</span>
            </div>
            <div className="w-px h-10 bg-luxury-gold/10"></div>
            <div>
              <span className="block text-xl font-bold text-luxury-gold font-mono">100%</span>
              <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Legalitas Sah</span>
            </div>
          </div>
        </div>

        {/* Brand points list */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white tracking-wide">Standar Layanan Agensi Ultra-Premium</h3>
            <p className="text-xs sm:text-sm text-gray-400 font-light">
              Kami menyelaraskan keahlian Private Wealth Advisors bersertifikat internasional dengan verifikasi data real-time demi mengawal setiap proses akuisisi unit berharga Anda secara sempurna.
            </p>
          </div>

          <div className="space-y-6">
            {brandValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-luxury-gold/10 border border-luxury-gold/25 flex items-center justify-center text-luxury-gold flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{val.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed font-light">{val.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
