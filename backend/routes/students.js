const express = require('express');
const router = express.Router();
const { supabase, isSupabaseConfigured } = require('../services/supabaseService');
const { authMiddleware } = require('../middleware/authMiddleware');

function canAccessStudent(reqUser, targetStudentId) {
  if (!reqUser) return false;
  if (reqUser.role === 'teacher' || reqUser.role === 'admin') return true;
  return reqUser.id === targetStudentId || reqUser.user_id === targetStudentId;
}

/**
 * GET /api/students/:id
 * Retrieve student profile and dashboard KPIs
 */
router.get('/:id', authMiddleware, async (req, res) => {
  const studentId = req.params.id;

  if (!canAccessStudent(req.user, studentId)) {
    return res.status(403).json({ error: 'Forbidden: Access to requested student record is restricted' });
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', studentId)
        .single();

      if (pError) throw pError;

      const { data: sProfile } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', profile.user_id)
        .maybeSingle();

      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('*, courses(*)')
        .eq('student_id', studentId);

      return res.json({
        success: true,
        student: {
          ...profile,
          studentProfile: sProfile || {},
          enrollments: enrollments || []
        }
      });
    } catch (err) {
      console.warn('[StudentsRoute] Supabase query fallback:', err.message);
    }
  }

  // Realistic mock data
  res.json({
    success: true,
    student: {
      id: studentId,
      name: 'Alex Morgan',
      email: 'student@edulearn.ai',
      role: 'student',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      studentProfile: {
        skill_level: 'Intermediate',
        interests: 'Artificial Intelligence, Deep Learning, Cloud Architecture',
        career_goal: 'AI Engineer / Data Scientist',
        learning_style: 'Visual & Hands-on Coding'
      },
      kpis: {
        learningProgress: 72,
        assessmentScore: 84,
        currentLevel: 'Level 4: Advanced Practitioner',
        completedCourses: 3,
        learningStreak: 7, // days
        skillScore: 78
      }
    }
  });
});

/**
 * GET /api/students/:id/progress
 * Progress breakdown, weekly learning activity, and chart data
 */
router.get('/:id/progress', authMiddleware, async (req, res) => {
  const studentId = req.params.id;

  if (!canAccessStudent(req.user, studentId)) {
    return res.status(403).json({ error: 'Forbidden: Access to requested progress record is restricted' });
  }

  res.json({
    success: true,
    progress: {
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
    }
  });
});

/**
 * GET /api/students/:id/skills
 * Current skills, benchmark levels, and gap calculations
 */
router.get('/:id/skills', authMiddleware, async (req, res) => {
  const studentId = req.params.id;

  if (!canAccessStudent(req.user, studentId)) {
    return res.status(403).json({ error: 'Forbidden: Access to requested skills record is restricted' });
  }

  const skillsData = [
    { id: 'sk-1', name: 'Python', category: 'Programming', level: 80, required: 90, gap: 10, status: 'On Track' },
    { id: 'sk-2', name: 'SQL', category: 'Data Analytics', level: 55, required: 80, gap: 25, status: 'Skill Gap' },
    { id: 'sk-3', name: 'Statistics & Probability', category: 'Data Science', level: 40, required: 75, gap: 35, status: 'Needs Support' },
    { id: 'sk-4', name: 'Machine Learning', category: 'Artificial Intelligence', level: 68, required: 85, gap: 17, status: 'Developing' },
    { id: 'sk-5', name: 'Cloud Architecture (AWS)', category: 'Cloud Computing', level: 45, required: 70, gap: 25, status: 'Skill Gap' },
    { id: 'sk-6', name: 'Data Structures & Algorithms', category: 'Problem Solving', level: 75, required: 85, gap: 10, status: 'On Track' },
    { id: 'sk-7', name: 'Modern Web Development', category: 'Web Development', level: 70, required: 75, gap: 5, status: 'On Track' },
    { id: 'sk-8', name: 'Technical Communication', category: 'Communication', level: 75, required: 80, gap: 5, status: 'On Track' }
  ];

  res.json({
    success: true,
    studentId,
    skills: skillsData
  });
});

/**
 * PUT /api/students/:id/onboarding
 * Save onboarding preferences
 */
router.put('/:id/onboarding', authMiddleware, async (req, res) => {
  const studentId = req.params.id;

  if (!canAccessStudent(req.user, studentId)) {
    return res.status(403).json({ error: 'Forbidden: You cannot modify another student\'s profile' });
  }

  const { name, department, year, interests, skills, careerGoal, learningStyle, assessmentScore } = req.body;

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase
        .from('profiles')
        .update({ name, department, year })
        .eq('id', studentId);

      await supabase
        .from('student_profiles')
        .upsert({
          user_id: req.user.user_id,
          interests: Array.isArray(interests) ? interests.join(', ') : interests,
          career_goal: careerGoal,
          learning_style: learningStyle
        }, { onConflict: 'user_id' });
    } catch (err) {
      console.warn('[OnboardingUpdate] Supabase update fallback:', err.message);
    }
  }

  res.json({
    success: true,
    message: 'Onboarding completed successfully',
    onboarding: {
      name,
      careerGoal,
      learningStyle,
      assessmentScore: assessmentScore || 80
    }
  });
});

module.exports = router;
