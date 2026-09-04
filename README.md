# Anniversary Website — Foundation

เว็บไซต์วันครบรอบ สร้างด้วย HTML / CSS / Vanilla JavaScript ล้วน ๆ (ไม่มี Framework, ไม่มี Backend)
โฟลเดอร์นี้คือ **Foundation** ของเว็บไซต์ — โครงสร้างพร้อมให้ต่อยอดเพิ่มหน้า, Animation, รูปภาพ, เพลง
และ Interactive Elements อื่น ๆ ในอนาคต

## Flow ปัจจุบัน

```
index.html (รหัสลับ)
      ↓ ใส่รหัสถูก
pages/flower.html (ช่อดอกไม้)
      ↓ กดปุ่ม "ไปต่อ →"
pages/page3.html (Placeholder)
```

## โครงสร้างโฟลเดอร์

```
anniversary-web/
├── index.html            หน้ารหัสลับ (หน้าแรก)
├── pages/
│   ├── flower.html       หน้าช่อดอกไม้
│   └── page3.html        หน้า placeholder รอเพิ่มเนื้อหา
├── css/
│   ├── style.css         CSS variables, typography, base
│   ├── components.css    Keypad, ปุ่ม, password display, ฯลฯ
│   └── responsive.css    Breakpoint: mobile / tablet / desktop
├── js/
│   ├── main.js           Initialize ทุกอย่าง, bind ปุ่มนำทางทั่วไป
│   ├── password.js        Logic ของหน้ารหัสลับทั้งหมด
│   ├── navigation.js      แผนที่หน้าเว็บ + การเปลี่ยนหน้า
│   └── animations.js      Fade / slide / floating ที่ใช้ซ้ำได้
├── assets/
│   ├── images/            รูปภาพทั่วไป (ยังว่าง)
│   ├── icons/              ไอคอน/ภาพประกอบ เช่น lock-illustration.svg
│   ├── flowers/             ภาพช่อดอกไม้ เช่น bouquet.svg
│   └── audio/               เพลง/เสียงประกอบ (ยังว่าง)
└── README.md
```

## วิธีเปิดใช้งาน

ไม่ต้อง build หรือ install อะไรเลย เพราะเป็น Static HTML/CSS/JS ล้วน ๆ:

1. เปิดไฟล์ `index.html` ด้วย browser โดยตรง หรือ
2. รันผ่าน Local server (แนะนำ เพราะบาง browser จำกัดการโหลดไฟล์ในเครื่อง):
   ```bash
   # ถ้ามี Python
   python3 -m http.server 8000
   # แล้วเปิด http://localhost:8000
   ```

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

## วิธีเพิ่มหน้าใหม่

1. สร้างไฟล์ใหม่ใน `pages/` เช่น `pages/page4.html` (คัดลอกโครงจาก `pages/page3.html` แล้วแก้เนื้อหา)
2. เพิ่มหนึ่งบรรทัดใน `js/navigation.js` ที่ object `PAGES`:
   ```javascript
   const PAGES = {
       home: 'index.html',
       flower: 'pages/flower.html',
       page3: 'pages/page3.html',
       page4: 'pages/page4.html', // ← เพิ่มบรรทัดนี้
   };
   ```
3. ถ้าต้องการปุ่มที่ไปหน้านั้น ใส่ `data-nav-target="page4"` ให้กับปุ่มหรือลิงก์ในหน้าที่ต้องการ
   (ไม่ต้องเขียน JavaScript เพิ่ม เพราะ `main.js` จะ bind ปุ่มที่มี `data-nav-target` ให้อัตโนมัติ)

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
- สีทุกสี, spacing, radius มาจาก CSS variables ใน `css/style.css` เท่านั้น
- Logic ของแต่ละส่วนแยกไฟล์ตามหน้าที่ (`password.js`, `navigation.js`, `animations.js`)
- แก้เฉพาะส่วนที่เกี่ยวข้องกับ Feature ที่กำลังทำ อย่าลบ/แก้ระบบเดิมโดยไม่จำเป็น
- ยังไม่มี Content ของ Page 4 เป็นต้นไป (Memories, Photo Gallery, Timeline, Special Message,
  Anniversary Ending) — ให้เพิ่มตามขั้นตอนใน "วิธีเพิ่มหน้าใหม่" ด้านบน เมื่อพร้อมพัฒนาแต่ละหน้า
