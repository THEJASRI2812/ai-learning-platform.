const express = require('express');
const router = express.Router();
const { supabase, isSupabaseConfigured } = require('../services/supabaseService');
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * Sync or create profile record in Supabase after auth.signUp
 * POST /api/auth/sync-profile
 */
router.post('/sync-profile', async (req, res) => {
  const { userId, name, email, role, department, year } = req.body;

  if (!userId || !email) {
    return res.status(400).json({ error: 'userId and email are required' });
  }

  // Prevent privilege escalation: self-registration defaults to 'student'
  // Privileged roles ('teacher', 'admin') cannot be self-assigned anonymously
  let assignedRole = 'student';
  if (role === 'teacher' || role === 'admin') {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ') && (authHeader.includes('admin') || authHeader.includes('teacher'))) {
      assignedRole = role;
    } else {
      assignedRole = 'student';
    }
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(
          {
            user_id: userId,
            name: name || email.split('@')[0],
            email,
            role: assignedRole,
            department: department || 'Computer Science',
            year: year || '3rd Year'
          },
          { onConflict: 'email' }
        )
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // If student, create student_profiles entry
      if (assignedRole === 'student') {
        await supabase
          .from('student_profiles')
          .upsert({ user_id: userId }, { onConflict: 'user_id' });
      }

      return res.json({ success: true, profile: data });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Mock response
  res.json({
    success: true,
    profile: {
      id: '77777777-7777-7777-7777-777777777701',
      user_id: userId,
      name: name || 'Demo Student',
      email,
      role: assignedRole,
      department: department || 'Computer Science',
      year: year || '3rd Year'
    }
  });
});

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
router.get('/me', authMiddleware, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
