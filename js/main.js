/* =========================================================
   main.js
   Single entry point for the whole site. Runs on every page,
   initializes shared modules, then hands off to whichever
   page-specific module is relevant (if the required elements
   exist on the current page).
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    Animations.revealOnLoad();

    // PasswordGate quietly no-ops on pages without a keypad.
    PasswordGate.init();

    bindNavButtons();
});

/**
 * Any button/link marked with data-nav-target="pageKey" will
 * navigate there via Navigation.goToPage, on any page, without
 * needing page-specific wiring.
 */
function bindNavButtons() {
    document.querySelectorAll('[data-nav-target]').forEach((el) => {
        el.addEventListener('click', (event) => {
            event.preventDefault();
            Navigation.goToPage(el.dataset.navTarget);
        });
    });
}
