// =========================
// CHARMS UPGRADE DATA (direct level costs, no steps)
// Source: chief_Gear_Charm.json — levels[L] = cost to go from level L-1 to L.
// Format: [charmDesign, charmGuide, charmSecret, statPct, power]
// =========================

window.CHARM_MAX_LEVEL = 16;
window.CHARM_MIN_LEVEL = 0;
window.CHARM_UNLOCK_FURNACE_LEVEL = 25;
window.CHARM_FULL_SET_MULTIPLIER = 18;
window.CHARM_MAX_PER_TYPE = 6;  // 2 gear pieces per troop x 3 slots each
window.CHARM_TYPES = ["inf", "lanc", "mark"];

window.charmLevels = [
    [0, 0, 0, 0, 0],
    [5, 5, 0, 9.0, 205700],
    [15, 40, 0, 12.0, 288000],
    [40, 60, 0, 16.0, 370000],
    [100, 80, 0, 19.0, 452000],
    [200, 100, 0, 25.0, 576000],
    [300, 120, 0, 30.0, 700000],
    [400, 140, 0, 35.0, 824000],
    [400, 200, 0, 40.0, 948000],
    [400, 300, 0, 45.0, 1072000],
    [420, 420, 0, 50.0, 1196000],
    [420, 560, 0, 55.0, 1320000],
    [450, 580, 15, 64.0, 1444000],
    [450, 580, 30, 73.0, 1568000],
    [500, 600, 45, 82.0, 1692000],
    [500, 600, 70, 91.0, 1816000],
    [550, 650, 100, 100.0, 1940000],
];// =========================
// CHARM LEVEL ICONS (1-16 per troop type)
// =========================
window.charmLevelIcons = {
    inf: { 1: "assets/charms/inf_1.png", 2: "assets/charms/inf_2.png", 3: "assets/charms/inf_3.png", 4: "assets/charms/inf_4.png", 5: "assets/charms/inf_5.png", 6: "assets/charms/inf_6.png", 7: "assets/charms/inf_7.png", 8: "assets/charms/inf_8.png", 9: "assets/charms/inf_9.png", 10: "assets/charms/inf_10.png", 11: "assets/charms/inf_11.png", 12: "assets/charms/inf_12.png", 13: "assets/charms/inf_13.png", 14: "assets/charms/inf_14.png", 15: "assets/charms/inf_15.png", 16: "assets/charms/inf_16.png" },
    lanc: { 1: "assets/charms/lanc_1.png", 2: "assets/charms/lanc_2.png", 3: "assets/charms/lanc_3.png", 4: "assets/charms/lanc_4.png", 5: "assets/charms/lanc_5.png", 6: "assets/charms/lanc_6.png", 7: "assets/charms/lanc_7.png", 8: "assets/charms/lanc_8.png", 9: "assets/charms/lanc_9.png", 10: "assets/charms/lanc_10.png", 11: "assets/charms/lanc_11.png", 12: "assets/charms/lanc_12.png", 13: "assets/charms/lanc_13.png", 14: "assets/charms/lanc_14.png", 15: "assets/charms/lanc_15.png", 16: "assets/charms/lanc_16.png" },
    mark: { 1: "assets/charms/mark_1.png", 2: "assets/charms/mark_2.png", 3: "assets/charms/mark_3.png", 4: "assets/charms/mark_4.png", 5: "assets/charms/mark_5.png", 6: "assets/charms/mark_6.png", 7: "assets/charms/mark_7.png", 8: "assets/charms/mark_8.png", 9: "assets/charms/mark_9.png", 10: "assets/charms/mark_10.png", 11: "assets/charms/mark_11.png", 12: "assets/charms/mark_12.png", 13: "assets/charms/mark_13.png", 14: "assets/charms/mark_14.png", 15: "assets/charms/mark_15.png", 16: "assets/charms/mark_16.png" },
};