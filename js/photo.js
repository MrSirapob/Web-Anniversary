/* =========================================================
   photo.js
   Renders the photo-booth page: each tap on the camera plays a
   shutter-flash animation and prints ONE polaroid — the person
   taps the shutter 3 separate times to print all 3. The photos
   are fixed images (not a live camera) — the list lives in
   PhotoBoothData below, kept separate from the printing engine
   underneath it, same split used by quiz-data.js/quiz.js and
   chat-data.js/chat.js elsewhere in this project.

   To change which photos print: edit PhotoBoothData.photos
   below (swap the `src` path, or point it at a new file). You
   can also just replace the files at assets/images/photo-1.svg,
   photo-2.svg and photo-3.svg with real photos of the same
   filenames — the engine doesn't need to change either way.
   ========================================================= */

const PhotoBoothData = {
    photos: [
        { src: '../assets/images/photo-1.svg', alt: 'ภาพความทรงจำ 1' },
        { src: '../assets/images/photo-2.svg', alt: 'ภาพความทรงจำ 2' },
        { src: '../assets/images/photo-3.svg', alt: 'ภาพความทรงจำ 3' },
    ],
    // How each printed polaroid is nudged away from dead-center
    // so the 3 of them fan out instead of landing in one exact
    // pile. One entry per photo, matched by index.
    layout: [
        { shift: -58, drop: 44, rot: -9 },
        { shift: 10, drop: 78, rot: 3 },
        { shift: 66, drop: 50, rot: 11 },
    ],
};

const PhotoBooth = (() => {
    const FLASH_HOLD_MS = 260;
    const EJECT_DELAY_MS = 120;
    const DEVELOP_MS = 900;

    // Hint line shown right after each individual shot, keyed by
    // how many photos have printed so far (1-indexed by shots
    // taken). Falls back to a generic line if a count has none.
    const SHOT_HINTS = {
        1: 'ใบแรกมาแล้ว เหลืออีก 2 ใบ ถ่ายต่อเลย',
        2: 'ใบที่ 2 แล้ว เหลืออีก 1 ใบ',
    };

    let cameraBtn = null;
    let stackHost = null;
    let hint = null;
    let isBusy = false;
    let printedCount = 0;

    // Lightbox elements + state
    let lightbox = null;
    let lightboxImg = null;
    let lightboxDots = null;
    let lightboxIndex = 0;

    function init() {
        cameraBtn = document.querySelector('[data-camera-btn]');
        stackHost = document.querySelector('[data-photo-stack]');
        hint = document.querySelector('[data-photo-hint]');

        if (!cameraBtn || !stackHost || typeof PhotoBoothData === 'undefined') {
            return; // not on the photo page, or data failed to load
        }

        cameraBtn.addEventListener('click', handleShutterPress);
        initLightbox();
    }

    // Each click takes exactly ONE shot — the next photo in
    // PhotoBoothData.photos, in order — then re-arms the shutter
    // so the person can tap again for the next one.
    function handleShutterPress() {
        if (isBusy || printedCount >= PhotoBoothData.photos.length) return;
        isBusy = true;
        cameraBtn.classList.add('is-shaking');
        if (hint) hint.textContent = 'เดี๋ยวก่อนนะ...';

        triggerFlash();

        window.setTimeout(() => {
            cameraBtn.classList.remove('is-shaking');
            printOneShot();
        }, FLASH_HOLD_MS);
    }

    function printOneShot() {
        const index = printedCount;
        const photo = PhotoBoothData.photos[index];
        if (!photo) {
            finishSession();
            return;
        }

        printOnePolaroid(photo, index, () => {
            printedCount += 1;
            isBusy = false;

            if (printedCount >= PhotoBoothData.photos.length) {
                finishSession();
            } else if (hint) {
                hint.textContent = SHOT_HINTS[printedCount] || 'ถ่ายใบต่อไปได้เลย';
            }
        });
    }

    function triggerFlash() {
        const overlay = document.createElement('div');
        overlay.className = 'camera-flash';
        document.body.appendChild(overlay);

        window.requestAnimationFrame(() => overlay.classList.add('is-active'));
        window.setTimeout(() => overlay.remove(), FLASH_HOLD_MS + 160);
    }

    function printOnePolaroid(photo, index, done) {
        const layout = PhotoBoothData.layout[index] || { shift: 0, drop: 60, rot: 0 };

        const card = document.createElement('div');
        card.className = 'polaroid';
        card.style.setProperty('--shift', `${layout.shift}px`);
        card.style.setProperty('--drop', `${layout.drop}px`);
        card.style.setProperty('--rot', `${layout.rot}deg`);
        card.style.zIndex = String(index + 1);

        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.alt || 'ภาพความทรงจำ';
        card.appendChild(img);

        // Tappable once developed — reopens the lightbox at this
        // photo. Guarded on the class so a tap mid-print (while
        // it's still fading in) doesn't jump the gun.
        card.addEventListener('click', () => {
            if (!card.classList.contains('is-developed')) return;
            openLightbox(index);
        });

        stackHost.appendChild(card);

        // Double rAF so the browser commits the starting position
        // before the eject class kicks the transition off.
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                card.classList.add('is-ejecting');
            });
        });

        window.setTimeout(() => {
            card.classList.add('is-developed');
            done();
        }, EJECT_DELAY_MS + DEVELOP_MS);
    }

    function finishSession() {
        cameraBtn.disabled = true;
        if (hint) hint.textContent = 'ภาพความทรงจำของเรา 🤍';
        showHomeButton();

        // The "big reveal" — open the viewer on the full set once
        // all 3 have printed, after a short beat so it doesn't
        // interrupt the last photo's own print animation.
        window.setTimeout(() => openLightbox(0), 550);
    }

    function showHomeButton() {
        if (document.querySelector('[data-photo-home-btn]')) return;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-primary photo-home-btn';
        btn.dataset.photoHomeBtn = '';
        btn.textContent = 'กลับหน้าแรก';
        btn.addEventListener('click', () => {
            if (typeof Navigation === 'undefined') return;
            btn.disabled = true;
            Navigation.goToPage('home');
        });

        stackHost.insertAdjacentElement('afterend', btn);
        window.requestAnimationFrame(() => btn.classList.add('is-visible'));
    }

    // ---- Lightbox (photo viewer) ----
    // Opened automatically once all 3 polaroids are printed (see
    // finishSession), and re-openable afterward by tapping any
    // printed polaroid. Prev/next wrap around the 3 photos.

    function initLightbox() {
        lightbox = document.querySelector('[data-photo-lightbox]');
        if (!lightbox) return;

        lightboxImg = lightbox.querySelector('[data-lightbox-img]');
        lightboxDots = lightbox.querySelector('[data-lightbox-dots]');
        const prevBtn = lightbox.querySelector('[data-lightbox-prev]');
        const nextBtn = lightbox.querySelector('[data-lightbox-next]');
        const closeEls = lightbox.querySelectorAll('[data-lightbox-close]');

        closeEls.forEach((el) => el.addEventListener('click', closeLightbox));
        if (prevBtn) prevBtn.addEventListener('click', () => showLightboxPhoto(lightboxIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => showLightboxPhoto(lightboxIndex + 1));
        document.addEventListener('keydown', handleLightboxKeydown);

        buildLightboxDots();
    }

    function handleLightboxKeydown(event) {
        if (!lightbox || !lightbox.classList.contains('is-open')) return;

        if (event.key === 'Escape') closeLightbox();
        if (event.key === 'ArrowLeft') showLightboxPhoto(lightboxIndex - 1);
        if (event.key === 'ArrowRight') showLightboxPhoto(lightboxIndex + 1);
    }

    function buildLightboxDots() {
        if (!lightboxDots) return;
        lightboxDots.innerHTML = '';

        PhotoBoothData.photos.forEach(() => {
            const dot = document.createElement('span');
            dot.className = 'lightbox-dot';
            lightboxDots.appendChild(dot);
        });
    }

    function updateLightboxDots() {
        if (!lightboxDots) return;
        const dots = lightboxDots.querySelectorAll('.lightbox-dot');
        dots.forEach((dot, i) => dot.classList.toggle('is-active', i === lightboxIndex));
    }

    function showLightboxPhoto(index) {
        const total = PhotoBoothData.photos.length;
        lightboxIndex = (index + total) % total; // wrap around both ends

        const photo = PhotoBoothData.photos[lightboxIndex];
        if (lightboxImg && photo) {
            lightboxImg.src = photo.src;
            lightboxImg.alt = photo.alt || 'ภาพความทรงจำ';
        }
        updateLightboxDots();
    }

    function openLightbox(index) {
        // Only offer photos that have actually printed by now —
        // relevant for the tap-to-reopen path, since the auto-open
        // on finish always has all 3 ready.
        if (!lightbox || index >= printedCount) return;

        showLightboxPhoto(index);
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    PhotoBooth.init();
});
