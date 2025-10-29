// Report Generation for TU-Online

function generateLaporanSuratMasuk() {
    const bulan = parseInt(document.getElementById('bulanLaporanMasuk').value);
    const tahun = parseInt(document.getElementById('tahunLaporanMasuk').value);
    const suratMasuk = JSON.parse(localStorage.getItem('suratMasuk'));
    
    const filtered = suratMasuk.filter(s => {
        const date = new Date(s.tanggalTerima);
        return date.getMonth() + 1 === bulan && date.getFullYear() === tahun;
    });
    
    if (filtered.length === 0) {
        showToast('Tidak ada data untuk periode yang dipilih!', 'warning');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('LAPORAN SURAT MASUK', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Periode: ${getNamaBulan(bulan)} ${tahun}`, 105, 28, { align: 'center' });
    
    // Table
    const tableData = filtered.map((s, i) => [
        i + 1,
        s.nomorSurat,
        formatDate(s.tanggalTerima),
        s.asalSurat,
        s.perihal,
        s.statusBaca === 'dibaca' ? 'Dibaca' : 'Belum Dibaca'
    ]);
    
    doc.autoTable({
        startY: 35,
        head: [['No', 'No. Surat', 'Tanggal', 'Asal Surat', 'Perihal', 'Status']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [30, 58, 138], textColor: 255 },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 30 },
            2: { cellWidth: 25 },
            3: { cellWidth: 35 },
            4: { cellWidth: 60 },
            5: { cellWidth: 25 }
        }
    });
    
    // Footer
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.text(`Total Surat Masuk: ${filtered.length}`, 14, finalY);
    doc.text(`Dicetak oleh: ${app.currentUser}`, 14, finalY + 7);
    doc.text(`Tanggal Cetak: ${formatDate(new Date().toISOString())}`, 14, finalY + 14);
    
    doc.save(`Laporan_Surat_Masuk_${bulan}_${tahun}.pdf`);
    showToast('Laporan berhasil dicetak!', 'success');
}

function generateLaporanSuratKeluar() {
    const bulan = parseInt(document.getElementById('bulanLaporanKeluar').value);
    const tahun = parseInt(document.getElementById('tahunLaporanKeluar').value);
    const suratKeluar = JSON.parse(localStorage.getItem('suratKeluar'));
    
    const filtered = suratKeluar.filter(s => {
        const date = new Date(s.tanggalKeluar);
        return date.getMonth() + 1 === bulan && date.getFullYear() === tahun;
    });
    
    if (filtered.length === 0) {
        showToast('Tidak ada data untuk periode yang dipilih!', 'warning');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('LAPORAN SURAT KELUAR', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Periode: ${getNamaBulan(bulan)} ${tahun}`, 105, 28, { align: 'center' });
    
    // Table
    const tableData = filtered.map((s, i) => [
        i + 1,
        s.nomorSurat,
        formatDate(s.tanggalKeluar),
        s.tujuan,
        s.perihal,
        getStatusText(s.status)
    ]);
    
    doc.autoTable({
        startY: 35,
        head: [['No', 'No. Surat', 'Tanggal', 'Tujuan', 'Perihal', 'Status']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [30, 58, 138], textColor: 255 },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 30 },
            2: { cellWidth: 25 },
            3: { cellWidth: 35 },
            4: { cellWidth: 60 },
            5: { cellWidth: 25 }
        }
    });
    
    // Footer
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.text(`Total Surat Keluar: ${filtered.length}`, 14, finalY);
    
    const disetujui = filtered.filter(s => s.status === 'disetujui').length;
    const menunggu = filtered.filter(s => s.status === 'menunggu').length;
    const ditolak = filtered.filter(s => s.status === 'ditolak').length;
    
    doc.text(`Disetujui: ${disetujui} | Menunggu: ${menunggu} | Ditolak: ${ditolak}`, 14, finalY + 7);
    doc.text(`Dicetak oleh: ${app.currentUser}`, 14, finalY + 14);
    doc.text(`Tanggal Cetak: ${formatDate(new Date().toISOString())}`, 14, finalY + 21);
    
    doc.save(`Laporan_Surat_Keluar_${bulan}_${tahun}.pdf`);
    showToast('Laporan berhasil dicetak!', 'success');
}

function generateLaporanArsip() {
    const arsip = JSON.parse(localStorage.getItem('arsip'));
    
    if (arsip.length === 0) {
        showToast('Tidak ada data arsip!', 'warning');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('REKAP ARSIP DOKUMEN', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Total Dokumen: ${arsip.length}`, 105, 28, { align: 'center' });
    
    // Table
    const tableData = arsip.map((a, i) => [
        i + 1,
        a.nama,
        a.kategori.toUpperCase(),
        formatDate(a.uploadedAt),
        a.uploadedBy
    ]);
    
    doc.autoTable({
        startY: 35,
        head: [['No', 'Nama Dokumen', 'Kategori', 'Tanggal Upload', 'Pengunggah']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [30, 58, 138], textColor: 255 },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 70 },
            2: { cellWidth: 30 },
            3: { cellWidth: 35 },
            4: { cellWidth: 40 }
        }
    });
    
    // Statistics
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Statistik per Kategori:', 14, finalY);
    
    doc.setFont(undefined, 'normal');
    const kategoris = ['surat', 'laporan', 'sk', 'lainnya'];
    let yPos = finalY + 7;
    
    kategoris.forEach(kat => {
        const count = arsip.filter(a => a.kategori === kat).length;
        doc.text(`${kat.toUpperCase()}: ${count} dokumen`, 14, yPos);
        yPos += 7;
    });
    
    yPos += 7;
    doc.text(`Dicetak oleh: ${app.currentUser}`, 14, yPos);
    doc.text(`Tanggal Cetak: ${formatDate(new Date().toISOString())}`, 14, yPos + 7);
    
    doc.save(`Rekap_Arsip_${new Date().getTime()}.pdf`);
    showToast('Laporan berhasil dicetak!', 'success');
}

function getNamaBulan(bulan) {
    const namaBulan = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return namaBulan[bulan - 1];
}
