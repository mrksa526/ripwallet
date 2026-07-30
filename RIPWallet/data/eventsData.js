// =========================
// EVENTS DATA
// =========================
//
// SCHEDULE FIELDS:
//   startDate : "YYYY-MM-DD"  — first known UTC occurrence
//   startTime : "HH:MM"       — start time (UTC, 24h)
//   durationH : number        — duration in hours (0 = instant/reset)
//
// REPEAT FIELDS:
//   type  : "daily" | "weekly" | "biweekly" | "monthly" | "once"
//   every : number (only for "daily" and "weekly" — how many days/weeks between)
//
// EXAMPLES:
//   Arena (resets every day at 00:00 UTC)
//     schedule: { startDate:"2026-01-01", startTime:"00:00", durationH:0 }
//     repeat:   { type:"daily", every:1 }
//
//   Castle Battle (every 2 weeks, 5h window)
//     schedule: { startDate:"2026-06-07", startTime:"12:00", durationH:5 }
//     repeat:   { type:"biweekly" }
//
//   SvS (monthly, multi-day span — 6d 22h = 166h)
//     schedule: { startDate:"2026-06-14", startTime:"00:00", durationH:166 }
//     repeat:   { type:"monthly" }

window.eventsData = [
    {
        id: "sunfire_castle",
        nameKey: "eventSunfire",
        badge: "biWeekly",
        color: "#ff6b35",
        schedule: { startDate: "2026-06-20", startTime: "12:00", durationH: 5 },
        repeat: { type: "biweekly" }
    },
    {
        id: "arena",
        nameKey: "eventArena",
        badge: "daily",
        color: "#4fc3ff",
        schedule: { startDate: "2026-01-01", startTime: "00:00", durationH: 0 },
        repeat: { type: "daily", every: 1 }
    },
    {
        id: "svs",
        nameKey: "eventSvS",
        badge: "monthly",
        color: "#a855f7",
        schedule: { startDate: "2026-06-14", startTime: "00:00", durationH: 166 },
        repeat: { type: "monthly" }
    },
    {
        id: "frostmine",
        nameKey: "eventFrostmine",
        badge: "biweekly",
        color: "#22d3ee",
        schedule: { startDate: "2026-06-16", startTime: "00:00", durationH: 24 },
        repeat: { type: "biweekly" }
    },
    {
        id: "alliance_championship",
        nameKey: "eventAllianceDuel",
        badge: "weekly",
        color: "#f59e0b",
        schedule: { startDate: "2026-06-08", startTime: "00:00", durationH: 144 },
        repeat: { type: "weekly", every: 1 }
    },
    {
        id: "journeyoflight",
        nameKey: "eventJourney",
        badge: "once",
        color: "#4fc3ff",
        schedule: { startDate: "2026-06-10", startTime: "00:00", durationH: 120 },
        repeat: { type: "once" }
    },
];