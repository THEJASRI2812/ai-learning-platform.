/**
 * AI-POWERED PERSONALIZED LEARNING PLATFORM
 * Teacher Portal & Risk Analytics Script (teacher.js)
 */

document.addEventListener('DOMContentLoaded', async () => {
  if (window.AuthService && !window.AuthService.requireAuth(['teacher', 'admin'])) {
    return;
  }

  const studentsTableBody = document.getElementById('teacherStudentsTableBody');
  const riskContainer = document.getElementById('riskStudentsContainer');

  // 1. Load Teacher Students Roster (for teacher-dashboard.html and teacher-students.html)
  if (studentsTableBody) {
    try {
      const res = await window.ApiClient.getTeacherStudents();
      const students = (res && res.students) ? res.students : [];

      // Update KPI metrics if present
      if (res && res.metrics) {
        const m = res.metrics;
        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setVal('teacherTotalStudents', m.totalStudents);
        setVal('teacherAvgScore', `${m.averageScore}%`);
        setVal('teacherCompletionRate', `${m.courseCompletionRate}%`);
        setVal('teacherActiveStudents', m.activeStudents);
        setVal('teacherNeedingSupport', m.studentsNeedingSupport);
      }

      const esc = (window.Utils && window.Utils.escapeHtml) ? window.Utils.escapeHtml : (s) => String(s || '');
      studentsTableBody.innerHTML = students.map(s => {
        const statusClass = s.status === 'Active' ? 'completed' : (s.status === 'Excelling' ? 'in-progress' : 'locked');
        return `
          <tr>
            <td>
              <div style="font-weight: 700; color: var(--primary-navy);">${esc(s.name)}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${esc(s.email)}</div>
            </td>
            <td>${esc(s.department)}</td>
            <td>
              <div style="font-weight: 600;">${Number(s.progress)}%</div>
              <div class="skill-bar-track" style="height: 6px; width: 100px; margin-top: 4px;">
                <div class="skill-bar-fill blue" style="width: ${Number(s.progress)}%;"></div>
              </div>
            </td>
            <td><strong>${Number(s.score)}%</strong></td>
            <td><span style="font-size: 0.85rem; color: var(--text-dark);">${esc(s.skillGap)}</span></td>
            <td><span class="status-pill ${statusClass}">${esc(s.status)}</span></td>
            <td>
              <div style="display: flex; gap: 6px;">
                <button class="btn btn-outline btn-sm view-student-btn" data-id="${esc(s.id)}" data-name="${esc(s.name)}">View</button>
                <button class="btn btn-primary btn-sm support-student-btn" data-id="${esc(s.id)}" data-name="${esc(s.name)}">Support</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      studentsTableBody.querySelectorAll('.view-student-btn').forEach(b => {
        b.addEventListener('click', function() {
          window.viewStudentDetails(this.getAttribute('data-id'), this.getAttribute('data-name'));
        });
      });
      studentsTableBody.querySelectorAll('.support-student-btn').forEach(b => {
        b.addEventListener('click', function() {
          window.openInterventionModal(this.getAttribute('data-id'), this.getAttribute('data-name'));
        });
      });

      if (window.Utils) window.Utils.refreshIcons();
    } catch (err) {
      console.error('[Teacher] Error loading students:', err);
    }
  }

  // 2. Load At-Risk Analysis (for risk-analysis.html)
  if (riskContainer) {
    try {
      const riskRes = await window.ApiClient.getTeacherRiskAnalysis();
      const list = (riskRes && riskRes.atRiskStudents) ? riskRes.atRiskStudents : [];
      const esc = (window.Utils && window.Utils.escapeHtml) ? window.Utils.escapeHtml : (s) => String(s || '');

      riskContainer.innerHTML = list.map(item => {
        const riskLevel = (item.riskLevel || 'Medium').toLowerCase();
        return `
          <div style="background-color: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 16px; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <div>
                <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--primary-navy); margin-bottom: 2px;">
                  ${esc(item.name)}
                </h3>
                <div style="font-size: 0.85rem; color: var(--text-muted);">${esc(item.department)}</div>
              </div>
              <span class="badge-risk ${riskLevel}">
                ${esc(item.riskLevel)} Risk Indicator
              </span>
            </div>

            <div style="margin-bottom: 10px;">
              <strong style="font-size: 0.85rem; color: var(--text-dark);">Measurable Indicators:</strong>
              <div class="tag-list" style="margin-top: 4px;">
                ${(item.indicators || []).map(ind => `<span class="tag" style="background-color: #fee2e2; color: #b91c1c;">${esc(ind)}</span>`).join('')}
              </div>
            </div>

            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 12px; line-height: 1.5;">
              <strong>Diagnostic Reason:</strong> ${esc(item.reason)}
            </p>

            <div style="background-color: var(--blue-soft); border-left: 3px solid var(--primary-blue); padding: 10px 14px; border-radius: var(--radius-sm); margin-bottom: 14px; font-size: 0.85rem;">
              <strong>Suggested Pedagogical Support:</strong> ${esc(item.suggestedSupport)}
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 8px;">
              <button class="btn btn-outline btn-sm view-risk-student-btn" data-id="${esc(item.id)}" data-name="${esc(item.name)}">Detailed History</button>
              <button class="btn btn-primary btn-sm support-risk-student-btn" data-id="${esc(item.id)}" data-name="${esc(item.name)}">Record Faculty Note</button>
            </div>
          </div>
        `;
      }).join('');

      riskContainer.querySelectorAll('.view-risk-student-btn').forEach(b => {
        b.addEventListener('click', function() {
          window.viewStudentDetails(this.getAttribute('data-id'), this.getAttribute('data-name'));
        });
      });
      riskContainer.querySelectorAll('.support-risk-student-btn').forEach(b => {
        b.addEventListener('click', function() {
          window.openInterventionModal(this.getAttribute('data-id'), this.getAttribute('data-name'));
        });
      });

      if (window.Utils) window.Utils.refreshIcons();
    } catch (err) {
      console.error('[RiskAnalysis] Error:', err);
    }
  }

  // Helper actions
  window.viewStudentDetails = function (id, name) {
    localStorage.setItem('edulearn_active_student_view', JSON.stringify({ id, name }));
    window.location.href = 'student-details.html';
  };

  window.openInterventionModal = function (id, name) {
    const studentNameField = document.getElementById('modalStudentName');
    const studentIdField = document.getElementById('modalStudentId');
    if (studentNameField) studentNameField.textContent = name;
    if (studentIdField) studentIdField.value = id;
    if (window.Utils) window.Utils.openModal('noteInterventionModal');
  };

  window.saveTeacherNote = async function () {
    const id = document.getElementById('modalStudentId')?.value;
    const noteText = document.getElementById('modalNoteContent')?.value;

    if (!noteText) {
      if (window.Utils) window.Utils.showToast('Please enter an observation note before saving.', 'warning');
      return;
    }

    try {
      await window.ApiClient.postTeacherNote(id, noteText);
      if (window.Utils) {
        window.Utils.closeModal('noteInterventionModal');
        window.Utils.showToast('Faculty guidance note saved to student academic record.', 'success');
      }
      document.getElementById('modalNoteContent').value = '';
    } catch (e) {
      console.error(e);
    }
  };
});
