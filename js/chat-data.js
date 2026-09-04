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

     { type: 'end' }
       The conversation has nothing further right now.

   Branches are free to lead anywhere, including back into the
   same shared node id — that's how a branch "returns" to the
   main story (see n4a / n4b / n4c below, which all continue at
   n5).
   ========================================================= */

const ChatStoryData = {
    start: 'n1',

    nodes: {
        n1: { type: 'message', side: 'in', text: 'เธออยู่ไหม', next: 'n2' },
        n2: { type: 'message', side: 'in', text: 'มีเรื่องอยากบอก รอมานานแล้วนะ', next: 'n3' },

        n3: {
            type: 'choice',
            options: [
                { text: 'มีเรื่องอะไรเหรอ', next: 'n4a' },
                { text: 'รอไม่ไหวแล้ว บอกมาเร็ว ๆ', next: 'n4b' },
                { text: 'แอบทำอะไรมาแน่ ๆ เลยใช่ไหม', next: 'n4c' },
            ],
        },

        n4a: { type: 'message', side: 'in', text: 'คือวันนี้เราคิดถึงเธอมากเลย', next: 'n5' },
        n4b: { type: 'message', side: 'in', text: 'ใจเย็น ๆ ก่อนสิ ตั้งสติแป๊บนึง', next: 'n5' },
        n4c: { type: 'message', side: 'in', text: 'ก็… แอบทำอยู่จริง ๆ นั่นแหละ', next: 'n5' },

        n5: { type: 'message', side: 'in', text: 'คิดถึงตั้งแต่ตื่นนอนเลย', next: 'n6' },

        n6: {
            type: 'choice',
            options: [
                { text: 'คิดถึงเราจริงดิ', next: 'n7a' },
                { text: 'เราก็คิดถึงเหมือนกันนะ', next: 'n7b' },
                { text: 'ทำไมไม่บอกไวกว่านี้ล่ะ', next: 'n7c' },
            ],
        },

        n7a: { type: 'message', side: 'in', text: 'จริงสิ ไม่เชื่อก็ต้องเชื่อ', next: 'n8' },
        n7b: { type: 'message', side: 'in', text: 'ได้ยินแบบนี้แล้วดีใจจังเลย', next: 'n8' },
        n7c: { type: 'message', side: 'in', text: 'เพราะอยากเก็บไว้บอกวันนี้พอดีเลย', next: 'n8' },

        n8: { type: 'message', side: 'in', text: 'เลยทำอะไรให้อย่างนึง', next: 'n9' },
        n9: { type: 'message', side: 'in', text: 'อยากให้ดูด้วยกันนะ', next: 'end' },

        end: { type: 'end' },
    },
};
