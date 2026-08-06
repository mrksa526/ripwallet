window.__toolImg_speeds = "assets/icons/toolImg_speeds.png";
window.__toolImg_helmet = "assets/icons/toolImg_helmet.png";
window.__toolImg_expert_book = "assets/icons/toolImg_expert_book.png";
window.__toolImg_infantry_charm = "assets/icons/toolImg_infantry_charm.png";
window.__charmImg_infantry_charm = "assets/icons/charmImg_infantry_charm.png";
window.__charmImg_lancer_charm = "assets/icons/charmImg_lancer_charm.png";
window.__charmImg_marksman_charm = "assets/icons/charmImg_marksman_charm.png";
window.__gearResImg_alloy = "assets/icons/gearResImg_alloy.png";
window.__gearResImg_solution = "assets/icons/gearResImg_solution.png";
window.__gearResImg_plans = "assets/icons/gearResImg_plans.png";
window.__gearResImg_amber = "assets/icons/gearResImg_amber.png";
window.__charmResImg_secrets = "assets/icons/charmResImg_secrets.png";
window.__charmResImg_guide = "assets/icons/charmResImg_guide.png";
window.__charmResImg_designs = "assets/icons/charmResImg_designs.png";
// =========================
// UI RENDERERS
// =========================

const Renderers = {

    // ─── Homepage ────────────────────────────────────────────────────────────

    renderEvents() {
        // Events rendering is now handled by EventsManager.renderEvents()
        // This function is kept for backward compatibility
        if (window.EventsManager && window.EventsManager.renderEvents) {
            window.EventsManager.renderEvents();
        }
    },

    renderTools() {
        const grid = document.getElementById("toolsGrid");
        if (!grid)
            return;

        const t = k => I18N.t(k);

        const tools = [{
            key: "training",
            title: t("training"),
            desc: t("trainingDesc"),
            icon: "⚔️",
            iconImg: window.__toolImg_speeds || null,
            onClick: "openView('training')",
            disabled: false
        }, {
            key: "gear",
            title: t("gear"),
            desc: t("gearDesc"),
            icon: "🛡️",
            iconImg: window.__toolImg_helmet || null,
            onClick: "openView('gear_upgrade')",
            disabled: false
        }, {
            key: "charms",
            title: t("charms"),
            desc: t("charmsDesc"),
            icon: "💎",
            iconImg: window.__toolImg_infantry_charm || "assets/icons/charm.png",
            onClick: "openView('charms')",
            disabled: false
        }, {
            key: "experts",
            title: t("experts"),
            desc: t("expertsDesc"),
            icon: "🧠",
            iconImg: window.__toolImg_expert_book || "assets/icons/expert.png",
            onClick: "openView('experts')",
            disabled: false
        }, {
            key: "construction",
            title: t("construction"),
            desc: t("comingSoon"),
            icon: "🏗️",
            iconImg: null,
            onClick: "",
            disabled: true
        }];

        grid.innerHTML = tools.map(tool => {
            const btnText = tool.disabled ? t("soon") : t("open");
            const disabledCl = tool.disabled ? "disabled" : "";
            const clickAttr = tool.disabled ? "" : `onclick="${tool.onClick}"`;
            const iconHtml = tool.iconImg ? `<img src="${tool.iconImg}" class="tool-icon-img" alt="${tool.title}" onerror="this.style.display='none';this.nextElementSibling.style.display='block';">
                   <div class="tool-icon" style="display:none;">${tool.icon}</div>` : `<div class="tool-icon">${tool.icon}</div>`;

            return `
            <div class="tool-card ${disabledCl}" ${clickAttr}>
                <div class="tool-glow"></div>
                ${iconHtml}
                <h3 class="tool-title">${tool.title}</h3>
                <p class="tool-desc">${tool.desc}</p>
                <button class="tool-btn" ${tool.disabled ? "disabled" : ""}>${btnText}</button>
            </div>`;
        }
        ).join("");
    },

    renderHomepage() {
        this.renderEvents();
        this.renderTools();

        const evTitle = document.querySelector(".events-section .section-title");
        if (evTitle)
            evTitle.textContent = I18N.t("eventsTitle");
        const tlTitle = document.querySelector(".tools-section .section-title");
        if (tlTitle)
            tlTitle.textContent = I18N.t("calculatorsTitle");
        const heroT = document.querySelector(".hero-title");
        if (heroT)
            heroT.textContent = I18N.t("heroTitle");
        const heroS = document.querySelector(".hero-subtitle");
        if (heroS)
            heroS.textContent = I18N.t("heroSubtitle");
    },

    // ─── Training View ────────────────────────────────────────────────────────

    renderTrainingView() {
        const container = document.getElementById("trainingView");
        if (!container)
            return;

        // Save current state before re-render (for language switching)
        const savedTab = window.TrainingManager ? window.TrainingManager.activeTabId : "tab1";
        const savedInputs = {};
        const inputIds = ["g_speedInf", "g_speedLanc", "g_speedMark", "c1_inf10", "c1_inf11", "c1_inf12", "c1_lanc10", "c1_lanc11", "c1_lanc12", "c1_mark10", "c1_mark11", "c1_mark12", "s2_d", "s2_h", "s2_m", "s2_cap", "s2_pInf", "s2_pLanc", "s2_pMark", "u_t10_inf", "u_t11_inf", "u_t10_lanc", "u_t11_lanc", "u_t10_mark", "u_t11_mark", "s4_currentPower", "s4_targetPower", "s4_inf_t10", "s4_inf_t11", "s4_inf_t12", "s4_lanc_t10", "s4_lanc_t11", "s4_lanc_t12", "s4_mark_t10", "s4_mark_t11", "s4_mark_t12", "s4_ratioInf", "s4_ratioLanc", "s4_ratioMark", "fc_inf", "fc_lanc", "fc_mark", "rs_inf", "rs_lanc", "rs_mark", "t12rs_inf", "t12rs_lanc", "t12rs_mark"];
        inputIds.forEach(id => {
            const el = document.getElementById(id);
            if (el)
                savedInputs[id] = el.value;
        }
        );
        const savedTier = document.getElementById("s2_tier")?.value;

        if (container.innerHTML.trim() !== "") {
            // Already rendered - just update translations if needed
            // Don't rebuild, just return
            return;
        }

        const T = k => I18N.t(k);

        container.innerHTML = `
            <div class="view-header">
                <button class="back-btn" onclick="goHome()"><img src="assets/icons/common_btn_left.png" class="back-btn-icon" alt=""> ${T("back")}</button>
                <h2>${T("trainingTitle")}</h2>
                <p class="view-subtitle">${T("trainingSubtitle")}</p>
            </div>

            <!-- Buffs -->
            <div class="total-cost-panel">
                <h3 style="color:#4fc3ff; margin-bottom:15px;">${T("buffsTitle")}</h3>
                ${this._buffsTable()}
            </div>

            <!-- Tabs -->
            <div class="gear-pages-tabs">
                <button class="gear-tab active" onclick="TrainingManager.switchTab('tab1',this)">${T("tab1")}</button>
                <button class="gear-tab"        onclick="TrainingManager.switchTab('tab2',this)">${T("tab2")}</button>
                <button class="gear-tab"        onclick="TrainingManager.switchTab('tab3',this)">${T("tab3")}</button>
                <button class="gear-tab"        onclick="TrainingManager.switchTab('tab4',this)">${T("tab4")}</button>
            </div>

            <!-- Grand Total -->
            <div id="training_grand_total" class="total-cost-panel"></div>

            <!-- Tab 1 -->
            <div id="tab1" class="training-tab-content active-tab">
                <div class="gear-card-header" style="margin-bottom:15px;">
                    <h3 style="font-size:18px;color:#b5c3d7;">${T("s1Title")}</h3>
                    <button class="action-btn" onclick="TrainingManager.resetSection(1)">${T("resetBtn")}</button>
                </div>
                <div class="gear-grid">
                    ${this._troopCard("inf", "#80E012", "🛡️")}
                    ${this._troopCard("lanc", "#00ccff", "⚔️")}
                    ${this._troopCard("mark", "#ffcc00", "🏹")}
                </div>
            </div>

            <!-- Tab 2 -->
            <div id="tab2" class="training-tab-content" style="display:none;">
                ${this._tab2Html()}
            </div>

            <!-- Tab 3 -->
            <div id="tab3" class="training-tab-content" style="display:none;">
                ${this._tab3Html()}
            </div>

            <!-- Tab 4 -->
            <div id="tab4" class="training-tab-content" style="display:none;">
                ${this._tab4Html()}
            </div>
        `;

        ["s2_tier", "fc_inf", "fc_lanc", "fc_mark", "rs_inf", "rs_lanc", "rs_mark", "t12rs_inf", "t12rs_lanc", "t12rs_mark"].forEach(id => {
            if (window.TrainingManager) TrainingManager._initCustomDropdown(id);
        });

        // Restore saved state after render
        requestAnimationFrame( () => {
            // Restore inputs
            Object.keys(savedInputs).forEach(id => {
                const el = document.getElementById(id);
                if (el && savedInputs[id] !== undefined)
                    el.value = savedInputs[id];
            }
            );
            // Restore tier dropdown
            if (savedTier) {
                const hiddenTier = document.getElementById("s2_tier");
                const trigger = document.getElementById("s2_tier_trigger");
                if (hiddenTier)
                    hiddenTier.value = savedTier;
                if (trigger) {
                    trigger.querySelector("span").textContent = savedTier.toUpperCase();
                    trigger.dataset.value = savedTier;
                }
            }
            // Restore active tab
            if (savedTab && savedTab !== "tab1") {
                const tabBtn = document.querySelector(`.gear-tab[onclick*="${savedTab}"]`);
                if (tabBtn && window.TrainingManager) {
                    window.TrainingManager.switchTab(savedTab, tabBtn);
                }
            }
            // Re-apply number formatting and listeners
            if (window.TrainingManager) {
                window.TrainingManager.applyNumberFormatting();
                window.TrainingManager.attachListeners();
                window.TrainingManager.calculateAll();
            }
        }
        );
    },

    // Generic dropdown builder — same visual/behavior pattern used across the
    // Training tool (see Tab 2's tier dropdown). Produces a trigger + menu +
    // hidden input. Options may carry an `icon` (data URI); pass cfg.iconOnly
    // to show icons instead of text, and cfg.initialIcon to force the trigger's
    // starting icon regardless of the default selected value.
    // Wire it up afterwards with TrainingManager._initCustomDropdown(baseId).
    _dropdown(baseId, options, defaultValue, cfg = {}) {
        const iconOnly = !!cfg.iconOnly;
        const selected = options.find(o => o.value === defaultValue) || options[0];
        const startIcon = (selected && selected.icon) || cfg.initialIcon || "";
        const startShowLabel = !iconOnly || !(selected && selected.icon);

        const optionsHtml = options.map(o => {
            const showLabel = !iconOnly || !o.icon;
            return `
            <div class="training-custom-option ${o.value === defaultValue ? "active" : ""}" data-value="${o.value}" data-label="${o.label}" ${o.icon ? `data-icon="${o.icon}"` : ""}>
                ${o.icon ? `<img src="${o.icon}" alt="${o.label}" style="width:26px;height:26px;object-fit:contain;vertical-align:middle;${showLabel ? "margin-inline-end:6px;" : ""}">` : ""}${showLabel ? `<span>${o.label}</span>` : ""}
            </div>
        `;
        }).join("");

        return `
            <div class="training-select-wrapper" id="${baseId}_wrapper">
                <div class="training-custom-trigger" id="${baseId}_trigger" data-value="${defaultValue}">
                    <span style="display:flex;align-items:center;gap:6px;">
                        <img class="trigger-icon" src="${startIcon}" alt="" style="width:22px;height:22px;object-fit:contain;${startIcon ? "" : "display:none;"}">
                        <span class="trigger-label-text">${startShowLabel ? (selected ? selected.label : "") : ""}</span>
                    </span>
                    <svg class="training-chevron-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div class="training-custom-dropdown-menu" id="${baseId}_menu">${optionsHtml}</div>
            </div>
            <input type="hidden" id="${baseId}" value="${defaultValue}">
        `;
    },

    // Buffs table: one row per metric (Speed / FC Level / T11 Research),
    // one column per troop type — grouped by metric rather than by troop.
    _buffsTable() {
        const T = k => I18N.t(k);
        const types = [
            { key: "inf", color: "#80E012", name: T("troopInf") },
            { key: "lanc", color: "#00ccff", name: T("troopLanc") },
            { key: "mark", color: "#ffcc00", name: T("troopMark") }
        ];
        const speedIds = { inf: "g_speedInf", lanc: "g_speedLanc", mark: "g_speedMark" };

        const fcIcons = {
            5: window.__trainImg_fc5, 6: window.__trainImg_fc6, 7: window.__trainImg_fc7,
            8: window.__trainImg_fc8, 9: window.__trainImg_fc9, 10: window.__trainImg_fc10
        };
        const fcOptions = [];
        for (let lvl = (window.FC_MIN_LEVEL || 5); lvl <= (window.FC_MAX_LEVEL || 10); lvl++) {
            fcOptions.push({ value: String(lvl), label: "FC" + lvl, icon: fcIcons[lvl] });
        }
        const rsOptions = [];
        for (let lvl = (window.TRAINING_RESEARCH_MIN || 0); lvl <= (window.TRAINING_RESEARCH_MAX || 10); lvl++) {
            rsOptions.push({ value: String(lvl), label: String(lvl) });
        }

        const researchIcons = {
            inf: window.__trainImg_research_mark,
            lanc: window.__trainImg_research_lanc,
            mark: window.__trainImg_research_inf
        };

        const t12ResearchIcons = {
            inf: window.__trainImg_research_t12_inf,
            lanc: window.__trainImg_research_t12_lanc,
            mark: window.__trainImg_research_t12_mark
        };
        const t12rsOptions = [];
        for (let lvl = (window.T12_RESEARCH_MIN || 0); lvl <= (window.T12_RESEARCH_MAX || 10); lvl++) {
            t12rsOptions.push({ value: String(lvl), label: String(lvl) });
        }

        const speedRow = types.map(t => `
            <div class="tb-col"><input type="text" inputmode="decimal" id="${speedIds[t.key]}" placeholder="0" class="action-btn"></div>
        `).join("");

        const fcRow = types.map(t => `
            <div class="tb-col">${this._dropdown(`fc_${t.key}`, fcOptions, "10", { iconOnly: true })}</div>
        `).join("");

        const rsRow = types.map(t => `
            <div class="tb-col">
                ${researchIcons[t.key] ? `<img src="${researchIcons[t.key]}" alt="" style="width:24px;height:24px;object-fit:contain;display:block;margin:0 auto 4px;">` : ""}
                ${this._dropdown(`rs_${t.key}`, rsOptions, "10")}
            </div>
        `).join("");

        const t12rsRow = types.map(t => `
            <div class="tb-col" id="t12rs_${t.key}_cell">
                ${t12ResearchIcons[t.key] ? `<img src="${t12ResearchIcons[t.key]}" alt="" style="width:24px;height:24px;object-fit:contain;display:block;margin:0 auto 4px;">` : ""}
                ${this._dropdown(`t12rs_${t.key}`, t12rsOptions, "0")}
            </div>
        `).join("");

        return `
        <div class="training-buffs-table">
            <div class="tb-row tb-header">
                <div class="tb-label"></div>
                ${types.map(t => `<div class="tb-col" style="color:${t.color};font-weight:700;">${t.name}</div>`).join("")}
            </div>
            <div class="tb-row">
                <div class="tb-label">${T("lblSpeedBuff")}</div>
                ${speedRow}
            </div>
            <div class="tb-row">
                <div class="tb-label">${T("lblFCLevel")}</div>
                ${fcRow}
            </div>
            <div class="tb-row">
                <div class="tb-label">${T("lblT11Research")}</div>
                ${rsRow}
            </div>
            <div class="tb-row" id="t12rs_row">
                <div class="tb-label">${T("lblT12Research")}</div>
                ${t12rsRow}
            </div>
        </div>`;
    },

    _troopCard(type, color, emoji) {
        const T = k => I18N.t(k);
        const names = {
            inf: T("troopInf"),
            lanc: T("troopLanc"),
            mark: T("troopMark")
        };
        return `
        <div class="gear-card" style="border-top:3px solid ${color};">
            <div class="gear-card-header" style="border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:12px; margin-bottom:16px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:28px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));">${emoji}</span>
                    <h4 style="color:${color}; font-size:20px;">${names[type]}</h4>
                </div>
            </div>
            <div class="select-group" style="margin-bottom:12px;">
                <label style="display:flex; align-items:center; gap:6px;">
                    <span style="width:8px; height:8px; border-radius:50%; background:#888; display:inline-block;"></span>
                    ${T("lblT10")}
                </label>
                <input type="text" inputmode="numeric" id="c1_${type}10" class="action-btn" placeholder="0">
            </div>
            <div class="select-group" style="margin-bottom:12px;">
                <label style="display:flex; align-items:center; gap:6px;">
                    <span style="width:8px; height:8px; border-radius:50%; background:#4fc3ff; display:inline-block;"></span>
                    ${T("lblT11")}
                </label>
                <input type="text" inputmode="numeric" id="c1_${type}11" class="action-btn" placeholder="0">
            </div>
            <div class="select-group" style="margin-bottom:4px;">
                <label style="display:flex; align-items:center; gap:6px;">
                    <span style="width:8px; height:8px; border-radius:50%; background:#ffcc00; display:inline-block;"></span>
                    ${T("lblT12")}
                </label>
                <input type="text" inputmode="numeric" id="c1_${type}12" class="action-btn" placeholder="0">
            </div>
            <div id="res1_${type}" class="gear-steps-container" style="margin-top:18px; padding-top:15px; border-top:1px solid rgba(255,255,255,0.06);"></div>
        </div>`;
    },

    _tab2Html() {
        const T = k => I18N.t(k);
        return `
        <div class="gear-card-header" style="margin-bottom:15px;">
            <h3 style="font-size:18px;color:#b5c3d7;">${T("s2Title")}</h3>
            <button class="action-btn" onclick="TrainingManager.resetSection(2)">${T("resetBtn")}</button>
        </div>
        <div class="total-cost-panel" style="margin-bottom:20px;">
            <div class="gear-grid" style="grid-template-columns:repeat(auto-fit,minmax(140px,1fr));">
                <div class="select-group"><label>${T("lblDays")}</label><input type="text" inputmode="numeric" id="s2_d" class="action-btn" placeholder="0"></div>
                <div class="select-group"><label>${T("lblHours")}</label><input type="text" inputmode="numeric" id="s2_h" class="action-btn" placeholder="0"></div>
                <div class="select-group"><label>${T("lblMins")}</label><input type="text" inputmode="numeric" id="s2_m" class="action-btn" placeholder="0"></div>
                <div class="select-group">
                    <label>${T("lblTier")}</label>
                    <div class="training-select-wrapper" id="s2_tier_wrapper">
                        <div class="training-custom-trigger" id="s2_tier_trigger" data-value="t11">
                            <span>T11</span>
                            <svg class="training-chevron-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                        </div>
                        <div class="training-custom-dropdown-menu" id="s2_tier_menu">
                            <div class="training-custom-option" data-value="t10">T10</div>
                            <div class="training-custom-option active" data-value="t11">T11</div>
                            <div class="training-custom-option" data-value="t12">T12</div>
                        </div>
                    </div>
                    <input type="hidden" id="s2_tier" value="t11">
                </div>
                <div class="select-group"><label>${T("lblCap")}</label><input type="text" inputmode="numeric" id="s2_cap" class="action-btn" placeholder="0"></div>
            </div>
            <div class="gear-grid" style="margin-top:15px;border-top:1px solid rgba(255,255,255,0.05);padding-top:15px;">
                <div class="select-group"><label>% ${T("troopInf")}</label><input type="text" inputmode="numeric" id="s2_pInf" placeholder="50" class="action-btn"></div>
                <div class="select-group"><label>% ${T("troopLanc")}</label><input type="text" inputmode="numeric" id="s2_pLanc" placeholder="20" class="action-btn"></div>
                <div class="select-group"><label>% ${T("troopMark")}</label><input type="text" inputmode="numeric" id="s2_pMark" placeholder="30" class="action-btn"></div>
            </div>
        </div>
        <div class="gear-grid">
            <div class="gear-card" style="border-top:3px solid #81E013;"><div class="gear-card-header"><h4 style="color:#81E013;">${T("troopInf")}</h4></div><div id="res2_inf"></div></div>
            <div class="gear-card" style="border-top:3px solid #00ccff;"><div class="gear-card-header"><h4 style="color:#00ccff;">${T("troopLanc")}</h4></div><div id="res2_lanc"></div></div>
            <div class="gear-card" style="border-top:3px solid #ffcc00;"><div class="gear-card-header"><h4 style="color:#ffcc00;">${T("troopMark")}</h4></div><div id="res2_mark"></div></div>
        </div>`;
    },

    _tab3Html() {
        const T = k => I18N.t(k);
        const types = [{
            id: "inf",
            color: "#81E013",
            name: T("troopInf"),
            emoji: "🛡️"
        }, {
            id: "lanc",
            color: "#4fc3ff",
            name: T("troopLanc"),
            emoji: "⚔️"
        }, {
            id: "mark",
            color: "#ffcc00",
            name: T("troopMark"),
            emoji: "🏹"
        }];
        return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;">
            ${types.map(t => `
            <div class="card" style="border-top:3px solid ${t.color};">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:12px;">
                    <span style="font-size:24px;">${t.emoji}</span>
                    <h3 style="color:${t.color};font-size:18px;font-weight:700;">${t.name}</h3>
                </div>
                <div class="input-group" style="margin-bottom:12px;">
                    <label style="font-size:12px;color:#b5c3d7; display:flex; align-items:center; gap:6px; margin-bottom:6px;">
                        <span style="width:8px; height:8px; border-radius:50%; background:#888; display:inline-block;"></span>
                        T10 ➔ T12
                    </label>
                    <input type="text" inputmode="numeric" id="u_t10_${t.id}" placeholder="0" class="action-btn" style="width:100%;">
                </div>
                <div class="input-group" style="margin-bottom:15px;">
                    <label style="font-size:12px;color:#b5c3d7; display:flex; align-items:center; gap:6px; margin-bottom:6px;">
                        <span style="width:8px; height:8px; border-radius:50%; background:#4fc3ff; display:inline-block;"></span>
                        T11 ➔ T12
                    </label>
                    <input type="text" inputmode="numeric" id="u_t11_${t.id}" placeholder="0" class="action-btn" style="width:100%;">
                </div>
                <div id="res3_${t.id}" style="margin-top:15px;border-top:1px solid rgba(255,255,255,0.05);padding-top:10px;"></div>
            </div>`).join("")}
        </div>`;
    },

    _tab4Html() {
        const T = k => I18N.t(k);
        return `
        <div class="gear-card-header" style="margin-bottom:15px;">
            <h3 style="font-size:18px;color:#b5c3d7;">${T("s4Title")}</h3>
            <button class="action-btn" onclick="TrainingManager.resetSection(4)">${T("resetBtn")}</button>
        </div>

        <!-- Step 1: Power Targets -->
        <div class="total-cost-panel" style="margin-bottom:20px; border-left:3px solid #ff6b6b;">
            <h3 style="color:#ff6b6b; margin-bottom:15px; font-size:14px; text-transform:uppercase; letter-spacing:0.5px; display:flex; align-items:center; gap:8px;">
                <span style="width:24px; height:24px; border-radius:50%; background:rgba(255,107,107,0.2); display:flex; align-items:center; justify-content:center; font-size:12px;">1</span>
                ${T("s4Step1")}
            </h3>
            <div class="gear-grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr));">
                <div class="select-group">
                    <label>${T("lblCurrentPower")}</label>
                    <input type="text" inputmode="numeric" id="s4_currentPower" class="action-btn" placeholder="0">
                </div>
                <div class="select-group">
                    <label>${T("lblTargetPower")}</label>
                    <input type="text" inputmode="numeric" id="s4_targetPower" class="action-btn" placeholder="0">
                </div>
                <div class="select-group">
                    <label style="color:#ff6b6b;">${T("lblPowerToRemove")}</label>
                    <input type="text" id="s4_powerToRemove" class="action-btn" readonly 
                        style="color:#ff6b6b; font-weight:800; background:rgba(255,107,107,0.08); cursor:default;">
                </div>
            </div>
        </div>

        <!-- Step 2: Current Troops -->
        <div class="total-cost-panel" style="margin-bottom:20px; border-left:3px solid #4fc3ff;">
            <h3 style="color:#4fc3ff; margin-bottom:15px; font-size:14px; text-transform:uppercase; letter-spacing:0.5px; display:flex; align-items:center; gap:8px;">
                <span style="width:24px; height:24px; border-radius:50%; background:rgba(79,195,255,0.2); display:flex; align-items:center; justify-content:center; font-size:12px;">2</span>
                ${T("s4Step2")}
            </h3>
            <div class="gear-grid">
                ${this._s4TroopCard("inf", "#80E012", "🛡️")}
                ${this._s4TroopCard("lanc", "#00ccff", "⚔️")}
                ${this._s4TroopCard("mark", "#ffcc00", "🏹")}
            </div>
        </div>

        <!-- Step 3: Desired Ratios -->
        <div class="total-cost-panel" style="margin-bottom:20px; border-left:3px solid #a3e635;">
            <h3 style="color:#a3e635; margin-bottom:15px; font-size:14px; text-transform:uppercase; letter-spacing:0.5px; display:flex; align-items:center; gap:8px;">
                <span style="width:24px; height:24px; border-radius:50%; background:rgba(163,230,53,0.2); display:flex; align-items:center; justify-content:center; font-size:12px;">3</span>
                ${T("s4Step3")}
            </h3>
            <div class="gear-grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr));">
                <div class="select-group">
                    <label style="color:#81E013; display:flex; align-items:center; gap:6px;">
                        <span style="font-size:16px;">🛡️</span> % ${T("troopInf")}
                    </label>
                    <input type="text" inputmode="numeric" id="s4_ratioInf" class="action-btn" placeholder="50" value="50">
                </div>
                <div class="select-group">
                    <label style="color:#00ccff; display:flex; align-items:center; gap:6px;">
                        <span style="font-size:16px;">⚔️</span> % ${T("troopLanc")}
                    </label>
                    <input type="text" inputmode="numeric" id="s4_ratioLanc" class="action-btn" placeholder="20" value="20">
                </div>
                <div class="select-group">
                    <label style="color:#ffcc00; display:flex; align-items:center; gap:6px;">
                        <span style="font-size:16px;">🏹</span> % ${T("troopMark")}
                    </label>
                    <input type="text" inputmode="numeric" id="s4_ratioMark" class="action-btn" placeholder="30" value="30">
                </div>
                <div class="select-group">
                    <label style="color:#c084fc;">${T("lblRatioTotal")}</label>
                    <input type="text" id="s4_ratioTotal" class="action-btn" readonly 
                        style="font-weight:800; background:rgba(192,132,252,0.08); cursor:default;">
                </div>
            </div>
        </div>

        <!-- Results Cards - REDESIGNED with t4-result-card class -->
        <div class="gear-grid" style="margin-top:20px;">
            <div class="t4-result-card" id="t4_card_inf">
                <div class="t4-result-header">
                    <span class="t4-emoji">🛡️</span>
                    <span class="t4-title" style="color:#81E013;">${T("troopInf")}</span>
                </div>
                <div id="res4_inf"></div>
            </div>
            <div class="t4-result-card" id="t4_card_lanc">
                <div class="t4-result-header">
                    <span class="t4-emoji">⚔️</span>
                    <span class="t4-title" style="color:#00ccff;">${T("troopLanc")}</span>
                </div>
                <div id="res4_lanc"></div>
            </div>
            <div class="t4-result-card" id="t4_card_mark">
                <div class="t4-result-header">
                    <span class="t4-emoji">🏹</span>
                    <span class="t4-title" style="color:#ffcc00;">${T("troopMark")}</span>
                </div>
                <div id="res4_mark"></div>
            </div>
        </div>

        <!-- Grand Total for Tab 4 -->
        <div id="s4_grand_total" class="total-cost-panel" style="margin-top:20px; border-left:3px solid #ff6b6b;"></div>
        `;
    },

    _s4TroopCard(type, color, emoji) {
        const T = k => I18N.t(k);
        const names = {
            inf: T("troopInf"),
            lanc: T("troopLanc"),
            mark: T("troopMark")
        };
        return `
        <div class="gear-card" style="border-top:3px solid ${color};">
            <div class="gear-card-header" style="border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:12px; margin-bottom:16px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:28px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));">${emoji}</span>
                    <h4 style="color:${color}; font-size:20px;">${names[type]}</h4>
                </div>
            </div>
            <div class="select-group" style="margin-bottom:12px;">
                <label style="display:flex; align-items:center; gap:6px;">
                    <span style="width:8px; height:8px; border-radius:50%; background:#888; display:inline-block;"></span>
                    ${T("lblT10")}
                </label>
                <input type="text" inputmode="numeric" id="s4_${type}_t10" class="action-btn" placeholder="0">
            </div>
            <div class="select-group" style="margin-bottom:12px;">
                <label style="display:flex; align-items:center; gap:6px;">
                    <span style="width:8px; height:8px; border-radius:50%; background:#4fc3ff; display:inline-block;"></span>
                    ${T("lblT11")}
                </label>
                <input type="text" inputmode="numeric" id="s4_${type}_t11" class="action-btn" placeholder="0">
            </div>
            <div class="select-group" style="margin-bottom:4px;">
                <label style="display:flex; align-items:center; gap:6px;">
                    <span style="width:8px; height:8px; border-radius:50%; background:#ffcc00; display:inline-block;"></span>
                    ${T("lblT12")}
                </label>
                <input type="text" inputmode="numeric" id="s4_${type}_t12" class="action-btn" placeholder="0">
            </div>
        </div>`;
    },

    // ─── Gear View ────────────────────────────────────────────────────────────

    renderGearView() {
        const container = document.getElementById("gear_upgradeView");
        if (!container || container.innerHTML.trim() !== "")
            return;
        const T = k => I18N.t(k);

        container.innerHTML = `
            <div class="view-header" style="margin-bottom:20px;">
                <button class="back-btn" onclick="goHome()"><img src="assets/icons/common_btn_left.png" class="back-btn-icon" alt=""> ${T("back")}</button>
                <h2 style="font-size:32px;margin-top:10px;">${T("gearTitle")}</h2>
            </div>

            <div class="gear-global-controls">
                <button class="action-btn" onclick="GearManager.selectAll()"
                    style="background:rgba(79,195,255,0.1);color:#4fc3ff;">${T("selectAll")}</button>
                <button class="action-btn" onclick="GearManager.resetAll()"
                    style="background:rgba(244,63,94,0.1);color:#f43f5e;">${T("reset")}</button>
            </div>

            <!-- Mobile: Grand Total at top -->
            <div class="gear-mobile-total-top">
                <div class="gear-interactive-card" style="margin-bottom:20px;">
                    <h3 style="color:#4fc3ff;font-size:16px;font-weight:700;margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
                        <span>💎 ${T("totalResources")}</span>
                        <span style="display:flex;gap:8px;">
                            <button id="gearCopyBtnMobile" class="action-btn totals-mini-btn" onclick="GearManager.copyTotal()">📋 ${T("copy")}</button>
                            <button class="action-btn totals-mini-btn totals-mini-btn-danger" onclick="GearManager.resetAll()">↺ ${T("reset")}</button>
                        </span>
                    </h3>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;">
                        ${this._gearResourceTotal("total_alloy_mobile", T("alloy"), "#ffffff", window.__gearResImg_alloy)}
                        ${this._gearResourceTotal("total_solution_mobile", T("polishSolution"), "#ffcc00", window.__gearResImg_solution)}
                        ${this._gearResourceTotal("total_plans_mobile", T("designPlans"), "#22c55e", window.__gearResImg_plans)}
                        ${this._gearResourceTotal("total_amber_mobile", T("lunarAmber"), "#f43f5e", window.__gearResImg_amber)}
                    </div>
                </div>
            </div>

            <div class="gear-grid-wrap">
                <div class="gear-grid-layout" id="gear_items_grid"></div>
            </div>

            <!-- Desktop: Grand Total at bottom -->
            <div class="gear-desktop-total-bottom">
                <div class="gear-interactive-card" style="margin-top:25px;">
                    <h3 style="color:#4fc3ff;font-size:16px;font-weight:700;margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
                        <span>💎 ${T("totalResources")}</span>
                        <span style="display:flex;gap:8px;">
                            <button id="gearCopyBtn" class="action-btn totals-mini-btn" onclick="GearManager.copyTotal()">📋 ${T("copy")}</button>
                            <button class="action-btn totals-mini-btn totals-mini-btn-danger" onclick="GearManager.resetAll()">↺ ${T("reset")}</button>
                        </span>
                    </h3>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:15px;">
                        ${this._gearResourceTotal("total_alloy", T("alloy"), "#ffffff", window.__gearResImg_alloy)}
                        ${this._gearResourceTotal("total_solution", T("polishSolution"), "#ffcc00", window.__gearResImg_solution)}
                        ${this._gearResourceTotal("total_plans", T("designPlans"), "#22c55e", window.__gearResImg_plans)}
                        ${this._gearResourceTotal("total_amber", T("lunarAmber"), "#f43f5e", window.__gearResImg_amber)}
                    </div>
                </div>
            </div>
        `;
    },

    _gearResourceTotal(valueId, label, color, iconPath) {
        const iconHtml = iconPath ? `<img src="${iconPath}" alt="" style="width:36px;height:36px;object-fit:contain;filter:drop-shadow(0 2px 5px rgba(0,0,0,0.25));margin-bottom:4px;" onerror="this.style.display='none'">` : "";
        return `
        <div class="resource-total" style="display:flex;flex-direction:column;align-items:center;text-align:center;">
            ${iconHtml}
            <div class="gear-res-label" style="font-size:11px;color:#b5c3d7;margin-bottom:4px;">${label}</div>
            <div id="${valueId}" class="value" style="color:${color};font-size:20px;font-weight:800;">0</div>
        </div>`;
    },

    renderCharmsView() {
        const container = document.getElementById("charmsView");
        if (!container || container.innerHTML.trim() !== "")
            return;
        const T = k => I18N.t(k);
        const badgeIcon = (type) => (window.charmLevelIcons && window.charmLevelIcons[type] && window.charmLevelIcons[type][1]) || "";

        container.innerHTML = `
        <div class="view-header">
            <button class="back-btn" onclick="goHome()"><img src="assets/icons/common_btn_left.png" class="back-btn-icon" alt=""> ${T("back")}</button>
            <h2>${T("charmsTitle")}</h2>
        </div>

        <!-- Triangle troop selector -->
        <div class="charm-triangle">
            <div class="charm-badge-wrap charm-badge-top">
                <div class="charm-badge inf-badge" id="charmBadge_inf" onclick="CharmsManager.selectType('inf')">
                    <img id="charmBadgeImg_inf" src="${badgeIcon('inf')}" alt="">
                </div>
                <div class="charm-badge-name inf-color">${T("troopInf")}</div>
            </div>
            <div class="charm-badge-wrap charm-badge-left">
                <div class="charm-badge lanc-badge" id="charmBadge_lanc" onclick="CharmsManager.selectType('lanc')">
                    <img id="charmBadgeImg_lanc" src="${badgeIcon('lanc')}" alt="">
                </div>
                <div class="charm-badge-name lanc-color">${T("troopLanc")}</div>
            </div>
            <div class="charm-triangle-center"></div>
            <div class="charm-badge-wrap charm-badge-right">
                <div class="charm-badge mark-badge" id="charmBadge_mark" onclick="CharmsManager.selectType('mark')">
                    <img id="charmBadgeImg_mark" src="${badgeIcon('mark')}" alt="">
                </div>
                <div class="charm-badge-name mark-color">${T("troopMark")}</div>
            </div>
        </div>

        <!-- Active troop panel: one fixed container with all 6 charm slots -->
        ${["inf", "lanc", "mark"].map(type => `
        <div class="charms-group-panel" id="charmsGroupPanel_${type}" style="display:${type === "inf" ? "" : "none"};">
            <div class="charms-panel-title ${type}-color">${T("troop" + type.charAt(0).toUpperCase() + type.slice(1))}</div>
            <div class="charms-group-cards" id="charmsGroupCards_${type}"></div>
        </div>
        `).join("")}

        <!-- Grand total -->
        <div class="charms-grand-total">
            <h3 style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
                <span>💎 ${T("charmsTotal")}</span>
                <span style="display:flex;gap:8px;">
                    <button id="charmsCopyBtn" class="action-btn totals-mini-btn" onclick="CharmsManager.copyTotal()">📋 ${T("copy")}</button>
                    <button class="action-btn totals-mini-btn totals-mini-btn-danger" onclick="CharmsManager.resetAll()">↺ ${T("reset")}</button>
                </span>
            </h3>
            <div class="charms-totals-grid">
                <div class="resource-total" style="display:flex;flex-direction:column;align-items:center;text-align:center;">
                    <img src="${window.__charmMatImg_guide || ""}" alt="" style="width:32px;height:32px;object-fit:contain;margin-bottom:4px;">
                    <div class="label">${T("charmsGuide")}</div>
                    <div class="value" style="color:#fff;" id="charmGrand_guide">0</div>
                </div>
                <div class="resource-total" style="display:flex;flex-direction:column;align-items:center;text-align:center;">
                    <img src="${window.__charmMatImg_design || ""}" alt="" style="width:32px;height:32px;object-fit:contain;margin-bottom:4px;">
                    <div class="label">${T("charmsDesign")}</div>
                    <div class="value" style="color:#ffcc00;" id="charmGrand_design">0</div>
                </div>
                <div class="resource-total" style="display:flex;flex-direction:column;align-items:center;text-align:center;">
                    <img src="${window.__charmMatImg_secrets || ""}" alt="" style="width:32px;height:32px;object-fit:contain;margin-bottom:4px;">
                    <div class="label">${T("charmsSecrets")}</div>
                    <div class="value" style="color:#f43f5e;" id="charmGrand_secret">0</div>
                </div>
                <div class="resource-total" style="display:flex;flex-direction:column;align-items:center;text-align:center;">
                    <div class="label">${T("power")}</div>
                    <div class="value" style="color:#5fe016;" id="charmGrand_power">0</div>
                </div>
            </div>
        </div>
    `;
    },
    renderExpertsView() {
        const container = document.getElementById("expertsView");
        if (!container || container.innerHTML.trim() !== "")
            return;
        const T = k => I18N.t(k);

        container.innerHTML = `
        <div class="view-header">
            <button class="back-btn" onclick="goHome()"><img src="assets/icons/common_btn_left.png" class="back-btn-icon" alt=""> ${T("back")}</button>
            <h2>${T("expertsTitle")}</h2>
        </div>

        <!-- Selection grid -->
        <div id="expertsSelectionScreen">
            <div class="expert-selection-grid" id="expertsSelectionGrid"></div>
        </div>

        <!-- Overview (hidden until an expert is chosen) -->
        <div id="expertsOverviewScreen" style="display:none;">
            <button class="back-btn expert-back-btn" onclick="ExpertsManager.backToSelection()"><img src="assets/icons/common_btn_left.png" class="back-btn-icon" alt=""> ${T("expertsChoose")}</button>
            <div class="expert-overview-portrait-wrap">
                <div class="expert-overview-glow"></div>
                <img id="expertOverviewPortrait" class="expert-overview-portrait" src="" alt="">
            </div>
            <h3 id="expertOverviewName" class="expert-overview-name"></h3>

            <div class="expert-mode-switch">
                <button class="expert-mode-btn" data-mode="affinity" onclick="ExpertsManager.selectMode('affinity')">${T("expertsAffinityCalc")}</button>
                <button class="expert-mode-btn" data-mode="skills" onclick="ExpertsManager.selectMode('skills')">${T("expertsSkillsCalc")}</button>
            </div>

            <div id="expertModeContent"></div>
        </div>
    `;
    },


};

window.Renderers = Renderers;