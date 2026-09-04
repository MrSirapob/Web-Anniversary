/* =========================================================
   quiz.js
   Renders the quiz page one question at a time. Reads content
   entirely from QuizData (quiz-data.js) — this file only knows
   how to *display* a question, never what the questions say.

   To add, remove, or reword questions later: edit quiz-data.js
   only. This file shouldn't need to change.
   ========================================================= */

const Quiz = (() => {
    // How long the "picked" highlight holds before the card
    // transitions to the next question.
    const HOLD_ON_PICKED = 480;
    const CARD_TRANSITION_MS = 260;

    let cardHost = null;
    let progressHost = null;
    let currentIndex = 0;
    let answers = {};
    let isBusy = false;

    function init() {
        cardHost = document.querySelector('[data-quiz-card]');
        progressHost = document.querySelector('[data-quiz-progress]');
        if (!cardHost || typeof QuizData === 'undefined') {
            return; // not on the quiz page, or data failed to load
        }

        renderProgressDots();
        renderQuestion(currentIndex);
    }

    function renderProgressDots() {
        if (!progressHost) return;
        progressHost.innerHTML = '';

        QuizData.questions.forEach(() => {
            const dot = document.createElement('span');
            dot.className = 'quiz-progress-dot';
            progressHost.appendChild(dot);
        });

        updateProgressDots();
    }

    function updateProgressDots() {
        if (!progressHost) return;
        const dots = progressHost.querySelectorAll('.quiz-progress-dot');

        dots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === currentIndex);
            dot.classList.toggle('is-done', i < currentIndex);
        });
    }

    function renderQuestion(index) {
        const question = QuizData.questions[index];
        if (!question) {
            renderFinishCard();
            return;
        }

        const block = document.createElement('div');
        block.className = 'quiz-question-block';

        const title = document.createElement('h2');
        title.className = 'quiz-question';
        title.textContent = question.question;
        block.appendChild(title);

        const optionsWrap = document.createElement('div');
        optionsWrap.className = 'quiz-options';

        question.options.forEach((optionText) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'quiz-option-btn';
            btn.textContent = optionText;
            btn.addEventListener('click', () => handlePicked(question, optionText, btn, optionsWrap));
            optionsWrap.appendChild(btn);
        });

        block.appendChild(optionsWrap);
        swapCard(block);
    }

    function renderFinishCard() {
        const total = QuizData.questions.length;
        const score = QuizData.questions.reduce(
            (count, q) => count + (answers[q.id] === q.correctAnswer ? 1 : 0),
            0
        );
        const message =
            (QuizData.resultMessages && QuizData.resultMessages[score]) ||
            `ตอบถูก ${score} จาก ${total} ข้อ`;

        const block = document.createElement('div');
        block.className = 'quiz-question-block quiz-finish';

        const title = document.createElement('h2');
        title.className = 'quiz-question';
        title.textContent = 'ขอบคุณที่ตอบทุกข้อเลยนะ 🤍';
        block.appendChild(title);

        const scoreLine = document.createElement('p');
        scoreLine.className = 'quiz-score';
        scoreLine.textContent = `${score}/${total} ${message}`;
        block.appendChild(scoreLine);

        // Default hand-off is back home — change data-nav-target
        // (or point it at a new page added to Navigation.PAGES)
        // once there's somewhere further for the quiz to lead.
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-primary';
        btn.textContent = 'กลับหน้าแรก';
        btn.addEventListener('click', () => {
            if (typeof Navigation === 'undefined') return;
            btn.disabled = true;
            Navigation.goToPage('home');
        });
        block.appendChild(btn);

        if (progressHost) updateProgressDots();
        swapCard(block);
    }

    // Cross-fades the old question card out and the new one in,
    // without the page jumping while both briefly coexist (the
    // leaving card is pulled out of flow via .is-leaving in CSS).
    function swapCard(newBlock) {
        const oldBlock = cardHost.firstElementChild;
        if (oldBlock) {
            oldBlock.classList.remove('is-visible');
            oldBlock.classList.add('is-leaving');
            window.setTimeout(() => oldBlock.remove(), CARD_TRANSITION_MS);
        }

        cardHost.appendChild(newBlock);
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                newBlock.classList.add('is-visible');
            });
        });
    }

    function handlePicked(question, optionText, chosenBtn, optionsWrap) {
        if (isBusy) return;
        isBusy = true;

        answers[question.id] = optionText;
        if (typeof Navigation !== 'undefined') {
            Navigation.setState({ quizAnswers: answers });
        }

        const buttons = Array.from(optionsWrap.querySelectorAll('.quiz-option-btn'));
        buttons.forEach((btn) => {
            btn.disabled = true;
        });

        chosenBtn.classList.add('is-picked');
        buttons.forEach((btn) => {
            if (btn !== chosenBtn) btn.classList.add('is-fading');
        });

        window.setTimeout(() => {
            currentIndex += 1;
            updateProgressDots();
            isBusy = false;
            renderQuestion(currentIndex);
        }, HOLD_ON_PICKED);
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    Quiz.init();
});
