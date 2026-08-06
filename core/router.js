// =========================
// ROUTER - View Navigation
// =========================

const Router = {
    currentView: "homepage",

    goTo(viewName) {
        this.currentView = viewName;

        // Hide homepage
        const homepage = document.getElementById("homepage");
        if (homepage) homepage.style.display = "none";

        // Hide all views
        document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));

        // Show target view
        const target = document.getElementById(viewName + "View");
        if (target) {
            target.classList.add("active");
            target.style.display = "block";
        }

        // Initialize view-specific logic
        if ((viewName === "gear" || viewName === "gear_upgrade") && window.GearManager) {
            GearManager.init();
        } else if (viewName === "training" && window.TrainingManager) {
            TrainingManager.init();
        } else if (viewName === "charms" && window.CharmsManager) {
            CharmsManager.init();
        } else if (viewName === "experts" && window.ExpertsManager) {
            ExpertsManager.init();
        }
        
        window.scrollTo(0, 0);
    },

    goHome() {
        this.currentView = "homepage";

        const homepage = document.getElementById("homepage");
        if (homepage) {
            homepage.style.display = "block";
        }

        document.querySelectorAll(".view").forEach(v => {
            v.classList.remove("active");
            if (v.id !== "homepage") v.style.display = "none";
        });

        window.scrollTo(0, 0);
    },

    init() {
        // Make functions global for onclick handlers
        window.openView = (name) => this.goTo(name);
        window.goHome = () => this.goHome();
    }
};

window.Router = Router;