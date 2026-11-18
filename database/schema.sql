USE dream_campus;

-- 회원 (팀 공용)
CREATE TABLE IF NOT EXISTS users (
                                     user_id            BIGINT       NOT NULL AUTO_INCREMENT,
                                     email              VARCHAR(100) NOT NULL,
    password           VARCHAR(255) NOT NULL,
    name               VARCHAR(50)  NOT NULL,
    grade              TINYINT      NULL,
    daily_goal_minutes INT          NULL,
    created_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    UNIQUE KEY uk_users_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 과목 (팀 공용)
CREATE TABLE IF NOT EXISTS subjects (
                                        subject_id   BIGINT      NOT NULL AUTO_INCREMENT,
                                        subject_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (subject_id),
    UNIQUE KEY uk_subjects_name (subject_name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 공부 세션 (하연)
CREATE TABLE IF NOT EXISTS study_sessions (
                                              session_id           BIGINT   NOT NULL AUTO_INCREMENT,
                                              user_id              BIGINT   NOT NULL,
                                              subject_id           BIGINT   NULL,
                                              started_at           DATETIME NOT NULL,
                                              ended_at             DATETIME NULL,
                                              paused_at            DATETIME NULL,
                                              total_paused_seconds INT      NOT NULL DEFAULT 0,
                                              duration_seconds     INT      NOT NULL DEFAULT 0,
                                              PRIMARY KEY (session_id),
    KEY idx_study_sessions_user_started (user_id, started_at),
    CONSTRAINT fk_study_sessions_user    FOREIGN KEY (user_id)    REFERENCES users (user_id),
    CONSTRAINT fk_study_sessions_subject FOREIGN KEY (subject_id) REFERENCES subjects (subject_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;