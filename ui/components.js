// =========================
// UI COMPONENTS - Reusable Building Blocks
// =========================

const Components = {
    // Custom dropdown component
    dropdown(id, options, selectedValue, onChange) {
        const selected = options.find(o => o.value === selectedValue) || options[0];
        let optionsHtml = options.map(o => `
            <div class="custom-option ${o.value === selectedValue ? "active" : ""}" 
                 data-value="${o.value}" 
                 onclick="Components.selectDropdownOption(this, '${id}', '${onChange}')">
                ${o.label}
            </div>
        `).join("");

        return `
            <div class="select-group" style="position:relative;">
                <div class="custom-dropdown-trigger" id="trigger_${id}" onclick="Components.toggleDropdown('${id}')">
                    <span class="selected-value-text">${selected.label}</span>
                    <svg class="dropdown-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4fc3ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <div class="custom-dropdown-menu" id="menu_${id}">${optionsHtml}</div>
            </div>
        `;
    },

    toggleDropdown(id) {
        const menu = document.getElementById(`menu_${id}`);
        const trigger = document.getElementById(`trigger_${id}`);
        if (!menu || !trigger) return;

        document.querySelectorAll(".custom-dropdown-menu").forEach(m => {
            if (m.id !== `menu_${id}`) m.classList.remove("show");
        });
        document.querySelectorAll(".custom-dropdown-trigger").forEach(t => {
            if (t.id !== `trigger_${id}`) t.classList.remove("open");
        });

        menu.classList.toggle("show");
        trigger.classList.toggle("open");
    },

    selectDropdownOption(optionElem, id, callbackName) {
        const value = optionElem.getAttribute("data-value");
        const menu = optionElem.parentElement;
        const trigger = document.getElementById(`trigger_${id}`);

        if (trigger) {
            trigger.querySelector(".selected-value-text").innerText = optionElem.innerText;
        }

        menu.querySelectorAll(".custom-option").forEach(o => o.classList.remove("active"));
        optionElem.classList.add("active");
        menu.classList.remove("show");
        if (trigger) trigger.classList.remove("open");

        // Update hidden select if exists
        const select = document.getElementById(id);
        if (select) {
            select.value = value;
            select.dispatchEvent(new Event("change"));
        }

        // Call callback if provided
        if (callbackName && window[callbackName]) {
            window[callbackName](value);
        }
    },

    // Card component for tools/events - UPDATED with image support
    card({ title, subtitle, icon, iconImg, badge, onClick, disabled = false }) {
        const disabledClass = disabled ? "disabled" : "";
        const btnText = disabled ? I18N.t("soon") : I18N.t("open");
        const clickAttr = disabled ? "" : `onclick="${onClick}"`;

        // Use image icon if provided, otherwise fallback to emoji/icon text
        const iconHtml = iconImg ? 
            `<img src="${iconImg}" class="tool-icon-img" alt="${title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
             <div class="tool-icon" style="display:none;">${icon}</div>` :
            `<div class="tool-icon">${icon}</div>`;

        return `
            <div class="tool-card ${disabledClass}" ${clickAttr}>
                <div class="tool-glow"></div>
                ${iconHtml}
                <h3 class="tool-title">${title}</h3>
                <p class="tool-desc">${subtitle}</p>
                <button class="tool-btn" ${disabled ? 'disabled' : ''}>${btnText}</button>
            </div>
        `;
    },

    // Resource display row - UPDATED with inline icon support
    resourceRow(label, value, color = "#fff") {
        // Check if label contains HTML (icon images)
        const hasHtml = typeof label === 'string' && label.includes('<');
        
        return `
            <div class="res-row" style="display:flex; justify-content:space-between; align-items:center; margin:8px 0; font-size:13px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:6px;">
                <span style="display:flex; align-items:center; gap:6px; color:#b5c3d7;">
                    ${hasHtml ? label : this.escapeHtml(label)}
                </span>
                <span style="color:${color}; font-weight:700; font-size:14px;">${value}</span>
            </div>
        `;
    },

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        if (typeof text !== 'string') return text;
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Total panel - UPDATED with icon support
    totalPanel(title, items) {
        const itemsHtml = items.map(item => {
            const iconHtml = item.icon ? 
                `<img src="${item.icon}" class="res-icon-inline" alt="" onerror="this.style.display='none'" style="width:22px; height:22px; object-fit:contain; vertical-align:middle; filter:drop-shadow(0 1px 2px rgba(0,0,0,0.2));">` : 
                '';
            
            return `
                <div style="background:rgba(0,0,0,0.2); padding:12px; border-radius:12px; text-align:center; border:1px solid rgba(255,255,255,0.03);">
                    <div style="display:flex; align-items:center; justify-content:center; gap:6px; font-size:11px; color:#b5c3d7; margin-bottom:4px;">
                        ${iconHtml}
                        <span>${item.label}</span>
                    </div>
                    <div style="font-size:18px; font-weight:800; color:${item.color}; margin-top:4px;">${item.value}</div>
                </div>
            `;
        }).join("");

        return `
            <div class="total-cost-panel">
                <h3 style="font-size:16px; font-weight:800; margin-bottom:15px; color:#4fc3ff;">${title}</h3>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(100px, 1fr)); gap:10px;">
                    ${itemsHtml}
                </div>
            </div>
        `;
    },

    // Gear resource total with icon - NEW
    gearResourceTotal(label, valueId, color, iconPath = null) {
        const iconHtml = iconPath ? 
            `<img src="${iconPath}" class="gear-res-icon" alt="" onerror="this.style.display='none'" style="width:28px; height:28px; object-fit:contain; vertical-align:middle; margin-left:8px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2));">` : 
            '';

        return `
            <div class="resource-total" style="background:rgba(255,255,255,0.02); padding:12px; border-radius:10px; border:1px solid rgba(255,255,255,0.04); text-align:center;">
                <div style="display:inline-flex; align-items:center; gap:8px; font-size:13px; color:#b5c3d7; margin-bottom:4px;">
                    ${iconHtml}
                    <span>${label}</span>
                </div>
                <div id="${valueId}" class="value" style="font-size:18px; font-weight:800; color:${color || '#fff'}; margin-top:4px;">0</div>
            </div>
        `;
    }
};

window.Components = Components;