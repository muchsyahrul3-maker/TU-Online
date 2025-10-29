// Initialize Report Page
document.addEventListener('DOMContentLoaded', () => {
    // Set default month to current month
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    // Set default values for report filters
    const bulanMasuk = document.getElementById('bulanLaporanMasuk');
    const bulanKeluar = document.getElementById('bulanLaporanKeluar');
    const tahunMasuk = document.getElementById('tahunLaporanMasuk');
    const tahunKeluar = document.getElementById('tahunLaporanKeluar');
    
    if (bulanMasuk) bulanMasuk.value = currentMonth;
    if (bulanKeluar) bulanKeluar.value = currentMonth;
    if (tahunMasuk) tahunMasuk.value = currentYear;
    if (tahunKeluar) tahunKeluar.value = currentYear;
});
