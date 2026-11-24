const pad = (n) => String(n).padStart(2, '0');

// 3725 → "01:02:05"
export function formatClock(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

// 3725 → "1시간 2분", 7200 → "2시간", 125 → "2분 5초", 120 → "2분", 45 → "45초"
export function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
  if (m > 0) return s % 60 > 0 ? `${m}분 ${s % 60}초` : `${m}분`;
  return `${s}초`;
}

// 분 단위: 90 → "1시간 30분", 120 → "2시간", 45 → "45분"
export function formatMinutes(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h > 0) return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
  return `${m}분`;
}

// 막대 그래프 위에 붙이는 짧은 표기: 3725 → "1:02", 1500 → "25분", 40 → "<1분", 0 → ""
export function formatShort(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  if (s === 0) return '';
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}:${pad(m)}`;
  if (m > 0) return `${m}분`;
  return '<1분';
}

// Date → "2026-11-23" (브라우저의 로컬 날짜 기준)
// toISOString()은 UTC라서 한국에서 새벽에는 날짜가 하루 어긋나므로 쓰지 않는다.
export function toDateString(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

// "2026-11-23" → Date (브라우저의 로컬 날짜)
export function parseDateString(text) {
  const [y, m, d] = text.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// "2026-11-23" → "2026년 11월 23일 (월)"
export function formatDateLabel(text) {
  const date = parseDateString(text);
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${dayNames[date.getDay()]})`;
}

// "2026-11-23T09:05:00" → "09:05"
export function formatTimeOfDay(dateTime) {
  return dateTime ? dateTime.slice(11, 16) : '';
}