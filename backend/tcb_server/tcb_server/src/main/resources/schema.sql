CREATE TABLE IF NOT EXISTS admin_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    login_id VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL
);

-- Sample data
INSERT IGNORE INTO admin_user (login_id, password, name, role) VALUES
('admin', 'admin1234', '관리자', 'ADMIN'),
('coach1', 'coach1234', '김코치', 'COACH');

-- 예약 테이블
CREATE TABLE IF NOT EXISTS reservation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_id BIGINT NOT NULL,
    content TEXT,
    reservation_at DATETIME NOT NULL,
    status VARCHAR(20) DEFAULT 'BOOKED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
