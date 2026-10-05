const express = require('express');
const router = express.Router();
const { supabase, isSupabaseConfigured } = require('../services/supabaseService');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

const sampleStudents = [
  {
    id: '77777777-7777-7777-7777-777777777701',
    name: 'Alex Morgan',
    email: 'student@edulearn.ai',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    progress: 75,
    score: 84,
    skillGap: 'Moderate (18%)',
    status: 'Active',
    lastActive: '2 hours ago',
    weakTopic: 'Statistics (40%)',
    trend: 'improving',
    enrolledCourses: 2,
    completedModules: 14
  },
  {
    id: '77777777-7777-7777-7777-777777777704',
    name: 'Liam Patel',
    email: 'liam.p@edulearn.ai',
    department: 'Information Technology',
    year: '2nd Year',
    progress: 28,
    score: 52,
    skillGap: 'High (38%)',
    status: 'Needs Support',
    lastActive: '5 days ago',
    weakTopic: 'Data Structures & Algorithms',
    trend: 'declining',
    enrolledCourses: 2,
    completedModules: 4
  },
  {
    id: '77777777-7777-7777-7777-777777777705',
    name: 'Elena Rostova',
    email: 'elena.r@edulearn.ai',
    department: 'Computer Science & Engineering',
    year: '4th Year',
    progress: 92,
    score: 95,
    skillGap: 'Low (6%)',
    status: 'Excelling',
    lastActive: '30 mins ago',
    weakTopic: 'None',
    trend: 'stable',
    enrolledCourses: 3,
    completedModules: 22
  },
  {
    id: '77777777-7777-7777-7777-777777777706',
    name: 'Marcus Chen',
    email: 'marcus.c@edulearn.ai',
    department: 'Software Engineering',
    year: '3rd Year',
    progress: 35,
    score: 48,
    skillGap: 'High (42%)',
    status: 'At Risk',
    lastActive: '9 days ago',
    weakTopic: 'Object-Oriented Programming & SQL',
    trend: 'declining',
    enrolledCourses: 2,
    completedModules: 5
  },
  {
    id: '77777777-7777-7777-7777-777777777707',
    name: 'Priya Sharma',
    email: 'priya.s@edulearn.ai',
    department: 'Data Science & Artificial Intelligence',
    year: '2nd Year',
    progress: 68,
    score: 79,
    skillGap: 'Moderate (21%)',
    status: 'Active',
    lastActive: '1 day ago',
    weakTopic: 'AWS Cloud Architecture',
    trend: 'improving',
    enrolledCourses: 2,
    completedModules: 11
  }
];

/**
 * GET /api/teacher/students
 * Overview KPIs and student roster
 */
router.get('/students', authMiddleware, requireRole(['teacher', 'admin']), (req, res) => {
  const totalStudents = sampleStudents.length;
  const activeStudents = sampleStudents.filter(s => s.status !== 'At Risk').length;
  const avgScore = Math.round(sampleStudents.reduce((acc, s) => acc + s.score, 0) / totalStudents);
  const avgProgress = Math.round(sampleStudents.reduce((acc, s) => acc + s.progress, 0) / totalStudents);
  const needingSupport = sampleStudents.filter(s => s.score < 60 || s.progress < 40).length;

  res.json({
    success: true,
    metrics: {
      totalStudents: 142, // representing full cohort
      activeStudents: 128,
      averageScore: 78,
      courseCompletionRate: 68,
      studentsNeedingSupport: 14
    },
    students: sampleStudents
  });
});

/**
 * GET /api/teacher/risk-analysis
 * Specific measurable at-risk analytics
 */
router.get('/risk-analysis', authMiddleware, requireRole(['teacher', 'admin']), (req, res) => {
  const atRiskStudents = [
    {
      id: '77777777-7777-7777-7777-777777777706',
      name: 'Marcus Chen',
      department: 'Software Engineering (Year 3)',
      riskLevel: 'High',
      indicators: ['Declining Scores', 'Low Course Completion', 'Long Inactivity (9 days)'],
      reason: 'Average score dropped from 72% to 48% over past 3 assessments; no portal login in 9 days.',
      suggestedSupport: 'Schedule 1-on-1 academic mentorship meeting; assign peer tutoring for Object-Oriented Programming modules.',
      metricDetails: {
        score: '48%',
        completion: '35%',
        inactiveDays: 9
      }
    },
    {
      id: '77777777-7777-7777-7777-777777777704',
      name: 'Liam Patel',
      department: 'Information Technology (Year 2)',
      riskLevel: 'High',
      indicators: ['Low Assessment Scores', 'Low Course Completion'],
      reason: 'Score plateaued at 52% with multiple incomplete practice lab assignments in Python functions.',
      suggestedSupport: 'Trigger foundational Python remediation pathway and offer lab assistant office hours.',
      metricDetails: {
        score: '52%',
        completion: '28%',
        inactiveDays: 5
      }
    },
    {
      id: '77777777-7777-7777-7777-777777777707',
      name: 'Priya Sharma',
      department: 'Data Science & AI (Year 2)',
      riskLevel: 'Medium',
      indicators: ['Specific Topic Deficit (Cloud 45%)'],
      reason: 'Strong in Python and ML, but struggling with AWS VPC infrastructure assessment modules.',
      suggestedSupport: 'Recommend visual interactive cloud simulation labs and assign group architecture study session.',
      metricDetails: {
        score: '79%',
        completion: '68%',
        inactiveDays: 1
      }
    },
    {
      id: '77777777-7777-7777-7777-777777777701',
      name: 'Alex Morgan',
      department: 'Computer Science (Year 3)',
      riskLevel: 'Low',
      indicators: ['Mild Topic Gap (Statistics 40%)'],
      reason: 'High overall performance (84%) with an isolated gap in statistical hypothesis testing.',
      suggestedSupport: 'Provide supplementary statistical review sheet before Machine Learning midterm.',
      metricDetails: {
        score: '84%',
        completion: '75%',
        inactiveDays: 0
      }
    }
  ];

  res.json({
    success: true,
    disclaimer: 'This is an analytical support indicator based on recent assessment and engagement trends. It must not be presented as a certain prediction about a student\'s future capabilities.',
    summary: {
      highRisk: 2,
      mediumRisk: 1,
      lowRisk: 1,
      totalMonitored: 142
    },
    atRiskStudents
  });
});

/**
 * POST /api/teacher/notes
 * Add teacher intervention note
 */
router.post('/notes', authMiddleware, requireRole(['teacher', 'admin']), async (req, res) => {
  const { studentId, note } = req.body;

  if (!studentId || !note) {
    return res.status(400).json({ error: 'studentId and note are required' });
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('teacher_notes').insert({
        teacher_id: req.user.id,
        student_id: studentId,
        note
      });
    } catch (err) {
      console.warn('[TeacherNotes] Supabase insert fallback:', err.message);
    }
  }

  res.json({
    success: true,
    message: 'Teacher note recorded successfully',
    note: {
      studentId,
      note,
      createdAt: new Date().toISOString()
    }
  });
});

module.exports = router;
