use dream_campus;

CREATE TABLE IF NOT EXISTS exam_subjects (
    id BIGINT NOT NULL AUTO_INCREMENT,
    academic_year VARCHAR(20) NOT NULL,
    exam_month INT NOT NULL,
    subject_code VARCHAR(50) NOT NULL,
    subject_name VARCHAR(50) NOT NULL,
    option_name VARCHAR(50) NULL,
    question_count INT NOT NULL,
    max_score INT NOT NULL,
    data_status VARCHAR(16) NOT NULL COMMENT 'OFFICIAL / DEMO / NOT_READY',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_exam_subject (academic_year, exam_month, subject_code),
    KEY idx_exam_lookup (academic_year, exam_month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS answer_keys (
    id BIGINT NOT NULL AUTO_INCREMENT,
    exam_subject_id BIGINT NOT NULL,
    question_number INT NOT NULL,
    correct_answer VARCHAR(20) NOT NULL,
    points INT NOT NULL,
    question_type VARCHAR(10) NOT NULL COMMENT 'CHOICE / SHORT',
    PRIMARY KEY (id),
    UNIQUE KEY uk_answer_question (exam_subject_id, question_number),
    CONSTRAINT fk_answer_subject
        FOREIGN KEY (exam_subject_id) REFERENCES exam_subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS grading_records (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    exam_subject_id BIGINT NOT NULL,
    data_status VARCHAR(16) NOT NULL,
    submitted_answers_json LONGTEXT NOT NULL,
    score INT NOT NULL,
    correct_count INT NOT NULL,
    wrong_count INT NOT NULL,
    unanswered_count INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_grading_user_created (user_id, created_at),
    CONSTRAINT fk_grading_user
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_grading_subject
        FOREIGN KEY (exam_subject_id) REFERENCES exam_subjects(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
