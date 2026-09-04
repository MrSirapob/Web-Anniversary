// รหัสผ่านหน้าแรก — แก้รหัสได้ตรงนี้
const CORRECT_CODE = "090964";
// หน้าที่จะไปหลังใส่รหัสถูก
const NEXT_PAGE = "home.html";

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('code-input');
  const btn = document.getElementById('unlock-btn');
  const msg = document.getElementById('gate-msg');
  const gateCat = document.getElementById('gate-cat');

  function tryUnlock(){
    const val = input.value.trim();
    if(val === CORRECT_CODE){
      msg.textContent = '';
      gateCat.classList.add('success');
      sessionStorage.setItem('mk_unlocked', 'true');
      setTimeout(() => {
        window.location.href = NEXT_PAGE;
      }, 500);
    } else {
      msg.textContent = 'รหัสไม่ถูกต้อง ลองอีกครั้ง';
      gateCat.classList.remove('shake');
      void gateCat.offsetWidth;
      gateCat.classList.add('shake');
      gateCat.addEventListener('animationend', () => gateCat.classList.remove('shake'), { once: true });
      input.value = '';
      input.focus();
    }
  }

  btn.addEventListener('click', tryUnlock);
  input.addEventListener('keydown', (e) => { if(e.key === 'Enter') tryUnlock(); });
  input.focus();
});
