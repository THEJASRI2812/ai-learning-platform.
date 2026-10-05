const express = require('express');
const router = express.Router();
const { supabase, isSupabaseConfigured } = require('../services/supabaseService');

/**
 * GET /api/courses
 * Return all learning courses with their module structures
 */
router.get('/', async (req, res) => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: courses, error } = await supabase
        .from('courses')
        .select('*, modules(*)');

      if (!error && courses && courses.length > 0) {
        return res.json({ success: true, courses });
      }
    } catch (err) {
      console.warn('[CoursesRoute] Supabase fetch fallback:', err.message);
    }
  }

  // Fallback courses data
  const sampleCourses = [
    {
      id: '33333333-3333-3333-3333-333333333301',
      title: 'Python for AI & Data Science',
      description: 'Master core programming fundamentals, data structures, scientific computing, and foundational ML algorithms.',
      category: 'Programming & AI',
      difficulty: 'Beginner',
      duration: '8 Weeks',
      modulesCount: 7,
      progress: 75,
      status: 'in-progress',
      modules: [
        { id: 'm-1', title: 'Python Basics', description: 'Variables, data types, control flow, loops, and terminal I/O.', orderNumber: 1, status: 'Completed', estimatedTime: '4 hours' },
        { id: 'm-2', title: 'Python Functions', description: 'First-class functions, recursion, lambda expressions, and scope mechanics.', orderNumber: 2, status: 'Completed', estimatedTime: '5 hours' },
        { id: 'm-3', title: 'OOP (Object-Oriented Programming)', description: 'Classes, inheritance, encapsulation, polymorphism, and dunder methods.', orderNumber: 3, status: 'Completed', estimatedTime: '6 hours' },
        { id: 'm-4', title: 'NumPy', description: 'Multidimensional arrays, broadcasting, matrix mathematics, and vectorized operations.', orderNumber: 4, status: 'Completed', estimatedTime: '5 hours' },
        { id: 'm-5', title: 'Pandas', description: 'Series, DataFrames, data cleaning, aggregation, grouping, and merging datasets.', orderNumber: 5, status: 'In Progress', estimatedTime: '7 hours' },
        { id: 'm-6', title: 'Machine Learning', description: 'Scikit-learn, train/test splitting, linear regression, decision trees, and metrics.', orderNumber: 6, status: 'Recommended', estimatedTime: '8 hours' },
        { id: 'm-7', title: 'Project', description: 'End-to-end predictive machine learning model pipeline deployed with visualization.', orderNumber: 7, status: 'Locked', estimatedTime: '10 hours' }
      ]
    },
    {
      id: '33333333-3333-3333-3333-333333333302',
      title: 'Machine Learning & Neural Networks',
      description: 'Deep dive into supervised & unsupervised learning, model loss optimization, gradient descent, and deep neural nets.',
      category: 'Artificial Intelligence',
      difficulty: 'Intermediate',
      duration: '10 Weeks',
      modulesCount: 8,
      progress: 30,
      status: 'in-progress',
      modules: [
        { id: 'ml-1', title: 'Supervised Learning Fundamentals', description: 'Regression, classification, loss surfaces.', orderNumber: 1, status: 'Completed', estimatedTime: '6 hours' },
        { id: 'ml-2', title: 'Model Evaluation & Regularization', description: 'Cross-validation, L1/L2 ridge, lasso, ROC-AUC.', orderNumber: 2, status: 'In Progress', estimatedTime: '5 hours' },
        { id: 'ml-3', title: 'Ensemble Learning & Random Forests', description: 'Bagging, boosting, XGBoost, and hyperparameter tuning.', orderNumber: 3, status: 'Recommended', estimatedTime: '7 hours' },
        { id: 'ml-4', title: 'Deep Neural Networks with PyTorch', description: 'Tensors, backpropagation, and multi-layer perceptrons.', orderNumber: 4, status: 'Locked', estimatedTime: '9 hours' }
      ]
    },
    {
      id: '33333333-3333-3333-3333-333333333303',
      title: 'Modern Cloud Architecture with AWS',
      description: 'Build enterprise-grade scalable cloud backends, container orchestration with ECS/EKS, and serverless lambdas.',
      category: 'Cloud Computing',
      difficulty: 'Intermediate',
      duration: '6 Weeks',
      modulesCount: 6,
      progress: 0,
      status: 'recommended'
    },
    {
      id: '33333333-3333-3333-3333-333333333304',
      title: 'Cybersecurity Defense & Ethical Hacking',
      description: 'Hands-on network security auditing, packet analysis, penetration testing fundamentals, and enterprise threat modeling.',
      category: 'Cybersecurity',
      difficulty: 'Advanced',
      duration: '8 Weeks',
      modulesCount: 6,
      progress: 0,
      status: 'recommended'
    }
  ];

  res.json({ success: true, courses: sampleCourses });
});

module.exports = router;
