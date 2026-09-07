/* =========================================================
   animations.js
   Small, reusable animation helpers shared by every page.
   Keep this file about *how* things move, not page-specific
   logic (that belongs in main.js or a page's own module).
   ========================================================= */

const Animations = (() => {
    /**
     * Splits text into user-perceived characters (graphemes) so
     * Thai combining vowels/tone marks stay attached to their
     * base consonant instead of being torn into their own span.
     * Falls back to a plain code-point split on older browsers
     * that lack Intl.Segmenter.
     */
    function splitGraphemes(text) {
        if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
            const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
            return Array.from(segmenter.segment(text), (s) => s.segment);
        }
        return Array.from(text);
    }

    /**
     * Reveals an element's text one character at a time, left to
     * right, by wrapping each grapheme in its own <span> and
     * staggering when it fades/slides in. The element keeps its
     * full original text as an aria-label so screen readers still
     * hear it as one sentence instead of letter-by-letter.
     *
     * Safe to call more than once (e.g. re-entering a page) — it
     * always rebuilds from the element's current text content.
     */
    function revealTextByChar(el, options = {}) {
        if (!el) return;

        const { stepMs = 35, startDelayMs = 0 } = options;
        const fullText = el.dataset.revealText || el.textContent;
        const chars = splitGraphemes(fullText);
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        el.dataset.revealText = fullText;
        el.setAttribute('aria-label', fullText);
        el.textContent = '';

        chars.forEach((ch, i) => {
            const span = document.createElement('span');
            span.className = 'char' + (ch.trim() === '' ? ' char--space' : '');
            span.textContent = ch;
            span.setAttribute('aria-hidden', 'true');
            el.appendChild(span);

            if (prefersReduced) {
                span.classList.add('is-visible');
                return;
            }

            window.setTimeout(() => {
                span.classList.add('is-visible');
            }, startDelayMs + i * stepMs);
        });
    }

    /**
     * Reveals every [data-reveal] element on the page with a
     * gentle fade + slide-up, one after another. Each element
     * can set its own delay via data-reveal-delay (ms).
     */
    function revealOnLoad() {
        const elements = document.querySelectorAll('[data-reveal]');

        elements.forEach((el) => {
            el.classList.add('fade-in-element');
            const delay = Number(el.dataset.revealDelay || 0);

            window.setTimeout(() => {
                el.classList.add('is-visible');
            }, delay);
        });
    }

    /**
     * Adds a slow, continuous floating motion to an element
     * (e.g. the illustration on the password page). Purely
     * decorative and safe to skip under reduced-motion, since
     * it is driven by the .is-floating CSS class.
     */
    function enableFloating(selector) {
        const el = document.querySelector(selector);
        if (el) {
            el.classList.add('is-floating');
        }
    }

    /**
     * Spawns a short-lived burst of little floating hearts across
     * the bottom of the screen — used to celebrate a correct
     * password, but generic enough to reuse on any page. Cleans
     * up its own DOM node once every piece has finished animating.
     */
    function burstHearts(count = 14) {
        const layer = document.createElement('div');
        layer.className = 'heart-burst';

        for (let i = 0; i < count; i += 1) {
            const piece = document.createElement('span');
            piece.className = 'heart-burst-piece';
            piece.textContent = '♥';
            piece.style.left = `${8 + Math.random() * 84}%`;
            piece.style.setProperty('--heart-size', `${14 + Math.random() * 16}px`);
            piece.style.setProperty('--heart-delay', `${Math.random() * 350}ms`);
            piece.style.setProperty('--heart-rotate', `${Math.random() * 40 - 20}deg`);
            layer.appendChild(piece);
        }

        document.body.appendChild(layer);
        window.setTimeout(() => layer.remove(), 1600);
    }

    return {
        revealOnLoad,
        enableFloating,
        burstHearts,
        revealTextByChar,
    };
})();
