# DREAM CAMPUS 프론트엔드 구조 안내

현재 동작 중인 기존 화면은 유지하면서 사용자가 제시한 폴더 구조에 가깝게 정리했습니다.

## 현재 실제 구현된 파일
- `src/App.jsx`: 페이지 상태, 공통 데이터 및 화면 연결
- `src/layouts/MainLayout.jsx`: 사이드바, 상단바, 검색 UI
- `src/layouts/AuthLayout.jsx`: 로그인/회원가입 공통 레이아웃의 기본 틀(아직 미사용)
- `src/pages/Home.jsx`: 메인 대시보드
- `src/pages/exam/MockExamPage.jsx`: 현재 모의고사 화면 전체
- `src/pages/calendar/Calendar.jsx`: 입시 캘린더 화면
- `src/pages/arcade/ArcadePage.jsx`: 오락실 화면
- `src/pages/mypage/MyPage.jsx`: 마이페이지
- `src/pages/placeholder/PlaceholderPage.jsx`: 준비 중 메뉴 화면
- `src/components/dashboard/MiniAdmissionCalendar.jsx`: 메인 화면의 미니 캘린더
- `src/components/common/StudentIdCard.jsx`: 학생증 컴포넌트
- `src/components/arcade/YeotGame.jsx`: 오락실 게임 컴포넌트
- `src/utils/appUtils.js`: 공통 날짜/프로필/저장 관련 처리
- `src/data/answerKeys.js`: 모의고사 정답 데이터
- `src/styles/`: 전역 및 페이지 스타일

## 아직 구현하지 않은 예정 영역
`api`, `hooks`, `pages/auth`, `pages/study`, `pages/university`, `components/common`, `components/dashboard`, `components/exam` 일부는 향후 기능 개발을 위한 준비 폴더입니다. 폴더가 있다고 해서 API, 로그인, 공부 타이머, 대학정보 화면이 이미 구현된 것은 아닙니다.

## 실행
프론트엔드 폴더에서 `npm install` 후 `npm run dev`를 실행하세요.


## 페이지별 CSS 관리 원칙
각 화면에서만 사용하는 CSS는 해당 페이지 폴더에 JSX와 함께 둡니다. 예: `pages/Exam/MockExamPage.jsx`와 `pages/Exam/MockExamPage.css`. 공통 레이아웃·전역 스타일 및 여러 화면에서 공유하는 위젯 스타일만 `styles/`에 둡니다. 컴포넌트 전용 CSS는 컴포넌트 파일 옆에 둡니다.
