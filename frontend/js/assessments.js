/**
 * AI-POWERED PERSONALIZED LEARNING PLATFORM
 * Adaptive Assessments Engine (assessments.js)
 */

document.addEventListener('DOMContentLoaded', async () => {
  if (window.AuthService && !window.AuthService.requireAuth(['student'])) {
    return;
  }

  const runnerCard = document.getElementById('assessmentRunnerCard');
  const resultsCard = document.getElementById('assessmentResultsCard');
  const questionTextEl = document.getElementById('questionText');
  const optionsListEl = document.getElementById('optionsList');
  const questionCounterEl = document.getElementById('questionCounter');
  const quizTimerEl = document.getElementById('quizTimer');
  const prevBtn = document.getElementById('prevQuestionBtn');
  const nextBtn = document.getElementById('nextQuestionBtn');
  const submitBtn = document.getElementById('submitAssessmentBtn');

  let currentQuestionIndex = 0;
  let questions = [];
  let userAnswers = {};
  let timerInterval = null;
  let secondsRemaining = 1200; // 20 mins

  // 1. Fetch Assessment Questions
  try {
    const res = await window.ApiClient.getAssessments();
    if (res && res.assessment && res.assessment.questions) {
      questions = res.assessment.questions;
      renderQuestion(0);
      startTimer();
    }
  } catch (err) {
    console.error('[Assessments] Error loading quiz:', err);
  }

  // 2. Timer
  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      secondsRemaining--;
      if (secondsRemaining <= 0) {
        clearInterval(timerInterval);
        submitQuiz();
      } else {
        const mins = Math.floor(secondsRemaining / 60);
        const secs = secondsRemaining % 60;
        if (quizTimerEl) {
          quizTimerEl.innerHTML = `<i data-lucide="clock" style="width: 14px; height: 14px;"></i> ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
          if (window.Utils) window.Utils.refreshIcons();
        }
      }
    }, 1000);
  }

  // 3. Render Current Question
  function renderQuestion(index) {
    if (!questions || index < 0 || index >= questions.length) return;
    currentQuestionIndex = index;
    const q = questions[index];

    if (questionCounterEl) {
      questionCounterEl.textContent = `Question ${index + 1} of ${questions.length} • [Topic: ${q.topic}]`;
    }

    if (questionTextEl) {
      questionTextEl.textContent = q.question;
    }

    optionsListEl.innerHTML = '';

    if (q.type === 'Short Answer') {
      const currentAns = userAnswers[q.id] || '';
      optionsListEl.innerHTML = `
        <div style="margin-top: 10px;">
          <input type="text" id="shortAnswerInput" class="form-input" style="font-size: 1.1rem; padding: 14px;" 
                 placeholder="Type your answer here..." value="${escapeHtml(currentAns)}" 
                 oninput="handleShortAnswer(this.value)">
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 6px;">
            Case-insensitive keyword evaluation.
          </div>
        </div>
      `;
    } else {
      (q.options || []).forEach((opt, optIdx) => {
        const letter = String.fromCharCode(65 + optIdx);
        const isSelected = userAnswers[q.id] === opt;

        const tile = document.createElement('div');
        tile.className = `option-tile ${isSelected ? 'selected' : ''}`;
        tile.innerHTML = `
          <div class="option-badge">${letter}</div>
          <div class="option-content">${escapeHtml(opt)}</div>
        `;
        tile.addEventListener('click', () => {
          userAnswers[q.id] = opt;
          renderQuestion(currentQuestionIndex);
        });
        optionsListEl.appendChild(tile);
      });
    }

    // Button states
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.style.display = index === questions.length - 1 ? 'none' : 'inline-flex';
    if (submitBtn) submitBtn.style.display = index === questions.length - 1 ? 'inline-flex' : 'none';

    if (window.Utils) window.Utils.refreshIcons();
  }

  window.handleShortAnswer = function (val) {
    if (questions[currentQuestionIndex]) {
      userAnswers[questions[currentQuestionIndex].id] = val;
    }
  };

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // 4. Navigation Buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentQuestionIndex > 0) renderQuestion(currentQuestionIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentQuestionIndex < questions.length - 1) renderQuestion(currentQuestionIndex + 1);
    });
  }

  // 5. Submit Assessment & Process Results
  async function submitQuiz() {
    clearInterval(timerInterval);
    if (window.Utils) {
      window.Utils.showToast('Evaluating diagnostic responses & calculating skill gaps...', 'info');
    }

    const user = window.AuthService ? window.AuthService.getCurrentUser() : null;

    try {
      const response = await window.ApiClient.submitAssessment({
        studentId: user?.id,
        answers: userAnswers
      });

      if (response && response.result) {
        displayResults(response.result);
      }
    } catch (err) {
      console.error('[Assessments] Submit error:', err);
    }
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', submitQuiz);
  }

  // 6. Display Diagnostics Report
  function displayResults(result) {
    if (runnerCard) runnerCard.style.display = 'none';
    if (resultsCard) resultsCard.style.display = 'block';

    document.getElementById('resScorePercentage').textContent = `${result.percentage}%`;
    document.getElementById('resCorrectCount').textContent = `${result.correctAnswers} / ${result.totalQuestions}`;
    document.getElementById('resStatusPill').textContent = result.passed ? 'PASSED & DIAGNOSED' : 'REMEDIATION RECOMMENDED';

    // Topic breakdown bars
    const topicContainer = document.getElementById('resTopicBreakdown');
    if (topicContainer) {
      topicContainer.innerHTML = (result.topicBreakdown || []).map(t => `
        <div class="skill-bar-wrapper">
          <div class="skill-bar-labels">
            <span><strong>${t.topic}</strong> (${t.status})</span>
            <span>${t.percentage}%</span>
          </div>
          <div class="skill-bar-track">
            <div class="skill-bar-fill ${t.percentage >= 75 ? 'blue' : (t.percentage >= 55 ? 'amber' : 'red')}" 
                 style="width: ${t.percentage}%;"></div>
          </div>
        </div>
      `).join('');
    }

    // AI Recommendations list
    const recsContainer = document.getElementById('resRecommendationsList');
    if (recsContainer) {
      recsContainer.innerHTML = (result.recommendations || []).map(r => `
        <div style="background-color: var(--blue-soft); border-left: 4px solid var(--primary-blue); padding: 12px 16px; border-radius: var(--radius-sm); margin-bottom: 10px;">
          <div style="font-weight: 700; color: var(--primary-navy); margin-bottom: 2px;">
            ${r.title}
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">${r.description}</div>
        </div>
      `).join('');
    }

    if (window.Utils) {
      window.Utils.showToast(`Assessment complete! Diagnostic score: ${result.percentage}%`, 'success');
      window.Utils.refreshIcons();
    }
  }
});
