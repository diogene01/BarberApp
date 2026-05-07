-- ============================================================
-- BarberApp — Schema do Banco de Dados
-- ============================================================

CREATE DATABASE IF NOT EXISTS `barber_app_db`;
USE `barber_app_db`;

-- ----------------------------------------
-- TABELAS
-- ----------------------------------------

CREATE TABLE `barbers` (
    `id`                    INT AUTO_INCREMENT PRIMARY KEY,
    `name`                  VARCHAR(255) NOT NULL,
    `email`                 VARCHAR(255) NOT NULL UNIQUE,
    `password`              VARCHAR(255) NOT NULL,
    `phone`                 VARCHAR(20),
    `code`                  VARCHAR(50)  NOT NULL UNIQUE,
    `subscription_status`   ENUM('active','pending','inactive','canceled') DEFAULT 'pending',
    `subscription_due_date` DATE,
    `created_at`            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `clients` (
    `id`         INT AUTO_INCREMENT PRIMARY KEY,
    `name`       VARCHAR(255) NOT NULL,
    `email`      VARCHAR(255) NOT NULL UNIQUE,
    `password`   VARCHAR(255) NOT NULL,
    `phone`      VARCHAR(20),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `services` (
    `id`        INT AUTO_INCREMENT PRIMARY KEY,
    `barber_id` INT          NOT NULL,
    `name`      VARCHAR(255) NOT NULL,
    `price`     DECIMAL(10,2) NOT NULL,
    `duration`  INT           NOT NULL COMMENT 'Duração em minutos',
    `image_url` VARCHAR(500),
    FOREIGN KEY (`barber_id`) REFERENCES `barbers`(`id`) ON DELETE CASCADE,
    INDEX `idx_services_barber` (`barber_id`)
);

CREATE TABLE `plans` (
    `id`          INT AUTO_INCREMENT PRIMARY KEY,
    `barber_id`   INT           NOT NULL,
    `name`        VARCHAR(255)  NOT NULL,
    `description` TEXT,
    `price`       DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (`barber_id`) REFERENCES `barbers`(`id`) ON DELETE CASCADE,
    INDEX `idx_plans_barber` (`barber_id`)
);

CREATE TABLE `appointments` (
    `id`         INT AUTO_INCREMENT PRIMARY KEY,
    `barber_id`  INT  NOT NULL,
    `client_id`  INT  NOT NULL,
    `service_id` INT  NOT NULL,
    `date`       DATE NOT NULL,
    `time`       TIME NOT NULL,
    `status`     ENUM('Agendado','Confirmado','Cancelado','Concluído') DEFAULT 'Agendado',
    FOREIGN KEY (`barber_id`)  REFERENCES `barbers`(`id`)  ON DELETE CASCADE,
    FOREIGN KEY (`client_id`)  REFERENCES `clients`(`id`)  ON DELETE CASCADE,
    FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE CASCADE,
    -- Evita agendamentos duplicados no mesmo horário
    UNIQUE KEY `uq_appointment_slot` (`barber_id`, `date`, `time`),
    INDEX `idx_appointments_barber_date` (`barber_id`, `date`)
);

CREATE TABLE `expenses` (
    `id`          INT AUTO_INCREMENT PRIMARY KEY,
    `barber_id`   INT           NOT NULL,
    `description` VARCHAR(255)  NOT NULL,
    `value`       DECIMAL(10,2) NOT NULL,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`barber_id`) REFERENCES `barbers`(`id`) ON DELETE CASCADE,
    INDEX `idx_expenses_barber` (`barber_id`)
);

CREATE TABLE `settings` (
    `id`                   INT AUTO_INCREMENT PRIMARY KEY,
    `barber_id`            INT          NOT NULL UNIQUE,
    `logo_url`             VARCHAR(500),
    `background_image_url` VARCHAR(500),
    `available_time_slots` TEXT COMMENT 'Horários separados por vírgula: 09:00,09:30,...',
    FOREIGN KEY (`barber_id`) REFERENCES `barbers`(`id`) ON DELETE CASCADE
);

-- ----------------------------------------
-- DADOS DE EXEMPLO (para desenvolvimento)
-- ----------------------------------------

-- Senha dos exemplos: "1234" (hash bcrypt)
INSERT INTO `barbers` (`id`,`name`,`email`,`password`,`phone`,`code`,`subscription_status`,`subscription_due_date`) VALUES
(1, 'Barber Shop A', 'admin@barber.com', '$2b$10$EXEMPLO_HASH_BCRYPT_AQUI', '(11) 99999-9999', 'BARBER123', 'active', '2026-09-18');

INSERT INTO `clients` (`id`,`name`,`email`,`password`,`phone`) VALUES
(1, 'Carlos Silva', 'cliente@email.com', '$2b$10$EXEMPLO_HASH_BCRYPT_AQUI', '(11) 98765-4321'),
(2, 'João Pereira', 'joao@email.com',    '$2b$10$EXEMPLO_HASH_BCRYPT_AQUI', '(21) 99887-6543');

INSERT INTO `services` (`id`,`barber_id`,`name`,`price`,`duration`,`image_url`) VALUES
(1, 1, 'Corte Social',        40.00, 30, 'https://placehold.co/300x300/64748B/ffffff?text=Corte'),
(2, 1, 'Barba Terapia',       35.00, 30, 'https://placehold.co/300x300/71717A/ffffff?text=Barba'),
(3, 1, 'Sobrancelha',         20.00, 15, 'https://placehold.co/300x300/475569/ffffff?text=Sobrancelha'),
(4, 1, 'Combo (Corte+Barba)', 70.00, 60, 'https://placehold.co/300x300/334155/ffffff?text=Combo');

INSERT INTO `plans` (`id`,`barber_id`,`name`,`description`,`price`) VALUES
(1, 1, 'Plano Fiel',     '2 Cortes + 2 Barbas por mês.',               120.00),
(2, 1, 'Plano Completo', 'Tudo ilimitado (Corte, Barba, Sobrancelha).', 150.00);

INSERT INTO `appointments` (`id`,`barber_id`,`client_id`,`service_id`,`date`,`time`,`status`) VALUES
(1, 1, 1, 4, '2026-08-19', '10:00:00', 'Confirmado'),
(2, 1, 2, 1, '2026-08-19', '14:30:00', 'Agendado');

INSERT INTO `expenses` (`id`,`barber_id`,`description`,`value`) VALUES
(1, 1, 'Aluguel',          800.00),
(2, 1, 'Produtos (ceras)', 250.00);

INSERT INTO `settings` (`id`,`barber_id`,`logo_url`,`background_image_url`,`available_time_slots`) VALUES
(1, 1,
 'https://placehold.co/100x100/334155/FFFFFF?text=Logo',
 'https://images.unsplash.com/photo-1622288432458-2d7c3a6e3e0d?q=80&w=1932',
 '09:00,09:30,10:00,10:30,11:00,11:30,14:00,14:30,15:00,15:30,16:00,16:30,17:00');
