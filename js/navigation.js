/* =========================================================
   navigation.js
   Owns page-to-page navigation for the whole site, which now
   runs as a single-page app out of index.html:
     - PAGES: single lookup table of page keys -> file paths
     - goToPage(): fades the current page out, fetches the next
       page's markup (or restores the home markup), swaps it into
       [data-app-root] without a reload, then fades it back in
     - asset(): resolves an asset path correctly whether the
       current page's markup came from the root or from pages/*.html
     - state passing between pages via sessionStorage

   To add a new page in the future, add ONE line to PAGES and
   nothing else needs to change in this file (see README →
   "วิธีเพิ่มหน้าใหม่").
   ========================================================= */

const Navigation = (() => {
    // Central map of every page in the site. Every path here is
    // written relative to the PROJECT ROOT (where index.html lives).
    const PAGES = {
        home: 'index.html',
        flower: 'pages/flower.html',
        page3: 'pages/page3.html',
        quiz: 'pages/quiz.html',
        photo: 'pages/photo.html',
    };

    // True only if this script happens to be running from a page
    // opened directly out of /pages/ (a standalone fallback, e.g.
    // someone double-clicked pages/photo.html instead of going
    // through index.html). Everything in the SPA itself runs from
    // index.html at the root, where this is always false.
    const ROOT_PATH = window.location.pathname.includes('/pages/') ? '../' : '';

    const STORAGE_KEY = 'anniversary:state';

    const appRoot = document.querySelector('[data-app-root]');

    // Snapshot of the password page's markup, captured once from
    // index.html's own initial HTML so "going home" can restore it
    // instantly without a fetch. Only meaningful when appRoot exists
    // (i.e. we're actually running inside the SPA shell).
    const homeContentHTML = appRoot ? appRoot.innerHTML : '';

    // Fetched page fragments are cached after the first visit so
    // revisiting a page later doesn't re-fetch it.
    const pageCache = new Map();

    let isTransitioning = false;

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
     * Resolves an asset path (image, etc.) so it works correctly
     * from wherever the current markup happens to be running —
     * inside the SPA shell (root) or from a page opened directly
     * out of /pages/. Always pass a root-relative path, e.g.
     * Navigation.asset('assets/images/photo-1.svg').
     */
    function asset(relativePath) {
        return ROOT_PATH + relativePath;
    }

    /**
     * How long the fade/slide transition takes, read from the same
     * --transition-normal variable the CSS uses, so JS and CSS can
     * never drift out of sync with each other.
     */
    function getTransitionMs() {
        const raw = getComputedStyle(document.documentElement)
            .getPropertyValue('--transition-normal');
        const parsed = parseFloat(raw);
        return Number.isFinite(parsed) ? parsed : 300;
    }

    function prefersReducedMotion() {
        return window.matchMedia
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Some pages/*.html fragments reference assets with a "../"
     * prefix (correct when that file is opened directly out of
     * /pages/), but once injected into the SPA shell at the root,
     * those same paths need to be root-relative instead. Rewriting
     * them here means individual page files never have to worry
     * about which context they'll end up rendered in.
     */
    function fixRelativeAssetPaths(container) {
        container.querySelectorAll('[src^="../"]').forEach((el) => {
            el.setAttribute('src', el.getAttribute('src').replace(/^\.\.\//, ''));
        });
    }

    /**
     * Fetches a page's HTML file and pulls out just the markup that
     * belongs inside #app (everything in <body> except <script>
     * tags, since every script the site needs is already loaded
     * once by index.html — re-inserting them would redeclare the
     * same consts and throw).
     */
    async function fetchPageContent(pageKey, target) {
        if (pageCache.has(pageKey)) {
            return pageCache.get(pageKey);
        }

        const response = await fetch(ROOT_PATH + target);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} loading ${target}`);
        }

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        const wrapper = document.createElement('div');
        Array.from(doc.body.children)
            .filter((el) => el.tagName !== 'SCRIPT')
            .forEach((el) => wrapper.appendChild(el));

        fixRelativeAssetPaths(wrapper);

        pageCache.set(pageKey, wrapper.innerHTML);
        return wrapper.innerHTML;
    }

    /**
     * Navigate to a page defined in PAGES, playing a short fade +
     * slide transition on the way out, swapping in the new page's
     * markup without a reload, then transitioning it back in.
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

        if (isTransitioning) return;

        // No SPA shell available (e.g. this file is running from a
        // page opened directly out of /pages/) — fall back to a
        // normal navigation instead of trying to swap content that
        // doesn't exist on this page.
        if (!appRoot) {
            window.location.href = ROOT_PATH + target;
            return;
        }

        isTransitioning = true;
        const transitionMs = prefersReducedMotion() ? 0 : getTransitionMs();

        appRoot.classList.add('is-leaving');

        window.setTimeout(() => {
            const swapIn = (contentHTML) => {
                appRoot.innerHTML = contentHTML;
                document.body.dataset.page = pageKey === 'home' ? 'password' : pageKey;

                // Start the incoming content from the same hidden
                // state, then release it a frame later so it
                // transitions back to normal instead of just
                // appearing.
                appRoot.classList.add('is-entering');
                appRoot.classList.remove('is-leaving');

                window.requestAnimationFrame(() => {
                    window.requestAnimationFrame(() => {
                        appRoot.classList.remove('is-entering');
                    });
                });

                if (typeof Main !== 'undefined' && typeof Main.init === 'function') {
                    Main.init();
                }

                isTransitioning = false;
            };

            if (pageKey === 'home') {
                swapIn(homeContentHTML);
                return;
            }

            fetchPageContent(pageKey, target)
                .then(swapIn)
                .catch((err) => {
                    console.error('Navigation: failed to load page', pageKey, err);
                    // Degrade gracefully to a real navigation (e.g.
                    // if the site is opened via file:// and fetch()
                    // of local files isn't allowed) rather than
                    // leaving the person stuck on a faded-out page.
                    window.location.href = ROOT_PATH + target;
                });
        }, transitionMs);
    }

    return {
        PAGES,
        goToPage,
        getState,
        setState,
        asset,
    };
})();
