const { supabase, isSupabaseConfigured } = require('../services/supabaseService');

/**
 * Express middleware to authenticate Supabase JWT tokens.
 * In development or mock mode, attaches mock authenticated user so the app remains fully testable.
 */
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // In production or when Supabase is configured, strictly enforce Bearer token
  const isProduction = process.env.NODE_ENV === 'production';
  const supabaseConfigured = isSupabaseConfigured() && supabase;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    if (isProduction || supabaseConfigured) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
    }

    // In local development / mock mode without Supabase, assign default demo student
    req.user = {
      id: '77777777-7777-7777-7777-777777777701',
      email: 'student@edulearn.ai',
      role: 'student',
      name: 'Alex Morgan'
    };
    return next();
  }

  const token = authHeader.split(' ')[1];

  // If mock token used in frontend demo
  if (token.startsWith('demo-token-')) {
    if (isProduction) {
      return res.status(401).json({ error: 'Unauthorized: Demo tokens are disabled in production' });
    }
    const role = token.replace('demo-token-', '');
    req.user = {
      id: role === 'teacher' ? '77777777-7777-7777-7777-777777777702' : (role === 'admin' ? '77777777-7777-7777-7777-777777777703' : '77777777-7777-7777-7777-777777777701'),
      email: `${role}@edulearn.ai`,
      role: role,
      name: role === 'teacher' ? 'Dr. Sarah Jenkins' : (role === 'admin' ? 'Dean Robert Vance' : 'Alex Morgan')
    };
    return next();
  }

  // If real Supabase is configured, verify token with Supabase auth
  if (supabaseConfigured) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return res.status(401).json({ error: 'Unauthorized: Invalid Supabase session token' });
      }

      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      req.user = {
        id: profile ? profile.id : user.id,
        user_id: user.id,
        email: user.email,
        role: profile ? profile.role : 'student',
        name: profile ? profile.name : (user.user_metadata?.full_name || 'Student')
      };
      return next();
    } catch (err) {
      console.error('[AuthMiddleware] Verification error:', err.message);
      return res.status(401).json({ error: 'Authentication failed' });
    }
  }

  // Fallback demo user for local non-production environments
  req.user = {
    id: '77777777-7777-7777-7777-777777777701',
    email: 'student@edulearn.ai',
    role: 'student',
    name: 'Alex Morgan'
  };
  next();
}

/**
 * Role-based authorization middleware
 */
function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden: Requires one of [${allowedRoles.join(', ')}] role` });
    }
    next();
  };
}

module.exports = {
  authMiddleware,
  requireRole
};
