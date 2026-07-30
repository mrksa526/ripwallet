// =========================
// RIPWALLET - MAIN SCRIPT
// =========================

document.addEventListener("DOMContentLoaded", () => {
    // Initialize core systems
    Storage.init?.();
    State.init?.();
    I18N.init();
    Router.init();
    Animations.init();

    // Render homepage content
    Renderers.renderHomepage();

    // Initialize logic modules (they self-init on view open)
    console.log("RipWallet initialized successfully!");
});