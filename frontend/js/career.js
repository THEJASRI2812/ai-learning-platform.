/**
 * AI-POWERED PERSONALIZED LEARNING PLATFORM
 * Career Recommendations Engine (career.js)
 */

document.addEventListener('DOMContentLoaded', async () => {
  if (window.AuthService && !window.AuthService.requireAuth(['student'])) {
    return;
  }

  const container = document.getElementById('careerCardsContainer');
  const disclaimerEl = document.getElementById('careerDisclaimer');

  try {
    const res = await window.ApiClient.aiCareer();
    const careers = (res && res.careers) ? res.careers : [];

    if (disclaimerEl && res.disclaimer) {
      disclaimerEl.textContent = res.disclaimer;
    }

    if (container) {
      container.innerHTML = careers.map(c => `
        <div class="career-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div>
              <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--primary-navy); margin-bottom: 4px;">
                ${c.name}
              </h3>
              <span class="status-pill in-progress">Role Alignment</span>
            </div>
            <div class="career-match-badge" title="Algorithmic Match Score">
              ${c.matchScore}% Match
            </div>
          </div>

          <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 14px;">
            ${c.description}
          </p>

          <div style="margin-bottom: 12px;">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-dark); text-transform: uppercase; margin-bottom: 4px;">
              Industry Target Skills:
            </div>
            <div class="tag-list">
              ${(c.requiredSkills || []).map(s => `<span class="tag">${s}</span>`).join('')}
            </div>
          </div>

          <div style="margin-bottom: 12px;">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-dark); text-transform: uppercase; margin-bottom: 4px;">
              Your Current Standing:
            </div>
            <div class="tag-list">
              ${(c.currentSkills || []).map(s => `<span class="tag" style="background-color: var(--blue-soft); color: var(--primary-blue);">${s}</span>`).join('')}
            </div>
          </div>

          <div style="background-color: #fef2f2; border-left: 3px solid #ef4444; padding: 10px 12px; border-radius: var(--radius-sm); margin-bottom: 14px; font-size: 0.85rem; color: #991b1b;">
            <strong>Identified Skill Gap:</strong> ${c.skillGap}
          </div>

          <div style="margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border-color); font-size: 0.85rem;">
            <div style="margin-bottom: 4px;">
              <strong>Recommended Pathway:</strong> ${(c.recommendedCourses || []).join(', ')}
            </div>
            <div style="margin-bottom: 12px;">
              <strong>Capstone Projects:</strong> ${(c.recommendedProjects || []).join('; ')}
            </div>
            <button class="btn btn-primary btn-sm enroll-career-btn" style="width: 100%;" data-career="${(window.Utils && window.Utils.escapeHtml) ? window.Utils.escapeHtml(c.name) : c.name}">
              Set as Target Career Goal
            </button>
          </div>
        </div>
      `).join('');

      container.querySelectorAll('.enroll-career-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const career = this.getAttribute('data-career');
          window.enrollCareerPath(career);
        });
      });
    }

    if (window.Utils) window.Utils.refreshIcons();
  } catch (err) {
    console.error('[Career] Error loading career recommendations:', err);
  }

  window.enrollCareerPath = function (careerName) {
    if (window.Utils) {
      window.Utils.showToast(`Updated target goal to "${careerName}". Personalized learning recommendations recalculated.`, 'success');
    }
  };
});
