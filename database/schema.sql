-- ====================================================================
-- AI-POWERED PERSONALIZED LEARNING & SKILL DEVELOPMENT PLATFORM
-- Database Schema: Supabase PostgreSQL with Row Level Security (RLS)
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    department VARCHAR(100) DEFAULT 'Computer Science & Engineering',
    year VARCHAR(50) DEFAULT '3rd Year',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Student Profiles Table
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    skill_level VARCHAR(50) DEFAULT 'Intermediate',
    interests TEXT DEFAULT 'Artificial Intelligence, Machine Learning, Data Science',
    career_goal VARCHAR(255) DEFAULT 'AI Engineer / Data Scientist',
    learning_style VARCHAR(100) DEFAULT 'Visual & Hands-on Coding',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    duration VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Modules Table
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Enrollments Table
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status VARCHAR(50) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in-progress', 'completed')),
    enrolled_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 6. Assessments Table
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 7. Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT,
    option_d TEXT,
    correct_answer VARCHAR(50) NOT NULL,
    difficulty VARCHAR(50) DEFAULT 'Medium',
    topic VARCHAR(100) NOT NULL
);

-- 8. Assessment Results Table
CREATE TABLE IF NOT EXISTS public.assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
    score NUMERIC(5,2) NOT NULL,
    total_questions INTEGER NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 9. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL
);

-- 10. Student Skills Table
CREATE TABLE IF NOT EXISTS public.student_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    level INTEGER DEFAULT 0 CHECK (level >= 0 AND level <= 100),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(student_id, skill_id)
);

-- 11. Learning Activity Table
CREATE TABLE IF NOT EXISTS public.learning_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    activity_type VARCHAR(100) NOT NULL,
    duration INTEGER NOT NULL, -- minutes
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 12. Learning Recommendations Table
CREATE TABLE IF NOT EXISTS public.learning_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    recommendation TEXT NOT NULL,
    reason TEXT,
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 13. Achievements Table
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon VARCHAR(100) NOT NULL
);

-- 14. Student Achievements Table
CREATE TABLE IF NOT EXISTS public.student_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(student_id, achievement_id)
);

-- 15. AI Chat History Table
CREATE TABLE IF NOT EXISTS public.ai_chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 16. Teacher Notes Table
CREATE TABLE IF NOT EXISTS public.teacher_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_notes ENABLE ROW LEVEL SECURITY;

-- Helpers for role checking
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Users can view own profile or teachers/admins can view all"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id OR public.current_user_role() IN ('teacher', 'admin'));

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id 
  AND (role = (SELECT role FROM public.profiles WHERE user_id = auth.uid()) OR public.current_user_role() = 'admin')
);

CREATE POLICY "Users can insert own profile on registration"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 2. Student Profiles Policies
CREATE POLICY "Students manage own student profile; teachers/admins read"
ON public.student_profiles FOR ALL
USING (auth.uid() = user_id OR public.current_user_role() IN ('teacher', 'admin'));

-- 3. Courses & Modules Policies (Public read, Teacher/Admin manage)
CREATE POLICY "Anyone authenticated can view courses"
ON public.courses FOR SELECT
TO authenticated USING (true);

CREATE POLICY "Anyone authenticated can view modules"
ON public.modules FOR SELECT
TO authenticated USING (true);

-- 4. Enrollments Policies
CREATE POLICY "Students view and manage own enrollments"
ON public.enrollments FOR ALL
USING (
  student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR public.current_user_role() IN ('teacher', 'admin')
);

-- 5. Assessments & Questions Policies
CREATE POLICY "Authenticated users view assessments"
ON public.assessments FOR SELECT
TO authenticated USING (true);

CREATE POLICY "Authenticated users view questions"
ON public.questions FOR SELECT
TO authenticated USING (true);

-- 6. Assessment Results Policies
CREATE POLICY "Students view own assessment results; teachers/admins view all"
ON public.assessment_results FOR SELECT
USING (
  student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR public.current_user_role() IN ('teacher', 'admin')
);

CREATE POLICY "Students insert own assessment results"
ON public.assessment_results FOR INSERT
WITH CHECK (
  student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- 7. Skills & Student Skills Policies
CREATE POLICY "Anyone can view skills"
ON public.skills FOR SELECT
TO authenticated USING (true);

CREATE POLICY "Students view own skills; teachers/admins view all"
ON public.student_skills FOR SELECT
USING (
  student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR public.current_user_role() IN ('teacher', 'admin')
);

CREATE POLICY "Students update own skills"
ON public.student_skills FOR ALL
USING (
  student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- 8. Learning Activity Policies
CREATE POLICY "Students manage own activity; teachers/admins read"
ON public.learning_activity FOR ALL
USING (
  student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR public.current_user_role() IN ('teacher', 'admin')
);

-- 9. Learning Recommendations Policies
CREATE POLICY "Students view own recommendations"
ON public.learning_recommendations FOR SELECT
USING (
  student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR public.current_user_role() IN ('teacher', 'admin')
);

-- 10. Achievements Policies
CREATE POLICY "Public read achievements"
ON public.achievements FOR SELECT
TO authenticated USING (true);

CREATE POLICY "Student achievements read and insert"
ON public.student_achievements FOR ALL
USING (
  student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR public.current_user_role() IN ('teacher', 'admin')
);

-- 11. AI Chat History Policies
CREATE POLICY "Students manage own AI chat history"
ON public.ai_chat_history FOR ALL
USING (
  student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- 12. Teacher Notes Policies
CREATE POLICY "Teachers and admins can insert notes"
ON public.teacher_notes FOR INSERT
WITH CHECK (
  teacher_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid() AND role IN ('teacher', 'admin'))
  OR public.current_user_role() = 'admin'
);

CREATE POLICY "Teachers can view notes they wrote; admins view all; students view notes on them"
ON public.teacher_notes FOR SELECT
USING (
  teacher_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR public.current_user_role() = 'admin'
);

CREATE POLICY "Teachers update own notes; admins update any"
ON public.teacher_notes FOR UPDATE
USING (
  teacher_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR public.current_user_role() = 'admin'
);

CREATE POLICY "Teachers delete own notes; admins delete any"
ON public.teacher_notes FOR DELETE
USING (
  teacher_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR public.current_user_role() = 'admin'
);
