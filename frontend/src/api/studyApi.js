import api from './axios.js';

// api.get(...) 결과의 .data 는 서버 응답 본문(ApiResponse),
// 그 안의 .data 가 실제 내용이다. 그래서 .data.data 로 꺼낸다.

export const getSubjects = async () => (await api.get('/study/subjects')).data.data;

export const createSubject = async (name) =>
  (await api.post('/study/subjects', { name })).data.data;

export const renameSubject = async (id, name) =>
  (await api.put(`/study/subjects/${id}`, { name })).data.data;

export const deleteSubject = async (id) => {
  await api.delete(`/study/subjects/${id}`);
};