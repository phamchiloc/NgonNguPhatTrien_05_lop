// API Base URL
const API_URL = 'http://localhost:3000/api/v1';

// Store data
let allUsers = [];
let allRoles = [];
let confirmCallback = null;

// Load data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    loadRoles();
    loadRolesForSelect();
    loadRoleFilter();
});

// Toast notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Confirm modal
function showConfirm(title, message, callback) {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    document.getElementById('confirm-modal').style.display = 'flex';
    
    confirmCallback = callback;
    document.getElementById('confirm-btn').onclick = function() {
        if (confirmCallback) confirmCallback();
        hideConfirmModal();
    };
}

function hideConfirmModal() {
    document.getElementById('confirm-modal').style.display = 'none';
    confirmCallback = null;
}

// Tab switching
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.closest('.tab-btn').classList.add('active');
}

// ============== USERS FUNCTIONS ==============

async function loadUsers() {
    const container = document.getElementById('users-list');
    container.innerHTML = '<div class="loading">⏳ Đang tải dữ liệu...</div>';
    
    try {
        const response = await fetch(`${API_URL}/users`);
        allUsers = await response.json();
        
        displayUsers(allUsers);
        updateUsersCount(allUsers.length);
    } catch (error) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">❌</div>
                <p>Lỗi: ${error.message}</p>
            </div>
        `;
        showToast('Không thể tải danh sách users', 'error');
    }
}

function displayUsers(users) {
    const container = document.getElementById('users-list');
    
    if (users.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <p>Chưa có user nào</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = users.map(user => `
        <div class="card">
            <div class="card-header">
                <div class="user-info">
                    <img src="${user.avatarUrl}" alt="${user.username}" class="avatar" 
                         onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=667eea&color=fff'">
                    <div>
                        <div class="card-title">${user.username}</div>
                        <small style="color: #718096;">${user.email}</small>
                    </div>
                </div>
                <span class="badge ${user.status ? 'badge-success' : 'badge-danger'}">
                    ${user.status ? '✓ Active' : '✗ Inactive'}
                </span>
            </div>
            <div class="card-body">
                <p><strong>👤 Full Name:</strong> ${user.fullName || '<i>Chưa cập nhật</i>'}</p>
                <p><strong>🔐 Role:</strong> ${user.role ? `<span class="badge badge-info">${user.role.name}</span>` : '<i>No role</i>'}</p>
                <p><strong>🔢 Login Count:</strong> ${user.loginCount}</p>
                <p><strong>📅 Created:</strong> ${new Date(user.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div class="card-actions">
                ${user.status 
                    ? `<button class="btn btn-warning" onclick="disableUser('${user.email}', '${user.username}')">
                        <span>🔒</span> Disable
                      </button>`
                    : `<button class="btn btn-success" onclick="enableUser('${user.email}', '${user.username}')">
                        <span>🔓</span> Enable
                      </button>`
                }
                <button class="btn btn-info" onclick="editUser('${user._id}', '${user.fullName || ''}')">
                    <span>✏️</span> Edit
                </button>
                <button class="btn btn-danger" onclick="confirmDeleteUser('${user._id}', '${user.username}')">
                    <span>🗑️</span> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function updateUsersCount(count) {
    document.getElementById('users-count').textContent = `${count} user${count !== 1 ? 's' : ''}`;
}

function filterUsers() {
    const searchTerm = document.getElementById('user-search').value.toLowerCase();
    const statusFilter = document.getElementById('user-status-filter').value;
    const roleFilter = document.getElementById('user-role-filter').value;
    
    let filtered = allUsers.filter(user => {
        const matchSearch = !searchTerm || 
            user.username.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            (user.fullName && user.fullName.toLowerCase().includes(searchTerm));
        
        const matchStatus = !statusFilter || 
            (statusFilter === 'active' && user.status) ||
            (statusFilter === 'inactive' && !user.status);
        
        const matchRole = !roleFilter || (user.role && user.role._id === roleFilter);
        
        return matchSearch && matchStatus && matchRole;
    });
    
    displayUsers(filtered);
    updateUsersCount(filtered.length);
}

function resetFilters() {
    document.getElementById('user-search').value = '';
    document.getElementById('user-status-filter').value = '';
    document.getElementById('user-role-filter').value = '';
    filterUsers();
}

function showAddUserForm() {
    document.getElementById('add-user-form').style.display = 'flex';
}

function hideAddUserForm() {
    document.getElementById('add-user-form').style.display = 'none';
    document.querySelector('#add-user-form form').reset();
}

async function addUser(event) {
    event.preventDefault();
    
    const userData = {
        username: document.getElementById('user-username').value,
        password: document.getElementById('user-password').value,
        email: document.getElementById('user-email').value,
        fullName: document.getElementById('user-fullname').value,
        avatarUrl: document.getElementById('user-avatar').value,
        roleId: document.getElementById('user-role').value,
        status: document.getElementById('user-status').checked
    };
    
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        if (response.ok) {
            showToast('Thêm user thành công!', 'success');
            hideAddUserForm();
            loadUsers();
        } else {
            const error = await response.json();
            showToast(error.message, 'error');
        }
    } catch (error) {
        showToast('Lỗi: ' + error.message, 'error');
    }
}

async function enableUser(email, username) {
    try {
        const response = await fetch(`${API_URL}/users/enable`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username })
        });
        
        if (response.ok) {
            showToast(`User "${username}" đã được kích hoạt!`, 'success');
            loadUsers();
        } else {
            const error = await response.json();
            showToast(error.message, 'error');
        }
    } catch (error) {
        showToast('Lỗi: ' + error.message, 'error');
    }
}

async function disableUser(email, username) {
    showConfirm(
        'Vô hiệu hóa User',
        `Bạn có chắc muốn vô hiệu hóa user "${username}"?`,
        async () => {
            try {
                const response = await fetch(`${API_URL}/users/disable`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, username })
                });
                
                if (response.ok) {
                    showToast(`User "${username}" đã bị vô hiệu hóa!`, 'success');
                    loadUsers();
                } else {
                    const error = await response.json();
                    showToast(error.message, 'error');
                }
            } catch (error) {
                showToast('Lỗi: ' + error.message, 'error');
            }
        }
    );
}

function confirmDeleteUser(id, username) {
    showConfirm(
        'Xóa User',
        `Bạn có chắc muốn xóa user "${username}"? Hành động này không thể hoàn tác.`,
        () => deleteUser(id, username)
    );
}

async function deleteUser(id, username) {
    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast(`Đã xóa user "${username}"!`, 'success');
            loadUsers();
        } else {
            showToast('Không thể xóa user!', 'error');
        }
    } catch (error) {
        showToast('Lỗi: ' + error.message, 'error');
    }
}

async function editUser(id, currentName) {
    const newName = prompt('Nhập tên mới:', currentName);
    if (!newName || newName === currentName) return;
    
    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName: newName })
        });
        
        if (response.ok) {
            showToast('Cập nhật thành công!', 'success');
            loadUsers();
        } else {
            showToast('Không thể cập nhật!', 'error');
        }
    } catch (error) {
        showToast('Lỗi: ' + error.message, 'error');
    }
}

// ============== ROLES FUNCTIONS ==============

async function loadRoles() {
    const container = document.getElementById('roles-list');
    container.innerHTML = '<div class="loading">⏳ Đang tải dữ liệu...</div>';
    
    try {
        const response = await fetch(`${API_URL}/roles`);
        allRoles = await response.json();
        
        displayRoles(allRoles);
        updateRolesCount(allRoles.length);
    } catch (error) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">❌</div>
                <p>Lỗi: ${error.message}</p>
            </div>
        `;
        showToast('Không thể tải danh sách roles', 'error');
    }
}

function displayRoles(roles) {
    const container = document.getElementById('roles-list');
    
    if (roles.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <p>Chưa có role nào</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = roles.map(role => `
        <div class="card">
            <div class="card-header">
                <div class="card-title">🔐 ${role.name}</div>
            </div>
            <div class="card-body">
                <p><strong>🆔 ID:</strong> ${role._id}</p>
                <p><strong>📝 Description:</strong> ${role.description || '<i>Chưa có mô tả</i>'}</p>
                <p><strong>📅 Created:</strong> ${new Date(role.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div class="card-actions">
                <button class="btn btn-info" onclick="editRole('${role._id}', '${(role.description || '').replace(/'/g, "\\'")}')">
                    <span>✏️</span> Edit
                </button>
                <button class="btn btn-danger" onclick="confirmDeleteRole('${role._id}', '${role.name}')">
                    <span>🗑️</span> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function updateRolesCount(count) {
    document.getElementById('roles-count').textContent = `${count} role${count !== 1 ? 's' : ''}`;
}

function filterRoles() {
    const searchTerm = document.getElementById('role-search').value.toLowerCase();
    
    let filtered = allRoles.filter(role => 
        role.name.toLowerCase().includes(searchTerm) ||
        (role.description && role.description.toLowerCase().includes(searchTerm))
    );
    
    displayRoles(filtered);
    updateRolesCount(filtered.length);
}

async function loadRolesForSelect() {
    try {
        const response = await fetch(`${API_URL}/roles`);
        const roles = await response.json();
        
        const select = document.getElementById('user-role');
        select.innerHTML = '<option value="">-- Chọn Role --</option>' +
            roles.map(role => `<option value="${role._id}">${role.name}</option>`).join('');
    } catch (error) {
        console.error('Error loading roles for select:', error);
    }
}

async function loadRoleFilter() {
    try {
        const response = await fetch(`${API_URL}/roles`);
        const roles = await response.json();
        
        const select = document.getElementById('user-role-filter');
        select.innerHTML = '<option value="">Tất cả roles</option>' +
            roles.map(role => `<option value="${role._id}">${role.name}</option>`).join('');
    } catch (error) {
        console.error('Error loading roles for filter:', error);
    }
}

function showAddRoleForm() {
    document.getElementById('add-role-form').style.display = 'flex';
}

function hideAddRoleForm() {
    document.getElementById('add-role-form').style.display = 'none';
    document.querySelector('#add-role-form form').reset();
}

async function addRole(event) {
    event.preventDefault();
    
    const roleData = {
        name: document.getElementById('role-name').value,
        description: document.getElementById('role-description').value
    };
    
    try {
        const response = await fetch(`${API_URL}/roles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(roleData)
        });
        
        if (response.ok) {
            showToast('Thêm role thành công!', 'success');
            hideAddRoleForm();
            loadRoles();
            loadRolesForSelect();
            loadRoleFilter();
        } else {
            const error = await response.json();
            showToast(error.message, 'error');
        }
    } catch (error) {
        showToast('Lỗi: ' + error.message, 'error');
    }
}

async function editRole(id, currentDescription) {
    const newDescription = prompt('Nhập mô tả mới:', currentDescription);
    if (newDescription === null) return;
    
    try {
        const response = await fetch(`${API_URL}/roles/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: newDescription })
        });
        
        if (response.ok) {
            showToast('Cập nhật thành công!', 'success');
            loadRoles();
        } else {
            showToast('Không thể cập nhật!', 'error');
        }
    } catch (error) {
        showToast('Lỗi: ' + error.message, 'error');
    }
}

function confirmDeleteRole(id, name) {
    showConfirm(
        'Xóa Role',
        `Bạn có chắc muốn xóa role "${name}"?`,
        () => deleteRole(id, name)
    );
}

async function deleteRole(id, name) {
    try {
        const response = await fetch(`${API_URL}/roles/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast(`Đã xóa role "${name}"!`, 'success');
            loadRoles();
            loadRolesForSelect();
            loadRoleFilter();
        } else {
            showToast('Không thể xóa role!', 'error');
        }
    } catch (error) {
        showToast('Lỗi: ' + error.message, 'error');
    }
}
