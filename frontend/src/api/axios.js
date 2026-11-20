const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',   // 없으면 /api (프록시 사용)
  headers: { 'Content-Type': 'application/json' },
});