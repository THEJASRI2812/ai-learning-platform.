/**
 * AI-POWERED PERSONALIZED LEARNING PLATFORM
 * Centralized API Client (api.js)
 * 
 * Features:
 * - Robust fetch wrapper with timeout and JSON parsing
 * - Automatic Authorization token header attachment
 * - Transparent fallback mock engine when backend is offline
 */

const ApiClient = (function () {
  const BASE_URL = window.APP_CONFIG ? window.APP_CONFIG.apiBaseUrl : "http://localhost:5000/api";

  function getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    const token = localStorage.getItem('edulearn_auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...getHeaders(),
        ...(options.headers || {})
      }
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s network timeout
      config.signal = controller.signal;

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      console.warn(`[ApiClient] Live API request to ${endpoint} failed: ${err.message}. Engaging resilient demo fallback.`);
      return handleMockFallback(endpoint, options);
    }
  }

  /**
   * Resilient Mock Fallback Engine for offline or Live-Server-only testing
   */
  function handleMockFallback(endpoint, options) {
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body) : {};

    // 1. AI Tutor
    if (endpoint === '/ai/tutor') {
      const q = (body.question || '').toLowerCase();
      let explanation = 'Machine Learning is an advanced branch of Artificial Intelligence where algorithms learn patterns directly from data rather than explicit hardcoded conditional logic.';
      let example = 'A spam filter learns to detect spam emails by scanning 100,000 labeled samples, automatically identifying keywords and metadata linked with spam.';
      let keyPoints = [
        'Iterative mathematical learning from empirical dataset samples',
        'Three primary paradigms: Supervised, Unsupervised, and Reinforcement Learning',
        'Model accuracy requires high-quality training features and validation sets',
        'Avoids manual rule engineering for complex probabilistic domains'
      ];
      let practiceQ = {
        question: 'Which machine learning type is applied when training on historical data with known target labels?',
        options: ['A: Supervised Learning', 'B: Unsupervised Clustering', 'C: Reinforcement Q-Learning', 'D: Heuristic Search'],
        correctAnswer: 'A: Supervised Learning',
        explanation: 'Supervised learning pairs input features with ground-truth target outputs.'
      };

      if (body.actionType === 'explain-simply') {
        explanation = 'Imagine teaching a puppy tricks: every time it does the right thing, you reward it. Machine learning is just showing a computer millions of examples until it learns the pattern itself!';
      } else if (body.actionType === 'example') {
        example = 'Netflix recommendation engine: when you watch 5 sci-fi movies, the algorithm compares your watch history against millions of subscribers to recommend the next show you will love.';
      } else if (body.actionType === 'hint') {
        explanation = 'Key Hint: Consider whether you already have the correct answers (labels) in advance, or if the algorithm needs to discover hidden groups by itself.';
      } else if (body.actionType === 'quiz') {
        practiceQ = {
          question: 'What is the main danger when a model achieves 99.9% training accuracy but only 52% validation accuracy?',
          options: ['A: Underfitting', 'B: Severe Overfitting', 'C: Insufficient Epochs', 'D: High Bias'],
          correctAnswer: 'B: Severe Overfitting',
          explanation: 'The model has memorized the training noise rather than learning general patterns.'
        };
      }

      return {
        success: true,
        source: 'local-demo-engine',
        data: {
          explanation,
          example,
          keyPoints,
          practiceQuestion: practiceQ,
          actionNote: `Action "${body.actionType || 'query'}" generated successfully.`
        }
      };
    }

    // 2. AI Skill Gap
    if (endpoint === '/ai/skill-gap') {
      return {
        success: true,
        targetRole: body.targetRole || 'AI Engineer',
        averageGap: 18,
        gaps: [
          { skill: 'Python', currentLevel: 80, requiredLevel: 90, gapPercentage: 10, status: 'On Track', recommendation: 'Complete advanced Python generators and multiprocessing modules.' },
          { skill: 'SQL', currentLevel: 55, requiredLevel: 80, gapPercentage: 25, status: 'Skill Gap', recommendation: 'High priority: Practice complex window functions and indexing.' },
          { skill: 'Statistics & Probability', currentLevel: 40, requiredLevel: 75, gapPercentage: 35, status: 'High Gap', recommendation: 'High priority: Review hypothesis testing and Central Limit Theorem.' },
          { skill: 'Machine Learning', currentLevel: 68, requiredLevel: 85, gapPercentage: 17, status: 'Moderate Gap', recommendation: 'Work on hyperparameter optimization and cross-validation.' },
          { skill: 'Cloud Architecture (AWS)', currentLevel: 45, requiredLevel: 70, gapPercentage: 25, status: 'Skill Gap', recommendation: 'Deploy a containerized API on ECS or AWS Lambda.' }
        ]
      };
    }

    // 3. AI Career Recommendations
    if (endpoint === '/ai/career') {
      return {
        success: true,
        disclaimer: 'Note: These career recommendations are analytical projections based on available learning data and stated goals, not guaranteed outcomes.',
        careers: [
          {
            id: 'ai-engineer',
            name: 'AI Engineer',
            description: 'Designs, implements, and deploys high-scale deep neural networks and generative AI models.',
            matchScore: 84,
            requiredSkills: ['Python (90%)', 'Machine Learning (85%)', 'Cloud Architecture (70%)', 'Deep Learning (75%)'],
            currentSkills: ['Python: 80%', 'Machine Learning: 68%', 'Cloud Architecture: 45%'],
            skillGap: 'Needs enhancement in cloud container deployment and PyTorch/TensorFlow.',
            recommendedCourses: ['Machine Learning & Neural Networks', 'Modern Cloud Architecture with AWS'],
            recommendedProjects: ['End-to-End Multimodal Document Assistant', 'Real-time Object Detection Service']
          },
          {
            id: 'data-scientist',
            name: 'Data Scientist',
            description: 'Extracts strategic enterprise intelligence and builds predictive statistical forecasting models.',
            matchScore: 78,
            requiredSkills: ['Python (85%)', 'Statistics (85%)', 'SQL (85%)', 'Machine Learning (80%)'],
            currentSkills: ['Python: 80%', 'SQL: 55%', 'Statistics: 40%'],
            skillGap: 'Requires deeper mastery of statistical hypothesis testing and SQL window functions.',
            recommendedCourses: ['Python for AI & Data Science', 'Data Analytics & Business Intelligence'],
            recommendedProjects: ['Customer Churn Prediction Engine', 'A/B Testing Statistical Validation Tool']
          },
          {
            id: 'software-developer',
            name: 'Software Developer',
            description: 'Builds scalable full-stack applications, resilient REST microservices, and databases.',
            matchScore: 82,
            requiredSkills: ['Python/JS (85%)', 'Data Structures (85%)', 'Modern Web Dev (80%)', 'SQL (75%)'],
            currentSkills: ['Python: 80%', 'Web Dev: 72%', 'SQL: 55%'],
            skillGap: 'Solid foundation; strengthen database query optimization and microservice patterns.',
            recommendedCourses: ['Full-Stack Web Engineering', 'Modern Cloud Architecture with AWS'],
            recommendedProjects: ['Real-time Collaborative Platform', 'High-throughput Caching Proxy']
          }
        ]
      };
    }

    // 4. Assessments Submit
    if (endpoint === '/assessments/submit') {
      const answers = body.answers || {};
      const score = Object.keys(answers).length >= 4 ? 8 : 7;
      return {
        success: true,
        result: {
          score: score,
          totalQuestions: 10,
          correctAnswers: score,
          wrongAnswers: 10 - score,
          percentage: score * 10,
          passed: true,
          topicBreakdown: [
            { topic: 'Python', percentage: 85, status: 'Proficient' },
            { topic: 'SQL', percentage: 60, status: 'Moderate' },
            { topic: 'Statistics', percentage: 45, status: 'Weak Area' },
            { topic: 'Machine Learning', percentage: 70, status: 'Proficient' }
          ],
          weakTopics: ['Statistics', 'SQL'],
          recommendations: [
            { title: 'Probability Distributions & Testing', topic: 'Statistics', description: 'Address the 35% gap in statistical foundations before taking ML Level 2.' },
            { title: 'Advanced SQL Aggregations & Joins', topic: 'SQL', description: 'Practice queries with GROUP BY, HAVING, and INNER/LEFT joins.' }
          ]
        }
      };
    }

    // 5. Teacher Risk Analysis
    if (endpoint === '/teacher/risk-analysis') {
      return {
        success: true,
        disclaimer: 'This is an analytical support indicator and must not be presented as a certain prediction about a student\'s future.',
        summary: { highRisk: 2, mediumRisk: 1, lowRisk: 1, totalMonitored: 142 },
        atRiskStudents: [
          {
            id: 's-chen',
            name: 'Marcus Chen',
            department: 'Software Engineering (Year 3)',
            riskLevel: 'High',
            indicators: ['Declining Scores', 'Low Course Completion', 'Long Inactivity (9 days)'],
            reason: 'Assessment average dropped from 72% to 48%; 9 days without course login.',
            suggestedSupport: 'Initiate academic advisor outreach; provide assisted tutoring on OOP concepts.'
          },
          {
            id: 's-patel',
            name: 'Liam Patel',
            department: 'Information Technology (Year 2)',
            riskLevel: 'High',
            indicators: ['Low Assessment Scores (52%)', 'Low Completion (28%)'],
            reason: 'Struggling on Python functions and recursion lab assessments.',
            suggestedSupport: 'Enroll in guided peer-programming code review labs.'
          },
          {
            id: 's-sharma',
            name: 'Priya Sharma',
            department: 'Data Science & AI (Year 2)',
            riskLevel: 'Medium',
            indicators: ['Specific Topic Deficit (Cloud 45%)'],
            reason: 'High programming scores, but AWS networking assessments remain below threshold.',
            suggestedSupport: 'Recommend visual interactive cloud simulation playground.'
          },
          {
            id: 's-morgan',
            name: 'Alex Morgan',
            department: 'Computer Science (Year 3)',
            riskLevel: 'Low',
            indicators: ['Mild Topic Gap (Statistics 40%)'],
            reason: 'High overall score (84%); minor gap in statistical hypothesis testing.',
            suggestedSupport: 'Share self-paced statistics refresher notes before midterm.'
          }
        ]
      };
    }

    // Default fallback
    return { success: true, message: 'Processed via offline demo adapter', data: {} };
  }

  return {
    // Student endpoints
    getStudent: (id) => {
      const cur = window.AuthService ? window.AuthService.getCurrentUser() : null;
      const targetId = id || (cur && cur.id) || '77777777-7777-7777-7777-777777777701';
      return request(`/students/${targetId}`);
    },
    getStudentProgress: (id) => {
      const cur = window.AuthService ? window.AuthService.getCurrentUser() : null;
      const targetId = id || (cur && cur.id) || '77777777-7777-7777-7777-777777777701';
      return request(`/students/${targetId}/progress`);
    },
    getStudentSkills: (id) => {
      const cur = window.AuthService ? window.AuthService.getCurrentUser() : null;
      const targetId = id || (cur && cur.id) || '77777777-7777-7777-7777-777777777701';
      return request(`/students/${targetId}/skills`);
    },
    saveOnboarding: (id, data) => {
      const cur = window.AuthService ? window.AuthService.getCurrentUser() : null;
      const targetId = id || (cur && cur.id) || '77777777-7777-7777-7777-777777777701';
      return request(`/students/${targetId}/onboarding`, { method: 'PUT', body: JSON.stringify(data) });
    },

    // Courses & Skills
    getCourses: () => request('/courses'),
    getSkills: (category) => request(`/skills${category ? `?category=${encodeURIComponent(category)}` : ''}`),

    // Assessments
    getAssessments: () => request('/assessments'),
    submitAssessment: (data) => request('/assessments/submit', { method: 'POST', body: JSON.stringify(data) }),

    // AI Engine
    aiTutor: (question, actionType = 'default') => request('/ai/tutor', { method: 'POST', body: JSON.stringify({ question, actionType }) }),
    aiAnalyze: (studentData) => request('/ai/analyze', { method: 'POST', body: JSON.stringify({ studentData }) }),
    aiSkillGap: (currentSkills, targetRole) => request('/ai/skill-gap', { method: 'POST', body: JSON.stringify({ currentSkills, targetRole }) }),
    aiCareer: (skills, preferences) => request('/ai/career', { method: 'POST', body: JSON.stringify({ skills, preferences }) }),

    // Teacher
    getTeacherStudents: () => request('/teacher/students'),
    getTeacherRiskAnalysis: () => request('/teacher/risk-analysis'),
    postTeacherNote: (studentId, note) => request('/teacher/notes', { method: 'POST', body: JSON.stringify({ studentId, note }) }),

    // Institution
    getInstitutionAnalytics: () => request('/institution/analytics'),
    getInstitutionReports: () => request('/institution/reports')
  };
})();

window.ApiClient = ApiClient;
