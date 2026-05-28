/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mail, Phone, MapPin, Send, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useState, FormEvent } from "react";

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <div className="text-center space-y-4 mb-16">
        <span className="text-[10px] font-bold tracking-[0.25em] text-luxury-gold uppercase block bg-luxury-gold/5 border border-luxury-gold/20 px-3 py-1.5 rounded-full w-max mx-auto gold-glow">
          ☎ INQUIRY & PRIVACY CONSULTING
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Konsultasi Privat <span className="text-luxury-gold">Investasi Portofolio Anda</span>
        </h1>
        <p className="text-gray-400 font-light max-w-xl mx-auto text-sm sm:text-base">
          Dapatkan analisis mendalam mengenai yield komersial Ruko strategis atau kurasi Villa mewah eksklusif dari Private Advisors bersertifikasi nasional kami.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        {/* Left Side: Contact details card */}
        <div className="lg:col-span-2 space-y-8 lg:sticky lg:top-28">
          <div className="glass-panel p-8 rounded-2xl border border-luxury-gold/15 shadow-xl space-y-8">
            <h2 className="text-xl font-bold text-white tracking-wide border-b border-luxury-gold/10 pb-4">
              Kantor Pusat Representatif
            </h2>

            <div className="space-y-6">
              {/* Alamat */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Alamat Fisik</h4>
                  <p className="text-sm text-gray-200 font-medium mt-1 leading-relaxed">
                    Corporate Plaza Tower, Lantai 18-A. BSD Grand Boulevard, Gading Serpong, Tangerang - Banten 15310.
                  </p>
                </div>
              </div>

              {/* Hubungi kami */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Telepon & WhatsApp</h4>
                  <p className="text-sm text-gray-200 mt-1 font-mono font-medium">
                    +62 (21) 5098-7711 <br />
                    +62 811-9922-383 (Sandiaga - Lead Agent)
                  </p>
                </div>
              </div>

              {/* Surel */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Surel Resmi</h4>
                  <p className="text-sm text-gray-200 mt-1 font-mono font-medium">
                    inquire@primeproperty.co.id <br />
                    support@primeproperty.co.id
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form card */}
        <div className="lg:col-span-3">
          <div className="glass-panel p-8 sm:p-10 rounded-2xl border border-luxury-gold/20 shadow-xl gold-glow">
            <h3 className="text-lg font-bold text-white tracking-wide mb-6">Kirim Pertanyaan Spesifik</h3>

            {statusMsg && (
              <div className={`p-4 rounded-xl border mb-6 flex items-start gap-3 text-sm animate-fade-in ${
                statusMsg.type === "success" 
                  ? "bg-green-950/40 text-green-300 border-green-800/50" 
                  : "bg-red-950/40 text-red-350 border-luxury-red/50 text-luxury-red"
              }`}>
                {statusMsg.type === "success" ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-400 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-luxury-red mt-0.5" />
                )}
                <span className="font-medium leading-relaxed">{statusMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name & Email column */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="input-name" className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">
                    Nama Lengkap Anda *
                  </label>
                  <input
                    id="input-name"
                    type="text"
                    required
                    placeholder="Contoh: Hendra Wijaya"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-luxury-deep text-white text-sm px-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold focus:outline-none transition-all placeholder:text-gray-700 font-semibold"
                  />
                </div>

                <div>
                  <label htmlFor="input-email" className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">
                    Alamat Email Aktif *
                  </label>
                  <input
                    id="input-email"
                    type="email"
                    required
                    placeholder="Contoh: hendra@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-luxury-deep text-white text-sm px-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold focus:outline-none transition-all placeholder:text-gray-700 font-semibold"
                  />
                </div>
              </div>

              {/* Phone number */}
              <div>
                <label htmlFor="input-phone" className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">
                  No. Telepon / WhatsApp Aktif *
                </label>
                <input
                  id="input-phone"
                  type="tel"
                  required
                  placeholder="Contoh: 08123456789 (Disarankan WhatsApp)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-luxury-deep text-white text-sm px-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold focus:outline-none transition-all placeholder:text-gray-700 font-semibold"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="input-message" className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">
                  Deskripsi Pertanyaan / Minat Unit Properti *
                </label>
                <textarea
                  id="input-message"
                  required
                  rows={5}
                  placeholder="Sebutkan jenis properti (Ruko/Villa) yang ingin Anda konsultasikan atau tanyakan detailnya di sini..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-luxury-deep text-white text-sm px-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold focus:outline-none transition-all placeholder:text-gray-700 font-semibold resize-none"
                ></textarea>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={loading}
                id="btn-send-contact"
                className="w-full flex items-center justify-center space-x-2 py-3 bg-luxury-gold hover:bg-luxury-gold-hover text-luxury-black font-bold uppercase text-xs tracking-wider rounded-lg shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50 hover:shadow-luxury-gold/10"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-luxury-black border-t-transparent animate-spin"></div>
                    <span>Menghubungkan ke Private Advisor...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Hubungkan Saya Dengan Private Advisor</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
