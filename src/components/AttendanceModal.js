import { saveAttendanceLog } from '../utils/storage.js';

export function openAttendanceModal(containerId, subject) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const todayStr = new Date().toISOString().split('T')[0];

  container.innerHTML = `
    <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div class="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-200">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-lg font-bold text-slate-800">เช็คชื่อเข้าเรียน</h3>
            <p class="text-xs text-purple-600 font-semibold">${subject.code} - ${subject.name}</p>
          </div>
          <button id="close-modal-btn" class="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <div class="grid grid-cols-2 gap-3 mb-4">
          <button data-status="present" class="status-option p-4 rounded-2xl border-2 border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100 text-emerald-800 font-bold flex flex-col items-center gap-2 transition">
            <i data-lucide="check-circle-2" class="w-6 h-6 text-emerald-600"></i>
            <span>มาเรียน</span>
          </button>
          
          <button data-status="late" class="status-option p-4 rounded-2xl border-2 border-amber-100 bg-amber-50/50 hover:bg-amber-100 text-amber-800 font-bold flex flex-col items-center gap-2 transition">
            <i data-lucide="clock" class="w-6 h-6 text-amber-600"></i>
            <span>มาสาย</span>
          </button>

          <button data-status="leave" class="status-option p-4 rounded-2xl border-2 border-blue-100 bg-blue-50/50 hover:bg-blue-100 text-blue-800 font-bold flex flex-col items-center gap-2 transition">
            <i data-lucide="file-text" class="w-6 h-6 text-blue-600"></i>
            <span>ลากิจ / ลาป่วย</span>
          </button>

          <button data-status="absent" class="status-option p-4 rounded-2xl border-2 border-rose-100 bg-rose-50/50 hover:bg-rose-100 text-rose-800 font-bold flex flex-col items-center gap-2 transition">
            <i data-lucide="x-circle" class="w-6 h-6 text-rose-600"></i>
            <span>ขาดเรียน</span>
          </button>
        </div>
      </div>
    </div>
  `;

  lucide.createIcons();

  const closeModal = () => { container.innerHTML = ''; };
  document.getElementById('close-modal-btn').addEventListener('click', closeModal);

  container.querySelectorAll('.status-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const status = btn.getAttribute('data-status');
      saveAttendanceLog({
        subjectId: subject.id,
        date: todayStr,
        status: status,
        timestamp: new Date().toISOString()
      });
      closeModal();
    });
  });
}