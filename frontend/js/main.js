/**
 * AI-POWERED PERSONALIZED LEARNING PLATFORM
 * Landing Page Interactivity (main.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Icons
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // 2. Handle Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value;
      const email = document.getElementById('contactEmail')?.value;
      const message = document.getElementById('contactMessage')?.value;

      if (!name || !email || !message) {
        if (window.Utils) {
          window.Utils.showToast('Please fill in all required fields.', 'warning');
        }
        return;
      }

      // Simulate contact delivery
      if (window.Utils) {
        window.Utils.showToast('Thank you! Your message has been sent to our academic advisory team.', 'success');
      }
      contactForm.reset();
    });
  }

  // 3. Smooth Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
