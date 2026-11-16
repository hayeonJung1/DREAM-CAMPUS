# DREAM CAMPUS 프론트엔드 파일 분리 안내

- `App.jsx`: 앱 전체 레이아웃, 메뉴 이동, 전역 상태
- `pages/`: 페이지별 화면 컴포넌트
- `components/`: 여러 페이지에서 재사용하는 컴포넌트
- `utils/appUtils.js`: 날짜/일정/프로필 관련 공통 함수
- 기존 CSS 파일과 클래스명은 유지했습니다.

실행 방법: frontend 폴더에서 `npm install` 후 `npm run dev`
빌드 확인: `npm run build`
