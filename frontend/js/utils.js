/**
 * AI-POWERED PERSONALIZED LEARNING PLATFORM
 * Utility Functions (utils.js)
 */

// 1. Toast Notification System
function showToast(message, type = 'info', duration = 4000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconName = type === 'success' ? 'check-circle' : (type === 'error' ? 'alert-triangle' : (type === 'warning' ? 'alert-circle' : 'info'));

  toast.innerHTML = `
    <i data-lucide="${iconName}" class="toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
      <div>${message}</div>
    </div>
    <button class="toast-close" aria-label="Close">&times;</button>
  `;

  container.appendChild(toast);

  // Trigger Lucide icons for the toast icon
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  });

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }
  }, duration);
}

// 2. Lucide Icons Refresher
function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

// 3. Modal Dialog Helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    refreshIcons();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
  }
}

// 4. Mobile Sidebar Drawer Toggle
function setupSidebarToggle() {
  const toggleBtn = document.querySelector('.menu-toggle-btn');
  const sidebar = document.querySelector('.app-sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }
}

// 5. User UI Header Sync
function syncUserHeader() {
  const user = window.AuthService ? window.AuthService.getCurrentUser() : null;
  if (!user) return;

  const nameEls = document.querySelectorAll('.sync-user-name');
  nameEls.forEach(el => { el.textContent = user.name || 'Alex Morgan'; });

  const roleEls = document.querySelectorAll('.sync-user-role');
  roleEls.forEach(el => { el.textContent = (user.role || 'Student').toUpperCase(); });

  const avatarEls = document.querySelectorAll('.sync-user-avatar');
  avatarEls.forEach(el => {
    const initials = (user.name || 'Alex Morgan').split(' ').map(n => n[0]).join('').substring(0, 2);
    el.textContent = initials.toUpperCase();
  });
}

// 6. Safe HTML String Escaping
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  refreshIcons();
  setupSidebarToggle();
  syncUserHeader();
});

window.Utils = {
  showToast,
  refreshIcons,
  openModal,
  closeModal,
  syncUserHeader,
  escapeHtml
};
