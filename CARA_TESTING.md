# Cara Testing Aplikasi TU-Online

## 🚀 Quick Start

1. **Buka Aplikasi**
   - Double-click file `index.html`
   - Atau klik kanan → Open with → Browser pilihan Anda

2. **Login**
   - Username: `admin`
   - Password: `admin123`
   - Role: Admin Sekolah

## 📝 Testing Laporan PDF (Step by Step)

### Persiapan: Tambah Data Sample

#### 1. Tambah Surat Masuk
1. Login sebagai Admin atau TU
2. Klik menu **Surat Masuk**
3. Klik tombol **"+ Tambah Surat Masuk"**
4. Isi form:
   - Nomor Surat: `001/SM/X/2024`
   - Tanggal Terima: Pilih tanggal hari ini
   - Asal Surat: `Dinas Pendidikan`
   - Perihal: `Undangan Rapat Koordinasi`
   - Status: `Belum Dibaca`
5. Klik **Simpan**
6. Ulangi untuk menambah 2-3 surat lagi

#### 2. Tambah Surat Keluar
1. Klik menu **Surat Keluar**
2. Klik tombol **"+ Tambah Surat Keluar"**
3. Isi form:
   - Nomor Surat: `001/SK/X/2024`
   - Tanggal Keluar: Pilih tanggal hari ini
   - Tujuan: `Kepala Dinas Pendidikan`
   - Perihal: `Laporan Kegiatan Bulanan`
   - Status: `Menunggu Approval`
4. Klik **Simpan**
5. Tambah 2-3 surat lagi

#### 3. Tambah Arsip
1. Klik menu **Arsip**
2. Klik tombol **"+ Upload Dokumen"**
3. Isi form:
   - Nama Dokumen: `SK Kepala Sekolah 2024`
   - Kategori: `SK`
   - File: Upload file PDF/DOCX/JPG (opsional)
4. Klik **Simpan**
5. Tambah 2-3 arsip lagi dengan kategori berbeda

### Testing Cetak PDF

#### Test 1: Laporan Surat Masuk ✅
1. Klik menu **Laporan**
2. Di card "Laporan Surat Masuk":
   - Bulan: Pilih bulan saat ini (sudah auto-select)
   - Tahun: 2024 (sudah auto-fill)
3. Klik tombol **"📄 Cetak PDF"**
4. **Hasil yang diharapkan:**
   - Toast hijau muncul: "Laporan berhasil dicetak!"
   - File PDF otomatis ter-download: `Laporan_Surat_Masuk_10_2024.pdf`
   - Buka PDF, cek isinya:
     - ✅ Header: LAPORAN SURAT MASUK
     - ✅ Periode: Oktober 2024
     - ✅ Tabel dengan data surat masuk
     - ✅ Footer: Total, User, Tanggal

#### Test 2: Laporan Surat Keluar ✅
1. Di card "Laporan Surat Keluar":
   - Bulan: Pilih bulan saat ini
   - Tahun: 2024
2. Klik tombol **"📄 Cetak PDF"**
3. **Hasil yang diharapkan:**
   - Toast hijau: "Laporan berhasil dicetak!"
   - File PDF: `Laporan_Surat_Keluar_10_2024.pdf`
   - Isi PDF:
     - ✅ Header: LAPORAN SURAT KELUAR
     - ✅ Tabel dengan data surat keluar
     - ✅ Statistik: Disetujui, Menunggu, Ditolak
     - ✅ Footer lengkap

#### Test 3: Rekap Arsip ✅
1. Di card "Rekap Arsip":
2. Klik tombol **"📄 Cetak PDF"** (tanpa pilih periode)
3. **Hasil yang diharapkan:**
   - Toast hijau: "Laporan berhasil dicetak!"
   - File PDF: `Rekap_Arsip_[timestamp].pdf`
   - Isi PDF:
     - ✅ Header: REKAP ARSIP DOKUMEN
     - ✅ Total Dokumen
     - ✅ Tabel dengan semua arsip
     - ✅ Statistik per Kategori (SURAT, LAPORAN, SK, LAINNYA)

### Test Validasi (Tidak Ada Data)

#### Test 4: Periode Tanpa Data
1. Di "Laporan Surat Masuk":
   - Pilih bulan: Januari
   - Pilih tahun: 2023
2. Klik **"Cetak PDF"**
3. **Hasil yang diharapkan:**
   - Toast kuning: "Tidak ada data untuk periode yang dipilih!"
   - Tidak ada PDF yang ter-download

## 🎯 Testing Fitur Lainnya

### Test Modal (Sudah Diperbaiki)
1. **Tombol Close (X)**
   - Buka modal form
   - Klik tombol X di pojok kanan atas
   - Modal tertutup dengan animasi smooth ✅

2. **Tombol Batal**
   - Buka modal form
   - Isi beberapa field
   - Klik "Batal"
   - Modal tertutup dan form ter-reset ✅

3. **Click Outside**
   - Buka modal
   - Klik area gelap di luar modal
   - Modal tertutup ✅

4. **ESC Key**
   - Buka modal
   - Tekan tombol ESC
   - Modal tertutup ✅

### Test CRUD Surat Masuk
1. **Create** - Tambah surat baru ✅
2. **Read** - Lihat daftar surat ✅
3. **Update** - Edit surat (klik icon pensil) ✅
4. **Delete** - Hapus surat (klik icon trash) ✅
5. **Filter** - Coba filter berdasarkan tanggal, asal, status ✅
6. **Search** - Ketik di search box ✅

### Test CRUD Surat Keluar
1. **Create** - Tambah surat baru ✅
2. **Read** - Lihat daftar surat ✅
3. **Update** - Edit surat ✅
4. **Delete** - Hapus surat ✅
5. **Approval** - Login sebagai Kepala Sekolah, approve/reject surat ✅

### Test CRUD Arsip
1. **Create** - Upload dokumen ✅
2. **Read** - Lihat daftar arsip ✅
3. **Update** - Edit arsip ✅
4. **Delete** - Hapus arsip ✅
5. **Filter** - Filter berdasarkan kategori ✅

### Test Dashboard
1. **Statistik**
   - Cek "Surat Masuk Hari Ini" - harus update real-time ✅
   - Cek "Surat Keluar Minggu Ini" ✅
   - Cek "Arsip Tersimpan" ✅
   - Cek "Menunggu Approval" ✅

2. **Grafik**
   - Grafik aktivitas surat per bulan harus tampil ✅
   - Garis biru: Surat Masuk ✅
   - Garis hijau: Surat Keluar ✅

### Test Role-Based Access

#### Login sebagai Admin
- ✅ Bisa akses semua menu
- ✅ Bisa CRUD semua data
- ✅ Bisa manage user
- ✅ Bisa cetak laporan

#### Login sebagai TU
- ✅ Bisa CRUD surat dan arsip
- ✅ Bisa cetak laporan
- ❌ Tidak bisa manage user (menu Pengaturan hidden)

#### Login sebagai Kepala Sekolah
- ✅ Bisa lihat semua data
- ✅ Bisa approve/reject surat keluar
- ✅ Bisa cetak laporan
- ❌ Tidak bisa CRUD (tombol Tambah hidden)
- ❌ Tidak bisa manage user

### Test Dark/Light Mode
1. Klik icon bulan/matahari di header
2. Tema berubah dengan smooth transition ✅
3. Preferensi tersimpan (refresh halaman, tema tetap) ✅

### Test Responsive
1. **Desktop (>1024px)** - Layout 2 kolom ✅
2. **Tablet (768-1024px)** - Layout adaptif ✅
3. **Mobile (<768px)** - Sidebar collapsible, layout 1 kolom ✅

## 🐛 Troubleshooting

### PDF Tidak Ter-download
**Solusi:**
1. Cek console browser (F12) untuk error
2. Pastikan library jsPDF ter-load (cek Network tab)
3. Cek popup blocker browser
4. Coba browser lain (Chrome/Firefox/Edge)

### Toast Tidak Muncul
**Solusi:**
1. Refresh halaman (Ctrl+F5)
2. Clear browser cache
3. Cek console untuk error

### Data Hilang Setelah Refresh
**Solusi:**
1. Cek LocalStorage browser (F12 → Application → Local Storage)
2. Jangan clear browser data
3. Pastikan tidak menggunakan Incognito/Private mode

### Modal Tidak Bisa Ditutup
**Solusi:**
1. Refresh halaman
2. Cek console untuk error
3. Pastikan semua file JS ter-load dengan benar

## 📊 Checklist Testing Lengkap

### Fitur Utama
- [ ] Login multi-user (3 role)
- [ ] Dashboard dengan statistik
- [ ] Grafik aktivitas surat
- [ ] CRUD Surat Masuk
- [ ] CRUD Surat Keluar
- [ ] CRUD Arsip
- [ ] Approval surat (Kepala Sekolah)
- [ ] Laporan PDF Surat Masuk
- [ ] Laporan PDF Surat Keluar
- [ ] Laporan PDF Rekap Arsip
- [ ] Manajemen User (Admin)
- [ ] Ubah Password

### UI/UX
- [ ] Dark/Light mode toggle
- [ ] Responsive design
- [ ] Toast notifications
- [ ] Modal animations
- [ ] Hover effects
- [ ] Loading states

### Validasi
- [ ] Form validation
- [ ] File size validation
- [ ] Role-based access control
- [ ] Empty state handling
- [ ] Error handling

## ✅ Expected Results

Jika semua test berhasil:
- ✅ Semua tombol berfungsi
- ✅ PDF ter-generate dengan benar
- ✅ Data tersimpan di LocalStorage
- ✅ Role access berfungsi
- ✅ UI responsif dan smooth
- ✅ Tidak ada error di console

## 🎉 Selamat!

Jika semua test passed, aplikasi TU-Online siap digunakan! 🚀

---

**Happy Testing!** 🧪
