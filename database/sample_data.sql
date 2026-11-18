USE dream_campus;

INSERT IGNORE INTO subjects (subject_name) VALUES
  ('국어'), ('수학'), ('영어'), ('한국사'), ('탐구');

INSERT IGNORE INTO users (email, password, name, grade)
VALUES ('test@test.com', 'temp', '테스트', 3);