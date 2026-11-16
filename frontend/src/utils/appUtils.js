import { useEffect, useState } from 'react';

export function createDefaultProfile() {
  return {
    name: '',
    university: '',
    major: '',
    admissionYear: String(new Date().getFullYear() + 1),
    photo: '',
    memberCode: `DC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  };
}

export function normalizeProfile(value) {
  const defaults = createDefaultProfile();
  if (!value || typeof value !== 'object') return defaults;

  const normalized = { ...defaults, ...value };

  // 이전 디자인 시안에서 예시로 저장된 고려대학교 값이 남아 있는 경우를 정리함.
  // v3 마이그레이션은 한 번만 실행하므로, 정리 후 사용자가 고려대학교를 직접 선택해도 유지됨.
  const migrationKey = 'dream-campus-profile-demo-university-migrated-v3';
  try {
    if (window.localStorage.getItem(migrationKey) !== 'done') {
      const savedUniversity = String(normalized.university || '').trim();
      const oldDemoUniversities = new Set(['고려대학교', '고려대', 'Korea University']);
      if (oldDemoUniversities.has(savedUniversity)) {
        normalized.university = '';
        normalized.major = '';
      }
      window.localStorage.setItem(migrationKey, 'done');
    }
  } catch (error) {
    console.warn('목표 대학 기본값 정리 상태를 저장하지 못했어요.', error);
  }

  return normalized;
}

export function usePersistentState(key, createInitialValue, normalize = (value) => value) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved === null ? normalize(createInitialValue()) : normalize(JSON.parse(saved));
    } catch (error) {
      console.warn(`저장 데이터(${key})를 불러오지 못했어요.`, error);
      return createInitialValue();
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`저장 데이터(${key})를 저장하지 못했어요.`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

export function getLocalDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDdayInfo(dateValue) {
  if (!dateValue) return { label: '--', description: '목표 날짜를 설정해 줘.' };
  const [year, month, day] = dateValue.split('-').map(Number);
  if (!year || !month || !day) return { label: '--', description: '날짜를 다시 확인해 줘.' };

  const target = Date.UTC(year, month - 1, day);
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const difference = Math.round((target - today) / 86400000);
  const label = difference === 0 ? 'D-DAY' : difference > 0 ? `D-${difference}` : `D+${Math.abs(difference)}`;
  const description = difference === 0 ? '오늘이 목표 날짜야!' : difference > 0 ? '목표 날짜까지 남은 날' : '목표 날짜가 지난 지';
  return { label, description, difference };
}

export function getDateLabel(dateValue) {
  if (!dateValue) return '날짜 미설정';
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '날짜 미설정';
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}


export const ADMISSION_EVENT_CATEGORIES = ['모의고사', '수능', '논술', '면접', '원서접수', '합격 발표', '기타'];
export const CALENDAR_WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function isValidDateKey(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return false;
  const [year, month, day] = String(value).split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function inferEventCategory(title) {
  const text = String(title || '').replace(/\s/g, '').toLowerCase();
  if (text.includes('모의고사') || text.includes('모평') || text.includes('모고')) return '모의고사';
  if (text.includes('수능')) return '수능';
  if (text.includes('논술')) return '논술';
  if (text.includes('면접')) return '면접';
  if (text.includes('원서')) return '원서접수';
  if (text.includes('합격')) return '합격 발표';
  return '기타';
}

export function normalizeAdmissionEvents(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === 'object' && isValidDateKey(item.date) && String(item.title || '').trim())
    .map((item, index) => ({
      id: String(item.id || `event-${index}-${item.date}`),
      title: String(item.title).trim().slice(0, 60),
      category: ADMISSION_EVENT_CATEGORIES.includes(item.category) ? item.category : inferEventCategory(item.title),
      date: item.date,
    }));
}

export function createInitialAdmissionEvents() {
  // 이전 버전에서 저장한 D-Day 한 건은 새 일정 목록으로 옮겨 기존 사용자 입력을 보존함.
  // 단, 기본 안내 문구만 저장된 상태라면 가짜 일정을 만들지 않음.
  try {
    const legacyTitleRaw = window.localStorage.getItem('dream-campus-dday-title');
    const legacyDateRaw = window.localStorage.getItem('dream-campus-dday-date');
    if (!legacyTitleRaw || !legacyDateRaw) return [];
    const legacyTitle = JSON.parse(legacyTitleRaw);
    const legacyDate = JSON.parse(legacyDateRaw);
    if (!String(legacyTitle || '').trim() || legacyTitle === '나의 목표 일정' || !isValidDateKey(legacyDate)) return [];
    return [{
      id: `migrated-${Date.now()}`,
      title: String(legacyTitle).trim(),
      category: inferEventCategory(legacyTitle),
      date: legacyDate,
    }];
  } catch (error) {
    console.warn('이전 D-Day 정보를 옮기지 못했어요.', error);
    return [];
  }
}

export function getCalendarDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCalendarGridDays(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - firstDay.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
    return { date, dateKey: getCalendarDateKey(date), inMonth: date.getMonth() === month };
  });
}

export function sortAdmissionEvents(events) {
  return [...events].sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title, 'ko'));
}

export function getUpcomingAdmissionEvents(events, limit = 3) {
  const today = getLocalDateKey();
  return sortAdmissionEvents(events).filter((event) => event.date >= today).slice(0, limit);
}

export function getEventCategoryClass(category) {
  const classes = {
    '모의고사': 'mock', '수능': 'csat', '논술': 'essay', '면접': 'interview',
    '원서접수': 'application', '합격 발표': 'result', '기타': 'other',
  };
  return classes[category] || 'other';
}

export function getUniversityTheme() {
  // 어느 대학을 목표로 하더라도 같은 DREAM CAMPUS 공통 카드 디자인을 사용함.
  // 실제 대학 로고나 공식 학생증 디자인을 사용한다는 의미는 아님.
  return { accent: '#8797B8', soft: '#EEF1F8' };
}

export async function resizeImageFile(file) {
  if (!file || !file.type.startsWith('image/')) throw new Error('이미지 파일만 등록할 수 있어.');
  if (file.size > 8 * 1024 * 1024) throw new Error('사진은 8MB 이하 파일을 선택해 줘.');

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('사진을 읽지 못했어.'));
    reader.readAsDataURL(file);
  });

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const maxSize = 480;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext('2d');
      if (!context) return reject(new Error('사진을 처리하지 못했어.'));
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    image.onerror = () => reject(new Error('사진을 불러오지 못했어.'));
    image.src = dataUrl;
  });
}

