import api from './axios.js';

// api.get(...) 결과의 .data 는 서버 응답 본문(ApiResponse),
// 그 안의 .data 가 실제 내용이다. 그래서 .data.data 로 꺼낸다.

// ---------- 과목 ----------

// 이미 보낸 요청이 진행 중이면 새로 보내지 않고 같은 결과를 함께 받는다.
// (개발 모드에서 화면이 두 번 그려질 때, 처음 가입한 회원의 기본 과목이 중복 생성되는 것을 막는다)
let pendingSubjects = null;
export const getSubjects = () => {
  if (!pendingSubjects) {
    pendingSubjects = api
      .get('/study/subjects')
      .then((res) => res.data.data)
      .finally(() => {
        pendingSubjects = null;
      });
  }
  return pendingSubjects;
};

export const createSubject = async (name) =>
  (await api.post('/study/subjects', { name })).data.data;

export const renameSubject = async (id, name) =>
  (await api.put(`/study/subjects/${id}`, { name })).data.data;

export const deleteSubject = async (id) => {
  await api.delete(`/study/subjects/${id}`);
};

// ---------- 공부 세션 ----------

// 진행 중인 공부가 없으면 null
export const getActiveSession = async () => (await api.get('/study/sessions/active')).data.data;

// studySubjectId 가 null 이면 과목 없이 자유 공부
export const startSession = async (studySubjectId) =>
  (await api.post('/study/sessions', { studySubjectId })).data.data;

export const pauseSession = async (id) => (await api.put(`/study/sessions/${id}/pause`)).data.data;
export const resumeSession = async (id) => (await api.put(`/study/sessions/${id}/resume`)).data.data;
export const stopSession = async (id) => (await api.put(`/study/sessions/${id}/stop`)).data.data;

// ---------- 통계·목표 ----------

// date: "2026-11-23" 형식
export const getDailyStat = async (date) =>
  (await api.get('/study/statistics/daily', { params: { date } })).data.data;

export const getWeeklyStat = async (date) =>
  (await api.get('/study/statistics/weekly', { params: { date } })).data.data;

// from, to 가 undefined 이면 axios 가 쿼리에서 빼서 전체 기간으로 조회된다
export const getSubjectStats = async (from, to) =>
  (await api.get('/study/statistics/subjects', { params: { from, to } })).data.data;

// dailyGoalMinutes 가 null 이면 목표 해제
export const updateGoal = async (dailyGoalMinutes) =>
  (await api.put('/study/goal', { dailyGoalMinutes })).data.data;