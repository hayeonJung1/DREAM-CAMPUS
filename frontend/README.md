# DREAM CAMPUS - React Starter

현재 버전은 **화면 틀과 페이지 이동을 확인하는 초기 시안**입니다. 실제 모의고사 채점, 타이머 저장, MySQL 연결은 아직 구현되지 않았습니다.

## 실행 방법

1. Node.js LTS를 설치합니다: https://nodejs.org/ko/download/
2. 이 폴더를 압축 해제하고 VS Code에서 `dream-campus-starter` 폴더를 엽니다.
3. VS Code 터미널에서 아래 명령어를 실행합니다.

```bash
npm install
npm run dev
```

4. 터미널에 표시되는 주소(보통 http://localhost:5173)를 브라우저에서 엽니다.

## 페이지 이동

왼쪽 메뉴 또는 메인 화면의 QUICK MENU를 클릭하면 각 페이지의 임시 화면으로 이동합니다.
현재는 전체 디자인과 탐색 구조를 확인하기 위한 자리표시자 페이지입니다.

## 주요 파일

- `src/App.jsx`: 메인 화면, 메뉴, 페이지 임시 화면
- `src/App.css`: 전체 디자인 및 반응형 스타일
- `src/main.jsx`: React 시작 파일
- `index.html`: 브라우저 페이지 기본 정보

## React 설정

`vite.config.js`에서 React 플러그인을 적용합니다. 이 파일은 `package.json`과 같은 프로젝트 최상위 폴더에 있어야 합니다.

## 참고

- 메인 페이지의 일정과 공부시간은 디자인용 예시 데이터입니다.
- 목표 대학은 고려대학교를 예시로 표시했습니다.
- 아직 백엔드/API/MySQL 연결은 하지 않았습니다.
