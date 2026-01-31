-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 31-01-2026 a las 15:59:52
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tienda_cursos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos`
--

CREATE TABLE `cursos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `descripcion` text NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `disponible` tinyint(1) NOT NULL DEFAULT 1,
  `duracion` int(11) NOT NULL,
  `imagen_url` varchar(255) NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `certificado` tinyint(1) NOT NULL DEFAULT 0,
  `idioma` varchar(50) NOT NULL DEFAULT 'Español',
  `nivel` tinyint(4) NOT NULL COMMENT '1=facil, 2=intermedio, 3=dificil',
  `tipo` int(11) NOT NULL DEFAULT 1 COMMENT '1=Tecnología, 2=Diseño & Creatividad, 3=Negocio & Marketing, 4=Educación & Formación, 5=Idiomas & Comunicación'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cursos`
--

INSERT INTO `cursos` (`id`, `nombre`, `descripcion`, `precio`, `disponible`, `duracion`, `imagen_url`, `creado_en`, `certificado`, `idioma`, `nivel`, `tipo`) VALUES
(1, 'Desarrollo Web Full Stack', 'Aprende a crear aplicaciones web completas desde el frontend hasta el backend.', 299.01, 1, 4800, 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop', '2026-01-22 20:17:47', 0, 'Español', 1, 1),
(2, 'Machine Learning con Python', 'Domina los fundamentos del machine learning y crea modelos predictivos.', 49.99, 1, 3600, 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=400&fit=crop', '2026-01-22 20:17:47', 1, 'Inglés', 2, 1),
(3, 'Diseño UI/UX Avanzado', 'Crea experiencias de usuario excepcionales.', 249.00, 0, 2400, 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop', '2026-01-22 20:17:47', 1, 'Español', 3, 2),
(4, 'DevOps y CI/CD', 'Implementa pipelines de integración y despliegue continuo.', 399.00, 1, 4200, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=400&fit=crop', '2026-01-22 20:17:47', 0, 'Español', 1, 1),
(5, 'Ciberseguridad para Desarrolladores', 'Protege tus aplicaciones de vulnerabilidades comunes.', 279.00, 1, 3000, 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=400&fit=crop', '2026-01-22 20:17:47', 1, 'Inglés', 2, 1),
(6, 'React Native: Apps Móviles', 'Desarrolla aplicaciones móviles para iOS y Android con React Native.', 229.00, 1, 2800, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop', '2026-01-22 20:17:47', 1, 'Español', 3, 1),
(7, 'Diseño Gráfico Profesional', 'Aprende diseño gráfico desde cero utilizando herramientas profesionales y principios visuales.', 199.00, 1, 2600, 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop', '2026-01-30 18:33:48', 1, 'Español', 1, 2),
(8, 'UX Research y Prototipado', 'Investiga, diseña y valida productos digitales centrados en el usuario.', 279.00, 1, 3000, 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400&h=400&fit=crop', '2026-01-30 18:33:48', 1, 'Inglés', 2, 2),
(9, 'Marketing Digital Estratégico', 'Domina SEO, SEM y redes sociales para hacer crecer proyectos digitales.', 219.00, 1, 2400, 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=400&h=400&fit=crop', '2026-01-30 18:33:48', 1, 'Español', 1, 3),
(10, 'Gestión de Proyectos con Agile', 'Aprende a gestionar proyectos utilizando metodologías ágiles como Scrum y Kanban.', 149.99, 1, 2800, 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=400&fit=crop', '2026-01-30 18:33:48', 1, 'Inglés', 2, 3),
(11, 'Competencia Digital Docente', 'Desarrolla habilidades digitales para la enseñanza moderna.', 189.00, 1, 2200, 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400&h=400&fit=crop', '2026-01-30 18:33:48', 0, 'Español', 1, 4),
(12, 'Metodologías Activas en el Aula', 'Aplica metodologías innovadoras como ABP y flipped classroom.', 229.00, 1, 2600, 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&h=400&fit=crop', '2026-01-30 18:33:48', 1, 'Español', 2, 4),
(13, 'Inglés Técnico para Profesionales', 'Mejora tu inglés enfocado al entorno laboral y tecnológico.', 109.00, 1, 2400, 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&h=400&fit=crop', '2026-01-30 18:33:48', 1, 'Inglés', 2, 5),
(14, 'Comunicación Efectiva y Presentaciones', 'Aprende a comunicar ideas con claridad y seguridad en público.', 179.00, 1, 2000, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop', '2026-01-30 18:33:48', 0, 'Español', 1, 5),
(15, 'Introducción a Git y GitHub', 'Aprende a controlar versiones de tus proyectos y a trabajar de forma colaborativa con Git y GitHub.', 79.00, 1, 1200, 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=400&fit=crop', '2026-01-31 12:58:39', 1, 'Español', 1, 1),
(16, 'Fundamentos de Programación en JavaScript', 'Da tus primeros pasos en programación aprendiendo JavaScript desde cero con ejemplos prácticos.', 99.00, 1, 1800, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop', '2026-01-31 12:58:39', 1, 'Español', 1, 1),
(17, 'APIs REST con Node.js', 'Diseña y desarrolla APIs REST profesionales usando Node.js y Express.', 189.00, 1, 2600, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop', '2026-01-31 12:58:39', 1, 'Inglés', 2, 1),
(18, 'Canva para Diseño Rápido', 'Crea diseños atractivos para redes sociales, presentaciones y marketing usando Canva.', 59.00, 1, 900, 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?w=400&h=400&fit=crop', '2026-01-31 12:58:39', 1, 'Español', 1, 2),
(19, 'Principios de Diseño Visual', 'Aprende los fundamentos del diseño visual: color, tipografía, composición y jerarquía.', 89.00, 1, 1500, 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&h=400&fit=crop', '2026-01-31 12:58:39', 1, 'Español', 1, 2),
(20, 'Figma para Interfaces Digitales', 'Diseña interfaces modernas y prototipos interactivos con Figma.', 149.00, 1, 2200, 'https://images.unsplash.com/photo-1581291519195-ef11498d1cf5?w=400&h=400&fit=crop', '2026-01-31 12:58:39', 1, 'Inglés', 2, 2),
(21, 'Introducción al Marketing Digital', 'Conoce los conceptos clave del marketing digital y cómo aplicarlos a proyectos reales.', 79.00, 1, 1400, 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=400&h=400&fit=crop', '2026-01-31 12:58:39', 1, 'Español', 1, 3),
(22, 'Copywriting para Redes Sociales', 'Aprende a escribir textos persuasivos para Instagram, Facebook y otras redes.', 69.00, 1, 1200, 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=400&h=400&fit=crop', '2026-01-31 12:58:39', 1, 'Español', 1, 3),
(23, 'Email Marketing Profesional', 'Crea campañas de email efectivas que conviertan y fidelicen clientes.', 129.00, 1, 2000, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop', '2026-01-31 12:58:39', 1, 'Inglés', 2, 3),
(24, 'Introducción a la Educación Digital', 'Descubre herramientas y enfoques para enseñar en entornos digitales.', 59.00, 1, 1000, 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=400&fit=crop', '2026-01-31 12:58:39', 0, 'Español', 1, 4),
(25, 'Evaluación por Competencias', 'Aprende a evaluar el aprendizaje por competencias de forma práctica y efectiva.', 99.00, 1, 1600, 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=400&fit=crop', '2026-01-31 12:58:39', 1, 'Español', 2, 4),
(26, 'Gamificación en el Aula', 'Motiva al alumnado aplicando técnicas de gamificación en contextos educativos.', 139.00, 1, 2200, 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=400&h=400&fit=crop', '2026-01-31 12:58:39', 1, 'Inglés', 2, 4),
(27, 'Inglés Básico para Viajar', 'Aprende frases y vocabulario esencial para comunicarte en tus viajes.', 49.00, 1, 800, 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop', '2026-01-31 12:58:39', 0, 'Inglés', 1, 5),
(28, 'Español para Extranjeros (A1)', 'Curso introductorio de español para principiantes absolutos.', 89.00, 1, 1600, 'https://images.unsplash.com/photo-1503676382389-4809596d5290?w=400&h=400&fit=crop', '2026-01-31 12:58:39', 1, 'Español', 1, 5),
(29, 'Inglés Conversacional Intermedio', 'Mejora tu fluidez y confianza al hablar inglés en situaciones cotidianas.', 159.00, 1, 2400, 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=400&fit=crop', '2026-01-31 12:58:39', 1, 'Inglés', 2, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `dni` varchar(9) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `iban` varchar(34) DEFAULT NULL,
  `telefono` varchar(15) NOT NULL,
  `hash_contrasena` varchar(255) NOT NULL,
  `creado_en` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`dni`, `nombre`, `email`, `iban`, `telefono`, `hash_contrasena`, `creado_en`) VALUES
('11111111A', 'Usuario 1', 'usu1@email.com', 'ES7620770024003102575766', '600000001', '$2y$10$UvTyUkl8l75t5aCUViF7YO6o.18KNQf06OaF9/zGRh.4uRcvV.Z7K', '2026-01-23 16:22:58'),
('22222222B', 'Usuario 2', 'usu2@email.com', 'ES7620770024003102575767', '600000002', '$2y$10$ZD5M/BTSgSNr0NW63j.faOvHMuiSDfh6c4.4hzWmfX.HvMEHsx83m', '2026-01-23 16:22:58'),
('33333333C', 'Usuario 3', 'usu3@email.com', 'ES7620770024003102575768', '600000003', '$2y$10$tORUlP2PZ.XfYEz6hFFlTOjzVXrWZ.wKj22FkblMGi4qg9LEwCjga', '2026-01-23 16:22:58'),
('78764111J', 'Fernando Montelongo Moreno', 'fer@gm.co', NULL, '767676767', '$2y$10$.ubBcgQLuEBkAfyg3ZlVKeHVa0HVAj8zy.9Xi/PjuY1qyxH97jy9W', '2026-01-25 12:41:40'),
('78820606C', 'Iriem', 'iriemdaluz22@gmail.com', NULL, '611486207', '$2y$10$lhrF6wZt0ale7XqP6zKTruEwaeg71b5TYbrvWKYoNAQ3UHwNT6m42', '2026-01-28 15:41:28');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`dni`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cursos`
--
ALTER TABLE `cursos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
