/* =========================================================
   navigation.js
   Owns page-to-page navigation:
     - PAGES: single lookup table of page keys -> file paths
     - goToPage(): fades the current page out, then navigates
     - state passing between pages via sessionStorage

   To add a new page in the future, add ONE line to PAGES and
   nothing else needs to change in this file.
   ========================================================= */

const Navigation = (() => {
    // Central map of every page in the site. Every path here is
    // written relative to the PROJECT ROOT (where index.html lives),
    // never relative to whichever page is currently open.
    const PAGES = {
        home: 'index.html',
        flower: 'pages/flower.html',
        page3: 'pages/page3.html',
        quiz: 'pages/quiz.html',
        photo: 'pages/photo.html',
    };

    // Because pages/*.html live one folder below the root, a root-
    // relative path like "pages/page3.html" only works correctly
    // when we're already at the root. From inside /pages/, the same
    // path needs to be prefixed with "../" or the browser resolves
    // it as /pages/pages/page3.html (the bug this fixes).
    //
    // If the folder structure ever grows deeper (e.g. pages/sub/),
    // this is the one place that needs updating.
    const ROOT_PATH = window.location.pathname.includes('/pages/') ? '../' : '';

    const STORAGE_KEY = 'anniversary:state';

    /**
     * Save small pieces of state that the next page might need
     * (e.g. "the gate was unlocked"). Kept intentionally simple:
     * one JSON blob in sessionStorage rather than query strings
     * scattered across the project.
     */
    function setState(partialState) {
        const current = getState();
        const next = Object.assign({}, current, partialState);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }

    function getState() {
        try {
            return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
        } catch (err) {
            return {};
        }
    }

    /**
     * Navigate to a page defined in PAGES, playing a short fade
     * transition first so the change doesn't feel abrupt.
     * @param {string} pageKey - a key from PAGES
     * @param {object} [state] - optional state to persist for the next page
     */
    function goToPage(pageKey, state) {
        const target = PAGES[pageKey];

        if (!target) {
            console.warn(`Navigation: unknown page key "${pageKey}"`);
            return;
        }

        if (state) {
            setState(state);
        }

        const root = document.body;
        root.classList.add('is-page-leaving');

        window.setTimeout(() => {
            window.location.href = ROOT_PATH + target;
        }, 280);
    }

    return {
        PAGES,
        goToPage,
        getState,
        setState,
    };
})();
