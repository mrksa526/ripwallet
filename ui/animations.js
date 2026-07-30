// =========================
// UI ANIMATIONS
// =========================

const Animations = {
    fadeIn(element, duration = 300) {
        if (!element) return;
        element.style.opacity = "0";
        element.style.transition = `opacity ${duration}ms ease`;
        requestAnimationFrame(() => {
            element.style.opacity = "1";
        });
    },

    slideUp(element, duration = 300) {
        if (!element) return;
        element.style.transform = "translateY(20px)";
        element.style.opacity = "0";
        element.style.transition = `all ${duration}ms ease`;
        requestAnimationFrame(() => {
            element.style.transform = "translateY(0)";
            element.style.opacity = "1";
        });
    },

    pulse(element) {
        if (!element) return;
        element.style.animation = "none";
        element.offsetHeight; // trigger reflow
        element.style.animation = "gearStepPulse 1.2s infinite ease-in-out";
    },

    init() {
        // Global click-outside handler for dropdowns
        document.addEventListener("click", (e) => {
            if (!e.target.closest(".gear-select-wrapper") && !e.target.closest(".custom-dropdown-trigger")) {
                document.querySelectorAll(".gear-custom-dropdown-menu, .custom-dropdown-menu").forEach(m => m.classList.remove("show"));
                document.querySelectorAll(".gear-custom-trigger, .custom-dropdown-trigger").forEach(t => t.classList.remove("open"));
            }
        });
    }
};

window.Animations = Animations;