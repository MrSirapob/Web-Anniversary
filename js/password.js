/* =========================================================
   password.js
   Owns everything about the secret-password gate (Page 1):
     - PASSWORD_CONFIG: the only place the password lives
     - numeric keypad (click / touch / keyboard)
     - password dot display
     - correct / wrong password handling
     - unlock animation, then hands off to Navigation
   ========================================================= */

// Change the password or its length here — nowhere else.
const PASSWORD_CONFIG = {
    password: '123456',
    maxLength: 6,
};

const PasswordGate = (() => {
    let currentInput = '';
    let isLocked = false; // true while the wrong-password animation plays

    let els = {};

    function init() {
        els = {
            display: document.querySelector('[data-password-display]'),
            feedback: document.querySelector('[data-password-feedback]'),
            keypad: document.querySelector('[data-keypad]'),
            pageContent: document.querySelector('[data-page-content]'),
            illustration: document.querySelector('.illustration'),
        };

        if (!els.display || !els.keypad) {
            // Not on the password page — nothing to do.
            return;
        }

        renderDots();
        bindKeypad();
        bindKeyboard();
    }

    function renderDots() {
        const dots = els.display.querySelectorAll('.password-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('is-filled', index < currentInput.length);
        });
    }

    function bindKeypad() {
        els.keypad.addEventListener('click', (event) => {
            const key = event.target.closest('[data-key]');
            if (!key || isLocked) return;
            spawnRipple(key, event);
            handleKey(key.dataset.key);
        });
    }

    /**
     * Drops a small expanding circle at the tap/click position
     * inside a keypad key, purely decorative, self-removing.
     */
    function spawnRipple(key, event) {
        const rect = key.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'keypad-ripple';
        ripple.style.left = `${event.clientX - rect.left}px`;
        ripple.style.top = `${event.clientY - rect.top}px`;
        key.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    }

    function bindKeyboard() {
        document.addEventListener('keydown', (event) => {
            if (isLocked) return;

            if (/^[0-9]$/.test(event.key)) {
                handleKey(event.key);
            } else if (event.key === 'Backspace') {
                handleKey('back');
            } else if (event.key === 'Enter') {
                checkPassword();
            }
        });
    }

    function handleKey(key) {
        if (key === 'back') {
            currentInput = currentInput.slice(0, -1);
            renderDots();
            return;
        }

        // Digit key
        if (currentInput.length < PASSWORD_CONFIG.maxLength) {
            currentInput += key;
            renderDots();

            // Auto-check once the expected number of digits is reached.
            if (currentInput.length === PASSWORD_CONFIG.maxLength) {
                window.setTimeout(checkPassword, 150);
            }
        }
    }

    function checkPassword() {
        if (currentInput.length === 0) return;

        if (currentInput === PASSWORD_CONFIG.password) {
            handleCorrectPassword();
        } else {
            handleWrongPassword();
        }
    }

    function handleCorrectPassword() {
        isLocked = true;
        showFeedback('');

        if (els.illustration) {
            els.illustration.classList.add('is-unlocked');
        }

        if (window.Animations && typeof Animations.burstHearts === 'function') {
            Animations.burstHearts();
        }

        window.setTimeout(() => {
            if (els.pageContent) {
                els.pageContent.classList.add('is-unlocking');
            }
        }, 250);

        window.setTimeout(() => {
            Navigation.goToPage('flower', { gateUnlocked: true });
        }, 700);
    }

    function handleWrongPassword() {
        isLocked = true;
        showFeedback('รหัสไม่ถูกต้อง ลองอีกครั้งนะ');

        els.display.classList.add('is-shaking');
        if (els.illustration) {
            els.illustration.classList.add('is-shaking');
        }

        window.setTimeout(() => {
            els.display.classList.remove('is-shaking');
            if (els.illustration) {
                els.illustration.classList.remove('is-shaking');
            }
            currentInput = '';
            renderDots();
            isLocked = false;
        }, 450);
    }

    function showFeedback(message) {
        if (!els.feedback) return;
        els.feedback.textContent = message;
        els.feedback.classList.toggle('is-visible', Boolean(message));
    }

    return { init };
})();
