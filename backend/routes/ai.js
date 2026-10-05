const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { supabase, isSupabaseConfigured } = require('../services/supabaseService');
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * POST /api/ai/tutor
 * Chat with AI tutor (Gemini-powered)
 * Body: { question: string, actionType: string, studentId: string }
 */
router.post('/tutor', authMiddleware, async (req, res) => {
  const { question, actionType, studentId } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Question string is required' });
  }

  try {
    const result = await aiService.generateTutorResponse(question, actionType);

    // Save to Supabase ai_chat_history if studentId provided
    if (isSupabaseConfigured() && supabase && (studentId || req.user?.id)) {
      const activeStudentId = studentId || req.user.id;
      try {
        await supabase.from('ai_chat_history').insert({
          student_id: activeStudentId,
          message: question,
          response: JSON.stringify(result.data)
        });
      } catch (saveErr) {
        console.warn('[AITutorRoute] Chat history save skipped:', saveErr.message);
      }
    }

    res.json(result);
  } catch (err) {
    console.error('[AITutorRoute] Error:', err.message);
    res.status(500).json({ error: 'Failed to process AI Tutor query', details: err.message });
  }
});

/**
 * POST /api/ai/analyze
 * Comprehensive learning performance analysis
 */
router.post('/analyze', authMiddleware, async (req, res) => {
  const studentData = req.body.studentData || {
    id: req.user?.id || 'demo-student',
    studyHours: 14.5,
    streak: 7,
    completedCourses: 3,
    assessmentAvg: 82.5
  };

  try {
    const analysis = await aiService.analyzeStudentPerformance(studentData);
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: 'Failed to analyze performance' });
  }
});

/**
 * POST /api/ai/skill-gap
 * Detect gaps between current student skills and target role benchmark
 */
router.post('/skill-gap', authMiddleware, async (req, res) => {
  const { currentSkills, targetRole } = req.body;

  try {
    const defaultSkills = currentSkills || [
      { name: 'Python', level: 80 },
      { name: 'SQL', level: 55 },
      { name: 'Statistics & Probability', level: 40 },
      { name: 'Machine Learning', level: 68 },
      { name: 'Cloud Architecture (AWS)', level: 45 }
    ];

    const result = await aiService.detectSkillGaps(defaultSkills, targetRole || 'AI Engineer');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to detect skill gaps' });
  }
});

/**
 * POST /api/ai/career
 * Generate personalized career recommendations
 */
router.post('/career', authMiddleware, async (req, res) => {
  const { skills, preferences } = req.body;

  try {
    const careerRecs = await aiService.generateCareerRecommendation(skills, preferences);
    res.json(careerRecs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate career recommendations' });
  }
});

module.exports = router;
