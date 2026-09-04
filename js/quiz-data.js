/* =========================================================
   quiz-data.js
   The 3 questions shown on the quiz page, kept completely
   separate from the UI that renders them (see quiz.js). To
   edit the wording, answer choices, or the correct answer
   later, only this file needs to change — add/remove/reorder
   items in `options` freely, the page adapts automatically.

   Question shape:
     { id, question, options: [text, text, ...], correctAnswer }
     `correctAnswer` must exactly match one of the strings in
     `options` — that's the one counted as "right" for the
     score shown on the finish card.

   `resultMessages` is the line shown next to the score on the
   finish card, keyed by how many of the 3 questions were
   answered correctly (0–3). Add/edit lines here; if a score
   has no entry, a plain fallback message is used instead.
   ========================================================= */

const QuizData = {
    questions: [
        {
            id: 'q1',
            question: 'เจอกันครั้งแรกที่ไหน',
            options: [
                'มหาลัย',
                'ห้องสมุด',
                'ร้านเหล้า',
                'ไลฟ์สด',
            ],
            correctAnswer: 'ไลฟ์สด',
        },
        {
            id: 'q2',
            question: 'ตอนนี้ครบรอบกี่ปี',
            options: [
                '3 ปี',
                '4 ปี',
                '5 ปี',
                '6 ปี',
            ],
            correctAnswer: '5 ปี',
        },
        {
            id: 'q3',
            question: 'รักกันแค่ไหน',
            options: [
                'เออรักก็ได้',
                'รักมากกว่าใครบนโลก',
                'รักมั้ง',
                'รักมากกก',
            ],
            correctAnswer: 'รักมากกก',
        },
    ],

    resultMessages: {
        3: 'เก่งมากก จำได้หมดเลย',
        2: 'ผิดไป 1 ข้อนะะ',
        1: 'ถูกแค่ 1 ข้อเอง ทำใหม่',
        0: 'ตอบไม่ถูกเลยยย เอาใหม่สิ้ๆ',
    },
};
