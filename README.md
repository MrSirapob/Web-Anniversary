# Anniversary Website — Foundation

เว็บไซต์วันครบรอบ สร้างด้วย HTML / CSS / Vanilla JavaScript ล้วน ๆ (ไม่มี Framework, ไม่มี Backend)
โฟลเดอร์นี้คือ **Foundation** ของเว็บไซต์ — โครงสร้างพร้อมให้ต่อยอดเพิ่มหน้า, Animation, รูปภาพ, เพลง
และ Interactive Elements อื่น ๆ ในอนาคต

ทั้งเว็บไซต์รันเป็น **Single-Page App (SPA)** จาก `index.html` เพียงไฟล์เดียว — เปลี่ยนหน้าโดย
ไม่ reload และมี transition ระหว่างหน้า (ดูรายละเอียดใน "สถาปัตยกรรม SPA" ด้านล่าง)

## Flow ปัจจุบัน

```
index.html (รหัสลับ)
      ↓ ใส่รหัสถูก
pages/flower.html (ช่อดอกไม้)
      ↓ กดปุ่ม "ไปต่อ →"
pages/page3.html (บทสนทนาแบบแชท พร้อมตัวเลือก/แตกแขนง)
      ↓ จบบทสนทนา
pages/quiz.html (คำถามท้ายเรื่อง 3 ข้อ)
      ↓ ตอบครบ กดปุ่ม "ไปต่อ →"
pages/photo.html (กล้องโพลารอยด์ — แตะแล้วปริ้นภาพ 3 ใบ)
```

## สถาปัตยกรรม SPA

`index.html` เป็น **shell** เดียวของทั้งเว็บไซต์ — โหลด CSS/JS ของทุกหน้าไว้ล่วงหน้าทั้งหมด และมี
`<div id="app" data-app-root>` เป็นที่แสดงเนื้อหาของหน้าปัจจุบัน ไฟล์ `pages/*.html` ยังเป็นที่เก็บ
เนื้อหาแต่ละหน้าเหมือนเดิม (แก้ที่ไฟล์เดิม ตามหัวข้อด้านล่างของแต่ละหน้าได้เลย) แต่ตอนนี้มันถูก
**fetch เป็น HTML fragment** แล้วสลับใส่ `#app` แทนการเปลี่ยนหน้าจริง — ไม่ได้เปิดตรง ๆ อีกต่อไป

กลไกอยู่ที่ `js/navigation.js` → `Navigation.goToPage(pageKey)`:
1. ใส่ class `.is-leaving` ให้ `#app` (fade + slide ออก, ดู CSS ที่ `components.css`)
2. รอ transition จบ (อ่านระยะเวลาโดยตรงจาก `--transition-normal` ใน `style.css`)
3. fetch ไฟล์ `pages/xxx.html`, ตัด `<script>` ออก (เพราะ script ทุกไฟล์โหลดไว้แล้วครั้งเดียวใน
   `index.html`), แก้ path รูปที่ขึ้นต้นด้วย `../` ให้เป็น root-relative อัตโนมัติ, แล้วนำ markup
   ที่เหลือไปแทนที่ `innerHTML` ของ `#app`
4. ใส่ class `.is-entering` แล้วปล่อยออกในเฟรมถัดไป ให้หน้าใหม่ fade + slide เข้า
5. เรียก `Main.init()` ใหม่ เพื่อ bind ปุ่ม/inits ของหน้าที่เพิ่งใส่เข้ามา

ถ้า `fetch()` ใช้ไม่ได้ (เช่นเปิดไฟล์ตรง ๆ แบบ `file://` โดยไม่ผ่าน local server) ระบบจะ fallback
เป็นการเปลี่ยนหน้าแบบเดิม (`location.href`) ให้อัตโนมัติ — เพราะฉะนั้นแนะนำให้รันผ่าน local server
เสมอ (ดู "วิธีเปิดใช้งาน" ด้านล่าง) เพื่อให้ transition ทำงานเต็มรูปแบบ

**สิ่งที่ต้องระวังเวลาแก้โค้ดต่อ:** เพราะไม่มีการ reload หน้าอีกต่อไป listener ที่ผูกกับ `document`
โดยตรง (เช่น กดคีย์บอร์ดที่หน้ารหัสลับ, ปุ่มลูกศรที่ lightbox หน้ารูปถ่าย) ต้องผูกครั้งเดียวเท่านั้น
(มี guard ไว้แล้วใน `password.js`/`photo.js`) ไม่งั้นจะผูกซ้ำทุกครั้งที่กลับมาหน้านั้น และ state
ภายในของแต่ละ module (เช่น index ของคำถามปัจจุบันใน `quiz.js`) ต้อง reset ทุกครั้งใน `init()`
เพราะ module ไม่ได้ถูกสร้างใหม่จากศูนย์เหมือนตอน reload หน้าแบบเดิม — ทำตามแพทเทิร์นเดิมที่มีอยู่แล้ว
ในแต่ละไฟล์ได้เลยเวลาเพิ่มหน้าหรือ state ใหม่

## โครงสร้างโฟลเดอร์

```
anniversary-web/
├── index.html            SPA shell — โหลด CSS/JS ทั้งหมด + แสดงหน้ารหัสลับเป็นค่าเริ่มต้น
├── pages/
│   ├── flower.html       เนื้อหาหน้าช่อดอกไม้ (fetch เข้า index.html โดย navigation.js)
│   ├── page3.html        เนื้อหาหน้าบทสนทนาแบบแชท (Chat Story)
│   ├── quiz.html         เนื้อหาหน้าคำถามท้ายเรื่อง
│   └── photo.html        เนื้อหาหน้ากล้องโพลารอยด์
├── css/
│   ├── style.css         CSS variables, typography, base
│   ├── components.css    Keypad, ปุ่ม, password display, SPA transition, ฯลฯ
│   ├── responsive.css    Breakpoint: mobile / tablet / desktop
│   ├── chat.css          สไตล์ UI แชท — ใช้เมื่อหน้า page3 แสดงอยู่
│   ├── quiz.css          สไตล์ UI quiz — ใช้เมื่อหน้า quiz แสดงอยู่
│   └── photo.css         สไตล์ UI photo booth — ใช้เมื่อหน้า photo แสดงอยู่
├── js/
│   ├── main.js           Entry point เดียว — เรียกตอนโหลดครั้งแรก และหลัง SPA สลับหน้าทุกครั้ง
│   ├── password.js        Logic ของหน้ารหัสลับทั้งหมด
│   ├── navigation.js      แผนที่หน้าเว็บ + การสลับหน้าแบบ SPA (fetch + transition)
│   ├── animations.js      Fade / slide / floating ที่ใช้ซ้ำได้
│   ├── chat-data.js       เนื้อเรื่องบทสนทนา page3 (ข้อความ/ตัวเลือก/แตกแขนง)
│   ├── chat.js            Engine ที่ render แชทจาก chat-data.js — ใช้เมื่อหน้า page3 แสดงอยู่
│   ├── quiz-data.js       คำถาม/ตัวเลือก/เฉลย ของหน้า quiz
│   ├── quiz.js            Engine ที่ render quiz จาก quiz-data.js — ใช้เมื่อหน้า quiz แสดงอยู่
│   └── photo.js           รายชื่อรูป + Engine ปริ้นโพลารอยด์ — ใช้เมื่อหน้า photo แสดงอยู่
├── assets/
│   ├── images/            รูปที่ใช้ในหน้า photo.html (photo-1/2/3 — แทนที่ได้เลย)
│   ├── icons/              ไอคอน/ภาพประกอบ เช่น lock-illustration.svg
│   ├── flowers/             ภาพช่อดอกไม้ เช่น bouquet.svg
│   └── audio/               เพลง/เสียงประกอบ (ยังว่าง)
└── README.md
```

## วิธีเปิดใช้งาน

ไม่ต้อง build หรือ install อะไรเลย เพราะเป็น Static HTML/CSS/JS ล้วน ๆ — แต่เพราะตอนนี้เว็บไซต์
รันเป็น SPA ที่ใช้ `fetch()` โหลดเนื้อหาแต่ละหน้า **แนะนำให้รันผ่าน local server เสมอ**
(เบราว์เซอร์ส่วนใหญ่ไม่อนุญาตให้ `fetch()` ไฟล์ในเครื่องผ่าน `file://`):

```bash
# ถ้ามี Python
python3 -m http.server 8000
# แล้วเปิด http://localhost:8000
```

ถ้าเปิด `index.html` ตรง ๆ แบบ `file://` โดยไม่ผ่าน server ระบบจะ fallback ไปเปลี่ยนหน้าแบบ reload
เต็มหน้าแทน (ยังใช้งานได้ปกติ แต่จะไม่มี transition)

## วิธีเปลี่ยนรหัสผ่าน

แก้ค่าในไฟล์ `js/password.js` บรรทัดบนสุด:

```javascript
const PASSWORD_CONFIG = {
    password: '123456',   // เปลี่ยนรหัสตรงนี้
    maxLength: 6,          // ถ้าเปลี่ยนความยาวรหัส ต้องเพิ่ม/ลด .password-dot ใน index.html ให้ตรงกันด้วย
};
```

ถ้าเปลี่ยนความยาวรหัส (`maxLength`) อย่าลืมเพิ่มหรือลดจำนวน `<span class="password-dot"></span>`
ใน `index.html` (ในส่วน `.password-display`) ให้เท่ากับ `maxLength`

## วิธีเปลี่ยนรูป

- **รูปหน้ารหัสลับ**: แทนที่ไฟล์ `assets/icons/lock-illustration.svg` ด้วยรูปใหม่ (จะเป็น .svg, .png,
  หรือ .jpg ก็ได้ แค่แก้ path ใน `<img src="...">` ที่ `index.html`)
- **ช่อดอกไม้**: แทนที่ `assets/flowers/bouquet.svg` ด้วยรูปจริง แล้วแก้ path ใน `pages/flower.html`
  ถ้ารูปใหม่มีสัดส่วนต่างจากเดิมมาก อาจต้องปรับ `.flower-bouquet` ใน `css/components.css` เล็กน้อย

ไม่ต้องแก้ JavaScript ใด ๆ เพื่อเปลี่ยนรูป — แก้แค่ path ใน HTML หรือแทนที่ไฟล์ในชื่อเดิมก็พอ

## วิธีแก้ไขบทสนทนาในหน้า 3 (Chat Story)

เนื้อเรื่องทั้งหมดอยู่ใน `js/chat-data.js` แยกออกจาก UI โดยสิ้นเชิง (ไม่ต้องแตะ `js/chat.js` เลย):

```javascript
const ChatStoryData = {
    start: 'n1',          // node แรกที่จะเล่น
    nodes: {
        n1: { type: 'message', side: 'in', text: 'เธออยู่ไหม', next: 'n2' },
        // ...
        n3: {
            type: 'choice',
            options: [
                { text: 'มีเรื่องอะไรเหรอ', next: 'n4a' },
                // สูงสุดตามที่ต้องการ ไม่จำกัดแค่ 3
            ],
        },
        end: { type: 'end' },
    },
};
```

- **เพิ่มข้อความใหม่**: เพิ่ม node ชนิด `message` แล้วให้ node ก่อนหน้าชี้มาที่ id นี้ผ่าน `next`
- **เพิ่มจุดให้เลือก**: ใช้ node ชนิด `choice` — แต่ละ option มี `text` (ข้อความบนปุ่ม) และ `next` (จะไปต่อที่ node ไหน)
- **แตกแขนงแล้ววนกลับเข้าเนื้อเรื่องหลัก**: ให้ทุก option (หรือทุกแขนง) ที่ต้องการให้บรรจบกัน ชี้ `next` ไปที่ node id เดียวกัน (ดูตัวอย่าง `n4a` / `n4b` / `n4c` ที่ทั้งหมดไปต่อที่ `n5`)
- **จบบทสนทนา**: ชี้ `next` ไปที่ node ชนิด `end` (หรือสร้าง id ใหม่ที่เป็น `{ type: 'end' }`)

ไม่ต้อง hardcode ข้อความหรือ logic ไว้ใน `page3.html` — ไฟล์นั้นมีแค่กล่องแชทว่าง ๆ ให้ `chat.js` render ใส่เท่านั้น

## วิธีแก้ไขหน้าถ่ายรูป (Photo Booth)

หน้า `pages/photo.html` แสดงข้อความ "ไปถ่ายรูปกัน" กับกล้องโพลารอยด์ที่วาดด้วย CSS ล้วน (ไม่ใช้รูป
กล้อง ไม่ต้องมีไฟล์ภาพเพิ่ม) แต่ละครั้งที่แตะกล้องจะเล่นแอนิเมชันแฟลชแล้วปริ้นภาพออกมา **1 ใบ** — ต้อง
แตะทั้งหมด 3 ครั้งถึงจะได้ครบ 3 ใบ (ไม่ใช่แตะครั้งเดียวแล้วออกรัวเอง) — ภาพที่ปริ้นออกมาเป็นภาพที่
เตรียมไว้ล่วงหน้า ไม่ใช่การถ่ายจากกล้องจริง พอปริ้นครบ 3 ใบ จะเปิดตัวดูภาพ (Lightbox) ขึ้นมาเองแบบ
ซูม/เฟดเข้าอัตโนมัติ เลื่อนดูทีละใบได้ด้วยลูกศร ซ้าย/ขวา หรือปุ่มลูกศรคีย์บอร์ด ปิดได้ด้วยปุ่ม ×, แตะพื้น
หลังมืด ๆ, หรือกด Esc — และหลังจากนั้นแตะที่รูปโพลารอยด์ใบไหนก็เปิดดูใบนั้นซ้ำได้เสมอ

- **เปลี่ยนรูปที่ปริ้นออกมา**: วิธีง่ายที่สุดคือแทนที่ไฟล์ `assets/images/photo-1.svg`,
  `photo-2.svg`, `photo-3.svg` ด้วยรูปจริง (จะเป็น .jpg/.png ก็ได้ แค่แก้ path ปลายทางใน
  `js/photo.js` ที่ `PhotoBoothData.photos` ให้ตรงกับชื่อไฟล์ใหม่)
- **เปลี่ยนจำนวนภาพหรือการจัดวาง**: แก้ที่ `PhotoBoothData.photos` และ `PhotoBoothData.layout`
  ใน `js/photo.js` — ทั้งสอง array ต้องมีจำนวนสมาชิกเท่ากัน (แต่ละภาพจับคู่กับตำแหน่ง/มุมเอียงของ
  ตัวเอง)
- ไม่ต้องแก้ `pages/photo.html` หรือ Engine ใน `js/photo.js` เพื่อแค่เปลี่ยนรูป

## วิธีเพิ่มหน้าใหม่

1. สร้างไฟล์ใหม่ใน `pages/` เช่น `pages/page4.html` (คัดลอกโครงจาก `pages/page3.html` แล้วแก้เนื้อหา
   — ไฟล์นี้ยังเป็น HTML เต็มรูปแบบเหมือนเดิม แต่จะถูก fetch เอาเฉพาะเนื้อหาใน `<body>` ไปแสดง
   `<script>` ในไฟล์นี้จะไม่ถูกใช้ตอนรันเป็น SPA เพราะ script ทุกไฟล์ถูกโหลดไว้แล้วใน `index.html`)
2. ถ้าหน้านั้นมี Engine ของตัวเอง (เหมือน `chat.js`/`quiz.js`/`photo.js`) ให้เพิ่ม
   `<script src="js/page4.js"></script>` ใน `index.html` (ก่อน `main.js`) แล้วเพิ่มบรรทัดเรียก
   `init()` ของมันใน `Main.init()` ที่ `js/main.js` ด้วย
3. เพิ่มหนึ่งบรรทัดใน `js/navigation.js` ที่ object `PAGES`:
   ```javascript
   const PAGES = {
       home: 'index.html',
       flower: 'pages/flower.html',
       page3: 'pages/page3.html',
       page4: 'pages/page4.html', // ← เพิ่มบรรทัดนี้
   };
   ```
4. ถ้าต้องการปุ่มที่ไปหน้านั้น ใส่ `data-nav-target="page4"` ให้กับปุ่มหรือลิงก์ในหน้าที่ต้องการ
   (ไม่ต้องเขียน JavaScript เพิ่ม เพราะ `main.js` จะ bind ปุ่มที่มี `data-nav-target` ให้อัตโนมัติ
   ทุกครั้งที่สลับหน้า)
5. ถ้าในหน้านั้นมีรูปภาพที่อ้างอิงด้วย path แบบ `../assets/...` ไม่ต้องกังวล — `navigation.js` จะ
   แก้ path ให้เป็น root-relative อัตโนมัติตอน fetch เข้า SPA ให้อยู่แล้ว ส่วน path รูปที่กำหนดจาก
   JavaScript (เหมือนใน `photo.js`) ให้ใช้ `Navigation.asset('assets/...')` แทนการ hardcode
   `../assets/...` ตรง ๆ เพื่อให้ทำงานถูกทั้งตอนรันเป็น SPA และตอนเปิดไฟล์นั้นตรง ๆ

## วิธีเปลี่ยน Theme

ทุกสี, รัศมีขอบ, เงา, และ transition ถูกเก็บไว้ที่จุดเดียวคือ `:root` ใน `css/style.css`:

```css
:root {
    --color-bg: #FBF6EF;
    --color-primary: #E7B8BE;
    --color-secondary: #9CB89A;
    --color-accent: #C3B6DE;
    --color-text: #4A4038;
    --color-muted: #9A8F82;
    /* ... */
}
```

เปลี่ยนค่าตรงนี้ที่เดียว ทั้งเว็บไซต์จะเปลี่ยนตาม เพราะทุกไฟล์ CSS อ้างอิงตัวแปรชุดนี้ทั้งหมด
(ไม่ควรเขียนค่าสีตรง ๆ (hardcode) ไว้ที่อื่น)

## วิธีเพิ่ม Animation

Animation ที่ใช้ซ้ำได้อยู่ใน `js/animations.js` และ CSS class คู่กันใน `css/components.css`:

- **Fade + slide-up เมื่อโหลดหน้า**: ใส่ attribute `data-reveal` ให้ element ที่ต้องการ
  (จะใส่ `data-reveal-delay="200"` เพื่อหน่วงเวลาเป็นมิลลิวินาทีก็ได้)
- **Floating (ลอยขึ้นลงเบา ๆ)**: เรียก `Animations.enableFloating('.your-selector')`
- อยากเพิ่ม Animation แบบใหม่: เพิ่ม `@keyframes` และ class ใหม่ใน `components.css` แล้วเพิ่ม
  function เล็ก ๆ ใน `animations.js` ที่ toggle class นั้น — ไม่ต้องแก้ไฟล์อื่น

## วิธีเพิ่ม Audio ในอนาคต

ยังไม่ได้ทำระบบเสียงไว้ในเวอร์ชันนี้ (ตั้งใจ) แนวทางที่แนะนำเมื่อจะเพิ่ม:

1. วางไฟล์เสียงไว้ใน `assets/audio/`
2. สร้างไฟล์ `js/audio.js` ใหม่ (แยกออกจากไฟล์อื่น เพื่อไม่ให้ปนกับ logic อื่น) จัดการ:
   - เล่น/หยุดเพลงพื้นหลัง
   - ปุ่ม mute/unmute
   - จำสถานะเสียง (เล่น/หยุด) ไว้ผ่าน `Navigation.setState()` เพื่อให้ต่อเนื่องข้ามหน้า
3. เพิ่ม `<script src="js/audio.js"></script>` ในหน้าที่ต้องการใช้เสียง (หรือทุกหน้า)

## หลักการสำหรับ AI / Developer ที่จะแก้ไขต่อ

- HTML / CSS / JS / Assets แยกกันชัดเจน อย่ารวมกันไว้ในไฟล์เดียว
- สีทุกสี, spacing, radius, transition มาจาก CSS variables ใน `css/style.css` เท่านั้น
- Logic ของแต่ละส่วนแยกไฟล์ตามหน้าที่ (`password.js`, `navigation.js`, `animations.js`)
- ทั้งเว็บไซต์รันเป็น SPA จาก `index.html` — อย่าใช้ `window.location.href` เพื่อเปลี่ยนหน้าใน
  โค้ดใหม่ ให้เรียก `Navigation.goToPage('pageKey')` เสมอ
- Module ที่มี state ภายใน (เช่น index คำถามปัจจุบันใน `quiz.js`) ต้อง reset state นั้นใน `init()`
  ทุกครั้ง เพราะหน้าอาจถูกเข้าซ้ำได้โดยไม่มีการ reload มาช่วยล้าง state ให้
- Listener ที่ผูกกับ `document` ตรง ๆ (ไม่ใช่ element ในหน้า) ต้องผูกครั้งเดียวเท่านั้น (ดูตัวอย่าง
  `isKeyboardBound` ใน `password.js`) ไม่งั้นจะผูกซ้ำทุกครั้งที่กลับมาหน้านั้น
- แก้เฉพาะส่วนที่เกี่ยวข้องกับ Feature ที่กำลังทำ อย่าลบ/แก้ระบบเดิมโดยไม่จำเป็น
- ยังไม่มี Content ของ Page 4 เป็นต้นไป (Memories, Photo Gallery, Timeline, Special Message,
  Anniversary Ending) — ให้เพิ่มตามขั้นตอนใน "วิธีเพิ่มหน้าใหม่" ด้านบน เมื่อพร้อมพัฒนาแต่ละหน้า
