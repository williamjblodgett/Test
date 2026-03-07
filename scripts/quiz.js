/**
 * AI Tools Learning Hub — Quiz Engine
 * Reusable, JSON-driven multiple-choice quiz with instant feedback,
 * score summary, and areas-to-review list.
 */

class Quiz {
  /**
   * @param {Object} config
   * @param {string} config.containerId  - ID of the quiz wrapper element
   * @param {Array}  config.questions    - Array of question objects
   * @param {string} config.topic        - Topic name for review labels
   */
  constructor({ containerId, questions, topic }) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.questions = questions;
    this.topic = topic;
    this.current = 0;
    this.score = 0;
    this.wrongTopics = [];
    this.answered = false;

    this._render();
    this._update();
  }

  // ── Build DOM ──────────────────────────────────────────────
  _render() {
    this.container.innerHTML = `
      <div class="quiz-header">
        <h2>🧠 Quiz Yourself</h2>
        <p class="quiz-progress" id="qz-progress">Question 1 of ${this.questions.length}</p>
      </div>

      <div class="quiz-progress-bar">
        <div class="quiz-progress-bar__fill" id="qz-bar" style="width:0%"></div>
      </div>

      <div id="qz-question-area">
        <p class="quiz-question" id="qz-question"></p>
        <div class="quiz-options" id="qz-options"></div>
        <div class="quiz-feedback alert" id="qz-feedback"></div>
        <div class="quiz-nav">
          <button class="btn btn-primary" id="qz-next" style="display:none">Next →</button>
          <button class="btn btn-primary" id="qz-submit" style="display:none" disabled>Submit</button>
        </div>
      </div>

      <div class="quiz-results" id="qz-results">
        <h3 id="qz-result-title"></h3>
        <div class="quiz-score-ring" id="qz-ring">
          <span class="quiz-score-text" id="qz-score-text"></span>
        </div>
        <p id="qz-result-msg"></p>
        <div class="quiz-review-list" id="qz-review" style="display:none">
          <h4>📚 Areas to Review</h4>
          <ul id="qz-review-list"></ul>
        </div>
        <div id="qz-all-correct" class="quiz-all-correct" style="display:none">
          ✅ Outstanding! You answered every question correctly!
        </div>
        <div class="quiz-nav" style="justify-content:center">
          <button class="btn btn-primary" id="qz-retry">↺ Retake Quiz</button>
          <a class="btn btn-secondary" href="../index.html">← Back to Home</a>
        </div>
      </div>
    `;

    // Wire events
    document.getElementById('qz-next').addEventListener('click', () => this._next());
    document.getElementById('qz-retry').addEventListener('click', () => this._reset());
  }

  // ── Populate current question ──────────────────────────────
  _update() {
    const q = this.questions[this.current];
    const total = this.questions.length;
    const pct = Math.round((this.current / total) * 100);

    document.getElementById('qz-progress').textContent =
      `Question ${this.current + 1} of ${total}`;
    document.getElementById('qz-bar').style.width = pct + '%';
    document.getElementById('qz-question').textContent = q.question;

    const letters = ['A', 'B', 'C', 'D'];
    const optionsEl = document.getElementById('qz-options');
    optionsEl.innerHTML = '';

    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.innerHTML = `<span class="quiz-option-letter">${letters[i]}</span>${opt}`;
      btn.addEventListener('click', () => this._select(i, btn, q));
      optionsEl.appendChild(btn);
    });

    // Reset feedback
    const fb = document.getElementById('qz-feedback');
    fb.className = 'quiz-feedback alert';
    fb.style.display = 'none';
    fb.textContent = '';

    document.getElementById('qz-next').style.display = 'none';
    this.answered = false;
  }

  // ── Handle option selection ────────────────────────────────
  _select(index, clickedBtn, q) {
    if (this.answered) return;
    this.answered = true;

    const options = document.querySelectorAll('.quiz-option');
    options.forEach(b => b.disabled = true);

    const isCorrect = index === q.correct;
    const fb = document.getElementById('qz-feedback');
    fb.style.display = 'block';

    if (isCorrect) {
      clickedBtn.classList.add('correct');
      fb.className = 'quiz-feedback alert alert-success show';
      fb.textContent = '✅ Correct! ' + (q.explanation || '');
      this.score++;
    } else {
      clickedBtn.classList.add('incorrect');
      options[q.correct].classList.add('correct');
      fb.className = 'quiz-feedback alert alert-danger show';
      fb.textContent = '❌ Not quite. ' + (q.explanation || `The correct answer was: ${q.options[q.correct]}`);
      this.wrongTopics.push(q.topic || q.question.substring(0, 60) + '…');
    }

    const nextBtn = document.getElementById('qz-next');
    if (this.current < this.questions.length - 1) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.textContent = 'Next →';
    } else {
      nextBtn.style.display = 'inline-flex';
      nextBtn.textContent = 'See Results';
    }
  }

  // ── Advance to next question or results ───────────────────
  _next() {
    this.current++;
    if (this.current < this.questions.length) {
      this._update();
    } else {
      this._showResults();
    }
  }

  // ── Show final results ─────────────────────────────────────
  _showResults() {
    document.getElementById('qz-question-area').style.display = 'none';

    const results = document.getElementById('qz-results');
    results.classList.add('show');

    const total = this.questions.length;
    const pct = Math.round((this.score / total) * 100);

    document.getElementById('qz-ring').style.setProperty('--pct', pct + '%');
    document.getElementById('qz-score-text').textContent = `${this.score}/${total}`;
    document.getElementById('qz-bar').style.width = '100%';
    document.getElementById('qz-progress').textContent = 'Quiz Complete';

    let title, msg;
    if (pct === 100) {
      title = '🏆 Perfect Score!';
      msg = `You nailed it — full marks on the ${this.topic} quiz.`;
    } else if (pct >= 80) {
      title = '🎉 Great Work!';
      msg = `Strong performance! Just a couple of areas to brush up on.`;
    } else if (pct >= 60) {
      title = '👍 Good Effort';
      msg = `You have a solid foundation. Review the topics below to level up.`;
    } else {
      title = '📖 Keep Learning';
      msg = `Don't worry — use the resources on this page to strengthen your knowledge.`;
    }

    document.getElementById('qz-result-title').textContent = title;
    document.getElementById('qz-result-msg').textContent = msg;

    if (this.wrongTopics.length === 0) {
      document.getElementById('qz-all-correct').style.display = 'block';
    } else {
      const reviewEl = document.getElementById('qz-review');
      reviewEl.style.display = 'block';
      const list = document.getElementById('qz-review-list');
      list.innerHTML = '';
      [...new Set(this.wrongTopics)].forEach(t => {
        const li = document.createElement('li');
        li.textContent = t;
        list.appendChild(li);
      });
    }
  }

  // ── Reset quiz ─────────────────────────────────────────────
  _reset() {
    this.current = 0;
    this.score = 0;
    this.wrongTopics = [];
    this.answered = false;

    document.getElementById('qz-results').classList.remove('show');
    document.getElementById('qz-question-area').style.display = 'block';
    document.getElementById('qz-all-correct').style.display = 'none';
    document.getElementById('qz-review').style.display = 'none';

    this._update();
  }
}
