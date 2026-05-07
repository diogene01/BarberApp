-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 07/05/2026 às 03:35
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `barber_app_db`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `barber_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `status` enum('Agendado','Cancelado','Concluido') DEFAULT 'Agendado'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `appointments`
--

INSERT INTO `appointments` (`id`, `barber_id`, `client_id`, `service_id`, `date`, `time`, `status`) VALUES
(54, 7, 20, 28, '2026-05-23', '09:00:00', 'Concluido'),
(58, 7, 19, 28, '2026-05-10', '15:30:00', 'Concluido'),
(68, 7, 20, 36, '2026-04-29', '09:00:00', 'Concluido'),
(74, 7, 21, 34, '2026-04-29', '17:00:00', 'Concluido'),
(75, 7, 21, 30, '2026-04-28', '09:00:00', 'Concluido'),
(77, 7, 19, 39, '2026-05-01', '09:00:00', 'Concluido'),
(78, 7, 19, 33, '2026-05-01', '16:45:00', 'Concluido'),
(83, 7, 19, 33, '2026-05-10', '14:00:00', 'Agendado');

-- --------------------------------------------------------

--
-- Estrutura para tabela `barbers`
--

CREATE TABLE `barbers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `code` varchar(50) NOT NULL,
  `subscription_status` enum('active','pending','inactive','canceled') DEFAULT 'pending',
  `subscription_due_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `barbers`
--

INSERT INTO `barbers` (`id`, `name`, `email`, `password`, `phone`, `code`, `subscription_status`, `subscription_due_date`, `created_at`) VALUES
(7, 'Studio Vinicius Ferreira', 'barber1@gmail.com', '$2b$10$Vp/lyQ0ADwi69C.k2EwF8u1TRwvUcLE3ea4atlwAHwIS6Y0f4Zo.i', '(84) 65161-5313', 'BARBER73010', 'pending', NULL, '2026-04-22 21:05:25'),
(8, 'barber2', 'barber2@gmail.com', '$2b$10$nv/WRP9U.hG.4qwyi0ArR.gueGx2aOyLvjo0e3SNGqRF5Ll08fTDi', '(85) 54198-6541', 'BARBER90730', 'pending', NULL, '2026-04-22 21:10:17'),
(9, 'barber3', 'barber3@gmail.com', '$2b$10$NgUQSc.7XzhMRTsxuxi2/Ovj1cc7b6/qK5XY5DuthTOg3HRh7j9ma', '(63) 45683-5416', 'BARBER77278', 'pending', NULL, '2026-04-22 21:11:54'),
(10, 'barber4', 'barber4@gmail.com', '$2b$10$LFYU0JdTTjpZk1aS6Yyk1e74iCdQgXav1WABVomNuYAjarBWn.0D6', '(68) 54865-2105', 'BARBER28441', 'pending', NULL, '2026-04-22 21:13:19');

-- --------------------------------------------------------

--
-- Estrutura para tabela `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `clients`
--

INSERT INTO `clients` (`id`, `name`, `email`, `password`, `phone`, `created_at`) VALUES
(19, 'client2', 'client2@gmail.com', '$2b$10$kfm5idrEK0lrg/xLYU7y/.UrT9E0vlu.cLJ6xd4.jM9OopnRkcgEm', '(65) 34516-0352', '2026-04-22 21:09:49'),
(20, 'client3', 'client3@gmail.com', '$2b$10$VooNBkqyTOY7Mwbq9xJgiuHvqynTBa3LnbyETybRqXE02KKOnt/hy', '(65) 41653-1203', '2026-04-22 21:11:04'),
(21, 'client4', 'client4@gmail.com', '$2b$10$M/raQWBPptFkkJK3hHL4G.jfEbhuiC0HOjPMVvuYYo6Xg9id941.i', '(98) 65416-0351', '2026-04-22 21:12:51');

-- --------------------------------------------------------

--
-- Estrutura para tabela `dashboard`
--

CREATE TABLE `dashboard` (
  `id` int(11) NOT NULL,
  `barber_id` int(11) NOT NULL,
  `services_provided` int(11) DEFAULT 0,
  `total_revenue` decimal(10,2) DEFAULT 0.00,
  `total_expenses` decimal(10,2) DEFAULT 0.00,
  `net_profit` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `expenses`
--

CREATE TABLE `expenses` (
  `id` int(11) NOT NULL,
  `barber_id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `expenses`
--

INSERT INTO `expenses` (`id`, `barber_id`, `description`, `value`, `created_at`) VALUES
(14, 7, 'celular', 70.00, '2026-04-29 23:45:55'),
(16, 7, 'Aluguel', 1500.00, '2026-05-05 21:00:44');

-- --------------------------------------------------------

--
-- Estrutura para tabela `plans`
--

CREATE TABLE `plans` (
  `id` int(11) NOT NULL,
  `barber_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `plans`
--

INSERT INTO `plans` (`id`, `barber_id`, `name`, `description`, `price`) VALUES
(19, 7, 'Plano1', 'Descrição do Plano 1', 400.00),
(20, 7, 'Plano10', 'Descrição do plano 10', 500.00),
(21, 7, 'Plano12', 'Descrição do Plano 12 com outras coisas que eu não sei, eu só to escrevendo o que me vem a mente para testar uma coisa na pagina de cliente.', 150.36),
(22, 7, 'Plano13', 'Descrição do plano 13, novamente escrevendo qualquer coisa para indicar que essa descrição é essa.', 299.99),
(23, 7, 'Plano14', 'Plano 14 e sua descrição estou escrevendo mais coisas para poder fazer mais testes mas não sei o que escrever ent lalalalal', 899.99),
(24, 7, 'Plano15', 'Descrição do Plano 15, e fazendo alguma coisa que eu não sei estou tentando tirar coisas da mente para escrever alguam coisa ', 100.36);

-- --------------------------------------------------------

--
-- Estrutura para tabela `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `barber_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `duration` int(11) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `services`
--

INSERT INTO `services` (`id`, `barber_id`, `name`, `price`, `duration`, `image_url`) VALUES
(28, 7, 'service1', 60.00, 50, 'https://voca-land.sgp1.cdn.digitaloceanspaces.com/0/1757666014775/67444df2.jpg'),
(30, 7, 'servico3', 50.00, 10, 'https://media.istockphoto.com/id/640274128/pt/foto/barber-using-scissors-and-comb.jpg?s=612x612&w=0&k=20&c=83Oj99wpKeTKoIOgRJgIOEzu46Ar6MlIvkZUmann6Dc='),
(33, 7, 'Service10', 80.00, 60, 'https://invexo.com.br/blog/wp-content/uploads/2021/06/Barbearia-Ipanema.jpg'),
(34, 7, 'Service11', 40.00, 50, 'https://negociosdebeleza.beautyfair.com.br/wp-content/uploads/2025/10/corte-de-cabelo-masculino-tape-fade.jpeg'),
(35, 7, 'Service15', 60.00, 74, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScGbl4zH3sbX65Q2_ERveA_qg1m6Na75tsIw&s'),
(36, 7, 'servico 16', 40.00, 30, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTSvhHksfl3a7nfwOSI2gTCxJLalgDhaxaJA&s'),
(37, 7, 'service17', 80.00, 60, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7h2c-cY7BTBwyT-ZxfRmGkXSZ2nAWA95q2Q&s'),
(38, 7, 'Service18', 59.90, 65, 'https://i0.wp.com/www.canalmasculino.com.br/wp-content/uploads/2017/05/cortes-cabelo-masculino-classicos-01-570x570.jpg?resize=570%2C570'),
(39, 7, 'servico19', 40.00, 50, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSawR0YHBy3WXwROpS_KdIAl6H99vEDzRJ8EA&s'),
(41, 7, 'Outra servico', 50.00, 50, '');

-- --------------------------------------------------------

--
-- Estrutura para tabela `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `barber_id` int(11) NOT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `background_image_url` varchar(255) DEFAULT NULL,
  `available_time_slots` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `settings`
--

INSERT INTO `settings` (`id`, `barber_id`, `logo_url`, `background_image_url`, `available_time_slots`) VALUES
(7, 7, 'https://www.shutterstock.com/image-vector/barbershop-logo-vector-design-cut-600nw-2646497735.jpg', 'https://www.joinblvd.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2F2ad6lzhcf1hi%2F2okm7fF8YjWa99x0J12npj%2F700e462c9bcee78f8e55b2a502c52399%2FBarbershop_A-Z_Blog_Refresh_-Hero_Image-.jpg&w=3840&q=85', '14:00,14:30,15:30,16:30,17:00,16:45'),
(8, 8, 'https://placehold.co/100x100/334155/FFFFFF?text=Logo', 'https://images.unsplash.com/photo-1622288432458-2d7c3a6e3e0d?q=80&w=1932&auto=format&fit=crop', '09:00,09:30,10:00,10:30,11:00,11:30,15:00,15:30'),
(9, 9, 'https://placehold.co/100x100/334155/FFFFFF?text=Logo', 'https://images.unsplash.com/photo-1622288432458-2d7c3a6e3e0d?q=80&w=1932&auto=format&fit=crop', '09:00,09:30,10:00,10:30,11:00,11:30,14:00,14:30,15:00,15:30,16:00,16:30,17:00'),
(10, 10, 'https://placehold.co/100x100/334155/FFFFFF?text=Logo', 'https://images.unsplash.com/photo-1622288432458-2d7c3a6e3e0d?q=80&w=1932&auto=format&fit=crop', '09:00,09:30,10:00,10:30,11:00,11:30,14:00,14:30,15:00,15:30,16:00,16:30,17:00');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `barber_id` (`barber_id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Índices de tabela `barbers`
--
ALTER TABLE `barbers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Índices de tabela `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Índices de tabela `dashboard`
--
ALTER TABLE `dashboard`
  ADD PRIMARY KEY (`id`),
  ADD KEY `barber_id` (`barber_id`);

--
-- Índices de tabela `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `barber_id` (`barber_id`);

--
-- Índices de tabela `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `barber_id` (`barber_id`);

--
-- Índices de tabela `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `barber_id` (`barber_id`);

--
-- Índices de tabela `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `barber_id` (`barber_id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT de tabela `barbers`
--
ALTER TABLE `barbers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de tabela `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de tabela `dashboard`
--
ALTER TABLE `dashboard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de tabela `plans`
--
ALTER TABLE `plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de tabela `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de tabela `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointments_ibfk_3` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `dashboard`
--
ALTER TABLE `dashboard`
  ADD CONSTRAINT `dashboard_ibfk_1` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `plans`
--
ALTER TABLE `plans`
  ADD CONSTRAINT `plans_ibfk_1` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_ibfk_1` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `settings_ibfk_1` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
