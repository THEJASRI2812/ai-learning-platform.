/**
 * AI-POWERED PERSONALIZED LEARNING PLATFORM
 * AI Tutor Chat Script (ai-tutor.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.AuthService && !window.AuthService.requireAuth(['student'])) {
    return;
  }

  const chatMessagesEl = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendChatBtn');
  const promptChips = document.querySelectorAll('.chip-btn');

  let currentTopic = 'Machine Learning';

  // 1. Append User Message Bubble
  function appendUserMessage(text) {
    const bubbleWrapper = document.createElement('div');
    bubbleWrapper.className = 'chat-bubble-container user';
    bubbleWrapper.innerHTML = `
      <div class="chat-avatar">
        <i data-lucide="user" style="width: 18px; height: 18px;"></i>
      </div>
      <div class="chat-bubble">
        ${escapeHtml(text)}
      </div>
    `;
    chatMessagesEl.appendChild(bubbleWrapper);
    scrollToBottom();
    if (window.Utils) window.Utils.refreshIcons();
  }

  // 2. Append AI Response Bubble
  function appendAiResponse(data) {
    const bubbleWrapper = document.createElement('div');
    bubbleWrapper.className = 'chat-bubble-container ai';

    let practiceHtml = '';
    if (data.practiceQuestion) {
      const q = data.practiceQuestion;
      const optionsHtml = (q.options || []).map(opt => `
        <button class="ai-option-btn" 
          data-opt="${escapeHtml(opt)}" 
          data-correct="${escapeHtml(q.correctAnswer)}" 
          data-explanation="${escapeHtml(q.explanation || '')}">
          ${escapeHtml(opt)}
        </button>
      `).join('');

      practiceHtml = `
        <div class="ai-practice-box">
          <div class="ai-practice-title">
            <i data-lucide="help-circle" style="width: 16px; height: 16px;"></i>
            Quick Practice Question:
          </div>
          <div style="font-weight: 600; margin-bottom: 6px;">${escapeHtml(q.question)}</div>
          <div class="ai-practice-options">${optionsHtml}</div>
          <div class="practice-feedback" style="margin-top: 8px; font-size: 0.85rem; display: none;"></div>
        </div>
      `;
    }

    const keyPointsHtml = (data.keyPoints || []).map(kp => `<li>${escapeHtml(kp)}</li>`).join('');

    bubbleWrapper.innerHTML = `
      <div class="chat-avatar">
        <i data-lucide="sparkles" style="width: 18px; height: 18px;"></i>
      </div>
      <div class="chat-bubble">
        <div style="font-weight: 600; margin-bottom: 6px; color: var(--primary-purple); display: flex; align-items: center; gap: 4px;">
          <i data-lucide="bot" style="width: 16px; height: 16px;"></i> AI Tutor
        </div>
        <p style="margin-bottom: 8px;">${escapeHtml(data.explanation || '')}</p>
        
        ${data.example ? `
          <div style="font-weight: 600; margin: 10px 0 4px; font-size: 0.85rem; color: var(--text-dark);">
            <i data-lucide="code-2" style="width: 14px; height: 14px; vertical-align: middle;"></i> Real-World Example / Code:
          </div>
          <div class="ai-code-snippet">${escapeHtml(data.example)}</div>
        ` : ''}

        ${keyPointsHtml ? `
          <div style="font-weight: 600; margin: 10px 0 4px; font-size: 0.85rem; color: var(--text-dark);">
            <i data-lucide="check-circle" style="width: 14px; height: 14px; vertical-align: middle;"></i> Key Takeaways:
          </div>
          <ul class="ai-key-points">${keyPointsHtml}</ul>
        ` : ''}

        ${practiceHtml}
      </div>
    `;

    chatMessagesEl.appendChild(bubbleWrapper);

    // Safely attach practice question button click events
    bubbleWrapper.querySelectorAll('.ai-option-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const opt = this.getAttribute('data-opt');
        const correct = this.getAttribute('data-correct');
        const exp = this.getAttribute('data-explanation');
        window.checkPracticeAnswer(this, opt, correct, exp);
      });
    });

    scrollToBottom();
    if (window.Utils) window.Utils.refreshIcons();
  }

  // 3. Loading Indicator Bubble
  function appendLoadingIndicator() {
    const loaderWrapper = document.createElement('div');
    loaderWrapper.className = 'chat-bubble-container ai chat-loader';
    loaderWrapper.innerHTML = `
      <div class="chat-avatar"><i data-lucide="sparkles" style="width: 18px; height: 18px;"></i></div>
      <div class="chat-bubble" style="display: flex; align-items: center; gap: 8px;">
        <span class="ai-pulse-dot"></span> Thinking and synthesizing personalized explanation...
      </div>
    `;
    chatMessagesEl.appendChild(loaderWrapper);
    scrollToBottom();
    if (window.Utils) window.Utils.refreshIcons();
    return loaderWrapper;
  }

  function scrollToBottom() {
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // 4. Send Query to Backend
  async function handleSendMessage(actionType = 'default') {
    const text = chatInput.value.trim();
    if (!text && actionType === 'default') return;

    const queryText = text || `Tell me about ${currentTopic}`;
    currentTopic = queryText;

    if (actionType === 'default') {
      appendUserMessage(queryText);
      chatInput.value = '';
    } else {
      appendUserMessage(`[Action: ${actionType.toUpperCase()}] on "${currentTopic}"`);
    }

    const loader = appendLoadingIndicator();

    try {
      const response = await window.ApiClient.aiTutor(queryText, actionType);
      loader.remove();
      if (response && response.data) {
        appendAiResponse(response.data);
      } else {
        throw new Error('Invalid AI response structure');
      }
    } catch (err) {
      loader.remove();
      console.error('[AITutor] Error:', err);
      if (window.Utils) {
        window.Utils.showToast('Unable to connect to AI engine. Using local tutor memory.', 'warning');
      }
    }
  }

  // Event Listeners
  if (sendBtn) {
    sendBtn.addEventListener('click', () => handleSendMessage('default'));
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSendMessage('default');
      }
    });
  }

  // Action Chips: Explain Simply, Give Example, Give Hint, Generate Quiz, Summarize
  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const action = chip.getAttribute('data-action');
      handleSendMessage(action);
    });
  });

  // Global handler for interactive practice buttons
  window.checkPracticeAnswer = function (btn, selected, correct, explanation) {
    const parent = btn.closest('.ai-practice-box');
    const feedbackEl = parent.querySelector('.practice-feedback');
    const allBtns = parent.querySelectorAll('.ai-option-btn');

    allBtns.forEach(b => {
      b.disabled = true;
      if (b.textContent.trim().toLowerCase().includes(correct.toLowerCase())) {
        b.style.backgroundColor = '#ecfdf5';
        b.style.borderColor = '#10b981';
        b.style.color = '#047857';
      }
    });

    feedbackEl.style.display = 'block';
    if (selected.toLowerCase().includes(correct.toLowerCase()) || correct.toLowerCase().includes(selected.toLowerCase())) {
      feedbackEl.style.color = '#059669';
      feedbackEl.innerHTML = `<strong>Correct!</strong> ${explanation || 'Great job understanding this concept.'}`;
      if (window.Utils) window.Utils.showToast('Correct answer! +10 XP', 'success');
    } else {
      btn.style.backgroundColor = '#fee2e2';
      btn.style.borderColor = '#ef4444';
      feedbackEl.style.color = '#dc2626';
      feedbackEl.innerHTML = `<strong>Not quite.</strong> Correct answer is: <em>${correct}</em>. ${explanation}`;
    }
  };

  // Trigger initial welcome
  if (window.Utils) window.Utils.refreshIcons();
});
