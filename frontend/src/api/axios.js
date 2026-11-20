import axios from 'axios';

// 모든 요청의 공통 설정. 주소는 /api 로 시작하고 Vite 프록시가 서버로 전달한다.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// 서버가 보낸 에러 메시지({ success: false, message: "..." })를 꺼내서
// 화면에서 error.message 로 바로 보여줄 수 있게 바꿔준다.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ?? '서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.';
    const wrapped = new Error(message);
    wrapped.status = error.response?.status;
    return Promise.reject(wrapped);
  },
);

export default api;