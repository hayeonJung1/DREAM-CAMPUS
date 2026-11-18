USE dream_campus;

-- ============================================================
-- 공통 테이블 (팀 공용)
-- ============================================================

-- 회원
CREATE TABLE IF NOT EXISTS users (
                                     user_id            BIGINT       NOT NULL AUTO_INCREMENT,
                                     email              VARCHAR(100) NOT NULL,
    password           VARCHAR(255) NOT NULL,            -- BCrypt 해시값 저장
    name               VARCHAR(50)  NOT NULL,
    grade              TINYINT      NULL,
    daily_goal_minutes INT          NULL,                -- 하루 공부 목표(분), NULL이면 미설정
    created_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    UNIQUE KEY uk_users_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 과목 (모의고사 전용: 국어, 수학, 영어 ...)
CREATE TABLE IF NOT EXISTS subjects (
                                        subject_id   BIGINT      NOT NULL AUTO_INCREMENT,
                                        subject_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (subject_id),
    UNIQUE KEY uk_subjects_name (subject_name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 공부 타이머 (하연)
-- ============================================================

-- 공부 과목: 회원이 직접 추가·삭제하는 자기 과목
--   삭제는 is_active = FALSE로 숨기기만 한다 (과거 공부 기록이 이 과목을 참조하기 때문)
CREATE TABLE IF NOT EXISTS study_subjects (
                                              study_subject_id BIGINT      NOT NULL AUTO_INCREMENT,
                                              user_id          BIGINT      NOT NULL,
                                              subject_name     VARCHAR(30) NOT NULL,
    is_active        BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at       DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (study_subject_id),
    UNIQUE KEY uk_study_subjects_user_name (user_id, subject_name),   -- 내 과목끼리만 중복 금지
    CONSTRAINT fk_study_subjects_user FOREIGN KEY (user_id) REFERENCES users (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 공부 세션: 타이머 시작부터 종료까지 한 번
--   진행 중 : ended_at IS NULL AND paused_at IS NULL
--   일시정지: ended_at IS NULL AND paused_at IS NOT NULL
--   종료    : ended_at IS NOT NULL
CREATE TABLE IF NOT EXISTS study_sessions (
                                              session_id           BIGINT   NOT NULL AUTO_INCREMENT,
                                              user_id              BIGINT   NOT NULL,
                                              study_subject_id     BIGINT   NULL,                  -- 과목 없이 자유 공부 허용
                                              started_at           DATETIME NOT NULL,
                                              ended_at             DATETIME NULL,
                                              paused_at            DATETIME NULL,
                                              total_paused_seconds INT      NOT NULL DEFAULT 0,
                                              duration_seconds     INT      NOT NULL DEFAULT 0,
                                              PRIMARY KEY (session_id),
    KEY idx_study_sessions_user_started (user_id, started_at),
    CONSTRAINT fk_study_sessions_user    FOREIGN KEY (user_id)          REFERENCES users (user_id),
    CONSTRAINT fk_study_sessions_subject FOREIGN KEY (study_subject_id) REFERENCES study_subjects (study_subject_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;