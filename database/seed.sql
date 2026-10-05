-- ====================================================================
-- AI-POWERED PERSONALIZED LEARNING & SKILL DEVELOPMENT PLATFORM
-- Seed Data: Sample Courses, Modules, Skills, Assessments, Badges
-- ====================================================================

-- 1. Insert Skills
INSERT INTO public.skills (id, name, category) VALUES
('11111111-1111-1111-1111-111111111101', 'Python', 'Programming'),
('11111111-1111-1111-1111-111111111102', 'SQL', 'Data Analytics'),
('11111111-1111-1111-1111-111111111103', 'Statistics & Probability', 'Data Science'),
('11111111-1111-1111-1111-111111111104', 'Machine Learning', 'Artificial Intelligence'),
('11111111-1111-1111-1111-111111111105', 'Cloud Architecture (AWS)', 'Cloud Computing'),
('11111111-1111-1111-1111-111111111106', 'Network Security', 'Cybersecurity'),
('11111111-1111-1111-1111-111111111107', 'Modern Web Development', 'Web Development'),
('11111111-1111-1111-1111-111111111108', 'Data Structures & Algorithms', 'Problem Solving'),
('11111111-1111-1111-1111-111111111109', 'Deep Learning & NLP', 'Artificial Intelligence'),
('11111111-1111-1111-1111-111111111110', 'Technical Communication', 'Communication')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Achievements
INSERT INTO public.achievements (id, name, description, icon) VALUES
('22222222-2222-2222-2222-222222222201', 'First Course Completed', 'Completed your first full course milestone on the platform.', 'award'),
('22222222-2222-2222-2222-222222222202', '7-Day Streak', 'Maintained a consistent daily learning streak for 7 consecutive days.', 'flame'),
('22222222-2222-2222-2222-222222222203', 'Assessment Master', 'Achieved a score of 90% or higher on any adaptive assessment.', 'trophy'),
('22222222-2222-2222-2222-222222222204', 'Python Beginner', 'Mastered the core building blocks of Python syntax and data structures.', 'code'),
('22222222-2222-2222-2222-222222222205', 'SQL Explorer', 'Successfully queried relational databases and solved complex joins.', 'database'),
('22222222-2222-2222-2222-222222222206', 'AI Learner', 'Completed your first AI & Machine Learning interactive module.', 'cpu'),
('22222222-2222-2222-2222-222222222207', 'Project Completed', 'Submitted and verified an end-to-end capstone portfolio project.', 'check-circle-2')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Courses
INSERT INTO public.courses (id, title, description, category, difficulty, duration) VALUES
('33333333-3333-3333-3333-333333333301', 'Python for AI & Data Science', 'Complete pathway from core Python syntax to advanced data manipulation and machine learning foundations.', 'Programming', 'Beginner', '8 Weeks'),
('33333333-3333-3333-3333-333333333302', 'Machine Learning & Neural Networks', 'Deep dive into supervised and unsupervised learning algorithms, model evaluation, and deep neural nets.', 'Artificial Intelligence', 'Intermediate', '10 Weeks'),
('33333333-3333-3333-3333-333333333303', 'Modern Cloud Architecture with AWS', 'Master scalable cloud computing, containerization, microservices, and serverless architectures.', 'Cloud Computing', 'Intermediate', '6 Weeks'),
('33333333-3333-3333-3333-333333333304', 'Cybersecurity Defense & Ethical Hacking', 'Hands-on network security, penetration testing fundamentals, and enterprise threat modeling.', 'Cybersecurity', 'Advanced', '8 Weeks'),
('33333333-3333-3333-3333-333333333305', 'Data Analytics & Business Intelligence', 'Transform raw transactional data into actionable executive insights with SQL and statistical modeling.', 'Data Analytics', 'Beginner', '6 Weeks')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Modules for Course 1 (The exact Python to ML path)
INSERT INTO public.modules (id, course_id, title, description, order_number) VALUES
('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', 'Python Basics', 'Variables, data types, control flow, loops, and terminal input/output.', 1),
('44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333301', 'Python Functions', 'First-class functions, recursion, lambda expressions, and scope mechanics.', 2),
('44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333301', 'OOP (Object-Oriented Programming)', 'Classes, inheritance, encapsulation, polymorphism, and dunder methods.', 3),
('44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333301', 'NumPy', 'Multidimensional arrays, broadcasting, matrix mathematics, and vectorized operations.', 4),
('44444444-4444-4444-4444-444444444405', '33333333-3333-3333-3333-333333333301', 'Pandas', 'Series, DataFrames, data cleaning, aggregation, grouping, and merging datasets.', 5),
('44444444-4444-4444-4444-444444444406', '33333333-3333-3333-3333-333333333301', 'Machine Learning', 'Scikit-learn, train/test splitting, linear regression, decision trees, and metrics.', 6),
('44444444-4444-4444-4444-444444444407', '33333333-3333-3333-3333-333333333301', 'Project', 'End-to-end predictive machine learning model pipeline deployed with visualization.', 7)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Assessments
INSERT INTO public.assessments (id, course_id, title, description) VALUES
('55555555-5555-5555-5555-555555555501', '33333333-3333-3333-3333-333333333301', 'Adaptive Diagnostics & Skill-Gap Evaluation', 'Comprehensive assessment evaluating proficiency in Python, SQL, Statistics, and ML concepts.')
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Questions for Adaptive Assessment
INSERT INTO public.questions (id, assessment_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, topic) VALUES
('66666666-6666-6666-6666-666666666601', '55555555-5555-5555-5555-555555555501', 'In Python, what is the output of `bool([])`?', 'True', 'False', 'TypeError', 'None', 'B', 'Beginner', 'Python'),
('66666666-6666-6666-6666-666666666602', '55555555-5555-5555-5555-555555555501', 'Which data structure is immutable in Python?', 'list', 'dict', 'tuple', 'set', 'C', 'Beginner', 'Python'),
('66666666-6666-6666-6666-666666666603', '55555555-5555-5555-5555-555555555501', 'Which SQL clause is executed FIRST in the logical query processing order?', 'SELECT', 'WHERE', 'FROM', 'HAVING', 'C', 'Intermediate', 'SQL'),
('66666666-6666-6666-6666-666666666604', '55555555-5555-5555-5555-555555555501', 'What does the SQL command `GROUP BY` perform on result sets?', 'Sorts alphabetically', 'Aggregates rows by matching column values', 'Filters rows before grouping', 'Deletes duplicates across table schemas', 'B', 'Intermediate', 'SQL'),
('66666666-6666-6666-6666-666666666605', '55555555-5555-5555-5555-555555555501', 'What is the Central Limit Theorem in statistics?', 'Sample means approach normal distribution as sample size grows', 'Population variance is always equal to standard deviation', 'Median is immune to sample size changes', 'Null hypothesis is automatically accepted when p > 0.5', 'A', 'Intermediate', 'Statistics'),
('66666666-6666-6666-6666-666666666606', '55555555-5555-5555-5555-555555555501', 'What is the primary indicator of overfitting in machine learning models?', 'High training loss and high validation loss', 'Low training loss but significantly high validation loss', 'Equal accuracy across training and test splits', 'Model training converges in very few epochs', 'B', 'Intermediate', 'Machine Learning'),
('66666666-6666-6666-6666-666666666607', '55555555-5555-5555-5555-555555555501', 'In Python Pandas, which method returns the first 5 rows of a DataFrame?', 'df.tail()', 'df.head()', 'df.sample()', 'df.describe()', 'B', 'Beginner', 'Python'),
('66666666-6666-6666-6666-666666666608', '55555555-5555-5555-5555-555555555501', 'What type of learning uses unlabeled data to discover underlying patterns?', 'Supervised Learning', 'Reinforcement Learning', 'Unsupervised Learning', 'Semi-supervised Regression', 'C', 'Intermediate', 'Machine Learning')
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Sample Demo Profiles (Representing typical student, teacher, admin)
INSERT INTO public.profiles (id, user_id, name, email, role, department, year) VALUES
('77777777-7777-7777-7777-777777777701', NULL, 'Alex Morgan', 'student@edulearn.ai', 'student', 'Computer Science & Engineering', '3rd Year'),
('77777777-7777-7777-7777-777777777702', NULL, 'Dr. Sarah Jenkins', 'teacher@edulearn.ai', 'teacher', 'Data Science & Artificial Intelligence', 'Faculty'),
('77777777-7777-7777-7777-777777777703', NULL, 'Dean Robert Vance', 'admin@edulearn.ai', 'admin', 'Academic Dean Office', 'Administration'),
('77777777-7777-7777-7777-777777777704', NULL, 'Liam Patel', 'liam.p@edulearn.ai', 'student', 'Information Technology', '2nd Year'),
('77777777-7777-7777-7777-777777777705', NULL, 'Elena Rostova', 'elena.r@edulearn.ai', 'student', 'Computer Science & Engineering', '4th Year'),
('77777777-7777-7777-7777-777777777706', NULL, 'Marcus Chen', 'marcus.c@edulearn.ai', 'student', 'Software Engineering', '3rd Year'),
('77777777-7777-7777-7777-777777777707', NULL, 'Priya Sharma', 'priya.s@edulearn.ai', 'student', 'Data Science & Artificial Intelligence', '2nd Year')
ON CONFLICT (id) DO NOTHING;

-- 8. Insert Student Profile for Alex Morgan
INSERT INTO public.student_profiles (id, user_id, skill_level, interests, career_goal, learning_style) VALUES
('88888888-8888-8888-8888-888888888801', NULL, 'Intermediate', 'Artificial Intelligence, Deep Learning, Cloud Architecture', 'AI Engineer & Research Scientist', 'Visual & Project-Based')
ON CONFLICT (id) DO NOTHING;

-- 9. Insert Student Skills for Alex Morgan (Matches requested example: Python 80%, SQL 55%, Stats 40%)
INSERT INTO public.student_skills (student_id, skill_id, level) VALUES
('77777777-7777-7777-7777-777777777701', '11111111-1111-1111-1111-111111111101', 80), -- Python
('77777777-7777-7777-7777-777777777701', '11111111-1111-1111-1111-111111111102', 55), -- SQL
('77777777-7777-7777-7777-777777777701', '11111111-1111-1111-1111-111111111103', 40), -- Statistics
('77777777-7777-7777-7777-777777777701', '11111111-1111-1111-1111-111111111104', 68), -- Machine Learning
('77777777-7777-7777-7777-777777777701', '11111111-1111-1111-1111-111111111105', 45)  -- Cloud Architecture
ON CONFLICT (student_id, skill_id) DO NOTHING;

-- 10. Insert Enrollments
INSERT INTO public.enrollments (student_id, course_id, progress, status) VALUES
('77777777-7777-7777-7777-777777777701', '33333333-3333-3333-3333-333333333301', 75, 'in-progress'),
('77777777-7777-7777-7777-777777777701', '33333333-3333-3333-3333-333333333302', 30, 'in-progress'),
('77777777-7777-7777-7777-777777777704', '33333333-3333-3333-3333-333333333301', 20, 'in-progress'),
('77777777-7777-7777-7777-777777777705', '33333333-3333-3333-3333-333333333302', 90, 'completed'),
('77777777-7777-7777-7777-777777777706', '33333333-3333-3333-3333-333333333303', 15, 'in-progress')
ON CONFLICT DO NOTHING;

-- 11. Insert Sample Student Achievements
INSERT INTO public.student_achievements (student_id, achievement_id) VALUES
('77777777-7777-7777-7777-777777777701', '22222222-2222-2222-2222-222222222201'),
('77777777-7777-7777-7777-777777777701', '22222222-2222-2222-2222-222222222202'),
('77777777-7777-7777-7777-777777777701', '22222222-2222-2222-2222-222222222204')
ON CONFLICT (student_id, achievement_id) DO NOTHING;

-- 12. Insert Learning Recommendations
INSERT INTO public.learning_recommendations (student_id, recommendation, reason, priority) VALUES
('77777777-7777-7777-7777-777777777701', 'Review Hypothesis Testing & Probability Distributions', 'Recent assessment showed a 35% gap in statistics required for ML models.', 'high'),
('77777777-7777-7777-7777-777777777701', 'Practice Complex SQL Window Functions & Joins', 'SQL score is 55% while target threshold for Data Engineering is 80%.', 'high'),
('77777777-7777-7777-7777-777777777701', 'Complete NumPy Vectorization Exercises', 'Strengthening array slicing will boost Machine Learning pipeline performance.', 'medium')
ON CONFLICT DO NOTHING;

-- 13. Insert Teacher Notes
INSERT INTO public.teacher_notes (teacher_id, student_id, note) VALUES
('77777777-7777-7777-7777-777777777702', '77777777-7777-7777-7777-777777777701', 'Alex exhibits strong grasp of object-oriented principles. Recommend extra coaching on statistical distributions for machine learning.'),
('77777777-7777-7777-7777-777777777702', '77777777-7777-7777-7777-777777777706', 'Marcus has missed two lab assessments. Needs academic mentor check-in.')
ON CONFLICT DO NOTHING;
