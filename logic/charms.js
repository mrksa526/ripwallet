// =========================
// CHARMS UPGRADE CALCULATOR
// One charm configurator per troop type + quantity (1-6) + "Add to Total".
// Direct level-based costs (0-16), no steps. Data source: chief_Gear_Charm.json
// =========================
// =========================
// CHARM MATERIAL ICONS
// =========================
window.__charmMatImg_secrets = "assets/charms/charmMatImg_secrets.png";
window.__charmMatImg_guide = "assets/charms/charmMatImg_guide.png";
window.__charmMatImg_design = "assets/charms/charmMatImg_design.png";


const CharmsManager = {

    // ── State ─────────────────────────────────────────────────────────────────
    // draft[type] = { cur, tgt, qty }  (the configurator currently being edited)
    // added[type]  = array of { id, cur, tgt, qty } locked-in entries
    draft: { inf: null, lanc: null, mark: null },
    added: { inf: [], lanc: [], mark: [] },
    nextEntryId: 1,
    activeType: "inf",

    TYPE_COLOR_CLASSES: { inf: "inf-color", lanc: "lanc-color", mark: "mark-color" },

    get MAX_TOTAL_QTY() { return window.CHARM_MAX_PER_TYPE || 6; },
    get MIN_LEVEL() { return window.CHARM_MIN_LEVEL || 0; },
    get MAX_LEVEL() { return window.CHARM_MAX_LEVEL || 16; },

    // ── Entry point ───────────────────────────────────────────────────────────

    init() {
        Renderers.renderCharmsView();
        this.resetDrafts();
        this.added = { inf: [], lanc: [], mark: [] };
        this.nextEntryId = 1;
        this.loadData();
        this.selectType(this.activeType);
        ["inf", "lanc", "mark"].forEach(t => this.renderTroopContainer(t));
        this.recalculateAll();
    },

    resetDrafts() {
        ["inf", "lanc", "mark"].forEach(type => {
            this.draft[type] = { cur: 0, tgt: 1, qty: 1 };
        });
    },

    // ── Helpers ───────────────────────────────────────────────────────────────

    T(key) { return I18N.t(key) || key; },
    nf(n) { return (!n && n !== 0) ? "0" : Math.round(n).toLocaleString(); },

    levelIcon(type, level) {
        const folder = window.charmLevelIcons;
        if (!folder || !folder[type]) return "";
        const lvl = Math.max(1, level);
        return folder[type][lvl] || "";
    },

    // Badge icon = highest Target among that troop's added entries (falls
    // back to the draft's target, then level 1, if nothing added yet).
    badgeIconFor(type) {
        const entries = this.added[type] || [];
        let maxTgt = entries.reduce((m, e) => Math.max(m, e.tgt), 0);
        if (maxTgt === 0 && this.draft[type]) maxTgt = this.draft[type].tgt;
        return this.levelIcon(type, maxTgt > 0 ? maxTgt : 1);
    },

    costForLevel(level) {
        const rows = window.charmLevels;
        if (!rows || !rows[level]) return { design: 0, guide: 0, secret: 0, power: 0 };
        const [design, guide, secret, , power] = rows[level];
        return { design, guide, secret, power };
    },

    cumulativeCost(level) {
        const total = { design: 0, guide: 0, secret: 0, power: 0 };
        for (let lv = 1; lv <= level; lv++) {
            const c = this.costForLevel(lv);
            total.design += c.design;
            total.guide += c.guide;
            total.secret += c.secret;
            total.power += c.power;
        }
        return total;
    },

    costBetween(curLevel, tgtLevel) {
        const cur = this.cumulativeCost(curLevel);
        const tgt = this.cumulativeCost(tgtLevel);
        return {
            design: Math.max(0, tgt.design - cur.design),
            guide: Math.max(0, tgt.guide - cur.guide),
            secret: Math.max(0, tgt.secret - cur.secret),
            power: Math.max(0, tgt.power - cur.power)
        };
    },

    usedQty(type) {
        return (this.added[type] || []).reduce((s, e) => s + e.qty, 0);
    },

    // ── Troop selector ───────────────────────────────────────────────────────

    selectType(type) {
        this.activeType = type;
        ["inf", "lanc", "mark"].forEach(t => {
            const badge = document.getElementById("charmBadge_" + t);
            if (badge) badge.classList.toggle("charm-badge-active", t === type);
            const panel = document.getElementById("charmsGroupPanel_" + t);
            if (panel) panel.style.display = (t === type) ? "" : "none";
        });
        this.saveData();
    },

    refreshBadgeIcon(type) {
        const img = document.getElementById("charmBadgeImg_" + type);
        if (img) img.src = this.badgeIconFor(type);
    },

    // ── Render the troop container (configurator + added list) ─────────────────

    renderTroopContainer(type) {
        const area = document.getElementById("charmsGroupCards_" + type);
        if (!area) return;
        const clrCl = this.TYPE_COLOR_CLASSES[type];
        const d = this.draft[type];
        const used = this.usedQty(type);
        const remaining = Math.max(0, this.MAX_TOTAL_QTY - used);
        const canAdd = remaining > 0 && d.tgt >= d.cur;

        const cost = this.costBetween(d.cur, d.tgt);

        area.innerHTML = `
            <div class="charm-container ${clrCl}">
                <div class="charm-configurator">
                    <img class="charm-config-icon" src="${this.levelIcon(type, d.tgt)}" alt="">
                    <div class="charm-config-selectors">
                        ${this.buildLevelDropdown(type, "cur", d.cur, this.MIN_LEVEL, this.MAX_LEVEL)}
                        <span class="charm-slot-arrow">➔</span>
                        ${this.buildLevelDropdown(type, "tgt", d.tgt, d.cur, this.MAX_LEVEL)}
                        ${this.buildQtyDropdown(type, d.qty, remaining)}
                    </div>
                </div>
                <div class="charm-config-result">
                    <span>${this.T("charmsDesign")}: <b>${this.nf(cost.design * d.qty)}</b></span>
                    <span>${this.T("charmsGuide")}: <b>${this.nf(cost.guide * d.qty)}</b></span>
                    <span>${this.T("charmsSecrets")}: <b>${this.nf(cost.secret * d.qty)}</b></span>
                    <span class="charm-slot-power">+${this.nf(cost.power * d.qty)} ${this.T("power")}</span>
                </div>
                <button class="charms-add-to-total-btn" ${canAdd ? "" : "disabled"} onclick="CharmsManager.addToTotal('${type}')">
                    + ${this.T("charmsAddToTotal")}
                </button>
                <div class="charm-capacity-note">${used} / ${this.MAX_TOTAL_QTY} ${this.T("charmsCharmsUsed")}</div>

                ${this.added[type].length ? `
                <div class="charm-added-list">
                    ${this.added[type].map(e => `
                        <div class="charm-added-row">
                            <img src="${this.levelIcon(type, e.tgt)}" alt="">
                            <span>${this.T("charmsLevel")} ${e.cur} ➔ ${this.T("charmsLevel")} ${e.tgt} × ${e.qty}</span>
                            <button class="charm-remove-btn" onclick="CharmsManager.removeEntry('${type}',${e.id})">✕</button>
                        </div>
                    `).join("")}
                </div>` : ""}
            </div>
        `;
    },

    buildLevelDropdown(type, mode, selected, min, max) {
        const options = [];
        for (let lv = min; lv <= max; lv++) {
            options.push(`<div class="gear-custom-option ${lv === selected ? "active" : ""}" data-value="${lv}"
                onclick="CharmsManager.setDraftLevel('${type}','${mode}',this.dataset.value)">${this.T("charmsLevel")} ${lv}</div>`);
        }
        return `
            <div class="gear-select-wrapper charm-mini-select">
                <div class="gear-custom-trigger" onclick="CharmsManager.toggleDD(this)">
                    <span class="gear-selected-text">${selected}</span>
                    <svg class="gear-chevron-icon" width="10" height="10" viewBox="0 0 24 24"
                         fill="none" stroke="#4fc3ff" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <div class="gear-custom-dropdown-menu">${options.join("")}</div>
            </div>`;
    },

    buildQtyDropdown(type, selected, remaining) {
        const max = Math.max(1, remaining);
        const options = [];
        for (let q = 1; q <= max; q++) {
            options.push(`<div class="gear-custom-option ${q === selected ? "active" : ""}" data-value="${q}"
                onclick="CharmsManager.setDraftQty('${type}',this.dataset.value)">${q}</div>`);
        }
        return `
            <div class="gear-select-wrapper charm-mini-select charm-qty-select">
                <div class="gear-custom-trigger" onclick="CharmsManager.toggleDD(this)">
                    <span class="gear-selected-text">×${selected}</span>
                    <svg class="gear-chevron-icon" width="10" height="10" viewBox="0 0 24 24"
                         fill="none" stroke="#4fc3ff" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <div class="gear-custom-dropdown-menu">${options.join("")}</div>
            </div>`;
    },

    toggleDD(triggerEl) {
        const menu = triggerEl.nextElementSibling;
        const isOpen = menu.classList.contains("show");
        document.querySelectorAll(".gear-custom-dropdown-menu.show").forEach(m => m.classList.remove("show"));
        document.querySelectorAll(".gear-custom-trigger.open").forEach(t => t.classList.remove("open"));
        if (!isOpen) {
            menu.classList.add("show");
            triggerEl.classList.add("open");
        }
    },

    // ── Draft editing (with Target > Current always enforced) ──────────────────

    setDraftLevel(type, mode, value) {
        const val = parseInt(value, 10);
        const d = this.draft[type];
        if (mode === "cur") {
            d.cur = val;
            if (d.tgt < d.cur) d.tgt = d.cur;
        } else {
            d.tgt = val;
            if (d.cur > d.tgt) d.cur = d.tgt;
        }
        this.renderTroopContainer(type);
    },

    setDraftQty(type, value) {
        this.draft[type].qty = parseInt(value, 10);
        this.renderTroopContainer(type);
    },

    // ── Add to Total ─────────────────────────────────────────────────────────

    addToTotal(type) {
        const d = this.draft[type];
        const used = this.usedQty(type);
        const remaining = this.MAX_TOTAL_QTY - used;
        if (remaining <= 0 || d.tgt < d.cur) return;

        const qty = Math.min(d.qty, remaining);
        this.added[type].push({ id: this.nextEntryId++, cur: d.cur, tgt: d.tgt, qty });

        // Reset the draft for the next configuration
        this.draft[type] = { cur: 0, tgt: 1, qty: 1 };

        this.renderTroopContainer(type);
        this.refreshBadgeIcon(type);
        this.recalculateAll();
        this.saveData();
    },

    removeEntry(type, id) {
        this.added[type] = this.added[type].filter(e => e.id !== id);
        this.renderTroopContainer(type);
        this.refreshBadgeIcon(type);
        this.recalculateAll();
        this.saveData();
    },

    // ── Totals ───────────────────────────────────────────────────────────────

    recalculateAll() {
        const grand = { design: 0, guide: 0, secret: 0, power: 0 };
        ["inf", "lanc", "mark"].forEach(type => {
            this.added[type].forEach(e => {
                const c = this.costBetween(e.cur, e.tgt);
                grand.design += c.design * e.qty;
                grand.guide += c.guide * e.qty;
                grand.secret += c.secret * e.qty;
                grand.power += c.power * e.qty;
            });
        });
        this._lastGrandTotal = grand;

        const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = this.nf(val); };
        set("charmGrand_design", grand.design);
        set("charmGrand_guide", grand.guide);
        set("charmGrand_secret", grand.secret);
        set("charmGrand_power", grand.power);
    },

    resetAll() {
        this.resetDrafts();
        this.added = { inf: [], lanc: [], mark: [] };
        ["inf", "lanc", "mark"].forEach(type => {
            this.renderTroopContainer(type);
            this.refreshBadgeIcon(type);
        });
        this.recalculateAll();
        this.saveData();
    },

    copyTotal() {
        const g = this._lastGrandTotal || { design: 0, guide: 0, secret: 0, power: 0 };
        const text = [
            `${this.T("charmsTotal")}`,
            `${this.T("charmsGuide")}: ${this.nf(g.guide)}`,
            `${this.T("charmsDesign")}: ${this.nf(g.design)}`,
            `${this.T("charmsSecrets")}: ${this.nf(g.secret)}`,
            `${this.T("power")}: +${this.nf(g.power)}`
        ].join("\n");

        const done = () => {
            const btn = document.getElementById("charmsCopyBtn");
            if (!btn) return;
            const original = btn.innerHTML;
            btn.innerHTML = "✅";
            setTimeout(() => btn.innerHTML = original, 1200);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done).catch(done);
        } else {
            const ta = document.createElement("textarea");
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand("copy"); } catch (e) {}
            document.body.removeChild(ta);
            done();
        }
    },

    // ── Persistence ───────────────────────────────────────────────────────────

    saveData() {
        Storage.set("charms", { added: this.added, activeType: this.activeType });
    },

    loadData() {
        const data = Storage.get("charms");
        if (!data || !data.added) return;
        ["inf", "lanc", "mark"].forEach(type => {
            if (Array.isArray(data.added[type])) this.added[type] = data.added[type];
        });
        this.nextEntryId = Math.max(1, ...Object.values(this.added).flat().map(e => e.id + 1), 1);
        this.activeType = data.activeType || "inf";
        ["inf", "lanc", "mark"].forEach(t => this.refreshBadgeIcon(t));
    }
};

window.CharmsManager = CharmsManager;