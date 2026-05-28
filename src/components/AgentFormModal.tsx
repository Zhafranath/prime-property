/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Plus, Trash2, Edit2, ShieldAlert, Key, UserCheck, Shield } from "lucide-react";
import { useState, useEffect, FormEvent } from "react";
import { Agent, UserRole } from "../types";

interface AgentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: string; // to prevent self-deletion
  onFetchAgents: () => Promise<Agent[]>;
  onCreateAgent: (payload: any) => Promise<{ success: boolean; error?: string }>;
  onUpdateAgent: (username: string, payload: any) => Promise<{ success: boolean; error?: string }>;
  onDeleteAgent: (username: string) => Promise<{ success: boolean; error?: string }>;
}

export default function AgentFormModal({
  isOpen,
  onClose,
  currentUser,
  onFetchAgents,
  onCreateAgent,
  onUpdateAgent,
  onDeleteAgent
}: AgentFormModalProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form inputs
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState<string | null>(null); // null if adding
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("admin");
  const [password, setPassword] = useState("");

  const loadAgents = async () => {
    setLoading(true);
    try {
      const data = await onFetchAgents();
      setAgents(data);
    } catch (e: any) {
      setErrorMsg("Gagal memuat daftar agen dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAgents();
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const resetForm = () => {
    setIsEditing(false);
    setEditUser(null);
    setUsername("");
    setFullName("");
    setRole("admin");
    setPassword("");
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleEditInit = (agent: Agent) => {
    setIsEditing(true);
    setEditUser(agent.username);
    setUsername(agent.username);
    setFullName(agent.fullName);
    setRole(agent.role);
    setPassword(""); // Leave empty for optional change
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim() || !username.trim()) {
      setErrorMsg("ID Agen dan Nama Lengkap wajib ditulis.");
      return;
    }

    if (!isEditing && (!password || password.length < 6)) {
      setErrorMsg("Kata sandi akun agen baru minimal 6 karakter.");
      return;
    }

    setLoading(true);
    try {
      if (isEditing && editUser) {
        // Update
        const res = await onUpdateAgent(editUser, {
          fullName: fullName.trim(),
          role,
          password: password.trim() || undefined
        });
        if (res.success) {
          setSuccessMsg("Akun agen berhasil diperbaharui.");
          resetForm();
          await loadAgents();
        } else {
          setErrorMsg(res.error || "Gagal memperbaharui kredensial agen.");
        }
      } else {
        // Create
        const res = await onCreateAgent({
          username: username.trim(),
          fullName: fullName.trim(),
          role,
          password
        });
        if (res.success) {
          setSuccessMsg("Akun agen baru berhasil didaftarkan.");
          resetForm();
          await loadAgents();
        } else {
          setErrorMsg(res.error || "Gagal mendaftarkan agen baru.");
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Upps, Terjadi kegagalan komunikasi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userToDelete: string) => {
    if (userToDelete === currentUser) {
      setErrorMsg("Anda tidak diizinkan menghapus akun Anda sendiri.");
      return;
    }

    if (!window.confirm(`Apakah Anda yakin ingin menghapus akun agen "${userToDelete}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await onDeleteAgent(userToDelete);
      if (res.success) {
        setSuccessMsg("Akun agen telah resmi dinonaktifkan.");
        await loadAgents();
      } else {
        setErrorMsg(res.error || "Gagal menghapus akun agen.");
      }
    } catch (err: any) {
      setErrorMsg("Upps, terjadi kegagalan penghapusan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-luxury-black rounded-2xl border border-luxury-gold/30 gold-glow-strong overflow-hidden my-8 max-h-[90vh] flex flex-col block">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-luxury-gold/15 bg-gradient-to-r from-neutral-900 to-luxury-black">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#C9A961] uppercase block mb-1">PENGATURAN HIERARKI OPERASIONAL</span>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5.5 h-5.5 text-luxury-gold" />
              <span>Manajemen Akun Agen & Kredensial</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            id="btn-close-agents-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body split */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left panel: Form */}
          <div className="lg:col-span-5 space-y-6 border-r border-luxury-gold/5 lg:pr-8">
            <h4 className="text-sm font-bold text-white border-b border-luxury-gold/10 pb-2">
              {isEditing ? "Edit Detail Kredensial" : "Daftarkan Agen Baru"}
            </h4>

            {errorMsg && (
              <div className="p-3 bg-luxury-red/15 border border-luxury-red/35 text-red-300 rounded-lg text-xs leading-normal font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-green-950/20 border border-green-800 text-green-300 rounded-lg text-xs leading-normal font-semibold">
                ✓ {successMsg}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">ID Agen (Username) *</label>
                <input
                  type="text"
                  required
                  disabled={isEditing || loading}
                  placeholder="ID unik tanpa spasi"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                  className="w-full bg-luxury-deep text-white text-xs px-4.5 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:outline-none disabled:opacity-50 font-mono"
                  id="agent-modal-username"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Nama Lengkap Agen *</label>
                <input
                  type="text"
                  required
                  disabled={loading}
                  placeholder="Nama representatif resmi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-luxury-deep text-white text-xs px-4.5 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:outline-none disabled:opacity-50"
                  id="agent-modal-fullname"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Role Otorisasi *</label>
                <select
                  disabled={loading}
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-luxury-deep text-white text-xs px-4.5 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:outline-none disabled:opacity-50 cursor-pointer appearance-none"
                  id="agent-modal-role"
                >
                  <option value="admin">Admin Agen (ReadOnly)</option>
                  <option value="superadmin">Superadmin Agent (Read & Write CRUD)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">
                  {isEditing ? "Ganti Sandi Operasional (Opsional)" : "Sandi Operasional Utama *"}
                </label>
                <input
                  type="password"
                  required={!isEditing}
                  disabled={loading}
                  placeholder={isEditing ? "Lewati jika tidak ingin diganti" : "Minimal 6 karakter sandi"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-luxury-deep text-white text-xs px-4.5 py-3 rounded-lg border border-luxury-gold/15 focus:border-luxury-gold focus:outline-none disabled:opacity-50 font-mono"
                  id="agent-modal-password"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-zinc-805 hover:bg-zinc-800 text-gray-300 text-xs py-3 rounded-lg cursor-pointer border border-gray-700"
                  >
                    Batal Edit
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-luxury-gold hover:bg-luxury-gold-hover text-luxury-black font-bold uppercase text-xs tracking-wider py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  id="btn-save-agent"
                >
                  {isEditing ? "Perbaharui" : "Daftarkan"}
                </button>
              </div>
            </form>
          </div>

          {/* Right panel: Table List */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <h4 className="text-sm font-bold text-white border-b border-luxury-gold/10 pb-2 flex justify-between items-center">
              <span>Daftar Akun Otoritas Sistem</span>
              <span className="font-mono text-xs text-luxury-gold font-semibold">Total: {agents.length} user</span>
            </h4>

            <div className="border border-luxury-gold/5 rounded-xl overflow-hidden self-stretch flex-1 bg-luxury-deep">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-luxury-gold/5 text-left text-xs text-gray-400">
                  <thead className="bg-[#121212] font-semibold text-[10px] text-gray-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Nama Otoritas</th>
                      <th className="px-4 py-3">ID / Role</th>
                      <th className="px-4 py-3 text-right">Kelola</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-luxury-gold/5 divide-y-1">
                    {agents.map((a) => (
                      <tr key={a.username} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-bold text-white">{a.fullName}</span>
                            <span className="text-[10px] text-gray-500 font-mono">{new Date(a.created_at).toLocaleDateString("id-ID")}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <span className="font-mono font-semibold text-gray-300 text-[11px]">@{a.username}</span>
                            <span className={`w-max px-1.5 py-0.5 text-[8px] font-extrabold font-mono rounded border ${
                              a.role === "superadmin" 
                                ? "bg-red-950/20 text-red-300 border-red-900" 
                                : "bg-neutral-850 text-gray-400 border-neutral-700"
                            }`}>
                              {a.role}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => handleEditInit(a)}
                              className="p-1.5 text-gray-400 hover:text-luxury-gold hover:bg-luxury-gold/10 rounded-lg transition-colors cursor-pointer"
                              title="Edit Credentials"
                              id={`btn-edit-agent-${a.username}`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(a.username)}
                              disabled={a.username === currentUser}
                              className={`p-1.5 text-gray-400 hover:text-luxury-red hover:bg-luxury-red/10 rounded-lg transition-colors cursor-pointer disabled:opacity-20`}
                              title="Hapus / Cabut Akses"
                              id={`btn-delete-agent-${a.username}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-luxury-gold/15 bg-gradient-to-r from-neutral-900 to-luxury-black">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-luxury-gray-dark hover:bg-zinc-805 text-gray-300 rounded-lg text-xs font-semibold cursor-pointer border border-gray-700"
          >
            Selesai Kelola
          </button>
        </div>
      </div>
    </div>
  );
}
