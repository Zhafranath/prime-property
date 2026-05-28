/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Search, Plus, Trash2, Edit3, MapPin, Grid, Layers, 
  RotateCcw, Eye, Compass, ClipboardList, UserCog, Car, HelpCircle 
} from "lucide-react";
import { useState } from "react";
import { Property, UserRole, PropertyType, PropertyStatus, CompassDirection } from "../types";
import { formatRupiah } from "./FeaturedProperties";

interface ListingTableProps {
  properties: Property[];
  userRole: UserRole;
  onAddClick: () => void;
  onEditClick: (property: Property) => void;
  onDeleteClick: (id: string) => void;
  onRestoreClick: (id: string) => void;
  onViewLogsClick: () => void;
  onManageAgentsClick?: () => void;
}

export default function ListingTable({
  properties,
  userRole,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onRestoreClick,
  onViewLogsClick,
  onManageAgentsClick
}: ListingTableProps) {
  const [tab, setTab] = useState<"active" | "archived">("active");
  const [search, setSearch] = useState("");
  const [kawasan, setKawasan] = useState("");
  const [tipe, setTipe] = useState("");
  const [status, setStatus] = useState("");

  const availableKawasan = Array.from(new Set(properties.map(p => p.kawasan))).filter(Boolean);

  // Filter lists based on Tab (active vs soft-deleted archive)
  const listByTab = properties.filter((p) => {
    if (tab === "active") {
      return p.deleted_at === null;
    } else {
      return p.deleted_at !== null;
    }
  });

  // Apply filters
  const filteredList = listByTab.filter((prop) => {
    if (search) {
      const s = search.toLowerCase();
      const nameVal = prop.nama_property || prop.nama || "";
      const matchName = nameVal.toLowerCase().includes(s);
      const matchGroup = (prop.group || "").toLowerCase().includes(s);
      const matchUnit = (prop.unit || "").toLowerCase().includes(s);
      if (!matchName && !matchGroup && !matchUnit) return false;
    }

    if (kawasan && prop.kawasan !== kawasan) return false;
    if (tipe && prop.tipe !== tipe) return false;
    if (status && prop.status !== status) return false;

    return true;
  });

  const isSuper = userRole === "superadmin";

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* Top Header Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-luxury-black via-neutral-900 to-luxury-black p-8 rounded-2xl border border-luxury-gold/15 shadow-xl gold-glow">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-luxury-gold animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-widest text-[#C9A961] uppercase">PORTAL SISTEM MENAGEMEN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Manajemen <span className="text-luxury-gold">Listing Properti</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm font-light">
            Sistem perbaruan database properti Ruko & Villa untuk representatif agen resmi.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Audit Logs button - visible to everyone */}
          <button
            onClick={onViewLogsClick}
            className="flex items-center space-x-2 bg-luxury-gray-dark hover:bg-zinc-800 text-gray-200 text-xs font-semibold px-4 py-3 rounded-lg border border-gray-700 hover:border-luxury-gold/30 transition-all cursor-pointer"
            id="btn-view-audit-logs"
          >
            <ClipboardList className="w-4 h-4 text-luxury-gold" />
            <span>Audit Log Perubahan</span>
          </button>

          {/* User accounts management button - superadmin only */}
          {isSuper && onManageAgentsClick && (
            <button
              onClick={onManageAgentsClick}
              className="flex items-center space-x-2 bg-luxury-gray-dark hover:bg-zinc-800 text-gray-200 text-xs font-semibold px-4 py-3 rounded-lg border border-gray-700 hover:border-luxury-gold/30 transition-all cursor-pointer"
              id="btn-manage-agents"
            >
              <UserCog className="w-4 h-4 text-luxury-gold" />
              <span>Kelola Akun Agen</span>
            </button>
          )}

          {/* Add property button - superadmin only */}
          {isSuper ? (
            <button
              onClick={onAddClick}
              className="flex items-center space-x-2 bg-luxury-gold hover:bg-luxury-gold-hover text-luxury-black text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-lg shadow-md transition-all cursor-pointer"
              id="btn-add-property"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Properti</span>
            </button>
          ) : (
            <div className="text-[10px] bg-neutral-900 border border-neutral-800 px-3.5 py-2.5 rounded-lg text-gray-400">
              Izin Modifikasi: <span className="text-yellow-600 font-bold">VIEW-ONLY (Admin)</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs (Active vs Archived/Soft-Deleted) */}
      <div className="flex items-center space-x-1 border-b border-luxury-gold/10">
        <button
          onClick={() => setTab("active")}
          className={`px-6 py-3 text-sm font-bold tracking-wide transition-all border-b-2 relative cursor-pointer ${
            tab === "active"
              ? "text-luxury-gold border-luxury-gold"
              : "text-gray-400 border-transparent hover:text-white"
          }`}
          id="btn-tab-active"
        >
          Listing Aktif
          {tab === "active" && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-luxury-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-luxury-gold"></span>
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("archived")}
          className={`px-6 py-3 text-sm font-bold tracking-wide transition-all border-b-2 relative cursor-pointer ${
            tab === "archived"
              ? "text-luxury-gold border-luxury-gold"
              : "text-gray-400 border-transparent hover:text-white"
          }`}
          id="btn-tab-archived"
        >
          Arsip Terhapus (Soft Delete)
          {properties.filter(p => p.deleted_at !== null).length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-luxury-red/20 text-red-300 font-mono">
              {properties.filter(p => p.deleted_at !== null).length}
            </span>
          )}
        </button>
      </div>

      {/* Internal Filter Actions Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-luxury-gold/10 shadow-lg grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">Kata Kunci</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-luxury-gold" />
            <input
              type="text"
              placeholder="Cari nama, grup, unit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-luxury-deep text-white text-xs pl-9 pr-3 py-2.5 rounded-lg border border-luxury-gold/10 focus:border-luxury-gold focus:outline-none transition-all placeholder:text-gray-650"
              id="dashboard-search-input"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">Kawasan</label>
          <select
            value={kawasan}
            onChange={(e) => setKawasan(e.target.value)}
            className="w-full bg-luxury-deep text-white text-xs px-3 py-2.5 rounded-lg border border-luxury-gold/10 focus:border-luxury-gold focus:outline-none cursor-pointer appearance-none"
            id="dashboard-kawasan-select"
          >
            <option value="">Semua Kawasan</option>
            {availableKawasan.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">Tipe</label>
          <select
            value={tipe}
            onChange={(e) => setTipe(e.target.value)}
            className="w-full bg-luxury-deep text-white text-xs px-3 py-2.5 rounded-lg border border-luxury-gold/10 focus:border-luxury-gold focus:outline-none cursor-pointer appearance-none"
            id="dashboard-tipe-select"
          >
            <option value="">Semua Tipe</option>
            <option value="Ruko">Ruko</option>
            <option value="Villa">Villa</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-luxury-deep text-white text-xs px-3 py-2.5 rounded-lg border border-luxury-gold/10 focus:border-luxury-gold focus:outline-none cursor-pointer appearance-none"
            id="dashboard-status-select"
          >
            <option value="">Semua Status</option>
            <option value="in_stock">In Stock (Tersedia)</option>
            <option value="sold_out">Sold Out (Terjual)</option>
          </select>
        </div>
      </div>

      {/* Table grid */}
      <div className="glass-panel rounded-2xl border border-luxury-gold/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-luxury-gold/5 text-left text-xs text-gray-300">
            <thead className="bg-[#121212]/90 text-[10px] font-bold tracking-widest text-[#C9A961] uppercase">
              <tr>
                <th scope="col" className="px-6 py-4">Properti & Kawasan</th>
                <th scope="col" className="px-6 py-4">Tipe & Unit</th>
                <th scope="col" className="px-6 py-4">Spesifikasi Fisik</th>
                <th scope="col" className="px-6 py-4">Kondisi</th>
                <th scope="col" className="px-6 py-4">Harga Nett</th>
                <th scope="col" className="px-6 py-4 text-right">Aksi Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-gold/5 bg-[#171717]/60">
              {filteredList.length > 0 ? (
                filteredList.map((prop) => (
                  <tr key={prop.id} className="hover:bg-luxury-gold/5 transition-colors duration-150">
                    {/* Properti & Kawasan */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-sm tracking-tight">
                          {prop.nama_property || prop.nama}
                        </span>
                        <div className="flex items-center space-x-1.5 text-gray-400 mt-1 font-semibold uppercase text-[9px]">
                          <MapPin className="w-3 h-3 text-luxury-gold" />
                          <span>{prop.kawasan}</span>
                          {prop.group && (
                            <>
                              <span className="text-gray-600">•</span>
                              <span>{prop.group}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Tipe & Unit */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`w-max px-2 py-0.5 text-[9px] font-extrabold uppercase rounded ${
                          prop.tipe === "Villa" 
                            ? "bg-purple-950 text-purple-200 border border-purple-900" 
                            : "bg-amber-950 text-amber-200 border border-amber-900"
                        }`}>
                          {prop.tipe}
                        </span>
                        {prop.unit && <span className="font-mono text-gray-400">Unit: {prop.unit}</span>}
                      </div>
                    </td>

                    {/* Spesifikasi Fisik */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col font-mono text-[11px] text-gray-200 space-y-0.5">
                        <span>Dimensi: {prop.lebar} x {prop.panjang} M</span>
                        <span>Lantai: {prop.tingkat} lantai</span>
                        <span>Carport: {prop.carport ? "Ada Carport" : "Tidak Ada"}</span>
                        <span className="text-[10px] text-[#C9A961] flex items-center gap-1 mt-0.5 font-sans">
                          <Compass className="w-3 h-3 text-luxury-gold" /> Hadap {Array.isArray(prop.hadap) ? prop.hadap.join(", ") : prop.hadap}
                        </span>
                      </div>
                    </td>

                    {/* Kondisi */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1.5">
                        <span className={`w-max px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                          prop.status === "in_stock"
                            ? "bg-green-950/40 text-green-300 border-green-800/40"
                            : "bg-red-950/20 text-red-300 border-red-900/30"
                        }`}>
                          {prop.status === "in_stock" ? "Tersedia" : "Terjual"}
                        </span>
                        <span className="text-[10px] text-gray-400 font-sans font-medium">
                          {prop.siap === "siap_huni" 
                            ? "✅ Siap Huni" 
                            : prop.siap === "siap_huni_renovasi"
                            ? "🛠️ Tahap Renovasi"
                            : "⏳ Siap Kosong"}
                        </span>
                      </div>
                    </td>

                    {/* Harga */}
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-sm text-luxury-gold font-mono">
                      {formatRupiah(prop.price)}
                    </td>

                    {/* Aksi */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold">
                      <div className="flex items-center justify-end space-x-2">
                        {tab === "active" ? (
                          <>
                            {/* Edit Action - superadmin only or Admin as view modal if we want, let's limit full write to Super */}
                            {isSuper ? (
                              <button
                                onClick={() => onEditClick(prop)}
                                className="flex items-center justify-center p-2 text-gray-300 hover:text-luxury-gold hover:bg-luxury-gold/10 rounded-lg transition-colors cursor-pointer"
                                title="Edit Spesifikasi"
                                id={`btn-edit-prop-${prop.id}`}
                              >
                                <Edit3 className="w-4.5 h-4.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => onEditClick(prop)}
                                className="flex items-center justify-center p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                                title="Lihat Detail"
                                id={`btn-view-prop-${prop.id}`}
                              >
                                <Eye className="w-4.5 h-4.5 text-gray-400" />
                              </button>
                            )}

                            {/* Archive Action - superadmin only */}
                            {isSuper && (
                              <button
                                onClick={() => onDeleteClick(prop.id)}
                                className="flex items-center justify-center p-2 text-gray-300 hover:text-luxury-red hover:bg-luxury-red/10 rounded-lg transition-colors cursor-pointer"
                                title="Arsip (Soft Delete)"
                                id={`btn-delete-prop-${prop.id}`}
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            )}
                          </>
                        ) : (
                          /* Archived View Actions */
                          <>
                            {isSuper ? (
                              <button
                                onClick={() => onRestoreClick(prop.id)}
                                className="flex items-center space-x-1 px-3 py-1.5 border border-green-800/40 bg-green-950/20 text-green-300 hover:bg-green-950/60 rounded-lg transition-colors cursor-pointer"
                                id={`btn-restore-prop-${prop.id}`}
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Pulihkan</span>
                              </button>
                            ) : (
                              <span className="text-gray-500 italic font-mono text-[10px]">Terrarsip</span>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <span className="text-3xl block mb-2">📂</span>
                    Tidak ada properti yang sesuai dalam penyaringan {tab === "active" ? "aktif" : "arsip"} ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
