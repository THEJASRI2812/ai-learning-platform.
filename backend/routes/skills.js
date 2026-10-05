const express = require('express');
const router = express.Router();

const skillsList = [
  {
    id: 'sk-1',
    name: 'Python',
    category: 'Programming',
    currentLevel: 80,
    requiredLevel: 90,
    gap: 10,
    difficulty: 'Intermediate',
    duration: '40 Hours',
    description: 'General-purpose high-level programming language essential for data pipelines, scripting, and AI models.',
    project: 'Automated Log Parsing & Data Pipeline Script',
    certification: 'Certified Python Professional',
    keyModules: ['Object-Oriented Architecture', 'Generators & Decorators', 'Multithreading & AsyncIO']
  },
  {
    id: 'sk-2',
    name: 'SQL & Database Engineering',
    category: 'Data Analytics',
    currentLevel: 55,
    requiredLevel: 80,
    gap: 25,
    difficulty: 'Intermediate',
    duration: '35 Hours',
    description: 'Relational database schema design, indexing, window functions, and enterprise query optimization.',
    project: 'E-Commerce Analytical Warehouse & Reporting Queries',
    certification: 'Enterprise SQL Specialist',
    keyModules: ['Complex Joins & Subqueries', 'Window Functions & CTEs', 'Query Optimization & Indexes']
  },
  {
    id: 'sk-3',
    name: 'Statistics & Probability',
    category: 'Data Science',
    currentLevel: 40,
    requiredLevel: 75,
    gap: 35,
    difficulty: 'Intermediate',
    duration: '30 Hours',
    description: 'Core mathematical foundation for model validation, hypothesis testing, distributions, and inferential statistics.',
    project: 'A/B Testing Statistical Significance Suite',
    certification: 'Statistical Modeling Associate',
    keyModules: ['Probability Distributions', 'Hypothesis Testing & p-values', 'Bayesian Inference']
  },
  {
    id: 'sk-4',
    name: 'Machine Learning',
    category: 'Artificial Intelligence',
    currentLevel: 68,
    requiredLevel: 85,
    gap: 17,
    difficulty: 'Advanced',
    duration: '50 Hours',
    description: 'Supervised and unsupervised algorithms, hyperparameter tuning, cross-validation, and production deployment.',
    project: 'Customer Churn Predictor with Scikit-learn',
    certification: 'Applied Machine Learning Engineer',
    keyModules: ['Classification & Regression', 'Ensemble Methods & XGBoost', 'Model Evaluation & Bias Detection']
  },
  {
    id: 'sk-5',
    name: 'Cloud Computing (AWS)',
    category: 'Cloud Computing',
    currentLevel: 45,
    requiredLevel: 70,
    gap: 25,
    difficulty: 'Intermediate',
    duration: '45 Hours',
    description: 'Scalable infrastructure, IAM security policies, virtual networks, and container deployment.',
    project: 'Serverless REST API on AWS Lambda & DynamoDB',
    certification: 'AWS Certified Solutions Architect Associate',
    keyModules: ['VPC & Security Groups', 'Serverless Functions', 'ECS & Docker Deployment']
  },
  {
    id: 'sk-6',
    name: 'Cybersecurity & Defense',
    category: 'Cybersecurity',
    currentLevel: 40,
    requiredLevel: 75,
    gap: 35,
    difficulty: 'Advanced',
    duration: '40 Hours',
    description: 'Network packet analysis, application vulnerability discovery, OWASP Top 10 mitigation, and defensive controls.',
    project: 'Automated Port Scanner & Vulnerability Audit Tool',
    certification: 'Security Fundamentals Certified',
    keyModules: ['OWASP Top 10 Defenses', 'Network Telemetry & Sniffing', 'Cryptography & Public Key Infrastructure']
  },
  {
    id: 'sk-7',
    name: 'Modern Web Development',
    category: 'Web Development',
    currentLevel: 72,
    requiredLevel: 80,
    gap: 8,
    difficulty: 'Intermediate',
    duration: '40 Hours',
    description: 'Frontend architectural patterns, responsive DOM rendering, asynchronous network requests, and semantic design.',
    project: 'Real-time Collaborative Dashboard Application',
    certification: 'Professional Web Software Engineer',
    keyModules: ['DOM & Event Architecture', 'Asynchronous JS & Fetch API', 'Modern CSS Grid & Flexbox']
  },
  {
    id: 'sk-8',
    name: 'Data Structures & Algorithms',
    category: 'Problem Solving',
    currentLevel: 75,
    requiredLevel: 85,
    gap: 10,
    difficulty: 'Intermediate',
    duration: '55 Hours',
    description: 'Computational complexity analysis, dynamic programming, graph traversal, and optimized storage patterns.',
    project: 'High-Performance In-Memory Key-Value Store',
    certification: 'Algorithmic Problem Solving Specialist',
    keyModules: ['Trees, Graphs & Tries', 'Dynamic Programming', 'Asymptotic Complexity Analysis']
  },
  {
    id: 'sk-9',
    name: 'Deep Learning & NLP',
    category: 'Artificial Intelligence',
    currentLevel: 50,
    requiredLevel: 80,
    gap: 30,
    difficulty: 'Advanced',
    duration: '60 Hours',
    description: 'Transformers, attention mechanisms, embeddings, and large language model prompting & fine-tuning.',
    project: 'Context-Aware Intelligent Chatbot with Embeddings',
    certification: 'Deep Learning & Generative AI Specialist',
    keyModules: ['Recurrent Networks & Attention', 'Transformer Architecture', 'Vector Databases & RAG']
  },
  {
    id: 'sk-10',
    name: 'Technical Communication & Leadership',
    category: 'Communication',
    currentLevel: 75,
    requiredLevel: 85,
    gap: 10,
    difficulty: 'Beginner',
    duration: '20 Hours',
    description: 'Writing technical architectural RFCs, presenting complex data insights to executives, and team collaboration.',
    project: 'Enterprise Architecture Decision Record (ADR) Portfolio',
    certification: 'Technical Leadership & Communication Certified',
    keyModules: ['Technical Documentation & RFCs', 'Executive Data Presentation', 'Cross-Functional Team Collaboration']
  }
];

/**
 * GET /api/skills
 * Return comprehensive catalog of skills with modules, projects, and benchmarks
 */
router.get('/', (req, res) => {
  const categoryFilter = req.query.category;
  let results = skillsList;
  if (categoryFilter && categoryFilter !== 'All') {
    results = skillsList.filter(s => s.category.toLowerCase() === categoryFilter.toLowerCase());
  }

  res.json({
    success: true,
    totalSkills: results.length,
    categories: [
      'All',
      'Artificial Intelligence',
      'Machine Learning',
      'Data Science',
      'Cloud Computing',
      'Cybersecurity',
      'Web Development',
      'Programming',
      'Data Analytics',
      'Communication',
      'Problem Solving'
    ],
    skills: results
  });
});

module.exports = router;
