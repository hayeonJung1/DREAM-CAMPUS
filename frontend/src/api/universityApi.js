import api from './axios.js';

// 대학 목록·검색 (로그인 없이 호출할 수 있다). category: '' | '대학' | '전문대학', page 는 0부터
export const getUniversities = async ({ keyword = '', category = '', page = 0, size = 12 } = {}) =>
  (await api.get('/universities', { params: { keyword, category, page, size } })).data.data;

export const getUniversity = async (id) => (await api.get(`/universities/${id}`)).data.data;

// ---------- 관심 대학 (로그인해야 하고, 로그인하지 않으면 401) ----------

export const getFavoriteUniversities = async () => (await api.get('/favorites/universities')).data.data;

export const addFavoriteUniversity = async (id) => {
  await api.post(`/favorites/universities/${id}`);
};

export const removeFavoriteUniversity = async (id) => {
  await api.delete(`/favorites/universities/${id}`);
};