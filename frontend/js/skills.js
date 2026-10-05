/**
 * AI-POWERED PERSONALIZED LEARNING PLATFORM
 * Skill Gap Detection & Development Script (skills.js)
 */

document.addEventListener('DOMContentLoaded', async () => {
  if (window.AuthService && !window.AuthService.requireAuth(['student'])) {
    return;
  }

  const gapContainer = document.getElementById('skillGapsContainer');
  const catalogContainer = document.getElementById('skillsCatalogContainer');
  const categoryFilters = document.querySelectorAll('.cat-filter-btn');

  // 1. Load Skill Gaps
  try {
    const gapRes = await window.ApiClient.aiSkillGap();
    if (gapRes && gapRes.gaps && gapContainer) {
      gapContainer.innerHTML = gapRes.gaps.map(g => {
        const gapColor = g.gapPercentage > 20 ? 'red' : (g.gapPercentage > 5 ? 'amber' : 'green');
        return `
          <div class="skill-bar-wrapper" style="background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 18px; margin-bottom: 16px; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <div>
                <span style="font-size: 1.1rem; font-weight: 700; color: var(--primary-navy);">${g.skill}</span>
                <span class="status-pill ${gapColor === 'red' ? 'locked' : (gapColor === 'amber' ? 'in-progress' : 'completed')}" style="margin-left: 8px;">
                  ${g.status}
                </span>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 0.85rem; color: var(--text-muted);">Skill Gap: </span>
                <span style="font-weight: 800; font-size: 1rem; color: ${gapColor === 'red' ? '#dc2626' : (gapColor === 'amber' ? '#d97706' : '#059669')};">
                  ${g.gapPercentage}%
                </span>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px;">
              <span>Current Level: <strong>${g.currentLevel}%</strong></span>
              <span>Target Benchmark: <strong>${g.requiredLevel}%</strong></span>
            </div>

            <div class="skill-bar-track" style="height: 14px;">
              <div class="skill-bar-fill ${gapColor === 'red' ? 'red' : (gapColor === 'amber' ? 'amber' : 'green')}" 
                   style="width: ${g.currentLevel}%;"></div>
              <div class="benchmark-marker" style="left: ${g.requiredLevel}%;" title="Target Benchmark (${g.requiredLevel}%)"></div>
            </div>

            <div style="margin-top: 10px; font-size: 0.85rem; color: var(--text-muted); background: var(--bg-subtle); padding: 8px 12px; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 6px;">
              <i data-lucide="sparkles" style="width: 14px; height: 14px; color: var(--primary-purple);"></i>
              <span><strong>Recommendation:</strong> ${g.recommendation}</span>
            </div>
          </div>
        `;
      }).join('');
    }
  } catch (err) {
    console.error('[Skills] Error loading skill gaps:', err);
  }

  // 2. Load Skills Catalog
  async function loadSkillsCatalog(selectedCategory = 'All') {
    if (!catalogContainer) return;
    try {
      const catRes = await window.ApiClient.getSkills(selectedCategory);
      const skills = (catRes && catRes.skills) ? catRes.skills : [];

      const esc = (window.Utils && window.Utils.escapeHtml) ? window.Utils.escapeHtml : (s) => String(s || '');
      catalogContainer.innerHTML = skills.map(sk => `
        <div class="feature-card" style="display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
            <span class="status-pill recommended">${esc(sk.category)}</span>
            <span style="font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px;">
              <i data-lucide="clock" style="width: 14px; height: 14px;"></i> ${esc(sk.duration)}
            </span>
          </div>
          <h3 class="card-title">${esc(sk.name)}</h3>
          <p class="card-text">${esc(sk.description)}</p>
          
          <div style="margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border-color); font-size: 0.85rem;">
            <div style="margin-bottom: 6px;">
              <strong>Hands-on Project:</strong> <span style="color: var(--primary-blue);">${esc(sk.project)}</span>
            </div>
            <div style="margin-bottom: 12px;">
              <strong>Certification:</strong> <span style="color: var(--primary-green);">${esc(sk.certification)}</span>
            </div>
            <button class="btn btn-outline btn-sm start-skill-btn" style="width: 100%;" data-skill="${esc(sk.name)}">
              Explore Skill Pathway
            </button>
          </div>
        </div>
      `).join('');

      catalogContainer.querySelectorAll('.start-skill-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const skill = this.getAttribute('data-skill');
          window.startSkillModule(skill);
        });
      });

      if (window.Utils) window.Utils.refreshIcons();
    } catch (err) {
      console.error('[SkillsCatalog] Error:', err);
    }
  }

  // Category Filter clicks
  categoryFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');
      loadSkillsCatalog(cat);
    });
  });

  // Initial load
  loadSkillsCatalog('All');

  window.startSkillModule = function (skillName) {
    if (window.Utils) {
      window.Utils.showToast(`Enrolled in "${skillName}" specialized learning track!`, 'success');
    }
  };
});
