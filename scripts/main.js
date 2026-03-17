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

// ── Sidebar Active Link (IntersectionObserver) ────────────────
let observeActiveSections = () => {};   // forward declaration; overwritten on DOMContentLoaded

window.addEventListener('DOMContentLoaded', () => {
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
  if (!sidebarLinks.length) return;

  let observer;

  const setActive = (id) => {
    sidebarLinks.forEach(a => {
      const href = a.getAttribute('href');
      a.classList.toggle('active', href === '#' + id);
    });
  };

  observeActiveSections = () => {
    if (observer) observer.disconnect();
    // Only observe sections inside the currently active level panel (or all if no panels)
    const activePanel = document.querySelector('.level-content.active') || document.querySelector('.main-content');
    if (!activePanel) return;
    const sections = activePanel.querySelectorAll('section[id]');
    if (!sections.length) return;

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });

    sections.forEach(s => observer.observe(s));
    setActive(sections[0].id);
  };

  observeActiveSections();
});

// ── Level Selector Switcher (topic pages) ────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const tabs   = document.querySelectorAll('.level-selector-card[data-level]');
  const panels = document.querySelectorAll('.level-content[data-level]');
  if (!tabs.length) return;

  const levelDescs = {
    beginner:     'No prior experience needed — start here',
    intermediate: 'Assumes familiarity with the platform',
    advanced:     'Deep dives, architecture & code patterns'
  };

  const activate = (level) => {
    // Update tabs
    tabs.forEach(t => t.classList.toggle('active', t.dataset.level === level));
    // Show/hide panels
    panels.forEach(p => p.classList.toggle('active', p.dataset.level === level));
    // Update description text
    const desc = document.getElementById('level-desc');
    if (desc) desc.textContent = levelDescs[level] || '';
    // Show/hide sidebar links by level
    document.querySelectorAll('.sidebar-nav li[data-level]').forEach(li => {
      li.style.display = li.dataset.level === level ? '' : 'none';
    });
    // Re-observe sections visible in the new active panel
    observeActiveSections();
  };

  tabs.forEach(tab => tab.addEventListener('click', () => activate(tab.dataset.level)));

  // Detect hash on load: #beginner, #intermediate, #advanced
  const hash = location.hash.replace('#', '');
  const startLevel = ['beginner', 'intermediate', 'advanced'].includes(hash) ? hash : 'intermediate';
  activate(startLevel);
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
