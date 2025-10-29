# TU-Online - Sistem Manajemen Tata Usaha Sekolah

Aplikasi web modern untuk mengelola administrasi Tata Usaha sekolah dengan fitur lengkap CRUD, multi-user role, dan laporan otomatis.

## 🎯 Fitur Utama

### Dashboard Interaktif
- Statistik real-time surat masuk hari ini
- Statistik surat keluar minggu ini
- Total arsip tersimpan
- Grafik aktivitas surat per bulan
- Status approval yang menunggu

### Manajemen Surat Masuk
- Input data surat masuk lengkap
- Upload lampiran PDF (maks 5MB)
- Status baca/belum dibaca
- Filter berdasarkan tanggal, asal surat, dan status
- Pencarian cepat
- Preview dan download file

### Manajemen Surat Keluar
- Input data surat keluar lengkap
- Upload lampiran PDF (maks 5MB)
- Sistem approval oleh Kepala Sekolah
- Status: Disetujui, Menunggu, Ditolak
- Filter berdasarkan tanggal dan status
- Pencarian cepat

### Manajemen Arsip
- Upload dokumen penting (PDF, DOCX, JPG - maks 10MB)
- Kategorisasi dokumen (Surat, Laporan, SK, Lainnya)
- Filter berdasarkan kategori
- Preview dan download dokumen
- Tracking pengunggah dan tanggal upload

### Laporan Otomatis
- Laporan Surat Masuk per bulan (PDF)
- Laporan Surat Keluar per bulan (PDF)
- Rekap Arsip lengkap (PDF)
- Export data dengan format profesional

### Manajemen User (Admin Only)
- Tambah, edit, hapus user
- Role-based access control
- Ubah password
- 3 Role: Admin, Petugas TU, Kepala Sekolah

## 👥 Role & Hak Akses

### Admin Sekolah
✅ Mengelola akun petugas TU
✅ Melihat seluruh data surat, arsip, dan laporan
✅ Full CRUD access
✅ Manajemen user

### Petugas TU
✅ Input, edit, hapus surat masuk dan keluar
✅ Mengelola arsip dokumen
✅ Membuat laporan otomatis
❌ Tidak bisa manage user

### Kepala Sekolah
✅ Melihat laporan surat dan arsip
✅ Menyetujui/menolak surat keluar
❌ Tidak bisa CRUD data
❌ Tidak bisa manage user

## 🚀 Cara Menggunakan

### Instalasi
1. Download semua file ke folder yang sama
2. Buka file `index.html` di browser modern (Chrome, Firefox, Edge)
3. Tidak perlu instalasi server atau database

### Login
Gunakan salah satu akun demo berikut:

**Admin Sekolah:**
- Username: `admin`
- Password: `admin123`
- Role: Admin Sekolah

**Petugas TU:**
- Username: `tu`
- Password: `tu123`
- Role: Petugas TU

**Kepala Sekolah:**
- Username: `kepala`
- Password: `kepala123`
- Role: Kepala Sekolah

### Navigasi
1. **Dashboard** - Lihat ringkasan dan statistik
2. **Surat Masuk** - Kelola surat masuk
3. **Surat Keluar** - Kelola surat keluar
4. **Arsip** - Kelola dokumen arsip
5. **Laporan** - Generate laporan PDF
6. **Pengaturan** - Manajemen user (Admin only)

## 🎨 Fitur UI/UX

### Desain Modern
- Warna dominan biru tua (#1e3a8a) dan putih
- Sidebar navigasi yang intuitif
- Card-based layout untuk statistik
- Icon Font Awesome untuk visual yang menarik

### Dark/Light Mode
- Toggle tema gelap/terang
- Preferensi tersimpan otomatis
- Transisi smooth antar tema

### Responsif
- Tampilan optimal di laptop (1024px+)
- Adaptif untuk tablet (768px-1024px)
- Mobile-friendly untuk smartphone (<768px)
- Sidebar collapsible untuk mobile

### Notifikasi Toast
- Notifikasi sukses (hijau)
- Notifikasi error (merah)
- Notifikasi warning (kuning)
- Notifikasi info (biru)

## 📊 Teknologi

### Frontend
- **HTML5** - Struktur aplikasi
- **CSS3** - Styling modern dengan CSS Variables
- **JavaScript (ES6+)** - Logika aplikasi

### Libraries
- **Chart.js** - Grafik interaktif
- **jsPDF** - Generate PDF
- **jsPDF-AutoTable** - Tabel dalam PDF
- **Font Awesome 6** - Icon library

### Storage
- **LocalStorage** - Penyimpanan data permanen
- **SessionStorage** - Manajemen sesi login

## 📁 Struktur File

```
TU Online/
├── index.html          # Struktur HTML utama
├── styles.css          # Styling aplikasi
├── app.js             # Core aplikasi & login
├── crud.js            # Fungsi CRUD
├── reports.js         # Generate laporan PDF
├── utils.js           # Fungsi helper
└── README.md          # Dokumentasi
```

## 🔒 Keamanan

- Password tersimpan di LocalStorage (untuk demo)
- Session-based authentication
- Role-based access control
- Validasi input di client-side
- File size limitation untuk upload

**Note:** Untuk production, gunakan backend dengan enkripsi password dan authentication yang proper.

## 💾 Data Storage

Semua data tersimpan di LocalStorage browser:
- `users` - Data user dan kredensial
- `suratMasuk` - Data surat masuk
- `suratKeluar` - Data surat keluar
- `arsip` - Data arsip dokumen

**Backup:** Data akan hilang jika LocalStorage dibersihkan. Gunakan fitur export untuk backup.

## 🎯 Tips Penggunaan

1. **Upload File:** Pastikan ukuran file tidak melebihi batas (5MB untuk surat, 10MB untuk arsip)
2. **Filter Data:** Gunakan kombinasi filter untuk pencarian yang lebih spesifik
3. **Laporan:** Pilih bulan dan tahun sebelum generate laporan
4. **Approval:** Kepala Sekolah dapat approve/reject dari halaman Surat Keluar
5. **Dark Mode:** Toggle di header kanan atas untuk kenyamanan mata

## 🐛 Troubleshooting

### Data Hilang
- Cek apakah LocalStorage browser tidak penuh
- Jangan clear browser data/cache
- Gunakan fitur backup secara berkala

### File Tidak Bisa Diupload
- Pastikan ukuran file sesuai batas
- Cek format file (PDF untuk surat, PDF/DOCX/JPG untuk arsip)
- Coba browser lain jika masalah berlanjut

### Laporan Tidak Ter-generate
- Pastikan ada data untuk periode yang dipilih
- Cek console browser untuk error
- Pastikan jsPDF library ter-load dengan baik

## 🔄 Update & Maintenance

### Menambah User Baru
1. Login sebagai Admin
2. Buka menu Pengaturan
3. Klik "Tambah User"
4. Isi form dan simpan

### Mengubah Password
1. Login dengan akun yang ingin diubah
2. Buka menu Pengaturan
3. Isi form "Ubah Password"
4. Masukkan password lama dan password baru

### Backup Data
Untuk backup manual:
1. Buka Developer Tools (F12)
2. Console tab
3. Jalankan: `localStorage`
4. Copy semua data

## 📝 Catatan Penting

- Aplikasi ini menggunakan LocalStorage, cocok untuk single-user atau demo
- Untuk multi-user production, implementasikan backend dengan database
- File yang diupload disimpan sebagai Base64 di LocalStorage (ada batasan ukuran)
- Untuk production, gunakan file server yang proper

## 📞 Support

Untuk pertanyaan atau bantuan:
- Baca dokumentasi ini dengan lengkap
- Cek console browser untuk error message
- Pastikan menggunakan browser modern yang support ES6+

## 📄 License

© 2024 TU-Online. All rights reserved.

---

**Dibuat dengan ❤️ untuk kemudahan administrasi sekolah**
