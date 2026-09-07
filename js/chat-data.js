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
        n4b: { type: 'message', side: 'in', text: 'ใจเย็น ๆ คือ', next: 'n5' },
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

        /* ---- Extended middle stretch ----
           Before the "let's go take photos" hand-off, the
           conversation now lingers a while longer: a trip down
           memory lane (how they met, 5 years together), then a
           soft, sincere beat of thanks. Three more choice points
           give the person plenty to tap through, and every branch
           still reconverges into the same shared path so the
           story never dead-ends. */

        n8: { type: 'message', side: 'in', text: 'เดี๋ยวนะ คุยอะไรสักหน่อยก่อน', next: 'n8b' },
        n8b: { type: 'message', side: 'in', text: 'จำได้มั้ยว่าเราเจอกันครั้งแรกที่ไหน', next: 'n9' },

        n9: {
            type: 'choice',
            options: [
                { text: 'จำได้สิ ในไลฟ์สดไง', next: 'n10a' },
                { text: 'จำไม่ได้อ่ะ บอกหน่อยดิ', next: 'n10b' },
                { text: 'เจอกันในฝันไง 555', next: 'n10c' },
            ],
        },

        n10a: { type: 'message', side: 'in', text: 'ถูกต้องง', next: 'n10a2' },
        n10a2: { type: 'message', side: 'in', text: 'ตอนนั้นไม่คิดเลยว่าจะมาไกลกันขนาดนี้', next: 'n11' },

        n10b: { type: 'message', side: 'in', text: 'จำไม่ได้จริงดิ TT น้อยใจนิดนึงนะเนี่ย', next: 'n10b2' },
        n10b2: { type: 'message', side: 'in', text: 'ตอนนั้นเจอกันในไลฟ์สดไงง จำไว้ด้วยน้าา', next: 'n11' },

        n10c: { type: 'message', side: 'in', text: 'เพ้อไปได้ 555', next: 'n10c2' },
        n10c2: { type: 'message', side: 'in', text: 'ตอนนั้นจำได้เลย ผู้หญิงคนนี้น่ารักจัง', next: 'n11' },

        n11: { type: 'message', side: 'in', text: 'ผ่านมาตั้ง 5 ปีแล้วเนอะ เร็วมากเลย', next: 'n12' },

        n12: {
            type: 'choice',
            options: [
                { text: 'เร็วจังเลยเนอะ ไม่ทันรู้ตัว', next: 'n13a' },
                { text: 'ไม่คิดว่าจะมากันได้ไกลขนาดนี้เลย', next: 'n13b' },
                { text: 'ก็ยัง งง อยู่ว่าทนกันมาได้ไง 5555', next: 'n13c' },
            ],
        },

        n13a: { type: 'message', side: 'in', text: 'เนอะ', next: 'n14' },
        n13b: { type: 'message', side: 'in', text: 'จริงง ขอบคุณมั้กๆ นะ', next: 'n14' },
        n13c: { type: 'message', side: 'in', text: 'เพราะรักไงถึงทนกันได้ 5555 ล้อเล่นน รักที่สุดเลยจริง ๆ', next: 'n14' },

        n14: { type: 'message', side: 'in', text: 'ขอบคุณนะที่อยู่ด้วยกันมาตลอดเลย', next: 'n15' },
        n15: { type: 'message', side: 'in', text: 'ขอบคุณที่ยังอยู่ด้วยกันนะ', next: 'n16' },

        n16: {
            type: 'choice',
            options: [
                { text: 'เค้าต่างหากที่ต้องขอบคุณเธอ', next: 'n17a' },
                { text: 'รักเธอที่สุดในโลกเลย', next: 'n17b' },
                { text: 'หยุดพูด เดี๋ยวจะร้องไห้แล้วนะ', next: 'n17c' },
            ],
        },

        n17a: { type: 'message', side: 'in', text: 'เค้าต่างหากก !', next: 'n18' },
        n17b: { type: 'message', side: 'in', text: 'เค้าก็รักเธอที่สุดในโลกเหมือนกันนะ', next: 'n18' },
        n17c: { type: 'message', side: 'in', text: 'อ้าว ห้ามร้องนะ วันนี้ต้องยิ้มอย่างเดียว', next: 'n18' },

        n18: { type: 'message', side: 'in', text: 'เอาละ ตอนนี้น่าจะถึงเวลาแล้ว', next: 'n18b' },

        /* ---- Second extended stretch ----
           A while later still: talk turns to "what happens next"
           for the two of them, a couple more small talking points,
           then a mock "there's one more thing..." tease that pays
           off as an "I love you" instead of anything scary. Three
           more choice points, same reconverge-everywhere pattern. */

        n18b: { type: 'message', side: 'in', text: 'แต่ยังไม่หมดนะ มีอีกเรื่องอยากคุยด้วย', next: 'n19' },

        n19: {
            type: 'choice',
            options: [
                { text: 'เรื่องอะไรอีกล่ะ', next: 'n20a' },
                { text: 'วันนี้พูดเยอะจังเลยนะ', next: 'n20b' },
                { text: 'อยากคุยอะไร', next: 'n20c' },
            ],
        },

        n20a: { type: 'message', side: 'in', text: 'คือเราคบกันมาก็นานเนอะ', next: 'n21' },
        n20b: { type: 'message', side: 'in', text: 'ก็มีอะไรอยากบอกเยอะไง วันนี้ วันพิเศษนี่เนาะ', next: 'n21' },
        n20c: { type: 'message', side: 'in', text: 'คือ', next: 'n21' },

        n21: { type: 'message', side: 'in', text: 'เคยคิดเล่น ๆ มั้ยว่าต่อไปเราจะเป็นยังไงกันบ้าง', next: 'n22' },

        n22: {
            type: 'choice',
            options: [
                { text: 'คิดสิ อยากไปเที่ยวด้วยกันเยอะ ๆ', next: 'n23a' },
                { text: 'อยากอยู่ด้วยกันไปนาน ๆ เลย', next: 'n23b' },
                { text: 'จะขอแต่งงานหรอ 5555', next: 'n23c' },
            ],
        },

        n23a: { type: 'message', side: 'in', text: 'เห็นด้วยเลย มีที่ ที่อยากไปด้วยกันอีกเพียบเลยอ่ะ', next: 'n24' },
        n23b: { type: 'message', side: 'in', text: 'อันนี้ตรงใจเป๊ะเลย อยากอยู่ด้วยกันไปนาน ๆ เหมือนกัน', next: 'n24' },
        n23c: { type: 'message', side: 'in', text: 'ยังไม่ถึงตอนนั้นหรอก 5555', next: 'n24' },

        n24: { type: 'message', side: 'in', text: 'เอาเป็นว่าตอนนี้ขอแค่ได้อยู่ด้วยกันแบบนี้ไปเรื่อย ๆ ก่อนละกัน', next: 'n25' },
        n25: { type: 'message', side: 'in', text: 'เดี๋ยวว มีเรื่องนึงลืมบอก', next: 'n26' },
        n26: { type: 'message', side: 'in', text: 'จริง ๆ นะ', next: 'n27' },

        n27: {
            type: 'choice',
            options: [
                { text: 'เรื่องอะไรอีกกกก', next: 'n28a' },
                { text: 'จะบอกอะไรอีกกก ใจสั่นละ', next: 'n28b' },
                { text: 'บอกมาเถอะะ ทนไม่ไหวละ', next: 'n28c' },
            ],
        },

        n28a: { type: 'message', side: 'in', text: 'ก็แค่จะบอกว่า...', next: 'n29' },
        n28b: { type: 'message', side: 'in', text: 'ไม่มีอะไรน่ากลัวหรอก ใจเย็น ๆ', next: 'n29' },
        n28c: { type: 'message', side: 'in', text: 'ได้ ๆ บอกเลยละกัน', next: 'n29' },

        n29: { type: 'message', side: 'in', text: 'รักเธอมาก ๆ นะ', next: 'n30' },
        n30: { type: 'message', side: 'in', text: 'เอาละ พอเถอะ พูดจนจะเขินแล้ว', next: 'n31' },
        n31: { type: 'message', side: 'in', text: 'ไปเล่นเกมกันนนน', next: 'n32' },
        n32: { type: 'message', side: 'in', text: 'เกมตอบคำถาม !!', next: 'end' },

        end: { type: 'end', nextPage: 'quiz', label: 'ไปต่อ →' },
    },
};
