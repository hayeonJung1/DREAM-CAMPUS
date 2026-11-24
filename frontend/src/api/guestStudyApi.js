// 로그인하지 않은 사용자를 위한 공부 기록 저장소.
// 서버 API(studyApi.js)와 함수 이름·응답 모양이 같고, 데이터는 이 브라우저의 localStorage 에 저장한다.
// 시간 계산과 통계 규칙은 백엔드(StudySession, StudyStatsService)와 같은 규칙을 따른다.

const STORAGE_KEY = 'dream-campus-guest-study-v1';
const DEFAULT_SUBJECTS = ['국어', '수학', '영어', '한국사', '탐구'];
const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];
const FREE_STUDY = '자유 공부';
const MAX_NAME_LENGTH = 30;

// 서버가 돌려주는 에러와 같은 모양(status, message)의 에러를 만든다
const httpError = (status, message) => Object.assign(new Error(message), { status });

// ---------- 저장소 읽기·쓰기 ----------
// 요청마다 "읽기 → 고치기 → 저장" 순서로 처리해서, 탭이 여러 개여도 최신 상태를 기준으로 한다.

const emptyData = () => ({
  version: 1,
  nextSubjectId: 1,
  nextSessionId: 1,
  subjects: [],      // { studySubjectId, name, active }
  sessions: [],      // { sessionId, studySubjectId, startedAt, endedAt, pausedAt, totalPausedSeconds, durationSeconds } (시각은 ms)
  goalMinutes: null,
});

function load() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1 && Array.isArray(parsed.subjects) && Array.isArray(parsed.sessions)) {
        return parsed;
      }
    }
  } catch {
    /* 읽을 수 없거나 형식이 깨졌으면 새로 시작한다 */
  }
  return emptyData();
}

function save(data) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    throw httpError(500, '이 브라우저에는 기록을 저장할 수 없어요. 저장 공간이 가득 찼거나 시크릿 모드일 수 있어요.');
  }
}

// ---------- 시간 계산 (StudySession.java 와 같은 규칙) ----------

const secondsBetween = (from, to) => Math.max(0, Math.floor((to - from) / 1000));

const statusOf = (s) => {
  if (s.endedAt !== null) return 'ENDED';
  if (s.pausedAt !== null) return 'PAUSED';
  return 'RUNNING';
};

// 지금까지의 순수 공부 시간(초). 일시정지 중이면 멈춘 시점까지만 센다.
const elapsedSeconds = (s, now) => {
  if (s.endedAt !== null) return s.durationSeconds;
  const end = s.pausedAt !== null ? s.pausedAt : now;
  return Math.max(0, secondsBetween(s.startedAt, end) - s.totalPausedSeconds);
};

const subjectNameOf = (data, subjectId) => {
  if (subjectId === null) return null;
  const found = data.subjects.find((s) => s.studySubjectId === subjectId);
  return found ? found.name : null;
};

const toSessionResponse = (data, s, now) => ({
  sessionId: s.sessionId,
  studySubjectId: s.studySubjectId,
  studySubjectName: subjectNameOf(data, s.studySubjectId),
  status: statusOf(s),
  totalPausedSeconds: s.totalPausedSeconds,
  elapsedSeconds: elapsedSeconds(s, now),
});

// ---------- 날짜 도우미 (브라우저의 로컬 날짜 기준) ----------

const pad = (n) => String(n).padStart(2, '0');
const toKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const dateKey = (ms) => toKey(new Date(ms));
const parseDate = (text) => {
  const [y, m, d] = text.split('-').map(Number);
  return new Date(y, m - 1, d);
};

// ---------- 과목 ----------

const sameName = (a, b) => a.toLowerCase() === b.toLowerCase();   // DB 설정처럼 대소문자를 구분하지 않는다

const toSubjectResponse = (s) => ({ studySubjectId: s.studySubjectId, name: s.name });

function validateName(rawName) {
  const name = (rawName ?? '').trim();
  if (!name) throw httpError(400, '과목 이름을 입력해 주세요.');
  if (name.length > MAX_NAME_LENGTH) throw httpError(400, '과목 이름은 30자 이하로 입력해 주세요.');
  return name;
}

// 숨기지 않은 내 과목을 찾는다
function findActiveSubject(data, id) {
  const subject = data.subjects.find((s) => s.studySubjectId === id && s.active);
  if (!subject) throw httpError(404, '과목을 찾을 수 없습니다.');
  return subject;
}

export async function getSubjects() {
  const data = load();
  // 한 번도 과목을 만든 적이 없을 때만 기본 과목을 만든다 (숨긴 과목도 센다)
  if (data.subjects.length === 0) {
    DEFAULT_SUBJECTS.forEach((name) => {
      data.subjects.push({ studySubjectId: data.nextSubjectId, name, active: true });
      data.nextSubjectId += 1;
    });
    save(data);
  }
  return data.subjects.filter((s) => s.active).map(toSubjectResponse);
}

export async function createSubject(rawName) {
  const data = load();
  const name = validateName(rawName);
  if (data.subjects.some((s) => s.active && sameName(s.name, name))) {
    throw httpError(409, '이미 있는 과목입니다.');
  }
  const subject = { studySubjectId: data.nextSubjectId, name, active: true };
  data.nextSubjectId += 1;
  data.subjects.push(subject);
  save(data);
  return toSubjectResponse(subject);
}

export async function renameSubject(id, rawName) {
  const data = load();
  const subject = findActiveSubject(data, id);
  const name = validateName(rawName);
  if (data.subjects.some((s) => s.active && s.studySubjectId !== id && sameName(s.name, name))) {
    throw httpError(409, '이미 있는 과목 이름입니다.');
  }
  subject.name = name;
  save(data);
  return toSubjectResponse(subject);
}

export async function deleteSubject(id) {
  const data = load();
  findActiveSubject(data, id).active = false;   // 진짜 삭제가 아니라 숨김 (지난 공부 기록 보존)
  save(data);
}

// ---------- 공부 세션 ----------

const findRunningSession = (data) => data.sessions.find((s) => s.endedAt === null) ?? null;

function findSession(data, id) {
  const session = data.sessions.find((s) => s.sessionId === id);
  if (!session) throw httpError(404, '공부 기록을 찾을 수 없어요.');
  return session;
}

// 진행 중인 공부가 없으면 null
export async function getActiveSession() {
  const data = load();
  const session = findRunningSession(data);
  return session ? toSessionResponse(data, session, Date.now()) : null;
}

export async function startSession(studySubjectId) {
  const data = load();
  if (findRunningSession(data)) throw httpError(409, '이미 진행 중인 공부가 있어요.');
  if (studySubjectId !== null && studySubjectId !== undefined) {
    findActiveSubject(data, studySubjectId);   // 내 과목이 아니면 404
  }
  const now = Date.now();
  const session = {
    sessionId: data.nextSessionId,
    studySubjectId: studySubjectId ?? null,
    startedAt: now,
    endedAt: null,
    pausedAt: null,
    totalPausedSeconds: 0,
    durationSeconds: 0,
  };
  data.nextSessionId += 1;
  data.sessions.push(session);
  save(data);
  return toSessionResponse(data, session, now);
}

export async function pauseSession(id) {
  const data = load();
  const session = findSession(data, id);
  if (session.endedAt !== null) throw httpError(409, '이미 종료된 공부예요.');
  if (session.pausedAt !== null) throw httpError(409, '이미 일시정지 중이에요.');
  const now = Date.now();
  session.pausedAt = now;
  save(data);
  return toSessionResponse(data, session, now);
}

export async function resumeSession(id) {
  const data = load();
  const session = findSession(data, id);
  if (session.endedAt !== null) throw httpError(409, '이미 종료된 공부예요.');
  if (session.pausedAt === null) throw httpError(409, '일시정지 상태가 아니에요.');
  const now = Date.now();
  session.totalPausedSeconds += secondsBetween(session.pausedAt, now);   // 쉰 시간을 누적하고
  session.pausedAt = null;                                               // 다시 진행 중으로
  save(data);
  return toSessionResponse(data, session, now);
}

export async function stopSession(id) {
  const data = load();
  const session = findSession(data, id);
  if (session.endedAt !== null) throw httpError(409, '이미 종료된 공부예요.');
  const now = Date.now();
  if (session.pausedAt !== null) {   // 쉬는 중에 끝냈다면 쉰 시간부터 정리
    session.totalPausedSeconds += secondsBetween(session.pausedAt, now);
    session.pausedAt = null;
  }
  session.endedAt = now;
  session.durationSeconds = Math.max(0, secondsBetween(session.startedAt, now) - session.totalPausedSeconds);
  save(data);
  return toSessionResponse(data, session, now);
}

// ---------- 통계 (StudyStatsService.java 와 같은 규칙) ----------
// 세션은 "시작한 날짜"에 귀속되고, 진행 중인 세션은 지금까지의 시간을 더한다.

const sumSeconds = (sessions, now) => sessions.reduce((sum, s) => sum + elapsedSeconds(s, now), 0);
const goalSecondsOf = (data) => (data.goalMinutes === null ? null : data.goalMinutes * 60);
const rateOf = (total, goalSeconds) => (goalSeconds ? Math.round((total * 1000) / goalSeconds) / 10 : null);

export async function getDailyStat(date) {
  const data = load();
  const now = Date.now();
  const sessions = data.sessions.filter((s) => dateKey(s.startedAt) === date);
  const total = sumSeconds(sessions, now);
  const active = sumSeconds(sessions.filter((s) => s.endedAt === null), now);
  const goalSeconds = goalSecondsOf(data);
  return {
    date,
    totalSeconds: total,
    activeSeconds: active,
    sessionCount: sessions.length,
    goalSeconds,
    achievementRate: rateOf(total, goalSeconds),
  };
}

export async function getWeeklyStat(date) {
  const data = load();
  const now = Date.now();
  const base = parseDate(date);
  const monday = new Date(base);
  monday.setDate(base.getDate() - ((base.getDay() + 6) % 7));   // 그 주의 월요일

  const goalSeconds = goalSecondsOf(data);
  const days = [];
  let total = 0;
  let studiedDays = 0;
  let achievedDays = 0;
  for (let i = 0; i < 7; i += 1) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    const key = toKey(day);
    const seconds = sumSeconds(data.sessions.filter((s) => dateKey(s.startedAt) === key), now);
    days.push({ date: key, dayLabel: DAY_LABELS[i], totalSeconds: seconds });
    total += seconds;
    if (seconds > 0) studiedDays += 1;
    if (goalSeconds !== null && seconds >= goalSeconds) achievedDays += 1;
  }
  return {
    startDate: days[0].date,
    endDate: days[6].date,
    days,
    totalSeconds: total,
    studiedDays,
    goalSeconds,
    achievedDays: goalSeconds === null ? null : achievedDays,
  };
}

// from, to 가 없으면 전체 기간. 과목 "이름" 기준으로 합산한다 (지웠다 다시 만든 과목도 한 줄)
export async function getSubjectStats(from, to) {
  if (from && to && from > to) throw httpError(400, '시작일이 종료일보다 늦을 수 없어요.');
  const data = load();
  const now = Date.now();

  const grouped = new Map();   // 이름 → { totalSeconds, sessionCount }
  let totalAll = 0;
  data.sessions
    .filter((s) => {
      const key = dateKey(s.startedAt);
      return (!from || key >= from) && (!to || key <= to);
    })
    .forEach((s) => {
      const name = subjectNameOf(data, s.studySubjectId) ?? FREE_STUDY;
      const seconds = elapsedSeconds(s, now);
      const entry = grouped.get(name) ?? { totalSeconds: 0, sessionCount: 0 };
      entry.totalSeconds += seconds;
      entry.sessionCount += 1;
      grouped.set(name, entry);
      totalAll += seconds;
    });

  return [...grouped.entries()]
    .map(([subjectName, entry]) => ({
      subjectName,
      totalSeconds: entry.totalSeconds,
      sessionCount: entry.sessionCount,
      percent: totalAll === 0 ? 0 : Math.round((entry.totalSeconds * 1000) / totalAll) / 10,
    }))
    .sort((a, b) => b.totalSeconds - a.totalSeconds);   // 많이 한 과목 먼저
}

// ---------- 목표 ----------

// dailyGoalMinutes 가 null 이면 목표 해제
export async function updateGoal(dailyGoalMinutes) {
  const data = load();
  if (dailyGoalMinutes !== null && dailyGoalMinutes !== undefined) {
    if (!Number.isInteger(dailyGoalMinutes) || dailyGoalMinutes < 1 || dailyGoalMinutes > 1440) {
      throw httpError(400, '목표 시간은 1분 이상 1440분 이하로 입력해 주세요.');
    }
  }
  data.goalMinutes = dailyGoalMinutes ?? null;
  save(data);
  return { dailyGoalMinutes: data.goalMinutes };
}