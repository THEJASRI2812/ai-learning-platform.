/**
 * AI-POWERED PERSONALIZED LEARNING PLATFORM
 * Personalized Learning Path Script (learning-path.js)
 */

document.addEventListener('DOMContentLoaded', async () => {
  if (window.AuthService && !window.AuthService.requireAuth(['student'])) {
    return;
  }

  const container = document.getElementById('learningPathContainer');
  if (!container) return;

  try {
    const res = await window.ApiClient.getCourses();
    const pythonCourse = (res && res.courses && res.courses[0]) ? res.courses[0] : null;

    const modules = (pythonCourse && pythonCourse.modules) ? pythonCourse.modules : [
      { id: 'm-1', title: 'Python Basics', description: 'Variables, primitive data types, conditionals, loops, and terminal I/O.', orderNumber: 1, status: 'Completed', difficulty: 'Beginner', estimatedTime: '4 Hours', progress: 100 },
      { id: 'm-2', title: 'Python Functions', description: 'First-class functions, recursion, lambda expressions, and scope mechanics.', orderNumber: 2, status: 'Completed', difficulty: 'Beginner', estimatedTime: '5 Hours', progress: 100 },
      { id: 'm-3', title: 'OOP (Object-Oriented Programming)', description: 'Classes, inheritance, encapsulation, polymorphism, and dunder methods.', orderNumber: 3, status: 'Completed', difficulty: 'Intermediate', estimatedTime: '6 Hours', progress: 100 },
      { id: 'm-4', title: 'NumPy', description: 'Multidimensional arrays, broadcasting, matrix mathematics, and vectorized operations.', orderNumber: 4, status: 'Completed', difficulty: 'Intermediate', estimatedTime: '5 Hours', progress: 100 },
      { id: 'm-5', title: 'Pandas', description: 'Series, DataFrames, data cleaning, aggregation, grouping, and merging datasets.', orderNumber: 5, status: 'In Progress', difficulty: 'Intermediate', estimatedTime: '7 Hours', progress: 45 },
      { id: 'm-6', title: 'Machine Learning', description: 'Scikit-learn, train/test splitting, linear regression, decision trees, and metrics.', orderNumber: 6, status: 'Recommended', difficulty: 'Advanced', estimatedTime: '8 Hours', progress: 0 },
      { id: 'm-7', title: 'Project', description: 'End-to-end predictive machine learning model pipeline deployed with visualization.', orderNumber: 7, status: 'Locked', difficulty: 'Advanced', estimatedTime: '10 Hours', progress: 0 }
    ];

    container.innerHTML = modules.map((mod, index) => {
      const statusClass = mod.status.toLowerCase().replace(/\s+/g, '-');
      const isLocked = mod.status === 'Locked';
      const isCompleted = mod.status === 'Completed';

      let actionBtnText = 'Start Module';
      let actionBtnClass = 'btn-primary';
      if (isCompleted) {
        actionBtnText = 'Review Material';
        actionBtnClass = 'btn-outline';
      } else if (mod.status === 'In Progress') {
        actionBtnText = 'Continue Learning';
        actionBtnClass = 'btn-purple';
      } else if (isLocked) {
        actionBtnText = 'Locked';
        actionBtnClass = 'btn-outline';
      }

      return `
        <div class="timeline-module-item ${statusClass}">
          <div class="timeline-status-node">
            ${isCompleted ? '<i data-lucide="check" style="width: 22px; height: 22px;"></i>' : (isLocked ? '<i data-lucide="lock" style="width: 20px; height: 20px;"></i>' : mod.orderNumber)}
          </div>
          <div class="timeline-module-card">
            <div class="module-meta-row">
              <span class="status-pill ${statusClass}">${mod.status}</span>
              <span style="font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px;">
                <i data-lucide="clock" style="width: 14px; height: 14px;"></i> ${mod.estimatedTime}
              </span>
            </div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--primary-navy); margin: 6px 0;">
              ${mod.orderNumber}. ${mod.title}
            </h3>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 12px; line-height: 1.5;">
              ${mod.description}
            </p>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-color);">
              <span style="font-size: 0.85rem; font-weight: 600; color: var(--primary-navy);">
                Difficulty: <span style="color: var(--primary-blue);">${mod.difficulty || 'Intermediate'}</span>
              </span>
              <button class="btn btn-sm ${actionBtnClass} module-action-btn" ${isLocked ? 'disabled' : ''} data-title="${(window.Utils && window.Utils.escapeHtml) ? window.Utils.escapeHtml(mod.title) : mod.title}" data-status="${mod.status}">
                ${actionBtnText}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.module-action-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const title = this.getAttribute('data-title');
        const status = this.getAttribute('data-status');
        window.handleModuleClick(title, status);
      });
    });

    if (window.Utils) window.Utils.refreshIcons();
  } catch (err) {
    console.error('[LearningPath] Error:', err);
  }

  window.handleModuleClick = function (title, status) {
    if (status === 'Locked') {
      if (window.Utils) window.Utils.showToast('Complete preceding modules to unlock this stage.', 'warning');
      return;
    }
    if (window.Utils) {
      window.Utils.showToast(`Loading study workspace for "${title}"...`, 'info');
    }
  };
});
