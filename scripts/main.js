/**
 * AI Tools Learning Hub — Main Script
 * Handles: dark/light mode toggle, search filtering, active nav links
 */

// ── Theme Toggle ──────────────────────────────────────────────
(function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  window.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    btn.textContent = saved === 'dark' ? '☀️' : '🌙';

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      btn.textContent = next === 'dark' ? '☀️' : '🌙';
    });
  });
})();

// ── Active Nav Link ───────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.navbar__links a');
  const path = window.location.pathname;

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    // Match exact or partial path segment
    if (
      (href === '../index.html' && (path.endsWith('/') || path.includes('index.html') && !path.includes('/salesforce') && !path.includes('/tableau') && !path.includes('/copilot') && !path.includes('/ms365') && !path.includes('/security'))) ||
      (href !== '../index.html' && path.includes(href.replace('../', '').replace('/index.html', '')))
    ) {
      link.classList.add('active');
    }
  });

  // Root-level index special case
  if (path === '/' || path.endsWith('/Test/') || path.endsWith('/Test/index.html')) {
    const homeLink = document.querySelector('.navbar__links a[href="index.html"]');
    if (homeLink) homeLink.classList.add('active');
  }
});

// ── Card Search Filter (home page) ───────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('search-input');
  const cards = document.querySelectorAll('[data-search]');
  if (!input || cards.length === 0) return;

  input.addEventListener('input', () => {
    const term = input.value.trim().toLowerCase();
    cards.forEach(card => {
      const text = card.getAttribute('data-search').toLowerCase();
      card.closest('.card-wrapper, article, .card').style.display =
        term === '' || text.includes(term) ? '' : 'none';
    });
  });
});
