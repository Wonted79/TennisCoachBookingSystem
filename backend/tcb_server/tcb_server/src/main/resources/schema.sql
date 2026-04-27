-- 외래키 순서 고려하여 DROP
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS reservation;
DROP TABLE IF EXISTS site_notice;
DROP TABLE IF EXISTS coach_profile;
DROP TABLE IF EXISTS coach;
DROP TABLE IF EXISTS admin;
DROP TABLE IF EXISTS admin_user;
SET FOREIGN_KEY_CHECKS = 1;

-- ── users (로그인 계정) ───────────────────────────────────────────────────────
-- role: ADMIN(전체 접근), COACH(본인 프로필/예약만)
-- is_temp_password: TRUE면 임시 비밀번호 상태 (변경 후 FALSE)
-- email: 비밀번호 재설정 및 계정 생성 안내에 사용 (UNIQUE NOT NULL)
CREATE TABLE IF NOT EXISTS users (
    id               BIGINT       AUTO_INCREMENT PRIMARY KEY,
    username         VARCHAR(50)  UNIQUE NOT NULL,
    email            VARCHAR(255) NULL,
    password_hash    VARCHAR(255) NOT NULL,
    role             ENUM('ADMIN', 'COACH') NOT NULL,
    is_temp_password BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at       DATETIME     DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- 기존 DB 마이그레이션: ALTER TABLE users ADD COLUMN email VARCHAR(255) UNIQUE NOT NULL AFTER username;
-- 기본 ADMIN 계정 수동 생성 예시 (비밀번호는 BCrypt 해시로 직접 삽입):
-- INSERT INTO users (username, email, password_hash, role, is_temp_password) VALUES ('admin', 'admin@example.com', '$2a$10$...', 'ADMIN', FALSE);

-- ── coach_profile (코치 상세 프로필, 1:1 with users) ─────────────────────────
CREATE TABLE IF NOT EXISTS coach_profile (
    id                BIGINT        AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT        UNIQUE NOT NULL,
    name              VARCHAR(50),
    phone             VARCHAR(20),
    profile_image_url VARCHAR(500),
    introduction      TEXT,
    education         TEXT,
    awards            TEXT,
    certifications    TEXT,
    updated_at        DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── site_notice (코치 1:1 공지) ───────────────────────────────────────────────
CREATE TABLE site_notice (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    coach_id   BIGINT  NOT NULL UNIQUE,
    content    TEXT    NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (coach_id) REFERENCES coach_profile(id) ON DELETE CASCADE
);

-- ── reservation (코치 1:N 예약) ───────────────────────────────────────────────
CREATE TABLE reservation (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    coach_id    BIGINT NOT NULL,
    day_of_week ENUM('MON','TUE','WED','THU','FRI','SAT','SUN') NOT NULL,
    time        VARCHAR(5)  NOT NULL,
    content     TEXT,
    status      ENUM('BOOKED','HELD') DEFAULT 'BOOKED',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (coach_id) REFERENCES coach_profile(id) ON DELETE CASCADE
);
