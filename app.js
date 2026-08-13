// Application Engine for Title I Paraprofessional Study Guide
document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentTab: 'dashboard',
    theme: localStorage.getItem('theme') || 'light',
    flashcards: {
      currentIndex: 0,
      filterCategory: 'All',
      masteredIds: JSON.parse(localStorage.getItem('masteredFlashcards') || '[]'),
      shuffledDeck: null
    },
    quiz: {
      mode: 'practice', // 'practice' or 'exam'
      currentIndex: 0,
      userAnswers: {},
      bookmarkedIds: [],
      flaggedIds: [],
      completed: false,
      score: 0,
      timerSeconds: 1800, // 30 minutes
      timerRunning: false,
      timerInterval: null,
      history: JSON.parse(localStorage.getItem('quizHistory') || '[]')
    },
    manipulatives: {
      tenFrame: { val1: 8, val2: 5 },
      fraction: { num1: 1, den1: 2, num2: 2, den2: 4 }
    }
  };

  // DOM Elements
  const themeToggleBtn = document.getElementById('theme-toggle');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const navLinks = document.querySelectorAll('.nav-link');
  const viewSections = document.querySelectorAll('.view-section');
  const searchInput = document.getElementById('search-input');
  const globalProgressBar = document.getElementById('global-progress-bar');
  const globalProgressText = document.getElementById('global-progress-text');

  // Initialize App
  initTheme();
  renderDashboard();
  renderGeneralGuide();
  renderReadingModule();
  renderWritingModule();
  renderMathModule();
  renderFlashcards();
  renderQuiz();
  updateProgressWidget();

  // Navigation Event Listeners
  if (mobileMenuToggle && sidebar) {
    mobileMenuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = link.dataset.tab;
      if (tab) switchTab(tab);
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      handleGlobalSearch(e.target.value);
    });
  }

  // Keyboard Navigation for Flashcards
  document.addEventListener('keydown', (e) => {
    if (state.currentTab !== 'flashcards') return;
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      window.appPrevFlashcard();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      window.appNextFlashcard();
    } else if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      window.appFlipFlashcard();
    } else if (e.key.toLowerCase() === 'm') {
      e.preventDefault();
      const card = getActiveFlashcard();
      if (card) window.appToggleMastered(card.id);
    }
  });

  // Progress Tracker Widget
  function updateProgressWidget() {
    const totalFlashcards = STUDY_DATA.flashcards.length;
    const masteredCount = state.flashcards.masteredIds.length;
    const flashcardProgress = (masteredCount / totalFlashcards) * 50; // max 50%

    const history = state.quiz.history;
    const bestScore = history.length > 0 ? Math.max(...history.map(h => h.percentage)) : 0;
    const quizProgress = (bestScore / 100) * 50; // max 50%

    const totalProgress = Math.round(flashcardProgress + quizProgress);

    if (globalProgressBar) globalProgressBar.style.width = `${totalProgress}%`;
    if (globalProgressText) globalProgressText.textContent = `${totalProgress}% Mastery`;

    const navBadge = document.getElementById('flashcard-nav-badge');
    if (navBadge) navBadge.textContent = `${totalFlashcards} Cards`;
  }

  // Global Search Engine
  function handleGlobalSearch(query) {
    const searchView = document.getElementById('view-search');
    const searchResultsContainer = document.getElementById('search-results');
    if (!query || query.trim().length < 2) {
      if (searchView) searchView.classList.remove('active');
      const activeSection = document.getElementById(`view-${state.currentTab}`);
      if (activeSection) activeSection.classList.add('active');
      return;
    }

    viewSections.forEach(section => section.classList.remove('active'));
    if (searchView) searchView.classList.add('active');

    const cleanQuery = query.toLowerCase().trim();
    const results = [];

    // Search Reading Module
    STUDY_DATA.reading.part1.topics.forEach(t => {
      if (t.title.toLowerCase().includes(cleanQuery) || (t.content && t.content.toLowerCase().includes(cleanQuery))) {
        results.push({ module: 'Expanded Reading', title: t.title, snippet: t.content || '', tab: 'reading' });
      }
    });

    // Search Writing Module
    STUDY_DATA.writing.part1.topics.forEach(t => {
      if (t.title.toLowerCase().includes(cleanQuery) || (t.content && t.content.toLowerCase().includes(cleanQuery))) {
        results.push({ module: 'Expanded Writing', title: t.title, snippet: t.content || '', tab: 'writing' });
      }
    });

    // Search Math Module
    STUDY_DATA.math.part1.topics.forEach(t => {
      if (t.title.toLowerCase().includes(cleanQuery) || (t.content && t.content.toLowerCase().includes(cleanQuery))) {
        results.push({ module: 'Expanded Math', title: t.title, snippet: t.content || '', tab: 'math' });
      }
    });

    // Search Flashcards
    STUDY_DATA.flashcards.forEach(f => {
      if (f.question.toLowerCase().includes(cleanQuery) || f.answer.toLowerCase().includes(cleanQuery)) {
        results.push({ module: `Flashcard (${f.category})`, title: f.question, snippet: f.answer, tab: 'flashcards' });
      }
    });

    if (searchResultsContainer) {
      if (results.length === 0) {
        searchResultsContainer.innerHTML = `
          <div class="card" style="text-align:center; padding:3rem 1rem;">
            <p style="color:var(--text-secondary); font-size:1.1rem;">No matching concepts found for "<strong>${escapeHtml(query)}</strong>".</p>
            <p style="font-size:0.9rem; color:var(--text-muted); margin-top:0.5rem;">Try searching for terms like <em>PEMDAS</em>, <em>phonemes</em>, <em>modifiers</em>, or <em>fluency</em>.</p>
          </div>
        `;
      } else {
        searchResultsContainer.innerHTML = `
          <p style="color:var(--text-secondary); margin-bottom:1rem;">Found <strong>${results.length}</strong> matching concept(s) for "<strong>${escapeHtml(query)}</strong>":</p>
          ${results.map(r => `
            <div class="card" style="margin-bottom:1rem; cursor:pointer;" onclick="window.appSwitchTab('${r.tab}')">
              <span class="flashcard-category" style="margin-bottom:0.35rem; display:inline-block;">${r.module}</span>
              <h4 style="font-size:1.1rem; font-weight:700; color:var(--brand-primary); margin-bottom:0.35rem;">${r.title}</h4>
              <p style="font-size:0.9rem; color:var(--text-secondary);">${r.snippet}</p>
            </div>
          `).join('')}
        `;
      }
    }
  }

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  // Theme Management
  function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeToggleUI();
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        state.theme = state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', state.theme);
        document.documentElement.setAttribute('data-theme', state.theme);
        updateThemeToggleUI();
      });
    }
  }

  function updateThemeToggleUI() {
    if (!themeToggleBtn) return;
    themeToggleBtn.innerHTML = state.theme === 'light'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> Dark Mode`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg> Light Mode`;
  }

  // Switch View Tab
  function switchTab(tabId) {
    state.currentTab = tabId;
    navLinks.forEach(link => {
      if (link.dataset.tab === tabId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    viewSections.forEach(section => {
      if (section.id === `view-${tabId}`) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    if (sidebar) sidebar.classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tabId === 'dashboard') renderDashboard();
    if (tabId === 'general') renderGeneralGuide();
    if (tabId === 'reading') renderReadingModule();
    if (tabId === 'writing') renderWritingModule();
    if (tabId === 'math') renderMathModule();
    if (tabId === 'flashcards') renderFlashcards();
    if (tabId === 'quiz') renderQuiz();
  }

  window.appSwitchTab = switchTab;

  // Render Dashboard
  function renderDashboard() {
    const container = document.getElementById('view-dashboard');
    if (!container) return;

    const data = STUDY_DATA.general;
    container.innerHTML = `
      <div class="hero-banner">
        <h1 class="hero-title">Title I Paraprofessional Exam Study Guide</h1>
        <p class="hero-subtitle">Comprehensive prep tool for foundational reading, writing, and math skills plus K-3 instructional scenario mastery.</p>
        <div class="hero-stats">
          <div class="stat-pill"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> 4 Study Modules</div>
          <div class="stat-pill"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg> ${STUDY_DATA.flashcards.length} Interactive Flashcards</div>
          <div class="stat-pill"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${STUDY_DATA.assessment.questions.length} Practice Assessment Qs</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Core Competencies</h3>
            <div class="card-icon-badge blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
          </div>
          <p style="margin-bottom:1rem; color:var(--text-secondary);">${data.welcome}</p>
          ${data.coreCompetencies.map(c => `
            <div class="competency-card">
              <div style="font-weight:700; font-size:1.05rem; color:var(--brand-primary); margin-bottom:0.25rem;">${c.num}. ${c.title}</div>
              <p style="color:var(--text-secondary); font-size:0.9rem;">${c.desc}</p>
            </div>
          `).join('')}
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">General Test-Taking Tips</h3>
            <div class="card-icon-badge amber">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:1rem;">
            ${data.testTips.map(tip => `
              <div>
                <div style="font-weight:700; font-size:0.95rem; color:var(--text-primary); margin-bottom:0.25rem;">✨ ${tip.title}</div>
                <p style="font-size:0.875rem; color:var(--text-secondary);">${tip.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <h3 style="font-size:1.4rem; font-weight:700; margin:2rem 0 1rem; color:var(--text-primary);">Explore Study Modules</h3>
      <div class="grid-3">
        ${data.modulesSummary.map(m => `
          <div class="card" style="cursor:pointer;" onclick="window.appSwitchTab('${m.id}')">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
              <h4 style="font-weight:700; font-size:1.1rem; color:var(--text-primary);">${m.title}</h4>
              <div class="card-icon-badge ${m.color}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
            <h5 style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase; margin-bottom:0.5rem;">Foundational Skills</h5>
            <ul style="font-size:0.85rem; color:var(--text-secondary); margin-left:1.25rem; margin-bottom:1rem;">
              ${m.foundational.slice(0, 2).map(f => `<li>${f.title}</li>`).join('')}
            </ul>
            <h5 style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase; margin-bottom:0.5rem;">K-3 Instructional Scenarios</h5>
            <ul style="font-size:0.85rem; color:var(--text-secondary); margin-left:1.25rem;">
              ${m.scenarios.slice(0, 2).map(s => `<li>${s.title}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Render General Study Guide
  function renderGeneralGuide() {
    const container = document.getElementById('view-general');
    if (!container) return;
    const data = STUDY_DATA.general;

    container.innerHTML = `
      <h2 style="font-size:1.8rem; font-weight:800; margin-bottom:0.5rem;">${data.title}</h2>
      <p style="color:var(--text-secondary); margin-bottom:2rem;">${data.subtitle}</p>

      <div class="card" style="margin-bottom:2rem;">
        <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:1rem;">The Two Core Exam Pillars</h3>
        <div class="grid-2">
          ${data.coreCompetencies.map(c => `
            <div style="background-color:var(--bg-tertiary); padding:1.25rem; border-radius:var(--radius-md);">
              <h4 style="color:var(--brand-primary); font-size:1.1rem; margin-bottom:0.5rem;">Pillar ${c.num}: ${c.title}</h4>
              <p style="color:var(--text-secondary); font-size:0.95rem;">${c.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <h3 style="font-size:1.3rem; font-weight:700; margin-bottom:1rem;">Section Summaries</h3>
      ${data.modulesSummary.map(m => `
        <div class="card" style="margin-bottom:1.5rem;">
          <h3 class="card-title" style="color:var(--brand-primary); margin-bottom:1rem;">${m.title}</h3>
          <div class="grid-2">
            <div>
              <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-primary); margin-bottom:0.5rem;">Foundational Skills</h4>
              ${m.foundational.map(f => `
                <div style="margin-bottom:0.75rem;">
                  <strong style="font-size:0.9rem; color:var(--text-primary);">${f.title}:</strong>
                  <p style="font-size:0.875rem; color:var(--text-secondary);">${f.desc}</p>
                </div>
              `).join('')}
            </div>
            <div>
              <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-primary); margin-bottom:0.5rem;">K-3 Instructional Scenarios</h4>
              ${m.scenarios.map(s => `
                <div style="margin-bottom:0.75rem;">
                  <strong style="font-size:0.9rem; color:var(--text-primary);">${s.title}:</strong>
                  <p style="font-size:0.875rem; color:var(--text-secondary);">${s.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `).join('')}
    `;
  }

  // Render Expanded Reading Module
  function renderReadingModule() {
    const container = document.getElementById('view-reading');
    if (!container) return;
    const data = STUDY_DATA.reading;

    container.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h2 style="font-size:1.8rem; font-weight:800; color:var(--reading-color);">${data.title}</h2>
          <p style="color:var(--text-secondary);">${data.subtitle}</p>
        </div>
        <button class="btn btn-primary" onclick="window.appSwitchTab('quiz')">Take Reading Quiz</button>
      </div>

      <div class="callout" style="border-left-color:var(--reading-color); background-color:var(--reading-bg); color:var(--text-primary); margin-bottom:1.5rem;">
        <p style="font-size:0.95rem;">${data.intro}</p>
      </div>

      <div class="quick-jump-bar">
        <span class="quick-jump-title">Quick Jump:</span>
        <a class="jump-pill" onclick="document.getElementById('r1-1')?.scrollIntoView({behavior:'smooth'})">1. Main Idea</a>
        <a class="jump-pill" onclick="document.getElementById('r1-2')?.scrollIntoView({behavior:'smooth'})">2. Inferences</a>
        <a class="jump-pill" onclick="document.getElementById('r1-3')?.scrollIntoView({behavior:'smooth'})">3. Vocabulary</a>
        <a class="jump-pill" onclick="document.getElementById('r1-4')?.scrollIntoView({behavior:'smooth'})">4. Fact vs Opinion</a>
        <a class="jump-pill" onclick="document.getElementById('r1-5')?.scrollIntoView({behavior:'smooth'})">5. Purpose</a>
        <a class="jump-pill" onclick="document.getElementById('r1-6')?.scrollIntoView({behavior:'smooth'})">6. Structure</a>
        <a class="jump-pill" onclick="document.getElementById('r2-1')?.scrollIntoView({behavior:'smooth'})">K-3 Scenarios</a>
      </div>

      <!-- Part 1: Foundational Reading -->
      <h3 style="font-size:1.3rem; font-weight:700; margin-bottom:1rem;">${data.part1.title}</h3>
      ${data.part1.topics.map(t => `
        <div class="card" id="${t.id}" style="margin-bottom:1.5rem;">
          <h4 class="card-title" style="margin-bottom:0.75rem;">${t.title}</h4>
          <p style="color:var(--text-secondary); margin-bottom:0.75rem;">${t.content || ''}</p>
          ${t.testTip ? `<div class="callout"><div class="callout-title">💡 Test Tip</div><p style="font-size:0.9rem;">${t.testTip}</p></div>` : ''}
          ${t.example ? `<p style="font-size:0.9rem; background:var(--bg-tertiary); padding:0.75rem; border-radius:var(--radius-sm); color:var(--text-secondary);"><strong>Example:</strong> ${t.example}</p>` : ''}
          ${t.textSample ? `
            <div style="background:var(--bg-tertiary); padding:1rem; border-radius:var(--radius-sm); margin:0.75rem 0;">
              <p style="font-style:italic; font-weight:500;">${t.textSample}</p>
              <p style="color:var(--reading-color); font-weight:600; margin-top:0.5rem;">${t.inferenceSample}</p>
            </div>
          ` : ''}
          ${t.types ? `
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              ${t.types.map(tp => `<div style="font-size:0.9rem;"><strong>${tp.name}:</strong> <span style="font-style:italic;">${tp.text}</span></div>`).join('')}
            </div>
          ` : ''}
          ${t.pie ? `
            <div class="grid-3" style="margin-top:1rem;">
              ${t.pie.map(p => `
                <div style="background:var(--bg-tertiary); padding:1rem; border-radius:var(--radius-md); text-align:center;">
                  <div style="font-size:1.8rem; font-weight:800; color:var(--reading-color);">${p.letter}</div>
                  <strong style="display:block; margin-bottom:0.25rem;">${p.name}</strong>
                  <p style="font-size:0.85rem; color:var(--text-secondary);">${p.desc}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${t.structures ? `
            <div class="grid-2" style="margin-top:1rem;">
              ${t.structures.map(st => `
                <div style="background:var(--bg-tertiary); padding:0.75rem 1rem; border-radius:var(--radius-sm);">
                  <strong style="color:var(--text-primary);">${st.name}:</strong>
                  <span style="font-size:0.875rem; color:var(--text-secondary);">${st.desc}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}

      <!-- Part 2: K-3 Reading Scenarios -->
      <h3 style="font-size:1.3rem; font-weight:700; margin:2rem 0 1rem;">${data.part2.title}</h3>
      ${data.part2.topics.map(t => `
        <div class="card" id="${t.id}" style="margin-bottom:1.5rem;">
          <h4 class="card-title" style="margin-bottom:0.75rem;">${t.title}</h4>
          <p style="color:var(--text-secondary); margin-bottom:0.75rem;">${t.content || ''}</p>
          ${t.points ? `<ul style="margin-left:1.25rem; font-size:0.9rem; color:var(--text-secondary);">${t.points.map(p => `<li style="margin-bottom:0.35rem;">${p}</li>`).join('')}</ul>` : ''}
          ${t.approaches ? `
            <div style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.75rem;">
              ${t.approaches.map(ap => `
                <div style="font-size:0.9rem; padding:0.65rem; border-radius:var(--radius-sm); background:${ap.type.includes('Effective Scaffolding') ? 'var(--writing-bg)' : 'var(--bg-tertiary)'};">
                  <strong>${ap.type}:</strong> ${ap.text}
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${t.components ? `
            <div class="grid-3" style="margin-top:0.75rem;">
              ${t.components.map(cp => `
                <div style="background:var(--bg-tertiary); padding:0.75rem; border-radius:var(--radius-sm);">
                  <strong style="color:var(--reading-color); display:block; margin-bottom:0.25rem;">${cp.name}</strong>
                  <p style="font-size:0.85rem; color:var(--text-secondary);">${cp.desc}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${t.interventions ? `
            <div style="margin-top:0.75rem; display:flex; flex-direction:column; gap:0.5rem;">
              ${t.interventions.map(it => `
                <div style="font-size:0.9rem; background:var(--bg-tertiary); padding:0.65rem; border-radius:var(--radius-sm);">
                  <strong style="color:var(--brand-primary);">${it.name}:</strong> ${it.desc}
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${t.stages ? `
            <div style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.75rem;">
              ${t.stages.map(st => `
                <div style="font-size:0.9rem; background:var(--bg-tertiary); padding:0.65rem; border-radius:var(--radius-sm);">
                  <strong>${st.stage}:</strong> ${st.desc}
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${t.tools ? `
            <div class="grid-2" style="margin-top:0.75rem;">
              ${t.tools.map(tl => `
                <div style="background:var(--bg-tertiary); padding:0.75rem; border-radius:var(--radius-sm);">
                  <strong style="color:var(--text-primary); display:block; margin-bottom:0.25rem;">${tl.name}</strong>
                  <p style="font-size:0.85rem; color:var(--text-secondary);">${tl.desc}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}

      <div class="card" style="border-top:4px solid var(--reading-color); margin-top:2rem;">
        <h4 style="font-size:1.1rem; font-weight:700; margin-bottom:1rem;">Practice Scenarios for the Assessment</h4>
        ${data.part2.scenarios.map(sc => `
          <div style="margin-bottom:1.25rem;">
            <p style="font-weight:700; font-size:0.95rem; margin-bottom:0.35rem;">${sc.q}</p>
            <div class="scenario-correct">${sc.correct}</div>
            <div class="scenario-why">${sc.why}</div>
          </div>
        `).join('')}
        <div class="callout" style="margin-top:1rem;"><p style="font-size:0.9rem; font-weight:600;">${data.part2.keyTakeaway}</p></div>
      </div>
    `;
  }

  // Render Expanded Writing Module
  function renderWritingModule() {
    const container = document.getElementById('view-writing');
    if (!container) return;
    const data = STUDY_DATA.writing;

    container.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h2 style="font-size:1.8rem; font-weight:800; color:var(--writing-color);">${data.title}</h2>
          <p style="color:var(--text-secondary);">${data.subtitle}</p>
        </div>
        <button class="btn btn-primary" onclick="window.appSwitchTab('quiz')">Take Writing Quiz</button>
      </div>

      <div class="callout" style="border-left-color:var(--writing-color); background-color:var(--writing-bg); color:var(--text-primary); margin-bottom:1.5rem;">
        <p style="font-size:0.95rem;">${data.intro}</p>
      </div>

      <div class="quick-jump-bar">
        <span class="quick-jump-title">Quick Jump:</span>
        <a class="jump-pill" onclick="document.getElementById('w1-1')?.scrollIntoView({behavior:'smooth'})">1. Subject-Verb</a>
        <a class="jump-pill" onclick="document.getElementById('w1-2')?.scrollIntoView({behavior:'smooth'})">2. Pronouns</a>
        <a class="jump-pill" onclick="document.getElementById('w1-3')?.scrollIntoView({behavior:'smooth'})">3. Sentence Structure</a>
        <a class="jump-pill" onclick="document.getElementById('w1-4')?.scrollIntoView({behavior:'smooth'})">4. Punctuation</a>
        <a class="jump-pill" onclick="document.getElementById('w1-5')?.scrollIntoView({behavior:'smooth'})">5. Modifiers</a>
        <a class="jump-pill" onclick="document.getElementById('w1-6')?.scrollIntoView({behavior:'smooth'})">6. Confused Words</a>
        <a class="jump-pill" onclick="document.getElementById('w2-1')?.scrollIntoView({behavior:'smooth'})">K-3 Scenarios</a>
      </div>

      <!-- Part 1: Foundational Writing -->
      <h3 style="font-size:1.3rem; font-weight:700; margin-bottom:1rem;">${data.part1.title}</h3>
      ${data.part1.topics.map(t => `
        <div class="card" id="${t.id}" style="margin-bottom:1.5rem;">
          <h4 class="card-title" style="margin-bottom:0.75rem;">${t.title}</h4>
          <p style="color:var(--text-secondary); margin-bottom:0.75rem;">${t.content || ''}</p>
          ${t.examples ? `
            <div style="background:var(--bg-tertiary); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.875rem; margin-bottom:0.75rem;">
              ${t.examples.map(ex => typeof ex === 'object' ? `
                <div style="margin-bottom:0.5rem;">
                  <div style="color:#ef4444; margin-bottom:0.15rem;">❌ ${ex.wrong}</div>
                  <div style="color:var(--writing-color); font-weight:600;">✅ ${ex.right}</div>
                </div>
              ` : `<div style="margin-bottom:0.25rem;">${ex}</div>`).join('')}
            </div>
          ` : ''}
          ${t.note ? `<div class="callout"><div class="callout-title">📌 Test Note</div><p style="font-size:0.875rem;">${t.note}</p></div>` : ''}
          ${t.pitfalls ? `
            <div style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.75rem;">
              ${t.pitfalls.map(p => `
                <div style="font-size:0.875rem; background:var(--bg-tertiary); padding:0.65rem; border-radius:var(--radius-sm);">
                  <strong style="color:var(--text-primary);">${p.rule}:</strong>
                  <div style="color:#ef4444; margin-top:0.25rem;">❌ ${p.wrong}</div>
                  <div style="color:var(--writing-color); margin-top:0.15rem;">✅ ${p.right}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${t.details ? `
            <div style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.75rem;">
              ${t.details.map(d => `
                <div style="font-size:0.875rem; background:var(--bg-tertiary); padding:0.65rem; border-radius:var(--radius-sm);">
                  <strong style="color:var(--writing-color);">${d.type}:</strong> ${d.ex || ''}
                  ${d.fix ? `<div style="color:var(--text-primary); font-weight:600; margin-top:0.25rem;">Fix: ${d.fix}</div>` : ''}
                  ${d.fix1 ? `
                    <div style="margin-top:0.35rem; display:flex; flex-direction:column; gap:0.2rem;">
                      <div>${d.fix1}</div>
                      <div>${d.fix2}</div>
                      <div>${d.fix3}</div>
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${t.rules ? `
            <div class="grid-2" style="margin-top:0.75rem;">
              ${t.rules.map(r => `
                <div style="background:var(--bg-tertiary); padding:0.75rem; border-radius:var(--radius-sm);">
                  <strong style="color:var(--text-primary); display:block; margin-bottom:0.25rem;">${r.title}</strong>
                  <p style="font-size:0.85rem; color:var(--text-secondary); white-space:pre-line;">${r.desc}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${t.words ? `
            <div style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.75rem;">
              ${t.words.map(w => `
                <div style="background:var(--bg-tertiary); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.875rem;">
                  <strong style="color:var(--writing-color); display:block; margin-bottom:0.25rem;">${w.pair}</strong>
                  <p style="color:var(--text-secondary); white-space:pre-line;">${w.desc}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}

      <!-- Part 2: K-3 Writing Scenarios -->
      <h3 style="font-size:1.3rem; font-weight:700; margin:2rem 0 1rem;">${data.part2.title}</h3>
      ${data.part2.topics.map(t => `
        <div class="card" id="${t.id}" style="margin-bottom:1.5rem;">
          <h4 class="card-title" style="margin-bottom:0.75rem;">${t.title}</h4>
          <p style="color:var(--text-secondary); margin-bottom:0.75rem;">${t.content || ''}</p>
          ${t.activities ? `<ul style="margin-left:1.25rem; font-size:0.9rem; color:var(--text-secondary);">${t.activities.map(a => `<li style="margin-bottom:0.35rem;">${a}</li>`).join('')}</ul>` : ''}
          ${t.steps ? `
            <div style="display:flex; flex-direction:column; gap:0.75rem; margin-top:0.75rem;">
              ${t.steps.map(s => `
                <div style="background:var(--bg-tertiary); padding:0.85rem; border-radius:var(--radius-sm);">
                  <strong style="color:var(--writing-color); font-size:0.95rem; display:block; margin-bottom:0.25rem;">${s.name}</strong>
                  <p style="font-size:0.875rem; color:var(--text-secondary); white-space:pre-line;">${s.desc}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${t.populations ? `
            <div class="grid-2" style="margin-top:0.75rem;">
              ${t.populations.map(p => `
                <div style="background:var(--bg-tertiary); padding:0.85rem; border-radius:var(--radius-sm);">
                  <strong style="color:var(--text-primary); display:block; margin-bottom:0.25rem;">${p.group}</strong>
                  <p style="font-size:0.85rem; color:var(--text-secondary); white-space:pre-line;">${p.strategy}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}

      <div class="card" style="border-top:4px solid var(--writing-color); margin-top:2rem;">
        <h4 style="font-size:1.1rem; font-weight:700; margin-bottom:1rem;">Practice Scenarios for the Assessment</h4>
        ${data.part2.scenarios.map(sc => `
          <div style="margin-bottom:1.25rem;">
            <p style="font-weight:700; font-size:0.95rem; margin-bottom:0.35rem;">${sc.q}</p>
            <div class="scenario-correct">${sc.correct}</div>
            <div class="scenario-why">${sc.why}</div>
          </div>
        `).join('')}
        <div class="callout" style="margin-top:1rem;"><p style="font-size:0.9rem; font-weight:600;">${data.part2.keyTakeaway}</p></div>
      </div>
    `;
  }

  // Render Expanded Math Module
  function renderMathModule() {
    const container = document.getElementById('view-math');
    if (!container) return;
    const data = STUDY_DATA.math;

    container.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h2 style="font-size:1.8rem; font-weight:800; color:var(--math-color);">${data.title}</h2>
          <p style="color:var(--text-secondary);">${data.subtitle}</p>
        </div>
        <button class="btn btn-primary" onclick="window.appSwitchTab('quiz')">Take Math Quiz</button>
      </div>

      <div class="callout" style="border-left-color:var(--math-color); background-color:var(--math-bg); color:var(--text-primary); margin-bottom:1.5rem;">
        <p style="font-size:0.95rem;">${data.intro}</p>
      </div>

      <div class="quick-jump-bar">
        <span class="quick-jump-title">Quick Jump:</span>
        <a class="jump-pill" onclick="document.getElementById('m1-1')?.scrollIntoView({behavior:'smooth'})">1. PEMDAS</a>
        <a class="jump-pill" onclick="document.getElementById('m1-2')?.scrollIntoView({behavior:'smooth'})">2. Fractions</a>
        <a class="jump-pill" onclick="document.getElementById('m1-3')?.scrollIntoView({behavior:'smooth'})">3. Percentages</a>
        <a class="jump-pill" onclick="document.getElementById('m1-4')?.scrollIntoView({behavior:'smooth'})">4. Algebra</a>
        <a class="jump-pill" onclick="document.getElementById('m1-5')?.scrollIntoView({behavior:'smooth'})">5. Geometry</a>
        <a class="jump-pill" onclick="document.getElementById('m1-6')?.scrollIntoView({behavior:'smooth'})">6. Statistics</a>
        <a class="jump-pill" onclick="document.getElementById('m2-1')?.scrollIntoView({behavior:'smooth'})">K-3 Scenarios</a>
      </div>

      <!-- Part 1: Foundational Math -->
      <h3 style="font-size:1.3rem; font-weight:700; margin-bottom:1rem;">${data.part1.title}</h3>
      ${data.part1.topics.map(t => `
        <div class="card" id="${t.id}" style="margin-bottom:1.5rem;">
          <h4 class="card-title" style="margin-bottom:0.75rem;">${t.title}</h4>
          <p style="color:var(--text-secondary); margin-bottom:0.75rem;">${t.content || ''}</p>
          ${t.steps ? `
            <ol style="margin-left:1.25rem; font-size:0.9rem; color:var(--text-secondary); margin-bottom:0.75rem;">
              ${t.steps.map(s => `<li>${s}</li>`).join('')}
            </ol>
          ` : ''}
          ${t.example ? `
            <div style="background:var(--bg-tertiary); padding:0.85rem; border-radius:var(--radius-sm); font-size:0.9rem;">
              ${typeof t.example === 'object' ? `
                <div style="font-weight:700; font-family:var(--font-mono); font-size:1rem; color:var(--math-color); margin-bottom:0.35rem;">${t.example.expr}</div>
                <div>${t.example.step1}</div>
                <div>${t.example.step2}</div>
                <div style="font-weight:600; color:var(--text-primary); margin-top:0.25rem;">${t.example.step3}</div>
              ` : `<div style="white-space:pre-line;">${t.example}</div>`}
            </div>
          ` : ''}
          ${t.details ? `
            <div style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.75rem;">
              ${t.details.map(d => `
                <div style="background:var(--bg-tertiary); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.875rem;">
                  <p style="color:var(--text-secondary); white-space:pre-line;">${d}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}

      <!-- Part 2: K-3 Math Scenarios & Interactive Visualizers -->
      <h3 style="font-size:1.3rem; font-weight:700; margin:2rem 0 1rem;">${data.part2.title}</h3>
      
      <!-- Interactive Ten-Frame Visualizer -->
      <div class="manipulative-container">
        <h4 class="manipulative-title">🧮 Interactive Ten-Frame Visualizer (K-1st Grade)</h4>
        <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:1rem;">Visualizing how students "bridge to ten" during addition:</p>
        <div style="display:flex; gap:1rem; align-items:center; margin-bottom:1rem; flex-wrap:wrap;">
          <label style="font-size:0.875rem; font-weight:600;">Start Count: <input type="number" id="ten-num1" value="8" min="1" max="9" style="width:60px; padding:0.35rem; border-radius:4px; border:1px solid var(--border-color);"></label>
          <label style="font-size:0.875rem; font-weight:600;">Add Count: <input type="number" id="ten-num2" value="5" min="1" max="9" style="width:60px; padding:0.35rem; border-radius:4px; border:1px solid var(--border-color);"></label>
          <button class="btn btn-primary" id="btn-update-tenframe">Update Visualizer</button>
        </div>
        <div style="display:flex; gap:1.5rem; flex-wrap:wrap; justify-content:center; margin:1rem 0;">
          <div>
            <div style="text-align:center; font-size:0.8rem; font-weight:700; margin-bottom:0.35rem;">Frame 1 (Base 10)</div>
            <div class="ten-frame-grid" id="frame-1"></div>
          </div>
          <div>
            <div style="text-align:center; font-size:0.8rem; font-weight:700; margin-bottom:0.35rem;">Frame 2 (Spillover)</div>
            <div class="ten-frame-grid" id="frame-2"></div>
          </div>
        </div>
        <div id="tenframe-result" style="text-align:center; font-size:0.95rem; font-weight:600; color:var(--brand-primary); margin-top:0.5rem;"></div>
      </div>

      ${data.part2.topics.map(t => `
        <div class="card" id="${t.id}" style="margin-bottom:1.5rem;">
          <h4 class="card-title" style="margin-bottom:0.75rem;">${t.title}</h4>
          <p style="color:var(--text-secondary); margin-bottom:0.75rem;">${t.content || ''}</p>
          ${t.tools ? `
            <div style="display:flex; flex-direction:column; gap:0.75rem; margin-top:0.75rem;">
              ${t.tools.map(tl => `
                <div style="background:var(--bg-tertiary); padding:0.85rem; border-radius:var(--radius-sm);">
                  <strong style="color:var(--math-color); font-size:0.95rem; display:block; margin-bottom:0.25rem;">${tl.name}</strong>
                  <p style="font-size:0.875rem; color:var(--text-secondary); white-space:pre-line;">${tl.desc}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${t.errors ? `
            <div class="grid-2" style="margin-top:0.75rem;">
              ${t.errors.map(er => `
                <div style="background:var(--bg-tertiary); padding:0.85rem; border-radius:var(--radius-sm);">
                  <strong style="color:#ef4444; display:block; margin-bottom:0.35rem;">${er.name}</strong>
                  <div style="font-family:var(--font-mono); font-size:0.875rem; background:var(--bg-primary); padding:0.5rem; border-radius:var(--radius-sm); margin-bottom:0.5rem;">
                    <strong>Problem:</strong> ${er.problem}
                  </div>
                  <p style="font-size:0.85rem; color:var(--text-secondary);">${er.diagnosis}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${t.scaffolding ? `
            <div style="background:var(--bg-tertiary); padding:0.85rem; border-radius:var(--radius-sm); font-size:0.875rem; margin-top:0.75rem;">
              ${t.scaffolding.map(sc => `<p style="margin-bottom:0.35rem; color:var(--text-secondary); white-space:pre-line;">${sc}</p>`).join('')}
            </div>
          ` : ''}
          ${t.strategy ? `<div class="callout"><p style="font-size:0.9rem; color:var(--text-secondary); white-space:pre-line;">${t.strategy}</p></div>` : ''}
          ${t.solution ? `<div class="callout" style="border-left-color:var(--math-color);"><p style="font-size:0.9rem; color:var(--text-secondary); white-space:pre-line;">${t.solution}</p></div>` : ''}
        </div>
      `).join('')}

      <div class="card" style="border-top:4px solid var(--math-color); margin-top:2rem;">
        <h4 style="font-size:1.1rem; font-weight:700; margin-bottom:1rem;">Practice Scenarios for the Assessment</h4>
        ${data.part2.scenarios.map(sc => `
          <div style="margin-bottom:1.25rem;">
            <p style="font-weight:700; font-size:0.95rem; margin-bottom:0.35rem;">${sc.q}</p>
            <div class="scenario-correct">${sc.correct}</div>
            <div class="scenario-why">${sc.why}</div>
          </div>
        `).join('')}
        <div class="callout" style="margin-top:1rem;"><p style="font-size:0.9rem; font-weight:600;">${data.part2.keyTakeaway}</p></div>
      </div>
    `;

    // Bind Ten-Frame controls
    document.getElementById('btn-update-tenframe')?.addEventListener('click', updateTenFrameVisualizer);
    updateTenFrameVisualizer();
  }

  function updateTenFrameVisualizer() {
    const val1 = parseInt(document.getElementById('ten-num1')?.value || 8, 10);
    const val2 = parseInt(document.getElementById('ten-num2')?.value || 5, 10);
    const frame1 = document.getElementById('frame-1');
    const frame2 = document.getElementById('frame-2');
    const resultDiv = document.getElementById('tenframe-result');
    if (!frame1 || !frame2) return;

    frame1.innerHTML = '';
    frame2.innerHTML = '';

    const total = val1 + val2;
    const frame1Count = Math.min(10, total);
    const frame2Count = Math.max(0, total - 10);

    for (let i = 0; i < 10; i++) {
      const cell = document.createElement('div');
      cell.className = 'ten-frame-cell';
      if (i < val1) {
        cell.classList.add('filled');
      } else if (i < frame1Count) {
        cell.classList.add('spill');
      }
      frame1.appendChild(cell);
    }

    for (let i = 0; i < 10; i++) {
      const cell = document.createElement('div');
      cell.className = 'ten-frame-cell';
      if (i < frame2Count) {
        cell.classList.add('spill');
      }
      frame2.appendChild(cell);
    }

    if (resultDiv) {
      if (val1 + val2 > 10) {
        const needed = 10 - val1;
        const remaining = val2 - needed;
        resultDiv.innerHTML = `${val1} + ${val2} = (${val1} + ${needed}) + ${remaining} = 10 + ${remaining} = <strong>${total}</strong> (Bridge to 10)`;
      } else {
        resultDiv.innerHTML = `${val1} + ${val2} = <strong>${total}</strong>`;
      }
    }
  }

  // Render Flashcards Module
  function getActiveFlashcards() {
    if (state.flashcards.shuffledDeck) {
      return state.flashcards.shuffledDeck;
    }
    return state.flashcards.filterCategory === 'All'
      ? STUDY_DATA.flashcards
      : STUDY_DATA.flashcards.filter(c => c.category === state.flashcards.filterCategory);
  }

  function getActiveFlashcard() {
    const cards = getActiveFlashcards();
    return cards[state.flashcards.currentIndex] || cards[0];
  }

  function renderFlashcards() {
    const container = document.getElementById('view-flashcards');
    if (!container) return;

    const cards = getActiveFlashcards();
    const currentCard = cards[state.flashcards.currentIndex] || cards[0];
    const isMastered = state.flashcards.masteredIds.includes(currentCard.id);

    container.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h2 style="font-size:1.8rem; font-weight:800;">Interactive Flashcards</h2>
          <p style="color:var(--text-secondary);">Master key concepts, rules, and pedagogical terms.</p>
        </div>

        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          ${['All', 'Reading', 'Writing', 'Math'].map(cat => `
            <button class="btn ${state.flashcards.filterCategory === cat && !state.flashcards.shuffledDeck ? 'btn-primary' : 'btn-outline'}" onclick="window.appFilterFlashcards('${cat}')">${cat}</button>
          `).join('')}
          <button class="btn btn-outline" onclick="window.appShuffleFlashcards()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5"></path><path d="M4 20L21 3"></path><path d="M21 16v5h-5"></path><path d="M15 15l6 6"></path><path d="M4 4l5 5"></path></svg>
            Shuffle Deck
          </button>
        </div>
      </div>

      <div class="flashcard-wrapper">
        <div class="flashcard" id="flashcard-element" onclick="this.classList.toggle('flipped')">
          <div class="flashcard-front">
            <span class="flashcard-category">${currentCard.category} • ${currentCard.tag}</span>
            <div class="flashcard-q">${currentCard.question}</div>
            <span style="font-size:0.8rem; color:var(--text-muted); margin-top:1rem;">Click or press Space to flip 🔄</span>
          </div>
          <div class="flashcard-back">
            <span class="flashcard-category" style="background:var(--writing-bg); color:var(--writing-color);">Answer Key</span>
            <div class="flashcard-a">${currentCard.answer}</div>
          </div>
        </div>

        <div class="flashcard-controls">
          <button class="btn btn-outline" onclick="window.appPrevFlashcard()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg> Previous</button>
          <span style="font-weight:600; font-size:0.9rem; color:var(--text-secondary);">${state.flashcards.currentIndex + 1} / ${cards.length}</span>
          <button class="btn btn-outline" onclick="window.appNextFlashcard()">Next <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></button>
          <button class="btn ${isMastered ? 'btn-success' : 'btn-outline'}" onclick="window.appToggleMastered(${currentCard.id})">
            ${isMastered ? '✓ Mastered' : 'Mark as Mastered'}
          </button>
        </div>

        <div class="keyboard-legend">
          <span><span class="key-cap">←</span> <span class="key-cap">→</span> Navigate</span>
          <span><span class="key-cap">Space</span> Flip Card</span>
          <span><span class="key-cap">M</span> Mastered</span>
        </div>
      </div>
    `;
  }

  window.appFlipFlashcard = () => {
    const el = document.getElementById('flashcard-element');
    if (el) el.classList.toggle('flipped');
  };

  window.appFilterFlashcards = (cat) => {
    state.flashcards.shuffledDeck = null;
    state.flashcards.filterCategory = cat;
    state.flashcards.currentIndex = 0;
    renderFlashcards();
  };

  window.appShuffleFlashcards = () => {
    const cards = state.flashcards.filterCategory === 'All'
      ? [...STUDY_DATA.flashcards]
      : STUDY_DATA.flashcards.filter(c => c.category === state.flashcards.filterCategory);

    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    state.flashcards.shuffledDeck = cards;
    state.flashcards.currentIndex = 0;
    renderFlashcards();
  };

  window.appPrevFlashcard = () => {
    const cards = getActiveFlashcards();
    state.flashcards.currentIndex = (state.flashcards.currentIndex - 1 + cards.length) % cards.length;
    renderFlashcards();
  };

  window.appNextFlashcard = () => {
    const cards = getActiveFlashcards();
    state.flashcards.currentIndex = (state.flashcards.currentIndex + 1) % cards.length;
    renderFlashcards();
  };

  window.appToggleMastered = (id) => {
    if (state.flashcards.masteredIds.includes(id)) {
      state.flashcards.masteredIds = state.flashcards.masteredIds.filter(i => i !== id);
    } else {
      state.flashcards.masteredIds.push(id);
    }
    localStorage.setItem('masteredFlashcards', JSON.stringify(state.flashcards.masteredIds));
    renderFlashcards();
    updateProgressWidget();
  };

  // Timer Helpers for Quiz
  function formatTimer(totalSecs) {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function startQuizTimer() {
    if (state.quiz.timerInterval) clearInterval(state.quiz.timerInterval);
    state.quiz.timerRunning = true;
    state.quiz.timerInterval = setInterval(() => {
      if (state.quiz.timerSeconds > 0) {
        state.quiz.timerSeconds--;
        const timerEl = document.getElementById('quiz-timer-display');
        if (timerEl) {
          timerEl.textContent = formatTimer(state.quiz.timerSeconds);
          if (state.quiz.timerSeconds < 300) {
            timerEl.parentElement.classList.add('warning');
          }
        }
      } else {
        clearInterval(state.quiz.timerInterval);
        state.quiz.timerRunning = false;
        state.quiz.completed = true;
        renderQuiz();
      }
    }, 1000);
  }

  window.appToggleQuizTimer = () => {
    if (state.quiz.timerRunning) {
      if (state.quiz.timerInterval) clearInterval(state.quiz.timerInterval);
      state.quiz.timerRunning = false;
    } else {
      startQuizTimer();
    }
    renderQuiz();
  };

  window.appToggleFlagQuestion = (id) => {
    if (state.quiz.flaggedIds.includes(id)) {
      state.quiz.flaggedIds = state.quiz.flaggedIds.filter(i => i !== id);
    } else {
      state.quiz.flaggedIds.push(id);
    }
    renderQuiz();
  };

  window.appJumpToQuestion = (index) => {
    state.quiz.currentIndex = index;
    renderQuiz();
  };

  // Render Practice Assessment Quiz
  function renderQuiz() {
    const container = document.getElementById('view-quiz');
    if (!container) return;

    const questions = STUDY_DATA.assessment.questions;
    const currentQ = questions[state.quiz.currentIndex];
    const selectedOption = state.quiz.userAnswers[currentQ.id];
    const isFlagged = state.quiz.flaggedIds.includes(currentQ.id);

    if (state.quiz.completed) {
      renderQuizResults(container);
      return;
    }

    container.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-header">
          <div>
            <span class="question-counter">QUESTION ${currentQ.id} OF ${questions.length}</span>
            <div style="font-size:0.8rem; font-weight:700; color:var(--brand-primary);">${currentQ.section} • ${currentQ.type}</div>
          </div>

          <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
            ${state.quiz.mode === 'exam' ? `
              <div class="quiz-timer ${state.quiz.timerSeconds < 300 ? 'warning' : ''}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span id="quiz-timer-display">${formatTimer(state.quiz.timerSeconds)}</span>
                <button style="background:none; border:none; cursor:pointer; color:inherit; margin-left:0.25rem;" onclick="window.appToggleQuizTimer()">
                  ${state.quiz.timerRunning ? '⏸' : '▶'}
                </button>
              </div>
            ` : ''}
            <button class="btn ${state.quiz.mode === 'practice' ? 'btn-primary' : 'btn-outline'}" onclick="window.appSetQuizMode('practice')">Practice Mode</button>
            <button class="btn ${state.quiz.mode === 'exam' ? 'btn-primary' : 'btn-outline'}" onclick="window.appSetQuizMode('exam')">Exam Mode</button>
          </div>
        </div>

        <div class="quiz-mode-banner">
          <div style="font-weight:700; font-size:0.95rem; color:var(--brand-primary); margin-bottom:0.25rem; display:flex; align-items:center; justify-content:space-between;">
            <span>💡 ${state.quiz.mode === 'practice' ? 'Practice Mode' : 'Exam Mode'}</span>
            <button class="flag-btn ${isFlagged ? 'flagged' : ''}" onclick="window.appToggleFlagQuestion(${currentQ.id})">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${isFlagged ? '#f59e0b' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
              ${isFlagged ? 'Flagged for Review' : 'Flag Question'}
            </button>
          </div>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">
            ${state.quiz.mode === 'practice'
              ? '<strong>Practice Mode:</strong> Answers are checked immediately with step-by-step rationale and explanations so you learn as you go.'
              : '<strong>Exam Mode:</strong> Answers are saved silently without feedback to simulate official timed exam conditions. A detailed score report is shown upon submission.'}
          </p>
        </div>

        <!-- Question Navigator Grid (1-15) -->
        <div style="margin-bottom:0.5rem; font-size:0.8rem; font-weight:700; color:var(--text-muted);">QUESTION NAVIGATOR:</div>
        <div class="question-nav-grid">
          ${questions.map((q, idx) => {
            const isCurrent = idx === state.quiz.currentIndex;
            const isAnswered = state.quiz.userAnswers[q.id] !== undefined;
            const qFlagged = state.quiz.flaggedIds.includes(q.id);
            let cls = 'q-nav-btn';
            if (isCurrent) cls += ' active';
            if (isAnswered) cls += ' answered';
            if (qFlagged) cls += ' flagged';
            return `<button class="${cls}" onclick="window.appJumpToQuestion(${idx})" title="Question ${q.id} ${qFlagged ? '(Flagged)' : ''}">${q.id}</button>`;
          }).join('')}
        </div>

        <div class="question-text">${currentQ.question}</div>

        <div class="options-list">
          ${currentQ.options.map((opt, idx) => {
            let className = 'option-btn';
            if (selectedOption === idx) className += ' selected';
            if (state.quiz.mode === 'practice' && selectedOption !== undefined) {
              if (idx === currentQ.answer) className += ' correct-choice';
              else if (selectedOption === idx) className += ' wrong-choice';
            }
            return `
              <button class="${className}" onclick="window.appSelectOption(${currentQ.id}, ${idx})">
                <span>${opt}</span>
                ${state.quiz.mode === 'practice' && selectedOption !== undefined && idx === currentQ.answer ? '<span>✓ Correct</span>' : ''}
              </button>
            `;
          }).join('')}
        </div>

        ${state.quiz.mode === 'practice' && selectedOption !== undefined ? `
          <div class="explanation-panel active">
            <h5 style="color:var(--brand-primary); font-weight:700; margin-bottom:0.35rem;">Explanation</h5>
            <p>${currentQ.explanation}</p>
          </div>
        ` : ''}

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2rem;">
          <button class="btn btn-outline" ${state.quiz.currentIndex === 0 ? 'disabled' : ''} onclick="window.appPrevQuestion()">Previous</button>
          ${state.quiz.currentIndex === questions.length - 1
            ? `<button class="btn btn-success" onclick="window.appSubmitQuiz()">Submit Assessment</button>`
            : `<button class="btn btn-primary" onclick="window.appNextQuestion()">Next Question</button>`}
        </div>
      </div>
    `;
  }

  window.appSetQuizMode = (mode) => {
    state.quiz.mode = mode;
    if (mode === 'exam' && !state.quiz.timerRunning) {
      startQuizTimer();
    }
    renderQuiz();
  };

  window.appSelectOption = (questionId, optionIdx) => {
    state.quiz.userAnswers[questionId] = optionIdx;
    renderQuiz();
  };

  window.appPrevQuestion = () => {
    if (state.quiz.currentIndex > 0) {
      state.quiz.currentIndex--;
      renderQuiz();
    }
  };

  window.appNextQuestion = () => {
    const questions = STUDY_DATA.assessment.questions;
    if (state.quiz.currentIndex < questions.length - 1) {
      state.quiz.currentIndex++;
      renderQuiz();
    }
  };

  window.appSubmitQuiz = () => {
    if (state.quiz.timerInterval) clearInterval(state.quiz.timerInterval);
    state.quiz.timerRunning = false;
    state.quiz.completed = true;
    renderQuiz();
  };

  function renderQuizResults(container) {
    const questions = STUDY_DATA.assessment.questions;
    let score = 0;
    let readingScore = 0;
    let writingScore = 0;
    let mathScore = 0;

    questions.forEach(q => {
      const userChoice = state.quiz.userAnswers[q.id];
      const isCorrect = userChoice === q.answer;
      if (isCorrect) {
        score++;
        if (q.section === 'Reading') readingScore++;
        if (q.section === 'Writing') writingScore++;
        if (q.section === 'Math') mathScore++;
      }
    });

    const percentage = Math.round((score / questions.length) * 100);

    // Save history
    state.quiz.history.push({ date: new Date().toLocaleDateString(), score, total: questions.length, percentage });
    localStorage.setItem('quizHistory', JSON.stringify(state.quiz.history));
    updateProgressWidget();

    container.innerHTML = `
      <div class="quiz-container" style="text-align:center;">
        <h2 style="font-size:2rem; font-weight:800; color:var(--brand-primary); margin-bottom:0.5rem;">Assessment Complete!</h2>
        <p style="color:var(--text-secondary);">Here is your performance breakdown on the Title I Sample Assessment:</p>

        <div class="score-summary-grid">
          <div class="score-card">
            <div class="score-num">${percentage}%</div>
            <div class="score-label">Overall Score (${score}/${questions.length})</div>
          </div>
          <div class="score-card">
            <div class="score-num" style="color:var(--reading-color);">${readingScore}/5</div>
            <div class="score-label">Reading Section</div>
          </div>
          <div class="score-card">
            <div class="score-num" style="color:var(--writing-color);">${writingScore}/5</div>
            <div class="score-label">Writing Section</div>
          </div>
          <div class="score-card">
            <div class="score-num" style="color:var(--math-color);">${mathScore}/5</div>
            <div class="score-label">Math Section</div>
          </div>
        </div>

        <h3 style="text-align:left; margin:2rem 0 1rem; font-size:1.2rem; font-weight:700;">Question Review & Explanations</h3>
        <div style="text-align:left; display:flex; flex-direction:column; gap:1rem;">
          ${questions.map(q => {
            const userChoice = state.quiz.userAnswers[q.id];
            const isCorrect = userChoice === q.answer;
            const isFlagged = state.quiz.flaggedIds.includes(q.id);
            return `
              <div class="card" style="border-left: 4px solid ${isCorrect ? 'var(--writing-color)' : '#ef4444'};">
                <div style="font-weight:700; font-size:0.95rem; margin-bottom:0.5rem; display:flex; justify-content:space-between; align-items:center;">
                  <span>Q${q.id}. ${q.question}</span>
                  ${isFlagged ? '<span style="font-size:0.75rem; background:#fef3c7; color:#b45309; padding:0.15rem 0.5rem; border-radius:4px;">🚩 Flagged</span>' : ''}
                </div>
                <div style="font-size:0.875rem; margin-bottom:0.35rem; color:${isCorrect ? 'var(--writing-color)' : '#ef4444'}; font-weight:600;">
                  Your answer: ${userChoice !== undefined ? q.options[userChoice] : 'Not Answered'} ${isCorrect ? '✓' : '❌'}
                </div>
                ${!isCorrect ? `<div style="font-size:0.875rem; color:var(--writing-color); font-weight:600;">Correct answer: ${q.options[q.answer]}</div>` : ''}
                <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.5rem; background:var(--bg-tertiary); padding:0.65rem; border-radius:4px;">
                  💡 <strong>Explanation:</strong> ${q.explanation}
                </p>
              </div>
            `;
          }).join('')}
        </div>

        <button class="btn btn-primary" style="margin-top:2rem;" onclick="window.appRetakeQuiz()">Retake Assessment</button>
      </div>
    `;
  }

  window.appRetakeQuiz = () => {
    if (state.quiz.timerInterval) clearInterval(state.quiz.timerInterval);
    state.quiz.completed = false;
    state.quiz.currentIndex = 0;
    state.quiz.userAnswers = {};
    state.quiz.flaggedIds = [];
    state.quiz.timerSeconds = 1800;
    state.quiz.timerRunning = false;
    renderQuiz();
  };
});
