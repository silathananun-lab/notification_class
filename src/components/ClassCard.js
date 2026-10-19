import { getSubjects, getSubjectStats, getAttendanceLogs } from '../utils/storage.js';
import { openAttendanceModal } from './AttendanceModal.js';

export function renderClassCards(containerId, dayIndex) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const subjects = getSubjects().filter(s => s.dayOfWeek === dayIndex);
  const todayStr = new Date().toISOString().split('T')[0];
  const logs = getAttendanceLogs();

  if (subjects.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 p-6">
        <i data-lucide="calendar-off" class="w-12 h-12 text-slate-300 mx-auto mb-3"></i>
        <p class="text-slate-500 font-medium">ไม่มีตารางเรียนในวันนี้</p>
        <p class="text-xs text-slate-400 mt-1">กดปุ่ม + ด้านบนเพื่อเพิ่มวิชาเรียน</p>
      </div>
    `;
    return;
  }

  const badgeColors = {
    present: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    absent: 'bg-rose-100 text-rose-700 border-rose-200',
    late: 'bg-amber-100 text-amber-700 border-amber-200',
    leave: 'bg-blue-100 text-blue-700 border-blue-200'
  };

  const statusTexts = {
    present: 'เข้าเรียนแล้ว',
    absent: 'ขาดเรียน',
    late: 'มาสาย',
    leave: 'ลากิจ/ลาป่วย'
  };

  container.innerHTML = subjects.map(subject => {
    const stats = getSubjectStats(subject.id);
    const todayLog = logs.find(l => l.subjectId === subject.id && l.date === todayStr);
    const isWarning = stats.absent >= subject.maxAbsences;

    return `
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition space-y-3 relative overflow-hidden">
        <div class="flex justify-between items-start">
          <div>
            <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 mb-1">
              ${subject.code}
            </span>
            <h3 class="font-bold text-slate-800 text-base">${subject.name}</h3>
          </div>
          ${todayLog ? `
            <span class="px-2.5 py-1 rounded-full text-xs font-medium border ${badgeColors[todayLog.status]}">
              ${statusTexts[todayLog.status]}
            </span>
          ` : `
            <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
              ยังไม่บันทึก
            </span>
          `}
        </div>

        <div class="flex items-center gap-4 text-xs text-slate-500">
          <div class="flex items-center gap-1">
            <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-400"></i>
            <span>${subject.startTime} - ${subject.endTime} น.</span>
          </div>
          <div class="flex items-center gap-1">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400"></i>
            <span>${subject.room}</span>
          </div>
        </div>

        <!-- Attendance Limit Progress -->
        <div class="pt-2 border-t border-slate-50 flex items-center justify-between text-xs">
          <div class="flex items-center gap-1.5">
            <span class="text-slate-400">ขาดเรียน:</span>
            <span class="font-bold ${isWarning ? 'text-rose-600' : 'text-slate-700'}">
              ${stats.absent} / ${subject.maxAbsences} ครั้ง
            </span>
            ${isWarning ? '<span class="text-[10px] bg-rose-500 text-white px-1.5 py-0.2 rounded font-medium">หมดสิทธิ์สอบ</span>' : ''}
          </div>

          <button data-id="${subject.id}" class="check-in-btn bg-slate-900 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1 shadow-sm">
            <i data-lucide="check-square" class="w-3.5 h-3.5"></i>
            <span>เช็คชื่อ</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Attach button click handlers
  container.querySelectorAll('.check-in-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const subId = btn.getAttribute('data-id');
      const subject = subjects.find(s => s.id === subId);
      openAttendanceModal('modal-container', subject);
    });
  });
}