const SUBJECTS_KEY = 'classtrack_subjects';
const LOGS_KEY = 'classtrack_attendance_logs';

const defaultSubjects = [
  {
    id: 'sub_1',
    code: 'CS101',
    name: 'การเขียนโปรแกรมคอมพิวเตอร์ 1',
    instructor: 'ดร.วิชัย รักการสอน',
    room: 'Lab Com 302',
    dayOfWeek: 1, // วันจันทร์
    startTime: '09:00',
    endTime: '12:00',
    maxAbsences: 3
  },
  {
    id: 'sub_2',
    code: 'GEN201',
    name: 'ภาษาอังกฤษเพื่อการสื่อสาร',
    instructor: 'Aj. Sarah Jenkins',
    room: 'อาคารเรียนรวม 405',
    dayOfWeek: 1, // วันจันทร์
    startTime: '13:00',
    endTime: '15:00',
    maxAbsences: 4
  }
];

export function initStorage() {
  if (!localStorage.getItem(SUBJECTS_KEY)) {
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(defaultSubjects));
  }
  if (!localStorage.getItem(LOGS_KEY)) {
    localStorage.setItem(LOGS_KEY, JSON.stringify([]));
  }
}

export function getSubjects() {
  return JSON.parse(localStorage.getItem(SUBJECTS_KEY) || '[]');
}

export function saveSubject(subject) {
  const subjects = getSubjects();
  subjects.push({ ...subject, id: 'sub_' + Date.now() });
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
}

export function deleteSubject(id) {
  const subjects = getSubjects().filter(s => s.id !== id);
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
  window.dispatchEvent(new Event('attendance-updated'));
}

export function getAttendanceLogs() {
  return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
}

export function saveAttendanceLog(log) {
  const logs = getAttendanceLogs();
  const filtered = logs.filter(l => !(l.subjectId === log.subjectId && l.date === log.date));
  filtered.push(log);
  localStorage.setItem(LOGS_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new Event('attendance-updated'));
}

export function getSubjectStats(subjectId) {
  const logs = getAttendanceLogs().filter(l => l.subjectId === subjectId);
  const present = logs.filter(l => l.status === 'present').length;
  const absent = logs.filter(l => l.status === 'absent').length;
  const late = logs.filter(l => l.status === 'late').length;
  const leave = logs.filter(l => l.status === 'leave').length;

  return { present, absent, late, leave, total: logs.length };
}