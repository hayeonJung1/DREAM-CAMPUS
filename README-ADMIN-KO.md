# DREAM CAMPUS 관리자 페이지 적용 파일

## 포함 내용
- 파스텔톤 관리자 화면: 회원 관리 / 모의고사 관리
- 관리자 전용 API 권한 검사
- 회원 권한(USER/ADMIN) 및 상태(ACTIVE/SUSPENDED) 관리
- 모의고사 과목명/데이터 구분, 문항별 정답/배점 관리
- 로그인 응답에 role 포함 및 정지 회원 로그인 차단

## 적용 전 확인
이 파일은 현재 프로젝트의 `users`, `exam_subjects`, `answer_keys` 구조와 세션 로그인 방식을 기준으로 작성했습니다. SQL의 `member` 테이블을 사용하지 않습니다.

## 적용 순서
1. ZIP 내부 파일을 프로젝트 루트에 같은 경로로 복사합니다. 기존 파일은 덮어쓰기 전에 백업해 주세요.
2. MySQL Workbench에서 `database/admin_migration.sql`을 한 번 실행합니다.
3. SQL 파일의 관리자 이메일 예시를 실제 계정 이메일로 바꿔 `UPDATE users SET role = 'ADMIN' ...` 문장을 실행합니다. 관리자 계정으로 다시 로그인합니다.
4. 백엔드와 프론트엔드를 재실행하고 관리자 메뉴와 회원/모의고사 조회를 확인합니다.

## 주요 변경 파일
- `frontend/src/App.jsx`
- `frontend/src/pages/admin/AdminPage.jsx` (신규)
- `frontend/src/pages/admin/AdminPage.css` (신규)
- `backend/src/main/java/com/dreamcampus/backend/user/Member.java`
- `backend/src/main/java/com/dreamcampus/backend/user/MemberRepository.java`
- `backend/src/main/java/com/dreamcampus/backend/user/dto/AuthResponse.java`
- `backend/src/main/java/com/dreamcampus/backend/auth/AuthService.java`
- `backend/src/main/java/com/dreamcampus/backend/exam/ExamSubject.java`
- `backend/src/main/java/com/dreamcampus/backend/exam/AnswerKey.java`
- `backend/src/main/java/com/dreamcampus/backend/admin/AdminGuard.java` (신규)
- `backend/src/main/java/com/dreamcampus/backend/admin/AdminMemberController.java` (신규)
- `backend/src/main/java/com/dreamcampus/backend/admin/AdminExamController.java` (신규)
- `database/admin_migration.sql` (신규)

## 참고
- 관리자 메뉴 숨김은 화면 편의 기능이며, 실제 보안 검사는 모든 `/api/admin/**` API에서 세션 사용자와 DB의 `role`을 확인합니다.
- 마지막 활성 관리자 권한 제거/정지를 막습니다.
- 비밀번호는 관리자 목록 API 응답에 포함하지 않습니다.
- 현재 구현 범위는 전달된 초안과 동일하게 회원 관리와 모의고사 관리입니다.
