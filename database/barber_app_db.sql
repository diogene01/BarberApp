SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Garante que estamos a usar o banco de dados padrão do Aiven
USE defaultdb;

-- --------------------------------------------------------
-- 1. ELIMINAR TABELAS EXISTENTES (Limpeza)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `appointments`, `dashboard`, `expenses`, `plans`, `services`, `settings`, `clients`, `barbers`;

-- --------------------------------------------------------
-- 2. CRIAÇÃO DAS TABELAS (Com Chaves Primárias para o Aiven)
-- --------------------------------------------------------

CREATE TABLE `barbers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `code` varchar(50) NOT NULL,
  `subscription_status` enum('active','pending','inactive','canceled') DEFAULT 'pending',
  `subscription_due_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `barber_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `duration` int(11) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `barber_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `status` enum('Agendado','Cancelado','Concluido') DEFAULT 'Agendado',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `expenses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `barber_id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `plans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `barber_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `barber_id` int(11) NOT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `background_image_url` varchar(255) DEFAULT NULL,
  `available_time_slots` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `barber_id` (`barber_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `dashboard` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `barber_id` int(11) NOT NULL,
  `services_provided` int(11) DEFAULT 0,
  `total_revenue` decimal(10,2) DEFAULT 0.00,
  `total_expenses` decimal(10,2) DEFAULT 0.00,
  `net_profit` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 3. INSERÇÃO DOS DADOS (Copiado do teu Dump)
-- --------------------------------------------------------

-- Barbeiros
INSERT INTO `barbers` (`id`, `name`, `email`, `password`, `phone`, `code`, `subscription_status`, `created_at`) VALUES
(11, 'Maverick Barber Club', 'maverick@gmail.com', '$2b$10$Xxs4ud.tKBW5f10i11TIq.N9sO1loAm/WDRhi9kFTZjOXHwtrKkl.', '(19) 98765-4321', 'BARBER55794', 'pending', '2026-05-07 21:39:05'),
(12, 'Navalha de Ouro', 'navalha@gmail.com', '$2b$10$gsXLhxnq0/TltE.hqTNAa.2GcgYLAAdgcdYYDFrOf/x8FPQsZecqG', '(11) 91234-5678', 'BARBER73473', 'pending', '2026-05-07 22:25:51'),
(13, 'Black Beard Studio', 'black@gmail.com', '$2b$10$yysNuglMatxbT.nppqOuJeyXNwlTqKR81xy6nwQrI1FPONEgZw7Dm', '(19) 99888-7766', 'BARBER38105', 'pending', '2026-05-07 22:28:34'),
(14, 'Rocha Barber Shop', 'rocha@gmail.com', '$2b$10$pOIUFdJhlvKMMmufRCYAuezh/laypMq7XPfobqLsGkdX.m10N.WaW', '(21) 97766-5544', 'BARBER12600', 'pending', '2026-05-07 22:29:44'),
(15, 'Vintage Corte & Estilo', 'vintage@gmail.com', '$2b$10$8DuLwjgMuiBqejthBkhu6.GmPQCXhMEXlH6MlQ7BntTUQ/khNnXim', '(19) 98122-3344', 'BARBER22625', 'pending', '2026-05-07 22:30:47');

-- Clientes
INSERT INTO `clients` (`id`, `name`, `email`, `password`, `phone`, `created_at`) VALUES
(22, 'Gabriel Souza Silva', 'gabriel@gmail.com', '$2b$10$TmDkTJKL2i3pPVvqhSBPouB97rgU5bg/knNrjqqVUxOzsZULZ7B8e', '(19) 68451-6531', '2026-05-07 23:03:15'),
(23, 'Diana Luara de Souza', 'diana@gmail.com', '$2b$10$4oD5g492ak6KiuT6UXr2AOd5/8vtQJqC6ZBF8qZJqPThrYvAYmAcS', '(19) 86465-1351', '2026-05-11 21:23:01'),
(24, 'Ana Beatriz Cavalcante', 'ana@gmail.com', '$2b$10$GMnTWvDG93HyDYDkxdEcKuvwxmFAjT8uVQhevousQjqEAq.AfYVP2', '(19) 48964-1683', '2026-05-11 21:23:59'),
(25, 'Matheus Henrique Lopes', 'matheus@gmail.com', '$2b$10$FB6iUp8n.JJRz6Hw8nPKBeMvmMw099ZQDYtamlXsiOfS1EiCTs0wu', '(87) 98465-4165', '2026-05-11 21:24:51'),
(26, 'Isabela Fernanda Lopes', 'isabela@gmail.com', '$2b$10$xocTfkIAExFk08KY.oWXL.R6/o68JjfX3evfHCWLHD1Rt0.jN7fEK', '(19) 13546-8498', '2026-05-11 21:25:44');

-- Despesas
INSERT INTO `expenses` (`id`, `barber_id`, `description`, `value`, `created_at`) VALUES
(17, 11, 'Aluguel', 1200.00, '2026-05-11 21:29:13'),
(18, 11, 'Energia Elétrica (CPFL)', 350.50, '2026-05-11 21:29:13'),
(19, 11, 'Kit de Pomadas e Shampoos Premium', 450.00, '2026-05-11 21:29:13'),
(20, 11, 'Internet Fibra Óptica', 99.90, '2026-05-11 21:29:13'),
(21, 11, 'Manutenção Ar-Condicionado', 150.00, '2026-05-11 21:29:13'),
(22, 12, 'Aluguel da Sala', 850.00, '2026-05-11 21:29:13'),
(27, 13, 'Aluguel Studio Moderno', 1500.00, '2026-05-11 21:29:13'),
(32, 14, 'Aluguel de Garagem Adaptada', 600.00, '2026-05-11 21:29:13'),
(37, 15, 'Aluguel de Casarão Antigo', 2200.00, '2026-05-11 21:29:13');

-- Serviços
INSERT INTO `services` (`id`, `barber_id`, `name`, `price`, `duration`, `image_url`) VALUES
(67, 11, 'Corte Moderno (Degradê)', 50.00, 45, 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=400'),
(68, 11, 'Barba Completa na Toalha', 35.00, 30, 'https://images.unsplash.com/photo-1599351431247-f13276d70ad7?auto=format&fit=crop&q=80&w=400'),
(72, 12, 'Corte Clássico (Tesoura)', 45.00, 40, 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=400'),
(77, 13, 'Barba Terapia Completa', 55.00, 50, 'https://images.unsplash.com/photo-1599351431247-f13276d70ad7?auto=format&fit=crop&q=80&w=400');

-- Planos
INSERT INTO `plans` (`id`, `barber_id`, `name`, `description`, `price`) VALUES
(25, 11, 'Maverick Gold', 'Cortes ilimitados + 2 Barba Terapias.', 180.00),
(30, 12, 'Fidelidade 10', 'Na compra de 10 cortes, o 11º é por conta.', 450.00);

-- Configurações
INSERT INTO `settings` (`id`, `barber_id`, `logo_url`, `available_time_slots`) VALUES
(11, 11, 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1', '09:00,10:00,11:00,14:00,15:00,16:00,17:00'),
(12, 12, 'https://placehold.co/100x100', '09:00,10:00,11:00,14:00,15:00,16:00,17:00');

-- --------------------------------------------------------
-- 4. CONSTRAINTS (Chaves Estrangeiras)
-- --------------------------------------------------------

ALTER TABLE `services` ADD CONSTRAINT `services_ibfk_1` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`id`) ON DELETE CASCADE;
ALTER TABLE `appointments` ADD CONSTRAINT `app_barber_fk` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`id`) ON DELETE CASCADE;
ALTER TABLE `appointments` ADD CONSTRAINT `app_client_fk` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE;
ALTER TABLE `appointments` ADD CONSTRAINT `app_service_fk` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE;
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`id`) ON DELETE CASCADE;
ALTER TABLE `plans` ADD CONSTRAINT `plans_ibfk_1` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`id`) ON DELETE CASCADE;
ALTER TABLE `settings` ADD CONSTRAINT `settings_ibfk_1` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`id`) ON DELETE CASCADE;
ALTER TABLE `dashboard` ADD CONSTRAINT `dashboard_ibfk_1` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`id`) ON DELETE CASCADE;

COMMIT;