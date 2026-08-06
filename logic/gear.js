window.__gearImg_helmet = "assets/icons/gearImg_helmet.png";
window.__gearImg_coat = "assets/icons/gearImg_coat.png";
window.__gearImg_watch = "assets/icons/gearImg_watch.png";
window.__gearImg_pants = "assets/icons/gearImg_pants.png";
window.__gearImg_ring = "assets/icons/gearImg_ring.png";
window.__gearImg_cane = "assets/icons/gearImg_cane.png";
// =========================
// =========================
// GEAR RARITY ICONS (icon changes by quality/rarity, not tier/star)
// For 'red' (Legendary) this set only applies from Tier 4 onward —
// Tier 0-3 keep the original static piece icon.
// =========================
window.__gearRarityImg = {
    green: { helmet: "assets/icons/green_helmet.png", coat: "assets/icons/green_coat.png", watch: "assets/icons/green_watch.png", pants: "assets/icons/green_pants.png", ring: "assets/icons/green_ring.png", cane: "assets/icons/green_cane.png" },
    blue: { helmet: "assets/icons/blue_helmet.png", coat: "assets/icons/blue_coat.png", watch: "assets/icons/blue_watch.png", pants: "assets/icons/blue_pants.png", ring: "assets/icons/blue_ring.png", cane: "assets/icons/blue_cane.png" },
    purple: { helmet: "assets/icons/purple_helmet.png", coat: "assets/icons/purple_coat.png", watch: "assets/icons/purple_watch.png", pants: "assets/icons/purple_pants.png", ring: "assets/icons/purple_ring.png", cane: "assets/icons/purple_cane.png" },
    gold: { helmet: "assets/icons/gold_helmet.png", coat: "assets/icons/gold_coat.png", watch: "assets/icons/gold_watch.png", pants: "assets/icons/gold_pants.png", ring: "assets/icons/gold_ring.png", cane: "assets/icons/gold_cane.png" },
    red: { helmet: "assets/icons/red_helmet.png", coat: "assets/icons/red_coat.png", watch: "assets/icons/red_watch.png", pants: "assets/icons/red_pants.png", ring: "assets/icons/red_ring.png", cane: "assets/icons/red_cane.png" },
};// =========================
// GEAR UPGRADE CALCULATOR
// =========================


// Gear piece icon helper — uses embedded base64 if available, falls back to asset path
function _gearIcon(name) {
    const key = "window.__gearImg_" + name;
    return window["__gearImg_" + name] || ("assets/gear/" + name + ".png");
}

const GEAR_PIECES = [{
    id: 1,
    nameKey: "helmet",
    get iconPath() {
        return _gearIcon("helmet");
    }
}, {
    id: 3,
    nameKey: "watch",
    get iconPath() {
        return _gearIcon("watch");
    }
}, {
    id: 2,
    nameKey: "coat",
    get iconPath() {
        return _gearIcon("coat");
    }
}, {
    id: 4,
    nameKey: "pants",
    get iconPath() {
        return _gearIcon("pants");
    }
}, {
    id: 5,
    nameKey: "ring",
    get iconPath() {
        return _gearIcon("ring");
    }
}, {
    id: 6,
    nameKey: "cane",
    get iconPath() {
        return _gearIcon("cane");
    }
}];

const GearManager = {
    // Per-slot state: { current: {q,t,s}, target: {q,t,s} }
    data: {},
    activeSlot: null,

    // ─── Sequence helpers ───────────────────────────────────────────────────
    // gearSequence is a flat, ordered array of every {q,t,s} stop across all
    // qualities/tiers/stars. Index N = cumulative position N in the overall
    // upgrade path (green tier0 star0 first, red max tier/star last).

    seqIndex(q, t, s) {
        const seq = window.gearSequence || [];
        for (let i = 0; i < seq.length; i++) {
            if (seq[i].q === q && seq[i].t === t && seq[i].s === s) return i;
        }
        return 0;
    },

    cumulativeAt(index) {
        const seq = window.gearSequence || [];
        const total = { alloy: 0, solution: 0, plans: 0, amber: 0, power: 0 };
        for (let i = 0; i <= index && i < seq.length; i++) {
            total.alloy += seq[i].alloy;
            total.solution += seq[i].solution;
            total.plans += seq[i].plans;
            total.amber += seq[i].amber;
            total.power += seq[i].power;
        }
        return total;
    },

    costBetween(cur, tgt) {
        const ci = this.seqIndex(cur.q, cur.t, cur.s);
        const ti = this.seqIndex(tgt.q, tgt.t, tgt.s);
        const curTotal = this.cumulativeAt(ci);
        const tgtTotal = this.cumulativeAt(ti);
        return {
            alloy: Math.max(0, tgtTotal.alloy - curTotal.alloy),
            solution: Math.max(0, tgtTotal.solution - curTotal.solution),
            plans: Math.max(0, tgtTotal.plans - curTotal.plans),
            amber: Math.max(0, tgtTotal.amber - curTotal.amber),
            power: Math.max(0, tgtTotal.power - curTotal.power)
        };
    },

    qualityLabel(q) {
        return this._t("gearQuality_" + q, q.charAt(0).toUpperCase() + q.slice(1));
    },

    // ─── Translation helpers ──────────────────────────────────────────────────

    _t(key, fallback = "") {
        return I18N.t(key) || fallback;
    },

    // ─── Init ─────────────────────────────────────────────────────────────────

    initDefaultData() {
        GEAR_PIECES.forEach(p => {
            this.data[p.id] = {
                current: { q: "green", t: 0, s: 0 },
                target: { q: "green", t: 0, s: 0 }
            };
        });
    },

    // Piece.nameKey -> troop abbreviation (inf/lanc/mark), shared by grid + Select All
    // Icon changes by RARITY (quality), not tier/star — except Legendary
    // (red), which keeps the original static icon through Tier 0-3 and only
    // switches to the new glow art from Tier 4 onward.
    iconForPieceQuality(piece, quality, tier) {
        if (quality === "red" && tier < 4) {
            return piece.iconPath;
        }
        const set = window.__gearRarityImg && window.__gearRarityImg[quality];
        return (set && set[piece.nameKey]) || piece.iconPath;
    },

    pieceTroopMap() {
        const troopAbbrev = { infantry: "inf", lancer: "lanc", marksman: "mark" };
        const nameKeyToDataKey = { helmet: "cap", coat: "coat", watch: "watch", pants: "pants", ring: "ring", cane: "weapon" };
        const slotsByTroop = window.gearSlotsByTroop || {};
        const dataKeyTroop = {};
        Object.keys(slotsByTroop).forEach(troop => {
            const abbrev = troopAbbrev[troop] || troop;
            slotsByTroop[troop].forEach(pieceKey => { dataKeyTroop[pieceKey] = abbrev; });
        });
        const map = {};
        GEAR_PIECES.forEach(p => {
            const dataKey = nameKeyToDataKey[p.nameKey] || p.nameKey;
            map[p.id] = dataKeyTroop[dataKey] || "inf";
        });
        return map;
    },

    // ─── Render grid ─────────────────────────────────────────────────────────

    renderGearGrid() {
        const grid = document.getElementById("gear_items_grid");
        if (!grid) return;
        if (!this.data || !Object.keys(this.data).length) this.initDefaultData();

        const troopColor = { inf: "#5fe016", lanc: "#3fb6ff", mark: "#ffb020" };
        const pieceTroopById = this.pieceTroopMap();

        const cardHtml = (p) => {
            const troop = pieceTroopById[p.id] || "inf";
            const color = troopColor[troop] || "#4fc3ff";
            const isActive = this.activeSlot === p.id;
            const st = this.data[p.id];
            const starTxt = st.target.s === 0 ? this._t("noStars", "No Stars") : "⭐".repeat(st.target.s);
            const label = st ? `${this.qualityLabel(st.target.q)} · ${this._t("tier", "Tier")} ${st.target.t} · ${starTxt}` : "—";
            const troopKey = "troop" + troop.charAt(0).toUpperCase() + troop.slice(1);

            return `
            <div class="gear-slot-card ${isActive ? "gear-slot-active" : ""}" id="gearSlotCard_${p.id}"
                 style="--slot-color:${color};" onclick="GearManager.toggleSlot(${p.id})">
                <img class="gear-slot-icon" src="${this.iconForPieceQuality(p, st.target.q, st.target.t)}" alt="">
                <div class="gear-slot-name">${this._t(p.nameKey, p.nameKey)}</div>
                <div class="gear-slot-troop" style="color:${color};">${this._t(troopKey, troop)}</div>
                <div class="gear-slot-current">${label}</div>
            </div>`;
        };

        // Build the grid row by row (2 pieces per row). If the active slot
        // belongs to this row, the config panel is inserted right after it,
        // full-width — everything below naturally reflows down to make room.
        let html = "";
        for (let i = 0; i < GEAR_PIECES.length; i += 2) {
            const left = GEAR_PIECES[i];
            const right = GEAR_PIECES[i + 1];
            html += cardHtml(left);
            if (right) html += cardHtml(right);

            const rowHasActive = (left && this.activeSlot === left.id) || (right && this.activeSlot === right.id);
            if (rowHasActive) {
                html += `<div class="gear-config-panel gear-config-panel-inline" id="gearConfigPanel"></div>`;
            }
        }
        grid.innerHTML = html;

        if (this.activeSlot) {
            this.renderConfigPanel(this.activeSlot);
        }
    },

    toggleSlot(id) {
        this.activeSlot = (this.activeSlot === id) ? null : id;
        this._selectAllClicks = 0;
        this.renderGearGrid();
    },

    // Select All: 1st click -> apply the active slot's Target to every piece
    // of the same troop type. 2nd (and further) click -> apply it to every
    // piece across all troop types.
    selectAll() {
        if (!this.activeSlot || !this.data[this.activeSlot]) return;
        const targetPos = { ...this.data[this.activeSlot].target };
        const pieceTroopById = this.pieceTroopMap();
        const activeTroop = pieceTroopById[this.activeSlot];

        this._selectAllClicks = (this._selectAllClicks || 0) + 1;
        const applyToAll = this._selectAllClicks >= 2;

        GEAR_PIECES.forEach(p => {
            if (!applyToAll && pieceTroopById[p.id] !== activeTroop) return;
            this.data[p.id].target = { ...targetPos };
            this.enforceOrdering(p.id);
        });

        this.renderGearGrid();
        if (this.activeSlot) this.renderConfigPanel(this.activeSlot);
        this.calculateTotalCosts();
        this.saveData();
    },

    // ─── Config panel (current/target quality+tier+star selectors) ────────────

    renderConfigPanel(id) {
        const panel = document.getElementById("gearConfigPanel");
        if (!panel) return;
        const piece = GEAR_PIECES.find(p => p.id === id);
        const st = this.data[id];
        panel.style.display = "";

        panel.innerHTML = `
            <div class="gear-config-header">
                <img src="${this.iconForPieceQuality(piece, st.target.q, st.target.t)}" alt="" style="width:32px;height:32px;object-fit:contain;">
                <span>${this._t(piece.nameKey, piece.nameKey)}</span>
            </div>
            <div class="gear-config-grid">
                <div class="gear-config-col">
                    <label class="gear-select-label">${this._t("current", "Current")}</label>
                    ${this.buildSelector(id, "current", st.current)}
                </div>
                <div class="gear-config-col">
                    <label class="gear-select-label">${this._t("target", "Target")}</label>
                    ${this.buildSelector(id, "target", st.target)}
                </div>
            </div>
            <div class="gear-config-result" id="gearResult_${id}"></div>
        `;
        this.renderSlotResult(id);
    },

    buildSelector(id, mode, pos) {
        const qualities = window.GEAR_QUALITY_ORDER || [];
        const qOptions = qualities.map(q =>
            `<div class="gear-custom-option ${q === pos.q ? "active" : ""}" data-value="${q}"
                  onclick="GearManager.changeQuality(${id},'${mode}',this.dataset.value)">${this.qualityLabel(q)}</div>`
        ).join("");

        const tierCount = (window.gearData[pos.q] || { tiers: [] }).tiers.length;
        const tOptions = Array.from({ length: tierCount }, (_, i) =>
            `<div class="gear-custom-option ${i === pos.t ? "active" : ""}" data-value="${i}"
                  onclick="GearManager.changeTier(${id},'${mode}',this.dataset.value)">${this._t("tier", "Tier")} ${i}</div>`
        ).join("");

        // Stars: the data holds up to 4 stages per tier, but in-game max is 3
        // real stars — stage 0 = "No Stars" (tier entry), stages 1-3 = ⭐1-⭐3.
        const starCount = ((window.gearData[pos.q] || { tiers: [[]] }).tiers[pos.t] || []).length;
        const starLabel = i => i === 0 ? this._t("noStars", "No Stars") : "⭐".repeat(i) + " " + i;
        const sOptions = Array.from({ length: starCount }, (_, i) =>
            `<div class="gear-custom-option ${i === pos.s ? "active" : ""}" data-value="${i}"
                  onclick="GearManager.changeStar(${id},'${mode}',this.dataset.value)">${starLabel(i)}</div>`
        ).join("");

        const selQ = this.qualityLabel(pos.q);
        const selT = `${this._t("tier", "Tier")} ${pos.t}`;
        const selS = starLabel(pos.s);

        const dd = (key, menuHtml, selectedText) => `
            <div class="gear-select-wrapper">
                <div class="gear-custom-trigger" onclick="GearManager.toggleDD(this)">
                    <span class="gear-selected-text">${selectedText}</span>
                    <svg class="gear-chevron-icon" width="12" height="12" viewBox="0 0 24 24"
                         fill="none" stroke="#4fc3ff" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <div class="gear-custom-dropdown-menu">${menuHtml}</div>
            </div>`;

        return dd("q", qOptions, selQ) + dd("t", tOptions, selT) + dd("s", sOptions, selS);
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

    // Keeps Target strictly ahead of Current in the overall upgrade sequence.
    // If a change would make Target <= Current, Target is bumped forward to
    // the very next stop in the sequence.
    enforceOrdering(id) {
        const st = this.data[id];
        const ci = this.seqIndex(st.current.q, st.current.t, st.current.s);
        const ti = this.seqIndex(st.target.q, st.target.t, st.target.s);
        // Target may equal Current (cost = 0) but must never fall behind it.
        if (ti < ci) {
            const seq = window.gearSequence || [];
            const stop = seq[ci];
            if (stop) {
                st.target.q = stop.q;
                st.target.t = stop.t;
                st.target.s = stop.s;
            }
        }
    },

    changeQuality(id, mode, q) {
        const pos = this.data[id][mode];
        pos.q = q;
        pos.t = 0;
        pos.s = 0;
        this.enforceOrdering(id);
        this.renderConfigPanel(id);
        this.renderGearGrid();
        this.calculateTotalCosts();
        this.saveData();
    },

    changeTier(id, mode, t) {
        const pos = this.data[id][mode];
        pos.t = parseInt(t, 10);
        pos.s = 0;
        this.enforceOrdering(id);
        this.renderConfigPanel(id);
        this.renderGearGrid();
        this.calculateTotalCosts();
        this.saveData();
    },

    changeStar(id, mode, s) {
        const pos = this.data[id][mode];
        pos.s = parseInt(s, 10);
        this.enforceOrdering(id);
        this.renderConfigPanel(id);
        this.renderGearGrid();
        this.calculateTotalCosts();
        this.saveData();
    },

    nf(n) {
        if (!n && n !== 0) return "0";
        return Math.round(n).toLocaleString();
    },

    renderSlotResult(id) {
        const el = document.getElementById("gearResult_" + id);
        if (!el) return;
        const st = this.data[id];
        const cost = this.costBetween(st.current, st.target);
        el.innerHTML = `
            <div class="gear-result-row"><span>${this._t("alloy", "Alloy")}</span><b>${this.nf(cost.alloy)}</b></div>
            <div class="gear-result-row"><span>${this._t("polishSolution", "Polishing Solution")}</span><b>${this.nf(cost.solution)}</b></div>
            <div class="gear-result-row"><span>${this._t("designPlans", "Design Plans")}</span><b>${this.nf(cost.plans)}</b></div>
            <div class="gear-result-row"><span>${this._t("lunarAmber", "Lunar Amber")}</span><b>${this.nf(cost.amber)}</b></div>
            <div class="gear-result-row gear-result-power"><span>${this._t("power", "Power")}</span><b>+${this.nf(cost.power)}</b></div>
        `;
    },

    // ─── Grand totals ───────────────────────────────────────────────────────

    calculateTotalCosts() {
        const grand = { alloy: 0, solution: 0, plans: 0, amber: 0 };
        GEAR_PIECES.forEach(p => {
            const st = this.data[p.id];
            if (!st) return;
            const cost = this.costBetween(st.current, st.target);
            grand.alloy += cost.alloy;
            grand.solution += cost.solution;
            grand.plans += cost.plans;
            grand.amber += cost.amber;
        });
        this._lastGrandTotal = grand;

        const setBoth = (suffix, key) => {
            [`total_${suffix}`, `total_${suffix}_mobile`].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.innerText = this.nf(grand[key]);
            });
        };
        setBoth("alloy", "alloy");
        setBoth("solution", "solution");
        setBoth("plans", "plans");
        setBoth("amber", "amber");
    },

    copyTotal() {
        const g = this._lastGrandTotal || { alloy: 0, solution: 0, plans: 0, amber: 0 };
        const text = [
            this._t("totalResources", "Total Resources Required"),
            `${this._t("alloy", "Alloy")}: ${this.nf(g.alloy)}`,
            `${this._t("polishSolution", "Polishing Solution")}: ${this.nf(g.solution)}`,
            `${this._t("designPlans", "Design Plans")}: ${this.nf(g.plans)}`,
            `${this._t("lunarAmber", "Lunar Amber")}: ${this.nf(g.amber)}`
        ].join("\n");

        const done = () => {
            ["gearCopyBtn", "gearCopyBtnMobile"].forEach(id => {
                const btn = document.getElementById(id);
                if (!btn) return;
                const original = btn.innerHTML;
                btn.innerHTML = "✅";
                setTimeout(() => btn.innerHTML = original, 1200);
            });
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

    // ─── Reset ───────────────────────────────────────────────────────────────

    resetAll() {
        this.initDefaultData();
        this.activeSlot = null;
        this._selectAllClicks = 0;
        this.renderGearGrid();
        this.calculateTotalCosts();
        this.saveData();
    },

    // ─── Persistence ─────────────────────────────────────────────────────────

    saveData() {
        Storage.set("gear", { data: this.data });
    },

    loadData() {
        const saved = Storage.get("gear");
        if (saved && saved.data) {
            this.data = saved.data;
        } else {
            this.initDefaultData();
        }
    },

    // ─── Init ─────────────────────────────────────────────────────────────────

    init() {
        Renderers.renderGearView();
        this.loadData();
        this.activeSlot = null;
        this.renderGearGrid();
        this.calculateTotalCosts();
    }
};

window.GearManager = GearManager;