import { getSubjects, getSubjectStats } from '../utils/storage.js';

export function openStatsModal(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const subjects = getSubjects();

  container.innerHTML = `
    <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div class="bg-white w-full max-w-md h-[80vh] md:h-auto rounded-t-3xl md:rounded-3xl p-6 shadow-2xl flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-lg font-bold text-slate-800">สรุปสถิติการเข้าเรียน</h3>
            <p class="text-xs text-slate-400">ประวัติขาด ลา มาสาย รายวิชา</p>
          </div>
          <button id="close-stats-btn" class="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto space-y-3 pr-1">
          ${subjects.map(subject => {
            const stats = getSubjectStats(subject.id);
            const percent = Math.min(Math.round((stats.absent / subject.maxAbsences) * 100), 100);
            
            return `
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                <div class="flex justify-between items-start">
                  <div>
                    <span class="text-xs font-bold text-purple-600">${subject.code}</span>
                    <h4 class="font-bold text-slate-800 text-sm">${subject.name}</h4>
                  </div>
                  <span class="text-xs font-bold ${stats.absent >= subject.maxAbsences ? 'text-rose-600' : 'text-slate-600'}">
                    ขาด ${stats.absent}/${subject.maxAbsences} ครั้ง
                  </span>
                </div>

                <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div class="h-full ${percent >= 100 ? 'bg-rose-500' : 'bg-purple-600'} transition-all duration-300" style="width: ${percent}%"></div>
                </div>

                <div class="grid grid-cols-4 gap-2 text-center text-xs pt-1">
                  <div class="bg-white p-2 rounded-xl border border-slate-100">
                    <p class="text-slate-400 text-[10px]">มาเรียน</p>
                    <p class="font-bold text-emerald-600">${stats.present}</p>
                  </div>
                  <div class="bg-white p-2 rounded-xl border border-slate-100">
                    <p class="text-slate-400 text-[10px]">มาสาย</p>
                    <p class="font-bold text-amber-600">${stats.late}</p>
                  </div>
                  <div class="bg-white p-2 rounded-xl border border-slate-100">
                    <p class="text-slate-400 text-[10px]">ลากิจ/ป่วย</p>
                    <p class="font-bold text-blue-600">${stats.leave}</p>
                  </div>
                  <div class="bg-white p-2 rounded-xl border border-slate-100">
                    <p class="text-slate-400 text-[10px]">ขาดเรียน</p>
                    <p class="font-bold text-rose-600">${stats.absent}</p>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  lucide.createIcons();
  document.getElementById('close-stats-btn').addEventListener('click', () => { container.innerHTML = ''; });
}