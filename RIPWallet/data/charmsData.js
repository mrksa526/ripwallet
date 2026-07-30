// =========================
// CHARMS DATA
// =========================
// All 18 charms share identical upgrade costs.
// Levels 1–7 = zero baseline (no data needed).
// Levels 8–11 = 4 steps each, no Secrets.
// Levels 12–16 = 5 steps each, with Secrets.

window.charmsData = {
    // Format: level: { steps: N, guide: X, design: X, secrets: X }
    // Cost shown is PER STEP. Total = steps × cost.

    8:  { steps: 4, guide: 50,  design: 100, secrets: 0  },
    9:  { steps: 4, guide: 75,  design: 100, secrets: 0  },
    10: { steps: 4, guide: 105, design: 105, secrets: 0  },
    11: { steps: 4, guide: 140, design: 105, secrets: 0  },
    12: { steps: 5, guide: 116, design: 90,  secrets: 3  },
    13: { steps: 5, guide: 116, design: 90,  secrets: 6  },
    14: { steps: 5, guide: 120, design: 100, secrets: 9  },
    15: { steps: 5, guide: 120, design: 100, secrets: 14 },
    16: { steps: 5, guide: 130, design: 110, secrets: 20 }
};

// Min and max selectable level
window.CHARM_MIN_LEVEL = 7;  // baseline zero
window.CHARM_MAX_LEVEL = 16;
window.CHARM_MAX_PER_TYPE = 6;
window.CHARM_TYPES = ["inf", "lanc", "mark"];