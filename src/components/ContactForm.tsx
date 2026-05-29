/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mail, Phone, MapPin, Send, AlertTriangle, CheckCircle, Lock } from "lucide-react";
import { useState, FormEvent } from "react";
import { motion } from "motion/react";

interface ContactFormProps {
  onSubmitContact: (payload: {
    fullName: string;
    email: string;
    phone: string;
    message: string;
  }) => Promise<{ success: boolean; message: string; error?: string }>;
}

export default function ContactForm({ onSubmitContact }: ContactFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    // Initial basic client validations
    if (!fullName.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setStatusMsg({ type: "error", text: "Mohon isi semua kolom formulir kontak dengan lengkap." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatusMsg({ type: "error", text: "Format email yang dimasukkan tidak valid." });
      return;
    }

    setLoading(true);

    try {
      const response = await onSubmitContact({ fullName, email, phone, message });
      if (response.success) {
        setStatusMsg({ type: "success", text: response.message });
        // Reset fields
        setFullName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        setStatusMsg({ type: "error", text: response.error || "Gagal mengirimkan pesan." });
      }
    } catch (err: any) {
      setStatusMsg({
        type: "error",
        text: err.message || "Upps, terjadi kesalahan saat menghubungi server."
      });
    } finally {
      setLoading(false);
    }
  };

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
    hidden: { opacity: 0, y: 25, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 relative overflow-hidden"
    >
      {/* Glow decorative behind */}
      <div className="absolute top-24 right-10 w-96 h-96 bg-luxury-gold/5 blur-3xl rounded-full pointer-events-none -z-10" />

      {/* Styled Luxury Header */}
      <motion.div variants={itemVariants} className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-center space-x-2">
          <span className="h-[1px] w-6 bg-luxury-gold/30" />
          <span className="text-[10px] font-extrabold tracking-[0.3em] text-luxury-gold uppercase block">
            ☎ PRIVATE REGISTRY & ADVISORY DESK
          </span>
          <span className="h-[1px] w-6 bg-luxury-gold/30" />
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Konsultasi & Penjadwalan <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold via-amber-300 to-amber-500">
            Privat Portofolio Premium
          </span>
        </h1>
        
        <p className="text-gray-400 font-light text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Hubungi meja Private Advisory kami untuk mendapatkan rincian berkas legalitas (Sertifikat Hak Milik/Sertifikat Hak Guna Bangunan), analisis imbal hasil (ROI) ruko metropolitan, maupun penawaran privat villa mewah Bali.
        </p>
      </motion.div>

      {/* Responsive layout Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        
        {/* Left column: Representative Advisory Office & VIP details */}
        <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-28">
          <motion.div 
            variants={itemVariants}
            className="relative p-8 rounded-2xl border border-white/[0.06] bg-[#121213]/90 backdrop-blur-md shadow-2xl overflow-hidden text-left"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-luxury-gold to-transparent" />
            
            <motion.div variants={itemVariants} className="space-y-1.5 border-b border-white/[0.04] pb-4 mb-6">
              <span className="text-[9px] font-mono tracking-widest text-[#C9A961] font-bold uppercase block">CORPORATE SUITE HQ</span>
              <h2 className="text-xl font-extrabold text-white tracking-wide">
                Kantor Representatif Utama
              </h2>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Alamat */}
              <motion.div variants={itemVariants} className="flex items-start space-x-4 group">
                <div className="w-10 h-10 rounded-xl bg-luxury-gold/5 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold flex-shrink-0 shadow-md group-hover:bg-luxury-gold group-hover:text-luxury-black transition-colors duration-300">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest font-mono">Alamat Kantor Pusat</h4>
                  <p className="text-sm text-gray-200 font-medium mt-1 leading-relaxed">
                    Corporate Plaza Tower, Suite 18-A. BSD Grand Boulevard, Gading Serpong, Tangerang - Banten 15310.
                  </p>
                </div>
              </motion.div>

              {/* Hubungi kami */}
              <motion.div variants={itemVariants} className="flex items-start space-x-4 group">
                <div className="w-10 h-10 rounded-xl bg-luxury-gold/5 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold flex-shrink-0 shadow-md group-hover:bg-luxury-gold group-hover:text-luxury-black transition-colors duration-300">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest font-mono">Telepon & WhatsApp Pribadi</h4>
                  <p className="text-sm text-gray-200 mt-1 font-mono font-medium leading-relaxed">
                    +62 (21) 5098-7711 (Kantor)<br />
                    <span className="text-luxury-gold font-bold">+62 811-9922-383</span> (Bapak Sandiaga - Lead Partner)
                  </p>
                </div>
              </motion.div>

              {/* Surel */}
              <motion.div variants={itemVariants} className="flex items-start space-x-4 group">
                <div className="w-10 h-10 rounded-xl bg-luxury-gold/5 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold flex-shrink-0 shadow-md group-hover:bg-luxury-gold group-hover:text-luxury-black transition-colors duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-extrabold text-[#C9A961] uppercase tracking-widest font-mono">Meja Korespondensi</h4>
                  <p className="text-sm text-gray-200 mt-1 font-mono font-medium leading-relaxed">
                    inquire@primeproperty.co.id<br />
                    private-desk@primeproperty.co.id
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Absolute NDA & Privacy Seal (Bespoke Luxury Detail Component) */}
          <motion.div 
            variants={itemVariants}
            className="p-6 rounded-2xl border border-luxury-gold/15 bg-gradient-to-r from-[#171719] to-[#121213] relative overflow-hidden flex items-center gap-4 shadow-md text-left"
          >
            <div className="w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center text-[#C9A961] flex-shrink-0">
              <Lock className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left space-y-1">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">100% CONFIDENTIALITY PROTECTION</h4>
              <p className="text-[11px] text-gray-400 font-light leading-snug">
                Seluruh data komunikasi privat, identitas nasabah, serta nominal penawaran dana dijamin terlindungi penuh di bawah pakta Non-Disclosure Agreement (NDA).
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right column: Intake Form Card */}
        <div className="lg:col-span-3">
          <motion.div 
            variants={itemVariants}
            className="relative p-8 sm:p-10 rounded-2xl border border-luxury-gold/20 bg-[#161618]/95 shadow-2xl gold-glow overflow-hidden text-left"
          >
            {/* Fine design element line decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-luxury-gold/10 to-transparent pointer-events-none" />
            
            <motion.div variants={itemVariants} className="border-b border-white/[0.04] pb-5 mb-6 text-left">
              <span className="text-[9px] font-mono tracking-widest text-[#C9A961] font-bold uppercase block">CONSULTATION DESK REQUEST</span>
              <h3 className="text-lg font-bold text-white tracking-wide">Ajukan Pertanyaan & Survei Lokasi</h3>
            </motion.div>

            {statusMsg && (
              <div className={`p-4 rounded-xl border mb-6 flex items-start gap-3.5 text-sm animate-fade-in ${
                statusMsg.type === "success" 
                  ? "bg-green-950/40 text-green-300 border-green-800/40" 
                  : "bg-red-950/40 text-red-350 border-luxury-red/40 text-luxury-red"
              }`}>
                {statusMsg.type === "success" ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-400 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-luxury-red mt-0.5" />
                )}
                <span className="font-medium leading-relaxed">{statusMsg.text}</span>
              </div>
            )}

            <motion.form 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              {/* Full Name & Email row */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="text-left">
                  <label htmlFor="input-name" className="block text-[10px] font-extrabold text-gray-400 tracking-wider uppercase mb-2 font-mono">
                    Nama Lengkap Pemohon *
                  </label>
                  <input
                    id="input-name"
                    type="text"
                    required
                    placeholder="Contoh: Hendra Wijaya, S.E."
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#111112]/95 text-white text-sm px-4 py-3.5 rounded-xl border border-white/[0.08] focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/30 focus:outline-none transition-all placeholder:text-gray-700 font-semibold"
                  />
                </div>

                <div className="text-left">
                  <label htmlFor="input-email" className="block text-[10px] font-extrabold text-gray-400 tracking-wider uppercase mb-2 font-mono">
                    Surel / Email Korespondensi *
                  </label>
                  <input
                    id="input-email"
                    type="email"
                    required
                    placeholder="Contoh: hendra.wijaya@outlook.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#111112]/95 text-white text-sm px-4 py-3.5 rounded-xl border border-white/[0.08] focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/30 focus:outline-none transition-all placeholder:text-gray-700 font-semibold"
                  />
                </div>
              </motion.div>

              {/* Phone number */}
              <motion.div variants={itemVariants} className="text-left">
                <label htmlFor="input-phone" className="block text-[10px] font-extrabold text-gray-400 tracking-wider uppercase mb-2 font-mono">
                  No. Telepon Seluler / WhatsApp Aktif *
                </label>
                <div className="relative">
                  <input
                    id="input-phone"
                    type="tel"
                    required
                    placeholder="Contoh: +62 812-3456-7890 (Disarankan yang terhubung WhatsApp)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#111112]/95 text-white text-sm px-4 py-3.5 rounded-xl border border-white/[0.08] focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/30 focus:outline-none transition-all placeholder:text-gray-700 font-semibold"
                  />
                </div>
              </motion.div>

              {/* Message */}
              <motion.div variants={itemVariants} className="text-left">
                <label htmlFor="input-message" className="block text-[10px] font-extrabold text-gray-400 tracking-wider uppercase mb-2 font-mono">
                  Dokumentasi Minat Aset & Rencana Investasi *
                </label>
                <textarea
                  id="input-message"
                  required
                  rows={5}
                  placeholder="Sebutkan kategori ruko/villa atau budget alokasi aset yang ingin Anda diskusikan. Advisor kami akan segera menyiapkan laporan portofolio dan menjadwalkan panggilan video/pertemuan langsung."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#111112]/95 text-white text-sm px-4 py-4 rounded-xl border border-white/[0.08] focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/30 focus:outline-none transition-all placeholder:text-gray-700 font-semibold resize-none leading-relaxed"
                ></textarea>
              </motion.div>

              {/* Send Button */}
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading}
                id="btn-send-contact"
                className="w-full flex items-center justify-center space-x-2.5 py-4 bg-gradient-to-r from-luxury-gold to-amber-600 hover:from-luxury-gold-hover hover:to-amber-700 text-luxury-black font-extrabold uppercase text-[11px] tracking-[0.15em] rounded-xl shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-50 hover:shadow-[0_0_25px_rgba(201,169,97,0.3)] hover:scale-[1.01]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-luxury-black border-t-transparent animate-spin"></div>
                    <span>Mengirim Enkripsi Formulir...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Ajukan Konsultasi Privat Dengan Advisor</span>
                  </>
                )}
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
