export function renderCalendarStrip(containerId, activeDayIndex, onSelectDay) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const days = [
    { name: 'อา.', index: 0 },
    { name: 'จ.', index: 1 },
    { name: 'อ.', index: 2 },
    { name: 'พ.', index: 3 },
    { name: 'พฤ.', index: 4 },
    { name: 'ศ.', index: 5 },
    { name: 'ส.', index: 6 }
  ];

  container.innerHTML = `
    <div class="grid grid-cols-7 gap-1 text-center">
      ${days.map(day => {
        const isActive = day.index === activeDayIndex;
        return `
          <button data-day="${day.index}" class="day-btn py-2.5 rounded-2xl transition flex flex-col items-center justify-center gap-1 ${
            isActive ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium'
          }">
            <span class="text-xs">${day.name}</span>
            <span class="w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-transparent'}"></span>
          </button>
        `;
      }).join('')}
    </div>
  `;

  container.querySelectorAll('.day-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dayIdx = parseInt(btn.getAttribute('data-day'));
      onSelectDay(dayIdx);
      renderCalendarStrip(containerId, dayIdx, onSelectDay);
    });
  });
}