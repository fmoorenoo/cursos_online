-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-01-2026 a las 18:50:39
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
  `nivel` tinyint(4) NOT NULL COMMENT '1=facil, 2=intermedio, 3=dificil'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cursos`
--

INSERT INTO `cursos` (`id`, `nombre`, `descripcion`, `precio`, `disponible`, `duracion`, `imagen_url`, `creado_en`, `certificado`, `idioma`, `nivel`) VALUES
(1, 'Desarrollo Web Full Stack', 'Aprende a crear aplicaciones web completas desde el frontend hasta el backend.', 299.01, 1, 4800, 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop', '2026-01-22 20:17:47', 0, 'Español', 1),
(2, 'Machine Learning con Python', 'Domina los fundamentos del machine learning y crea modelos predictivos.', 349.00, 1, 3600, 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=400&fit=crop', '2026-01-22 20:17:47', 1, 'Inglés', 2),
(3, 'Diseño UI/UX Avanzado', 'Crea experiencias de usuario excepcionales.', 249.00, 0, 2400, 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop', '2026-01-22 20:17:47', 1, 'Español', 3),
(4, 'DevOps y CI/CD', 'Implementa pipelines de integración y despliegue continuo.', 399.00, 1, 4200, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=400&fit=crop', '2026-01-22 20:17:47', 0, 'Español', 1),
(5, 'Ciberseguridad para Desarrolladores', 'Protege tus aplicaciones de vulnerabilidades comunes.', 279.00, 1, 3000, 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=400&fit=crop', '2026-01-22 20:17:47', 1, 'Inglés', 2),
(6, 'React Native: Apps Móviles', 'Desarrolla aplicaciones móviles para iOS y Android con React Native.', 229.00, 1, 2800, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop', '2026-01-22 20:17:47', 1, 'Español', 3);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
