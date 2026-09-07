/* =========================================================
   gift.js
   Renders the Gift page: a big centered line fades in first
   ("มีของขวัญให้เธอด้วยยย"), then makes way for a wrapped parcel
   that scales/fades into the same spot. Tapping the parcel plays
   an opening animation (lid + bow lift off, the bouquet rises up
   out of the box) and reveals a closing caption underneath.

   All the wording lives directly in pages/gift.html (there's no
   branching or repeatable data here the way chat-data.js/
   quiz-data.js/timeline-data.js have) — this file only knows the
   *timing and sequencing* of the animation, same split the rest
   of the site uses between content and rendering.
   ========================================================= */

const Gift = (() => {
    // How long the big intro line stays on screen before making
    // way for the box.
    const INTRO_HOLD_MS = 1800;
    // Small gap after the intro finishes fading out before the
    // box starts scaling/fading in, so the two never overlap.
    const BOX_REVEAL_DELAY_MS = 250;
    // How many ms apart each character of the intro line appears.
    const INTRO_CHAR_STEP_MS = 35;
    // How long after tapping the box the closing caption fades in
    // — gives the lid/flower/heart-burst animation room to breathe
    // before the full-screen message takes over.
    const CAPTION_DELAY_MS = 1400;
    // How many ms apart each character of the caption appears —
    // the smaller this is, the faster the "typing" reads.
    const CAPTION_CHAR_STEP_MS = 35;

    let introEl = null;
    let introTextEl = null;
    let boxWrap = null;
    let boxBtn = null;
    let hintEl = null;
    let captionEl = null;
    let captionTextEl = null;

    let introTimer = null;
    let boxRevealTimer = null;
    let captionTimer = null;
    let hasOpened = false;

    function init() {
        introEl = document.querySelector('[data-gift-intro]');
        introTextEl = document.querySelector('[data-gift-intro-text]');
        boxWrap = document.querySelector('[data-gift-box-wrap]');
        boxBtn = document.querySelector('[data-gift-box]');
        hintEl = document.querySelector('[data-gift-hint]');
        captionEl = document.querySelector('[data-gift-caption]');
        captionTextEl = document.querySelector('[data-gift-caption-text]');

        if (!introEl || !boxWrap || !boxBtn) {
            return; // not on the gift page
        }

        // Fresh visit — reset state/timers left over from a
        // previous time this page was shown, since the module
        // isn't re-created from scratch on an SPA swap.
        window.clearTimeout(introTimer);
        window.clearTimeout(boxRevealTimer);
        window.clearTimeout(captionTimer);
        hasOpened = false;

        introEl.classList.remove('is-visible', 'is-leaving');
        boxWrap.classList.remove('is-visible');
        boxBtn.classList.remove('is-open');
        boxBtn.disabled = false;
        if (hintEl) hintEl.textContent = 'แตะกล่องเพื่อเปิด';
        if (captionEl) captionEl.classList.remove('is-visible');

        // Step 1: the big line fades in on its own, a frame after
        // paint so the transition actually plays. Its text types
        // itself in left to right on the same frame.
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                introEl.classList.add('is-visible');
                if (introTextEl && typeof Animations !== 'undefined') {
                    Animations.revealTextByChar(introTextEl, { stepMs: INTRO_CHAR_STEP_MS });
                }
            });
        });

        // Step 2: once it's had its moment, fade it out and bring
        // the box into the same spot.
        introTimer = window.setTimeout(() => {
            introEl.classList.add('is-leaving');
            introEl.classList.remove('is-visible');

            boxRevealTimer = window.setTimeout(() => {
                boxWrap.classList.add('is-visible');
            }, BOX_REVEAL_DELAY_MS);
        }, INTRO_HOLD_MS);

        boxBtn.addEventListener('click', handleBoxTap);
    }

    function handleBoxTap() {
        if (hasOpened) return;
        hasOpened = true;

        boxBtn.classList.add('is-open');
        boxBtn.disabled = true;
        if (hintEl) hintEl.textContent = 'อย่าลืมแกะ กล่องของขวัญนะ';

        if (typeof Animations !== 'undefined') {
            Animations.burstHearts();
        }

        captionTimer = window.setTimeout(() => {
            if (captionEl) captionEl.classList.add('is-visible');
            if (captionTextEl && typeof Animations !== 'undefined') {
                Animations.revealTextByChar(captionTextEl, { stepMs: CAPTION_CHAR_STEP_MS });
            }
        }, CAPTION_DELAY_MS);
    }

    return { init };
})();
