// เรียก requireUnlock() บนสุดของทุกหน้าที่ไม่อยากให้เข้าถึงตรงๆ โดยไม่ผ่านรหัส
function requireUnlock(gatePage = 'index.html'){
  if(sessionStorage.getItem('mk_unlocked') !== 'true'){
    window.location.href = gatePage;
  }
}

// นับจำนวนวันตั้งแต่วันเริ่มต้นความสัมพันธ์ ใส่ id="day-count" ในหน้าไหนก็เรียกใช้ได้
function startDayCounter(elId = 'day-count', startDate = new Date(2021, 8, 9)){
  const el = document.getElementById(elId);
  if(!el) return;
  function update(){
    const now = new Date();
    const diffDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    el.textContent = diffDays.toLocaleString('th-TH');
  }
  update();
  setInterval(update, 60000);
}
