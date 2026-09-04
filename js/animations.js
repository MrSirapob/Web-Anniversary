/* =========================================================
   animations.js
   Small, reusable animation helpers shared by every page.
   Keep this file about *how* things move, not page-specific
   logic (that belongs in main.js or a page's own module).
   ========================================================= */

const Animations = (() => {
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

    return {
        revealOnLoad,
        enableFloating,
    };
})();
