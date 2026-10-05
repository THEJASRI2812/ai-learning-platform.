const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

/**
 * GET /api/institution/analytics
 * Executive analytics, department performance, and macro charts
 */
router.get('/analytics', authMiddleware, requireRole(['admin', 'teacher']), (req, res) => {
  res.json({
    success: true,
    kpis: {
      totalStudents: 1850,
      activeStudents: 1620,
      averagePerformance: 79.4,
      courseCompletionRate: 71.8,
      averageEngagementHoursPerWeek: 11.2,
      skillProficiencyIndex: 76.5
    },
    departmentPerformance: {
      departments: ['Computer Science', 'Data Science & AI', 'Information Tech', 'Software Eng', 'Electronics & Comm'],
      averageScores: [82, 85, 74, 78, 72],
      completionRates: [75, 80, 65, 70, 68]
    },
    courseCompletionBreakdown: {
      labels: ['Completed', 'On Track (>50%)', 'Early Stage (<50%)', 'Inactive'],
      data: [718, 542, 360, 230],
      colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
    },
    skillDistribution: {
      labels: ['Programming', 'Data Science', 'Machine Learning', 'Cloud & DevOps', 'Cybersecurity', 'Communication'],
      benchmarkLevels: [85, 80, 75, 70, 70, 80],
      institutionAverage: [79, 74, 69, 58, 52, 77]
    },
    monthlyEngagementTrends: {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      activeHours: [12400, 14200, 16800, 19200, 18400, 21500, 23100, 24800, 26400]
    },
    assessmentPerformanceSpread: {
      labels: ['90-100% (Distinction)', '75-89% (Proficient)', '60-74% (Competent)', '<60% (Remediation)'],
      studentCounts: [480, 760, 420, 190]
    }
  });
});

/**
 * GET /api/institution/reports
 * Institutional reporting dataset
 */
router.get('/reports', authMiddleware, requireRole(['admin', 'teacher']), (req, res) => {
  res.json({
    success: true,
    generatedAt: new Date().toISOString(),
    institution: 'Metropolitan Institute of Technology',
    academicYear: '2026-2027',
    reports: [
      { id: 'rep-01', title: 'Q3 Cohort Competency & Skill Gap Audit', date: 'Sep 2026', format: 'PDF', status: 'Available' },
      { id: 'rep-02', title: 'At-Risk Student Intervention & Retention Report', date: 'Sep 2026', format: 'CSV', status: 'Available' },
      { id: 'rep-03', title: 'Departmental Curriculum Effectiveness Analysis', date: 'Aug 2026', format: 'PDF', status: 'Available' },
      { id: 'rep-04', title: 'AI Learning Engine Adoption & Engagement Metrics', date: 'Aug 2026', format: 'PDF', status: 'Available' }
    ]
  });
});

module.exports = router;
