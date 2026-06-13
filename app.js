// ===== DB Mastery – Main Application =====

(function() {
    'use strict';

    // ---- State ----
    const state = {
        currentView: 'dashboard',
        currentModule: null,
        currentSection: 0,
        modules: [],
        kahootQuestions: [],
        progress: {},
        quizHistory: [],
        activeQuiz: null,
        theme: 'dark'
    };

    // ---- Constants ----
    const MODULE_COLORS = [
        { gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)', soft: 'rgba(59,130,246,0.15)', text: '#3b82f6' },
        { gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', soft: 'rgba(139,92,246,0.15)', text: '#8b5cf6' },
        { gradient: 'linear-gradient(135deg, #ec4899, #f472b6)', soft: 'rgba(236,72,153,0.15)', text: '#ec4899' },
        { gradient: 'linear-gradient(135deg, #10b981, #34d399)', soft: 'rgba(16,185,129,0.15)', text: '#10b981' },
        { gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', soft: 'rgba(245,158,11,0.15)', text: '#f59e0b' },
        { gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)', soft: 'rgba(6,182,212,0.15)', text: '#06b6d4' },
        { gradient: 'linear-gradient(135deg, #ef4444, #f87171)', soft: 'rgba(239,68,68,0.15)', text: '#ef4444' },
        { gradient: 'linear-gradient(135deg, #84cc16, #a3e635)', soft: 'rgba(132,204,22,0.15)', text: '#84cc16' },
        { gradient: 'linear-gradient(135deg, #e879f9, #f0abfc)', soft: 'rgba(232,121,249,0.15)', text: '#e879f9' },
        { gradient: 'linear-gradient(135deg, #fb923c, #fdba74)', soft: 'rgba(251,146,60,0.15)', text: '#fb923c' },
    ];

    const STORAGE_KEY = 'db-mastery-state';

    // ---- DOM Cache ----
    const dom = {};

    function cacheDom() {
        dom.mainContent = document.getElementById('mainContent');
        dom.navLinks = document.querySelectorAll('.nav-link');
        dom.themeToggle = document.getElementById('themeToggle');

        // Views
        dom.dashboardView = document.getElementById('dashboardView');
        dom.learnView = document.getElementById('learnView');
        dom.quizView = document.getElementById('quizView');
        dom.progressView = document.getElementById('progressView');

        // Dashboard
        dom.moduleGrid = document.getElementById('moduleGrid');
        dom.statModules = document.getElementById('statModules');
        dom.statCompleted = document.getElementById('statCompleted');
        dom.statQuizScore = document.getElementById('statQuizScore');
        dom.statStreak = document.getElementById('statStreak');

        // Learn
        dom.learnSidebar = document.getElementById('learnSidebar');
        dom.sidebarModuleTitle = document.getElementById('sidebarModuleTitle');
        dom.sidebarSections = document.getElementById('sidebarSections');
        dom.learnContent = document.getElementById('learnContent');
        dom.backToDashboard = document.getElementById('backToDashboard');
        dom.startModuleQuiz = document.getElementById('startModuleQuiz');

        // Quiz
        dom.quizSelection = document.getElementById('quizSelection');
        dom.quizModuleSelect = document.getElementById('quizModuleSelect');
        dom.quizModuleGrid = document.getElementById('quizModuleGrid');
        dom.quizActive = document.getElementById('quizActive');
        dom.quizResults = document.getElementById('quizResults');
        dom.quizProgressFill = document.getElementById('quizProgressFill');
        dom.quizCounter = document.getElementById('quizCounter');
        dom.quizTimerValue = document.getElementById('quizTimerValue');
        dom.quizQuestionType = document.getElementById('quizQuestionType');
        dom.quizQuestionText = document.getElementById('quizQuestionText');
        dom.quizOptions = document.getElementById('quizOptions');
        dom.quizExplanation = document.getElementById('quizExplanation');
        dom.quizExplanationText = document.getElementById('quizExplanationText');
        dom.quizSubmit = document.getElementById('quizSubmit');
        dom.quizNext = document.getElementById('quizNext');
        dom.quizExit = document.getElementById('quizExit');

        // Results
        dom.resultCircle = document.getElementById('resultCircle');
        dom.resultScoreValue = document.getElementById('resultScoreValue');
        dom.resultTitle = document.getElementById('resultTitle');
        dom.resultSubtitle = document.getElementById('resultSubtitle');
        dom.resultCorrect = document.getElementById('resultCorrect');
        dom.resultWrong = document.getElementById('resultWrong');
        dom.resultTotal = document.getElementById('resultTotal');
        dom.resultRetry = document.getElementById('resultRetry');
        dom.resultReview = document.getElementById('resultReview');
        dom.resultBack = document.getElementById('resultBack');
        dom.reviewSection = document.getElementById('reviewSection');
        dom.reviewList = document.getElementById('reviewList');

        // Progress
        dom.overallProgressCircle = document.getElementById('overallProgressCircle');
        dom.overallProgressValue = document.getElementById('overallProgressValue');
        dom.readinessFill = document.getElementById('readinessFill');
        dom.readinessTip = document.getElementById('readinessTip');
        dom.progressModuleList = document.getElementById('progressModuleList');

        // Toast
        dom.toastContainer = document.getElementById('toastContainer');

        // Quiz mode buttons
        dom.quizModeModule = document.getElementById('quizModeModule');
        dom.quizModeExam = document.getElementById('quizModeExam');
        dom.quizModeWeak = document.getElementById('quizModeWeak');
        dom.quizModeKahoot = document.getElementById('quizModeKahoot');
    }

    // ---- Persistence ----
    function saveState() {
        const saveData = {
            progress: state.progress,
            quizHistory: state.quizHistory,
            theme: state.theme
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
        } catch(e) { /* ignore */ }
    }

    function loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                state.progress = data.progress || {};
                state.quizHistory = data.quizHistory || [];
                state.theme = data.theme || 'dark';
            }
        } catch(e) { /* ignore */ }
    }

    // ---- Theme ----
    function applyTheme() {
        document.documentElement.setAttribute('data-theme', state.theme);
    }

    function toggleTheme() {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme();
        saveState();
    }

    // ---- Navigation ----
    function switchView(viewName) {
        state.currentView = viewName;
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(viewName + 'View').classList.add('active');
        dom.navLinks.forEach(l => {
            l.classList.toggle('active', l.dataset.view === viewName);
        });
        if (viewName === 'progress') updateProgressView();
        if (viewName === 'dashboard') updateDashboard();
        if (viewName === 'quiz') resetQuizView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ---- Data Loading ----
    async function loadAllContent() {
        const files = [
            'content_modules_0_2.json',
            'content_modules_3_4.json',
            'content_modules_5_6.json',
            'content_modules_7_8.json',
            'content_modules_9_10.json'
        ];

        let allModules = [];

        for (const file of files) {
            try {
                const response = await fetch(file);
                if (response.ok) {
                    const data = await response.json();
                    if (data.modules) {
                        allModules = allModules.concat(data.modules);
                    }
                }
            } catch (e) {
                console.warn(`Could not load ${file}:`, e);
            }
        }

        // Load Kahoot questions
        try {
            const kahootResp = await fetch('kahoot_questions.json');
            if (kahootResp.ok) {
                const kahootData = await kahootResp.json();
                state.kahootQuestions = kahootData.modules || [];
            }
        } catch (e) {
            console.warn('Could not load kahoot_questions.json:', e);
        }

        // Sort and deduplicate modules
        const seen = new Set();
        state.modules = allModules.filter(m => {
            if (seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
        }).sort((a, b) => {
            const numA = parseInt(a.id.replace('module-', ''));
            const numB = parseInt(b.id.replace('module-', ''));
            return numA - numB;
        });

        // Initialize progress for new modules
        state.modules.forEach(m => {
            if (!state.progress[m.id]) {
                state.progress[m.id] = {
                    sectionsCompleted: [],
                    quizScores: [],
                    lastAccessed: null
                };
            }
        });

        renderDashboard();
    }

    // ---- Dashboard ----
    function renderDashboard() {
        renderModuleGrid();
        updateDashboard();
    }

    function updateDashboard() {
        dom.statModules.textContent = state.modules.length;

        // Calculate completion
        let totalSections = 0;
        let completedSections = 0;
        state.modules.forEach(m => {
            const sCount = m.sections ? m.sections.length : 0;
            totalSections += sCount;
            const prog = state.progress[m.id];
            if (prog) completedSections += (prog.sectionsCompleted || []).length;
        });
        const completionPct = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
        dom.statCompleted.textContent = completionPct + '%';

        // Average quiz score
        let allScores = [];
        Object.values(state.progress).forEach(p => {
            if (p.quizScores && p.quizScores.length > 0) {
                allScores = allScores.concat(p.quizScores);
            }
        });
        const avgScore = allScores.length > 0 ? Math.round(allScores.reduce((a,b) => a+b, 0) / allScores.length) : null;
        dom.statQuizScore.textContent = avgScore !== null ? avgScore + '%' : '–';

        // Streak calculation
        const streak = calculateStreak();
        dom.statStreak.textContent = streak;

        // Update module cards status
        state.modules.forEach((m, idx) => {
            const card = document.querySelector(`[data-module-id="${m.id}"]`);
            if (!card) return;
            const prog = state.progress[m.id];
            const sCount = m.sections ? m.sections.length : 0;
            const completed = (prog.sectionsCompleted || []).length;
            const pct = sCount > 0 ? Math.round((completed / sCount) * 100) : 0;

            const statusEl = card.querySelector('.module-status');
            const progressFill = card.querySelector('.module-progress-fill');

            if (pct === 100) {
                statusEl.className = 'module-status completed';
                statusEl.textContent = '✓ Fertig';
            } else if (pct > 0) {
                statusEl.className = 'module-status in-progress';
                statusEl.textContent = pct + '%';
            } else {
                statusEl.className = 'module-status not-started';
                statusEl.textContent = 'Neu';
            }
            if (progressFill) progressFill.style.width = pct + '%';
        });
    }

    function calculateStreak() {
        const today = new Date().toISOString().split('T')[0];
        let streak = 0;
        const dates = new Set();
        state.quizHistory.forEach(q => {
            if (q.date) dates.add(q.date);
        });
        Object.values(state.progress).forEach(p => {
            if (p.lastAccessed) dates.add(p.lastAccessed);
        });
        const sortedDates = [...dates].sort().reverse();
        if (sortedDates.length === 0) return 0;
        if (sortedDates[0] !== today && sortedDates[0] !== getPreviousDay(today)) return 0;
        let checkDate = sortedDates[0] === today ? today : getPreviousDay(today);
        for (const d of sortedDates) {
            if (d === checkDate) {
                streak++;
                checkDate = getPreviousDay(checkDate);
            } else if (d < checkDate) {
                break;
            }
        }
        return streak;
    }

    function getPreviousDay(dateStr) {
        const d = new Date(dateStr);
        d.setDate(d.getDate() - 1);
        return d.toISOString().split('T')[0];
    }

    function renderModuleGrid() {
        dom.moduleGrid.innerHTML = '';
        state.modules.forEach((m, idx) => {
            const color = MODULE_COLORS[idx % MODULE_COLORS.length];
            const prog = state.progress[m.id] || { sectionsCompleted: [], quizScores: [] };
            const sCount = m.sections ? m.sections.length : 0;
            const completed = (prog.sectionsCompleted || []).length;
            const pct = sCount > 0 ? Math.round((completed / sCount) * 100) : 0;
            const qCount = m.quiz ? m.quiz.length : 0;
            const moduleNum = m.id.replace('module-', '');

            let statusClass = 'not-started';
            let statusText = 'Neu';
            if (pct === 100) { statusClass = 'completed'; statusText = '✓ Fertig'; }
            else if (pct > 0) { statusClass = 'in-progress'; statusText = pct + '%'; }

            const card = document.createElement('div');
            card.className = 'module-card';
            card.dataset.moduleId = m.id;
            card.style.setProperty('--module-color', color.gradient);
            card.style.setProperty('--module-color-soft', color.soft);
            card.style.setProperty('--module-color-text', color.text);
            card.innerHTML = `
                <div class="module-card-header">
                    <div class="module-number" style="background: ${color.soft}; color: ${color.text};">${moduleNum}</div>
                    <span class="module-status ${statusClass}">${statusText}</span>
                </div>
                <h3 class="module-card-title">${escapeHtml(m.title)}</h3>
                <p class="module-card-desc">${escapeHtml(m.description || '')}</p>
                <div class="module-card-meta">
                    <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                        ${sCount} Abschnitte
                    </span>
                    <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        ${qCount} Fragen
                    </span>
                </div>
                <div class="module-progress-bar">
                    <div class="module-progress-fill" style="width: ${pct}%; background: ${color.gradient};"></div>
                </div>
            `;
            card.addEventListener('click', () => openModule(m.id));
            dom.moduleGrid.appendChild(card);
        });
    }

    // ---- Learn View ----
    function openModule(moduleId) {
        const module = state.modules.find(m => m.id === moduleId);
        if (!module) return;

        state.currentModule = moduleId;
        state.currentSection = 0;

        // Update last accessed
        if (state.progress[moduleId]) {
            state.progress[moduleId].lastAccessed = new Date().toISOString().split('T')[0];
            saveState();
        }

        renderLearnView(module);
        switchView('learn');
    }

    function renderLearnView(module) {
        const idx = state.modules.indexOf(module);
        const color = MODULE_COLORS[idx % MODULE_COLORS.length];

        dom.sidebarModuleTitle.textContent = module.title;

        // Render sidebar sections
        dom.sidebarSections.innerHTML = '';
        if (module.sections) {
            module.sections.forEach((section, i) => {
                const prog = state.progress[module.id];
                const isCompleted = prog && prog.sectionsCompleted && prog.sectionsCompleted.includes(i);
                const btn = document.createElement('button');
                btn.className = 'sidebar-section-item' + (i === 0 ? ' active' : '') + (isCompleted ? ' completed' : '');
                btn.innerHTML = `
                    <span class="sidebar-section-icon">${isCompleted ? '✓' : (i + 1)}</span>
                    <span>${escapeHtml(section.title)}</span>
                `;
                btn.addEventListener('click', () => showSection(module, i));
                dom.sidebarSections.appendChild(btn);
            });
        }

        // Add Key Terms section
        const allKeyTerms = [];
        if (module.sections) {
            module.sections.forEach(s => {
                if (s.keyTerms) allKeyTerms.push(...s.keyTerms);
            });
        }
        if (allKeyTerms.length > 0) {
            const btn = document.createElement('button');
            btn.className = 'sidebar-section-item';
            btn.innerHTML = `
                <span class="sidebar-section-icon">📖</span>
                <span>Alle Schlüsselbegriffe</span>
            `;
            btn.addEventListener('click', () => showAllKeyTerms(module, allKeyTerms));
            dom.sidebarSections.appendChild(btn);
        }

        // Show first section
        if (module.sections && module.sections.length > 0) {
            showSection(module, 0);
        }

        // Module quiz button
        dom.startModuleQuiz.onclick = () => startQuiz('module', module.id);
    }

    function showSection(module, sectionIndex) {
        state.currentSection = sectionIndex;
        const section = module.sections[sectionIndex];
        if (!section) return;

        // Update sidebar active state
        dom.sidebarSections.querySelectorAll('.sidebar-section-item').forEach((btn, i) => {
            btn.classList.toggle('active', i === sectionIndex);
        });

        const prog = state.progress[module.id];
        const isCompleted = prog && prog.sectionsCompleted && prog.sectionsCompleted.includes(sectionIndex);

        let html = `<div class="content-section">`;
        html += `<h2>${escapeHtml(section.title)}</h2>`;

        // Render markdown-like content
        html += renderContent(section.content);

        // Key Terms
        if (section.keyTerms && section.keyTerms.length > 0) {
            html += `<h3>📝 Schlüsselbegriffe</h3>`;
            html += `<div class="key-terms">`;
            section.keyTerms.forEach(kt => {
                html += `<div class="key-term">
                    <span class="key-term-name">${escapeHtml(kt.term)}</span>
                    <span class="key-term-def">${escapeHtml(kt.definition)}</span>
                </div>`;
            });
            html += `</div>`;
        }

        // Examples
        if (section.examples && section.examples.length > 0) {
            html += `<h3>💡 Beispiele</h3>`;
            section.examples.forEach(ex => {
                html += `<div class="key-term" style="border-left-color: var(--accent-green);">
                    <span class="key-term-def">${renderContent(ex)}</span>
                </div>`;
            });
        }

        // Mark as complete button
        html += `<button class="section-complete-btn ${isCompleted ? 'is-completed' : ''}" id="sectionCompleteBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            ${isCompleted ? 'Abschnitt abgeschlossen ✓' : 'Als gelernt markieren'}
        </button>`;

        // Section navigation
        html += `<div class="section-nav">`;
        if (sectionIndex > 0) {
            html += `<button class="section-nav-btn" id="prevSection">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
                Vorheriger
            </button>`;
        } else {
            html += `<div></div>`;
        }
        if (sectionIndex < module.sections.length - 1) {
            html += `<button class="section-nav-btn" id="nextSection">
                Nächster
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>`;
        } else {
            html += `<div></div>`;
        }
        html += `</div>`;

        html += `</div>`;
        dom.learnContent.innerHTML = html;

        // Event listeners
        const completeBtn = document.getElementById('sectionCompleteBtn');
        if (completeBtn) {
            completeBtn.addEventListener('click', () => toggleSectionComplete(module.id, sectionIndex));
        }
        const prevBtn = document.getElementById('prevSection');
        if (prevBtn) prevBtn.addEventListener('click', () => showSection(module, sectionIndex - 1));
        const nextBtn = document.getElementById('nextSection');
        if (nextBtn) nextBtn.addEventListener('click', () => showSection(module, sectionIndex + 1));

        // Scroll to top of content
        dom.learnContent.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showAllKeyTerms(module, keyTerms) {
        dom.sidebarSections.querySelectorAll('.sidebar-section-item').forEach(btn => btn.classList.remove('active'));
        const items = dom.sidebarSections.querySelectorAll('.sidebar-section-item');
        items[items.length - 1].classList.add('active');

        let html = `<div class="content-section">`;
        html += `<h2>📖 Alle Schlüsselbegriffe – ${escapeHtml(module.title)}</h2>`;
        html += `<p>Hier findest du alle wichtigen Begriffe aus diesem Modul auf einen Blick.</p>`;
        html += `<div class="key-terms">`;
        keyTerms.forEach(kt => {
            html += `<div class="key-term">
                <span class="key-term-name">${escapeHtml(kt.term)}</span>
                <span class="key-term-def">${escapeHtml(kt.definition)}</span>
            </div>`;
        });
        html += `</div></div>`;
        dom.learnContent.innerHTML = html;
        dom.learnContent.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function toggleSectionComplete(moduleId, sectionIndex) {
        const prog = state.progress[moduleId];
        if (!prog) return;
        if (!prog.sectionsCompleted) prog.sectionsCompleted = [];

        const idx = prog.sectionsCompleted.indexOf(sectionIndex);
        if (idx === -1) {
            prog.sectionsCompleted.push(sectionIndex);
            showToast('Abschnitt als gelernt markiert! 🎉', 'success');
        } else {
            prog.sectionsCompleted.splice(idx, 1);
        }
        saveState();

        // Update UI
        const btn = document.getElementById('sectionCompleteBtn');
        if (btn) {
            const isCompleted = prog.sectionsCompleted.includes(sectionIndex);
            btn.classList.toggle('is-completed', isCompleted);
            btn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                ${isCompleted ? 'Abschnitt abgeschlossen ✓' : 'Als gelernt markieren'}
            `;
        }

        // Update sidebar
        const sidebarItems = dom.sidebarSections.querySelectorAll('.sidebar-section-item');
        if (sidebarItems[sectionIndex]) {
            const isCompleted = prog.sectionsCompleted.includes(sectionIndex);
            sidebarItems[sectionIndex].classList.toggle('completed', isCompleted);
            const icon = sidebarItems[sectionIndex].querySelector('.sidebar-section-icon');
            if (icon) icon.textContent = isCompleted ? '✓' : (sectionIndex + 1);
        }
    }

    // ---- Quiz System ----
    function resetQuizView() {
        dom.quizSelection.classList.remove('hidden');
        dom.quizModuleSelect.classList.add('hidden');
        dom.quizActive.classList.add('hidden');
        dom.quizResults.classList.add('hidden');
        dom.reviewSection.classList.add('hidden');
    }

    function startQuiz(mode, moduleId) {
        let questions = [];

        if (mode === 'module') {
            const module = state.modules.find(m => m.id === moduleId);
            if (module && module.quiz) {
                questions = shuffleArray([...module.quiz]).map(q => ({ ...q, moduleId }));
            }
            // Also add matching kahoot questions
            const kahoot = state.kahootQuestions.find(k => k.moduleId === moduleId);
            if (kahoot && kahoot.questions) {
                questions = questions.concat(kahoot.questions.map(q => ({ ...q, moduleId, isKahoot: true })));
            }
            questions = shuffleArray(questions);
        } else if (mode === 'exam') {
            state.modules.forEach(m => {
                if (m.quiz) {
                    const subset = shuffleArray([...m.quiz]).slice(0, 5).map(q => ({ ...q, moduleId: m.id }));
                    questions = questions.concat(subset);
                }
            });
            questions = shuffleArray(questions);
        } else if (mode === 'weak') {
            // Get all wrong answers from history
            const wrongQs = new Set();
            state.quizHistory.forEach(h => {
                if (h.wrongQuestions) {
                    h.wrongQuestions.forEach(q => wrongQs.add(JSON.stringify(q)));
                }
            });
            questions = [...wrongQs].map(q => JSON.parse(q));
            questions = shuffleArray(questions);
            if (questions.length === 0) {
                showToast('Keine falsch beantworteten Fragen vorhanden. Mache zuerst ein Quiz!', 'info');
                return;
            }
        } else if (mode === 'kahoot') {
            state.kahootQuestions.forEach(k => {
                if (k.questions) {
                    questions = questions.concat(k.questions.map(q => ({ ...q, moduleId: k.moduleId, isKahoot: true })));
                }
            });
            questions = shuffleArray(questions);
            if (questions.length === 0) {
                showToast('Keine Kahoot-Fragen geladen.', 'info');
                return;
            }
        }

        if (questions.length === 0) {
            showToast('Keine Fragen für diesen Modus verfügbar.', 'info');
            return;
        }

        state.activeQuiz = {
            mode,
            moduleId,
            questions,
            currentIndex: 0,
            answers: [],
            startTime: Date.now(),
            selectedAnswer: null,
            answered: false
        };

        dom.quizSelection.classList.add('hidden');
        dom.quizActive.classList.remove('hidden');
        dom.quizResults.classList.add('hidden');

        renderQuizQuestion();
        if (mode === 'exam') startTimer();
    }

    let timerInterval = null;
    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (!state.activeQuiz) { clearInterval(timerInterval); return; }
            const elapsed = Math.floor((Date.now() - state.activeQuiz.startTime) / 1000);
            const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const secs = (elapsed % 60).toString().padStart(2, '0');
            dom.quizTimerValue.textContent = `${mins}:${secs}`;
        }, 1000);
    }

    function renderQuizQuestion() {
        const quiz = state.activeQuiz;
        if (!quiz) return;
        const q = quiz.questions[quiz.currentIndex];
        const total = quiz.questions.length;
        const current = quiz.currentIndex + 1;

        // Progress
        dom.quizProgressFill.style.width = `${(current / total) * 100}%`;
        dom.quizCounter.textContent = `Frage ${current} / ${total}`;

        // Type
        if (q.type === 'true-false') {
            dom.quizQuestionType.textContent = 'Richtig oder Falsch';
        } else {
            dom.quizQuestionType.textContent = q.isKahoot ? 'Kahoot Recap' : 'Multiple Choice';
        }

        // Question
        dom.quizQuestionText.textContent = q.question;

        // Options
        dom.quizOptions.innerHTML = '';
        if (q.type === 'true-false') {
            ['Richtig', 'Falsch'].forEach((opt, i) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option';
                btn.dataset.index = i;
                btn.innerHTML = `
                    <span class="quiz-option-letter">${i === 0 ? 'R' : 'F'}</span>
                    <span>${opt}</span>
                `;
                btn.addEventListener('click', () => selectAnswer(i));
                dom.quizOptions.appendChild(btn);
            });
        } else {
            const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
            (q.options || []).forEach((opt, i) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option';
                btn.dataset.index = i;
                btn.innerHTML = `
                    <span class="quiz-option-letter">${letters[i]}</span>
                    <span>${escapeHtml(opt)}</span>
                `;
                btn.addEventListener('click', () => selectAnswer(i));
                dom.quizOptions.appendChild(btn);
            });
        }

        // Reset state
        quiz.selectedAnswer = null;
        quiz.answered = false;
        dom.quizSubmit.classList.add('hidden');
        dom.quizNext.classList.add('hidden');
        dom.quizExplanation.classList.add('hidden');
    }

    function selectAnswer(index) {
        const quiz = state.activeQuiz;
        if (!quiz || quiz.answered) return;

        quiz.selectedAnswer = index;

        // Update visual selection
        dom.quizOptions.querySelectorAll('.quiz-option').forEach((btn, i) => {
            btn.classList.toggle('selected', i === index);
        });

        dom.quizSubmit.classList.remove('hidden');
    }

    function submitAnswer() {
        const quiz = state.activeQuiz;
        if (!quiz || quiz.answered || quiz.selectedAnswer === null) return;

        quiz.answered = true;
        const q = quiz.questions[quiz.currentIndex];

        let correctIndex;
        if (q.type === 'true-false') {
            correctIndex = q.correctAnswer === true ? 0 : 1;
        } else {
            correctIndex = q.correctAnswer;
        }

        const isCorrect = quiz.selectedAnswer === correctIndex;

        quiz.answers.push({
            questionIndex: quiz.currentIndex,
            question: q.question,
            selectedAnswer: quiz.selectedAnswer,
            correctAnswer: correctIndex,
            isCorrect,
            options: q.type === 'true-false' ? ['Richtig', 'Falsch'] : q.options
        });

        // Visual feedback
        dom.quizOptions.querySelectorAll('.quiz-option').forEach((btn, i) => {
            btn.classList.add('disabled');
            if (i === correctIndex) btn.classList.add('correct');
            if (i === quiz.selectedAnswer && !isCorrect) btn.classList.add('wrong');
            btn.classList.remove('selected');
        });

        // Show explanation
        if (q.explanation) {
            dom.quizExplanationText.textContent = q.explanation;
            dom.quizExplanation.classList.remove('hidden');
        }

        dom.quizSubmit.classList.add('hidden');
        dom.quizNext.classList.remove('hidden');
        dom.quizNext.textContent = quiz.currentIndex < quiz.questions.length - 1 ? 'Nächste Frage' : 'Ergebnis anzeigen';
    }

    function nextQuestion() {
        const quiz = state.activeQuiz;
        if (!quiz) return;

        if (quiz.currentIndex < quiz.questions.length - 1) {
            quiz.currentIndex++;
            renderQuizQuestion();
        } else {
            showQuizResults();
        }
    }

    function showQuizResults() {
        if (timerInterval) clearInterval(timerInterval);
        const quiz = state.activeQuiz;
        if (!quiz) return;

        const correct = quiz.answers.filter(a => a.isCorrect).length;
        const total = quiz.answers.length;
        const pct = Math.round((correct / total) * 100);

        // Save to history
        const wrongQuestions = quiz.answers
            .filter(a => !a.isCorrect)
            .map(a => quiz.questions[a.questionIndex]);

        state.quizHistory.push({
            mode: quiz.mode,
            moduleId: quiz.moduleId,
            score: pct,
            correct,
            total,
            date: new Date().toISOString().split('T')[0],
            wrongQuestions
        });

        // Update module progress
        if (quiz.moduleId && state.progress[quiz.moduleId]) {
            if (!state.progress[quiz.moduleId].quizScores) {
                state.progress[quiz.moduleId].quizScores = [];
            }
            state.progress[quiz.moduleId].quizScores.push(pct);
        }

        saveState();

        // Show results
        dom.quizActive.classList.add('hidden');
        dom.quizResults.classList.remove('hidden');

        // Animate score circle
        const circumference = 2 * Math.PI * 54;
        const offset = circumference - (pct / 100) * circumference;
        setTimeout(() => {
            dom.resultCircle.style.strokeDashoffset = offset;
        }, 100);

        dom.resultScoreValue.textContent = pct + '%';
        dom.resultCorrect.textContent = correct;
        dom.resultWrong.textContent = total - correct;
        dom.resultTotal.textContent = total;

        // Title & subtitle based on score
        if (pct >= 90) {
            dom.resultTitle.textContent = 'Ausgezeichnet! 🌟';
            dom.resultSubtitle.textContent = 'Du bist hervorragend vorbereitet!';
        } else if (pct >= 75) {
            dom.resultTitle.textContent = 'Sehr gut! 👏';
            dom.resultSubtitle.textContent = 'Nur noch ein paar Lücken zu schließen.';
        } else if (pct >= 50) {
            dom.resultTitle.textContent = 'Gut, aber...';
            dom.resultSubtitle.textContent = 'Wiederhole die Inhalte und versuche es nochmal.';
        } else {
            dom.resultTitle.textContent = 'Noch nicht bereit 📚';
            dom.resultSubtitle.textContent = 'Geh zurück zum Lernen und wiederhole die Inhalte.';
        }

        // Render review
        renderReview(quiz);
    }

    function renderReview(quiz) {
        dom.reviewList.innerHTML = '';
        quiz.answers.forEach((a, i) => {
            const item = document.createElement('div');
            item.className = `review-item ${a.isCorrect ? 'correct' : 'wrong'}`;
            let answerText = '';
            if (a.options) {
                answerText = `<strong>Richtige Antwort:</strong> ${escapeHtml(a.options[a.correctAnswer] || '?')}`;
                if (!a.isCorrect) {
                    answerText += `<br><span class="review-your-answer">Deine Antwort: ${escapeHtml(a.options[a.selectedAnswer] || '?')}</span>`;
                }
            }
            item.innerHTML = `
                <div class="review-question">${i + 1}. ${escapeHtml(a.question)}</div>
                <div class="review-answer">${answerText}</div>
            `;
            dom.reviewList.appendChild(item);
        });
    }

    // ---- Progress View ----
    function updateProgressView() {
        let totalSections = 0;
        let completedSections = 0;
        state.modules.forEach(m => {
            const sCount = m.sections ? m.sections.length : 0;
            totalSections += sCount;
            const prog = state.progress[m.id];
            if (prog) completedSections += (prog.sectionsCompleted || []).length;
        });
        const overallPct = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;

        // Overall ring
        const circumference = 2 * Math.PI * 70;
        const offset = circumference - (overallPct / 100) * circumference;
        setTimeout(() => {
            dom.overallProgressCircle.style.strokeDashoffset = offset;
        }, 100);
        dom.overallProgressValue.textContent = overallPct + '%';

        // Readiness meter
        let allScores = [];
        Object.values(state.progress).forEach(p => {
            if (p.quizScores && p.quizScores.length > 0) {
                allScores = allScores.concat(p.quizScores);
            }
        });
        const avgQuiz = allScores.length > 0 ? allScores.reduce((a,b)=>a+b,0) / allScores.length : 0;
        const readiness = Math.round((overallPct * 0.4 + avgQuiz * 0.6));
        dom.readinessFill.style.width = readiness + '%';

        if (readiness >= 85) {
            dom.readinessTip.textContent = '🎯 Du bist prüfungsbereit! Mache eine letzte Prüfungssimulation zur Bestätigung.';
        } else if (readiness >= 60) {
            dom.readinessTip.textContent = '📈 Guter Fortschritt! Fokussiere dich auf Module mit niedrigeren Quiz-Ergebnissen.';
        } else if (readiness >= 30) {
            dom.readinessTip.textContent = '📚 Weiter lernen! Arbeite die Module der Reihe nach durch.';
        } else {
            dom.readinessTip.textContent = '🚀 Beginne mit dem Lernen, um deinen Fortschritt zu sehen.';
        }

        // Module list
        dom.progressModuleList.innerHTML = '';
        state.modules.forEach((m, idx) => {
            const color = MODULE_COLORS[idx % MODULE_COLORS.length];
            const prog = state.progress[m.id] || { sectionsCompleted: [], quizScores: [] };
            const sCount = m.sections ? m.sections.length : 0;
            const completed = (prog.sectionsCompleted || []).length;
            const pct = sCount > 0 ? Math.round((completed / sCount) * 100) : 0;
            const quizAvg = (prog.quizScores && prog.quizScores.length > 0)
                ? Math.round(prog.quizScores.reduce((a,b)=>a+b,0) / prog.quizScores.length) + '%'
                : '–';

            const item = document.createElement('div');
            item.className = 'progress-module-item';
            item.innerHTML = `
                <div class="module-number" style="background: ${color.soft}; color: ${color.text}; width: 32px; height: 32px; font-size: 0.85rem; border-radius: 8px;">${m.id.replace('module-', '')}</div>
                <span class="progress-module-name">${escapeHtml(m.title)}</span>
                <div class="progress-module-bar">
                    <div class="progress-module-fill" style="width: ${pct}%; background: ${color.gradient};"></div>
                </div>
                <span class="progress-module-pct">${pct}%</span>
                <span class="progress-module-quiz">Quiz: ${quizAvg}</span>
            `;
            dom.progressModuleList.appendChild(item);
        });
    }

    // ---- Helpers ----
    function renderContent(text) {
        if (!text) return '';

        // --- Extract fenced blocks first (diagram / compare / figure / code) so
        //     their contents are not mangled by the inline markdown passes. ---
        const placeholders = [];
        const stash = (html) => {
            const token = `@@BLOCK${placeholders.length}@@`;
            placeholders.push(html);
            // Isolate token into its own paragraph block so it is never
            // wrapped in <p> or merged with neighbouring text/lists.
            return `\n\n${token}\n\n`;
        };

        let src = text;

        // ```diagram ... ``` -> monospace ASCII figure (optional caption after colon)
        src = src.replace(/```diagram(?::([^\n]+))?\n?([\s\S]*?)```/g, (m, caption, body) => {
            const cap = caption ? `<figcaption>${escapeHtml(caption.trim())}</figcaption>` : '';
            return stash(`<figure class="diagram-fig"><pre class="diagram">${escapeHtml(body.replace(/\n$/, ''))}</pre>${cap}</figure>`);
        });

        // ```compare ... ``` -> side-by-side comparison cards.
        // Format: first line(s) "## Title" optional, then columns separated by lines of "===".
        // Each column: first line = heading, remaining lines = "- point" bullets.
        src = src.replace(/```compare\n?([\s\S]*?)```/g, (m, body) => {
            const cols = body.trim().split(/\n\s*===\s*\n/);
            let cards = cols.map(col => {
                const lines = col.trim().split('\n');
                const heading = lines.shift() || '';
                const points = lines.filter(l => l.trim()).map(l =>
                    `<li>${inlineMd(l.replace(/^[-*]\s*/, ''))}</li>`).join('');
                return `<div class="compare-card"><div class="compare-card-head">${inlineMd(heading)}</div><ul>${points}</ul></div>`;
            }).join('');
            return stash(`<div class="compare-grid">${cards}</div>`);
        });

        // ```sql ... ``` / ``` ... ``` -> code block
        src = src.replace(/```sql\n?([\s\S]*?)```/g, (m, code) =>
            stash(`<pre class="code-block"><code>${escapeHtml(code.replace(/\n$/, ''))}</code></pre>`));
        src = src.replace(/```\n?([\s\S]*?)```/g, (m, code) =>
            stash(`<pre class="code-block"><code>${escapeHtml(code.replace(/\n$/, ''))}</code></pre>`));

        // --- GFM tables ---
        src = src.replace(
            /(^\|.+\|[ \t]*\n\|[ \t]*:?-+:?[ \t]*(?:\|[ \t]*:?-+:?[ \t]*)*\|?[ \t]*\n(?:^\|.+\|[ \t]*\n?)*)/gm,
            (block) => stash(renderTable(block))
        );

        // --- Inline + block markdown on the remaining text ---
        let html = src
            .replace(/^#### (.+)$/gm, '<h5>$1</h5>')
            .replace(/^### (.+)$/gm, '<h4>$1</h4>')
            .replace(/^## (.+)$/gm, '<h3>$1</h3>')
            .replace(/^# (.+)$/gm, '<h2>$1</h2>')
            .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
            .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>');

        // Inline formatting (after headings/lists so the markers survive)
        html = inlineMd(html, true);

        // Wrap consecutive <li> in <ul>
        html = html.replace(/((?:<li>[\s\S]*?<\/li>\s*)+)/g, '<ul>$1</ul>');

        // Paragraphs for remaining text
        html = html.split('\n\n').map(block => {
            block = block.trim();
            if (!block) return '';
            if (/^<(h\d|ul|ol|pre|figure|div|table)/.test(block) || /^@@BLOCK\d+@@$/.test(block)) return block;
            return '<p>' + block + '</p>';
        }).join('\n');

        // Restore stashed blocks
        html = html.replace(/@@BLOCK(\d+)@@/g, (m, i) => placeholders[Number(i)] || '');

        return html;
    }

    // Inline markdown (bold/italic/code). `skipHeadingLists` avoids re-touching
    // already-converted block tags when run on a full document.
    function inlineMd(text, full) {
        return text
            .replace(/`([^`]+)`/g, (m, c) => `<code>${escapeHtml(c)}</code>`)
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    }

    function renderTable(block) {
        const rows = block.trim().split('\n').filter(r => r.trim());
        if (rows.length < 2) return block;
        const splitRow = (r) => r.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
        const header = splitRow(rows[0]);
        const aligns = splitRow(rows[1]).map(c => {
            const l = c.startsWith(':'), r = c.endsWith(':');
            return l && r ? 'center' : r ? 'right' : l ? 'left' : '';
        });
        const bodyRows = rows.slice(2).map(splitRow);
        let html = '<div class="table-wrap"><table class="content-table"><thead><tr>';
        header.forEach((h, i) => {
            html += `<th${aligns[i] ? ` style="text-align:${aligns[i]}"` : ''}>${inlineMd(h)}</th>`;
        });
        html += '</tr></thead><tbody>';
        bodyRows.forEach(cells => {
            html += '<tr>';
            cells.forEach((c, i) => {
                html += `<td${aligns[i] ? ` style="text-align:${aligns[i]}"` : ''}>${inlineMd(c)}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody></table></div>';
        return html;
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function shuffleArray(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        dom.toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('toast-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ---- Event Binding ----
    function bindEvents() {
        // Navigation
        dom.navLinks.forEach(link => {
            link.addEventListener('click', () => switchView(link.dataset.view));
        });

        // Theme
        dom.themeToggle.addEventListener('click', toggleTheme);

        // Back to dashboard
        dom.backToDashboard.addEventListener('click', () => switchView('dashboard'));

        // Quiz modes
        dom.quizModeModule.addEventListener('click', () => {
            dom.quizModuleSelect.classList.remove('hidden');
            renderQuizModuleSelect();
        });

        dom.quizModeExam.addEventListener('click', () => startQuiz('exam'));
        dom.quizModeWeak.addEventListener('click', () => startQuiz('weak'));
        dom.quizModeKahoot.addEventListener('click', () => startQuiz('kahoot'));

        // Quiz controls
        dom.quizSubmit.addEventListener('click', submitAnswer);
        dom.quizNext.addEventListener('click', nextQuestion);
        dom.quizExit.addEventListener('click', () => {
            if (timerInterval) clearInterval(timerInterval);
            state.activeQuiz = null;
            resetQuizView();
        });

        // Results
        dom.resultRetry.addEventListener('click', () => {
            const quiz = state.activeQuiz;
            if (quiz) {
                startQuiz(quiz.mode, quiz.moduleId);
            } else {
                resetQuizView();
            }
        });
        dom.resultReview.addEventListener('click', () => {
            dom.reviewSection.classList.toggle('hidden');
        });
        dom.resultBack.addEventListener('click', () => {
            state.activeQuiz = null;
            resetQuizView();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!state.activeQuiz || state.activeQuiz.answered) return;
            const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
            if (keyMap[e.key.toLowerCase()] !== undefined) {
                selectAnswer(keyMap[e.key.toLowerCase()]);
            }
            if (e.key === 'Enter') {
                if (!state.activeQuiz.answered && state.activeQuiz.selectedAnswer !== null) {
                    submitAnswer();
                } else if (state.activeQuiz.answered) {
                    nextQuestion();
                }
            }
        });
    }

    function renderQuizModuleSelect() {
        dom.quizModuleGrid.innerHTML = '';
        state.modules.forEach(m => {
            const qCount = (m.quiz ? m.quiz.length : 0);
            const kahoot = state.kahootQuestions.find(k => k.moduleId === m.id);
            const kCount = kahoot ? kahoot.questions.length : 0;
            const total = qCount + kCount;
            if (total === 0) return;

            const btn = document.createElement('button');
            btn.className = 'quiz-module-btn';
            btn.innerHTML = `
                <strong>${escapeHtml(m.title)}</strong><br>
                <small style="color: var(--text-tertiary);">${total} Fragen</small>
            `;
            btn.addEventListener('click', () => startQuiz('module', m.id));
            dom.quizModuleGrid.appendChild(btn);
        });
    }

    // ---- Init ----
    function init() {
        cacheDom();
        loadState();
        applyTheme();
        bindEvents();
        loadAllContent();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
