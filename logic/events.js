// =========================
// EVENTS MANAGER — Flexible Countdown Engine
// =========================

const EventsManager = {
    updateInterval: null,
    renderInterval: null,
    featuredEventId: null,
    carouselPosition: 0,
    _initialized: false,

    // ─── Manually set the featured event by its id ────────────────────────────
    // Change this to any event id from eventsData to pin it as featured,
    // or set to null to let the system auto-pick the first active event.
    FEATURED_EVENT_ID: null, // e.g. "svs" or "sunfire_castle"

    // Safe I18N access with fallback
    _t(key, fallback) {
        if (typeof I18N !== "undefined" && I18N.t) {
            const val = I18N.t(key);
            if (val) return val;
        }
        return fallback !== undefined ? fallback : key;
    },

    // ─── Core: find the next start/end for an event from "now" ───────────────

    getNextOccurrence(event, nowMs) {
        const { startDate, startTime, durationH } = event.schedule;
        const { type, every = 1 } = event.repeat;

        const [sy, sm, sd] = startDate.split("-").map(Number);
        const [sh, smin] = startTime.split(":").map(Number);

        // Anchor: first occurrence start (UTC ms)
        let anchor = Date.UTC(sy, sm - 1, sd, sh, smin, 0, 0);
        const durationMs = (durationH || 0) * 3600000;

        // Step size in ms
        const stepMs = (() => {
            switch (type) {
                case "daily":    return every * 86400000;
                case "weekly":   return every * 7 * 86400000;
                case "biweekly": return 14 * 86400000;
                case "monthly":  return null; // handled specially
                case "once":     return Infinity;
                default:         return 86400000;
            }
        })();

        // Advance month by month until the event at d hasn't ended yet.
        // Never searches backward from the anchor — same behaviour as
        // daily/weekly/biweekly logic.
        const advanceMonths = (baseMs, targetMs) => {
            let d = new Date(baseMs);
            while (d.getTime() + durationMs <= targetMs) {
                d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(),
                                      d.getUTCHours(), d.getUTCMinutes()));
            }
            return d.getTime();
        };

        let startMs;

        if (type === "monthly") {
            startMs = advanceMonths(anchor, nowMs);
        } else if (stepMs === Infinity) {
            startMs = anchor;
        } else {
            // Fast-forward anchor until end >= now
            if (stepMs > 0) {
                const elapsed = nowMs - anchor;
                if (elapsed > 0) {
                    const periods = Math.floor(elapsed / stepMs);
                    anchor += periods * stepMs;
                }
            }
            startMs = anchor;
            if (startMs + durationMs <= nowMs) {
                startMs += stepMs; // jump to next occurrence
            }
        }

        const endMs = durationMs > 0 ? startMs + durationMs : startMs;
        const isActive = nowMs >= startMs && nowMs < endMs;

        return { startMs, endMs, isActive };
    },

    // ─── Countdown formatter ──────────────────────────────────────────────────

    formatMs(ms) {
        if (ms <= 0) return { d: 0, h: 0, m: 0, s: 0 };
        const totalSec = Math.floor(ms / 1000);
        return {
            d: Math.floor(totalSec / 86400),
            h: Math.floor((totalSec % 86400) / 3600),
            m: Math.floor((totalSec % 3600) / 60),
            s: totalSec % 60
        };
    },

    pad(n) { return String(n).padStart(2, "0"); },

    renderCountdown(ms) {
        const t = this.formatMs(ms);
        let parts = [];
        if (t.d > 0) parts.push(`<span>${t.d}</span><span class="sep">d</span>`);
        parts.push(`<span>${this.pad(t.h)}</span><span class="sep">:</span>`);
        parts.push(`<span>${this.pad(t.m)}</span><span class="sep">:</span>`);
        parts.push(`<span>${this.pad(t.s)}</span>`);
        return parts.join("");
    },

    humanTime(ms) {
        const t = this.formatMs(ms);
        const T = (k, n) => `${n} ${this._t(k, k)}`;
        if (t.d > 0)       return T("day", t.d);
        else if (t.h > 0)  return T("hour", t.h);
        else if (t.m > 0)  return T("minute", t.m);
        else               return T("second", t.s);
    },

    // ─── Badge labels ─────────────────────────────────────────────────────────

    badgeLabel(event) {
        const keys = {
            daily: "badgeDaily", weekly: "badgeWeekly",
            biweekly: "badgeBiweekly", monthly: "badgeMonthly", once: "badgeOnce"
        };
        const key = keys[event.repeat.type] || "badgeWeekly";
        return this._t(key, event.badge);
    },

    // ─── Build single event card HTML ──────────────────────────────────────────

    _buildEventCard(event, isFeatured = false) {
        const name  = this._t(event.nameKey, event.nameKey);
        const badge = this.badgeLabel(event);

        const occ = this.getNextOccurrence(event, Date.now());
        const activeClass = occ.isActive ? "event-active" : "";
        const statusText  = occ.isActive ? this._t("going", "LIVE") : this._t("upcoming", "Soon");
        const statusClass = occ.isActive ? "active" : "upcoming";

        const accentStyle = event.color
            ? `border-left: 3px solid ${event.color};`
            : "";

        return `
        <div class="event-card ${activeClass}" id="event_card_${event.id}" style="${accentStyle}">
            <div class="event-top">
                <h4 class="event-name">${name}</h4>
                <span class="event-badge" id="badge_${event.id}">${badge}</span>
            </div>
            <span class="event-status ${statusClass}" id="status_${event.id}">${statusText}</span>
            <div class="event-countdown" id="countdown_${event.id}">
                <span>00</span><span class="sep">:</span><span>00</span><span class="sep">:</span><span>00</span>
            </div>
            <div class="event-label" id="label_${event.id}">${this._t("startsIn", "Starts In")}...</div>
        </div>`;
    },

    // ─── Render Events (carousel + featured) ──────────────────────────────────

    renderEvents() {
        if (!window.eventsData) return;

        const featuredContainer = document.getElementById("eventsFeatured");
        const track = document.getElementById("eventsCarouselTrack");
        const dotsContainer = document.getElementById("carouselDots");

        if (!track) return;

        const now = Date.now();
        let featuredEvent = null;
        let carouselEvents = [];

        // Manual override: pin a specific event as featured
        if (this.FEATURED_EVENT_ID) {
            featuredEvent = window.eventsData.find(e => e.id === this.FEATURED_EVENT_ID) || null;
            carouselEvents = window.eventsData.filter(e => e.id !== this.FEATURED_EVENT_ID);
        } else {
            // Auto: find first active event for featured
            for (const e of window.eventsData) {
                const occ = this.getNextOccurrence(e, now);
                if (occ.isActive && !featuredEvent) {
                    featuredEvent = e;
                } else {
                    carouselEvents.push(e);
                }
            }
            // If no active event, don't feature any (all go to carousel)
            if (!featuredEvent && window.eventsData.length > 0) {
                carouselEvents = [...window.eventsData];
            }
        }

        // Render featured event (desktop only, hidden on mobile via CSS)
        if (featuredContainer) {
            if (featuredEvent) {
                featuredContainer.innerHTML = this._buildEventCard(featuredEvent, true);
                this.featuredEventId = featuredEvent.id;
            } else {
                featuredContainer.innerHTML = "";
                this.featuredEventId = null;
            }
        }

        // Render carousel events
        track.innerHTML = carouselEvents.map(e => this._buildEventCard(e)).join("");

        // Render dots — one per page based on actual card count
        if (dotsContainer) {
            const cardWidth = 318; // 300px card + 18px gap
            const visibleWidth = track.parentElement ? track.parentElement.offsetWidth : 800;
            const visibleCards = Math.max(1, Math.floor(visibleWidth / cardWidth));
            const totalDots = Math.max(1, Math.ceil(carouselEvents.length / visibleCards));

            dotsContainer.innerHTML = "";
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement("div");
                dot.className = "carousel-dot" + (i === 0 ? " active" : "");
                dot.onclick = () => this.scrollToDot(i, cardWidth * visibleCards);
                dotsContainer.appendChild(dot);
            }
        }
    },

    // ─── Carousel navigation ─────────────────────────────────────────────────

    scrollCarousel(direction) {
        const track = document.getElementById("eventsCarouselTrack");
        if (!track) return;
        const cardWidth = 318;
        const visibleWidth = track.parentElement ? track.parentElement.offsetWidth : 800;
        const visibleCards = Math.max(1, Math.floor(visibleWidth / cardWidth));
        const scrollAmount = cardWidth * visibleCards;

        track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });

        setTimeout(() => this._updateDots(), 350);
    },

    scrollToDot(dotIndex, scrollAmount) {
        const track = document.getElementById("eventsCarouselTrack");
        if (!track) return;
        track.scrollTo({ left: dotIndex * scrollAmount, behavior: 'smooth' });
        setTimeout(() => this._updateDots(), 350);
    },

    _updateDots() {
        const track = document.getElementById("eventsCarouselTrack");
        const dots = document.querySelectorAll(".carousel-dot");
        if (!track || !dots.length) return;

        const cardWidth = 318;
        const visibleWidth = track.parentElement ? track.parentElement.offsetWidth : 800;
        const visibleCards = Math.max(1, Math.floor(visibleWidth / cardWidth));
        const scrollAmount = cardWidth * visibleCards;

        const currentIndex = Math.round(track.scrollLeft / scrollAmount);
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        });
    },

    // ─── Update all cards ─────────────────────────────────────────────────────

    updateAllCountdowns() {
        if (!window.eventsData) return;
        const now = Date.now();

        // Update featured event
        if (this.featuredEventId) {
            const event = window.eventsData.find(e => e.id === this.featuredEventId);
            if (event) this._updateEventCard(event, now);
        }

        // Update carousel events
        window.eventsData.forEach(event => {
            if (event.id !== this.featuredEventId) {
                this._updateEventCard(event, now);
            }
        });
    },

    _updateEventCard(event, now) {
        const { startMs, endMs, isActive } = this.getNextOccurrence(event, now);

        const countdownEl = document.getElementById(`countdown_${event.id}`);
        const labelEl     = document.getElementById(`label_${event.id}`);
        const statusEl    = document.getElementById(`status_${event.id}`);
        const cardEl      = document.getElementById(`event_card_${event.id}`);

        if (!countdownEl) return;

        if (isActive) {
            const remaining = endMs - now;
            countdownEl.innerHTML = this.renderCountdown(remaining);
            if (labelEl) labelEl.textContent = `${this._t("endsIn", "Ends In")}: ${this.humanTime(remaining)}`;
            if (statusEl) {
                statusEl.textContent = this._t("going", "LIVE");
                statusEl.className = "event-status active";
            }
            if (cardEl) cardEl.classList.add("event-active");
        } else {
            const remaining = startMs - now;
            countdownEl.innerHTML = this.renderCountdown(remaining);
            if (labelEl) labelEl.textContent = `${this._t("startsIn", "Starts In")}: ${this.humanTime(remaining)}`;
            if (statusEl) {
                statusEl.textContent = this._t("upcoming", "Soon");
                statusEl.className = "event-status upcoming";
            }
            if (cardEl) cardEl.classList.remove("event-active");
        }
    },

    // ─── Init / Destroy ───────────────────────────────────────────────────────

    init() {
        // Prevent double init
        if (this._initialized) return;

        // Guard against missing data
        if (!window.eventsData || !Array.isArray(window.eventsData)) {
            console.warn("EventsManager: eventsData not available yet, retrying in 500ms...");
            setTimeout(() => this.init(), 500);
            return;
        }

        this._initialized = true;

        this.renderEvents();
        this.updateAllCountdowns();

        if (this.updateInterval) clearInterval(this.updateInterval);
        this.updateInterval = setInterval(() => this.updateAllCountdowns(), 1000);

        // Re-render every 60s to update featured event as events become active/inactive
        if (this.renderInterval) clearInterval(this.renderInterval);
        this.renderInterval = setInterval(() => this.renderEvents(), 60000);

        // Update dots on scroll
        const track = document.getElementById("eventsCarouselTrack");
        if (track) {
            track.addEventListener("scroll", () => {
                clearTimeout(this._scrollTimeout);
                this._scrollTimeout = setTimeout(() => this._updateDots(), 100);
            });
        }

        console.log("EventsManager: initialized with", window.eventsData.length, "events");
    },

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        if (this.renderInterval) {
            clearInterval(this.renderInterval);
            this.renderInterval = null;
        }
        this._initialized = false;
    }
};

window.EventsManager = EventsManager;

// ─── Auto-init ──────────────────────────────────────────────────────────────
// Automatically initialize when DOM is ready, so the caller doesn't need to
// manually call EventsManager.init().

(function() {
    function boot() {
        if (window.EventsManager && !window.EventsManager._initialized) {
            window.EventsManager.init();
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();