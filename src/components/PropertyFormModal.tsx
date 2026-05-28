/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Save, Eye } from "lucide-react";
import { useState, useEffect, FormEvent } from "react";
import { Property, PropertyType, PropertyStatus, CompassDirection } from "../types";

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null; // null if adding new
  isReadOnly: boolean; // true if standard agent is reviewing details
  onSubmit: (payload: any) => Promise<boolean>;
}

export default function PropertyFormModal({
  isOpen,
  onClose,
  property,
  isReadOnly,
  onSubmit
}: PropertyFormModalProps) {
  const [nama, setNama] = useState("");
  const [group, setGroup] = useState("");
  const [lebar, setLebar] = useState("");
  const [panjang, setPanjang] = useState("");
  const [hadap, setHadap] = useState<CompassDirection[]>(["Utara"]);
  const [tipe, setTipe] = useState<PropertyType>("Ruko");
  const [tingkat, setTingkat] = useState("");
  const [price, setPrice] = useState("");
  const [carport, setCarport] = useState(false);
  const [status, setStatus] = useState<PropertyStatus>("in_stock");
  const [siap, setSiap] = useState<PropertySiap>("siap_huni");
  const [mapsLink, setMapsLink] = useState("");
  const [kawasan, setKawasan] = useState("");
  const [unit, setUnit] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Synchronize values when property changes or opens
  useEffect(() => {
    if (property) {
      setNama(property.nama_property || property.nama || "");
      setGroup(property.group || "");
      setLebar(String(property.lebar || ""));
      setPanjang(String(property.panjang || ""));
      setHadap(Array.isArray(property.hadap) ? property.hadap : [property.hadap].filter(Boolean) as CompassDirection[]);
      setTipe(property.tipe || "Ruko");
      setTingkat(String(property.tingkat || ""));
      setPrice(String(property.price || ""));
      setCarport(!!property.carport);
      setStatus(property.status || "in_stock");
      setSiap(property.siap || "siap_huni");
      setMapsLink(property.maps_link || "");
      setKawasan(property.kawasan || "");
      setUnit(property.unit || "");
    } else {
      // Clear forms
      setNama("");
      setGroup("");
      setLebar("");
      setPanjang("");
      setHadap(["Utara"]);
      setTipe("Ruko");
      setTingkat("");
      setPrice("");
      setCarport(false);
      setStatus("in_stock");
      setSiap("siap_huni");
      setMapsLink("");
      setKawasan("");
      setUnit("");
    }
    setErrorMsg(null);
  }, [property, isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    setErrorMsg(null);

    // Schema and boundary validations
    if (!nama.trim() || !kawasan.trim() || !lebar || !panjang || !price || !tingkat) {
      setErrorMsg("Mohon isi semua kolom bertanda bintang (*) dengan lengkap.");
      return;
    }

    const numLebar = parseFloat(lebar);
    const numPanjang = parseFloat(panjang);
    const numTingkat = parseFloat(tingkat);
    const numPrice = parseInt(price);

    if (isNaN(numLebar) || numLebar <= 0) {
      setErrorMsg("Lebar tanah harus berupa angka positif.");
      return;
    }
    if (isNaN(numPanjang) || numPanjang <= 0) {
      setErrorMsg("Panjang tanah harus berupa angka positif.");
      return;
    }
    if (isNaN(numTingkat) || numTingkat <= 0) {
      setErrorMsg("Jumlah tingkat lantai bangunan harus bernilai positif.");
      return;
    }
    if (isNaN(numPrice) || numPrice <= 0) {
      setErrorMsg("Harga netting jual wajib berupa angka rupiah positif.");
      return;
    }
    if (hadap.length === 0) {
      setErrorMsg("Pilihlah minimal satu arah hadap properti.");
      return;
    }

    setLoading(true);

    const payload = {
      nama_property: nama.trim(),
      nama: nama.trim(), // Alias for backwards-compatibility support
      group: group.trim(),
      lebar: numLebar,
      panjang: numPanjang,
      hadap,
      tipe,
      tingkat: numTingkat,
      price: numPrice,
      carport,
      status,
      siap,
      maps_link: mapsLink.trim(),
      kawasan: kawasan.trim(),
      unit: unit.trim()
    };

    try {
      const success = await onSubmit(payload);
      if (success) {
        onClose();
      } else {
        setErrorMsg("Gagal memproses data properti. Silakan coba sesaat lagi.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kendala pemrosesan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-luxury-black rounded-2xl border border-luxury-gold/30 gold-glow-strong overflow-hidden my-8 block max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-luxury-gold/15 bg-gradient-to-r from-neutral-900 to-luxury-black">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-[#C9A961] uppercase block mb-1">DATA LISTING EDITOR</span>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {isReadOnly ? (
                <>
                  <Eye className="w-5 h-5 text-luxury-gold" />
                  <span>Detail Lengkap Properti</span>
                </>
              ) : property ? (
                <span>Edit Spesifikasi {property.nama}</span>
              ) : (
                <span>Daftarkan Properti Premium Baru</span>
              )}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            id="btn-close-property-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - scrollable */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-4 bg-luxury-red/10 border border-luxury-red/40 text-red-300 rounded-xl text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Section 1: Ringkasan Nama & Group */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-gold border-b border-luxury-gold/10 pb-2">1. Informasi Umum</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">Nama Properti *</label>
                <input
                  type="text"
                  required
                  disabled={isReadOnly}
                  placeholder="Contoh: Ruko Golden Crown BSD"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full bg-luxury-deep text-white text-xs px-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:outline-none disabled:opacity-50"
                  id="prop-modal-name"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">Nama Grup / Cluster Properti *</label>
                <input
                  type="text"
                  required
                  disabled={isReadOnly}
                  placeholder="Contoh: Golden Heritage Blok Row-C"
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="w-full bg-luxury-deep text-white text-xs px-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:outline-none disabled:opacity-50"
                  id="prop-modal-group"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">Kawasan Kawasan (Kecamatan/Kota) *</label>
                <input
                  type="text"
                  required
                  disabled={isReadOnly}
                  placeholder="Contoh: BSD, Ubud, PIK, dll"
                  value={kawasan}
                  onChange={(e) => setKawasan(e.target.value)}
                  className="w-full bg-luxury-deep text-white text-xs px-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:outline-none disabled:opacity-50"
                  id="prop-modal-kawasan"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">Nomor / Kode Unit *</label>
                <input
                  type="text"
                  required
                  disabled={isReadOnly}
                  placeholder="Contoh: A-12, Suite 3"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-luxury-deep text-white text-xs px-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:outline-none disabled:opacity-50"
                  id="prop-modal-unit"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">Tipe Komersial Utama *</label>
                <select
                  disabled={isReadOnly}
                  value={tipe}
                  onChange={(e) => setTipe(e.target.value as PropertyType)}
                  className="w-full bg-luxury-deep text-white text-xs px-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:outline-none disabled:opacity-50 appearance-none cursor-pointer"
                  id="prop-modal-tipe"
                >
                  <option value="Ruko">Ruko (Commercial)</option>
                  <option value="Villa">Villa (Exquisite Suite)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Spesifikasi Tanah & Desain */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-gold border-b border-luxury-gold/10 pb-2">2. Spesifikasi Fisik & Desain</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">Lebar Tanah (M) *</label>
                <input
                  type="number"
                  required
                  disabled={isReadOnly}
                  placeholder="Meters"
                  value={lebar}
                  onChange={(e) => setLebar(e.target.value)}
                  className="w-full bg-luxury-deep text-white text-xs px-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:outline-none disabled:opacity-50 font-mono"
                  id="prop-modal-lebar"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">Panjang Tanah (M) *</label>
                <input
                  type="number"
                  required
                  disabled={isReadOnly}
                  placeholder="Meters"
                  value={panjang}
                  onChange={(e) => setPanjang(e.target.value)}
                  className="w-full bg-luxury-deep text-white text-xs px-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:outline-none disabled:opacity-50 font-mono"
                  id="prop-modal-panjang"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">Jumlah Lantai *</label>
                <input
                  type="number"
                  required
                  disabled={isReadOnly}
                  placeholder="Jumlah"
                  value={tingkat}
                  onChange={(e) => setTingkat(e.target.value)}
                  className="w-full bg-luxury-deep text-white text-xs px-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:outline-none disabled:opacity-50"
                  id="prop-modal-tingkat"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 font-sans">Arah Hadap (Kombinasi) *</label>
                <div className="flex flex-wrap gap-1.5" id="prop-modal-hadap">
                  {(["Utara", "Timur", "Selatan", "Barat"] as CompassDirection[]).map((dir) => {
                    const isSelected = hadap.includes(dir);
                    return (
                      <button
                        key={dir}
                        type="button"
                        disabled={isReadOnly}
                        onClick={() => {
                          if (isSelected) {
                            setHadap(hadap.filter(d => d !== dir));
                          } else {
                            setHadap([...hadap, dir]);
                          }
                        }}
                        className={`px-3 py-2 rounded text-[11px] font-mono font-bold border transition-all cursor-pointer ${
                          isSelected 
                            ? "bg-[#C9A961]/25 border-[#C9A961] text-[#C9A961]" 
                            : "bg-luxury-deep border-luxury-gold/15 text-gray-400 hover:border-luxury-gold/40"
                        } disabled:opacity-50`}
                      >
                        {dir}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 font-sans">Fasilitas Carport / Garasi *</label>
                <label className="flex items-center gap-2.5 cursor-pointer bg-luxury-deep px-4 py-3 rounded-lg border border-luxury-gold/15 select-none text-xs text-gray-300 font-medium h-[42px] disabled:opacity-50">
                  <input
                    type="checkbox"
                    disabled={isReadOnly}
                    checked={carport}
                    onChange={(e) => setCarport(e.target.checked)}
                    className="rounded border-luxury-gold/20 text-[#C9A961] focus:ring-0 cursor-pointer w-4 h-4 bg-transparent"
                    id="prop-modal-carport"
                  />
                  <span>Memiliki Fasilitas Carport Utama</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">Tautan Titik Google Maps</label>
                <input
                  type="url"
                  disabled={isReadOnly}
                  placeholder="Contoh: https://maps.google.com/?q=..."
                  value={mapsLink}
                  onChange={(e) => setMapsLink(e.target.value)}
                  className="w-full bg-luxury-deep text-white text-xs px-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:outline-none disabled:opacity-50 font-mono"
                  id="prop-modal-maps"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Finansial & Persetujuan */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-gold border-b border-luxury-gold/10 pb-2">3. Transaksional & Kesiapan Unit</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#C9A961] mb-2">Harga Jual Bersih (Netto Rp) *</label>
                <input
                  type="number"
                  required
                  disabled={isReadOnly}
                  placeholder="Contoh: 2850000000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-luxury-deep text-white text-xs px-4 py-3 rounded-lg border border-luxury-gold/25 focus:border-luxury-gold focus:outline-none disabled:opacity-50 font-mono font-bold text-luxury-gold"
                  id="prop-modal-price"
                />
                <span className="block text-[10px] text-gray-500 font-semibold mt-1 font-mono">
                  Rp {(Number(price) || 0).toLocaleString("id-ID")}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">Status Transaksi *</label>
                <select
                  disabled={isReadOnly}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                  className="w-full bg-luxury-deep text-white text-xs px-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:outline-none disabled:opacity-50 cursor-pointer appearance-none h-[42px]"
                  id="prop-modal-status"
                >
                  <option value="in_stock">In Stock (Tersedia)</option>
                  <option value="sold_out">Sold Out (Terjual)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 font-sans">Unit Siap Huni *</label>
                <select
                  disabled={isReadOnly}
                  value={siap}
                  onChange={(e) => setSiap(e.target.value as PropertySiap)}
                  className="w-full bg-luxury-deep text-white text-xs px-4 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:outline-none disabled:opacity-50 cursor-pointer appearance-none h-[42px]"
                  id="prop-modal-siap"
                >
                  <option value="siap_huni">Siap Huni (Kondisi Unit Ready)</option>
                  <option value="siap_kosong">Siap Kosong (Pembangunan)</option>
                  <option value="siap_huni_renovasi">Siap Huni (Tahap Renovasi)</option>
                </select>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-luxury-gold/15 bg-gradient-to-r from-neutral-900 to-luxury-black">
          {property && (
            <div className="text-[10px] text-gray-500 font-mono">
              Terdaftar oleh: <span className="text-gray-300 font-semibold">{property.created_by}</span> <br />
              At: {new Date(property.created_at).toLocaleDateString("id-ID")}
            </div>
          )}
          <div className="flex items-center space-x-3 ml-auto">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-luxury-gray-dark hover:bg-zinc-805 text-gray-300 rounded-lg text-xs font-semibold cursor-pointer border border-gray-700 hover:border-gray-600"
              id="btn-cancel-edit"
            >
              Tutup
            </button>
            {!isReadOnly && (
              <button
                onClick={handleFormSubmit}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2.5 bg-luxury-gold hover:bg-luxury-gold-hover text-luxury-black rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                id="btn-save-property"
              >
                {loading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-luxury-black border-t-transparent animate-spin"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
