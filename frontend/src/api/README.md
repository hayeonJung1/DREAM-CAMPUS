# API 통신 모듈

이 폴더는 Spring Boot 백엔드와 통신하는 함수를 둘 위치입니다.

현재 화면은 기존 localStorage 기반 동작을 유지하며, 실제 백엔드 API는 아직 연결되지 않았습니다.
백엔드 API 구현이 시작되면 Axios 설치 후 아래 파일을 추가하세요.

- `axios.js`: Axios 인스턴스 및 공통 설정
- `authApi.js`: 로그인·회원가입
- `examApi.js`: 모의고사·채점·오답노트
- `studyApi.js`: 공부시간 기록·통계
- `userApi.js`: 회원정보
- `universityApi.js`: 대학·학과 정보
- `scheduleApi.js`: 입시 일정
