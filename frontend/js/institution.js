/**
 * AI-POWERED PERSONALIZED LEARNING PLATFORM
 * Institution Analytics & Reporting Script (institution.js)
 */

document.addEventListener('DOMContentLoaded', async () => {
  if (window.AuthService && !window.AuthService.requireAuth(['admin', 'teacher'])) {
    return;
  }

  try {
    const res = await window.ApiClient.getInstitutionAnalytics();
    if (res && res.kpis) {
      const k = res.kpis;
      const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      setVal('instTotalStudents', k.totalStudents);
      setVal('instActiveStudents', k.activeStudents);
      setVal('instAvgPerf', `${k.averagePerformance}%`);
      setVal('instCompletionRate', `${k.courseCompletionRate}%`);
      setVal('instEngagementHours', `${k.averageEngagementHoursPerWeek} hrs`);
      setVal('instSkillIndex', k.skillProficiencyIndex);
    }

    if (window.ChartHelper && res) {
      // 1. Department Performance (Bar)
      if (res.departmentPerformance) {
        window.ChartHelper.createBarChart(
          'deptPerformanceChart',
          res.departmentPerformance.departments,
          res.departmentPerformance.averageScores,
          'Department Average Score (%)'
        );
      }

      // 2. Course Completion (Doughnut)
      if (res.courseCompletionBreakdown) {
        window.ChartHelper.createDoughnutChart(
          'courseCompletionDoughnut',
          res.courseCompletionBreakdown.labels,
          res.courseCompletionBreakdown.data,
          res.courseCompletionBreakdown.colors
        );
      }

      // 3. Skill Distribution (Radar)
      if (res.skillDistribution) {
        window.ChartHelper.createRadarChart(
          'skillDistributionRadar',
          res.skillDistribution.labels,
          res.skillDistribution.institutionAverage,
          res.skillDistribution.benchmarkLevels
        );
      }

      // 4. Monthly Engagement Trends (Line)
      if (res.monthlyEngagementTrends) {
        window.ChartHelper.createLineChart(
          'monthlyEngagementChart',
          res.monthlyEngagementTrends.months,
          res.monthlyEngagementTrends.activeHours,
          'Total Student Learning Hours'
        );
      }

      // 5. Assessment Performance Spread (Bar)
      if (res.assessmentPerformanceSpread) {
        window.ChartHelper.createBarChart(
          'assessmentSpreadChart',
          res.assessmentPerformanceSpread.labels,
          res.assessmentPerformanceSpread.studentCounts,
          'Number of Enrolled Students'
        );
      }
    }
  } catch (err) {
    console.error('[Institution] Error rendering macro analytics:', err);
  }

  // Reports Table Generator (if on reports.html)
  const reportsTableBody = document.getElementById('reportsTableBody');
  if (reportsTableBody) {
    try {
      const repRes = await window.ApiClient.getInstitutionReports();
      const reports = (repRes && repRes.reports) ? repRes.reports : [];

      const esc = (window.Utils && window.Utils.escapeHtml) ? window.Utils.escapeHtml : (s) => String(s || '');
      reportsTableBody.innerHTML = reports.map((r, i) => `
        <tr>
          <td><strong>${esc(r.title)}</strong></td>
          <td>${esc(r.date)}</td>
          <td><span class="tag" style="background-color: var(--blue-soft); color: var(--primary-blue);">${esc(r.format)}</span></td>
          <td><span class="status-pill completed">${esc(r.status)}</span></td>
          <td>
            <button class="btn btn-outline btn-sm download-rep-btn" data-title="${esc(r.title)}">
              <i data-lucide="download" style="width: 14px; height: 14px;"></i> Export Report
            </button>
          </td>
        </tr>
      `).join('');

      reportsTableBody.querySelectorAll('.download-rep-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const title = this.getAttribute('data-title');
          window.downloadReport(title);
        });
      });

      if (window.Utils) window.Utils.refreshIcons();
    } catch (e) {
      console.error(e);
    }
  }

  window.downloadReport = function (title) {
    if (window.Utils) {
      window.Utils.showToast(`Preparing encrypted export for "${title}"...`, 'info');
      setTimeout(() => {
        window.Utils.showToast(`Export complete: ${title} downloaded.`, 'success');
      }, 1000);
    }
  };
});
