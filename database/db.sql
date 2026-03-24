-- Cria o banco de dados principal para a aplicação da barbearia
CREATE DATABASE IF NOT EXISTS `barber_app_db`;

-- Usa o banco de dados recém-criado
USE `barber_app_db`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `barbers`
-- Esta tabela armazena os dados de cada barbeiro/barbearia
--

CREATE TABLE `barbers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20),
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `subscription_status` ENUM('active', 'pending', 'inactive', 'canceled') DEFAULT 'pending',
  `subscription_due_date` DATE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

--
-- Estrutura da tabela `clients`
-- Esta tabela armazena os dados dos clientes
--

CREATE TABLE `clients` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

--
-- Estrutura da tabela `services`
-- Esta tabela armazena os serviços oferecidos por cada barbeiro
--

CREATE TABLE `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `barber_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `duration` INT NOT NULL,
  `image` VARCHAR(255),
  FOREIGN KEY (`barber_id`) REFERENCES `barbers`(`id`) ON DELETE CASCADE
);

-- --------------------------------------------------------

--
-- Estrutura da tabela `plans`
-- Esta tabela armazena os planos mensais oferecidos por cada barbeiro
--

CREATE TABLE `plans` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `barber_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (`barber_id`) REFERENCES `barbers`(`id`) ON DELETE CASCADE
);

-- --------------------------------------------------------

--
-- Estrutura da tabela `appointments`
-- Esta tabela armazena os agendamentos de cada barbeiro
--

CREATE TABLE `appointments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `barber_id` INT NOT NULL,
  `client_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  `date` DATE NOT NULL,
  `time` TIME NOT NULL,
  `status` ENUM('Agendado', 'Confirmado', 'Cancelado', 'Concluído') DEFAULT 'Agendado',
  FOREIGN KEY (`barber_id`) REFERENCES `barbers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE CASCADE
);

-- --------------------------------------------------------

--
-- Estrutura da tabela `expenses`
-- Esta tabela armazena as despesas de cada barbeiro
--

CREATE TABLE `expenses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `barber_id` INT NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `value` DECIMAL(10, 2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`barber_id`) REFERENCES `barbers`(`id`) ON DELETE CASCADE
);

-- --------------------------------------------------------

--
-- Estrutura da tabela `settings`
-- Esta tabela armazena as configurações de cada barbearia (logo, cores, etc.)
--

CREATE TABLE `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `barber_id` INT NOT NULL UNIQUE,
  `logo_url` VARCHAR(255),
  `background_image_url` VARCHAR(255),
  `available_time_slots` TEXT, -- JSON string
  FOREIGN KEY (`barber_id`) REFERENCES `barbers`(`id`) ON DELETE CASCADE
);

-- --------------------------------------------------------

--
-- Inserindo dados de exemplo para demonstração
--

-- Inserir um barbeiro de exemplo
INSERT INTO `barbers` (`id`, `name`, `email`, `password`, `phone`, `code`, `subscription_status`, `subscription_due_date`) VALUES
(1, 'Barber Shop A', 'admin@barber.com', '1234', '(11) 99999-9999', 'BARBER123', 'active', '2025-09-18');

-- Inserir clientes de exemplo
INSERT INTO `clients` (`id`, `name`, `email`, `password`, `phone`) VALUES
(1, 'Carlos Silva', 'cliente@email.com', '1234', '(11) 98765-4321'),
(2, 'João Pereira', 'joao@email.com', '1234', '(21) 99887-6543');

-- Inserir serviços para o barbeiro 1
INSERT INTO `services` (`id`, `barber_id`, `name`, `price`, `duration`, `image`) VALUES
(1, 1, 'Corte Social', 40.00, 30, 'https://placehold.co/300x300/64748B/ffffff?text=Corte'),
(2, 1, 'Barba Terapia', 35.00, 30, 'https://placehold.co/300x300/71717A/ffffff?text=Barba'),
(3, 1, 'Sobrancelha', 20.00, 15, 'https://placehold.co/300x300/475569/ffffff?text=Sobrancelha'),
(4, 1, 'Combo (Corte + Barba)', 70.00, 60, 'https://placehold.co/300x300/334155/ffffff?text=Combo');

-- Inserir planos para o barbeiro 1
INSERT INTO `plans` (`id`, `barber_id`, `name`, `description`, `price`) VALUES
(1, 1, 'Plano Fiel', '2 Cortes + 2 Barbas por mês.', 120.00),
(2, 1, 'Plano Completo', 'Tudo ilimitado (Corte, Barba, Sobrancelha).', 150.00);

-- Inserir agendamentos para o barbeiro 1
INSERT INTO `appointments` (`id`, `barber_id`, `client_id`, `service_id`, `date`, `time`, `status`) VALUES
(1, 1, 1, 4, '2025-08-19', '10:00:00', 'Confirmado'),
(2, 1, 2, 1, '2025-08-19', '14:30:00', 'Agendado');

-- Inserir despesas para o barbeiro 1
INSERT INTO `expenses` (`id`, `barber_id`, `description`, `value`) VALUES
(1, 1, 'Aluguel', 800.00),
(2, 1, 'Produtos (cera, etc)', 250.00);

-- Inserir configurações para o barbeiro 1
INSERT INTO `settings` (`id`, `barber_id`, `logo_url`, `background_image_url`, `available_time_slots`) VALUES
(1, 1, 'https://placehold.co/100x100/334155/FFFFFF?text=Logo', 'https://images.unsplash.com/photo-1622288432458-2d7c3a6e3e0d?q=80&w=1932&auto=format&fit=crop', '"09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"');
