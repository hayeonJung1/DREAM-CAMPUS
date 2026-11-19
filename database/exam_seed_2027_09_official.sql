-- 2027학년도 9월 모의평가 정답 데이터. 기존 채점 기록을 삭제하지 않는 재실행 가능 시드입니다.

USE dream_campus;

-- 기존 채점 기록은 삭제하지 않습니다. 같은 코드의 과목/문항만 안전하게 갱신합니다.

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'KOR_CW','국어','화법과 작문', 45, 100, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'4',2,'CHOICE'),
  (@subject_id,2,'1',2,'CHOICE'),
  (@subject_id,3,'4',3,'CHOICE'),
  (@subject_id,4,'5',2,'CHOICE'),
  (@subject_id,5,'4',2,'CHOICE'),
  (@subject_id,6,'2',2,'CHOICE'),
  (@subject_id,7,'1',2,'CHOICE'),
  (@subject_id,8,'3',3,'CHOICE'),
  (@subject_id,9,'1',2,'CHOICE'),
  (@subject_id,10,'2',2,'CHOICE'),
  (@subject_id,11,'5',2,'CHOICE'),
  (@subject_id,12,'3',2,'CHOICE'),
  (@subject_id,13,'1',3,'CHOICE'),
  (@subject_id,14,'2',2,'CHOICE'),
  (@subject_id,15,'3',2,'CHOICE'),
  (@subject_id,16,'4',3,'CHOICE'),
  (@subject_id,17,'5',2,'CHOICE'),
  (@subject_id,18,'4',2,'CHOICE'),
  (@subject_id,19,'5',2,'CHOICE'),
  (@subject_id,20,'4',2,'CHOICE'),
  (@subject_id,21,'2',3,'CHOICE'),
  (@subject_id,22,'1',2,'CHOICE'),
  (@subject_id,23,'1',2,'CHOICE'),
  (@subject_id,24,'2',3,'CHOICE'),
  (@subject_id,25,'3',2,'CHOICE'),
  (@subject_id,26,'3',2,'CHOICE'),
  (@subject_id,27,'1',2,'CHOICE'),
  (@subject_id,28,'1',2,'CHOICE'),
  (@subject_id,29,'3',2,'CHOICE'),
  (@subject_id,30,'2',2,'CHOICE'),
  (@subject_id,31,'3',3,'CHOICE'),
  (@subject_id,32,'5',2,'CHOICE'),
  (@subject_id,33,'5',2,'CHOICE'),
  (@subject_id,34,'4',3,'CHOICE'),
  (@subject_id,35,'4',2,'CHOICE'),
  (@subject_id,36,'5',2,'CHOICE'),
  (@subject_id,37,'5',2,'CHOICE'),
  (@subject_id,38,'4',2,'CHOICE'),
  (@subject_id,39,'3',2,'CHOICE'),
  (@subject_id,40,'2',3,'CHOICE'),
  (@subject_id,41,'1',2,'CHOICE'),
  (@subject_id,42,'2',2,'CHOICE'),
  (@subject_id,43,'3',2,'CHOICE'),
  (@subject_id,44,'2',2,'CHOICE'),
  (@subject_id,45,'5',3,'CHOICE')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'KOR_LM','국어','언어와 매체', 45, 100, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'4',2,'CHOICE'),
  (@subject_id,2,'1',2,'CHOICE'),
  (@subject_id,3,'4',3,'CHOICE'),
  (@subject_id,4,'5',2,'CHOICE'),
  (@subject_id,5,'4',2,'CHOICE'),
  (@subject_id,6,'2',2,'CHOICE'),
  (@subject_id,7,'1',2,'CHOICE'),
  (@subject_id,8,'3',3,'CHOICE'),
  (@subject_id,9,'1',2,'CHOICE'),
  (@subject_id,10,'2',2,'CHOICE'),
  (@subject_id,11,'5',2,'CHOICE'),
  (@subject_id,12,'3',2,'CHOICE'),
  (@subject_id,13,'1',3,'CHOICE'),
  (@subject_id,14,'2',2,'CHOICE'),
  (@subject_id,15,'3',2,'CHOICE'),
  (@subject_id,16,'4',3,'CHOICE'),
  (@subject_id,17,'5',2,'CHOICE'),
  (@subject_id,18,'4',2,'CHOICE'),
  (@subject_id,19,'5',2,'CHOICE'),
  (@subject_id,20,'4',2,'CHOICE'),
  (@subject_id,21,'2',3,'CHOICE'),
  (@subject_id,22,'1',2,'CHOICE'),
  (@subject_id,23,'1',2,'CHOICE'),
  (@subject_id,24,'2',3,'CHOICE'),
  (@subject_id,25,'3',2,'CHOICE'),
  (@subject_id,26,'3',2,'CHOICE'),
  (@subject_id,27,'1',2,'CHOICE'),
  (@subject_id,28,'1',2,'CHOICE'),
  (@subject_id,29,'3',2,'CHOICE'),
  (@subject_id,30,'2',2,'CHOICE'),
  (@subject_id,31,'3',3,'CHOICE'),
  (@subject_id,32,'5',2,'CHOICE'),
  (@subject_id,33,'5',2,'CHOICE'),
  (@subject_id,34,'4',3,'CHOICE'),
  (@subject_id,35,'3',2,'CHOICE'),
  (@subject_id,36,'2',2,'CHOICE'),
  (@subject_id,37,'2',2,'CHOICE'),
  (@subject_id,38,'3',2,'CHOICE'),
  (@subject_id,39,'4',3,'CHOICE'),
  (@subject_id,40,'1',2,'CHOICE'),
  (@subject_id,41,'4',2,'CHOICE'),
  (@subject_id,42,'2',2,'CHOICE'),
  (@subject_id,43,'5',3,'CHOICE'),
  (@subject_id,44,'2',2,'CHOICE'),
  (@subject_id,45,'5',2,'CHOICE')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'MATH_PROB','수학','확률과 통계', 30, 100, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'4',2,'CHOICE'),
  (@subject_id,2,'3',2,'CHOICE'),
  (@subject_id,3,'2',3,'CHOICE'),
  (@subject_id,4,'2',3,'CHOICE'),
  (@subject_id,5,'1',3,'CHOICE'),
  (@subject_id,6,'5',3,'CHOICE'),
  (@subject_id,7,'2',3,'CHOICE'),
  (@subject_id,8,'3',3,'CHOICE'),
  (@subject_id,9,'1',4,'CHOICE'),
  (@subject_id,10,'3',4,'CHOICE'),
  (@subject_id,11,'3',4,'CHOICE'),
  (@subject_id,12,'4',4,'CHOICE'),
  (@subject_id,13,'5',4,'CHOICE'),
  (@subject_id,14,'5',4,'CHOICE'),
  (@subject_id,15,'4',4,'CHOICE'),
  (@subject_id,16,'6',3,'SHORT'),
  (@subject_id,17,'11',3,'SHORT'),
  (@subject_id,18,'38',3,'SHORT'),
  (@subject_id,19,'15',3,'SHORT'),
  (@subject_id,20,'17',4,'SHORT'),
  (@subject_id,21,'12',4,'SHORT'),
  (@subject_id,22,'97',4,'SHORT'),
  (@subject_id,23,'1',2,'CHOICE'),
  (@subject_id,24,'4',3,'CHOICE'),
  (@subject_id,25,'5',3,'CHOICE'),
  (@subject_id,26,'2',3,'CHOICE'),
  (@subject_id,27,'3',3,'CHOICE'),
  (@subject_id,28,'5',4,'CHOICE'),
  (@subject_id,29,'190',4,'SHORT'),
  (@subject_id,30,'170',4,'SHORT')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'MATH_CALC','수학','미적분', 30, 100, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'4',2,'CHOICE'),
  (@subject_id,2,'3',2,'CHOICE'),
  (@subject_id,3,'2',3,'CHOICE'),
  (@subject_id,4,'2',3,'CHOICE'),
  (@subject_id,5,'1',3,'CHOICE'),
  (@subject_id,6,'5',3,'CHOICE'),
  (@subject_id,7,'2',3,'CHOICE'),
  (@subject_id,8,'3',3,'CHOICE'),
  (@subject_id,9,'1',4,'CHOICE'),
  (@subject_id,10,'3',4,'CHOICE'),
  (@subject_id,11,'3',4,'CHOICE'),
  (@subject_id,12,'4',4,'CHOICE'),
  (@subject_id,13,'5',4,'CHOICE'),
  (@subject_id,14,'5',4,'CHOICE'),
  (@subject_id,15,'4',4,'CHOICE'),
  (@subject_id,16,'6',3,'SHORT'),
  (@subject_id,17,'11',3,'SHORT'),
  (@subject_id,18,'38',3,'SHORT'),
  (@subject_id,19,'15',3,'SHORT'),
  (@subject_id,20,'17',4,'SHORT'),
  (@subject_id,21,'12',4,'SHORT'),
  (@subject_id,22,'97',4,'SHORT'),
  (@subject_id,23,'4',2,'CHOICE'),
  (@subject_id,24,'1',3,'CHOICE'),
  (@subject_id,25,'3',3,'CHOICE'),
  (@subject_id,26,'2',3,'CHOICE'),
  (@subject_id,27,'5',3,'CHOICE'),
  (@subject_id,28,'4',4,'CHOICE'),
  (@subject_id,29,'81',4,'SHORT'),
  (@subject_id,30,'49',4,'SHORT')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'MATH_GEO','수학','기하', 30, 100, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'4',2,'CHOICE'),
  (@subject_id,2,'3',2,'CHOICE'),
  (@subject_id,3,'2',3,'CHOICE'),
  (@subject_id,4,'2',3,'CHOICE'),
  (@subject_id,5,'1',3,'CHOICE'),
  (@subject_id,6,'5',3,'CHOICE'),
  (@subject_id,7,'2',3,'CHOICE'),
  (@subject_id,8,'3',3,'CHOICE'),
  (@subject_id,9,'1',4,'CHOICE'),
  (@subject_id,10,'3',4,'CHOICE'),
  (@subject_id,11,'3',4,'CHOICE'),
  (@subject_id,12,'4',4,'CHOICE'),
  (@subject_id,13,'5',4,'CHOICE'),
  (@subject_id,14,'5',4,'CHOICE'),
  (@subject_id,15,'4',4,'CHOICE'),
  (@subject_id,16,'6',3,'SHORT'),
  (@subject_id,17,'11',3,'SHORT'),
  (@subject_id,18,'38',3,'SHORT'),
  (@subject_id,19,'15',3,'SHORT'),
  (@subject_id,20,'17',4,'SHORT'),
  (@subject_id,21,'12',4,'SHORT'),
  (@subject_id,22,'97',4,'SHORT'),
  (@subject_id,23,'1',2,'CHOICE'),
  (@subject_id,24,'2',3,'CHOICE'),
  (@subject_id,25,'4',3,'CHOICE'),
  (@subject_id,26,'5',3,'CHOICE'),
  (@subject_id,27,'3',3,'CHOICE'),
  (@subject_id,28,'2',4,'CHOICE'),
  (@subject_id,29,'60',4,'SHORT'),
  (@subject_id,30,'457',4,'SHORT')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'ENGLISH','영어',NULL, 45, 100, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'5',2,'CHOICE'),
  (@subject_id,2,'1',2,'CHOICE'),
  (@subject_id,3,'1',2,'CHOICE'),
  (@subject_id,4,'5',2,'CHOICE'),
  (@subject_id,5,'5',2,'CHOICE'),
  (@subject_id,6,'2',2,'CHOICE'),
  (@subject_id,7,'4',2,'CHOICE'),
  (@subject_id,8,'3',2,'CHOICE'),
  (@subject_id,9,'3',2,'CHOICE'),
  (@subject_id,10,'4',2,'CHOICE'),
  (@subject_id,11,'1',2,'CHOICE'),
  (@subject_id,12,'2',3,'CHOICE'),
  (@subject_id,13,'5',3,'CHOICE'),
  (@subject_id,14,'3',2,'CHOICE'),
  (@subject_id,15,'1',3,'CHOICE'),
  (@subject_id,16,'3',2,'CHOICE'),
  (@subject_id,17,'3',2,'CHOICE'),
  (@subject_id,18,'2',2,'CHOICE'),
  (@subject_id,19,'2',2,'CHOICE'),
  (@subject_id,20,'1',2,'CHOICE'),
  (@subject_id,21,'2',3,'CHOICE'),
  (@subject_id,22,'2',2,'CHOICE'),
  (@subject_id,23,'5',2,'CHOICE'),
  (@subject_id,24,'1',2,'CHOICE'),
  (@subject_id,25,'3',2,'CHOICE'),
  (@subject_id,26,'4',2,'CHOICE'),
  (@subject_id,27,'5',2,'CHOICE'),
  (@subject_id,28,'5',2,'CHOICE'),
  (@subject_id,29,'3',2,'CHOICE'),
  (@subject_id,30,'5',3,'CHOICE'),
  (@subject_id,31,'1',2,'CHOICE'),
  (@subject_id,32,'5',2,'CHOICE'),
  (@subject_id,33,'3',3,'CHOICE'),
  (@subject_id,34,'4',3,'CHOICE'),
  (@subject_id,35,'4',2,'CHOICE'),
  (@subject_id,36,'3',2,'CHOICE'),
  (@subject_id,37,'4',3,'CHOICE'),
  (@subject_id,38,'5',2,'CHOICE'),
  (@subject_id,39,'3',3,'CHOICE'),
  (@subject_id,40,'1',2,'CHOICE'),
  (@subject_id,41,'3',2,'CHOICE'),
  (@subject_id,42,'4',3,'CHOICE'),
  (@subject_id,43,'4',2,'CHOICE'),
  (@subject_id,44,'4',2,'CHOICE'),
  (@subject_id,45,'2',2,'CHOICE')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'HISTORY','한국사',NULL, 20, 50, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'3',2,'CHOICE'),
  (@subject_id,2,'2',3,'CHOICE'),
  (@subject_id,3,'1',3,'CHOICE'),
  (@subject_id,4,'4',2,'CHOICE'),
  (@subject_id,5,'4',2,'CHOICE'),
  (@subject_id,6,'4',2,'CHOICE'),
  (@subject_id,7,'5',3,'CHOICE'),
  (@subject_id,8,'3',3,'CHOICE'),
  (@subject_id,9,'3',2,'CHOICE'),
  (@subject_id,10,'2',2,'CHOICE'),
  (@subject_id,11,'1',3,'CHOICE'),
  (@subject_id,12,'1',2,'CHOICE'),
  (@subject_id,13,'3',3,'CHOICE'),
  (@subject_id,14,'4',2,'CHOICE'),
  (@subject_id,15,'5',3,'CHOICE'),
  (@subject_id,16,'5',3,'CHOICE'),
  (@subject_id,17,'5',2,'CHOICE'),
  (@subject_id,18,'4',3,'CHOICE'),
  (@subject_id,19,'4',3,'CHOICE'),
  (@subject_id,20,'2',2,'CHOICE')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'SOC_LIFE_ETHICS','생활과 윤리','사회탐구', 20, 50, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'1',2,'CHOICE'),
  (@subject_id,2,'3',3,'CHOICE'),
  (@subject_id,3,'4',3,'CHOICE'),
  (@subject_id,4,'5',2,'CHOICE'),
  (@subject_id,5,'4',3,'CHOICE'),
  (@subject_id,6,'5',2,'CHOICE'),
  (@subject_id,7,'5',3,'CHOICE'),
  (@subject_id,8,'3',2,'CHOICE'),
  (@subject_id,9,'2',3,'CHOICE'),
  (@subject_id,10,'4',2,'CHOICE'),
  (@subject_id,11,'5',2,'CHOICE'),
  (@subject_id,12,'3',3,'CHOICE'),
  (@subject_id,13,'3',2,'CHOICE'),
  (@subject_id,14,'1',2,'CHOICE'),
  (@subject_id,15,'1',3,'CHOICE'),
  (@subject_id,16,'2',2,'CHOICE'),
  (@subject_id,17,'3',3,'CHOICE'),
  (@subject_id,18,'4',3,'CHOICE'),
  (@subject_id,19,'1',3,'CHOICE'),
  (@subject_id,20,'2',2,'CHOICE')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'SOC_ETHICS_THOUGHT','윤리와 사상','사회탐구', 20, 50, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'3',2,'CHOICE'),
  (@subject_id,2,'5',2,'CHOICE'),
  (@subject_id,3,'4',3,'CHOICE'),
  (@subject_id,4,'1',3,'CHOICE'),
  (@subject_id,5,'5',2,'CHOICE'),
  (@subject_id,6,'2',2,'CHOICE'),
  (@subject_id,7,'5',3,'CHOICE'),
  (@subject_id,8,'5',3,'CHOICE'),
  (@subject_id,9,'3',2,'CHOICE'),
  (@subject_id,10,'2',3,'CHOICE'),
  (@subject_id,11,'2',3,'CHOICE'),
  (@subject_id,12,'4',2,'CHOICE'),
  (@subject_id,13,'2',2,'CHOICE'),
  (@subject_id,14,'1',3,'CHOICE'),
  (@subject_id,15,'3',2,'CHOICE'),
  (@subject_id,16,'4',2,'CHOICE'),
  (@subject_id,17,'3',3,'CHOICE'),
  (@subject_id,18,'1',2,'CHOICE'),
  (@subject_id,19,'1',3,'CHOICE'),
  (@subject_id,20,'4',3,'CHOICE')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'SOC_KOREAN_GEO','한국지리','사회탐구', 20, 50, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'4',2,'CHOICE'),
  (@subject_id,2,'4',3,'CHOICE'),
  (@subject_id,3,'1',2,'CHOICE'),
  (@subject_id,4,'2',3,'CHOICE'),
  (@subject_id,5,'2',2,'CHOICE'),
  (@subject_id,6,'3',2,'CHOICE'),
  (@subject_id,7,'3',3,'CHOICE'),
  (@subject_id,8,'2',3,'CHOICE'),
  (@subject_id,9,'2',2,'CHOICE'),
  (@subject_id,10,'4',3,'CHOICE'),
  (@subject_id,11,'3',3,'CHOICE'),
  (@subject_id,12,'5',2,'CHOICE'),
  (@subject_id,13,'5',3,'CHOICE'),
  (@subject_id,14,'2',3,'CHOICE'),
  (@subject_id,15,'1',2,'CHOICE'),
  (@subject_id,16,'4',2,'CHOICE'),
  (@subject_id,17,'5',3,'CHOICE'),
  (@subject_id,18,'3',2,'CHOICE'),
  (@subject_id,19,'3',2,'CHOICE'),
  (@subject_id,20,'1',3,'CHOICE')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'SOC_WORLD_GEO','세계지리','사회탐구', 20, 50, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'1',3,'CHOICE'),
  (@subject_id,2,'4',2,'CHOICE'),
  (@subject_id,3,'2',2,'CHOICE'),
  (@subject_id,4,'3',3,'CHOICE'),
  (@subject_id,5,'1',2,'CHOICE'),
  (@subject_id,6,'5',3,'CHOICE'),
  (@subject_id,7,'4',3,'CHOICE'),
  (@subject_id,8,'4',2,'CHOICE'),
  (@subject_id,9,'5',2,'CHOICE'),
  (@subject_id,10,'3',3,'CHOICE'),
  (@subject_id,11,'1',3,'CHOICE'),
  (@subject_id,12,'2',3,'CHOICE'),
  (@subject_id,13,'2',3,'CHOICE'),
  (@subject_id,14,'4',2,'CHOICE'),
  (@subject_id,15,'3',2,'CHOICE'),
  (@subject_id,16,'2',3,'CHOICE'),
  (@subject_id,17,'5',3,'CHOICE'),
  (@subject_id,18,'3',2,'CHOICE'),
  (@subject_id,19,'1',2,'CHOICE'),
  (@subject_id,20,'4',2,'CHOICE')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'SOC_EAST_ASIA','동아시아사','사회탐구', 20, 50, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'1',2,'CHOICE'),
  (@subject_id,2,'4',2,'CHOICE'),
  (@subject_id,3,'2',3,'CHOICE'),
  (@subject_id,4,'1',3,'CHOICE'),
  (@subject_id,5,'5',2,'CHOICE'),
  (@subject_id,6,'5',2,'CHOICE'),
  (@subject_id,7,'2',3,'CHOICE'),
  (@subject_id,8,'4',2,'CHOICE'),
  (@subject_id,9,'5',3,'CHOICE'),
  (@subject_id,10,'3',2,'CHOICE'),
  (@subject_id,11,'1',3,'CHOICE'),
  (@subject_id,12,'5',2,'CHOICE'),
  (@subject_id,13,'5',2,'CHOICE'),
  (@subject_id,14,'4',3,'CHOICE'),
  (@subject_id,15,'2',3,'CHOICE'),
  (@subject_id,16,'2',3,'CHOICE'),
  (@subject_id,17,'2',2,'CHOICE'),
  (@subject_id,18,'3',3,'CHOICE'),
  (@subject_id,19,'2',3,'CHOICE'),
  (@subject_id,20,'3',2,'CHOICE')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'SOC_WORLD_HISTORY','세계사','사회탐구', 20, 50, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'3',3,'CHOICE'),
  (@subject_id,2,'2',3,'CHOICE'),
  (@subject_id,3,'4',2,'CHOICE'),
  (@subject_id,4,'3',3,'CHOICE'),
  (@subject_id,5,'2',2,'CHOICE'),
  (@subject_id,6,'3',3,'CHOICE'),
  (@subject_id,7,'1',2,'CHOICE'),
  (@subject_id,8,'2',2,'CHOICE'),
  (@subject_id,9,'2',3,'CHOICE'),
  (@subject_id,10,'4',2,'CHOICE'),
  (@subject_id,11,'1',3,'CHOICE'),
  (@subject_id,12,'5',3,'CHOICE'),
  (@subject_id,13,'2',2,'CHOICE'),
  (@subject_id,14,'4',3,'CHOICE'),
  (@subject_id,15,'5',2,'CHOICE'),
  (@subject_id,16,'1',2,'CHOICE'),
  (@subject_id,17,'4',2,'CHOICE'),
  (@subject_id,18,'5',2,'CHOICE'),
  (@subject_id,19,'5',3,'CHOICE'),
  (@subject_id,20,'5',3,'CHOICE')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'SOC_ECONOMICS','경제','사회탐구', 20, 50, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'1',3,'CHOICE'),
  (@subject_id,2,'2',2,'CHOICE'),
  (@subject_id,3,'4',2,'CHOICE'),
  (@subject_id,4,'3',3,'CHOICE'),
  (@subject_id,5,'3',3,'CHOICE'),
  (@subject_id,6,'1',2,'CHOICE'),
  (@subject_id,7,'2',2,'CHOICE'),
  (@subject_id,8,'3',2,'CHOICE'),
  (@subject_id,9,'2',3,'CHOICE'),
  (@subject_id,10,'3',3,'CHOICE'),
  (@subject_id,11,'4',2,'CHOICE'),
  (@subject_id,12,'5',3,'CHOICE'),
  (@subject_id,13,'4',2,'CHOICE'),
  (@subject_id,14,'2',3,'CHOICE'),
  (@subject_id,15,'4',3,'CHOICE'),
  (@subject_id,16,'3',2,'CHOICE'),
  (@subject_id,17,'5',3,'CHOICE'),
  (@subject_id,18,'1',2,'CHOICE'),
  (@subject_id,19,'2',2,'CHOICE'),
  (@subject_id,20,'5',3,'CHOICE')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'SOC_POLITICS_LAW','정치와 법','사회탐구', 20, 50, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'1',2,'CHOICE'),
  (@subject_id,2,'1',2,'CHOICE'),
  (@subject_id,3,'4',2,'CHOICE'),
  (@subject_id,4,'4',3,'CHOICE'),
  (@subject_id,5,'4',3,'CHOICE'),
  (@subject_id,6,'2',3,'CHOICE'),
  (@subject_id,7,'3',3,'CHOICE'),
  (@subject_id,8,'2',2,'CHOICE'),
  (@subject_id,9,'3',2,'CHOICE'),
  (@subject_id,10,'2',3,'CHOICE'),
  (@subject_id,11,'5',2,'CHOICE'),
  (@subject_id,12,'1',3,'CHOICE'),
  (@subject_id,13,'2',3,'CHOICE'),
  (@subject_id,14,'5',2,'CHOICE'),
  (@subject_id,15,'1',3,'CHOICE'),
  (@subject_id,16,'5',2,'CHOICE'),
  (@subject_id,17,'3',3,'CHOICE'),
  (@subject_id,18,'4',2,'CHOICE'),
  (@subject_id,19,'1',2,'CHOICE'),
  (@subject_id,20,'1',3,'CHOICE')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'SOC_SOC_CULTURE','사회·문화','사회탐구', 20, 50, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'4',2,'CHOICE'),
  (@subject_id,2,'1',3,'CHOICE'),
  (@subject_id,3,'2',2,'CHOICE'),
  (@subject_id,4,'5',3,'CHOICE'),
  (@subject_id,5,'3',2,'CHOICE'),
  (@subject_id,6,'4',3,'CHOICE'),
  (@subject_id,7,'1',3,'CHOICE'),
  (@subject_id,8,'4',3,'CHOICE'),
  (@subject_id,9,'5',2,'CHOICE'),
  (@subject_id,10,'4',2,'CHOICE'),
  (@subject_id,11,'5',2,'CHOICE'),
  (@subject_id,12,'5',2,'CHOICE'),
  (@subject_id,13,'1',3,'CHOICE'),
  (@subject_id,14,'3',3,'CHOICE'),
  (@subject_id,15,'2',2,'CHOICE'),
  (@subject_id,16,'5',2,'CHOICE'),
  (@subject_id,17,'1',3,'CHOICE'),
  (@subject_id,18,'2',3,'CHOICE'),
  (@subject_id,19,'1',2,'CHOICE'),
  (@subject_id,20,'3',3,'CHOICE')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'SCI_CHEMISTRY_I','화학Ⅰ','과학탐구', 20, 50, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'5',2,'CHOICE'),
  (@subject_id,2,'5',2,'CHOICE'),
  (@subject_id,3,'3',2,'CHOICE'),
  (@subject_id,4,'4',3,'CHOICE'),
  (@subject_id,5,'2',2,'CHOICE'),
  (@subject_id,6,'1',3,'CHOICE'),
  (@subject_id,7,'4',3,'CHOICE'),
  (@subject_id,8,'5',2,'CHOICE'),
  (@subject_id,9,'3',2,'CHOICE'),
  (@subject_id,10,'2',3,'CHOICE'),
  (@subject_id,11,'3',3,'CHOICE'),
  (@subject_id,12,'5',2,'CHOICE'),
  (@subject_id,13,'1',2,'CHOICE'),
  (@subject_id,14,'4',3,'CHOICE'),
  (@subject_id,15,'4',3,'CHOICE'),
  (@subject_id,16,'5',2,'CHOICE'),
  (@subject_id,17,'3',3,'CHOICE'),
  (@subject_id,18,'4',3,'CHOICE'),
  (@subject_id,19,'1',3,'CHOICE'),
  (@subject_id,20,'2',2,'CHOICE')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'SCI_BIOLOGY_I','생명과학Ⅰ','과학탐구', 20, 50, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'5',2,'CHOICE'),
  (@subject_id,2,'3',3,'CHOICE'),
  (@subject_id,3,'5',2,'CHOICE'),
  (@subject_id,4,'4',2,'CHOICE'),
  (@subject_id,5,'3',3,'CHOICE'),
  (@subject_id,6,'3',2,'CHOICE'),
  (@subject_id,7,'5',3,'CHOICE'),
  (@subject_id,8,'1',2,'CHOICE'),
  (@subject_id,9,'1',2,'CHOICE'),
  (@subject_id,10,'2',2,'CHOICE'),
  (@subject_id,11,'4',3,'CHOICE'),
  (@subject_id,12,'1',2,'CHOICE'),
  (@subject_id,13,'3',3,'CHOICE'),
  (@subject_id,14,'2',3,'CHOICE'),
  (@subject_id,15,'2',3,'CHOICE'),
  (@subject_id,16,'5',2,'CHOICE'),
  (@subject_id,17,'4',2,'CHOICE'),
  (@subject_id,18,'2',3,'CHOICE'),
  (@subject_id,19,'3',3,'CHOICE'),
  (@subject_id,20,'1',3,'CHOICE')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'SCI_EARTH_I','지구과학Ⅰ','과학탐구', 20, 50, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'3',2,'CHOICE'),
  (@subject_id,2,'4',2,'CHOICE'),
  (@subject_id,3,'2',3,'CHOICE'),
  (@subject_id,4,'5',3,'CHOICE'),
  (@subject_id,5,'3',2,'CHOICE'),
  (@subject_id,6,'4',2,'CHOICE'),
  (@subject_id,7,'1',2,'CHOICE'),
  (@subject_id,8,'5',3,'CHOICE'),
  (@subject_id,9,'2',3,'CHOICE'),
  (@subject_id,10,'4',2,'CHOICE'),
  (@subject_id,11,'1',2,'CHOICE'),
  (@subject_id,12,'2',2,'CHOICE'),
  (@subject_id,13,'5',3,'CHOICE'),
  (@subject_id,14,'3',3,'CHOICE'),
  (@subject_id,15,'3',3,'CHOICE'),
  (@subject_id,16,'5',2,'CHOICE'),
  (@subject_id,17,'1',2,'CHOICE'),
  (@subject_id,18,'1',3,'CHOICE'),
  (@subject_id,19,'5',3,'CHOICE'),
  (@subject_id,20,'2',3,'CHOICE')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'SCI_PHYSICS_II','물리학Ⅱ','과학탐구', 20, 50, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'5',2,'CHOICE'),
  (@subject_id,2,'2',3,'CHOICE'),
  (@subject_id,3,'4',2,'CHOICE'),
  (@subject_id,4,'3',2,'CHOICE'),
  (@subject_id,5,'1',3,'CHOICE'),
  (@subject_id,6,'3',2,'CHOICE'),
  (@subject_id,7,'3',3,'CHOICE'),
  (@subject_id,8,'4',3,'CHOICE'),
  (@subject_id,9,'2',2,'CHOICE'),
  (@subject_id,10,'1',3,'CHOICE'),
  (@subject_id,11,'2',2,'CHOICE'),
  (@subject_id,12,'3',3,'CHOICE'),
  (@subject_id,13,'5',3,'CHOICE'),
  (@subject_id,14,'1',2,'CHOICE'),
  (@subject_id,15,'5',2,'CHOICE'),
  (@subject_id,16,'4',3,'CHOICE'),
  (@subject_id,17,'5',3,'CHOICE'),
  (@subject_id,18,'5',2,'CHOICE'),
  (@subject_id,19,'1',3,'CHOICE'),
  (@subject_id,20,'2',2,'CHOICE')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'SCI_CHEMISTRY_II','화학Ⅱ','과학탐구', 20, 50, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'2',2,'CHOICE'),
  (@subject_id,2,'1',3,'CHOICE'),
  (@subject_id,3,'5',2,'CHOICE'),
  (@subject_id,4,'5',2,'CHOICE'),
  (@subject_id,5,'3',3,'CHOICE'),
  (@subject_id,6,'3',2,'CHOICE'),
  (@subject_id,7,'4',2,'CHOICE'),
  (@subject_id,8,'5',3,'CHOICE'),
  (@subject_id,9,'1',3,'CHOICE'),
  (@subject_id,10,'3',3,'CHOICE'),
  (@subject_id,11,'1',2,'CHOICE'),
  (@subject_id,12,'5',2,'CHOICE'),
  (@subject_id,13,'2',3,'CHOICE'),
  (@subject_id,14,'4',2,'CHOICE'),
  (@subject_id,15,'4',2,'CHOICE'),
  (@subject_id,16,'3',3,'CHOICE'),
  (@subject_id,17,'5',3,'CHOICE'),
  (@subject_id,18,'4',3,'CHOICE'),
  (@subject_id,19,'3',2,'CHOICE'),
  (@subject_id,20,'2',3,'CHOICE')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'SCI_BIOLOGY_II','생명과학Ⅱ','과학탐구', 20, 50, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'1',2,'CHOICE'),
  (@subject_id,2,'2',2,'CHOICE'),
  (@subject_id,3,'5',3,'CHOICE'),
  (@subject_id,4,'2',3,'CHOICE'),
  (@subject_id,5,'1',2,'CHOICE'),
  (@subject_id,6,'4',3,'CHOICE'),
  (@subject_id,7,'4',3,'CHOICE'),
  (@subject_id,8,'3',2,'CHOICE'),
  (@subject_id,9,'2',3,'CHOICE'),
  (@subject_id,10,'3',3,'CHOICE'),
  (@subject_id,11,'4',2,'CHOICE'),
  (@subject_id,12,'4',2,'CHOICE'),
  (@subject_id,13,'3',3,'CHOICE'),
  (@subject_id,14,'5',2,'CHOICE'),
  (@subject_id,15,'5',2,'CHOICE'),
  (@subject_id,16,'1',2,'CHOICE'),
  (@subject_id,17,'3',2,'CHOICE'),
  (@subject_id,18,'2',3,'CHOICE'),
  (@subject_id,19,'3',3,'CHOICE'),
  (@subject_id,20,'5',3,'CHOICE')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'SCI_EARTH_II','지구과학Ⅱ','과학탐구', 20, 50, 'OFFICIAL')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);

SET @subject_id = LAST_INSERT_ID();

INSERT INTO answer_keys (exam_subject_id, question_number, correct_answer, points, question_type) VALUES
  (@subject_id,1,'3',3,'CHOICE'),
  (@subject_id,2,'4',2,'CHOICE'),
  (@subject_id,3,'5',2,'CHOICE'),
  (@subject_id,4,'1',3,'CHOICE'),
  (@subject_id,5,'2',2,'CHOICE'),
  (@subject_id,6,'4',2,'CHOICE'),
  (@subject_id,7,'5',3,'CHOICE'),
  (@subject_id,8,'2',3,'CHOICE'),
  (@subject_id,9,'3',2,'CHOICE'),
  (@subject_id,10,'3',2,'CHOICE'),
  (@subject_id,11,'4',3,'CHOICE'),
  (@subject_id,12,'1',3,'CHOICE'),
  (@subject_id,13,'5',2,'CHOICE'),
  (@subject_id,14,'1',3,'CHOICE'),
  (@subject_id,15,'1',3,'CHOICE'),
  (@subject_id,16,'4',2,'CHOICE'),
  (@subject_id,17,'3',2,'CHOICE'),
  (@subject_id,18,'2',2,'CHOICE'),
  (@subject_id,19,'5',3,'CHOICE'),
  (@subject_id,20,'3',3,'CHOICE')
ON DUPLICATE KEY UPDATE
  correct_answer = VALUES(correct_answer),
  points = VALUES(points),
  question_type = VALUES(question_type);

INSERT INTO exam_subjects (academic_year, exam_month, subject_code, subject_name, option_name, question_count, max_score, data_status) VALUES ('2027학년도',9,'SCI_PHYSICS_I','물리학Ⅰ','과학탐구', 20, 50, 'NOT_READY')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  subject_name = VALUES(subject_name),
  option_name = VALUES(option_name),
  question_count = VALUES(question_count),
  max_score = VALUES(max_score),
  data_status = VALUES(data_status);
