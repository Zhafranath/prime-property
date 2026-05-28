/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, ClipboardList, PlusCircle, RefreshCcw, Trash, RotateCcw } from "lucide-react";
import { AuditLog } from "../types";

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLog[];
}

export default function AuditLogModal({ isOpen, onClose, logs }: AuditLogModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-luxury-black rounded-2xl border border-luxury-gold/30 gold-glow-strong overflow-hidden my-8 max-h-[90vh] flex flex-col block">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-luxury-gold/15 bg-gradient-to-r from-neutral-900 to-luxury-black">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#C9A961] uppercase block mb-1">TRANSACTION JOURNAL SECURITY AUDIT</span>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ClipboardList className="w-5.5 h-5.5 text-luxury-gold" />
              <span>Audit Log Perubahan Properti</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            id="btn-close-audit-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Log Timeline */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {logs.length > 0 ? (
            <div className="relative pl-6 border-l border-luxury-gold/15 space-y-8">
              {logs.map((log) => {
                // Pick action visualization parameters
                let Icon = RefreshCcw;
                let colorClasses = "bg-blue-950 text-blue-300 border-blue-900";
                if (log.action === "CREATE") {
                  Icon = PlusCircle;
                  colorClasses = "bg-green-950 text-green-300 border-green-900";
                } else if (log.action === "DELETE") {
                  Icon = Trash;
                  colorClasses = "bg-red-910/35 text-luxury-red border-luxury-red/35";
                } else if (log.action === "RESTORE") {
                  Icon = RotateCcw;
                  colorClasses = "bg-purple-950 text-purple-300 border-purple-900";
                }

                return (
                  <div key={log.id} className="relative group" id={`audit-log-item-${log.id}`}>
                    {/* Visual marker bullet icon */}
                    <span className="absolute -left-[35px] top-0 flex items-center justify-center w-6.5 h-6.5 rounded-full bg-luxury-deep border border-luxury-gold/25 text-luxury-gold group-hover:scale-110 transition-transform duration-100 gold-glow">
                      <Icon className="w-3.5 h-3.5" />
                    </span>

                    <div className="glass-panel p-4 rounded-xl border border-luxury-gold/10 hover:border-luxury-gold/25 transition-all bg-[#151515]">
                      {/* Meta parameters row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-luxury-gold/5 pb-2 mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide border ${colorClasses}`}>
                            {log.action}
                          </span>
                          <span className="font-semibold text-white text-xs">{log.property_nama}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {new Date(log.timestamp).toLocaleString("id-ID", {
                            timeZone: "Asia/Jakarta",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"
                          })} WIB
                        </span>
                      </div>

                      {/* Log Explanation details */}
                      <p className="text-xs text-gray-300 leading-relaxed font-mono">
                        {log.details}
                      </p>

                      <div className="flex items-center space-x-1.5 mt-3 text-[10px] text-gray-550 border-t border-luxury-gold/5 pt-2">
                        <span className="text-gray-500 font-medium">Melalui Agen:</span>
                        <span className="font-mono bg-luxury-gray-dark px-1.5 py-0.5 rounded text-gray-400 font-bold border border-gray-800">
                          @{log.performed_by}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-550 font-mono text-[9px]">ID: {log.id}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <ClipboardList className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="font-semibold text-sm">Tidak Ada Log Tersedia</p>
              <p className="text-xs text-gray-400 mt-1">Belum ada catatan aktivitas perubahan yang dilakukan pada basis data.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-luxury-gold/15 bg-gradient-to-r from-neutral-900 to-luxury-black">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-luxury-gray-dark hover:bg-zinc-805 text-gray-300 rounded-lg text-xs font-semibold cursor-pointer border border-gray-700"
          >
            Selesai Review
          </button>
        </div>
      </div>
    </div>
  );
}
