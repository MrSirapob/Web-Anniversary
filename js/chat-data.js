/* =========================================================
   chat-data.js
   The Page 3 conversation, kept completely separate from the
   UI that renders it (see chat.js). To edit the story later —
   change wording, add branches, add more messages — only this
   file needs to change.

   Node shapes:
     { type: 'message', side: 'in', text, next }
       An incoming line. Shows a "กำลังพิมพ์..." typing indicator,
       then the bubble, then moves on to `next`.

     { type: 'choice', options: [{ text, next }, ...] }
       Shows up to a few reply buttons. Whichever the person taps
       is added to the chat as an outgoing bubble, then the story
       continues from that option's `next`.

     { type: 'end', nextPage, label }
       The conversation has nothing further right now. If nextPage
       is set (a key from Navigation.PAGES), a single call-to-action
       button appears in the reply dock — tapping it hands off to
       that page via Navigation.goToPage instead of continuing the
       chat. `label` is the button text (defaults to "ไปต่อ →").

   Branches are free to lead anywhere, including back into the
   same shared node id — that's how a branch "returns" to the
   main story (see n4a / n4b / n4c below, which all continue at
   n5).
   ========================================================= */

const ChatStoryData = {
    start: 'n1',

    nodes: {
        n1: { type: 'message', side: 'in', text: 'ยังอยู่ใช่มั้ยย', next: 'n2' },
        n2: { type: 'message', side: 'in', text: 'คือ มีเรื่องอยากบอก', next: 'n3' },

        n3: {
            type: 'choice',
            options: [
                { text: 'มีเรื่องอะไรเหรอ', next: 'n4a' },
                { text: 'รอไม่ไหวแล้ว บอกมาเร็ว ๆ', next: 'n4b' },
                { text: 'แอบทำอะไรมาแน่ ๆ เลยใช่ไหม !', next: 'n4c' },
            ],
        },

        n4a: { type: 'message', side: 'in', text: 'คือวันนี้คิดถึงเธอแบบมาก ๆ', next: 'n5' },
        n4b: { type: 'message', side: 'in', text: 'ใจเย็น ๆ ก่อนสิ ตั้งสติแป๊บนึง', next: 'n5' },
        n4c: { type: 'message', side: 'in', text: 'ก็ แอบทำอยู่จริง ๆ นั่นแหละ หึหึ', next: 'n52' },

        n5: { type: 'message', side: 'in', text: 'คิดถึงตั้งแต่ตื่นเลยย', next: 'n6' },
        n52: { type: 'message', side: 'in', text: 'ที่จะบอกคือ', next: 'n53' },
        n53: { type: 'message', side: 'in', text: 'คิดถึงเธอน้าาา', next: 'n6' },


        n6: {
            type: 'choice',
            options: [
                { text: 'คิดถึงเค้าจริงดิ ?', next: 'n7a' },
                { text: 'เค้าก็คิดถึงเหมือนกันนะ', next: 'n7b' },
                { text: 'ทำไมไม่บอกไว ๆ กว่านี้ล่ะ', next: 'n7c' },
            ],
        },

        n7a: { type: 'message', side: 'in', text: 'จริงสิ ไม่เชื่อก็ต้องเชื่อ', next: 'n8' },
        n7b: { type: 'message', side: 'in', text: 'ได้ยินแบบนี้แล้วดีใจจังเลย', next: 'n8' },
        n7c: { type: 'message', side: 'in', text: 'เพราะอยากเก็บไว้บอกตอนนี้ยังไงละ', next: 'n8' },

        n8: { type: 'message', side: 'in', text: 'มีอะไรจะให้ดูด้วย', next: 'n9' },
        n9: { type: 'message', side: 'in', text: 'ไปถ่ายรูปกันน !!', next: 'end' },

        end: { type: 'end', nextPage: 'quiz', label: 'ไปต่อ →' },
    },
};
