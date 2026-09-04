/* =========================================================
   chat.js
   Renders the Page 3 conversation. Reads content and branching
   entirely from ChatStoryData (chat-data.js) — this file only
   knows how to *display* a node, never what the story says.

   To add more messages or branches later: edit chat-data.js
   only. This file shouldn't need to change.
   ========================================================= */

const ChatStory = (() => {
    // Roughly how long a "กำลังพิมพ์..." pause feels natural for a
    // given message: a little time per character, kept inside a
    // sensible min/max so short or long lines both feel right.
    const TYPING_MS_PER_CHAR = 28;
    const TYPING_MIN_MS = 650;
    const TYPING_MAX_MS = 1600;

    // Breathing room after a bubble appears, before the next thing
    // happens (next message, or the reply options).
    const PAUSE_AFTER_BUBBLE = 380;

    // Timing for the "picked" sequence: highlight the chosen option,
    // let the others fade away, then the whole dock tucks itself
    // off-screen before the reply is echoed as an outgoing bubble.
    const HOLD_ON_PICKED = 260;
    const FADE_OTHERS_MS = 220;
    const DOCK_COLLAPSE_MS = 260;

    let chatWindow = null;
    let chatDock = null;
    let isBusy = false; // guards against double taps re-triggering a branch

    function init() {
        chatWindow = document.querySelector('[data-chat-window]');
        chatDock = document.querySelector('[data-chat-dock]');
        if (!chatWindow || typeof ChatStoryData === 'undefined') {
            return; // not on the chat page, or data failed to load
        }

        processNode(ChatStoryData.start);
    }

    function processNode(nodeId) {
        const node = ChatStoryData.nodes[nodeId];
        if (!node) return;

        if (node.type === 'message') {
            playIncomingMessage(node.text, () => processNode(node.next));
        } else if (node.type === 'choice') {
            renderOptions(node.options);
        }
        // node.type === 'end' → nothing further to render right now.
    }

    function playIncomingMessage(text, onDone) {
        showTyping(text, () => {
            appendBubble(text, 'in');
            window.setTimeout(onDone, PAUSE_AFTER_BUBBLE);
        });
    }

    function typingDuration(text) {
        const estimate = text.length * TYPING_MS_PER_CHAR;
        return Math.min(TYPING_MAX_MS, Math.max(TYPING_MIN_MS, estimate));
    }

    function showTyping(text, onDone) {
        const typing = document.createElement('div');
        typing.className = 'chat-typing';
        typing.setAttribute('aria-label', 'กำลังพิมพ์...');
        typing.innerHTML =
            '<span class="chat-typing-dot"></span>' +
            '<span class="chat-typing-dot"></span>' +
            '<span class="chat-typing-dot"></span>';

        chatWindow.appendChild(typing);
        revealNextFrame(typing);
        scrollToBottom();

        window.setTimeout(() => {
            typing.classList.remove('is-visible');
            window.setTimeout(() => {
                typing.remove();
                onDone();
            }, 200);
        }, typingDuration(text));
    }

    function appendBubble(text, side) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble chat-bubble--${side}`;
        bubble.textContent = text;

        chatWindow.appendChild(bubble);
        revealNextFrame(bubble);
        scrollToBottom();
    }

    function renderOptions(options) {
        // The dock sits outside the scrolling message feed and pins
        // itself to the bottom of the chat frame, so replies always
        // land in the same familiar spot instead of floating inline
        // wherever the conversation happens to scroll to.
        const host = chatDock || chatWindow;

        const wrap = document.createElement('div');
        wrap.className = 'chat-options';

        options.forEach((option) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'chat-option-btn';
            btn.textContent = option.text;
            btn.addEventListener('click', () => handleOptionPicked(option, wrap));
            wrap.appendChild(btn);
        });

        host.appendChild(wrap);
        revealNextFrame(wrap);
        scrollToBottom();
    }

    function handleOptionPicked(option, optionsEl) {
        if (isBusy) return;
        isBusy = true;

        const buttons = Array.from(optionsEl.querySelectorAll('.chat-option-btn'));
        const chosenBtn = buttons.find((btn) => btn.textContent === option.text);

        buttons.forEach((btn) => {
            btn.disabled = true;
        });

        // Step 1: the tapped option lights up so the choice feels
        // acknowledged; the others quietly fade out of the way.
        if (chosenBtn) chosenBtn.classList.add('is-picked');
        buttons.forEach((btn) => {
            if (btn !== chosenBtn) btn.classList.add('is-fading');
        });

        window.setTimeout(() => {
            // Step 2: the whole dock tucks itself down and out of
            // view, clearing the bottom edge for the next turn.
            optionsEl.classList.add('is-leaving');
            optionsEl.classList.remove('is-visible');

            window.setTimeout(() => optionsEl.remove(), DOCK_COLLAPSE_MS);

            // Step 3: the reply lands as an outgoing bubble, timed to
            // arrive just as the dock finishes tucking away.
            window.setTimeout(() => appendBubble(option.text, 'out'), DOCK_COLLAPSE_MS * 0.4);

            window.setTimeout(() => {
                isBusy = false;
                processNode(option.next);
            }, DOCK_COLLAPSE_MS + HOLD_ON_PICKED);
        }, FADE_OTHERS_MS);
    }

    function revealNextFrame(el) {
        // Add the class on the next frame so the initial (hidden)
        // state has a moment to paint before transitioning in.
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                el.classList.add('is-visible');
            });
        });
    }

    function scrollToBottom() {
        window.requestAnimationFrame(() => {
            chatWindow.scrollTop = chatWindow.scrollHeight;
        });
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    ChatStory.init();
});
