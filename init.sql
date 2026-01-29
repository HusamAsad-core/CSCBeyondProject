CREATE DATABASE IF NOT EXISTS CSCBeyond_courses_website1;
USE CSCBeyond_courses_website1;

-- 1. Users (Auth)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories (Nested structure)
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id INT DEFAULT NULL, 
    icon_path VARCHAR(255),
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 3. Instructors (The "Sandeep" table)
CREATE TABLE IF NOT EXISTS instructors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    bio TEXT,
    rating DECIMAL(2, 1) DEFAULT 5.0,
    modules_count INT DEFAULT 0,
    students_trained INT DEFAULT 0,
    image_path VARCHAR(255),
    is_best_trainer BOOLEAN DEFAULT FALSE
);

-- 4. Courses
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    instructor_id INT,
    title VARCHAR(255) NOT NULL,
    logo_path VARCHAR(255),
    status ENUM('active', 'coming_soon', 'popular') DEFAULT 'active',
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (instructor_id) REFERENCES instructors(id)
);

-- 5. Pricing Plans
CREATE TABLE IF NOT EXISTS pricing_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    features JSON, 
    is_recommended BOOLEAN DEFAULT FALSE
);

-- 6. Organization Entities (Team, Advisors, Collaborations)
CREATE TABLE IF NOT EXISTS organization_entities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role_or_title VARCHAR(255),
    image_path VARCHAR(255),
    entity_type ENUM('team', 'advisor', 'certification', 'collaboration') NOT NULL
);

-- 7. Enquiries (Contact Form)
CREATE TABLE IF NOT EXISTS enquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT,
    interest_type ENUM('general', 'curriculum') DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Dynamic Achievements (View)
CREATE OR REPLACE VIEW dynamic_achievements AS
SELECT 
    GREATEST(100, (SELECT COUNT(*) FROM users)) AS students_trained,
    GREATEST(50, (SELECT COUNT(*) FROM courses)) AS courses_available,
    70 AS placement_rate;

-- SEED DATA (To prove it works)
INSERT INTO categories (id, name) VALUES (1, 'IT Field'), (2, 'Coding');
INSERT INTO instructors (name, specialization, is_best_trainer) VALUES ('Sandeep', 'Cloud & Cyber Security', TRUE);
INSERT INTO courses (title, category_id, instructor_id, status) VALUES ('AWS Cloud', 1, 1, 'popular');