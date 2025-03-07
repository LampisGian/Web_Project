-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 20, 2024 at 06:09 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `syntaxis`
--

-- --------------------------------------------------------

--
-- Table structure for table `cancellation`
--

CREATE TABLE `cancellation` (
  `thesis_id` int(11) NOT NULL,
  `cancel_date` year(4) NOT NULL,
  `reason` varchar(100) NOT NULL,
  `cancelled_by` int(11) NOT NULL,
  `assembly_number` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `note_id` int(11) NOT NULL,
  `thesis_id` int(11) NOT NULL,
  `tutor_id` int(11) NOT NULL,
  `content` varchar(300) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `presentations`
--

CREATE TABLE `presentations` (
  `presentation_id` int(11) NOT NULL,
  `thesis_id` int(11) NOT NULL,
  `presentation_date` datetime DEFAULT NULL,
  `announcement_text` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `presentations`
--

INSERT INTO `presentations` (`presentation_id`, `thesis_id`, `presentation_date`, `announcement_text`, `created_at`, `updated_at`) VALUES
(12, 3, '2024-11-21 12:00:00', 'The thesis Exploring Neural Networks for Image Classification will be presented at 21/11 by student Alexandros Papadopoulos with AM:1001', '2024-11-20 16:25:58', '2024-11-20 16:51:12');

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `thesis_id` int(11) NOT NULL,
  `supervisor_grade` decimal(10,2) NOT NULL,
  `co_supervisor1_grade` decimal(10,2) NOT NULL,
  `co_supervisor2_grade` decimal(10,2) NOT NULL,
  `library_link` text DEFAULT NULL,
  `detailed_grade1` varchar(20) DEFAULT NULL,
  `detailed_grade2` varchar(20) DEFAULT NULL,
  `detailed_grade3` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`thesis_id`, `supervisor_grade`, `co_supervisor1_grade`, `co_supervisor2_grade`, `library_link`, `detailed_grade1`, `detailed_grade2`, `detailed_grade3`) VALUES
(3, 9.00, 9.50, 9.00, 'https://nemertes.gr/syw4242', '9,9,9,9', '9.5,9.5,9.5,9.5', '9,9,9,9');

-- --------------------------------------------------------

--
-- Table structure for table `secretariat`
--

CREATE TABLE `secretariat` (
  `action_id` int(11) NOT NULL,
  `thesis_id` int(11) NOT NULL,
  `secretariat_id` int(11) NOT NULL,
  `action_type` enum('assign','cancel','complete') NOT NULL,
  `action_description` text DEFAULT NULL,
  `action_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `AM` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `department` enum('Department of Fisheries & Aquaculture','Department of Food Science & Technology','Department of Agriculture','Department of Sustainable Agriculture','Department of Business Administration','Department of Economics','Department of Management Science and Technology','Department of Tourism Management','Department of Architecture','Department of Chemical Engineering','Department of Civil Engineering','Department of Computer Engineering and Informatics','Department of Electrical Engineering and Computer Technology','Department of Mechanical Engineering and Aeronautics','Department of Nursing','Department of Physiotherapy','Department of Speech & Language Therapy','Department of Medicine','Department of Pharmacy','Department of Educational Sciences and Early Childhood Education','Department of Education and Social Work','Department of History and Archaeology','Department of Philology','Department of Philosophy','Department of Theatre Studies','Department of Biology','Department of Chemistry','Department of Geology','Department of Materials Science','Department of Mathematics','Department of Physics') NOT NULL,
  `name` varchar(100) NOT NULL,
  `surname` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`AM`, `user_id`, `department`, `name`, `surname`) VALUES
(1001, 3, 'Department of Computer Engineering and Informatics', 'Alexandros', 'Papadopoulos'),
(1002, 4, 'Department of Economics', 'Maria', 'Nikolaou'),
(1003, 5, 'Department of Architecture', 'Dimitris ', 'Kotsis'),
(1004, 6, 'Department of Medicine', 'Eleni', 'Papageorgiou'),
(1005, 12, 'Department of Computer Engineering and Informatics', 'Alex', 'Georgiou'),
(1006, 13, 'Department of Computer Engineering and Informatics', 'Georgia', 'Poluzou'),
(1007, 14, 'Department of Computer Engineering and Informatics', 'Konstantinos', 'Stamatiou');

-- --------------------------------------------------------

--
-- Table structure for table `theses`
--

CREATE TABLE `theses` (
  `thesis_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `abstract` varchar(255) DEFAULT NULL,
  `pdf_attachment` varchar(255) DEFAULT NULL,
  `evaluation_report` varchar(255) DEFAULT NULL,
  `status` enum('in progress','under review','under assignment','completed') DEFAULT 'in progress',
  `student_id` int(11) DEFAULT NULL,
  `supervisor_id` int(11) DEFAULT NULL,
  `co_supervisor1_id` int(11) DEFAULT NULL,
  `co_supervisor2_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `assigned_at` datetime DEFAULT NULL,
  `link` text DEFAULT NULL,
  `venue` varchar(50) DEFAULT NULL,
  `draft_file` varchar(255) DEFAULT NULL,
  `external_link` text DEFAULT NULL,
  `notes` varchar(300) DEFAULT NULL,
  `presentation_date` datetime DEFAULT NULL,
  `protocol_number` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `theses`
--

INSERT INTO `theses` (`thesis_id`, `title`, `abstract`, `pdf_attachment`, `evaluation_report`, `status`, `student_id`, `supervisor_id`, `co_supervisor1_id`, `co_supervisor2_id`, `created_at`, `updated_at`, `assigned_at`, `link`, `venue`, `draft_file`, `external_link`, `notes`, `presentation_date`, `protocol_number`) VALUES
(3, 'Exploring Neural Networks for Image Classification', 'An in-depth study on the use of neural networks in classifying images across various datasets, focusing on accuracy and computational efficiency.', 'attachments/neural_networks.pdf', 'reports/Thesis_3_Report.pdf', 'under review', 1001, 2, 7, 8, '2024-03-31 21:29:35', '2024-11-20 15:46:23', '2024-04-02 00:29:35', 'https://zoom.gr/wx923', 'E2', 'drafts/Ergastiriaki_Askisi_24-25-1.0.pdf', 'https://workspace.google.com/', NULL, NULL, 'AP2024CEID'),
(4, 'Implementing Reinforcement Learning in Game Theory', 'This thesis explores reinforcement learning algorithms applied to game environments to create adaptive, intelligent behaviors in game agents.', 'attachments/reinforcement_learning_game_ai.pdf', NULL, 'under assignment', NULL, 2, NULL, NULL, '2024-11-07 22:29:35', '2024-11-20 14:11:12', '0000-00-00 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 'Natural Language Processing for Sentiment Analysis', 'A comprehensive exploration of NLP techniques to perform sentiment analysis on social media data, examining user sentiment trends.', 'attachments/nlp_sentiment_analysis.pdf', NULL, 'under assignment', NULL, NULL, NULL, NULL, '2024-11-07 22:29:35', '2024-11-20 00:15:26', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 'Building a Scalable Web Application with Docker and K8s', 'This thesis investigates best practices for deploying scalable web applications using Docker containers and cloud infrastructure.', 'attachments/docker_cloud_scalability.pdf', NULL, 'under assignment', NULL, 8, NULL, NULL, '2024-11-16 22:29:35', '2024-11-19 22:46:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 'Advancements in Large Language Models (LLMs) and Their Applications', 'An analysis of recent advancements in large language models, focusing on their applications in text generation, translation, and summarization.', 'attachments/llms_applications.pdf', NULL, 'under assignment', NULL, NULL, NULL, NULL, '2024-11-07 22:29:35', '2024-11-20 00:15:28', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(17, 'An explainable AI framework for evaluating malicious acts in 5G networks', '....', '', NULL, 'in progress', 1002, 2, 7, 19, '2024-11-10 11:27:10', '2024-11-20 15:12:38', '2024-11-20 16:10:36', NULL, NULL, NULL, NULL, 'Student assigned at 20/11. Starting to research related work', NULL, NULL),
(49, 'test thesis', 'lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum', 'attachments/diplomatiki_ergasia_tmiyp_0.pdf', NULL, 'in progress', 1007, 17, 19, 18, '2024-11-20 00:47:01', '2024-11-20 15:12:32', NULL, NULL, NULL, NULL, 'httops://google.gr', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `thesis_selections`
--

CREATE TABLE `thesis_selections` (
  `id` int(11) NOT NULL,
  `student_AM` int(11) NOT NULL,
  `thesis_id` int(11) NOT NULL,
  `supervisor_id` int(11) DEFAULT NULL,
  `co_supervisor1_id` int(11) DEFAULT NULL,
  `co_supervisor2_id` int(11) DEFAULT NULL,
  `supervisor_accepted` tinyint(1) DEFAULT 0,
  `co_supervisor1_accepted` tinyint(1) DEFAULT 0,
  `co_supervisor2_accepted` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `thesis_selections`
--

INSERT INTO `thesis_selections` (`id`, `student_AM`, `thesis_id`, `supervisor_id`, `co_supervisor1_id`, `co_supervisor2_id`, `supervisor_accepted`, `co_supervisor1_accepted`, `co_supervisor2_accepted`, `created_at`, `updated_at`) VALUES
(1, 1001, 3, 2, 7, 1, 1, 1, 1, '2024-11-09 00:02:27', '2024-11-11 00:36:13'),
(5, 1002, 17, 2, 7, 19, 1, 1, 1, '2024-11-12 00:39:33', '2024-11-20 14:10:07'),
(10, 1004, 42, 7, 2, 8, 1, 0, 0, '2024-11-15 00:24:57', '2024-11-15 01:06:05'),
(13, 1003, 44, 8, NULL, NULL, 1, 0, 0, '2024-11-18 03:17:05', '2024-11-18 03:17:05'),
(23, 1007, 49, 17, 19, 18, 1, 1, 1, '2024-11-20 00:54:04', '2024-11-20 01:12:02');

-- --------------------------------------------------------

--
-- Table structure for table `tutors`
--

CREATE TABLE `tutors` (
  `tutor_id` int(11) NOT NULL,
  `department` enum('Department of Fisheries & Aquaculture','Department of Food Science & Technology','Department of Agriculture','Department of Sustainable Agriculture','Department of Business Administration','Department of Economics','Department of Management Science and Technology','Department of Tourism Management','Department of Architecture','Department of Chemical Engineering','Department of Civil Engineering','Department of Computer Engineering and Informatics','Department of Electrical Engineering and Computer Technology','Department of Mechanical Engineering and Aeronautics','Department of Nursing','Department of Physiotherapy','Department of Speech & Language Therapy','Department of Medicine','Department of Pharmacy','Department of Educational Sciences and Early Childhood Education','Department of Education and Social Work','Department of History and Archaeology','Department of Philology','Department of Philosophy','Department of Theatre Studies','Department of Biology','Department of Chemistry','Department of Geology','Department of Materials Science','Department of Mathematics','Department of Physics') DEFAULT NULL,
  `specialization` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tutors`
--

INSERT INTO `tutors` (`tutor_id`, `department`, `specialization`) VALUES
(2, 'Department of Computer Engineering and Informatics', 'AI'),
(7, 'Department of Computer Engineering and Informatics', 'Networks and optimization'),
(8, 'Department of Computer Engineering and Informatics', 'Neural networks and pattern recognition'),
(17, 'Department of Computer Engineering and Informatics', 'network centric systems'),
(18, 'Department of Computer Engineering and Informatics', 'network centric systems'),
(19, 'Department of Management Science and Technology', 'Business Informatics');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `password` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` enum('student','tutor','secretariat') NOT NULL,
  `name` varchar(100) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `address` varchar(100) DEFAULT NULL,
  `mobile` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`password`, `user_id`, `role`, `name`, `surname`, `email`, `phone`, `created_at`, `address`, `mobile`) VALUES
('sec_hash1', 1, 'secretariat', 'sec', 'ceid', 'pregrad@ceid.upatras.gr', '261099999', '2024-11-07 15:23:00', 'Kanellopou, Patras', NULL),
('ceideinosauros', 2, 'tutor', 'Ioannis', 'Dein', 'tutor1@ceid.upatras.gr', '0987654321', '2024-11-07 16:52:27', 'CEID γραφείο Α27', NULL),
('password_hash1', 3, 'student', 'Alexandros', 'Papadopoulos', 'alexandros.papadopoulos@ceid.com', '2610111111', '2024-11-07 21:55:48', 'Kanellopou, Patras', 2147483647),
('password_hash2', 4, 'student', 'Maria', 'Nikolaou', 'maria.nikolaou@example.com', '0987654321', '2024-11-07 21:55:48', NULL, NULL),
('password_hash3', 5, 'student', 'Dimitris', 'Kotsis', 'dimitris.kotsis@example.com', '1122334455', '2024-11-07 21:55:48', NULL, NULL),
('password_hash4', 6, 'student', 'Eleni', 'Papageorgiou', 'eleni.papageorgiou@example.com', '2233445566', '2024-11-07 21:55:48', NULL, NULL),
('password_hash5', 7, 'tutor', 'John', 'Koutsios', 'ioannis.koutsiou@example.com', '3344556677', '2024-11-07 21:55:48', NULL, NULL),
('password_hash6', 8, 'tutor', 'Andreas', 'Komninos', 'akomninosa@ceid.upatras.gr', '2610996915', '2024-11-15 00:31:21', 'CEID γραφειο Β25', 2147483647),
('sec_pass2', 9, 'secretariat', 'Eleni', 'Papadopoulou', 'secretary1@ceid.upatras.gr', '2610223344', '2024-11-17 23:33:18', 'Patra, Ellada', 0),
('sec_pass3', 10, 'secretariat', 'Nikos', 'Konstantinou', 'secretary2@ceid.upatras.gr', '2610556677', '2024-11-17 23:33:18', 'Patra, Ellada', 0),
('sec_pass3', 11, 'secretariat', 'Andreas', 'Mavropoulos', 'secretary3@ceid.upatras.gr', '2610998844', '2024-11-17 23:33:18', 'Patra, Ellada', 0),
('stud_pass1', 12, 'student', 'Alex', 'Georgiou', 'alex.georgiou@ceid.upatras.gr', '6981122233', '2024-11-17 23:33:18', 'Athens, Greece', 2147483647),
('stud_pass2', 13, 'student', 'Georgia', 'Poluz', 'geop@ceid.upatras.gr', '6984455667', '2024-11-17 23:33:18', 'Patra, Ellada', 0),
('stud_pass3', 14, 'student', 'Konstantinos', 'Stamatiou', 'konstantinos.stam@ceid.upatras.gr', '6987788990', '2024-11-17 23:33:18', 'Thessaloniki, Ellada', 0),
('stud_pass4', 15, 'student', 'Eirini', 'Karagianni', 'eirini.karagianni@ceid.upatras.gr', '6971234567', '2024-11-17 23:33:18', 'Patra, Ellada', 0),
('stud_pass5', 16, 'student', 'Giorgos', 'Papakostas', 'george.papakostas@ceid.upatras.gr', '6955544332', '2024-11-17 23:33:18', 'Patra, Ellada', 0),
('tutor_pass17', 17, 'tutor', 'Ioannis', 'Kostopoulos', 'ioannis.kostopoulos@ceid.upatras.gr', '2610997788', '2024-11-17 23:42:07', 'Patra, Ellada', 2147483647),
('tutor_pass22', 18, 'tutor', 'Maria', 'Xenou', 'maria.xenou@ceid.upatras.gr', '6949876543', '2024-11-17 23:42:07', 'Patra, Ellada', 2147483647),
('tutor_pass33', 19, 'tutor', 'Nikolaos', 'Lykos', 'nikos.lykos@ceid.upatras.gr', '6923456789', '2024-11-17 23:42:07', 'Patra, Ellada', 2147483647);

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `on_tutor_insert` AFTER INSERT ON `users` FOR EACH ROW BEGIN
    IF NEW.role = 'tutor' THEN INSERT INTO tutors
        VALUES (NEW.user_id,NULL, NULL);
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_students_on_user_change` BEFORE UPDATE ON `users` FOR EACH ROW BEGIN
    IF NEW.name != OLD.name OR NEW.surname != OLD.surname THEN
        UPDATE students
        SET name = NEW.name, surname = NEW.surname
        WHERE user_id = NEW.user_id;
    END IF;
END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cancellation`
--
ALTER TABLE `cancellation`
  ADD KEY `thesis_id` (`thesis_id`),
  ADD KEY `cancelled_by` (`cancelled_by`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`note_id`),
  ADD KEY `thesis_id` (`thesis_id`),
  ADD KEY `tutor_id` (`tutor_id`);

--
-- Indexes for table `presentations`
--
ALTER TABLE `presentations`
  ADD PRIMARY KEY (`presentation_id`),
  ADD UNIQUE KEY `thesis_id_2` (`thesis_id`),
  ADD KEY `thesis_id` (`thesis_id`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD KEY `thesis_id` (`thesis_id`);

--
-- Indexes for table `secretariat`
--
ALTER TABLE `secretariat`
  ADD PRIMARY KEY (`action_id`),
  ADD KEY `thesis_id` (`thesis_id`),
  ADD KEY `secretariat_id` (`secretariat_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`AM`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `theses`
--
ALTER TABLE `theses`
  ADD PRIMARY KEY (`thesis_id`),
  ADD KEY `co_supervisor2_id` (`co_supervisor2_id`),
  ADD KEY `theses_ibfk_1` (`student_id`),
  ADD KEY `theses_ibfk_3` (`co_supervisor1_id`),
  ADD KEY `theses_ibfk_2` (`supervisor_id`);

--
-- Indexes for table `thesis_selections`
--
ALTER TABLE `thesis_selections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_AM` (`student_AM`,`thesis_id`);

--
-- Indexes for table `tutors`
--
ALTER TABLE `tutors`
  ADD PRIMARY KEY (`tutor_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `note_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `presentations`
--
ALTER TABLE `presentations`
  MODIFY `presentation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `secretariat`
--
ALTER TABLE `secretariat`
  MODIFY `action_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `theses`
--
ALTER TABLE `theses`
  MODIFY `thesis_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `thesis_selections`
--
ALTER TABLE `thesis_selections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cancellation`
--
ALTER TABLE `cancellation`
  ADD CONSTRAINT `cancellation_ibfk_1` FOREIGN KEY (`thesis_id`) REFERENCES `theses` (`thesis_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cancellation_ibfk_2` FOREIGN KEY (`cancelled_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`thesis_id`) REFERENCES `theses` (`thesis_id`) ON DELETE CASCADE;

--
-- Constraints for table `presentations`
--
ALTER TABLE `presentations`
  ADD CONSTRAINT `presentations_ibfk_1` FOREIGN KEY (`thesis_id`) REFERENCES `theses` (`thesis_id`) ON DELETE CASCADE;

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`thesis_id`) REFERENCES `theses` (`thesis_id`) ON UPDATE CASCADE;

--
-- Constraints for table `secretariat`
--
ALTER TABLE `secretariat`
  ADD CONSTRAINT `secretariat_ibfk_1` FOREIGN KEY (`thesis_id`) REFERENCES `theses` (`thesis_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `secretariat_ibfk_2` FOREIGN KEY (`secretariat_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `theses`
--
ALTER TABLE `theses`
  ADD CONSTRAINT `theses_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`AM`) ON UPDATE CASCADE;

--
-- Constraints for table `tutors`
--
ALTER TABLE `tutors`
  ADD CONSTRAINT `tutors_ibfk_1` FOREIGN KEY (`tutor_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
