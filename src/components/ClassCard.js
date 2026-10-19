import { getSubjects, getSubjectStats, deleteSubject } from '../utils/storage.js';
import { openAttendanceModal } from './AttendanceModal.js';

export function renderClassCards(containerId, dayIndex, onRefresh) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const subjects = getSubjects().filter(s => s.dayOfWeek === dayIndex);

  if (subjects.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 p-6">
        <i data-lucide="calendar-x" class="w-12 h-12 text-slate-300 mx-auto mb-2"></i>
        <p class="text-slate-500 font-medium text-sm">ไม่มีตารางเรียนในวันนี้</p>
      </div>
    `;
    return;
  }

  container.innerHTML = subjects.map(subject => {
    const stats = getSubjectStats(subject.id);

    return `
      <div class="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3 relative">
        <div class="flex justify-between items-start">
          <div class="space-y-1">
            <span class="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
              ${subject.code}
            </span>
            <h3 class="font-bold text-slate-800 text-base leading-snug">${subject.name}</h3>
            ${subject.instructor ? `
              <p class="text-xs text-slate-400 flex items-center gap-1">
                <i data-lucide="user" class="w-3.5 h-3.5"></i>
                <span>${subject.instructor}</span>
              </p>
            ` : ''}
          </div>

          <div class="flex items-center gap-1 text-slate-300">
            <button data-delete="${subject.id}" class="delete-btn p-1.5 hover:text-rose-500 transition" title="ลบวิชา">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <div class="bg-slate-50 rounded-2xl p-2.5 flex items-center justify-between text-xs text-slate-600 font-medium">
          <div class="flex items-center gap-1.5">
            <i data-lucide="clock" class="w-4 h-4 text-slate-400"></i>
            <span>${subject.startTime} - ${subject.endTime} น.</span>
          </div>
          <div class="flex items-center gap-1.5">
            <i data-lucide="map-pin" class="w-4 h-4 text-slate-400"></i>
            <span>${subject.room}</span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-1 text-xs">
          <div class="text-slate-500">
            ขาดไป: <strong class="${stats.absent >= subject.maxAbsences ? 'text-rose-600' : 'text-slate-800'}">${stats.absent}/${subject.maxAbsences}</strong>
            <span class="mx-1">•</span>
            มาเรียน: <strong class="text-emerald-600">${stats.present}</strong>
          </div>

          <button data-id="${subject.id}" class="check-in-btn bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-2xl shadow-md shadow-purple-200 transition flex items-center gap-1.5">
            <i data-lucide="check-square" class="w-4 h-4"></i>
            <span>เช็คชื่อ</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.check-in-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const subId = btn.getAttribute('data-id');
      const subject = subjects.find(s => s.id === subId);
      openAttendanceModal('modal-container', subject);
    });
  });

  container.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('คุณต้องการลบรายวิชานี้ใช่หรือไม่?')) {
        const subId = btn.getAttribute('data-delete');
        deleteSubject(subId);
        if (onRefresh) onRefresh();
      }
    });
  });
}