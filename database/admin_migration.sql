USE dream_campus;

ALTER TABLE users
    ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'USER',
    ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';

-- 아래 이메일을 실제 관리자 계정 이메일로 변경한 뒤 주석을 해제하여 실행합니다.
-- UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';

-- 관리자 권한이 정상 등록되었는지 확인합니다.
SELECT user_id, email, name, role, status
FROM users
ORDER BY user_id;
