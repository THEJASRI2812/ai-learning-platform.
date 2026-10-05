/**
 * AI-POWERED PERSONALIZED LEARNING PLATFORM
 * Deep Progress Analytics Script (progress.js)
 */

document.addEventListener('DOMContentLoaded', async () => {
  if (window.AuthService && !window.AuthService.requireAuth(['student'])) {
    return;
  }

  try {
    const res = await window.ApiClient.getStudentProgress();
    const p = (res && res.progress) ? res.progress : {
      overallProgress: 72,
      learningStreak: 7,
      hoursLearnedThisWeek: 14.5,
      hoursLearnedThisMonth: 58.0,
      completedCourses: 3,
      inProgressCourses: 2,
      assessmentAverage: 82.5,
      weeklyActivity: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        hours: [2.5, 3.0, 1.5, 4.0, 2.0, 1.0, 2.5]
      },
      monthlyTrend: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        hours: [12, 16, 14, 16]
      },
      topicMastery: {
        labels: ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Cloud (AWS)', 'Data Structures'],
        scores: [80, 55, 40, 68, 45, 75]
      },
      courseDistribution: {
        completed: 3,
        inProgress: 2,
        recommended: 4
      }
    };

    // Populate KPI Elements
    const overallEl = document.getElementById('progressOverall');
    if (overallEl) overallEl.textContent = `${p.overallProgress}%`;

    const streakEl = document.getElementById('progressStreak');
    if (streakEl) streakEl.textContent = `${p.learningStreak} Days`;

    const weekHoursEl = document.getElementById('progressWeekHours');
    if (weekHoursEl) weekHoursEl.textContent = `${p.hoursLearnedThisWeek} hrs`;

    const monthHoursEl = document.getElementById('progressMonthHours');
    if (monthHoursEl) monthHoursEl.textContent = `${p.hoursLearnedThisMonth} hrs`;

    if (window.ChartHelper) {
      // 1. Line Chart: Weekly / Monthly Learning Hours
      window.ChartHelper.createLineChart(
        'progressLineChart',
        p.weeklyActivity.labels,
        p.weeklyActivity.hours,
        'Active Learning Hours'
      );

      // 2. Bar Chart: Assessment Performance Trends
      window.ChartHelper.createBarChart(
        'progressAssessmentBarChart',
        ['Python Syntax', 'OOP Design', 'SQL Queries', 'Probability', 'ML Baseline'],
        [88, 82, 60, 45, 78],
        'Score (%)'
      );

      // 3. Doughnut Chart: Course Completion Breakdown
      window.ChartHelper.createDoughnutChart(
        'progressDoughnutChart',
        ['Completed Courses', 'In Progress', 'Recommended Pathways'],
        [p.courseDistribution.completed, p.courseDistribution.inProgress, p.courseDistribution.recommended],
        ['#10b981', '#3b82f6', '#8b5cf6']
      );

      // 4. Radar Chart: Skill Growth vs Industry Benchmarks
      window.ChartHelper.createRadarChart(
        'progressRadarChart',
        p.topicMastery.labels,
        p.topicMastery.scores,
        [90, 80, 75, 85, 70, 85]
      );
    }
  } catch (err) {
    console.error('[Progress] Error rendering charts:', err);
  }

  if (window.Utils) window.Utils.refreshIcons();
});
