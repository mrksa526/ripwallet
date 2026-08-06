// =========================
// TROOP TRAINING DATA
// =========================

// =========================
// FC LEVEL POWER TABLE
// =========================
// FC (Furnace / Fire Crystal) level changes ONLY the power value of T10/T11
// troops. T12 power is fixed (same value regardless of FC) and T12 troops
// only exist at FC10.
window.fcPowerTable = {
    5:  { t10: 94,  t11: 114 },
    6:  { t10: 99,  t11: 120 },
    7:  { t10: 104, t11: 126 },
    8:  { t10: 110, t11: 135 },
    9:  { t10: 115, t11: 141 },
    10: { t10: 121, t11: 148 }
};
window.FC_MIN_LEVEL = 5;
window.FC_MAX_LEVEL = 10;
window.FC_T12_UNLOCK_LEVEL = 10; // T12 troops require FC10

// =========================
// T11/T12 TRAINING RESEARCH
// =========================
// Research level 0-10, separate per troop type. Reduces T11/T12 resource
// costs only (wood/meat/coal/iron) — power and time are not affected.
// Stored troopData T11 values = cost at research level 10 (fully researched).
// At level 0, T11 cost = double the stored value.
// T12 stored values = cost at research level 10. T12's absolute reduction
// per level equals T11's absolute reduction per level.
window.TRAINING_RESEARCH_MIN = 0;
window.TRAINING_RESEARCH_MAX = 10;

// T12 Research: separate per-troop research that further reduces T12 costs
// on top of the T11-based calc, only relevant/visible when that troop's FC=10.
// Level 0 = 0% extra reduction, level 10 = 25% extra reduction (2.5%/level).
window.T12_RESEARCH_MIN = 0;
window.T12_RESEARCH_MAX = 10;

window.troopData = {
    inf: {
        t10: { wood: 2091, meat: 2788, coal: 488, iron: 102, time: 152, power: 121 },
        t11: { wood: 2614, meat: 3485, coal: 610, iron: 127, time: 180, power: 148 },
        t12: { wood: 5228, meat: 6970, coal: 1220, iron: 254, time: 215, power: 178 }
    },
    lanc: {
        t10: { wood: 2301, meat: 2440, coal: 474, iron: 109, time: 152, power: 121 },
        t11: { wood: 2876, meat: 3050, coal: 593, iron: 136, time: 180, power: 148 },
        t12: { wood: 5751, meat: 6099, coal: 1186, iron: 271, time: 215, power: 178 }
    },
    mark: {
        t10: { wood: 2579, meat: 1743, coal: 433, iron: 140, time: 152, power: 121 },
        t11: { wood: 3224, meat: 2179, coal: 541, iron: 175, time: 180, power: 148 },
        t12: { wood: 6447, meat: 4357, coal: 1081, iron: 349, time: 215, power: 178 }
    }
};