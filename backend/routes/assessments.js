const express = require('express');
const router = express.Router();
const { supabase, isSupabaseConfigured } = require('../services/supabaseService');
const { authMiddleware } = require('../middleware/authMiddleware');

const defaultQuestions = [
  {
    id: 'q-1',
    topic: 'Python',
    question: 'In Python, what is the output of `bool([])`?',
    type: 'MCQ',
    options: ['True', 'False', 'TypeError', 'None'],
    correctAnswer: 'False',
    explanation: 'Empty containers (lists, tuples, dicts, strings) evaluate to False in a boolean context in Python.'
  },
  {
    id: 'q-2',
    topic: 'Python',
    question: 'Which of the following data structures is immutable in Python?',
    type: 'MCQ',
    options: ['list', 'dict', 'tuple', 'set'],
    correctAnswer: 'tuple',
    explanation: 'Tuples cannot be modified after instantiation, unlike lists, dictionaries, or sets.'
  },
  {
    id: 'q-3',
    topic: 'Python',
    question: 'Python functions that do not have an explicit return statement return None.',
    type: 'True/False',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'Python implicitly returns None if no return statement is encountered.'
  },
  {
    id: 'q-4',
    topic: 'SQL',
    question: 'Which SQL clause is executed FIRST in the standard logical query processing order?',
    type: 'MCQ',
    options: ['SELECT', 'WHERE', 'FROM', 'HAVING'],
    correctAnswer: 'FROM',
    explanation: 'The SQL query engine begins evaluation at the FROM/JOIN clause to define the working table set.'
  },
  {
    id: 'q-5',
    topic: 'SQL',
    question: 'What is the primary function of the SQL `GROUP BY` clause?',
    type: 'MCQ',
    options: [
      'Sorts query results alphabetically',
      'Aggregates rows that share the same values into summary rows',
      'Filters rows before any calculation is made',
      'Creates a primary key constraint'
    ],
    correctAnswer: 'Aggregates rows that share the same values into summary rows',
    explanation: 'GROUP BY collapses identical values across specified columns into aggregate groups.'
  },
  {
    id: 'q-6',
    topic: 'SQL',
    question: 'Write the SQL keyword used to remove duplicate rows from the query output.',
    type: 'Short Answer',
    options: [],
    correctAnswer: 'DISTINCT',
    explanation: 'SELECT DISTINCT filters duplicate records from the returned dataset.'
  },
  {
    id: 'q-7',
    topic: 'Statistics',
    question: 'The Central Limit Theorem states that as sample size increases, the distribution of sample means approaches what distribution?',
    type: 'MCQ',
    options: ['Uniform', 'Normal (Gaussian)', 'Poisson', 'Exponential'],
    correctAnswer: 'Normal (Gaussian)',
    explanation: 'Regardless of the population shape, the sampling distribution of the mean approaches normality.'
  },
  {
    id: 'q-8',
    topic: 'Statistics',
    question: 'A p-value less than 0.05 indicates the null hypothesis should typically be rejected at the 5% significance level.',
    type: 'True/False',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'A p-value < 0.05 provides statistically significant evidence against the null hypothesis.'
  },
  {
    id: 'q-9',
    topic: 'Machine Learning',
    question: 'What does a high training accuracy paired with a low validation accuracy indicate in machine learning?',
    type: 'MCQ',
    options: ['Underfitting', 'Overfitting', 'Optimal generalization', 'Data leakage'],
    correctAnswer: 'Overfitting',
    explanation: 'The model has memorized the training noise rather than learning generalized underlying patterns.'
  },
  {
    id: 'q-10',
    topic: 'Machine Learning',
    question: 'Which learning paradigm groups unlabeled input data based on latent similarities?',
    type: 'MCQ',
    options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Active Learning'],
    correctAnswer: 'Unsupervised Learning',
    explanation: 'Unsupervised learning discovers intrinsic groupings without labeled targets (e.g. K-Means, PCA).'
  }
];

/**
 * GET /api/assessments
 * Return available assessment and questions
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    assessment: {
      id: '55555555-5555-5555-5555-555555555501',
      title: 'Full-Stack Adaptive Diagnostic Assessment',
      description: 'Comprehensive 10-question adaptive assessment evaluating Python, SQL, Statistics, and Machine Learning.',
      totalQuestions: defaultQuestions.length,
      timeLimitMinutes: 20,
      questions: defaultQuestions.map(q => ({
        id: q.id,
        topic: q.topic,
        question: q.question,
        type: q.type,
        options: q.options
      }))
    }
  });
});

/**
 * POST /api/assessments/submit
 * Evaluate student answers, calculate percentage, detect weak topics, generate recommendations
 */
router.post('/submit', authMiddleware, async (req, res) => {
  const { studentId, answers } = req.body;
  // If caller is student, enforce studentId = req.user.id
  const targetStudentId = (req.user && req.user.role === 'student') ? req.user.id : (studentId || (req.user && req.user.id));
  // answers: { "q-1": "False", "q-2": "tuple", ... }

  let correctCount = 0;
  let wrongCount = 0;
  const topicStats = {};

  defaultQuestions.forEach(q => {
    if (!topicStats[q.topic]) {
      topicStats[q.topic] = { total: 0, correct: 0 };
    }
    topicStats[q.topic].total += 1;

    const studentAns = (answers && answers[q.id]) ? String(answers[q.id]).trim() : '';
    const isCorrect = studentAns.toLowerCase() === q.correctAnswer.toLowerCase();

    if (isCorrect) {
      correctCount += 1;
      topicStats[q.topic].correct += 1;
    } else {
      wrongCount += 1;
    }
  });

  const totalQuestions = defaultQuestions.length;
  const score = correctCount;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Topic breakdown
  const topicBreakdown = Object.keys(topicStats).map(topic => {
    const stat = topicStats[topic];
    const pct = Math.round((stat.correct / stat.total) * 100);
    return {
      topic,
      correct: stat.correct,
      total: stat.total,
      percentage: pct,
      status: pct >= 80 ? 'Proficient' : pct >= 60 ? 'Moderate' : 'Weak Area'
    };
  });

  // Identify weak topics
  const weakTopics = topicBreakdown.filter(t => t.percentage < 70);

  // Generate adaptive recommendations
  const recommendations = [];
  weakTopics.forEach(wt => {
    if (wt.topic === 'Statistics') {
      recommendations.push({
        title: 'Reinforce Probability & Hypothesis Testing',
        topic: 'Statistics',
        description: 'Focus on sampling distributions and p-value intuition before diving into complex ML loss metrics.'
      });
    } else if (wt.topic === 'SQL') {
      recommendations.push({
        title: 'Master Analytical SQL & Aggregations',
        topic: 'SQL',
        description: 'Practice multi-table joins, subqueries, and window functions on real datasets.'
      });
    } else if (wt.topic === 'Machine Learning') {
      recommendations.push({
        title: 'Review Overfitting Mitigation & Regularization',
        topic: 'Machine Learning',
        description: 'Study bias-variance tradeoff and cross-validation techniques.'
      });
    } else if (wt.topic === 'Python') {
      recommendations.push({
        title: 'Python Syntax & Memory Model Refresher',
        topic: 'Python',
        description: 'Review object mutability and idiomatic Python control flows.'
      });
    }
  });

  if (recommendations.length === 0) {
    recommendations.push({
      title: 'Advanced Capstone Architecture',
      topic: 'General',
      description: 'Superb score! You are ready to accelerate into real-world production engineering projects.'
    });
  }

  // Save to Supabase if configured
  if (isSupabaseConfigured() && supabase && targetStudentId) {
    try {
      await supabase.from('assessment_results').insert({
        student_id: targetStudentId,
        assessment_id: '55555555-5555-5555-5555-555555555501',
        score: percentage,
        total_questions: totalQuestions
      });
    } catch (err) {
      console.warn('[AssessmentsSubmit] Supabase record save fallback:', err.message);
    }
  }

  res.json({
    success: true,
    result: {
      score,
      totalQuestions,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      percentage,
      passed: percentage >= 60,
      topicBreakdown,
      weakTopics: weakTopics.map(w => w.topic),
      recommendations
    }
  });
});

module.exports = router;
