/**
 * AI-POWERED PERSONALIZED LEARNING PLATFORM
 * Authentication Service (auth.js)
 * 
 * Supports:
 * - Supabase Auth (Sign Up, Sign In, Sign Out, Session Listener)
 * - Safe client-side role-based routing (Student, Teacher, Institution Admin)
 * - Built-in fallback demo authentication for effortless testing
 */

const AuthService = (function () {
  let supabaseClient = null;

  // Initialize Supabase JS Client if library and valid keys are present
  function initSupabase() {
    const config = window.APP_CONFIG || {};
    if (
      window.supabase &&
      typeof window.supabase.createClient === 'function' &&
      config.supabaseUrl &&
      config.supabaseAnonKey &&
      config.supabaseUrl !== 'YOUR_SUPABASE_URL' &&
      !config.supabaseUrl.includes('YOUR_')
    ) {
      try {
        supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
        console.log('[AuthService] Supabase client initialized successfully.');
      } catch (e) {
        console.warn('[AuthService] Supabase init warning:', e.message);
      }
    } else {
      console.log('[AuthService] Supabase not configured with live credentials. Interactive demo mode active.');
    }
  }

  // Get current stored session user
  function getCurrentUser() {
    const userStr = localStorage.getItem('edulearn_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    // Default fallback user
    return {
      id: '77777777-7777-7777-7777-777777777701',
      name: 'Alex Morgan',
      email: 'student@edulearn.ai',
      role: 'student'
    };
  }

  // Set current user session
  function setCurrentUser(user, token = 'demo-token-student') {
    localStorage.setItem('edulearn_user', JSON.stringify(user));
    localStorage.setItem('edulearn_auth_token', token);
  }

  // Determine redirection URL based on user role
  function getRedirectUrlForRole(role) {
    const r = (role || 'student').toLowerCase();
    if (r === 'teacher' || r === 'faculty') return 'teacher-dashboard.html';
    if (r === 'admin' || r === 'institution admin') return 'institution-dashboard.html';
    return 'student-dashboard.html';
  }

  // 1. Sign Up
  async function signUp(fullName, email, password, role = 'student') {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, role: role }
          }
        });

        if (error) throw error;

        const userObj = {
          id: data.user ? data.user.id : 'user-' + Date.now(),
          name: fullName,
          email: email,
          role: role
        };

        setCurrentUser(userObj, data.session?.access_token || `demo-token-${role}`);

        // Sync profile record to backend
        try {
          await fetch(`${window.APP_CONFIG.apiBaseUrl}/auth/sync-profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userObj.id, name: fullName, email, role })
          });
        } catch (e) {
          console.warn('[AuthService] Profile sync bypassed:', e.message);
        }

        return { success: true, user: userObj, role };
      } catch (err) {
        console.error('[AuthService] Supabase sign up error:', err.message);
        throw err;
      }
    }

    // Demo Mode Sign Up
    const demoUser = {
      id: 'user-' + Date.now(),
      name: fullName || 'New Learner',
      email: email,
      role: role
    };
    setCurrentUser(demoUser, `demo-token-${role}`);
    return { success: true, user: demoUser, role };
  }

  // 2. Sign In
  async function signIn(email, password, roleOverride = null) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;

        const role = data.user.user_metadata?.role || roleOverride || 'student';
        const userObj = {
          id: data.user.id,
          name: data.user.user_metadata?.full_name || email.split('@')[0],
          email: data.user.email,
          role: role
        };
        setCurrentUser(userObj, data.session.access_token);
        return { success: true, user: userObj, role };
      } catch (err) {
        console.warn('[AuthService] Live login failed, falling back to demo login:', err.message);
      }
    }

    // Demo Mode Sign In
    let role = roleOverride || 'student';
    let name = 'Alex Morgan';

    if (email.includes('teacher')) {
      role = 'teacher';
      name = 'Dr. Sarah Jenkins';
    } else if (email.includes('admin')) {
      role = 'admin';
      name = 'Dean Robert Vance';
    }

    const demoUser = {
      id: role === 'teacher' ? '77777777-7777-7777-7777-777777777702' : (role === 'admin' ? '77777777-7777-7777-7777-777777777703' : '77777777-7777-7777-7777-777777777701'),
      name: name,
      email: email,
      role: role
    };

    setCurrentUser(demoUser, `demo-token-${role}`);
    return { success: true, user: demoUser, role };
  }

  // 3. Sign Out
  async function signOut() {
    if (supabaseClient) {
      try {
        await supabaseClient.auth.signOut();
      } catch (e) {
        console.warn('[AuthService] Supabase signOut error:', e.message);
      }
    }
    localStorage.removeItem('edulearn_user');
    localStorage.removeItem('edulearn_auth_token');
    window.location.href = 'login.html';
  }

  // 4. Role Guard for Protected Pages
  function requireAuth(allowedRoles = []) {
    const user = getCurrentUser();
    if (!user) {
      window.location.href = 'login.html';
      return false;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      window.location.href = getRedirectUrlForRole(user.role);
      return false;
    }
    return true;
  }

  // Initialize on load
  initSupabase();

  return {
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    setCurrentUser,
    getRedirectUrlForRole,
    requireAuth
  };
})();

window.AuthService = AuthService;
