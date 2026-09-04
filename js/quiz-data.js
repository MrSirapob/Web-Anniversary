/* =========================================================
   quiz-data.js
   The 3 questions shown on the quiz page, kept completely
   separate from the UI that renders them (see quiz.js). To
   edit the wording or answer choices later, only this file
   needs to change — add/remove/reorder items in `options`
   freely, the page adapts automatically.

   Question shape:
     { id, question, options: [text, text, ...] }
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
                'หอเพื่อน',
            ],
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
        },
    ],
};
