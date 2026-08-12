// Application Engine for Title I Paraprofessional Study Guide
document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentTab: 'dashboard',
    theme: localStorage.getItem('theme') || 'light',
    flashcards: {
      currentIndex: 0,
      filterCategory: 'All',
      masteredIds: JSON.parse(localStorage.getItem('masteredFlashcards') || '[]')
    },
    quiz: {
      mode: 'practice', // 'practice' or 'exam'
      currentIndex: 0,
      userAnswers: {},
      bookmarkedIds: [],
      completed: false,
      score: 0,
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
  setupEventListeners();

  // Theme Handling
  function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeToggleText();
  }

  function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', state.theme);
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeToggleText();
  }

  function updateThemeToggleText() {
    if (!themeToggleBtn) return;
    themeToggleBtn.innerHTML = state.theme === 'light'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> Dark Mode`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg> Light Mode`;
  }

  // Navigation Logic
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

    if (window.innerWidth <= 900) {
      sidebar.classList.remove('open');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Event Listeners Setup
  function setupEventListeners() {
    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    
    if (mobileMenuToggle) {
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
  }

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
      if (state.currentTab === 'search') switchTab('dashboard');
      return;
    }

    switchTab('search');
    const q = query.toLowerCase().trim();
    let results = [];

    // Search study data
    ['reading', 'writing', 'math'].forEach(modKey => {
      const mod = STUDY_DATA[modKey];
      if (mod.part1 && mod.part1.topics) {
        mod.part1.topics.forEach(t => {
          if (t.title.toLowerCase().includes(q) || (t.content && t.content.toLowerCase().includes(q))) {
            results.push({ module: mod.title, section: t.title, text: t.content || t.title, tab: modKey });
          }
        });
      }
      if (mod.part2 && mod.part2.topics) {
        mod.part2.topics.forEach(t => {
          if (t.title.toLowerCase().includes(q) || (t.content && t.content.toLowerCase().includes(q))) {
            results.push({ module: mod.title, section: t.title, text: t.content || t.title, tab: modKey });
          }
        });
      }
    });

    // Search Flashcards
    STUDY_DATA.flashcards.forEach(fc => {
      if (fc.question.toLowerCase().includes(q) || fc.answer.toLowerCase().includes(q)) {
        results.push({ module: `Flashcard (${fc.category})`, section: fc.question, text: fc.answer, tab: 'flashcards' });
      }
    });

    // Search Assessment
    STUDY_DATA.assessment.questions.forEach(quest => {
      if (quest.question.toLowerCase().includes(q) || quest.explanation.toLowerCase().includes(q)) {
        results.push({ module: `Assessment Question ${quest.id}`, section: quest.question, text: quest.explanation, tab: 'quiz' });
      }
    });

    // Render results
    if (results.length === 0) {
      searchResultsContainer.innerHTML = `<div class="card"><p class="scenario-why">No matches found for "${query}". Try searching for terms like "PEMDAS", "fluency", "echo reading", "inventive spelling", or "subject-verb".</p></div>`;
    } else {
      searchResultsContainer.innerHTML = results.map(res => `
        <div class="card" style="margin-bottom:1rem; cursor:pointer;" onclick="window.appSwitchTab('${res.tab}')">
          <span class="flashcard-category">${res.module}</span>
          <h4 style="margin: 0.5rem 0; color:var(--brand-primary);">${res.section}</h4>
          <p style="font-size:0.9rem; color:var(--text-secondary);">${highlightMatch(res.text, q)}</p>
        </div>
      `).join('');
    }
  }

  function highlightMatch(text, query) {
    if (!text) return '';
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="search-match">$1</mark>');
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
            <div class="callout" style="margin-bottom:0.75rem;">
              <div class="callout-title" style="color:var(--brand-primary);">${c.num}. ${c.title}</div>
              <p style="font-size:0.9rem; color:var(--text-secondary);">${c.desc}</p>
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
          ${data.testTips.map(t => `
            <div style="margin-bottom:1rem; border-bottom:1px solid var(--border-color); padding-bottom:0.75rem;">
              <h4 style="font-size:0.95rem; color:var(--text-primary); margin-bottom:0.25rem;">✨ ${t.title}</h4>
              <p style="font-size:0.875rem; color:var(--text-secondary);">${t.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <h2 style="margin: 2rem 0 1rem; font-size:1.4rem; font-weight:800;">Study Modules Overview</h2>
      <div class="grid-3">
        ${data.modulesSummary.map(m => `
          <div class="card" style="cursor:pointer;" onclick="window.appSwitchTab('${m.id}')">
            <div class="card-header">
              <h3 class="card-title">${m.title}</h3>
              <div class="card-icon-badge ${m.color}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
            <h5 style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase; margin-bottom:0.5rem;">Personal Proficiency</h5>
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

  // Render Reading Module
  function renderReadingModule() {
    const container = document.getElementById('view-reading');
    if (!container) return;
    const data = STUDY_DATA.reading;

    container.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
        <div>
          <h2 style="font-size:1.8rem; font-weight:800; color:var(--reading-color);">${data.title}</h2>
          <p style="color:var(--text-secondary);">${data.subtitle}</p>
        </div>
        <button class="btn btn-primary" onclick="window.appSwitchTab('quiz')">Take Reading Quiz</button>
      </div>

      <div class="callout" style="border-left-color:var(--reading-color); background-color:var(--reading-bg); color:var(--text-primary); margin-bottom:2rem;">
        <p style="font-size:0.95rem;">${data.intro}</p>
      </div>

      <!-- Part 1: Foundational Reading -->
      <h3 style="font-size:1.3rem; font-weight:700; margin-bottom:1rem;">${data.part1.title}</h3>
      ${data.part1.topics.map(t => `
        <div class="card" style="margin-bottom:1.5rem;">
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
        <div class="card" style="margin-bottom:1.5rem;">
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
            <div style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.75rem;">
              ${t.components.map(cmp => `
                <div style="background:var(--bg-tertiary); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.9rem;">
                  <strong style="color:var(--reading-color);">${cmp.name}:</strong> ${cmp.desc}
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${t.interventions ? `
            <div class="grid-2" style="margin-top:0.75rem;">
              ${t.interventions.map(inv => `
                <div style="background:var(--bg-tertiary); padding:0.75rem; border-radius:var(--radius-sm);">
                  <strong style="color:var(--reading-color);">${inv.name}:</strong>
                  <p style="font-size:0.875rem; color:var(--text-secondary);">${inv.desc}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${t.stages ? `
            <div style="display:flex; flex-direction:column; gap:0.75rem; margin-top:0.75rem;">
              ${t.stages.map(stg => `
                <div style="background:var(--bg-tertiary); padding:0.75rem 1rem; border-radius:var(--radius-md); font-size:0.9rem;">
                  <strong style="color:var(--brand-primary); display:block; margin-bottom:0.25rem;">${stg.stage}</strong>
                  <p style="color:var(--text-secondary);">${stg.desc}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${t.tools ? `
            <div class="grid-2" style="margin-top:0.75rem;">
              ${t.tools.map(tl => `
                <div style="background:var(--bg-tertiary); padding:0.75rem 1rem; border-radius:var(--radius-md); font-size:0.9rem;">
                  <strong style="color:var(--reading-color); display:block; margin-bottom:0.25rem;">${tl.name}</strong>
                  <p style="color:var(--text-secondary);">${tl.desc}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}

      <h4 style="font-size:1.15rem; font-weight:700; margin:1.5rem 0 1rem;">Practice Reading Scenarios</h4>
      ${data.part2.scenarios.map(sc => `
        <div class="scenario-box">
          <div class="scenario-q">${sc.q}</div>
          <div class="scenario-correct">${sc.correct}</div>
          <div class="scenario-why">${sc.why}</div>
        </div>
      `).join('')}

      <div class="callout" style="border-left-color:var(--writing-color); background:var(--writing-bg); color:var(--writing-color); font-weight:700;">
        📌 ${data.part2.keyTakeaway}
      </div>
    `;
  }

  // Render Writing Module
  function renderWritingModule() {
    const container = document.getElementById('view-writing');
    if (!container) return;
    const data = STUDY_DATA.writing;

    container.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
        <div>
          <h2 style="font-size:1.8rem; font-weight:800; color:var(--writing-color);">${data.title}</h2>
          <p style="color:var(--text-secondary);">${data.subtitle}</p>
        </div>
        <button class="btn btn-primary" onclick="window.appSwitchTab('quiz')">Take Writing Quiz</button>
      </div>

      <!-- Part 1: Foundational Writing -->
      <h3 style="font-size:1.3rem; font-weight:700; margin-bottom:1rem;">${data.part1.title}</h3>
      ${data.part1.topics.map(t => `
        <div class="card" style="margin-bottom:1.5rem;">
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
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              ${t.pitfalls.map(pf => `
                <div style="background:var(--bg-tertiary); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.875rem;">
                  <strong style="color:var(--brand-primary);">${pf.rule}:</strong>
                  <div style="color:#ef4444; margin-top:0.25rem;">❌ ${pf.wrong}</div>
                  <div style="color:var(--writing-color); font-weight:600;">✅ ${pf.right}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${t.rules ? `
            <div style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.5rem;">
              ${t.rules.map(rl => `
                <div style="background:var(--bg-tertiary); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.875rem;">
                  <strong style="color:var(--writing-color); display:block; margin-bottom:0.25rem;">${rl.title}</strong>
                  <p style="color:var(--text-secondary);">${rl.desc}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${t.details ? `
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              ${t.details.map(dt => `
                <div style="background:var(--bg-tertiary); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.875rem;">
                  <strong>${dt.type}:</strong> ${dt.ex || ''}
                  ${dt.fix ? `<div style="color:var(--writing-color); font-weight:600;">Fix: ${dt.fix}</div>` : ''}
                  ${dt.fix1 ? `
                    <div style="margin-top:0.25rem; color:var(--text-primary);">
                      <div>${dt.fix1}</div><div>${dt.fix2}</div><div>${dt.fix3}</div>
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${t.words ? `
            <div class="grid-3" style="margin-top:0.75rem;">
              ${t.words.map(w => `
                <div style="background:var(--bg-tertiary); padding:0.75rem; border-radius:var(--radius-md);">
                  <strong style="color:var(--writing-color); font-size:1rem; display:block; margin-bottom:0.25rem;">${w.pair}</strong>
                  <p style="font-size:0.85rem; color:var(--text-secondary);">${w.desc}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}

      <!-- Part 2: K-3 Writing Scenarios -->
      <h3 style="font-size:1.3rem; font-weight:700; margin:2rem 0 1rem;">${data.part2.title}</h3>
      ${data.part2.topics.map(t => `
        <div class="card" style="margin-bottom:1.5rem;">
          <h4 class="card-title" style="margin-bottom:0.75rem;">${t.title}</h4>
          <p style="color:var(--text-secondary); margin-bottom:0.75rem;">${t.content || ''}</p>
          ${t.activities ? `<ul style="margin-left:1.25rem; font-size:0.9rem; color:var(--text-secondary);">${t.activities.map(a => `<li style="margin-bottom:0.25rem;">${a}</li>`).join('')}</ul>` : ''}
          ${t.steps ? `
            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              ${t.steps.map(st => `
                <div style="background:var(--bg-tertiary); padding:0.85rem; border-radius:var(--radius-md);">
                  <h5 style="color:var(--writing-color); font-size:0.95rem; margin-bottom:0.25rem;">${st.name}</h5>
                  <p style="font-size:0.875rem; color:var(--text-secondary);">${st.desc}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${t.populations ? `
            <div class="grid-2" style="margin-top:0.75rem;">
              ${t.populations.map(pop => `
                <div style="background:var(--bg-tertiary); padding:0.85rem; border-radius:var(--radius-md);">
                  <strong style="color:var(--brand-primary); font-size:0.95rem;">${pop.group}</strong>
                  <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.25rem;">${pop.strategy}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}

      <h4 style="font-size:1.15rem; font-weight:700; margin:1.5rem 0 1rem;">Practice Writing Scenarios</h4>
      ${data.part2.scenarios.map(sc => `
        <div class="scenario-box">
          <div class="scenario-q">${sc.q}</div>
          <div class="scenario-correct">${sc.correct}</div>
          <div class="scenario-why">${sc.why}</div>
        </div>
      `).join('')}
    `;
  }

  // Render Math Module & Visual Manipulatives
  function renderMathModule() {
    const container = document.getElementById('view-math');
    if (!container) return;
    const data = STUDY_DATA.math;

    container.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
        <div>
          <h2 style="font-size:1.8rem; font-weight:800; color:var(--math-color);">${data.title}</h2>
          <p style="color:var(--text-secondary);">${data.subtitle}</p>
        </div>
        <button class="btn btn-primary" onclick="window.appSwitchTab('quiz')">Take Math Quiz</button>
      </div>

      <!-- Interactive Ten-Frame Visualizer -->
      <div class="manipulative-container">
        <div class="manipulative-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="12" x2="21" y2="12"></line><line x1="12" y1="3" x2="12" y2="21"></line></svg>
          Interactive Ten-Frame Simulator (Bridge to 10)
        </div>
        <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:1rem;">Visualize how K-1 students solve addition like <strong>8 + 5</strong> by filling frame 1 to 10 first, with 3 spilling into frame 2 (10 + 3 = 13).</p>
        
        <div style="display:flex; align-items:center; justify-content:center; gap:1rem; flex-wrap:wrap; margin-bottom:1.5rem;">
          <label>First Number (0-10): <input type="number" id="ten-num1" value="8" min="0" max="10" style="width:60px; padding:0.4rem; border-radius:6px; border:1px solid var(--border-color);"></label>
          <label>Second Number (0-10): <input type="number" id="ten-num2" value="5" min="0" max="10" style="width:60px; padding:0.4rem; border-radius:6px; border:1px solid var(--border-color);"></label>
          <button class="btn btn-primary" id="btn-update-tenframe">Update Frames</button>
        </div>

        <div style="display:flex; justify-content:center; gap:2rem; flex-wrap:wrap;">
          <div>
            <h5 style="text-align:center; font-size:0.85rem; color:var(--text-muted); margin-bottom:0.5rem;">Frame 1 (Ten-Frame)</h5>
            <div class="ten-frame-grid" id="frame-1"></div>
          </div>
          <div>
            <h5 style="text-align:center; font-size:0.85rem; color:var(--text-muted); margin-bottom:0.5rem;">Frame 2 (Spillover)</h5>
            <div class="ten-frame-grid" id="frame-2"></div>
          </div>
        </div>
        <div id="tenframe-result" style="text-align:center; margin-top:1rem; font-weight:700; color:var(--math-color); font-size:1.1rem;"></div>
      </div>

      <!-- Part 1: Foundational Math -->
      <h3 style="font-size:1.3rem; font-weight:700; margin-bottom:1rem;">${data.part1.title}</h3>
      ${data.part1.topics.map(t => `
        <div class="card" style="margin-bottom:1.5rem;">
          <h4 class="card-title" style="margin-bottom:0.75rem;">${t.title}</h4>
          <p style="color:var(--text-secondary); margin-bottom:0.75rem;">${t.content || ''}</p>
          ${t.steps ? `<ol style="margin-left:1.25rem; font-size:0.9rem; color:var(--text-secondary);">${t.steps.map(s => `<li>${s}</li>`).join('')}</ol>` : ''}
          ${t.example ? `
            <div style="background:var(--bg-tertiary); padding:0.85rem; border-radius:var(--radius-md); margin-top:0.75rem; font-size:0.9rem;">
              <strong>Example:</strong>
              ${typeof t.example === 'object' ? `
                <div style="margin-top:0.25rem; font-family:'Fira Code', monospace; color:var(--math-color); font-weight:600;">${t.example.expr}</div>
                <div>${t.example.step1}</div>
                <div>${t.example.step2}</div>
                <div>${t.example.step3}</div>
              ` : `<span>${t.example}</span>`}
            </div>
          ` : ''}
          ${t.details ? `
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              ${t.details.map(d => `<div style="background:var(--bg-tertiary); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.875rem;">${d}</div>`).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}

      <!-- Part 2: K-3 Math Scenarios -->
      <h3 style="font-size:1.3rem; font-weight:700; margin:2rem 0 1rem;">${data.part2.title}</h3>
      ${data.part2.topics.map(t => `
        <div class="card" style="margin-bottom:1.5rem;">
          <h4 class="card-title" style="margin-bottom:0.75rem;">${t.title}</h4>
          <p style="color:var(--text-secondary); margin-bottom:0.75rem;">${t.content || ''}</p>
          ${t.tools ? `
            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              ${t.tools.map(tl => `
                <div style="background:var(--bg-tertiary); padding:0.85rem; border-radius:var(--radius-md);">
                  <strong style="color:var(--math-color); font-size:0.95rem; display:block;">${tl.name}</strong>
                  <p style="font-size:0.875rem; color:var(--text-secondary);">${tl.desc}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${t.errors ? `
            <div class="grid-2" style="margin-top:0.75rem;">
              ${t.errors.map(err => `
                <div style="background:var(--bg-tertiary); padding:0.85rem; border-radius:var(--radius-md);">
                  <strong style="color:#ef4444; font-size:0.95rem;">${err.name}</strong>
                  <div style="font-family:'Fira Code', monospace; margin:0.25rem 0; font-weight:700;">Problem: ${err.problem}</div>
                  <p style="font-size:0.85rem; color:var(--text-secondary);">${err.diagnosis}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${t.scaffolding ? `
            <ol style="margin-left:1.25rem; font-size:0.9rem; color:var(--text-secondary); margin-top:0.5rem;">
              ${t.scaffolding.map(scaf => `<li style="margin-bottom:0.25rem;">${scaf}</li>`).join('')}
            </ol>
          ` : ''}
          ${t.strategy ? `
            <div class="callout" style="border-left-color:var(--math-color); background:var(--math-bg); margin-top:0.75rem;">
              <div class="callout-title">💡 Strategy</div>
              <p style="font-size:0.9rem;">${t.strategy}</p>
            </div>
          ` : ''}
          ${t.solution ? `
            <div class="callout" style="border-left-color:var(--writing-color); background:var(--writing-bg); margin-top:0.75rem;">
              <div class="callout-title">✅ Pedagogical Solution</div>
              <p style="font-size:0.9rem;">${t.solution}</p>
            </div>
          ` : ''}
        </div>
      `).join('')}

      <h4 style="font-size:1.15rem; font-weight:700; margin:1.5rem 0 1rem;">Practice Math Scenarios</h4>
      ${data.part2.scenarios.map(sc => `
        <div class="scenario-box">
          <div class="scenario-q">${sc.q}</div>
          <div class="scenario-correct">${sc.correct}</div>
          <div class="scenario-why">${sc.why}</div>
        </div>
      `).join('')}
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

  // Render Flashcards Engine
  function renderFlashcards() {
    const container = document.getElementById('view-flashcards');
    if (!container) return;

    const cards = state.flashcards.filterCategory === 'All'
      ? STUDY_DATA.flashcards
      : STUDY_DATA.flashcards.filter(c => c.category === state.flashcards.filterCategory);

    const currentCard = cards[state.flashcards.currentIndex] || cards[0];
    const isMastered = state.flashcards.masteredIds.includes(currentCard.id);

    container.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h2 style="font-size:1.8rem; font-weight:800;">Interactive Flashcards</h2>
          <p style="color:var(--text-secondary);">Master key concepts, rules, and pedagogical terms.</p>
        </div>

        <div style="display:flex; gap:0.5rem;">
          ${['All', 'Reading', 'Writing', 'Math'].map(cat => `
            <button class="btn ${state.flashcards.filterCategory === cat ? 'btn-primary' : 'btn-outline'}" onclick="window.appFilterFlashcards('${cat}')">${cat}</button>
          `).join('')}
        </div>
      </div>

      <div class="flashcard-wrapper">
        <div class="flashcard" id="flashcard-element" onclick="this.classList.toggle('flipped')">
          <div class="flashcard-front">
            <span class="flashcard-category">${currentCard.category} • ${currentCard.tag}</span>
            <div class="flashcard-q">${currentCard.question}</div>
            <span style="font-size:0.8rem; color:var(--text-muted); margin-top:1rem;">Click to flip 🔄</span>
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
      </div>
    `;
  }

  window.appFilterFlashcards = (cat) => {
    state.flashcards.filterCategory = cat;
    state.flashcards.currentIndex = 0;
    renderFlashcards();
  };

  window.appPrevFlashcard = () => {
    const cards = state.flashcards.filterCategory === 'All'
      ? STUDY_DATA.flashcards
      : STUDY_DATA.flashcards.filter(c => c.category === state.flashcards.filterCategory);
    state.flashcards.currentIndex = (state.flashcards.currentIndex - 1 + cards.length) % cards.length;
    renderFlashcards();
  };

  window.appNextFlashcard = () => {
    const cards = state.flashcards.filterCategory === 'All'
      ? STUDY_DATA.flashcards
      : STUDY_DATA.flashcards.filter(c => c.category === state.flashcards.filterCategory);
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

  // Render Practice Assessment Quiz
  function renderQuiz() {
    const container = document.getElementById('view-quiz');
    if (!container) return;

    const questions = STUDY_DATA.assessment.questions;
    const currentQ = questions[state.quiz.currentIndex];
    const selectedOption = state.quiz.userAnswers[currentQ.id];

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

          <div style="display:flex; gap:0.5rem;">
            <button class="btn ${state.quiz.mode === 'practice' ? 'btn-primary' : 'btn-outline'}" onclick="window.appSetQuizMode('practice')">Practice Mode</button>
            <button class="btn ${state.quiz.mode === 'exam' ? 'btn-primary' : 'btn-outline'}" onclick="window.appSetQuizMode('exam')">Exam Mode</button>
          </div>
        </div>

        <div class="quiz-mode-banner">
          <div style="font-weight:700; font-size:0.95rem; color:var(--brand-primary); margin-bottom:0.25rem; display:flex; align-items:center; gap:0.4rem;">
            💡 ${state.quiz.mode === 'practice' ? 'Practice Mode' : 'Exam Mode'}
          </div>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">
            ${state.quiz.mode === 'practice'
              ? '<strong>Practice Mode:</strong> Answers are checked immediately with step-by-step rationale and explanations so you learn as you go.'
              : '<strong>Exam Mode:</strong> Answers are saved silently without feedback to simulate official timed exam conditions. A detailed score report is shown upon submission.'}
          </p>
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
    renderQuiz();
  };

  window.appSelectOption = (qId, optionIndex) => {
    state.quiz.userAnswers[qId] = optionIndex;
    renderQuiz();
  };

  window.appPrevQuestion = () => {
    if (state.quiz.currentIndex > 0) {
      state.quiz.currentIndex--;
      renderQuiz();
    }
  };

  window.appNextQuestion = () => {
    if (state.quiz.currentIndex < STUDY_DATA.assessment.questions.length - 1) {
      state.quiz.currentIndex++;
      renderQuiz();
    }
  };

  window.appSubmitQuiz = () => {
    state.quiz.completed = true;
    let score = 0;
    const questions = STUDY_DATA.assessment.questions;
    questions.forEach(q => {
      if (state.quiz.userAnswers[q.id] === q.answer) score++;
    });

    state.quiz.score = score;
    const percentage = Math.round((score / questions.length) * 100);

    // Save to history
    state.quiz.history.push({
      date: new Date().toLocaleDateString(),
      score: score,
      total: questions.length,
      percentage: percentage
    });

    localStorage.setItem('quizHistory', JSON.stringify(state.quiz.history));
    renderQuiz();
    updateProgressWidget();
  };

  function renderQuizResults(container) {
    const questions = STUDY_DATA.assessment.questions;
    const score = state.quiz.score;
    const percentage = Math.round((score / questions.length) * 100);

    let readingScore = 0, writingScore = 0, mathScore = 0;
    questions.forEach(q => {
      const isCorrect = state.quiz.userAnswers[q.id] === q.answer;
      if (isCorrect) {
        if (q.section === 'Reading') readingScore++;
        if (q.section === 'Writing') writingScore++;
        if (q.section === 'Math') mathScore++;
      }
    });

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
            return `
              <div class="card" style="border-left: 4px solid ${isCorrect ? 'var(--writing-color)' : '#ef4444'};">
                <div style="font-weight:700; font-size:0.95rem; margin-bottom:0.5rem;">Q${q.id}. ${q.question}</div>
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
    state.quiz.completed = false;
    state.quiz.currentIndex = 0;
    state.quiz.userAnswers = {};
    renderQuiz();
  };
});
