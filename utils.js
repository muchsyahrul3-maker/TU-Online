// Utility Functions for TU-Online

// Format date to Indonesian format
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Get status badge class
function getStatusBadgeClass(status) {
    const classes = {
        'disetujui': 'badge-success',
        'menunggu': 'badge-warning',
        'ditolak': 'badge-danger'
    };
    return classes[status] || 'badge-info';
}

// Get status text
function getStatusText(status) {
    const texts = {
        'disetujui': 'Disetujui',
        'menunggu': 'Menunggu Approval',
        'ditolak': 'Ditolak'
    };
    return texts[status] || status;
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // Add fade out animation
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.animation = 'modalSlideOut 0.3s ease';
        }
        
        // Remove active class after animation
        setTimeout(() => {
            modal.classList.remove('active');
            if (modalContent) {
                modalContent.style.animation = '';
            }
            // Reset form if exists
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
        }, 300);
    }
}

// Setup modal click outside to close
document.addEventListener('DOMContentLoaded', () => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Close modal with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal.id);
            }
        }
    });
});

// View file
function viewFile(fileName, fileData) {
    if (!fileData) {
        showToast('File tidak tersedia!', 'error');
        return;
    }
    
    // Create a temporary link and trigger download/view
    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName;
    
    // For PDF files, open in new tab
    if (fileName.toLowerCase().endsWith('.pdf')) {
        link.target = '_blank';
        link.click();
    } else {
        // For other files, download
        link.click();
    }
}

// Download file
function downloadFile(fileName, fileData) {
    if (!fileData) {
        showToast('File tidak tersedia!', 'error');
        return;
    }
    
    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName;
    link.click();
    showToast('File berhasil didownload!', 'success');
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Validate file type
function validateFileType(file, allowedTypes) {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    for (let type of allowedTypes) {
        if (fileType.includes(type) || fileName.endsWith(type)) {
            return true;
        }
    }
    return false;
}

// Export data to JSON
function exportToJSON(data, filename) {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Data berhasil diekspor!', 'success');
}

// Import data from JSON
function importFromJSON(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            callback(data);
            showToast('Data berhasil diimpor!', 'success');
        } catch (error) {
            showToast('File JSON tidak valid!', 'error');
        }
    };
    reader.readAsText(file);
}

// Search in array of objects
function searchInArray(array, searchTerm, fields) {
    const term = searchTerm.toLowerCase();
    return array.filter(item => {
        return fields.some(field => {
            const value = item[field];
            return value && value.toString().toLowerCase().includes(term);
        });
    });
}

// Sort array by field
function sortArray(array, field, ascending = true) {
    return array.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        
        if (aVal < bVal) return ascending ? -1 : 1;
        if (aVal > bVal) return ascending ? 1 : -1;
        return 0;
    });
}

// Filter array by date range
function filterByDateRange(array, dateField, startDate, endDate) {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    return array.filter(item => {
        const itemDate = new Date(item[dateField]);
        if (start && itemDate < start) return false;
        if (end && itemDate > end) return false;
        return true;
    });
}

// Get unique values from array
function getUniqueValues(array, field) {
    return [...new Set(array.map(item => item[field]))];
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if user has permission
function hasPermission(action) {
    const role = app.currentRole;
    
    const permissions = {
        'admin': ['create', 'read', 'update', 'delete', 'approve', 'manage_users'],
        'tu': ['create', 'read', 'update', 'delete'],
        'kepala': ['read', 'approve']
    };
    
    return permissions[role] && permissions[role].includes(action);
}

// Generate random ID
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// Get current date in ISO format
function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

// Get current datetime in ISO format
function getCurrentDateTime() {
    return new Date().toISOString();
}

// Calculate days difference
function daysDifference(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Check if date is today
function isToday(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

// Check if date is this week
function isThisWeek(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return date >= weekAgo && date <= today;
}

// Check if date is this month
function isThisMonth(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    return date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

// Format number with thousands separator
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone number (Indonesian format)
function validatePhone(phone) {
    const re = /^(\+62|62|0)[0-9]{9,12}$/;
    return re.test(phone);
}

// Clear all filters
function clearFilters(pageType) {
    if (pageType === 'suratMasuk') {
        document.getElementById('searchSuratMasuk').value = '';
        document.getElementById('filterTanggalMasuk').value = '';
        document.getElementById('filterAsalSurat').value = '';
        document.getElementById('filterStatusBaca').value = '';
        renderSuratMasuk();
    } else if (pageType === 'suratKeluar') {
        document.getElementById('searchSuratKeluar').value = '';
        document.getElementById('filterTanggalKeluar').value = '';
        document.getElementById('filterStatusApproval').value = '';
        renderSuratKeluar();
    } else if (pageType === 'arsip') {
        document.getElementById('searchArsip').value = '';
        document.getElementById('filterKategoriArsip').value = '';
        renderArsip();
    }
}

// Print page
function printPage() {
    window.print();
}

// Backup data to localStorage
function backupData() {
    const data = {
        users: localStorage.getItem('users'),
        suratMasuk: localStorage.getItem('suratMasuk'),
        suratKeluar: localStorage.getItem('suratKeluar'),
        arsip: localStorage.getItem('arsip'),
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_tuonline_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Backup berhasil dibuat!', 'success');
}

// Restore data from backup
function restoreData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            if (confirm('Apakah Anda yakin ingin restore data? Data saat ini akan ditimpa!')) {
                if (data.users) localStorage.setItem('users', data.users);
                if (data.suratMasuk) localStorage.setItem('suratMasuk', data.suratMasuk);
                if (data.suratKeluar) localStorage.setItem('suratKeluar', data.suratKeluar);
                if (data.arsip) localStorage.setItem('arsip', data.arsip);
                
                showToast('Data berhasil direstore! Halaman akan dimuat ulang.', 'success');
                setTimeout(() => location.reload(), 2000);
            }
        } catch (error) {
            showToast('File backup tidak valid!', 'error');
        }
    };
    reader.readAsText(file);
}

// Initialize tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('[title]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = e.target.getAttribute('title');
            document.body.appendChild(tooltip);
            
            const rect = e.target.getBoundingClientRect();
            tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        });
        
        element.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) tooltip.remove();
        });
    });
}

// Log activity
function logActivity(action, details) {
    const log = {
        user: app.currentUser,
        role: app.currentRole,
        action: action,
        details: details,
        timestamp: new Date().toISOString()
    };
    
    let logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
    logs.push(log);
    
    // Keep only last 100 logs
    if (logs.length > 100) {
        logs = logs.slice(-100);
    }
    
    localStorage.setItem('activityLogs', JSON.stringify(logs));
}
