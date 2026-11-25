USE dream_campus;

-- 관심 대학: 로그인한 회원이 등록한 대학
-- 주의: universities 테이블(대학 시드 SQL이 생성)이 먼저 있어야 한다.
CREATE TABLE IF NOT EXISTS favorite_universities (
                                                     favorite_id   BIGINT          NOT NULL AUTO_INCREMENT,
                                                     user_id       BIGINT          NOT NULL,
                                                     university_id BIGINT UNSIGNED NOT NULL,   -- universities.university_id가 UNSIGNED라서 똑같이 맞춰야 외래키가 만들어진다
                                                     created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                                     PRIMARY KEY (favorite_id),
    UNIQUE KEY uk_favorite_user_university (user_id, university_id),   -- 같은 대학을 두 번 등록할 수 없다
    CONSTRAINT fk_favorite_user       FOREIGN KEY (user_id)       REFERENCES users (user_id)             ON DELETE CASCADE,
    CONSTRAINT fk_favorite_university FOREIGN KEY (university_id) REFERENCES universities (university_id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;