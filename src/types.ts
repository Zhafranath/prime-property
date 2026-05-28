/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PropertyType = "Ruko" | "Villa";
export type PropertyStatus = "in_stock" | "sold_out";
export type PropertySiap = "siap_huni" | "siap_kosong" | "siap_huni_renovasi";
export type CompassDirection = "Utara" | "Timur" | "Selatan" | "Barat";

export interface Property {
  id: string;
  nama_property: string; // Wajib
  nama: string; // Alias for seamless backward compatibility
  group: string; // Optional/nullable
  lebar: number; // decimal
  panjang: number; // decimal
  hadap: CompassDirection[]; // enum (multi) - boleh kombinasi
  tipe: PropertyType; // Ruko / Villa
  tingkat: number; // decimal
  price: number; // bigint stored as integer rupiah
  carport: boolean; // Checkbox (true/false)
  status: PropertyStatus; // in_stock / sold_out
  siap: PropertySiap; // siap_huni / siap_kosong / siap_huni_renovasi
  maps_link: string; // Optional
  kawasan: string; // Wajib: string (multi-tag)
  unit: string; // Optional
  created_at: string;
  updated_at: string;
  created_by: string;
  deleted_at: string | null;
}

export type UserRole = "admin" | "superadmin";

export interface Agent {
  username: string;
  fullName: string;
  role: UserRole;
  created_at: string;
}

export interface AuditLog {
  id: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "RESTORE";
  property_id: string;
  property_nama: string;
  performed_by: string; // username
  details: string; // text explaining what changed
  timestamp: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  timestamp: string;
}

export interface SessionData {
  username: string;
  fullName: string;
  role: UserRole;
}
