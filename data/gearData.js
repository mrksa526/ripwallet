// =========================
// GEAR UPGRADE DATA (direct tier/star costs, no steps)
// Source: chief_Gear_Charm.json — costs are per-star totals from previous
// star/tier to the target. Format per star: [alloy, solution, plans, amber, statPct, power]
// =========================

window.GEAR_QUALITY_ORDER = ["green", "blue", "purple", "gold", "red"];
window.GEAR_UNLOCK_FURNACE_LEVEL = 22;

window.gearData = {
    green: {
        rarity: "Uncommon",
        tiers: [
            [[1500, 15, 0, 0, 9.35, 224400], [3800, 40, 0, 0, 12.75, 306000]],
        ]
    },
    blue: {
        rarity: "Rare",
        tiers: [
            [[7000, 70, 0, 0, 17.0, 408000], [9700, 95, 0, 0, 21.25, 510000], [0, 0, 45, 0, 25.5, 612000], [0, 0, 50, 0, 29.75, 714000]],
        ]
    },
    purple: {
        rarity: "Epic",
        tiers: [
            [[0, 0, 60, 0, 34.0, 816000], [0, 0, 70, 0, 36.89, 885360], [6500, 65, 40, 0, 39.78, 954720], [8000, 80, 50, 0, 42.67, 1024080]],
            [[10000, 95, 60, 0, 45.56, 1093440], [11000, 110, 70, 0, 48.45, 1162800], [13000, 130, 85, 0, 51.34, 1232160], [15000, 160, 100, 0, 54.23, 1301520]],
        ]
    },
    gold: {
        rarity: "Mythic",
        tiers: [
            [[22000, 220, 40, 0, 56.78, 1362720], [23000, 230, 40, 0, 59.33, 1423920], [25000, 250, 45, 0, 61.88, 1485120], [26000, 260, 45, 0, 64.43, 1546320]],
            [[28000, 280, 45, 0, 66.98, 1607520], [30000, 300, 55, 0, 69.53, 1668720], [32000, 320, 55, 0, 72.08, 1729920], [35000, 340, 55, 0, 74.63, 1791120]],
            [[38000, 360, 55, 0, 77.18, 1852320], [43000, 430, 75, 0, 79.73, 1913520], [45000, 460, 80, 0, 82.28, 1974720], [48000, 500, 85, 0, 85.0, 2040000]],
        ]
    },
    red: {
        rarity: "Legendary",
        tiers: [
            [[50000, 530, 85, 10, 89.25, 2142000], [52000, 560, 90, 10, 93.5, 2244000], [54000, 590, 95, 10, 97.75, 2346000], [56000, 620, 100, 10, 102.0, 2448000]],
            [[59000, 670, 110, 15, 106.25, 2550000], [61000, 700, 115, 15, 110.5, 2652000], [63000, 730, 120, 15, 114.75, 2754000], [65000, 760, 125, 15, 119.0, 2856000]],
            [[68000, 810, 135, 20, 123.25, 2958000], [70000, 840, 140, 20, 127.5, 3060000], [72000, 870, 145, 20, 131.75, 3162000], [74000, 900, 150, 20, 136.0, 3264000]],
            [[77000, 950, 160, 25, 140.25, 3366000], [80000, 990, 165, 25, 144.5, 3468000], [83000, 1030, 170, 25, 148.75, 3570000], [86000, 1070, 180, 25, 153.0, 3672000]],
            [[120000, 1500, 250, 40, 161.5, 3876000], [140000, 1650, 275, 40, 170.0, 4080000], [160000, 1800, 300, 40, 178.5, 4284000], [180000, 1950, 325, 40, 187.0, 4488000]],
        ]
    }
};

// Gear piece -> troop-type coloring/grouping, and display names
window.gearSlotsByTroop = {"lancer": ["cap", "watch"], "infantry": ["coat", "pants"], "marksman": ["ring", "weapon"]};
window.GEAR_PIECE_COUNT = 6;
window.CHARM_SLOTS_PER_GEAR = 3;
window.TOTAL_CHARM_SLOTS = 18;

window.gearPieceNames = {
    cap: "Helmet", watch: "Watch", coat: "Coat", pants: "Pants", ring: "Ring", weapon: "Cane"
};window.gearSequence = [
    {q:"green",t:0,s:0,alloy:1500,solution:15,plans:0,amber:0,statPct:9.35,power:224400},
    {q:"green",t:0,s:1,alloy:3800,solution:40,plans:0,amber:0,statPct:12.75,power:306000},
    {q:"blue",t:0,s:0,alloy:7000,solution:70,plans:0,amber:0,statPct:17.0,power:408000},
    {q:"blue",t:0,s:1,alloy:9700,solution:95,plans:0,amber:0,statPct:21.25,power:510000},
    {q:"blue",t:0,s:2,alloy:0,solution:0,plans:45,amber:0,statPct:25.5,power:612000},
    {q:"blue",t:0,s:3,alloy:0,solution:0,plans:50,amber:0,statPct:29.75,power:714000},
    {q:"purple",t:0,s:0,alloy:0,solution:0,plans:60,amber:0,statPct:34.0,power:816000},
    {q:"purple",t:0,s:1,alloy:0,solution:0,plans:70,amber:0,statPct:36.89,power:885360},
    {q:"purple",t:0,s:2,alloy:6500,solution:65,plans:40,amber:0,statPct:39.78,power:954720},
    {q:"purple",t:0,s:3,alloy:8000,solution:80,plans:50,amber:0,statPct:42.67,power:1024080},
    {q:"purple",t:1,s:0,alloy:10000,solution:95,plans:60,amber:0,statPct:45.56,power:1093440},
    {q:"purple",t:1,s:1,alloy:11000,solution:110,plans:70,amber:0,statPct:48.45,power:1162800},
    {q:"purple",t:1,s:2,alloy:13000,solution:130,plans:85,amber:0,statPct:51.34,power:1232160},
    {q:"purple",t:1,s:3,alloy:15000,solution:160,plans:100,amber:0,statPct:54.23,power:1301520},
    {q:"gold",t:0,s:0,alloy:22000,solution:220,plans:40,amber:0,statPct:56.78,power:1362720},
    {q:"gold",t:0,s:1,alloy:23000,solution:230,plans:40,amber:0,statPct:59.33,power:1423920},
    {q:"gold",t:0,s:2,alloy:25000,solution:250,plans:45,amber:0,statPct:61.88,power:1485120},
    {q:"gold",t:0,s:3,alloy:26000,solution:260,plans:45,amber:0,statPct:64.43,power:1546320},
    {q:"gold",t:1,s:0,alloy:28000,solution:280,plans:45,amber:0,statPct:66.98,power:1607520},
    {q:"gold",t:1,s:1,alloy:30000,solution:300,plans:55,amber:0,statPct:69.53,power:1668720},
    {q:"gold",t:1,s:2,alloy:32000,solution:320,plans:55,amber:0,statPct:72.08,power:1729920},
    {q:"gold",t:1,s:3,alloy:35000,solution:340,plans:55,amber:0,statPct:74.63,power:1791120},
    {q:"gold",t:2,s:0,alloy:38000,solution:360,plans:55,amber:0,statPct:77.18,power:1852320},
    {q:"gold",t:2,s:1,alloy:43000,solution:430,plans:75,amber:0,statPct:79.73,power:1913520},
    {q:"gold",t:2,s:2,alloy:45000,solution:460,plans:80,amber:0,statPct:82.28,power:1974720},
    {q:"gold",t:2,s:3,alloy:48000,solution:500,plans:85,amber:0,statPct:85.0,power:2040000},
    {q:"red",t:0,s:0,alloy:50000,solution:530,plans:85,amber:10,statPct:89.25,power:2142000},
    {q:"red",t:0,s:1,alloy:52000,solution:560,plans:90,amber:10,statPct:93.5,power:2244000},
    {q:"red",t:0,s:2,alloy:54000,solution:590,plans:95,amber:10,statPct:97.75,power:2346000},
    {q:"red",t:0,s:3,alloy:56000,solution:620,plans:100,amber:10,statPct:102.0,power:2448000},
    {q:"red",t:1,s:0,alloy:59000,solution:670,plans:110,amber:15,statPct:106.25,power:2550000},
    {q:"red",t:1,s:1,alloy:61000,solution:700,plans:115,amber:15,statPct:110.5,power:2652000},
    {q:"red",t:1,s:2,alloy:63000,solution:730,plans:120,amber:15,statPct:114.75,power:2754000},
    {q:"red",t:1,s:3,alloy:65000,solution:760,plans:125,amber:15,statPct:119.0,power:2856000},
    {q:"red",t:2,s:0,alloy:68000,solution:810,plans:135,amber:20,statPct:123.25,power:2958000},
    {q:"red",t:2,s:1,alloy:70000,solution:840,plans:140,amber:20,statPct:127.5,power:3060000},
    {q:"red",t:2,s:2,alloy:72000,solution:870,plans:145,amber:20,statPct:131.75,power:3162000},
    {q:"red",t:2,s:3,alloy:74000,solution:900,plans:150,amber:20,statPct:136.0,power:3264000},
    {q:"red",t:3,s:0,alloy:77000,solution:950,plans:160,amber:25,statPct:140.25,power:3366000},
    {q:"red",t:3,s:1,alloy:80000,solution:990,plans:165,amber:25,statPct:144.5,power:3468000},
    {q:"red",t:3,s:2,alloy:83000,solution:1030,plans:170,amber:25,statPct:148.75,power:3570000},
    {q:"red",t:3,s:3,alloy:86000,solution:1070,plans:180,amber:25,statPct:153.0,power:3672000},
    {q:"red",t:4,s:0,alloy:120000,solution:1500,plans:250,amber:40,statPct:161.5,power:3876000},
    {q:"red",t:4,s:1,alloy:140000,solution:1650,plans:275,amber:40,statPct:170.0,power:4080000},
    {q:"red",t:4,s:2,alloy:160000,solution:1800,plans:300,amber:40,statPct:178.5,power:4284000},
    {q:"red",t:4,s:3,alloy:180000,solution:1950,plans:325,amber:40,statPct:187.0,power:4488000},
];