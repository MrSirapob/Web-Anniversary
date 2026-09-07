/* =========================================================
   timeline.js
   Renders the Timeline page: a small photo collage, a live
   "คบกันมาแล้ว..." counter broken down into years / months /
   days / hours / minutes / seconds (read from
   TimelineData.startDate), and an envelope that fades in a few
   seconds after the page loads. Tapping the envelope plays an
   open animation and reveals the full letter (TimelineData.
   letterText) in an overlay.

   Reads all of its content from TimelineData (timeline-data.js)
   — this file only knows how to *display* it. To change the
   date, photos, delay, or letter: edit timeline-data.js only.
   ========================================================= */

const Timeline = (() => {
    const COUNTER_TICK_MS = 1000;
    const LETTER_OPEN_DELAY_MS = 650; // lets the envelope-opening animation play first

    let collageHost = null;
    let counterEls = {};
    let envelopeWrap = null;
    let envelopeBtn = null;
    let envelopeHint = null;

    let letterOverlay = null;
    let letterText = null;

    let counterInterval = null;
    let envelopeTimer = null;
    let letterOpenTimer = null;
    let hasOpenedEnvelope = false;

    // The letter overlay's Escape handling lives on `document`, so
    // (like password.js / photo.js) it's bound at most once ever
    // rather than once per visit to this page.
    let isLetterKeydownBound = false;

    function init() {
        collageHost = document.querySelector('[data-timeline-collage]');
        envelopeWrap = document.querySelector('[data-envelope-wrap]');

        if (!collageHost || !envelopeWrap || typeof TimelineData === 'undefined') {
            return; // not on the timeline page, or data failed to load
        }

        counterEls = {
            years: document.querySelector('[data-counter="years"]'),
            months: document.querySelector('[data-counter="months"]'),
            days: document.querySelector('[data-counter="days"]'),
            hours: document.querySelector('[data-counter="hours"]'),
            minutes: document.querySelector('[data-counter="minutes"]'),
            seconds: document.querySelector('[data-counter="seconds"]'),
        };
        envelopeBtn = document.querySelector('[data-envelope-btn]');
        envelopeHint = document.querySelector('[data-envelope-hint]');

        // Fresh visit — reset state/timers left over from a
        // previous time this page was shown, since the module
        // isn't re-created from scratch on an SPA swap.
        window.clearInterval(counterInterval);
        window.clearTimeout(envelopeTimer);
        window.clearTimeout(letterOpenTimer);
        hasOpenedEnvelope = false;
        envelopeWrap.classList.remove('is-visible');
        if (envelopeBtn) {
            envelopeBtn.classList.remove('is-open');
            envelopeBtn.disabled = false;
        }

        renderCollage();
        tickCounter();
        counterInterval = window.setInterval(tickCounter, COUNTER_TICK_MS);

        envelopeTimer = window.setTimeout(() => {
            envelopeWrap.classList.add('is-visible');
        }, TimelineData.envelopeDelayMs);

        if (envelopeBtn) {
            envelopeBtn.addEventListener('click', handleEnvelopeTap);
        }

        initLetterOverlay();
    }

    function renderCollage() {
        collageHost.innerHTML = '';
        (TimelineData.collagePhotos || []).forEach((photo, index) => {
            const frame = document.createElement('div');
            frame.className = 'timeline-collage-frame';
            frame.style.setProperty('--collage-index', String(index));

            const img = document.createElement('img');
            img.src = photo.src;
            img.alt = photo.alt || 'ภาพความทรงจำ';
            frame.appendChild(img);

            collageHost.appendChild(frame);
        });
    }

    /**
     * Calendar-accurate breakdown of the time between
     * TimelineData.startDate and now — not just a total divided
     * into units, so "X ปี Y เดือน Z วัน" lines up with how a
     * person would actually count it on a calendar.
     */
    function getDetailedDiff(start, now) {
        let years = now.getFullYear() - start.getFullYear();
        let months = now.getMonth() - start.getMonth();
        let days = now.getDate() - start.getDate();
        let hours = now.getHours() - start.getHours();
        let minutes = now.getMinutes() - start.getMinutes();
        let seconds = now.getSeconds() - start.getSeconds();

        if (seconds < 0) {
            seconds += 60;
            minutes -= 1;
        }
        if (minutes < 0) {
            minutes += 60;
            hours -= 1;
        }
        if (hours < 0) {
            hours += 24;
            days -= 1;
        }
        if (days < 0) {
            // Number of days in the month right before `now`'s
            // current month, so "days" reflects a real calendar
            // month length (28-31) instead of a flat 30.
            const daysInPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            days += daysInPrevMonth;
            months -= 1;
        }
        if (months < 0) {
            months += 12;
            years -= 1;
        }

        return { years, months, days, hours, minutes, seconds };
    }

    function pad2(n) {
        return String(n).padStart(2, '0');
    }

    function tickCounter() {
        if (!TimelineData.startDate) return;
        const diff = getDetailedDiff(TimelineData.startDate, new Date());

        if (counterEls.years) counterEls.years.textContent = String(Math.max(diff.years, 0));
        if (counterEls.months) counterEls.months.textContent = String(Math.max(diff.months, 0));
        if (counterEls.days) counterEls.days.textContent = String(Math.max(diff.days, 0));
        if (counterEls.hours) counterEls.hours.textContent = pad2(Math.max(diff.hours, 0));
        if (counterEls.minutes) counterEls.minutes.textContent = pad2(Math.max(diff.minutes, 0));
        if (counterEls.seconds) counterEls.seconds.textContent = pad2(Math.max(diff.seconds, 0));
    }

    // ---- Envelope + letter ----

    function handleEnvelopeTap() {
        if (!envelopeBtn) return;

        if (hasOpenedEnvelope) {
            // Already opened once this visit — just re-show the
            // letter directly, same as tapping a printed postcard
            // again in photo.js.
            openLetter();
            return;
        }

        hasOpenedEnvelope = true;
        envelopeBtn.classList.add('is-open');
        if (envelopeHint) envelopeHint.textContent = 'กำลังเปิด...';

        letterOpenTimer = window.setTimeout(openLetter, LETTER_OPEN_DELAY_MS);
    }

    function initLetterOverlay() {
        letterOverlay = document.querySelector('[data-letter-overlay]');
        if (!letterOverlay) return;

        letterText = letterOverlay.querySelector('[data-letter-text]');
        const closeEls = letterOverlay.querySelectorAll('[data-letter-close]');
        closeEls.forEach((el) => el.addEventListener('click', closeLetter));

        if (!isLetterKeydownBound) {
            isLetterKeydownBound = true;
            document.addEventListener('keydown', handleLetterKeydown);
        }
    }

    function handleLetterKeydown(event) {
        if (!letterOverlay || !letterOverlay.classList.contains('is-open')) return;
        if (event.key === 'Escape') closeLetter();
    }

    function openLetter() {
        if (!letterOverlay) return;

        if (letterText) {
            letterText.textContent = TimelineData.letterText || '';
        }
        if (envelopeHint) envelopeHint.textContent = 'แตะซองอีกครั้งเพื่ออ่านซ้ำ';

        letterOverlay.classList.add('is-open');
        letterOverlay.setAttribute('aria-hidden', 'false');
    }

    function closeLetter() {
        if (!letterOverlay) return;
        letterOverlay.classList.remove('is-open');
        letterOverlay.setAttribute('aria-hidden', 'true');
    }

    return { init };
})();
