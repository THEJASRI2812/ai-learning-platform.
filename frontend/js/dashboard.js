/**
 * AI-POWERED PERSONALIZED LEARNING PLATFORM
 * Student Dashboard Script (dashboard.js)
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Ensure user is authenticated as student
  if (window.AuthService && !window.AuthService.requireAuth(['student'])) {
    return;
  }

  const user = window.AuthService ? window.AuthService.getCurrentUser() : null;
  const studentNameEl = document.getElementById('studentWelcomeName');
  if (studentNameEl && user) {
    studentNameEl.textContent = user.name || 'Alex Morgan';
  }

  try {
    // 1. Fetch student data & progress
    const studentRes = await window.ApiClient.getStudent();
    const progressRes = await window.ApiClient.getStudentProgress();

    // 2. Populate Metric Cards
    if (studentRes && studentRes.student) {
      const kpis = studentRes.student.kpis || {
        learningProgress: 72,
        assessmentScore: 84,
        currentLevel: 'Level 4: Advanced Practitioner',
        completedCourses: 3,
        learningStreak: 7,
        skillScore: 78
      };

      document.getElementById('kpiLearningProgress').textContent = `${kpis.learningProgress}%`;
      document.getElementById('kpiAssessmentScore').textContent = `${kpis.assessmentScore}%`;
      document.getElementById('kpiCurrentLevel').textContent = kpis.currentLevel.split(':')[0];
      document.getElementById('kpiCompletedCourses').textContent = kpis.completedCourses;
      document.getElementById('kpiLearningStreak').textContent = `${kpis.learningStreak} Days`;
      document.getElementById('kpiSkillScore').textContent = kpis.skillScore;
    }

    // 3. Render Chart.js Visualizations
    if (progressRes && progressRes.progress && window.ChartHelper) {
      const p = progressRes.progress;

      // Chart 1: Weekly Activity (Line)
      window.ChartHelper.createLineChart(
        'weeklyActivityChart',
        p.weeklyActivity.labels,
        p.weeklyActivity.hours,
        'Hours Studied'
      );

      // Chart 2: Assessment Performance (Bar)
      window.ChartHelper.createBarChart(
        'assessmentPerfChart',
        ['Python Basics', 'OOP Lab', 'SQL Queries', 'Probability', 'ML Intro'],
        [88, 82, 60, 45, 78],
        'Score (%)'
      );

      // Chart 3: Skill Progress (Radar)
      window.ChartHelper.createRadarChart(
        'skillProgressChart',
        p.topicMastery.labels,
        p.topicMastery.scores,
        [90, 80, 75, 85, 70, 85] // Industry benchmark
      );
    }
  } catch (err) {
    console.error('[Dashboard] Error loading data:', err);
    if (window.Utils) {
      window.Utils.showToast('Unable to load some live metrics. Showing cached data.', 'warning');
    }
  }

  // Refresh Lucide Icons
  if (window.Utils) {
    window.Utils.refreshIcons();
  }
});
