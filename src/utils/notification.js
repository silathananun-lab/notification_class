// src/utils/notification.js

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    alert('เบราว์เซอร์นี้ไม่รองรับ Notification');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export function showNotification(title, options = {}) {
  const defaultOptions = {
    icon: 'https://cdn-icons-png.flaticon.com/512/3652/3652191.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/3652/3652191.png',
    vibrate: [200, 100, 200],
    ...options
  };

  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SHOW_NOTIFICATION',
      title: title,
      options: defaultOptions
    });
  } else if (Notification.permission === 'granted') {
    new Notification(title, defaultOptions);
  }
}

export function initClassNotificationChecker(getSubjectsFn) {
  requestNotificationPermission();

  // ตรวจสอบเวลาทุกๆ 10 วินาที
  setInterval(() => {
    const now = new Date();
    const currentDay = now.getDay(); 
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const subjects = getSubjectsFn() || [];

    subjects.forEach(sub => {
      // แปลงชนิดข้อมูลวันให้ตรงกันแน่นอน
      const subDay = Number(sub.dayOfWeek);
      if (subDay === currentDay && sub.startTime) {
        const [startHour, startMinute] = sub.startTime.split(':').map(Number);
        
        let targetMinute = startMinute - 10;
        let targetHour = startHour;
        if (targetMinute < 0) {
          targetMinute += 60;
          targetHour -= 1;
        }

        if (currentHour === targetHour && currentMinute === targetMinute) {
          const alertKey = `alerted_${sub.id || sub.code}_${now.toDateString()}_${currentHour}_${currentMinute}`;
          if (!sessionStorage.getItem(alertKey)) {
            showNotification(`⏰ ใกล้ถึงเวลาเรียนวิชา ${sub.code || ''}`, {
              body: `${sub.name || 'มีวิชาเรียน'}\nห้องเรียน: ${sub.room || 'ไม่ระบุ'} | เวลา ${sub.startTime} น.`,
              tag: `class-alert-${sub.id || sub.code}`
            });
            sessionStorage.setItem(alertKey, 'true');
          }
        }
      }
    });
  }, 10000); // เช็คถี่ขึ้นเป็นทุก 10 วินาที
}