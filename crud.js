// CRUD Operations for TU-Online

// SURAT MASUK CRUD
function openModalSuratMasuk(id = null) {
    const modal = document.getElementById('modalSuratMasuk');
    const form = document.getElementById('formSuratMasuk');
    form.reset();
    document.getElementById('editIdSuratMasuk').value = '';
    
    if (id) {
        document.getElementById('modalSuratMasukTitle').textContent = 'Edit Surat Masuk';
        const surat = JSON.parse(localStorage.getItem('suratMasuk')).find(s => s.id === id);
        if (surat) {
            document.getElementById('editIdSuratMasuk').value = surat.id;
            document.getElementById('nomorSuratMasuk').value = surat.nomorSurat;
            document.getElementById('tanggalTerimaMasuk').value = surat.tanggalTerima;
            document.getElementById('asalSuratMasuk').value = surat.asalSurat;
            document.getElementById('perihalSuratMasuk').value = surat.perihal;
            document.getElementById('statusBacaSuratMasuk').value = surat.statusBaca;
        }
    } else {
        document.getElementById('modalSuratMasukTitle').textContent = 'Tambah Surat Masuk';
        document.getElementById('tanggalTerimaMasuk').value = new Date().toISOString().split('T')[0];
    }
    modal.classList.add('active');
}

function saveSuratMasuk() {
    const id = document.getElementById('editIdSuratMasuk').value;
    const suratData = {
        nomorSurat: document.getElementById('nomorSuratMasuk').value,
        tanggalTerima: document.getElementById('tanggalTerimaMasuk').value,
        asalSurat: document.getElementById('asalSuratMasuk').value,
        perihal: document.getElementById('perihalSuratMasuk').value,
        statusBaca: document.getElementById('statusBacaSuratMasuk').value,
        createdBy: app.currentUser,
        createdAt: new Date().toISOString()
    };
    
    const fileInput = document.getElementById('fileSuratMasuk');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        if (file.size > 5 * 1024 * 1024) {
            showToast('Ukuran file maksimal 5MB!', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            suratData.file = { name: file.name, data: e.target.result };
            completeSaveSuratMasuk(id, suratData);
        };
        reader.readAsDataURL(file);
    } else {
        completeSaveSuratMasuk(id, suratData);
    }
}

function completeSaveSuratMasuk(id, suratData) {
    let suratMasuk = JSON.parse(localStorage.getItem('suratMasuk')) || [];
    if (id) {
        const index = suratMasuk.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            suratMasuk[index] = { ...suratMasuk[index], ...suratData };
            showToast('Surat masuk berhasil diupdate!', 'success');
        }
    } else {
        suratData.id = Date.now();
        suratMasuk.push(suratData);
        showToast('Surat masuk berhasil ditambahkan!', 'success');
    }
    localStorage.setItem('suratMasuk', JSON.stringify(suratMasuk));
    closeModal('modalSuratMasuk');
    renderSuratMasuk();
    app.loadDashboard(); // Update dashboard stats
}

function renderSuratMasuk() {
    let suratMasuk = JSON.parse(localStorage.getItem('suratMasuk')) || [];
    const tbody = document.getElementById('tableSuratMasuk');
    
    if (!tbody) return;
    
    const searchEl = document.getElementById('searchSuratMasuk');
    const filterTanggalEl = document.getElementById('filterTanggalMasuk');
    const filterAsalEl = document.getElementById('filterAsalSurat');
    const filterStatusEl = document.getElementById('filterStatusBaca');
    
    const search = searchEl ? searchEl.value.toLowerCase() : '';
    const filterTanggal = filterTanggalEl ? filterTanggalEl.value : '';
    const filterAsal = filterAsalEl ? filterAsalEl.value : '';
    const filterStatus = filterStatusEl ? filterStatusEl.value : '';

    suratMasuk = suratMasuk.filter(s => {
        const matchSearch = !search || s.nomorSurat.toLowerCase().includes(search) || s.asalSurat.toLowerCase().includes(search) || s.perihal.toLowerCase().includes(search);
        const matchTanggal = !filterTanggal || s.tanggalTerima === filterTanggal;
        const matchAsal = !filterAsal || s.asalSurat === filterAsal;
        const matchStatus = !filterStatus || s.statusBaca === filterStatus;
        return matchSearch && matchTanggal && matchAsal && matchStatus;
    });

    if (suratMasuk.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">Tidak ada data yang sesuai</td></tr>';
        return;
    }

    tbody.innerHTML = suratMasuk.map(s => `
        <tr>
            <td>${s.nomorSurat}</td>
            <td>${formatDate(s.tanggalTerima)}</td>
            <td>${s.asalSurat}</td>
            <td>${s.perihal}</td>
            <td><span class="badge ${s.statusBaca === 'dibaca' ? 'badge-success' : 'badge-warning'}">${s.statusBaca === 'dibaca' ? 'Dibaca' : 'Belum Dibaca'}</span></td>
            <td>
                ${s.file ? `<button class="btn-icon" onclick="viewFile('${s.file.name}', '${s.file.data}')" title="Lihat File"><i class="fas fa-file-pdf"></i></button>` : ''}
                ${app.currentRole !== 'kepala' ? `<button class="btn-icon" onclick="openModalSuratMasuk(${s.id})" title="Edit"><i class="fas fa-edit"></i></button><button class="btn-icon" onclick="deleteSuratMasuk(${s.id})" title="Hapus"><i class="fas fa-trash" style="color: var(--danger-color);"></i></button>` : ''}
            </td>
        </tr>
    `).join('');
}

function deleteSuratMasuk(id) {
    if (confirm('Apakah Anda yakin ingin menghapus surat ini?')) {
        let suratMasuk = JSON.parse(localStorage.getItem('suratMasuk'));
        suratMasuk = suratMasuk.filter(s => s.id !== id);
        localStorage.setItem('suratMasuk', JSON.stringify(suratMasuk));
        renderSuratMasuk();
        showToast('Surat masuk berhasil dihapus!', 'success');
    }
}

function populateAsalSuratFilter() {
    const suratMasuk = JSON.parse(localStorage.getItem('suratMasuk'));
    const asalSuratSet = new Set(suratMasuk.map(s => s.asalSurat));
    const select = document.getElementById('filterAsalSurat');
    select.innerHTML = '<option value="">Semua Asal Surat</option>';
    asalSuratSet.forEach(asal => {
        select.innerHTML += `<option value="${asal}">${asal}</option>`;
    });
}

// SURAT KELUAR CRUD
function openModalSuratKeluar(id = null) {
    const modal = document.getElementById('modalSuratKeluar');
    const form = document.getElementById('formSuratKeluar');
    form.reset();
    document.getElementById('editIdSuratKeluar').value = '';
    
    if (id) {
        document.getElementById('modalSuratKeluarTitle').textContent = 'Edit Surat Keluar';
        const surat = JSON.parse(localStorage.getItem('suratKeluar')).find(s => s.id === id);
        if (surat) {
            document.getElementById('editIdSuratKeluar').value = surat.id;
            document.getElementById('nomorSuratKeluar').value = surat.nomorSurat;
            document.getElementById('tanggalKeluar').value = surat.tanggalKeluar;
            document.getElementById('tujuanSuratKeluar').value = surat.tujuan;
            document.getElementById('perihalSuratKeluar').value = surat.perihal;
            document.getElementById('statusApprovalSuratKeluar').value = surat.status;
        }
    } else {
        document.getElementById('modalSuratKeluarTitle').textContent = 'Tambah Surat Keluar';
        document.getElementById('tanggalKeluar').value = new Date().toISOString().split('T')[0];
    }
    modal.classList.add('active');
}

function saveSuratKeluar() {
    const id = document.getElementById('editIdSuratKeluar').value;
    const suratData = {
        nomorSurat: document.getElementById('nomorSuratKeluar').value,
        tanggalKeluar: document.getElementById('tanggalKeluar').value,
        tujuan: document.getElementById('tujuanSuratKeluar').value,
        perihal: document.getElementById('perihalSuratKeluar').value,
        status: document.getElementById('statusApprovalSuratKeluar').value,
        createdBy: app.currentUser,
        createdAt: new Date().toISOString()
    };
    
    const fileInput = document.getElementById('fileSuratKeluar');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        if (file.size > 5 * 1024 * 1024) {
            showToast('Ukuran file maksimal 5MB!', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            suratData.file = { name: file.name, data: e.target.result };
            completeSaveSuratKeluar(id, suratData);
        };
        reader.readAsDataURL(file);
    } else {
        completeSaveSuratKeluar(id, suratData);
    }
}

function completeSaveSuratKeluar(id, suratData) {
    let suratKeluar = JSON.parse(localStorage.getItem('suratKeluar')) || [];
    if (id) {
        const index = suratKeluar.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            suratKeluar[index] = { ...suratKeluar[index], ...suratData };
            showToast('Surat keluar berhasil diupdate!', 'success');
        }
    } else {
        suratData.id = Date.now();
        suratKeluar.push(suratData);
        showToast('Surat keluar berhasil ditambahkan!', 'success');
    }
    localStorage.setItem('suratKeluar', JSON.stringify(suratKeluar));
    closeModal('modalSuratKeluar');
    renderSuratKeluar();
    app.loadDashboard();
}

function renderSuratKeluar() {
    let suratKeluar = JSON.parse(localStorage.getItem('suratKeluar')) || [];
    const tbody = document.getElementById('tableSuratKeluar');
    
    if (!tbody) return;
    
    const searchEl = document.getElementById('searchSuratKeluar');
    const filterTanggalEl = document.getElementById('filterTanggalKeluar');
    const filterStatusEl = document.getElementById('filterStatusApproval');
    
    const search = searchEl ? searchEl.value.toLowerCase() : '';
    const filterTanggal = filterTanggalEl ? filterTanggalEl.value : '';
    const filterStatus = filterStatusEl ? filterStatusEl.value : '';

    suratKeluar = suratKeluar.filter(s => {
        const matchSearch = !search || s.nomorSurat.toLowerCase().includes(search) || s.tujuan.toLowerCase().includes(search) || s.perihal.toLowerCase().includes(search);
        const matchTanggal = !filterTanggal || s.tanggalKeluar === filterTanggal;
        const matchStatus = !filterStatus || s.status === filterStatus;
        return matchSearch && matchTanggal && matchStatus;
    });

    if (suratKeluar.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">Tidak ada data yang sesuai</td></tr>';
        return;
    }

    tbody.innerHTML = suratKeluar.map(s => `
        <tr>
            <td>${s.nomorSurat}</td>
            <td>${formatDate(s.tanggalKeluar)}</td>
            <td>${s.tujuan}</td>
            <td>${s.perihal}</td>
            <td><span class="badge ${getStatusBadgeClass(s.status)}">${getStatusText(s.status)}</span></td>
            <td>
                ${s.file ? `<button class="btn-icon" onclick="viewFile('${s.file.name}', '${s.file.data}')" title="Lihat File"><i class="fas fa-file-pdf"></i></button>` : ''}
                ${app.currentRole === 'kepala' && s.status === 'menunggu' ? `<button class="btn-icon" onclick="approveSurat(${s.id}, 'disetujui')" title="Setujui"><i class="fas fa-check" style="color: var(--success-color);"></i></button><button class="btn-icon" onclick="approveSurat(${s.id}, 'ditolak')" title="Tolak"><i class="fas fa-times" style="color: var(--danger-color);"></i></button>` : ''}
                ${app.currentRole !== 'kepala' ? `<button class="btn-icon" onclick="openModalSuratKeluar(${s.id})" title="Edit"><i class="fas fa-edit"></i></button><button class="btn-icon" onclick="deleteSuratKeluar(${s.id})" title="Hapus"><i class="fas fa-trash" style="color: var(--danger-color);"></i></button>` : ''}
            </td>
        </tr>
    `).join('');
}

function approveSurat(id, status) {
    let suratKeluar = JSON.parse(localStorage.getItem('suratKeluar')) || [];
    const index = suratKeluar.findIndex(s => s.id === id);
    if (index !== -1) {
        suratKeluar[index].status = status;
        suratKeluar[index].approvedBy = app.currentUser;
        suratKeluar[index].approvedAt = new Date().toISOString();
        localStorage.setItem('suratKeluar', JSON.stringify(suratKeluar));
        renderSuratKeluar();
        app.loadDashboard();
        showToast(`Surat berhasil ${status === 'disetujui' ? 'disetujui' : 'ditolak'}!`, 'success');
    }
}

function deleteSuratKeluar(id) {
    if (confirm('Apakah Anda yakin ingin menghapus surat ini?')) {
        let suratKeluar = JSON.parse(localStorage.getItem('suratKeluar')) || [];
        suratKeluar = suratKeluar.filter(s => s.id !== id);
        localStorage.setItem('suratKeluar', JSON.stringify(suratKeluar));
        renderSuratKeluar();
        app.loadDashboard();
        showToast('Surat keluar berhasil dihapus!', 'success');
    }
}

// ARSIP CRUD
function openModalArsip(id = null) {
    const modal = document.getElementById('modalArsip');
    const form = document.getElementById('formArsip');
    form.reset();
    document.getElementById('editIdArsip').value = '';
    
    if (id) {
        document.getElementById('modalArsipTitle').textContent = 'Edit Arsip';
        const arsip = JSON.parse(localStorage.getItem('arsip')).find(a => a.id === id);
        if (arsip) {
            document.getElementById('editIdArsip').value = arsip.id;
            document.getElementById('namaArsip').value = arsip.nama;
            document.getElementById('kategoriArsip').value = arsip.kategori;
        }
    } else {
        document.getElementById('modalArsipTitle').textContent = 'Upload Dokumen';
    }
    modal.classList.add('active');
}

function saveArsip() {
    const id = document.getElementById('editIdArsip').value;
    const arsipData = {
        nama: document.getElementById('namaArsip').value,
        kategori: document.getElementById('kategoriArsip').value,
        uploadedBy: app.currentUser,
        uploadedAt: new Date().toISOString()
    };
    
    const fileInput = document.getElementById('fileArsip');
    if (!id && fileInput.files.length === 0) {
        showToast('Pilih file untuk diupload!', 'error');
        return;
    }
    
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        if (file.size > 10 * 1024 * 1024) {
            showToast('Ukuran file maksimal 10MB!', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            arsipData.file = { name: file.name, data: e.target.result, type: file.type };
            completeSaveArsip(id, arsipData);
        };
        reader.readAsDataURL(file);
    } else {
        completeSaveArsip(id, arsipData);
    }
}

function completeSaveArsip(id, arsipData) {
    let arsip = JSON.parse(localStorage.getItem('arsip'));
    if (id) {
        const index = arsip.findIndex(a => a.id === parseInt(id));
        if (index !== -1) arsip[index] = { ...arsip[index], ...arsipData };
        showToast('Arsip berhasil diupdate!', 'success');
    } else {
        arsipData.id = Date.now();
        arsip.push(arsipData);
        showToast('Arsip berhasil ditambahkan!', 'success');
    }
    localStorage.setItem('arsip', JSON.stringify(arsip));
    closeModal('modalArsip');
    renderArsip();
}

function renderArsip() {
    let arsip = JSON.parse(localStorage.getItem('arsip'));
    const tbody = document.getElementById('tableArsip');
    const search = document.getElementById('searchArsip').value.toLowerCase();
    const filterKategori = document.getElementById('filterKategoriArsip').value;

    arsip = arsip.filter(a => {
        const matchSearch = a.nama.toLowerCase().includes(search);
        const matchKategori = !filterKategori || a.kategori === filterKategori;
        return matchSearch && matchKategori;
    });

    if (arsip.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data">Tidak ada data yang sesuai</td></tr>';
        return;
    }

    tbody.innerHTML = arsip.map(a => `
        <tr>
            <td>${a.nama}</td>
            <td><span class="badge badge-info">${a.kategori.toUpperCase()}</span></td>
            <td>${formatDate(a.uploadedAt)}</td>
            <td>${a.uploadedBy}</td>
            <td>
                ${a.file ? `<button class="btn-icon" onclick="viewFile('${a.file.name}', '${a.file.data}')" title="Lihat File"><i class="fas fa-file"></i></button>` : ''}
                ${app.currentRole !== 'kepala' ? `<button class="btn-icon" onclick="openModalArsip(${a.id})" title="Edit"><i class="fas fa-edit"></i></button><button class="btn-icon" onclick="deleteArsip(${a.id})" title="Hapus"><i class="fas fa-trash" style="color: var(--danger-color);"></i></button>` : ''}
            </td>
        </tr>
    `).join('');
}

function deleteArsip(id) {
    if (confirm('Apakah Anda yakin ingin menghapus arsip ini?')) {
        let arsip = JSON.parse(localStorage.getItem('arsip'));
        arsip = arsip.filter(a => a.id !== id);
        localStorage.setItem('arsip', JSON.stringify(arsip));
        renderArsip();
        showToast('Arsip berhasil dihapus!', 'success');
    }
}

// USER MANAGEMENT
function openModalUser(id = null) {
    const modal = document.getElementById('modalUser');
    const form = document.getElementById('formUser');
    form.reset();
    document.getElementById('editIdUser').value = '';
    
    if (id) {
        document.getElementById('modalUserTitle').textContent = 'Edit User';
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.id === id);
        if (user) {
            document.getElementById('editIdUser').value = user.id;
            document.getElementById('usernameUser').value = user.username;
            document.getElementById('passwordUser').value = user.password;
            document.getElementById('roleUser').value = user.role;
        }
    } else {
        document.getElementById('modalUserTitle').textContent = 'Tambah User';
    }
    modal.classList.add('active');
}

function saveUser() {
    const id = document.getElementById('editIdUser').value;
    const userData = {
        username: document.getElementById('usernameUser').value,
        password: document.getElementById('passwordUser').value,
        role: document.getElementById('roleUser').value
    };
    
    let users = JSON.parse(localStorage.getItem('users'));
    
    if (id) {
        const index = users.findIndex(u => u.id === parseInt(id));
        if (index !== -1) {
            users[index] = { ...users[index], ...userData };
            showToast('User berhasil diupdate!', 'success');
        }
    } else {
        userData.id = Date.now();
        users.push(userData);
        showToast('User berhasil ditambahkan!', 'success');
    }
    
    localStorage.setItem('users', JSON.stringify(users));
    closeModal('modalUser');
    renderUsers();
}

function renderUsers() {
    const users = JSON.parse(localStorage.getItem('users'));
    const tbody = document.getElementById('tableUsers');
    
    tbody.innerHTML = users.map(u => `
        <tr>
            <td>${u.username}</td>
            <td><span class="badge badge-info">${app.getRoleName(u.role)}</span></td>
            <td>
                <button class="btn-icon" onclick="openModalUser(${u.id})" title="Edit"><i class="fas fa-edit"></i></button>
                ${u.id !== 1 ? `<button class="btn-icon" onclick="deleteUser(${u.id})" title="Hapus"><i class="fas fa-trash" style="color: var(--danger-color);"></i></button>` : ''}
            </td>
        </tr>
    `).join('');
}

function deleteUser(id) {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
        let users = JSON.parse(localStorage.getItem('users'));
        users = users.filter(u => u.id !== id);
        localStorage.setItem('users', JSON.stringify(users));
        renderUsers();
        showToast('User berhasil dihapus!', 'success');
    }
}

function changePassword() {
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        showToast('Password baru tidak cocok!', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.username === app.currentUser);
    
    if (!user || user.password !== oldPassword) {
        showToast('Password lama salah!', 'error');
        return;
    }
    
    user.password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById('formUbahPassword').reset();
    showToast('Password berhasil diubah!', 'success');
}

// Setup event listeners for CRUD
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnTambahSuratMasuk').addEventListener('click', () => openModalSuratMasuk());
    document.getElementById('formSuratMasuk').addEventListener('submit', (e) => {
        e.preventDefault();
        saveSuratMasuk();
    });
    ['searchSuratMasuk', 'filterTanggalMasuk', 'filterAsalSurat', 'filterStatusBaca'].forEach(id => {
        document.getElementById(id).addEventListener(id.includes('search') ? 'input' : 'change', () => renderSuratMasuk());
    });
    
    document.getElementById('btnTambahSuratKeluar').addEventListener('click', () => openModalSuratKeluar());
    document.getElementById('formSuratKeluar').addEventListener('submit', (e) => {
        e.preventDefault();
        saveSuratKeluar();
    });
    ['searchSuratKeluar', 'filterTanggalKeluar', 'filterStatusApproval'].forEach(id => {
        document.getElementById(id).addEventListener(id.includes('search') ? 'input' : 'change', () => renderSuratKeluar());
    });
    
    document.getElementById('btnTambahArsip').addEventListener('click', () => openModalArsip());
    document.getElementById('formArsip').addEventListener('submit', (e) => {
        e.preventDefault();
        saveArsip();
    });
    ['searchArsip', 'filterKategoriArsip'].forEach(id => {
        document.getElementById(id).addEventListener(id.includes('search') ? 'input' : 'change', () => renderArsip());
    });
    
    document.getElementById('btnTambahUser').addEventListener('click', () => openModalUser());
    document.getElementById('formUser').addEventListener('submit', (e) => {
        e.preventDefault();
        saveUser();
    });
    document.getElementById('formUbahPassword').addEventListener('submit', (e) => {
        e.preventDefault();
        changePassword();
    });
});
