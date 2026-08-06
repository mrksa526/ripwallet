window.__trainImg_iron = "assets/resources/trainImg_iron.png";
window.__trainImg_meat = "assets/resources/trainImg_meat.png";
window.__trainImg_wood = "assets/resources/trainImg_wood.png";
window.__trainImg_coal = "assets/resources/trainImg_coal.png";
window.__trainImg_speeds = "assets/resources/trainImg_speeds.png";
window.__trainImg_research_inf = "assets/resources/trainImg_research_inf.png";
window.__trainImg_research_lanc = "assets/resources/trainImg_research_lanc.png";
window.__trainImg_research_mark = "assets/resources/trainImg_research_mark.png";
window.__trainImg_research_t12_mark = "assets/resources/trainImg_research_t12_mark.png";
window.__trainImg_research_t12_inf = "assets/resources/trainImg_research_t12_inf.png";
window.__trainImg_research_t12_lanc = "assets/resources/trainImg_research_t12_lanc.png";
window.__trainImg_fc7 = "assets/resources/trainImg_fc7.png";
window.__trainImg_fc5 = "assets/resources/trainImg_fc5.png";
window.__trainImg_fc6 = "assets/resources/trainImg_fc6.png";
window.__trainImg_fc8 = "assets/resources/trainImg_fc8.png";
window.__trainImg_fc9 = "assets/resources/trainImg_fc9.png";
window.__trainImg_fc10 = "assets/resources/trainImg_fc10.png";
// =========================
// TRAINING CALCULATOR
// =========================

const NumberFormat = {
    format(n) {
        if (n === null || n === undefined || n === '')
            return '';
        const cleaned = String(n).replace(/[^0-9.-]/g, '');
        const num = parseFloat(cleaned);
        if (isNaN(num))
            return '';
        // Preserve decimals when formatting
        const parts = num.toLocaleString('en-US', {
            maximumFractionDigits: 6
        }).split('.');
        return parts.join('.');
    },
    parse(str) {
        if (!str)
            return 0;
        const cleaned = String(str).replace(/[^0-9.-]/g, '');
        return parseFloat(cleaned) || 0;
    },
    setupInput(el) {
        if (!el)
            return;

        const updateRaw = () => {
            const raw = this.parse(el.value);
            el.dataset.rawValue = raw;
        }
        ;

        el.addEventListener('blur', () => {
            updateRaw();
            const raw = parseFloat(el.dataset.rawValue);
            el.value = (raw && !isNaN(raw)) ? this.format(raw) : '';
        }
        );

        el.addEventListener('focus', () => {
            const raw = el.dataset.rawValue || this.parse(el.value);
            el.value = (raw == 0) ? '' : String(raw);
        }
        );

        el.addEventListener('input', () => {
            // Allow digits, commas, dots, minus
            const val = el.value;
            const cleaned = val.replace(/[^0-9,.-]/g, '');
            if (val !== cleaned)
                el.value = cleaned;
            updateRaw();
        }
        );

        if (el.value) {
            const raw = this.parse(el.value);
            el.dataset.rawValue = raw;
            el.value = this.format(raw);
        }
    }
};

const TrainingManager = {
    activeTabId: "tab1",

    init() {
        Renderers.renderTrainingView();
        this.loadData();
        this.attachListeners();
        this.applyNumberFormatting();
        this.calculateAll();
    },

    applyNumberFormatting() {
        // Apply to all numeric inputs in training view
        document.querySelectorAll('#trainingView input[type="text"]').forEach(el => {
            if (el.id === 's2_tier')
                return;
            if (el.readOnly)
                return;
            // Don't format read-only fields
            if (el.inputMode === 'numeric' || el.getAttribute('inputmode') === 'numeric' || el.inputMode === 'decimal' || el.getAttribute('inputmode') === 'decimal') {
                NumberFormat.setupInput(el);
            }
        }
        );
    },

    attachListeners() {
        const ids = ["g_speedInf", "g_speedLanc", "g_speedMark", "c1_inf10", "c1_inf11", "c1_inf12", "c1_lanc10", "c1_lanc11", "c1_lanc12", "c1_mark10", "c1_mark11", "c1_mark12", "s2_d", "s2_h", "s2_m", "s2_tier", "s2_cap", "s2_pInf", "s2_pLanc", "s2_pMark", "u_t10_inf", "u_t11_inf", "u_t10_lanc", "u_t11_lanc", "u_t10_mark", "u_t11_mark", // Tab 4
        "s4_currentPower", "s4_targetPower", "s4_inf_t10", "s4_inf_t11", "s4_inf_t12", "s4_lanc_t10", "s4_lanc_t11", "s4_lanc_t12", "s4_mark_t10", "s4_mark_t11", "s4_mark_t12", "s4_ratioInf", "s4_ratioLanc", "s4_ratioMark"];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (!el)
                return;
            el.addEventListener("input", () => {
                this.saveData();
                this.calculateAll();
            }
            );
            el.addEventListener("change", () => {
                this.saveData();
                this.calculateAll();
            }
            );
        }
        );
    },

    switchTab(tabId, btnEl) {
        this.activeTabId = tabId;
        document.querySelectorAll(".training-tab-content").forEach(el => el.style.display = "none");
        const target = document.getElementById(tabId);
        if (target)
            target.style.display = "block";
        if (btnEl) {
            btnEl.parentElement.querySelectorAll(".gear-tab").forEach(t => t.classList.remove("active"));
            btnEl.classList.add("active");
        }
        this.calculateAll();
    },

    // ─── Generic custom dropdown (used by tier selector, FC level, research level) ─
    _initCustomDropdown(baseId) {
        const trigger = document.getElementById(`${baseId}_trigger`);
        const menu = document.getElementById(`${baseId}_menu`);
        const hiddenInput = document.getElementById(baseId);
        if (!trigger || !menu || !hiddenInput)
            return;

        trigger.addEventListener("click", e => {
            e.stopPropagation();
            document.querySelectorAll(".training-custom-dropdown-menu").forEach(m => {
                if (m !== menu)
                    m.classList.remove("show");
            }
            );
            document.querySelectorAll(".training-custom-trigger").forEach(t => {
                if (t !== trigger)
                    t.classList.remove("open");
            }
            );
            menu.classList.toggle("show");
            trigger.classList.toggle("open");
        }
        );

        menu.querySelectorAll(".training-custom-option").forEach(opt => {
            opt.addEventListener("click", e => {
                e.stopPropagation();
                const val = opt.dataset.value;
                const textEl = trigger.querySelector(".trigger-label-text");
                const iconEl = trigger.querySelector(".trigger-icon");
                if (opt.dataset.icon) {
                    if (iconEl) {
                        iconEl.src = opt.dataset.icon;
                        iconEl.style.display = "";
                    }
                    if (textEl)
                        textEl.textContent = "";
                } else {
                    if (iconEl)
                        iconEl.style.display = "none";
                    if (textEl)
                        textEl.textContent = opt.dataset.label || opt.textContent.trim();
                    else {
                        const plainSpan = trigger.querySelector("span");
                        if (plainSpan)
                            plainSpan.textContent = opt.textContent;
                    }
                }
                trigger.dataset.value = val;
                hiddenInput.value = val;
                menu.querySelectorAll(".training-custom-option").forEach(o => o.classList.remove("active"));
                opt.classList.add("active");
                menu.classList.remove("show");
                trigger.classList.remove("open");
                this.saveData();
                this.calculateAll();
            }
            );
        }
        );

        document.addEventListener("click", () => {
            menu.classList.remove("show");
            trigger.classList.remove("open");
        }
        );
    },

    // Sets a custom dropdown's value + label programmatically (used when loading saved state)
    setDropdownValue(baseId, value) {
        const hiddenInput = document.getElementById(baseId);
        const trigger = document.getElementById(`${baseId}_trigger`);
        const menu = document.getElementById(`${baseId}_menu`);
        if (!hiddenInput || !trigger || !menu)
            return;
        const opt = menu.querySelector(`.training-custom-option[data-value="${value}"]`);
        if (!opt)
            return;
        hiddenInput.value = value;
        const textEl = trigger.querySelector(".trigger-label-text");
        const iconEl = trigger.querySelector(".trigger-icon");
        if (opt.dataset.icon) {
            if (iconEl) {
                iconEl.src = opt.dataset.icon;
                iconEl.style.display = "";
            }
            if (textEl)
                textEl.textContent = "";
        } else {
            if (iconEl)
                iconEl.style.display = "none";
            if (textEl)
                textEl.textContent = opt.dataset.label || opt.textContent.trim();
            else {
                const plainSpan = trigger.querySelector("span");
                if (plainSpan)
                    plainSpan.textContent = opt.textContent;
            }
        }
        trigger.dataset.value = value;
        menu.querySelectorAll(".training-custom-option").forEach(o => o.classList.toggle("active", o === opt));
    },

    // ─── FC Level / Training Research helpers ──────────────────────────────
    getFC(type) {
        const el = document.getElementById(`fc_${type}`);
        const v = parseInt(el ? el.value : "10", 10);
        const min = window.FC_MIN_LEVEL || 5;
        const max = window.FC_MAX_LEVEL || 10;
        return (v >= min && v <= max) ? v : max;
    },

    getResearch(type) {
        const el = document.getElementById(`rs_${type}`);
        const v = parseInt(el ? el.value : "10", 10);
        const min = window.TRAINING_RESEARCH_MIN || 0;
        const max = window.TRAINING_RESEARCH_MAX || 10;
        return (v >= min && v <= max) ? v : max;
    },

    isT12Locked(type) {
        return this.getFC(type) < (window.FC_T12_UNLOCK_LEVEL || 10);
    },

    // T12 Research: separate per-troop, only meaningful/visible when FC=10.
    // Defaults to 0 (no extra reduction) so existing stored T12 costs are
    // unchanged unless the player actively raises this.
    getT12Research(type) {
        const el = document.getElementById(`t12rs_${type}`);
        const v = parseInt(el ? el.value : "0", 10);
        const min = window.T12_RESEARCH_MIN || 0;
        const max = window.T12_RESEARCH_MAX || 10;
        return (v >= min && v <= max) ? v : 0;
    },

    // Returns {wood, meat, coal, iron, time, power} for a given troop type/tier,
    // adjusted for that troop's current FC level and Training Research level.
    // - FC level only changes T10/T11 power (via fcPowerTable); T12 power is fixed.
    // - Research level only changes T11/T12 resource costs (wood/meat/coal/iron).
    getTierStats(type, tier) {
        const base = troopData[type] && troopData[type][tier];
        if (!base)
            return null;

        const stats = {
            wood: base.wood,
            meat: base.meat,
            coal: base.coal,
            iron: base.iron,
            time: base.time,
            power: base.power
        };

        const fcTable = (window.fcPowerTable && window.fcPowerTable[this.getFC(type)]) || (window.fcPowerTable && window.fcPowerTable[10]);

        if (tier === "t10") {
            if (fcTable)
                stats.power = fcTable.t10;
        } else if (tier === "t11") {
            if (fcTable)
                stats.power = fcTable.t11;
            const research = this.getResearch(type);
            const factor = 2 * (1 - 0.05 * research);
            stats.wood = base.wood * factor;
            stats.meat = base.meat * factor;
            stats.coal = base.coal * factor;
            stats.iron = base.iron * factor;
        } else if (tier === "t12") {
            const baseT11 = troopData[type].t11;
            const research = this.getResearch(type);
            const t11Factor = (1 - 0.1 * research);
            if (baseT11) {
                stats.wood = base.wood + baseT11.wood * t11Factor;
                stats.meat = base.meat + baseT11.meat * t11Factor;
                stats.coal = base.coal + baseT11.coal * t11Factor;
                stats.iron = base.iron + baseT11.iron * t11Factor;
            }
            // T12 Research applies on top, only when FC=10 (T12 unlocked)
            if (!this.isT12Locked(type)) {
                const t12Research = this.getT12Research(type);
                const t12Factor = (1 - 0.025 * t12Research);
                stats.wood *= t12Factor;
                stats.meat *= t12Factor;
                stats.coal *= t12Factor;
                stats.iron *= t12Factor;
            }
            // power stays fixed at base.power (unaffected by FC/research)
        }
        return stats;
    },

    // Greys out / disables T12-related inputs across tabs for troop types below FC10
    updateLockUI() {
        const types = ["inf", "lanc", "mark"];
        let anyUnlocked = false;
        types.forEach(type => {
            const locked = this.isT12Locked(type);
            if (!locked)
                anyUnlocked = true;
            const tooltip = locked ? I18N.t("fcT12Locked") : "";
            [`c1_${type}12`, `u_t10_${type}`, `u_t11_${type}`].forEach(id => {
                const el = document.getElementById(id);
                if (!el)
                    return;
                el.disabled = locked;
                el.title = tooltip;
                el.style.opacity = locked ? "0.35" : "";
                el.style.cursor = locked ? "not-allowed" : "";
                el.style.background = locked ? "rgba(255,255,255,0.03)" : "";
            }
            );
            const t12rsCell = document.getElementById(`t12rs_${type}_cell`);
            if (t12rsCell)
                t12rsCell.style.visibility = locked ? "hidden" : "visible";
        }
        );
        const t12rsRow = document.getElementById("t12rs_row");
        if (t12rsRow)
            t12rsRow.style.display = anyUnlocked ? "" : "none";
    },

    nf(n) {
        return Math.round(n || 0).toLocaleString('en-US');
    },

    formatTime(seconds) {
        if (!seconds || seconds <= 0)
            return "0s";
        const d = Math.floor(seconds / 86400);
        const h = Math.floor((seconds % 86400) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        const parts = [];
        if (d)
            parts.push(d + "d");
        if (h)
            parts.push(h + "h");
        if (m)
            parts.push(m + "m");
        if (s || !parts.length)
            parts.push(s + "s");
        return parts.join(" ");
    },

    calculateAll() {
        if (typeof troopData === "undefined")
            return;
        const self = this;

        const factors = {
            inf: (parseFloat(document.getElementById("g_speedInf")?.value) / 100 || 0) + 1,
            lanc: (parseFloat(document.getElementById("g_speedLanc")?.value) / 100 || 0) + 1,
            mark: (parseFloat(document.getElementById("g_speedMark")?.value) / 100 || 0) + 1
        };
        const types = ["inf", "lanc", "mark"];

        // FC Level / Training Research affect T10/T11/T12 power & costs, and
        // determine whether T12 is even reachable for a given troop type.
        this.updateLockUI();

        // ── Section 1: Requirements ───────────────────────────────────────────
        let grandS1 = {
            wood: 0,
            meat: 0,
            coal: 0,
            iron: 0,
            time: 0,
            power: 0
        };

        types.forEach(type => {
            const counts = {
                t10: NumberFormat.parse(document.getElementById(`c1_${type}10`)?.value),
                t11: NumberFormat.parse(document.getElementById(`c1_${type}11`)?.value),
                t12: NumberFormat.parse(document.getElementById(`c1_${type}12`)?.value)
            };
            const sub = {
                wood: 0,
                meat: 0,
                coal: 0,
                iron: 0,
                time: 0,
                power: 0
            };

            const t12Locked = this.isT12Locked(type);
            ["t10", "t11", "t12"].forEach(tier => {
                if (tier === "t12" && t12Locked)
                    return;
                const u = this.getTierStats(type, tier);
                const c = counts[tier];
                if (!u || !c)
                    return;
                sub.wood += c * u.wood;
                sub.meat += c * u.meat;
                sub.coal += c * u.coal;
                sub.iron += c * u.iron;
                sub.power += c * u.power;
                sub.time += c * (u.time / factors[type]);
            }
            );

            const el = document.getElementById(`res1_${type}`);
            if (el)
                el.innerHTML = this._resourceBlock(sub);

            Object.keys(grandS1).forEach(k => grandS1[k] += sub[k]);
        }
        );

        // ── Section 2: Speedups → Troops ─────────────────────────────────────
        const totalSecs = ((NumberFormat.parse(document.getElementById("s2_d")?.value)) * 86400) + ((NumberFormat.parse(document.getElementById("s2_h")?.value)) * 3600) + ((NumberFormat.parse(document.getElementById("s2_m")?.value)) * 60);
        const s2Tier = document.getElementById("s2_tier")?.value || "t11";
        const cap = NumberFormat.parse(document.getElementById("s2_cap")?.value) || 1;
        const percs = {
            inf: NumberFormat.parse(document.getElementById("s2_pInf")?.value) || 0,
            lanc: NumberFormat.parse(document.getElementById("s2_pLanc")?.value) || 0,
            mark: NumberFormat.parse(document.getElementById("s2_pMark")?.value) || 0
        };
        let grandS2 = {
            wood: 0,
            meat: 0,
            coal: 0,
            iron: 0,
            time: 0,
            power: 0,
            totalTroops: 0
        };

        if (troopData.inf[s2Tier]) {
            const avgTime = types.reduce( (sum, type) => {
                const stats = this.getTierStats(type, s2Tier);
                return sum + (percs[type] / 100) * ((stats ? stats.time : 0) / factors[type]);
            }
            , 0);
            const totalTroops = avgTime > 0 ? totalSecs / avgTime : 0;
            grandS2.totalTroops = totalTroops;

            types.forEach(type => {
                const locked = s2Tier === "t12" && this.isT12Locked(type);
                const count = locked ? 0 : Math.floor(totalTroops * (percs[type] / 100));
                const u = this.getTierStats(type, s2Tier);
                const sub = {
                    wood: count * u.wood,
                    meat: count * u.meat,
                    coal: count * u.coal,
                    iron: count * u.iron,
                    power: count * u.power,
                    time: count * (u.time / factors[type])
                };
                const campCount = cap > 0 ? Math.ceil(count / cap) : 0;
                const el = document.getElementById(`res2_${type}`);
                if (el) {
                    el.innerHTML = `
                        <div class="res-row" style="display:flex;justify-content:space-between;margin:6px 0;font-size:14px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:6px;">
                            <span style="font-weight:700;color:#fff;">${s2Tier.toUpperCase()} ${I18N.t("units")}</span>
                            <span style="color:#ffcc00;font-weight:800;">${this.nf(count)}</span>
                        </div>
                        <div class="res-row" style="display:flex;justify-content:space-between;margin:6px 0;font-size:13px;">
                            <span style="color:#b5c3d7;">${I18N.t("campFill")}</span>
                            <span style="color:#22c55e;font-weight:700;">${this.nf(campCount)}</span>
                        </div>
                    ` + this._resourceBlock(sub);
                }
                Object.keys(grandS2).filter(k => k !== "totalTroops").forEach(k => grandS2[k] += sub[k]);
            }
            );
        }

        // ── Section 3: Upgrade T10/T11 → T12 ────────────────────────────────
        let grandS3 = {
            wood: 0,
            meat: 0,
            coal: 0,
            iron: 0,
            time: 0,
            power: 0
        };

        types.forEach(type => {
            const t12Locked = this.isT12Locked(type);
            const t10Count = t12Locked ? 0 : (NumberFormat.parse(document.getElementById(`u_t10_${type}`)?.value) || 0);
            const t11Count = t12Locked ? 0 : (NumberFormat.parse(document.getElementById(`u_t11_${type}`)?.value) || 0);
            const sub = {
                wood: 0,
                meat: 0,
                coal: 0,
                iron: 0,
                time: 0,
                power: 0
            };
            const u10 = this.getTierStats(type, "t10");
            const u11 = this.getTierStats(type, "t11");
            const u12 = this.getTierStats(type, "t12");

            if (u12) {
                if (u10) {
                    sub.wood += t10Count * (u12.wood - u10.wood);
                    sub.meat += t10Count * (u12.meat - u10.meat);
                    sub.coal += t10Count * (u12.coal - u10.coal);
                    sub.iron += t10Count * (u12.iron - u10.iron);
                    sub.power += t10Count * (u12.power - u10.power);
                    sub.time += t10Count * ((u12.time / factors[type]) - (u10.time / factors[type]));
                }
                if (u11) {
                    sub.wood += t11Count * (u12.wood - u11.wood);
                    sub.meat += t11Count * (u12.meat - u11.meat);
                    sub.coal += t11Count * (u12.coal - u11.coal);
                    sub.iron += t11Count * (u12.iron - u11.iron);
                    sub.power += t11Count * (u12.power - u11.power);
                    sub.time += t11Count * ((u12.time / factors[type]) - (u11.time / factors[type]));
                }
            }

            const el = document.getElementById(`res3_${type}`);
            if (el)
                el.innerHTML = this._resourceBlock(sub);
            Object.keys(grandS3).forEach(k => grandS3[k] += sub[k]);
        }
        );

        // ── Section 4: Troop Reduction Calculator ────────────────────────────
        let grandS4 = {
            powerToRemove: 0,
            totalCurrentPower: 0,
            totalFinalPower: 0,
            totalRemove: 0,
            totalFinal: 0,
            totalCurrent: 0,
            error: null
        };

        const currentPower = NumberFormat.parse(document.getElementById("s4_currentPower")?.value) || 0;
        const targetPower = NumberFormat.parse(document.getElementById("s4_targetPower")?.value) || 0;
        const powerToRemove = Math.max(0, currentPower - targetPower);

        // Update power to remove display
        const powerRemoveEl = document.getElementById("s4_powerToRemove");
        if (powerRemoveEl)
            powerRemoveEl.value = this.nf(powerToRemove);

        if (currentPower > 0 && targetPower > 0 && powerToRemove > 0) {
            const rawRatios = {
                inf: NumberFormat.parse(document.getElementById("s4_ratioInf")?.value) || 0,
                lanc: NumberFormat.parse(document.getElementById("s4_ratioLanc")?.value) || 0,
                mark: NumberFormat.parse(document.getElementById("s4_ratioMark")?.value) || 0
            };
            const ratioTotal = rawRatios.inf + rawRatios.lanc + rawRatios.mark;

            // Ratio total display
            const ratioTotalEl = document.getElementById("s4_ratioTotal");
            if (ratioTotalEl) {
                ratioTotalEl.value = this.nf(ratioTotal) + "%";
                ratioTotalEl.style.color = Math.abs(ratioTotal - 100) < 0.1 ? "#22c55e" : "#ff6b6b";
            }

            // Normalize ratios to sum to 1
            const ratios = ratioTotal > 0 ? {
                inf: rawRatios.inf / ratioTotal,
                lanc: rawRatios.lanc / ratioTotal,
                mark: rawRatios.mark / ratioTotal
            } : {
                inf: 0,
                lanc: 0,
                mark: 0
            };

            const currentTroops = {
                inf: {
                    t10: NumberFormat.parse(document.getElementById("s4_inf_t10")?.value),
                    t11: NumberFormat.parse(document.getElementById("s4_inf_t11")?.value),
                    t12: NumberFormat.parse(document.getElementById("s4_inf_t12")?.value)
                },
                lanc: {
                    t10: NumberFormat.parse(document.getElementById("s4_lanc_t10")?.value),
                    t11: NumberFormat.parse(document.getElementById("s4_lanc_t11")?.value),
                    t12: NumberFormat.parse(document.getElementById("s4_lanc_t12")?.value)
                },
                mark: {
                    t10: NumberFormat.parse(document.getElementById("s4_mark_t10")?.value),
                    t11: NumberFormat.parse(document.getElementById("s4_mark_t11")?.value),
                    t12: NumberFormat.parse(document.getElementById("s4_mark_t12")?.value)
                }
            };

            // Check if any troops entered
            const hasTroops = types.some(t => currentTroops[t].t10 > 0 || currentTroops[t].t11 > 0 || currentTroops[t].t12 > 0);

            if (hasTroops) {
                // Calculate total current troop power and counts
                let totalCurrentTroopPower = 0;
                let totalCurrentTroops = 0;
                const typePowers = {};

                types.forEach(type => {
                    typePowers[type] = 0;
                    ["t10", "t11", "t12"].forEach(tier => {
                        const count = currentTroops[type][tier];
                        const powerPerTroop = (this.getTierStats(type, tier) || {}).power || 0;
                        const power = count * powerPerTroop;
                        typePowers[type] += power;
                        totalCurrentTroopPower += power;
                        totalCurrentTroops += count;
                    }
                    );
                }
                );

                grandS4.totalCurrentPower = currentPower;
                // User-entered total power (includes buildings, heroes, etc.)
                grandS4.totalCurrent = totalCurrentTroops;
                grandS4.powerToRemove = powerToRemove;

                // Check if we can fulfill the power reduction with troops alone
                const totalTroopPower = typePowers.inf + typePowers.lanc + typePowers.mark;

                if (powerToRemove > totalTroopPower) {
                    grandS4.error = I18N.t("errorNotEnoughTroopPower") || "Power reduction exceeds troop power. Remove buildings/heroes first.";
                } else {
                    // Target power from troops after reduction
                    const targetTroopPower = totalTroopPower - powerToRemove;
                    grandS4.totalFinalPower = targetTroopPower + (currentPower - totalTroopPower);

                    // Binary search for total final troops
                    // We want to find T such that power(T) >= targetTroopPower and power(T-1) < targetTroopPower
                    // where power(T) = sum of kept troop power when we keep ratio-distributed troops

                    function calculatePowerForTotal(T) {
                        let totalPower = 0;
                        let isValid = true;

                        types.forEach(type => {
                            const targetCount = Math.floor(T * ratios[type]);
                            let remaining = targetCount;

                            // Keep highest tiers first (T12, then T11, then T10)
                            const keepT12 = Math.min(currentTroops[type].t12, remaining);
                            remaining -= keepT12;
                            const keepT11 = Math.min(currentTroops[type].t11, remaining);
                            remaining -= keepT11;
                            const keepT10 = Math.min(currentTroops[type].t10, remaining);
                            remaining -= keepT10;

                            if (remaining > 0) {
                                isValid = false;
                                // Not enough troops
                            }

                            totalPower += keepT12 * self.getTierStats(type, "t12").power + keepT11 * self.getTierStats(type, "t11").power + keepT10 * self.getTierStats(type, "t10").power;
                        }
                        );

                        return {
                            power: totalPower,
                            isValid
                        };
                    }

                    let low = 0;
                    let high = totalCurrentTroops * 3;
                    // Generous upper bound
                    let bestT = 0;
                    let bestPower = 0;

                    while (low <= high) {
                        const mid = Math.floor((low + high) / 2);
                        const result = calculatePowerForTotal(mid);

                        if (!result.isValid) {
                            high = mid - 1;
                            continue;
                        }

                        if (result.power >= targetTroopPower) {
                            bestT = mid;
                            bestPower = result.power;
                            high = mid - 1;
                        } else {
                            low = mid + 1;
                        }
                    }

                    if (bestT === 0) {
                        grandS4.error = I18N.t("errorNoSolution");
                    } else {
                        grandS4.totalFinal = bestT;
                        // Total final power = kept troop power + non-troop power (buildings, heroes, etc.)
                        grandS4.totalFinalPower = bestPower + (currentPower - totalTroopPower);

                        // Calculate final state with bestT
                        const finalState = {};
                        let totalRemove = 0;

                        types.forEach(type => {
                            const targetCount = Math.floor(bestT * ratios[type]);
                            let remaining = targetCount;

                            const keepT12 = Math.min(currentTroops[type].t12, remaining);
                            remaining -= keepT12;
                            const keepT11 = Math.min(currentTroops[type].t11, remaining);
                            remaining -= keepT11;
                            const keepT10 = Math.min(currentTroops[type].t10, remaining);
                            remaining -= keepT10;

                            const removeT12 = currentTroops[type].t12 - keepT12;
                            const removeT11 = currentTroops[type].t11 - keepT11;
                            const removeT10 = currentTroops[type].t10 - keepT10;

                            totalRemove += removeT12 + removeT11 + removeT10;

                            finalState[type] = {
                                t12: {
                                    current: currentTroops[type].t12,
                                    keep: keepT12,
                                    remove: removeT12
                                },
                                t11: {
                                    current: currentTroops[type].t11,
                                    keep: keepT11,
                                    remove: removeT11
                                },
                                t10: {
                                    current: currentTroops[type].t10,
                                    keep: keepT10,
                                    remove: removeT10
                                },
                                targetCount: targetCount,
                                finalPower: keepT12 * this.getTierStats(type, "t12").power + keepT11 * this.getTierStats(type, "t11").power + keepT10 * this.getTierStats(type, "t10").power
                            };
                        }
                        );

                        grandS4.totalRemove = totalRemove;

                        // Render results
                        types.forEach(type => {
                            const color = {
                                inf: "#81E013",
                                lanc: "#00ccff",
                                mark: "#ffcc00"
                            }[type];
                            const fs = finalState[type];

                            let html = ``;
                            let typeTotalRemove = 0;
                            let typeTotalKeep = 0;
                            let typeCurrentPower = 0;
                            let typeFinalPower = 0;

                            ["t12", "t11", "t10"].forEach(tier => {
                                const current = fs[tier].current;
                                const remove = fs[tier].remove;
                                const keep = fs[tier].keep;
                                const powerPerTroop = (this.getTierStats(type, tier) || {}).power || 0;

                                typeTotalRemove += remove;
                                typeTotalKeep += keep;
                                typeCurrentPower += current * powerPerTroop;
                                typeFinalPower += keep * powerPerTroop;

                                if (current > 0 || remove > 0) {
                                    html += `
                                    <div class="t4-tier-row">
                                        <span class="t4-tier-label">${tier.toUpperCase()}</span>
                                        <div class="t4-tier-values">
                                            <span class="t4-current">${this.nf(current)}</span>
                                            ${remove > 0 ? `<span class="t4-remove">−${this.nf(remove)}</span>` : '<span class="t4-remove">−0</span>'}
                                            <span class="t4-arrow">→</span>
                                            <span class="t4-keep">${this.nf(keep)}</span>
                                        </div>
                                    </div>`;
                                }
                            }
                            );

                            html += `
                                <div class="t4-summary-row">
                                    <span class="t4-summary-label">${I18N.t("removeTotal")}</span>
                                    <span class="t4-summary-value" style="color:#ff6b6b;">${this.nf(typeTotalRemove)}</span>
                                </div>
                                <div class="t4-summary-row">
                                    <span class="t4-summary-label">${I18N.t("keepTotal")}</span>
                                    <span class="t4-summary-value" style="color:${color};">${this.nf(typeTotalKeep)}</span>
                                </div>
                                <div class="t4-summary-row">
                                    <span class="t4-summary-label">${I18N.t("power")}</span>
                                    <span class="t4-summary-value" style="color:#ffcc00;">${this.nf(typeFinalPower)} <span style="color:#888;font-size:12px;font-weight:400;">(${this.nf(typeCurrentPower)} → ${this.nf(typeFinalPower)})</span></span>
                                </div>`;

                            const el = document.getElementById(`res4_${type}`);
                            if (el)
                                el.innerHTML = html;
                        }
                        );

                        // Render grand total for tab 4
                        const grandEl = document.getElementById("s4_grand_total");
                        if (grandEl) {
                            grandEl.innerHTML = `
                                <h3 style="font-size:16px;font-weight:800;margin-bottom:15px;color:#ff6b6b;">
                                    ⚔️ ${I18N.t("total")} — ${I18N.t("tab4")}
                                </h3>
                                <div style="display:flex;flex-wrap:wrap;gap:15px;border-bottom:1px solid rgba(255,255,255,0.08);
                                            padding-bottom:15px;margin-bottom:15px;">
                                    <div class="total-item">
                                        <div class="label">${I18N.t("powerToRemove")}</div>
                                        <div class="value" style="color:#ff6b6b;">${this.nf(grandS4.powerToRemove)}</div>
                                    </div>
                                    <div class="total-item">
                                        <div class="label">${I18N.t("totalRemove")}</div>
                                        <div class="value" style="color:#ff6b6b;">${this.nf(grandS4.totalRemove)}</div>
                                    </div>
                                    <div class="total-item">
                                        <div class="label">${I18N.t("keepTotal")}</div>
                                        <div class="value" style="color:#22c55e;">${this.nf(grandS4.totalFinal)}</div>
                                    </div>
                                </div>
                                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;">
                                    <div class="resource-total">
                                        <div class="label">${I18N.t("currentPower")}</div>
                                        <div class="value" style="color:#4fc3ff;">${this.nf(grandS4.totalCurrentPower)}</div>
                                    </div>
                                    <div class="resource-total">
                                        <div class="label">${I18N.t("targetPower")}</div>
                                        <div class="value" style="color:#22c55e;">${this.nf(grandS4.totalFinalPower)}</div>
                                    </div>
                                    <div class="resource-total">
                                        <div class="label">${I18N.t("currentTroops")}</div>
                                        <div class="value" style="color:#b5c3d7;">${this.nf(grandS4.totalCurrent)}</div>
                                    </div>
                                    <div class="resource-total">
                                        <div class="label">${I18N.t("finalTroops")}</div>
                                        <div class="value" style="color:#ffcc00;">${this.nf(grandS4.totalFinal)}</div>
                                    </div>
                                </div>
                            `;
                        }
                    }
                }
            } else {
                grandS4.error = I18N.t("enterData");
            }
        }

        // Handle error / empty states for Tab 4
        if (grandS4.error) {
            types.forEach(type => {
                const el = document.getElementById(`res4_${type}`);
                if (el)
                    el.innerHTML = `<div style="color:#ff6b6b;text-align:center;padding:30px 20px;font-weight:700;font-size:14px;">${grandS4.error}</div>`;
            }
            );
            const grandEl = document.getElementById("s4_grand_total");
            if (grandEl)
                grandEl.innerHTML = `<div style="color:#ff6b6b;text-align:center;padding:20px;font-weight:700;">${grandS4.error}</div>`;
        } else if (powerToRemove <= 0) {
            types.forEach(type => {
                const el = document.getElementById(`res4_${type}`);
                if (el)
                    el.innerHTML = `<div style="color:#888;text-align:center;padding:30px 20px;font-size:14px;">${I18N.t("enterData")}</div>`;
            }
            );
            const grandEl = document.getElementById("s4_grand_total");
            if (grandEl)
                grandEl.innerHTML = '';
        }

        this._renderGrandTotal(grandS1, grandS2, grandS3, grandS4);
    },

    // ─── Resource block with icons ────────────────────────────────────────────

    _resourceBlock(sub) {
        const img = (key) => window["__trainImg_" + key] || ("assets/resources/" + key + ".png");

        const row = (iconContent, labelKey, value, color) => {
            return `
            <div style="display:flex;justify-content:space-between;align-items:center;
                        margin:7px 0;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:6px;">
                <span style="display:flex;align-items:center;gap:6px;color:#b5c3d7;">
                    ${iconContent}${I18N.t(labelKey)}
                </span>
                <span style="color:${color};font-weight:700;">${value}</span>
            </div>`;
        }
        ;

        const icon = (key) => `<img src="${img(key)}" class="res-icon-inline" alt="" style="width:38px;height:38px;object-fit:contain;flex-shrink:0;" onerror="this.style.display='none'">`;

        return `
            ${row(icon("speeds"), "time", this.formatTime(sub.time), "#4fc3ff")}
            ${row(`<span style="font-size:15px;line-height:1;">⚡</span>`, "power", "+" + this.nf(sub.power), "#ffcc00")}
            ${row(icon("wood"), "wood", this.nf(sub.wood), "#a3e635")}
            ${row(icon("meat"), "meat", this.nf(sub.meat), "#f43f5e")}
            ${row(icon("coal"), "coal", this.nf(sub.coal), "#cbd5e1")}
            ${row(icon("iron"), "iron", this.nf(sub.iron), "#c084fc")}
        `;
    },

    _copyButtonHtml() {
        return `<button type="button" class="action-btn" style="padding:6px 12px;font-size:12px;flex-shrink:0;"
                    onclick="TrainingManager.copyGrandTotal(this)">📋 ${I18N.t("copy") || "Copy"}</button>`;
    },

    copyGrandTotal(btnEl) {
        const data = this._lastGrandTotal;
        if (!data)
            return;
        let lines = [`${I18N.t("total")} — ${data.label}`];
        if (data.isTab4 && data.s4) {
            lines.push(`${I18N.t("currentPower")}: ${this.nf(data.s4.totalCurrentPower)}`);
            lines.push(`${I18N.t("targetPower")}: ${this.nf(data.s4.totalFinalPower)}`);
            lines.push(`${I18N.t("currentTroops")}: ${this.nf(data.s4.totalCurrent)}`);
            lines.push(`${I18N.t("finalTroops")}: ${this.nf(data.s4.totalFinal)}`);
        } else {
            const c = data.current;
            lines.push(`${I18N.t("time")}: ${this.formatTime(c.time)}`);
            lines.push(`${I18N.t("power")}: +${this.nf(c.power)}`);
            lines.push(`${I18N.t("wood")}: ${this.nf(c.wood)}`);
            lines.push(`${I18N.t("meat")}: ${this.nf(c.meat)}`);
            lines.push(`${I18N.t("coal")}: ${this.nf(c.coal)}`);
            lines.push(`${I18N.t("iron")}: ${this.nf(c.iron)}`);
        }
        const text = lines.join("\n");
        const done = () => {
            if (!btnEl)
                return;
            const original = btnEl.innerHTML;
            btnEl.innerHTML = "✅";
            setTimeout( () => btnEl.innerHTML = original, 1200);
        }
        ;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done).catch(done);
        } else {
            const ta = document.createElement("textarea");
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand("copy");
            } catch (e) {}
            document.body.removeChild(ta);
            done();
        }
    },

    _renderGrandTotal(s1, s2, s3, s4) {
        const container = document.getElementById("training_grand_total");
        if (!container)
            return;

        let current = s1;
        let label = I18N.t("tab1");
        let extraHtml = "";

        if (this.activeTabId === "tab2") {
            current = s2;
            label = I18N.t("tab2");
            extraHtml = `
                <div class="total-item">
                    <div class="label">${I18N.t("produced")}</div>
                    <div class="value" style="color:#ffcc00;">
                        ${this.nf(s2.totalTroops)} ${I18N.t("units")}
                    </div>
                </div>`;
        } else if (this.activeTabId === "tab3") {
            current = s3;
            label = I18N.t("tab3");
        } else if (this.activeTabId === "tab4") {
            current = s4;
            label = I18N.t("tab4");
            extraHtml = `
                <div class="total-item">
                    <div class="label">${I18N.t("powerToRemove")}</div>
                    <div class="value" style="color:#ff6b6b;">${this.nf(s4.powerToRemove)}</div>
                </div>
                <div class="total-item">
                    <div class="label">${I18N.t("totalRemove")}</div>
                    <div class="value" style="color:#ff6b6b;">${this.nf(s4.totalRemove)}</div>
                </div>
                <div class="total-item">
                    <div class="label">${I18N.t("keepTotal")}</div>
                    <div class="value" style="color:#22c55e;">${this.nf(s4.totalFinal)}</div>
                </div>`;
        }

        const resIcon = (key, labelKey, val, color) => {
            const imgSrc = window["__trainImg_" + key] || ("assets/resources/" + key + ".png");
            const iconHtml = key === "power" ? `<span style="font-size:16px;line-height:1;">⚡</span>` : `<img src="${imgSrc}" class="res-icon-inline" alt="" onerror="this.style.display='none'" style="width:38px;height:38px;">`;
            return `
            <div class="resource-total">
                <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:4px;">
                    ${iconHtml}
                    <span class="label">${I18N.t(labelKey)}</span>
                </div>
                <div class="value" style="color:${color};">${val}</div>
            </div>`;
        }
        ;

        this._lastGrandTotal = { current, label, isTab4: this.activeTabId === "tab4", s4 };

        if (this.activeTabId === "tab4") {
            container.innerHTML = `
                <h3 style="font-size:16px;font-weight:800;margin-bottom:15px;color:#ff6b6b;display:flex;align-items:center;justify-content:space-between;gap:10px;">
                    <span>⚔️ ${I18N.t("total")} — ${label}</span>
                    ${this._copyButtonHtml()}
                </h3>
                <div style="display:flex;flex-wrap:wrap;gap:15px;border-bottom:1px solid rgba(255,255,255,0.08);
                            padding-bottom:15px;margin-bottom:15px;">
                    ${extraHtml}
                </div>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;">
                    <div class="resource-total">
                        <div class="label">${I18N.t("currentPower")}</div>
                        <div class="value" style="color:#4fc3ff;">${this.nf(s4.totalCurrentPower)}</div>
                    </div>
                    <div class="resource-total">
                        <div class="label">${I18N.t("targetPower")}</div>
                        <div class="value" style="color:#22c55e;">${this.nf(s4.totalFinalPower)}</div>
                    </div>
                    <div class="resource-total">
                        <div class="label">${I18N.t("currentTroops")}</div>
                        <div class="value" style="color:#b5c3d7;">${this.nf(s4.totalCurrent)}</div>
                    </div>
                    <div class="resource-total">
                        <div class="label">${I18N.t("finalTroops")}</div>
                        <div class="value" style="color:#ffcc00;">${this.nf(s4.totalFinal)}</div>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <h3 style="font-size:16px;font-weight:800;margin-bottom:15px;color:#4fc3ff;display:flex;align-items:center;justify-content:space-between;gap:10px;">
                    <span>${I18N.t("total")} — ${label}</span>
                    ${this._copyButtonHtml()}
                </h3>
                <div style="display:flex;flex-wrap:wrap;gap:15px;border-bottom:1px solid rgba(255,255,255,0.08);
                            padding-bottom:15px;margin-bottom:15px;">
                    ${extraHtml}
                    <div class="total-item">
                        <div class="label">${I18N.t("time")}</div>
                        <div class="value" style="color:#4fc3ff;">${this.formatTime(current.time)}</div>
                    </div>
                    <div class="total-item">
                        <div class="label">${I18N.t("power")}</div>
                        <div class="value" style="color:#ffcc00;">+${this.nf(current.power)}</div>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:10px;">
                    ${resIcon("wood", "wood", this.nf(current.wood), "#a3e635")}
                    ${resIcon("meat", "meat", this.nf(current.meat), "#f43f5e")}
                    ${resIcon("coal", "coal", this.nf(current.coal), "#cbd5e1")}
                    ${resIcon("iron", "iron", this.nf(current.iron), "#c084fc")}
                </div>
            `;
        }
    },

    // ─── Persistence ──────────────────────────────────────────────────────────

    saveData() {
        const g = id => {
            const el = document.getElementById(id);
            return el ? NumberFormat.parse(el.value) : "";
        }
        ;
        const dd = id => document.getElementById(id)?.value || "10";
        const dd0 = id => document.getElementById(id)?.value || "0";
        Storage.set("training", {
            buffs: {
                inf: g("g_speedInf"),
                lanc: g("g_speedLanc"),
                mark: g("g_speedMark"),
                fc_inf: dd("fc_inf"),
                fc_lanc: dd("fc_lanc"),
                fc_mark: dd("fc_mark"),
                rs_inf: dd("rs_inf"),
                rs_lanc: dd("rs_lanc"),
                rs_mark: dd("rs_mark"),
                t12rs_inf: dd0("t12rs_inf"),
                t12rs_lanc: dd0("t12rs_lanc"),
                t12rs_mark: dd0("t12rs_mark")
            },
            s1: {
                inf10: g("c1_inf10"),
                inf11: g("c1_inf11"),
                inf12: g("c1_inf12"),
                lanc10: g("c1_lanc10"),
                lanc11: g("c1_lanc11"),
                lanc12: g("c1_lanc12"),
                mark10: g("c1_mark10"),
                mark11: g("c1_mark11"),
                mark12: g("c1_mark12")
            },
            s2: {
                d: g("s2_d"),
                h: g("s2_h"),
                m: g("s2_m"),
                tier: document.getElementById("s2_tier")?.value || "t11",
                cap: g("s2_cap"),
                pInf: g("s2_pInf"),
                pLanc: g("s2_pLanc"),
                pMark: g("s2_pMark")
            },
            s3: {
                inf_t10: g("u_t10_inf"),
                inf_t11: g("u_t11_inf"),
                lanc_t10: g("u_t10_lanc"),
                lanc_t11: g("u_t11_lanc"),
                mark_t10: g("u_t10_mark"),
                mark_t11: g("u_t11_mark")
            },
            s4: {
                currentPower: g("s4_currentPower"),
                targetPower: g("s4_targetPower"),
                inf_t10: g("s4_inf_t10"),
                inf_t11: g("s4_inf_t11"),
                inf_t12: g("s4_inf_t12"),
                lanc_t10: g("s4_lanc_t10"),
                lanc_t11: g("s4_lanc_t11"),
                lanc_t12: g("s4_lanc_t12"),
                mark_t10: g("s4_mark_t10"),
                mark_t11: g("s4_mark_t11"),
                mark_t12: g("s4_mark_t12"),
                ratioInf: g("s4_ratioInf"),
                ratioLanc: g("s4_ratioLanc"),
                ratioMark: g("s4_ratioMark")
            }
        });
    },

    loadData() {
        const data = Storage.get("training");
        if (!data)
            return;
        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) {
                const raw = val ? NumberFormat.parse(val) : 0;
                el.dataset.rawValue = raw;
                el.value = raw ? NumberFormat.format(raw) : "";
            }
        }
        ;

        if (data.buffs) {
            set("g_speedInf", data.buffs.inf);
            set("g_speedLanc", data.buffs.lanc);
            set("g_speedMark", data.buffs.mark);
            ["inf", "lanc", "mark"].forEach(t => {
                const fcVal = String(data.buffs[`fc_${t}`] || 10);
                const rsVal = String(data.buffs[`rs_${t}`] !== undefined && data.buffs[`rs_${t}`] !== "" ? data.buffs[`rs_${t}`] : 10);
                const t12rsVal = String(data.buffs[`t12rs_${t}`] !== undefined && data.buffs[`t12rs_${t}`] !== "" ? data.buffs[`t12rs_${t}`] : 0);
                this.setDropdownValue(`fc_${t}`, fcVal);
                this.setDropdownValue(`rs_${t}`, rsVal);
                this.setDropdownValue(`t12rs_${t}`, t12rsVal);
            }
            );
        }
        if (data.s1) {
            ["inf", "lanc", "mark"].forEach(t => {
                ["10", "11", "12"].forEach(v => set(`c1_${t}${v}`, data.s1[`${t}${v}`]));
            }
            );
        }
        if (data.s2) {
            ["d", "h", "m", "cap", "pInf", "pLanc", "pMark"].forEach(k => set(`s2_${k}`, data.s2[k]));

            const tier = data.s2.tier || "t11";
            const hiddenTier = document.getElementById("s2_tier");
            if (hiddenTier)
                hiddenTier.value = tier;
            const trigger = document.getElementById("s2_tier_trigger");
            if (trigger) {
                trigger.querySelector("span").textContent = tier.toUpperCase();
                trigger.dataset.value = tier;
                document.querySelectorAll("#s2_tier_menu .training-custom-option").forEach(o => {
                    o.classList.toggle("active", o.dataset.value === tier);
                }
                );
            }
        }
        if (data.s3) {
            ["inf", "lanc", "mark"].forEach(t => {
                set(`u_t10_${t}`, data.s3[`${t}_t10`]);
                set(`u_t11_${t}`, data.s3[`${t}_t11`]);
            }
            );
        }
        if (data.s4) {
            set("s4_currentPower", data.s4.currentPower);
            set("s4_targetPower", data.s4.targetPower);
            ["inf", "lanc", "mark"].forEach(t => {
                ["10", "11", "12"].forEach(v => set(`s4_${t}_t${v}`, data.s4[`${t}_t${v}`]));
            }
            );
            set("s4_ratioInf", data.s4.ratioInf);
            set("s4_ratioLanc", data.s4.ratioLanc);
            set("s4_ratioMark", data.s4.ratioMark);
        }
    },

    resetSection(num) {
        const clear = ids => ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.value = "";
                el.dataset.rawValue = "0";
            }
        }
        );
        if (num === 1) {
            clear(["c1_inf10", "c1_inf11", "c1_inf12", "c1_lanc10", "c1_lanc11", "c1_lanc12", "c1_mark10", "c1_mark11", "c1_mark12"]);
        } else if (num === 2) {
            clear(["s2_d", "s2_h", "s2_m", "s2_cap", "s2_pInf", "s2_pLanc", "s2_pMark"]);
            const hiddenTier = document.getElementById("s2_tier");
            if (hiddenTier)
                hiddenTier.value = "t11";
            const trigger = document.getElementById("s2_tier_trigger");
            if (trigger) {
                trigger.querySelector("span").textContent = "T11";
                trigger.dataset.value = "t11";
            }
        } else if (num === 3) {
            clear(["u_t10_inf", "u_t11_inf", "u_t10_lanc", "u_t11_lanc", "u_t10_mark", "u_t11_mark"]);
        } else if (num === 4) {
            clear(["s4_currentPower", "s4_targetPower", "s4_inf_t10", "s4_inf_t11", "s4_inf_t12", "s4_lanc_t10", "s4_lanc_t11", "s4_lanc_t12", "s4_mark_t10", "s4_mark_t11", "s4_mark_t12"]);
            const ratioInf = document.getElementById("s4_ratioInf");
            const ratioLanc = document.getElementById("s4_ratioLanc");
            const ratioMark = document.getElementById("s4_ratioMark");
            if (ratioInf)
                ratioInf.value = "50";
            if (ratioLanc)
                ratioLanc.value = "20";
            if (ratioMark)
                ratioMark.value = "30";
        }
        this.saveData();
        this.calculateAll();
    }
};

window.TrainingManager = TrainingManager;