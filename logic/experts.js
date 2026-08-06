// =========================
// EXPERT CALCULATOR
// Selection grid -> Expert overview -> Affinity Calculator / Skills Calculator
// Uses real per-expert data (data/expertsData.js). Skill names/descriptions
// are placeholders until real skill text is provided; all numeric data
// (affinity, sigils, xp, books) is real.
// =========================

const ExpertsManager = {
    activeExpertId: null,
    activeMode: null,   // "affinity" | "skills"
    activeSkillId: null,

    // Affinity calc state: step indexes into expert.levels (0-based), plus
    // how much affinity has already been put toward the NEXT step.
    affinity: { curStep: 0, tgtStep: 0, progress: 0 },
    skillState: {},      // { [skillId]: { curLevel, curXp } }

    T(key) { return I18N.t(key) || key; },
    nf(n) { return (!n && n !== 0) ? "0" : Math.round(n).toLocaleString(); },

    // ── Entry point ───────────────────────────────────────────────────────────

    init() {
        Renderers.renderExpertsView();
        this.loadData();
        this.renderSelectionGrid();
        if (this.activeExpertId) {
            this.openExpert(this.activeExpertId, true);
            if (this.activeMode) this.selectMode(this.activeMode);
        }
    },

    // ── Selection grid ───────────────────────────────────────────────────────

    expertName(ex) {
        const key = `expertName_${ex.id}`;
        const t = this.T(key);
        return t === key ? ex.name : t;
    },

    renderSelectionGrid() {
        const grid = document.getElementById("expertsSelectionGrid");
        if (!grid) return;
        grid.innerHTML = (window.expertsData || []).map(ex => `
            <div class="expert-card" onclick="ExpertsManager.openExpert('${ex.id}')">
                <img src="${ex.badge}" alt="${this.expertName(ex)}">
                <div class="expert-card-name">${this.expertName(ex)}</div>
            </div>
        `).join("");
    },

    getExpert(id) {
        return (window.expertsData || []).find(e => e.id === id);
    },

    // ── Overview ─────────────────────────────────────────────────────────────

    openExpert(id, skipSave) {
        const expert = this.getExpert(id);
        if (!expert) return;
        this.activeExpertId = id;
        this.activeMode = null;
        this.activeSkillId = null;
        this.affinity = { curStep: 0, tgtStep: 0, progress: 0 };

        document.getElementById("expertsSelectionScreen").style.display = "none";
        const overview = document.getElementById("expertsOverviewScreen");
        overview.style.display = "";
        overview.classList.remove("expert-overview-enter");
        void overview.offsetWidth; // restart animation
        overview.classList.add("expert-overview-enter");

        document.getElementById("expertOverviewPortrait").src = expert.portrait;
        document.getElementById("expertOverviewName").textContent = this.expertName(expert);
        document.getElementById("expertModeContent").innerHTML = "";

        if (!skipSave) this.saveData();
    },

    backToSelection() {
        this.activeExpertId = null;
        document.getElementById("expertsOverviewScreen").style.display = "none";
        document.getElementById("expertsSelectionScreen").style.display = "";
        this.saveData();
    },

    // ── Mode switch ──────────────────────────────────────────────────────────

    selectMode(mode) {
        this.activeMode = mode;
        document.querySelectorAll(".expert-mode-btn").forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
        if (mode === "affinity") this.renderAffinityCalculator();
        else this.renderSkillsCalculator();
        this.saveData();
    },

    // ── Affinity Calculator ──────────────────────────────────────────────────
    // expert.levels is ONE row per level (0-100). Row i = cost to go from
    // level i-1 to level i (affinity + sigils). Row 0 is the zero baseline.

    levelLabel(row) {
        return `${this.T("charmsLevel")} ${row.level} — ${row.relationship}`;
    },

    affinityCostBetween(curLevel, tgtLevel, progress) {
        const expert = this.getExpert(this.activeExpertId);
        const levels = expert.levels;
        let affinity = 0, sigils = 0;
        for (let lv = curLevel + 1; lv <= tgtLevel; lv++) {
            const row = levels[lv];
            if (!row) continue;
            affinity += row.affinity;
            sigils += row.advancement;
        }
        affinity = Math.max(0, affinity - (progress || 0));
        return { affinity, sigils };
    },

    materialBreakdown(totalAffinity) {
        const mats = window.expertAffinityMaterials || [];
        // Greedy from largest denomination down; round the smallest unit up
        // so the combination fully covers the requirement.
        const sorted = [...mats].sort((a, b) => b.value - a.value);
        let remaining = totalAffinity;
        const result = {};
        sorted.forEach((m, idx) => {
            const isLast = idx === sorted.length - 1;
            const count = isLast ? Math.ceil(remaining / m.value) : Math.floor(remaining / m.value);
            result[m.id] = count;
            remaining -= count * m.value;
        });
        return result;
    },

    renderAffinityCalculator() {
        const expert = this.getExpert(this.activeExpertId);
        const levels = expert.levels;
        const a = this.affinity;
        if (a.tgtStep < a.curStep) a.tgtStep = a.curStep;

        const nextRow = levels[a.curStep + 1];
        const progressMax = nextRow ? nextRow.affinity : 0;
        if (a.progress > progressMax) a.progress = progressMax;

        const cost = this.affinityCostBetween(a.curStep, a.tgtStep, a.progress);
        const breakdown = this.materialBreakdown(cost.affinity);
        const mats = window.expertAffinityMaterials || [];

        const levelOptions = (mode, selected, min) => levels.map((row, i) => {
            if (i < min) return "";
            return `<div class="gear-custom-option ${i === selected ? "active" : ""}" data-value="${i}"
                onclick="ExpertsManager.setAffinityStep('${mode}',this.dataset.value)">${this.levelLabel(row)}</div>`;
        }).join("");

        const materialsHtml = mats.map(m => `
            <div class="resource-total">
                <div class="label" style="display:flex;align-items:center;justify-content:center;gap:6px;">
                    <img src="${m.icon}" alt="" style="width:22px;height:22px;object-fit:contain;">
                    <span>${this.T("expertsMaterial_" + m.id)}</span>
                </div>
                <div class="value" style="color:#4fc3ff;">${this.nf(breakdown[m.id] || 0)}</div>
            </div>
        `).join("");

        document.getElementById("expertModeContent").innerHTML = `
            <div class="expert-calc-panel">
                <div class="expert-calc-row">
                    <div class="gear-select-wrapper">
                        <label class="gear-select-label">${this.T("expertsCurrentLevel")}</label>
                        <div class="gear-custom-trigger" onclick="CharmsManager.toggleDD(this)">
                            <span class="gear-selected-text">${this.levelLabel(levels[a.curStep])}</span>
                            <svg class="gear-chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4fc3ff" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                        <div class="gear-custom-dropdown-menu">${levelOptions("cur", a.curStep, 0)}</div>
                    </div>
                    <span class="charm-slot-arrow">➔</span>
                    <div class="gear-select-wrapper">
                        <label class="gear-select-label">${this.T("expertsTargetLevel")}</label>
                        <div class="gear-custom-trigger" onclick="CharmsManager.toggleDD(this)">
                            <span class="gear-selected-text">${this.levelLabel(levels[a.tgtStep])}</span>
                            <svg class="gear-chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4fc3ff" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                        <div class="gear-custom-dropdown-menu">${levelOptions("tgt", a.tgtStep, a.curStep)}</div>
                    </div>
                </div>

                ${progressMax > 0 ? `
                <div class="expert-calc-row">
                    <div class="gear-select-wrapper">
                        <label class="gear-select-label">${this.T("expertsCurrentAffinity")} (${this.T("expertsMax")}: ${this.nf(progressMax)})</label>
                        <input type="text" inputmode="numeric" class="action-btn" value="${a.progress}"
                               onchange="ExpertsManager.setAffinityProgress(this.value)">
                    </div>
                </div>` : ""}

                <div class="expert-calc-results">
                    <div class="resource-total"><div class="label">${this.T("expertsTotalAffinity")}</div><div class="value" style="color:#4fc3ff;">${this.nf(cost.affinity)}</div></div>
                    <div class="resource-total">
                        <div class="label" style="display:flex;align-items:center;justify-content:center;gap:6px;">
                            <img src="${window.expertSigilsIcon}" alt="" style="width:22px;height:22px;object-fit:contain;">
                            <span>${this.T("expertsSigils")}</span>
                        </div>
                        <div class="value" style="color:#5fe016;">${this.nf(cost.sigils)}</div>
                    </div>
                </div>

                <div class="expert-calc-results" style="margin-top:10px;">
                    ${materialsHtml}
                </div>
            </div>
        `;
    },

    setAffinityStep(mode, value) {
        const val = parseInt(value, 10);
        if (mode === "cur") {
            this.affinity.curStep = val;
            this.affinity.progress = 0;
            if (this.affinity.tgtStep < val) this.affinity.tgtStep = val;
        } else {
            this.affinity.tgtStep = val;
        }
        this.renderAffinityCalculator();
        this.saveData();
    },

    setAffinityProgress(value) {
        const v = Math.max(0, parseInt(value, 10) || 0);
        this.affinity.progress = v;
        this.renderAffinityCalculator();
        this.saveData();
    },

    // ── Skills Calculator ────────────────────────────────────────────────────
    // Research produces 600 xp every 10 minutes (60 xp/min). Each skill's xp
    // table gives CUMULATIVE exp/book totals per level (level 0 = 0 exp).

    xpForLevel(skill, level) {
        if (level <= 0) return { exp: 0, book: 0 };
        const row = skill.xp.find(e => e.level === level);
        return row ? { exp: row.exp, book: row.book } : { exp: 0, book: 0 };
    },

    renderSkillsCalculator() {
        const expert = this.getExpert(this.activeExpertId);
        if (!expert) return;

        document.getElementById("expertModeContent").innerHTML = `
            <div class="expert-skills-grid">
                ${expert.skills.map(s => `
                    <div class="expert-skill-card ${this.activeSkillId === s.id ? "expert-skill-active" : ""}"
                         onclick="ExpertsManager.selectSkill(${s.id})">
                        <img src="${s.icon}" alt="">
                        <div class="expert-skill-name">${s.name}</div>
                        <div class="expert-skill-desc">${s.description}</div>
                    </div>
                `).join("")}
            </div>
            <div id="expertSkillDetail"></div>
        `;
        if (this.activeSkillId) this.renderSkillDetail(this.activeSkillId);
    },

    selectSkill(id) {
        this.activeSkillId = id;
        if (!this.skillState[id]) {
            const skill = this.getExpert(this.activeExpertId).skills.find(s => s.id === id);
            const maxLevel = skill.maxLevel || (window.EXPERT_SKILL_MAX_LEVEL || 5);
            this.skillState[id] = { curLevel: 0, curXp: 0, tgtLevel: maxLevel };
        }
        this.renderSkillsCalculator();
        this.saveData();
    },

    renderSkillDetail(skillId) {
        const expert = this.getExpert(this.activeExpertId);
        const skill = expert.skills.find(s => s.id === skillId);
        const maxLevel = skill.maxLevel || (window.EXPERT_SKILL_MAX_LEVEL || 5);
        const state = this.skillState[skillId] || { curLevel: 0, curXp: 0, tgtLevel: maxLevel };
        if (state.tgtLevel === undefined) state.tgtLevel = maxLevel;
        if (state.tgtLevel < state.curLevel) state.tgtLevel = state.curLevel;

        // Cap current xp so it can't surpass the requirement for the next level
        const curTotal = this.xpForLevel(skill, state.curLevel);
        const nextTotal = this.xpForLevel(skill, state.curLevel + 1);
        const progressCap = Math.max(0, nextTotal.exp - curTotal.exp - 1);
        if (state.curLevel >= maxLevel) state.curXp = 0;
        else if (state.curXp > progressCap) state.curXp = progressCap;

        const curLevelOptions = Array.from({ length: maxLevel + 1 }, (_, lv) =>
            `<div class="gear-custom-option ${lv === state.curLevel ? "active" : ""}" data-value="${lv}"
                onclick="ExpertsManager.setSkillLevel(${skillId},this.dataset.value)">${this.T("charmsLevel")} ${lv}</div>`
        ).join("");

        const tgtLevelOptions = Array.from({ length: maxLevel + 1 }, (_, lv) => {
            if (lv < state.curLevel) return "";
            return `<div class="gear-custom-option ${lv === state.tgtLevel ? "active" : ""}" data-value="${lv}"
                onclick="ExpertsManager.setSkillTarget(${skillId},this.dataset.value)">${this.T("charmsLevel")} ${lv}</div>`;
        }).join("");

        const targetTotal = this.xpForLevel(skill, state.tgtLevel);
        const haveTotal = curTotal.exp + state.curXp;
        const remaining = Math.max(0, targetTotal.exp - haveTotal);

        // Books: derive an exp-per-book ratio from the skill's own data (constant across levels)
        const lastRow = skill.xp[skill.xp.length - 1];
        const ratio = (lastRow && lastRow.book) ? (lastRow.exp / lastRow.book) : (window.EXPERT_RESEARCH_XP_PER_10MIN || 600);
        const booksNeeded = Math.ceil(remaining / ratio);

        const ratePerMin = (window.EXPERT_RESEARCH_XP_PER_10MIN || 600) / 10;
        const totalMinutes = remaining / ratePerMin;
        const days = Math.floor(totalMinutes / 1440);
        const hours = Math.floor((totalMinutes % 1440) / 60);
        const mins = Math.ceil(totalMinutes % 60);
        const etaParts = [];
        if (days > 0) etaParts.push(`${days}${this.T("expertsEtaDaysShort")}`);
        if (hours > 0) etaParts.push(`${hours}${this.T("expertsEtaHoursShort")}`);
        if (mins > 0 || etaParts.length === 0) etaParts.push(`${mins}${this.T("expertsEtaMinsShort")}`);
        const etaText = etaParts.join(" ");

        document.getElementById("expertSkillDetail").innerHTML = `
            <div class="expert-calc-panel">
                <div class="expert-calc-row">
                    <div class="gear-select-wrapper">
                        <label class="gear-select-label">${this.T("expertsSkillCurrentLevel")}</label>
                        <div class="gear-custom-trigger" onclick="CharmsManager.toggleDD(this)">
                            <span class="gear-selected-text">${state.curLevel}</span>
                            <svg class="gear-chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4fc3ff" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                        <div class="gear-custom-dropdown-menu">${curLevelOptions}</div>
                    </div>
                    <span class="charm-slot-arrow">➔</span>
                    <div class="gear-select-wrapper">
                        <label class="gear-select-label">${this.T("expertsSkillTargetLevel")}</label>
                        <div class="gear-custom-trigger" onclick="CharmsManager.toggleDD(this)">
                            <span class="gear-selected-text">${state.tgtLevel}</span>
                            <svg class="gear-chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4fc3ff" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                        <div class="gear-custom-dropdown-menu">${tgtLevelOptions}</div>
                    </div>
                    <div class="gear-select-wrapper">
                        <label class="gear-select-label">${this.T("expertsCurrentXp")} (${this.T("expertsMax")}: ${this.nf(progressCap)})</label>
                        <input type="text" inputmode="numeric" class="action-btn" value="${state.curXp}"
                               onchange="ExpertsManager.setSkillXp(${skillId}, this.value)">
                    </div>
                </div>
                <div class="expert-calc-results">
                    <div class="resource-total"><div class="label">${this.T("expertsXpNeeded")}</div><div class="value" style="color:#4fc3ff;">${this.nf(remaining)}</div></div>
                    <div class="resource-total">
                        <div class="label" style="display:flex;align-items:center;justify-content:center;gap:6px;">
                            <img src="${window.expertBookIcon}" alt="" style="width:22px;height:22px;object-fit:contain;">
                            <span>${this.T("expertsBooksNeeded")}</span>
                        </div>
                        <div class="value" style="color:#ffcc00;">${this.nf(booksNeeded)}</div>
                    </div>
                    <div class="resource-total"><div class="label">${this.T("expertsEta")}</div><div class="value" style="color:#5fe016;">${etaText}</div></div>
                </div>
                <div class="expert-placeholder-notice">⚠ ${this.T("expertsPlaceholderNotice")}</div>
            </div>
        `;
    },

    setSkillLevel(skillId, value) {
        const lv = parseInt(value, 10);
        this.skillState[skillId].curLevel = lv;
        this.skillState[skillId].curXp = 0;
        if (this.skillState[skillId].tgtLevel < lv) this.skillState[skillId].tgtLevel = lv;
        this.renderSkillDetail(skillId);
        this.saveData();
    },

    setSkillTarget(skillId, value) {
        this.skillState[skillId].tgtLevel = parseInt(value, 10);
        this.renderSkillDetail(skillId);
        this.saveData();
    },

    setSkillXp(skillId, value) {
        const v = Math.max(0, parseInt(value, 10) || 0);
        this.skillState[skillId].curXp = v;
        this.renderSkillDetail(skillId);
        this.saveData();
    },

    // ── Persistence ───────────────────────────────────────────────────────────

    saveData() {
        Storage.set("experts", {
            activeExpertId: this.activeExpertId,
            activeMode: this.activeMode,
            activeSkillId: this.activeSkillId,
            affinity: this.affinity,
            skillState: this.skillState
        });
    },

    loadData() {
        const data = Storage.get("experts");
        if (!data) return;
        this.activeExpertId = data.activeExpertId || null;
        this.activeMode = data.activeMode || null;
        this.activeSkillId = data.activeSkillId || null;
        this.affinity = data.affinity || { curStep: 0, tgtStep: 0, progress: 0 };
        this.skillState = data.skillState || {};
    }
};

window.ExpertsManager = ExpertsManager;
