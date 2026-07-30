// =========================
// GEAR UPGRADE COSTS DATA
// =========================

window.gearData = {
    // ---- GOLD TIERS (No steps, simple star upgrades) ----
    gold: {
        star1: { alloy: 23000, solution: 230, plans: 40, amber: 0 },
        star2: { alloy: 25000, solution: 250, plans: 45, amber: 0 },
        star3: { alloy: 26000, solution: 260, plans: 45, amber: 0 }
    },
    gold_t1: {
        star0: { alloy: 28000, solution: 280, plans: 45, amber: 0 },
        star1: { alloy: 30000, solution: 300, plans: 55, amber: 0 },
        star2: { alloy: 32000, solution: 320, plans: 55, amber: 0 },
        star3: { alloy: 35000, solution: 340, plans: 55, amber: 0 }
    },
    gold_t2: {
        star0: { alloy: 38000, solution: 360, plans: 55, amber: 0 },
        star1: { alloy: 43000, solution: 430, plans: 75, amber: 0 },
        star2: { alloy: 45000, solution: 460, plans: 80, amber: 0 },
        star3: { alloy: 48000, solution: 500, plans: 85, amber: 0 }
    },

    // ---- RED TIERS (Steps system) ----
    // Base upgrade only for red star0 (transition from gold_t2 star3)
    red: {
        star0: {
            base: { alloy: 50000, solution: 530, plans: 85, amber: 10 },
            step1: { alloy: 12500, solution: 132, plans: 21, amber: 2 },
            step2: { alloy: 12500, solution: 132, plans: 21, amber: 2 },
            step3: { alloy: 12500, solution: 132, plans: 21, amber: 2 },
            step4: { alloy: 12500, solution: 134, plans: 22, amber: 4 }
        },
        star1: {
            step1: { alloy: 13000, solution: 140, plans: 22, amber: 2 },
            step2: { alloy: 13000, solution: 140, plans: 22, amber: 2 },
            step3: { alloy: 13000, solution: 140, plans: 22, amber: 2 },
            step4: { alloy: 13000, solution: 140, plans: 24, amber: 4 }
        },
        star2: {
            step1: { alloy: 13500, solution: 147, plans: 23, amber: 2 },
            step2: { alloy: 13500, solution: 147, plans: 23, amber: 2 },
            step3: { alloy: 13500, solution: 147, plans: 23, amber: 2 },
            step4: { alloy: 13500, solution: 149, plans: 26, amber: 4 }
        },
        star3: {
            step1: { alloy: 14000, solution: 155, plans: 25, amber: 2 },
            step2: { alloy: 14000, solution: 155, plans: 25, amber: 2 },
            step3: { alloy: 14000, solution: 155, plans: 25, amber: 2 },
            step4: { alloy: 14000, solution: 155, plans: 25, amber: 4 }
        }
    },
    red_t1: {
        star0: {
            step1: { alloy: 14750, solution: 167, plans: 27, amber: 3 },
            step2: { alloy: 14750, solution: 167, plans: 27, amber: 3 },
            step3: { alloy: 14750, solution: 167, plans: 27, amber: 3 },
            step4: { alloy: 14750, solution: 169, plans: 29, amber: 6 }
        },
        star1: {
            step1: { alloy: 15250, solution: 175, plans: 28, amber: 3 },
            step2: { alloy: 15250, solution: 175, plans: 28, amber: 3 },
            step3: { alloy: 15250, solution: 175, plans: 28, amber: 3 },
            step4: { alloy: 15250, solution: 175, plans: 31, amber: 6 }
        },
        star2: {
            step1: { alloy: 15750, solution: 182, plans: 30, amber: 3 },
            step2: { alloy: 15750, solution: 182, plans: 30, amber: 3 },
            step3: { alloy: 15750, solution: 182, plans: 30, amber: 3 },
            step4: { alloy: 15750, solution: 184, plans: 30, amber: 6 }
        },
        star3: {
            step1: { alloy: 16250, solution: 190, plans: 31, amber: 3 },
            step2: { alloy: 16250, solution: 190, plans: 31, amber: 3 },
            step3: { alloy: 16250, solution: 190, plans: 31, amber: 3 },
            step4: { alloy: 16250, solution: 190, plans: 32, amber: 6 }
        }
    },
    red_t2: {
        star0: {
            step1: { alloy: 17000, solution: 202, plans: 33, amber: 5 },
            step2: { alloy: 17000, solution: 202, plans: 33, amber: 5 },
            step3: { alloy: 17000, solution: 202, plans: 33, amber: 5 },
            step4: { alloy: 17000, solution: 204, plans: 36, amber: 5 }
        },
        star1: {
            step1: { alloy: 17500, solution: 210, plans: 35, amber: 5 },
            step2: { alloy: 17500, solution: 210, plans: 35, amber: 5 },
            step3: { alloy: 17500, solution: 210, plans: 35, amber: 5 },
            step4: { alloy: 17500, solution: 210, plans: 35, amber: 5 }
        },
        star2: {
            step1: { alloy: 18000, solution: 217, plans: 36, amber: 5 },
            step2: { alloy: 18000, solution: 217, plans: 36, amber: 5 },
            step3: { alloy: 18000, solution: 217, plans: 36, amber: 5 },
            step4: { alloy: 18000, solution: 219, plans: 37, amber: 5 }
        },
        star3: {
            step1: { alloy: 18500, solution: 225, plans: 37, amber: 5 },
            step2: { alloy: 18500, solution: 225, plans: 37, amber: 5 },
            step3: { alloy: 18500, solution: 225, plans: 37, amber: 5 },
            step4: { alloy: 18500, solution: 225, plans: 39, amber: 5 }
        }
    },
    red_t3: {
        star0: {
            step1: { alloy: 19250, solution: 237, plans: 40, amber: 6 },
            step2: { alloy: 19250, solution: 237, plans: 40, amber: 6 },
            step3: { alloy: 19250, solution: 237, plans: 40, amber: 6 },
            step4: { alloy: 19250, solution: 239, plans: 40, amber: 7 }
        },
        star1: {
            step1: { alloy: 20000, solution: 247, plans: 41, amber: 6 },
            step2: { alloy: 20000, solution: 247, plans: 41, amber: 6 },
            step3: { alloy: 20000, solution: 247, plans: 41, amber: 6 },
            step4: { alloy: 20000, solution: 249, plans: 42, amber: 7 }
        },
        star2: {
            step1: { alloy: 20750, solution: 257, plans: 42, amber: 6 },
            step2: { alloy: 20750, solution: 257, plans: 42, amber: 6 },
            step3: { alloy: 20750, solution: 257, plans: 42, amber: 6 },
            step4: { alloy: 20750, solution: 259, plans: 44, amber: 7 }
        },
        star3: {
            step1: { alloy: 21500, solution: 267, plans: 45, amber: 6 },
            step2: { alloy: 21500, solution: 267, plans: 45, amber: 6 },
            step3: { alloy: 21500, solution: 267, plans: 45, amber: 6 },
            step4: { alloy: 21500, solution: 269, plans: 45, amber: 7 }
        }
    },
    red_t4: {
        star0: {
            step1: { alloy: 24000, solution: 300, plans: 50, amber: 8 },
            step2: { alloy: 24000, solution: 300, plans: 50, amber: 8 },
            step3: { alloy: 24000, solution: 300, plans: 50, amber: 8 },
            step4: { alloy: 24000, solution: 300, plans: 50, amber: 8 },
            step5: { alloy: 24000, solution: 300, plans: 50, amber: 8 }
        },
        star1: {
            step1: { alloy: 28000, solution: 330, plans: 55, amber: 8 },
            step2: { alloy: 28000, solution: 330, plans: 55, amber: 8 },
            step3: { alloy: 28000, solution: 330, plans: 55, amber: 8 },
            step4: { alloy: 28000, solution: 330, plans: 55, amber: 8 },
            step5: { alloy: 28000, solution: 330, plans: 55, amber: 8 }
        },
        star2: {
            step1: { alloy: 32000, solution: 360, plans: 60, amber: 8 },
            step2: { alloy: 32000, solution: 360, plans: 60, amber: 8 },
            step3: { alloy: 32000, solution: 360, plans: 60, amber: 8 },
            step4: { alloy: 32000, solution: 360, plans: 60, amber: 8 },
            step5: { alloy: 32000, solution: 360, plans: 60, amber: 8 }
        },
        star3: {
            step1: { alloy: 36000, solution: 390, plans: 65, amber: 8 },
            step2: { alloy: 36000, solution: 390, plans: 65, amber: 8 },
            step3: { alloy: 36000, solution: 390, plans: 65, amber: 8 },
            step4: { alloy: 36000, solution: 390, plans: 65, amber: 8 },
            step5: { alloy: 36000, solution: 390, plans: 65, amber: 8 }
        }
    }
};