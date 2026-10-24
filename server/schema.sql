CREATE DATABASE IF NOT EXISTS reroot
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE reroot;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('home', 'business', 'ngo') NOT NULL DEFAULT 'home',
  units ENUM('metric', 'imperial') NOT NULL DEFAULT 'metric',
  dark_mode BOOLEAN NOT NULL DEFAULT FALSE,
  eco_score INT UNSIGNED NOT NULL DEFAULT 0,
  streak INT UNSIGNED NOT NULL DEFAULT 0,
  last_active_date DATE NULL,
  location VARCHAR(255) NULL,
  bio TEXT NULL,
  preferences JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_users_role_score (role, eco_score)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS inventory_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(180) NOT NULL,
  category VARCHAR(80) NOT NULL,
  storage_location VARCHAR(80) NOT NULL DEFAULT 'Fridge',
  quantity DECIMAL(12, 3) NOT NULL DEFAULT 1,
  unit VARCHAR(24) NOT NULL,
  expiry_date DATE NULL,
  purchase_date DATE NULL,
  barcode VARCHAR(80) NULL,
  status ENUM('active', 'consumed', 'donated', 'used_in_recipe', 'discarded') NOT NULL DEFAULT 'active',
  weight_kg DECIMAL(12, 3) NULL,
  estimated_value DECIMAL(10, 2) NULL,
  co2_impact_kg DECIMAL(12, 3) NULL,
  notes VARCHAR(1000) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_inventory_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_inventory_user_status_expiry (user_id, status, expiry_date),
  INDEX idx_inventory_barcode (barcode)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS shelters (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  address VARCHAR(255) NOT NULL,
  phone VARCHAR(40) NULL,
  accepts JSON NOT NULL,
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  opening_hours VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_shelters_coordinates (lat, lng)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS donations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  shelter_id BIGINT UNSIGNED NOT NULL,
  item_id BIGINT UNSIGNED NULL,
  pickup_time DATETIME NOT NULL,
  status ENUM('scheduled', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
  accepted_at DATETIME NULL,
  verified_weight_kg DECIMAL(12, 3) NULL,
  notes VARCHAR(1000) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_donations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_donations_shelter FOREIGN KEY (shelter_id) REFERENCES shelters(id) ON DELETE RESTRICT,
  CONSTRAINT fk_donations_item FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE SET NULL,
  INDEX idx_donations_user_status (user_id, status),
  INDEX idx_donations_shelter_status (shelter_id, status),
  INDEX idx_donations_pickup (pickup_time, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS marketplace_listings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(180) NOT NULL,
  description VARCHAR(2000) NOT NULL DEFAULT '',
  portions VARCHAR(100) NOT NULL DEFAULT '',
  category VARCHAR(80) NOT NULL DEFAULT 'Produce',
  pickup_window VARCHAR(120) NOT NULL DEFAULT '',
  pickup_location VARCHAR(255) NOT NULL DEFAULT '',
  dietary_tags JSON NOT NULL,
  allergens JSON NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status ENUM('open', 'claimed', 'expired') NOT NULL DEFAULT 'open',
  expires_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_listings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_marketplace_status_expiry (status, expires_at),
  INDEX idx_marketplace_user (user_id, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS marketplace_claims (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  listing_id BIGINT UNSIGNED NOT NULL,
  claimer_id BIGINT UNSIGNED NOT NULL,
  claimed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_claim_listing FOREIGN KEY (listing_id) REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  CONSTRAINT fk_claim_user FOREIGN KEY (claimer_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_marketplace_claim_listing (listing_id),
  INDEX idx_marketplace_claim_claimer (claimer_id, claimed_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS badges (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(60) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  icon VARCHAR(60) NOT NULL,
  tier ENUM('bronze', 'silver', 'gold', 'diamond') NOT NULL DEFAULT 'bronze'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_badges (
  user_id BIGINT UNSIGNED NOT NULL,
  badge_id BIGINT UNSIGNED NOT NULL,
  earned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, badge_id),
  CONSTRAINT fk_user_badges_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_badges_badge FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  type VARCHAR(40) NOT NULL,
  message VARCHAR(500) NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  dedupe_key VARCHAR(200) NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notifications_user_unread (user_id, is_read, created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS activity_log (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  action ENUM('consumed', 'donated', 'used_in_recipe', 'discarded') NOT NULL,
  item_id BIGINT UNSIGNED NULL,
  weight_kg DECIMAL(12, 3) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_activity_item FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE SET NULL,
  INDEX idx_activity_user_action_date (user_id, action, created_at)
) ENGINE=InnoDB;
