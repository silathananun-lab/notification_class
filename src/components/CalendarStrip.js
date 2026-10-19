export function renderCalendarStrip(containerId, activeDayIndex, onSelectDay) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const days = [
    { name: 'อา', full: 'อาทิตย์', index: 0 },
    { name: 'จ', full: 'จันทร์', index: 1 },
    { name: 'อ', full: 'อังคาร', index: 2 },
    { name: 'พ', full: 'พุธ', index: 3 },
    { name: 'พฤ', full: 'พฤหัสฯ', index: 4 },
    { name: 'ศ', full: 'ศุกร์', index: 5 },
    { name: 'ส', full: 'เสาร์', index: 6 }
  ];

  container.innerHTML = `
    <div class="flex justify-between items-center text-center">
      ${days.map(day => {
        const isActive = day.index === activeDayIndex;
        return `
          <button data-day="${day.index}" class="day-btn flex-1 py-2 px-1 rounded-xl transition flex flex-col items-center gap-1 ${
            isActive ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-100' : 'text-slate-500 hover:bg-slate-100'
          }">
            <span class="text-xs ${isActive ? 'text-indigo-200' : 'text-slate-400'}">${day.name}</span>
            <span class="text-sm">${day.index === new Date().getDay() ? '•' : day.index}</span>
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