# ♛ Prime Property Platform
> *Episentrum Kurasi Real Estate Komersial & Residensial Elit Indonesia.*

![Prime Property Header](https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80)

**Prime Property Platform** adalah aplikasi full-stack real state ultra-premium berlisensi resmi yang dirancang khusus untuk mempertemukan investor kelas kakap dengan kolaborasi investasi bernilai tinggi: Ruko Komersial Strategis (*High Yield Commercial Property*) serta Villa Mewah Eksklusif (*Exquisite Living Villa*).

Dibangun di atas arsitektur modern berkecepatan tinggi dengan estetika visual **Swiss-Modernist Dark Slate**, platform ini memberikan jaminan legalitas mutlak, transparansi data real-time, dan kemudahan kurasi aset berharga secara presisi.

---

## 🔑 Informasi Akses Kredensial (User & Role)
Sistem memiliki sistem Manajemen Akun Terintegrasi yang telah terkonfigurasi dengan role-based authorization:

### 1. 👑 Superadmin (Full CRUD & Multi-Agent Admin Portal)
Memberikan hak kontrol absolut untuk menyunting data properti, mendaftarkan agen baru, mengubah password, dan melakukan pemulihan (*soft-delete restore*).
*   **Username:** `superadmin`
*   **Password:** `password123`

### 2. 👔 Admin / Partner Agent (Internal Advisors)
Diberikan akses khusus eksklusif untuk memantau data properti internal, grafik analitik penjualan, dan verifikasi riwayat audit log aktivitas aset.
*   **Pilihan Akun Agen 1:** `agent_budi` | **Password:** `password123`
*   **Pilihan Akun Agen 2:** `agent_siti` | **Password:** `password123`

---

## 🛠 Apakah Sistem CRUD Sudah Diterapkan?
**Ya, Sistem CRUD telah terimplementasi 100% secara utuh, aman, dan tersinkronisasi Server-Client!** 

Sistem CRUD kami melampaui standar manipulasi data biasa dengan menerapkan arsitektur pengamanan tingkat industri:
1.  **Create (Tambah Properti):** Formulir pendaftaran unit komersial dan residensial baru yang sangat lengkap dengan validasi form ketat sisi server (*double-precision parameters*), tipe data spesifikasi (lebar, panjang, arah hadap, tingkat lantai, fungsionalitas carport).
2.  **Read (Kurasi Real-time):** Sinkronisasi filter pencarian multi-dimensi dengan URL parameter, sehingga hasil filter dapat dibagikan dengan tautan statis untuk kemitraan bisnis.
3.  **Update (Amandemen Data):** Panel instan yang memfasilitasi amandemen spesifikasi tanpa reload halaman (*Optimistic UI State Updating*).
4.  **Delete & Archiving (Soft-Delete & Restore):** Untuk mencegah kehilangan data berharga secara tidak sengaja, platform menerapkan **Arsip Terkelola**. Unit yang dihapus akan ditandai sebagai "Soft-Deleted" dan dipindahkan ke tab Arsip untuk dapat dipulihkan (*restored*) dalam satu klik saja.
5.  **Audit Logs:** Setiap aksi CRUD merekam pencatatan perubahan transparan: *Siapa yang mengubah*, *Kapan diubah*, dan *Status perubahan apa yang diimplementasikan*.

---

## ✨ Fitur Rekomendasi Efek Visual Premium (Uji Coba Langsung!)
Untuk menegaskan kemewahan dan memikat perhatian pembeli premium/VIP, platform ini dilengkapi dengan serangkaian inovasi efek visual:

| Efek Visual | Deskripsi Estetika | Mengapa Hal Ini Menjual? |
| :--- | :--- | :--- |
| **✨ Premium Light Sweep (Shine)** | Efek kilauan cahaya emas yang bergerak menyapu permukaan kartu (card) properti saat kursor diarahkan (*on hover*). | Menyerupai material fisik kartu kredit titanium premium atau plat emas murni, memberi efek psikologis status sosial tinggi. |
| **📈 Dynamic Glassmorphism Charts** | Grafik analitik interaktif Recharts berselimut overlay es transparan dengan pendaran latar belakang keemasan (*golden glow*). | Investor menyukai data yang rapi; charts ini mengesankan bahwa keputusan bisnis didasarkan pada riset yang sangat akurat. |
| **🗺️ 3D Perspective Map Link** | Integrasi visual peta interaktif dengan pinpoint satelit koordinat presisi. | Kemudahan verifikasi geospasial bagi investor yang memprioritaskan "Lokasi, Lokasi, Lokasi". |
| **📐 Dual-Load State Blueprint Fallback** | Jika tautan gambar asli rusak, sistem secara dinamis menghasilkan ilustrasi cetak biru arsitektur (*architectural blueprint pattern*) lengkap dengan grid emas, nama aset, dan inisial properti. | Menghilangkan kesan "ruang kosong / error" dan menggantinya dengan kemewahan sketsa desain arsitektur yang artistik. |
| **💫 Seamless Motion Animations** | Animasi transisi halaman dan pergantian galeri tab yang didukung oleh `motion/react`. | Gerakan responsif yang lembut membuat pengalaman navigasi terasa semulus mengoperasikan aplikasi asli di gawai iOS/macOS eksklusif. |

---

## 🚀 Panduan Memulai Cepat (Quick Start)

### 💻 Menjalankan Server Pengembangan
Instal dependensi dan jalankan server lokal:
```bash
# Menginstal semua pustaka pendukung
npm install

# Menjalankan platform dalam modus pengembangan (Port 3000)
npm run dev
```

### 📦 Proses Kompilasi Produksi (Production Build Deployment)
Platform dikompilasi ke dalam format yang dioptimalkan penuh untuk kecepatan cold-start kontainer:
```bash
npm run build
npm start
```

---

## 💎 Filosofi Desain: "The Prestige Slate"
Kami menolak template real estate generik dengan warna biru/ungu cerah yang membosankan. **Prime Property Platform** mengadopsi palet warna gelap berkontras tinggi yang terinspirasi oleh batu slate pegunungan, dipadukan dengan aksen emas Champagne (`#C9A961`) dan tipografi modernis sans-serif *Space Grotesk* berdampingan dengan *JetBrains Mono* untuk indikator spesifikasi teknis.

*Mari hadirkan transaksi investasi properti termegah dalam genggaman Anda.*
