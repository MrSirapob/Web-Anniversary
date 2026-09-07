/* =========================================================
   timeline-data.js
   Content for the Timeline page — kept separate from the
   rendering engine (js/timeline.js), same split used by
   chat-data.js/chat.js, quiz-data.js/quiz.js, and
   PhotoBoothData/photo.js elsewhere in this project.

   To edit later, change ONLY what's below — js/timeline.js
   shouldn't need to change for any of these:

   - startDate: the date the "คบกันมาแล้ว..." counter counts up
     from. Written as `new Date(year, monthIndex, day)` — note
     JS months are 0-indexed (0 = มกราคม ... 8 = กันยายน), and
     `year` must be the ค.ศ. (Gregorian) year, not พ.ศ.
     09/09/2564 (พ.ศ.) = 9 กันยายน 2021 (ค.ศ.), so that's
     `new Date(2021, 8, 9)` below.
   - collagePhotos: the small stack of photos shown above the
     counter. Re-uses Navigation.asset() the same way
     PhotoBoothData does, so any path here works whether this
     page is running inside the SPA or opened directly.
   - envelopeDelayMs: how long (ms) after the page loads before
     the envelope fades in.
   - letterText: the message revealed when the envelope is
     opened. Blank lines become paragraph breaks.
   ========================================================= */

const TimelineData = {
    startDate: new Date(2021, 8, 9, 0, 0, 0),

    collagePhotos: [
        { src: Navigation.asset('assets/images/photo-1.svg'), alt: 'ภาพความทรงจำ 1' },
        { src: Navigation.asset('assets/images/photo-3.svg'), alt: 'ภาพความทรงจำ 3' },
        { src: Navigation.asset('assets/images/photo-5.svg'), alt: 'ภาพความทรงจำ 5' },
    ],

    envelopeDelayMs: 5000,

    letterText: `ถึงคนที่รัก

ขอบคุณนะที่เดินมาด้วยกันตลอดเวลาที่ผ่านมา ทุกวันที่มีเธออยู่ด้วยคือวันที่ดีเสมอ

ขอให้เรายังเดินไปด้วยกันแบบนี้อีกนาน ๆ นะ

รักเธอเสมอ`,
};
