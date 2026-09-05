/* =========================================================
   main.js
   Single entry point for the whole site. Runs on first load,
   and again every time navigation.js swaps in a new page's
   markup without a reload — initializes shared modules, then
   hands off to whichever page-specific module is relevant
   (each one quietly no-ops if its elements aren't on the
   current page).
   ========================================================= */

const Main = (() => {
    function init() {
        Animations.revealOnLoad();

        // Each of these quietly no-ops on pages without its
        // corresponding elements. Guarded with typeof (not
        // window.X): these modules are declared with `const` at
        // the top level of their own script, and unlike `var`,
        // a top-level `const`/`let` never becomes a property of
        // `window` — the bare name is still a valid reference here
        // because every script shares the page's global scope, but
        // `window.ChatStory` etc. would always be undefined.
        PasswordGate.init();
        if (typeof ChatStory !== 'undefined') ChatStory.init();
        if (typeof Quiz !== 'undefined') Quiz.init();
        if (typeof PhotoBooth !== 'undefined') PhotoBooth.init();

        bindNavButtons();
    }

    /**
     * Any button/link marked with data-nav-target="pageKey" will
     * navigate there via Navigation.goToPage, on any page, without
     * needing page-specific wiring. Re-run after every SPA swap so
     * newly-inserted buttons get bound too.
     */
    function bindNavButtons() {
        document.querySelectorAll('[data-nav-target]').forEach((el) => {
            el.addEventListener('click', (event) => {
                event.preventDefault();
                Navigation.goToPage(el.dataset.navTarget);
            });
        });
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    Main.init();
});
