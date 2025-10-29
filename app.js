// TU-Online Main Application
class TUOnlineApp {
    constructor() {
        this.currentUser = null;
        this.currentRole = null;
        this.chart = null;
        this.init();
    }

    init() {
        this.initializeData();
        this.setupEventListeners();
        this.checkLogin();
    }

    initializeData() {
        if (!localStorage.getItem('users')) {
            const defaultUsers = [
                { id: 1, username: 'admin', password: 'admin123', role: 'admin' }
            ];
            localStorage.setItem('users', JSON.stringify(defaultUsers));
        }
        if (!localStorage.getItem('suratMasuk')) localStorage.setItem('suratMasuk', JSON.stringify([]));
        if (!localStorage.getItem('suratKeluar')) localStorage.setItem('suratKeluar', JSON.stringify([]));
        if (!localStorage.getItem('arsip')) localStorage.setItem('arsip', JSON.stringify([]));
    }

    setupEventListeners() {
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(item.dataset.page);
            });
        });
        document.getElementById('mobileMenuToggle').addEventListener('click', () => {
            document.getElementById('mainNav').classList.toggle('active');
        });
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // Close mobile menu when clicking nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                document.getElementById('mainNav').classList.remove('active');
            });
        });
    }

    checkLogin() {
        const user = sessionStorage.getItem('currentUser');
        const role = sessionStorage.getItem('currentRole');
        if (user && role) {
            this.currentUser = user;
            this.currentRole = role;
            this.showMainApp();
        } else {
            this.showLoginPage();
        }
    }

    handleLogin() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        if (username === 'admin' && password === 'admin123') {
            this.currentUser = username;
            this.currentRole = 'admin';
            sessionStorage.setItem('currentUser', username);
            sessionStorage.setItem('currentRole', 'admin');
            this.showMainApp();
            showToast('Login berhasil!', 'success');
        } else {
            showToast('Username atau password salah!', 'error');
        }
    }

    handleLogout() {
        sessionStorage.clear();
        this.currentUser = null;
        this.currentRole = null;
        this.showLoginPage();
        showToast('Logout berhasil!', 'success');
    }

    showLoginPage() {
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
        document.getElementById('loginForm').reset();
    }

    showMainApp() {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('mainApp').style.display = 'flex';
        document.getElementById('currentUser').textContent = this.currentUser;
        document.getElementById('currentRole').textContent = this.getRoleName(this.currentRole);
        this.setupRoleAccess();
        this.navigateTo('dashboard');
    }

    getRoleName(role) {
        const roles = { 'admin': 'Admin Sekolah', 'tu': 'Petugas TU', 'kepala': 'Kepala Sekolah' };
        return roles[role] || role;
    }

    setupRoleAccess() {
        // All users have admin access
        document.getElementById('navPengaturan').style.display = 'flex';
        ['btnTambahSuratMasuk', 'btnTambahSuratKeluar', 'btnTambahArsip'].forEach(id => {
            document.getElementById(id).style.display = 'inline-flex';
        });
    }

    navigateTo(page) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(page + 'Page').classList.add('active');
        
        const actions = {
            'dashboard': () => this.loadDashboard(),
            'suratMasuk': () => { renderSuratMasuk(); populateAsalSuratFilter(); },
            'suratKeluar': () => renderSuratKeluar(),
            'arsip': () => renderArsip(),
            'pengaturan': () => renderUsers()
        };
        if (actions[page]) actions[page]();
    }

    loadDashboard() {
        const suratMasuk = JSON.parse(localStorage.getItem('suratMasuk'));
        const suratKeluar = JSON.parse(localStorage.getItem('suratKeluar'));
        const arsip = JSON.parse(localStorage.getItem('arsip'));
        const today = new Date().toISOString().split('T')[0];
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        document.getElementById('statSuratMasukHariIni').textContent = suratMasuk.filter(s => s.tanggalTerima === today).length;
        document.getElementById('statSuratKeluarMingguIni').textContent = suratKeluar.filter(s => new Date(s.tanggalKeluar) >= oneWeekAgo).length;
        document.getElementById('statArsip').textContent = arsip.length;
        document.getElementById('statMenungguApproval').textContent = suratKeluar.filter(s => s.status === 'menunggu').length;
        this.updateChart();
    }

    updateChart() {
        const suratMasuk = JSON.parse(localStorage.getItem('suratMasuk'));
        const suratKeluar = JSON.parse(localStorage.getItem('suratKeluar'));
        const months = [];
        const masukData = [];
        const keluarData = [];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            months.push(['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][month - 1]);
            masukData.push(suratMasuk.filter(s => {
                const d = new Date(s.tanggalTerima);
                return d.getMonth() + 1 === month && d.getFullYear() === year;
            }).length);
            keluarData.push(suratKeluar.filter(s => {
                const d = new Date(s.tanggalKeluar);
                return d.getMonth() + 1 === month && d.getFullYear() === year;
            }).length);
        }
        
        if (this.chart) this.chart.destroy();
        this.chart = new Chart(document.getElementById('chartAktivitas'), {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    { label: 'Surat Masuk', data: masukData, borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', tension: 0.4 },
                    { label: 'Surat Keluar', data: keluarData, borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', tension: 0.4 }
                ]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'top' } },
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
            }
        });
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const icon = document.querySelector('#themeToggle i');
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    }
}

// Initialize app
const app = new TUOnlineApp();

// Apply saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    document.querySelector('#themeToggle i').classList.replace('fa-moon', 'fa-sun');
}
