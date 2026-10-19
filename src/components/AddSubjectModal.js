import { saveSubject } from '../utils/storage.js';

export function openAddSubjectModal(containerId, onAdded) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div class="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl p-6 shadow-2xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-slate-800">เพิ่มรายวิชาใหม่</h3>
          <button id="close-add-modal-btn" class="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <form id="add-subject-form" class="space-y-3 text-xs">
          <div>
            <label class="block font-medium text-slate-600 mb-1">รหัสวิชา</label>
            <input type="text" id="sub-code" required placeholder="เช่น CS101" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600">
          </div>

          <div>
            <label class="block font-medium text-slate-600 mb-1">ชื่อวิชา</label>
            <input type="text" id="sub-name" required placeholder="เช่น การเขียนโปรแกรมคอมพิวเตอร์ 1" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600">
          </div>

          <div>
            <label class="block font-medium text-slate-600 mb-1">ชื่ออาจารย์ผู้สอน</label>
            <input type="text" id="sub-instructor" placeholder="เช่น ดร.วิชัย รักการสอน" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-medium text-slate-600 mb-1">ห้องเรียน</label>
              <input type="text" id="sub-room" placeholder="เช่น Lab Com 302" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600">
            </div>
            <div>
              <label class="block font-medium text-slate-600 mb-1">วันเรียน</label>
              <select id="sub-day" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600">
                <option value="1">วันจันทร์</option>
                <option value="2">วันอังคาร</option>
                <option value="3">วันพุธ</option>
                <option value="4">วันพฤหัสบดี</option>
                <option value="5">วันศุกร์</option>
                <option value="6">วันเสาร์</option>
                <option value="0">วันอาทิตย์</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-medium text-slate-600 mb-1">เวลาเริ่ม</label>
              <input type="time" id="sub-start" value="09:00" required class="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600">
            </div>
            <div>
              <label class="block font-medium text-slate-600 mb-1">เวลาสิ้นสุด</label>
              <input type="time" id="sub-end" value="12:00" required class="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600">
            </div>
          </div>

          <div>
            <label class="block font-medium text-slate-600 mb-1">จำกัดจำนวนขาดเรียนสูงสุด (ครั้ง)</label>
            <input type="number" id="sub-max-absent" value="3" min="1" required class="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600">
          </div>

          <button type="submit" class="w-full mt-2 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition">
            บันทึกวิชาเรียน
          </button>
        </form>
      </div>
    </div>
  `;

  lucide.createIcons();

  const closeModal = () => { container.innerHTML = ''; };
  document.getElementById('close-add-modal-btn').addEventListener('click', closeModal);

  document.getElementById('add-subject-form').addEventListener('submit', (e) => {
    e.preventDefault();
    saveSubject({
      code: document.getElementById('sub-code').value,
      name: document.getElementById('sub-name').value,
      instructor: document.getElementById('sub-instructor').value,
      room: document.getElementById('sub-room').value,
      dayOfWeek: parseInt(document.getElementById('sub-day').value),
      startTime: document.getElementById('sub-start').value,
      endTime: document.getElementById('sub-end').value,
      maxAbsences: parseInt(document.getElementById('sub-max-absent').value)
    });
    closeModal();
    if (onAdded) onAdded();
  });
}