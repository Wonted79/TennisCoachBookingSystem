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
