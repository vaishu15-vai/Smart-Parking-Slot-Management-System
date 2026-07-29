-- Smart Parking Management System SQL Database Schema
-- Compatible with SQLite, MySQL, and PostgreSQL

-- Table: managers (Stores Slot Center Managers with Unique IDs)
CREATE TABLE IF NOT EXISTS managers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  center_id VARCHAR(50),
  center_name VARCHAR(150),
  paytm_phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: centers (Stores Slot Centers, Location, Pricing & Paytm Phone)
CREATE TABLE IF NOT EXISTS centers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  address TEXT NOT NULL,
  distance_km DECIMAL(10, 2) DEFAULT 0.00,
  estimated_minutes INT DEFAULT 0,
  total_slots INT NOT NULL DEFAULT 15,
  available_slots INT NOT NULL DEFAULT 15,
  hourly_rate DECIMAL(10, 2) NOT NULL DEFAULT 5.00,
  map_x INT DEFAULT 50,
  map_y INT DEFAULT 50,
  facilities TEXT, -- Comma-separated list or JSON
  image TEXT,
  contact VARCHAR(50),
  paytm_phone VARCHAR(20) NOT NULL,
  operating_hours VARCHAR(100) NOT NULL DEFAULT '08:00 AM - 10:00 PM',
  manager_id VARCHAR(50),
  FOREIGN KEY (manager_id) REFERENCES managers(id) ON DELETE SET NULL
);

-- Table: requests (Stores Parking Slot Bookings, Paytm Transactions, & Visit IDs)
CREATE TABLE IF NOT EXISTS requests (
  id VARCHAR(50) PRIMARY KEY,
  visit_id VARCHAR(50) UNIQUE,
  user_email VARCHAR(100) NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  user_phone VARCHAR(30),
  center_id VARCHAR(50) NOT NULL,
  center_name VARCHAR(150) NOT NULL,
  vehicle_no VARCHAR(50) NOT NULL,
  start_time VARCHAR(20) NOT NULL,
  duration_hours INT NOT NULL DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pending', -- pending, confirmed, paid, physically_confirmed, rejected
  payment_status VARCHAR(30) NOT NULL DEFAULT 'pending', -- pending, paid
  physical_status VARCHAR(30) NOT NULL DEFAULT 'unconfirmed', -- unconfirmed, physically_confirmed
  paytm_phone VARCHAR(20) NOT NULL,
  transaction_ref VARCHAR(100),
  slot_number VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (center_id) REFERENCES centers(id) ON DELETE CASCADE
);

-- Table: slots_layout (Stores individual bay statuses for center floor plans)
CREATE TABLE IF NOT EXISTS slots_layout (
  center_id VARCHAR(50) NOT NULL,
  slot_number VARCHAR(20) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'Standard', -- Standard, EV Charging, VIP
  status VARCHAR(30) NOT NULL DEFAULT 'available', -- available, occupied, reserved, maintenance
  floor VARCHAR(30) NOT NULL DEFAULT 'Level 1',
  PRIMARY KEY (center_id, slot_number),
  FOREIGN KEY (center_id) REFERENCES centers(id) ON DELETE CASCADE
);

-- Initial Seed Data Insertions

INSERT OR IGNORE INTO managers (id, name, email, password, center_id, center_name, paytm_phone, created_at) VALUES
('MGR-1001', 'David Miller', 'manager1@parksmart.com', 'mgr123', 'center-1', 'Metro Central Smart Hub', '9876543210', CURRENT_TIMESTAMP),
('MGR-1002', 'Sarah Connor', 'manager2@parksmart.com', 'mgr123', 'center-2', 'Tech Park Automated Garage', '9876500112', CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO centers (id, name, address, distance_km, estimated_minutes, total_slots, available_slots, hourly_rate, map_x, map_y, facilities, image, contact, paytm_phone, operating_hours, manager_id) VALUES
('center-1', 'Metro Central Smart Hub', '452 Park Avenue, Downtown', 2.4, 8, 20, 14, 5.00, 32, 38, 'EV Charging,Covered Parking,24/7 Security,Valet', 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80', '+91 98765 43210', '9876543210', '06:00 AM - 11:00 PM', 'MGR-1001'),
('center-2', 'Tech Park Automated Garage', '88 Innovation Boulevard', 8.5, 18, 15, 6, 4.50, 68, 28, 'EV Charging,Automated Barrier,CCTV Surveillance', 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80', '+91 98765 00112', '9876500112', '08:00 AM - 10:00 PM', 'MGR-1002'),
('center-3', 'Grand Plaza Underground Parking', '102 City Center Mall', 14.2, 32, 25, 18, 6.00, 45, 68, 'Underground,Car Wash Service,Valet', 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=600&q=80', '+91 98111 22233', '9811122233', '07:00 AM - 12:00 AM', NULL),
('center-4', 'Skyline Airport Express Deck', 'Terminal 2 Entrance Rd', 24.8, 48, 30, 12, 8.00, 82, 80, '24/7 Security,Airport Shuttle,Long Term Parking', 'https://images.unsplash.com/photo-1543465077-db45d34b88a5?auto=format&fit=crop&w=600&q=80', '+91 99887 76655', '9988776655', '24 Hours Open', NULL);

INSERT OR IGNORE INTO requests (id, visit_id, user_email, user_name, user_phone, center_id, center_name, vehicle_no, start_time, duration_hours, total_price, status, payment_status, physical_status, paytm_phone, transaction_ref, slot_number, created_at) VALUES
('req-101', 'VST-9812', 'alex@user.com', 'Alex Johnson', '+91 98765 11111', 'center-1', 'Metro Central Smart Hub', 'KA-05-EV-4421', '14:00', 3, 15.00, 'paid', 'paid', 'unconfirmed', '9876543210', 'TXN-901823', 'A-05', CURRENT_TIMESTAMP),
('req-102', 'VST-4509', 'sarah@user.com', 'Sarah Jenkins', '+91 98765 22222', 'center-2', 'Tech Park Automated Garage', 'NY-889-X', '11:00', 2, 9.00, 'physically_confirmed', 'paid', 'physically_confirmed', '9876500112', 'TXN-882312', 'EV-02', CURRENT_TIMESTAMP);
