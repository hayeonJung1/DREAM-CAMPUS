import { createContext, useContext } from 'react';

// 지금 화면이 쓸 공부 API: 로그인했으면 서버 API(studyApi), 아니면 브라우저 저장소 API(guestStudyApi)
export const StudyApiContext = createContext(null);

export function useStudyApi() {
  const api = useContext(StudyApiContext);
  if (!api) throw new Error('StudyApiContext 안에서만 사용할 수 있어요.');
  return api;
}