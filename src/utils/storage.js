// LocalStorage Keys
const SUBJECTS_KEY = 'classtrack_subjects';
const LOGS_KEY = 'classtrack_attendance_logs';

// Default initial subjects data
const defaultSubjects = [];

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

export function getAttendanceLogs() {
  return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
}

export function saveAttendanceLog(log) {
  const logs = getAttendanceLogs();
  // Filter out existing record for same subject and date if updated
  const filtered = logs.filter(l => !(l.subjectId === log.subjectId && l.date === log.date));
  filtered.push(log);
  localStorage.setItem(LOGS_KEY, JSON.stringify(filtered));

  // Trigger custom event for UI updates
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