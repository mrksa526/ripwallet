// =========================
// STATE - Global App State
// =========================

const State = {
    data: {
        training: {},
        gear: {},
        events: [],
        user: {}
    },

    get(key) {
        return this.data[key];
    },

    set(key, value) {
        this.data[key] = value;
    },

    update(key, updater) {
        if (typeof updater === "function") {
            this.data[key] = updater(this.data[key]);
        } else {
            this.data[key] = { ...this.data[key], ...updater };
        }
    }
};

window.State = State;