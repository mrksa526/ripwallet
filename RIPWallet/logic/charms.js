// =========================
// CHARMS UPGRADE CALCULATOR
// =========================

const CharmsManager = {

    // ── State ─────────────────────────────────────────────────────────────────
    // cards: array of card objects
    // { id, type, count, curLevel, curStep, tgtLevel, tgtStep }
    cards: [],
    nextId: 1,

    // ── Constants ─────────────────────────────────────────────────────────────
    TYPE_COLORS: { inf: "#80E012", lanc: "#00ccff", mark: "#ffcc00" },
    TYPE_CLASSES: { inf: "inf-card",  lanc: "lanc-card",  mark: "mark-card"  },
    TYPE_COLOR_CLASSES: { inf: "inf-color", lanc: "lanc-color", mark: "mark-color" },
    MAX_PER_TYPE: 6,
    MAX_CARDS_PER_TYPE: 2,
    MIN_LEVEL: 7,
    MAX_LEVEL: 16,

    // ── Entry point ───────────────────────────────────────────────────────────

    init() {
        Renderers.renderCharmsView();
        this.cards  = [];
        this.nextId = 1;
        this.loadData();
        this.updateAllButtons();
        this.recalculateAll();
    },

    // ── Helpers ───────────────────────────────────────────────────────────────

    T(key) { return I18N.t(key) || key; },

    nf(n) {
        if (!n && n !== 0) return "0";
        return Math.round(n).toLocaleString();
    },

    // Steps available AT a given level (0 = no steps, just the base upgrade)
    stepsForLevel(level) {
        if (level < 8)  return 0;
        if (level <= 11) return 4;
        return 5;
    },

    // Cost for ONE step at a given level (returns {guide, design, secrets})
    costForStep(level) {
        const db = window.charmsData;
        if (!db || !db[level]) return { guide: 0, design: 0, secrets: 0 };
        return { guide: db[level].guide, design: db[level].design, secrets: db[level].secrets };
    },

    // Cumulative cost from baseline (level 7, step 0) to given position
    // position = { level, step }  where step 0 = just arrived at this level
    cumulativeCost(level, step) {
        const total = { guide: 0, design: 0, secrets: 0 };
        if (level < 8) return total;  // level 7 = zero baseline

        for (let lv = 8; lv <= level; lv++) {
            const c       = this.costForStep(lv);
            const maxStep = this.stepsForLevel(lv);
            const stepsToCount = (lv < level) ? maxStep : step;
            for (let st = 1; st <= stepsToCount; st++) {
                total.guide   += c.guide;
                total.design  += c.design;
                total.secrets += c.secrets;
            }
        }
        return total;
    },

    // Cost between two positions (subtraction of cumulative)
    costBetween(curLevel, curStep, tgtLevel, tgtStep) {
        const cur = this.cumulativeCost(curLevel, curStep);
        const tgt = this.cumulativeCost(tgtLevel, tgtStep);
        return {
            guide:   Math.max(0, tgt.guide   - cur.guide),
            design:  Math.max(0, tgt.design  - cur.design),
            secrets: Math.max(0, tgt.secrets - cur.secrets)
        };
    },

    // How many charms of a given type are already allocated across all cards
    usedCountForType(type, excludeCardId = null) {
        return this.cards
            .filter(c => c.type === type && c.id !== excludeCardId)
            .reduce((sum, c) => sum + c.count, 0);
    },

    // How many cards exist for a given type
    cardCountForType(type) {
        return this.cards.filter(c => c.type === type).length;
    },

    // ── Card management ───────────────────────────────────────────────────────

    addCard(type) {
        // Max 2 cards per type
        if (this.cardCountForType(type) >= this.MAX_CARDS_PER_TYPE) return;
        // Must have at least 1 charm slot remaining
        if (this.usedCountForType(type) >= this.MAX_PER_TYPE) return;

        const id = this.nextId++;
        this.cards.push({
            id,
            type,
            count:    1,
            curLevel: 7,
            curStep:  0,
            tgtLevel: 8,
            tgtStep:  1
        });

        this.renderCard(id);
        this.updateAllButtons();
        this.recalculateAll();
        this.saveData();
    },

    removeCard(id) {
        const idx = this.cards.findIndex(c => c.id === id);
        if (idx === -1) return;
        const type = this.cards[idx].type;

        this.cards.splice(idx, 1);

        const el = document.getElementById("charmCard_" + id);
        if (el) {
            el.style.animation = "charmCardOut 0.22s ease forwards";
            setTimeout(() => el.remove(), 220);
        }

        this.updateAllButtons();
        this.recalculateAll();
        this.updateGroupCounts();

        // Refresh count dropdowns on remaining cards of same type
        this.cards.filter(c => c.type === type).forEach(c => {
            this.refreshCountDropdown(c.id);
        });

        this.saveData();
    },

    // ── Render a single card ──────────────────────────────────────────────────

    renderCard(id) {
        const card  = this.cards.find(c => c.id === id);
        if (!card) return;

        // Use type-specific group container instead of single area
        const area = document.getElementById("charmsGroupCards_" + card.type);
        if (!area) return;

        const color = this.TYPE_COLORS[card.type];
        const cls   = this.TYPE_CLASSES[card.type];
        const clrCl = this.TYPE_COLOR_CLASSES[card.type];
        const name  = this.T("troop" + card.type.charAt(0).toUpperCase() + card.type.slice(1));

        const div = document.createElement("div");
        div.className = "charm-calc-card " + cls;
        div.id = "charmCard_" + id;

        div.innerHTML = `
            <!-- Card Header -->
            <div class="charm-card-header">
                <span class="charm-card-title ${clrCl}">
                    ${name} — ${this.T("charmsLevel")} ${card.curLevel === 7 ? this.T("charmsBelow8") : card.curLevel}
                    ➔ ${this.T("charmsLevel")} ${card.tgtLevel}
                </span>
                <button class="charm-remove-btn"
                        onclick="CharmsManager.removeCard(${id})">
                    ${this.T("charmsRemove")}
                </button>
            </div>

            <!-- Inputs grid - Count moved to end -->
            <div class="charm-card-inputs charm-card-inputs-reordered">

                <!-- Current Level -->
                <div class="gear-select-wrapper">
                    <label class="gear-select-label">${this.T("charmsCurrentLevel")}</label>
                    <div class="gear-custom-trigger" onclick="CharmsManager.toggleDropdown(this)">
                        <span class="gear-selected-text" id="curLvText_${id}">${this.T("charmsBelow8")}</span>
                        <svg class="gear-chevron-icon" width="12" height="12" viewBox="0 0 24 24"
                             fill="none" stroke="#4fc3ff" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                    <div class="gear-custom-dropdown-menu" id="curLvMenu_${id}">
                        ${this.buildLevelOptions(id, "cur", card.curLevel)}
                    </div>
                </div>

                <!-- Current Step -->
                <div class="gear-select-wrapper" id="curStepWrapper_${id}">
                    <label class="gear-select-label">${this.T("charmsCurrentStep")}</label>
                    <div class="gear-custom-trigger" onclick="CharmsManager.toggleDropdown(this)">
                        <span class="gear-selected-text" id="curStText_${id}">0</span>
                        <svg class="gear-chevron-icon" width="12" height="12" viewBox="0 0 24 24"
                             fill="none" stroke="#4fc3ff" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                    <div class="gear-custom-dropdown-menu" id="curStMenu_${id}">
                        ${this.buildStepOptions(id, "cur", card.curLevel, card.curStep)}
                    </div>
                </div>

                <!-- Target Level -->
                <div class="gear-select-wrapper">
                    <label class="gear-select-label">${this.T("charmsTargetLevel")}</label>
                    <div class="gear-custom-trigger" onclick="CharmsManager.toggleDropdown(this)">
                        <span class="gear-selected-text" id="tgtLvText_${id}">${this.T("charmsLevel")} 8</span>
                        <svg class="gear-chevron-icon" width="12" height="12" viewBox="0 0 24 24"
                             fill="none" stroke="#4fc3ff" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                    <div class="gear-custom-dropdown-menu" id="tgtLvMenu_${id}">
                        ${this.buildLevelOptions(id, "tgt", card.tgtLevel)}
                    </div>
                </div>

                <!-- Target Step -->
                <div class="gear-select-wrapper" id="tgtStepWrapper_${id}">
                    <label class="gear-select-label">${this.T("charmsTargetStep")}</label>
                    <div class="gear-custom-trigger" onclick="CharmsManager.toggleDropdown(this)">
                        <span class="gear-selected-text" id="tgtStText_${id}">1</span>
                        <svg class="gear-chevron-icon" width="12" height="12" viewBox="0 0 24 24"
                             fill="none" stroke="#4fc3ff" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                    <div class="gear-custom-dropdown-menu" id="tgtStMenu_${id}">
                        ${this.buildStepOptions(id, "tgt", card.tgtLevel, card.tgtStep)}
                    </div>
                </div>

                <!-- Count - MOVED TO END -->
                <div class="gear-select-wrapper charm-count-wrapper">
                    <label class="gear-select-label">${this.T("charmsCount")}</label>
                    <div class="gear-custom-trigger" onclick="CharmsManager.toggleDropdown(this)">
                        <span class="gear-selected-text" id="countText_${id}">1</span>
                        <svg class="gear-chevron-icon" width="12" height="12" viewBox="0 0 24 24"
                             fill="none" stroke="#4fc3ff" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                    <div class="gear-custom-dropdown-menu" id="countMenu_${id}"></div>
                </div>

            </div>

            <!-- Per-card cost result -->
            <div class="charm-card-result" id="charmResult_${id}"></div>
        `;

        area.appendChild(div);

        // Populate count dropdown after DOM insertion
        this.refreshCountDropdown(id);
        this.renderCardResult(id);
        this.updateGroupCounts();
    },

    // ── Dropdown option builders ──────────────────────────────────────────────

    buildLevelOptions(cardId, mode, selectedLevel) {
        let html = "";
        for (let lv = this.MIN_LEVEL; lv <= this.MAX_LEVEL; lv++) {
            const label  = lv === 7 ? this.T("charmsBelow8") : this.T("charmsLevel") + " " + lv;
            const active = lv === selectedLevel ? "active" : "";
            html += `<div class="gear-custom-option ${active}"
                          data-value="${lv}"
                          onclick="CharmsManager.selectLevel(this,${cardId},'${mode}')">
                         ${label}
                     </div>`;
        }
        return html;
    },

    buildStepOptions(cardId, mode, level, selectedStep) {
        const maxSteps = this.stepsForLevel(level);
        let html = "";

        // Step 0 = just reached this level / no partial progress
        const startStep = (mode === "cur") ? 0 : 1;

        if (maxSteps === 0) {
            // Level 7 baseline — only step 0
            return `<div class="gear-custom-option active" data-value="0"
                         onclick="CharmsManager.selectStep(this,${cardId},'${mode}')">
                         — (${this.T("charmsNoSteps")})
                     </div>`;
        }

        for (let st = startStep; st <= maxSteps; st++) {
            const label  = st === 0 ? "0 (${this.T('charmsNoSteps')})" : this.T("charmsStep") + " " + st;
            const active = st === selectedStep ? "active" : "";
            html += `<div class="gear-custom-option ${active}"
                          data-value="${st}"
                          onclick="CharmsManager.selectStep(this,${cardId},'${mode}')">
                          ${st === 0 ? "0" : this.T("charmsStep") + " " + st}
                     </div>`;
        }
        return html;
    },

    refreshCountDropdown(cardId) {
        const card    = this.cards.find(c => c.id === cardId);
        const menu    = document.getElementById("countMenu_" + cardId);
        const txtEl   = document.getElementById("countText_" + cardId);
        if (!card || !menu) return;

        const used     = this.usedCountForType(card.type, cardId);
        const maxCount = Math.min(this.MAX_PER_TYPE - used, this.MAX_PER_TYPE);

        // Clamp current count if needed
        if (card.count > maxCount) {
            card.count = maxCount;
        }

        let html = "";
        for (let i = 1; i <= maxCount; i++) {
            const active = i === card.count ? "active" : "";
            html += `<div class="gear-custom-option ${active}"
                          data-value="${i}"
                          onclick="CharmsManager.selectCount(this,${cardId})">
                          ${i}
                     </div>`;
        }
        menu.innerHTML = html;
        if (txtEl) txtEl.textContent = card.count;
    },

    // ── Dropdown interactions ─────────────────────────────────────────────────

    toggleDropdown(trigger) {
        const menu = trigger.nextElementSibling;
        if (!menu) return;
        // Close all others
        document.querySelectorAll(".gear-custom-dropdown-menu").forEach(m => {
            if (m !== menu) m.classList.remove("show");
        });
        document.querySelectorAll(".gear-custom-trigger").forEach(t => {
            if (t !== trigger) t.classList.remove("open");
        });
        menu.classList.toggle("show");
        trigger.classList.toggle("open");
    },

    _closeDropdown(trigger, menu) {
        menu.classList.remove("show");
        trigger.classList.remove("open");
    },

    selectCount(optEl, cardId) {
        const card = this.cards.find(c => c.id === cardId);
        if (!card) return;
        const val = parseInt(optEl.dataset.value);
        card.count = val;

        const menu    = optEl.parentElement;
        const trigger = menu.previousElementSibling;
        menu.querySelectorAll(".gear-custom-option").forEach(o => o.classList.remove("active"));
        optEl.classList.add("active");
        const txtEl = document.getElementById("countText_" + cardId);
        if (txtEl) txtEl.textContent = val;
        this._closeDropdown(trigger, menu);

        // Refresh sibling cards of same type
        this.cards.filter(c => c.type === card.type && c.id !== cardId)
                  .forEach(c => this.refreshCountDropdown(c.id));

        this.updateAllButtons();
        this.recalculateAll();
        this.saveData();
    },

    selectLevel(optEl, cardId, mode) {
        const card = this.cards.find(c => c.id === cardId);
        if (!card) return;
        const level = parseInt(optEl.dataset.value);

        const menu    = optEl.parentElement;
        const trigger = menu.previousElementSibling;
        menu.querySelectorAll(".gear-custom-option").forEach(o => o.classList.remove("active"));
        optEl.classList.add("active");
        this._closeDropdown(trigger, menu);

        if (mode === "cur") {
            card.curLevel = level;
            card.curStep  = 0;
            // Rebuild current step menu
            const stMenu = document.getElementById("curStMenu_" + cardId);
            if (stMenu) stMenu.innerHTML = this.buildStepOptions(cardId, "cur", level, 0);
            const stTxt = document.getElementById("curStText_" + cardId);
            if (stTxt) stTxt.textContent = "0";

            // Update display text
            const lvTxt = document.getElementById("curLvText_" + cardId);
            if (lvTxt) lvTxt.textContent = level === 7 ? this.T("charmsBelow8") : this.T("charmsLevel") + " " + level;

            // Ensure target is still ahead
            this._enforceTgtAheadOfCur(cardId);

        } else {
            card.tgtLevel = level;
            card.tgtStep  = this.stepsForLevel(level) > 0 ? 1 : 0;
            // Rebuild target step menu
            const stMenu = document.getElementById("tgtStMenu_" + cardId);
            if (stMenu) stMenu.innerHTML = this.buildStepOptions(cardId, "tgt", level, card.tgtStep);
            const stTxt = document.getElementById("tgtStText_" + cardId);
            if (stTxt) stTxt.textContent = card.tgtStep;

            const lvTxt = document.getElementById("tgtLvText_" + cardId);
            if (lvTxt) lvTxt.textContent = this.T("charmsLevel") + " " + level;
        }

        this.updateCardHeader(cardId);
        this.renderCardResult(cardId);
        this.recalculateAll();
        this.saveData();
    },

    selectStep(optEl, cardId, mode) {
        const card = this.cards.find(c => c.id === cardId);
        if (!card) return;
        const step = parseInt(optEl.dataset.value);

        const menu    = optEl.parentElement;
        const trigger = menu.previousElementSibling;
        menu.querySelectorAll(".gear-custom-option").forEach(o => o.classList.remove("active"));
        optEl.classList.add("active");
        this._closeDropdown(trigger, menu);

        if (mode === "cur") {
            card.curStep = step;
            const stTxt = document.getElementById("curStText_" + cardId);
            if (stTxt) stTxt.textContent = step;
        } else {
            card.tgtStep = step;
            const stTxt = document.getElementById("tgtStText_" + cardId);
            if (stTxt) stTxt.textContent = step;
        }

        this.renderCardResult(cardId);
        this.recalculateAll();
        this.saveData();
    },

    // Make sure target is always ahead of current
    _enforceTgtAheadOfCur(cardId) {
        const card = this.cards.find(c => c.id === cardId);
        if (!card) return;
        const curPos = card.curLevel * 100 + card.curStep;
        const tgtPos = card.tgtLevel * 100 + card.tgtStep;
        if (tgtPos <= curPos) {
            card.tgtLevel = card.curLevel < this.MAX_LEVEL ? card.curLevel + 1 : card.curLevel;
            card.tgtStep  = this.stepsForLevel(card.tgtLevel) > 0 ? 1 : 0;

            // Refresh target menus
            const tgtLvMenu = document.getElementById("tgtLvMenu_" + cardId);
            if (tgtLvMenu) tgtLvMenu.innerHTML = this.buildLevelOptions(cardId, "tgt", card.tgtLevel);
            const tgtLvTxt = document.getElementById("tgtLvText_" + cardId);
            if (tgtLvTxt) tgtLvTxt.textContent = this.T("charmsLevel") + " " + card.tgtLevel;

            const tgtStMenu = document.getElementById("tgtStMenu_" + cardId);
            if (tgtStMenu) tgtStMenu.innerHTML = this.buildStepOptions(cardId, "tgt", card.tgtLevel, card.tgtStep);
            const tgtStTxt = document.getElementById("tgtStText_" + cardId);
            if (tgtStTxt) tgtStTxt.textContent = card.tgtStep;
        }
    },

    // ── Result rendering ──────────────────────────────────────────────────────

    updateCardHeader(cardId) {
        const card = this.cards.find(c => c.id === cardId);
        if (!card) return;
        const el = document.querySelector(`#charmCard_${cardId} .charm-card-title`);
        if (!el) return;
        const name    = this.T("troop" + card.type.charAt(0).toUpperCase() + card.type.slice(1));
        const curLabel = card.curLevel === 7 ? this.T("charmsBelow8") : this.T("charmsLevel") + " " + card.curLevel;
        el.textContent = `${name} — ${curLabel} ➔ ${this.T("charmsLevel")} ${card.tgtLevel}`;
    },

    renderCardResult(cardId) {
        const card = this.cards.find(c => c.id === cardId);
        const el   = document.getElementById("charmResult_" + cardId);
        if (!card || !el) return;

        const cost = this.costBetween(card.curLevel, card.curStep, card.tgtLevel, card.tgtStep);
        const mult = card.count;

        const row = (label, value, color) => `
            <div style="display:flex; justify-content:space-between; align-items:center;
                        padding:7px 0; font-size:13px;
                        border-bottom:1px solid rgba(255,255,255,0.05);">
                <span style="color:#b5c3d7;">${label} × ${mult}</span>
                <span style="color:${color}; font-weight:700;">${this.nf(value * mult)}</span>
            </div>`;

        el.innerHTML = `
            ${row(this.T("charmsGuide"),   cost.guide,   "#ffffff")}
            ${row(this.T("charmsDesign"),  cost.design,  "#ffcc00")}
            ${cost.secrets > 0 ? row(this.T("charmsSecrets"), cost.secrets, "#f43f5e") : ""}
        `;
    },

    // ── Grand total ───────────────────────────────────────────────────────────

    recalculateAll() {
        const grand = { guide: 0, design: 0, secrets: 0 };

        this.cards.forEach(card => {
            const cost = this.costBetween(card.curLevel, card.curStep, card.tgtLevel, card.tgtStep);
            grand.guide   += cost.guide   * card.count;
            grand.design  += cost.design  * card.count;
            grand.secrets += cost.secrets * card.count;
            this.renderCardResult(card.id);
        });

        const totalPanel = document.getElementById("charmsGrandTotal");
        const gGuide     = document.getElementById("grand_guide");
        const gDesign    = document.getElementById("grand_design");
        const gSecrets   = document.getElementById("grand_secrets");

        if (totalPanel) totalPanel.style.display = this.cards.length > 0 ? "block" : "none";
        if (gGuide)   gGuide.textContent   = this.nf(grand.guide);
        if (gDesign)  gDesign.textContent  = this.nf(grand.design);
        if (gSecrets) gSecrets.textContent = this.nf(grand.secrets);

        this.updateGroupCounts();
    },

    // ── Update group visibility and counts ────────────────────────────────────

    updateGroupCounts() {
        ["inf", "lanc", "mark"].forEach(type => {
            const groupSection = document.getElementById("charmsGroup_" + type);
            const groupCards = document.getElementById("charmsGroupCards_" + type);
            const countBadge = document.getElementById("groupCount_" + type);

            const typeCards = this.cards.filter(c => c.type === type);
            const hasCards = typeCards.length > 0;

            if (groupSection) {
                groupSection.style.display = hasCards ? "block" : "none";
            }

            if (countBadge) {
                const cardWord = typeCards.length === 1 ? this.T("charmsCard") : this.T("charmsCards");
                countBadge.textContent = typeCards.length + " " + cardWord;
            }
        });
    },

    // ── Button state management ───────────────────────────────────────────────

    updateAllButtons() {
        ["inf", "lanc", "mark"].forEach(type => {
            const btn        = document.getElementById("charmBtn_" + type);
            const labelEl    = document.getElementById("charmSlotLabel_" + type);
            if (!btn) return;

            const cardCount  = this.cardCountForType(type);
            const usedSlots  = this.usedCountForType(type);
            const freeSlots  = this.MAX_PER_TYPE - usedSlots;
            const atCardMax  = cardCount >= this.MAX_CARDS_PER_TYPE;
            const noSlots    = freeSlots <= 0;
            const disabled   = atCardMax || noSlots;

            // Display available card slots (max 2 per type), not charm slots
            const freeCardSlots = this.MAX_CARDS_PER_TYPE - cardCount;

            btn.classList.toggle("disabled-btn", disabled);

            if (labelEl) {
                if (disabled && atCardMax) {
                    labelEl.textContent = this.T("charmsMaxReached");
                } else {
                    labelEl.textContent = freeCardSlots + " " + this.T("charmsAvailable");
                }
            }
        });
    },

    // ── Persistence ───────────────────────────────────────────────────────────

    saveData() {
        Storage.set("charms", {
            cards:  this.cards,
            nextId: this.nextId
        });
    },

    loadData() {
        const saved = Storage.get("charms");
        if (!saved || !saved.cards) return;

        this.cards  = saved.cards;
        this.nextId = saved.nextId || (this.cards.length + 1);

        // Re-render all saved cards
        this.cards.forEach(card => this.renderCard(card.id));
    }
};

window.CharmsManager = CharmsManager;