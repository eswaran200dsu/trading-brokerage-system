-- Trading Brokerage Management System
-- Database schema

CREATE DATABASE IF NOT EXISTS trading_brokerage
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE trading_brokerage;

-- -------------------------------------------------------
-- Table: clients
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS clients (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  client_code      VARCHAR(50)  NOT NULL UNIQUE,
  name             VARCHAR(200) NOT NULL,
  pan              VARCHAR(10)  DEFAULT NULL,
  dob              DATE         DEFAULT NULL,
  mobile           VARCHAR(15)  NOT NULL,
  parent_code      VARCHAR(50)  DEFAULT NULL,
  password_hash    VARCHAR(255) NOT NULL,
  role             ENUM('admin','client') NOT NULL DEFAULT 'client',
  status           ENUM('active','inactive') NOT NULL DEFAULT 'active',
  must_change_password TINYINT(1) NOT NULL DEFAULT 0,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_client_code_lookup (client_code),
  INDEX idx_parent_code (parent_code),
  INDEX idx_mobile (mobile)
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- Table: brokerage
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS brokerage (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  client_code      VARCHAR(50)  NOT NULL,
  trade_date       DATE         NOT NULL,
  brokerage_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  segment          VARCHAR(50)  DEFAULT NULL,
  remark           VARCHAR(500) DEFAULT NULL,
  upload_id        INT          DEFAULT NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_client_code (client_code),
  INDEX idx_trade_date (trade_date),
  INDEX idx_upload_id (upload_id)
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- Table: uploads
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS uploads (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  file_name        VARCHAR(500) NOT NULL,
  upload_type      ENUM('client_master','brokerage') NOT NULL,
  total_rows       INT NOT NULL DEFAULT 0,
  success_rows     INT NOT NULL DEFAULT 0,
  failed_rows      INT NOT NULL DEFAULT 0,
  duplicate_rows   INT NOT NULL DEFAULT 0,
  uploaded_by      VARCHAR(50)  NOT NULL,
  uploaded_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- Table: upload_errors
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS upload_errors (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  upload_id        INT NOT NULL,
  row_number       INT NOT NULL,
  error_message    VARCHAR(1000) NOT NULL,
  row_data         TEXT DEFAULT NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_upload_id (upload_id)
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- Table: password_reset_requests
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS password_reset_requests (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  client_code      VARCHAR(50) NOT NULL,
  mobile           VARCHAR(15) NOT NULL,
  status           ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  requested_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at      DATETIME DEFAULT NULL,
  INDEX idx_client_code (client_code),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- Default admin account
-- Password: Admin@123  (bcrypt hash below)
-- -------------------------------------------------------
INSERT INTO clients (client_code, name, pan, mobile, password_hash, role, status, must_change_password)
VALUES (
  'admin',
  'Admin User',
  NULL,
  '0000000000',
  '$2b$12$wlFHqvnzY/vYcB5sCYwEuOv0DVgWoHWQpPGKiNKiW.kfIDTtKFjB.',
  'admin',
  'active',
  0
)
ON DUPLICATE KEY UPDATE id=id;
-- Reset all must_change_password flags so existing clients can log in directly
UPDATE clients SET must_change_password = 0;

