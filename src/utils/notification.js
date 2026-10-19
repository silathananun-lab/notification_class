// src/utils/notification.js

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('เบราว์เซอร์นี้ไม่รองรับการแจ้งเตือน');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function showNotification(title, options) {
  if (Notification.permission === 'granted') {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          icon: 'https://cdn-icons-png.flaticon.com/512/3652/3652191.png',
          badge: 'https://cdn-icons-png.flaticon.com/512/3652/3652191.png',
          vibrate: [200, 100, 200],
          ...options
        });
      });
    } else {
      new Notification(title, {
        icon: 'https://cdn-icons-png.flaticon.com/512/3652/3652191.png',
        ...options
      });
    }
  }
}

export function initClassNotificationChecker(getSubjectsFn) {
  requestNotificationPermission();

  setInterval(() => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const subjects = getSubjectsFn();

    subjects.forEach(sub => {
      if (sub.dayOfWeek === currentDay && sub.startTime) {
        const [startHour, startMinute] = sub.startTime.split(':').map(Number);
        
        // คำนวณเวลาแจ้งเตือนก่อนเริ่ม 10 นาที
        let targetMinute = startMinute - 10;
        let targetHour = startHour;
        if (targetMinute < 0) {
          targetMinute += 60;
          targetHour -= 1;
        }

        if (currentHour === targetHour && currentMinute === targetMinute) {
          const alertKey = `alerted_${sub.id}_${now.toDateString()}`;
          if (!sessionStorage.getItem(alertKey)) {
            showNotification(`⏰ ใกล้ถึงเวลาเรียนวิชา ${sub.code}`, {
              body: `${sub.name}\nห้องเรียน: ${sub.room || 'ไม่ระบุห้อง'} | เริ่มเวลา ${sub.startTime} น.`,
              tag: `class-alert-${sub.id}`
            });
            sessionStorage.setItem(alertKey, 'true');
          }
        }
      }
    });
  }, 30000);
}