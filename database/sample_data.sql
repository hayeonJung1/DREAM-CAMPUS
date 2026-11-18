USE dream_campus;

-- 모의고사용 과목 (모의고사 담당과 공용 관리)
INSERT IGNORE INTO subjects (subject_name) VALUES
  ('국어'), ('수학'), ('영어'), ('한국사'), ('탐구');

-- 개발용 테스트 회원
INSERT IGNORE INTO users (email, password, name, grade)
VALUES ('test@test.com', 'temp', '테스트', 3);