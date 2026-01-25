-- Crear la base de datos y tablas
CREATE DATABASE IF NOT EXISTS tienda_cursos
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tienda_cursos;

-- Estructura de tabla para la tabla `cursos`
CREATE TABLE `cursos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `descripcion` text NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `disponible` tinyint(1) NOT NULL DEFAULT 1,
  `duracion` int(11) NOT NULL,
  `imagen_url` varchar(255) NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Datos para la tabla `cursos`
INSERT INTO `cursos` 
(`id`, `nombre`, `descripcion`, `precio`, `disponible`, `duracion`, `imagen_url`, `creado_en`) 
VALUES
(1, 'Desarrollo Web Full Stack', 'Aprende a crear aplicaciones web completas desde el frontend hasta el backend.', 299.01, 1, 4800, 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop', '2026-01-22 20:17:47'),
(2, 'Machine Learning con Python', 'Domina los fundamentos del machine learning y crea modelos predictivos.', 349.00, 1, 3600, 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=400&fit=crop', '2026-01-22 20:17:47'),
(3, 'Diseño UI/UX Avanzado', 'Crea experiencias de usuario excepcionales.', 249.00, 0, 2400, 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop', '2026-01-22 20:17:47'),
(4, 'DevOps y CI/CD', 'Implementa pipelines de integración y despliegue continuo.', 399.00, 1, 4200, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=400&fit=crop', '2026-01-22 20:17:47'),
(5, 'Ciberseguridad para Desarrolladores', 'Protege tus aplicaciones de vulnerabilidades comunes.', 279.00, 1, 3000, 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=400&fit=crop', '2026-01-22 20:17:47'),
(6, 'React Native: Apps Móviles', 'Desarrolla aplicaciones móviles para iOS y Android con React Native.', 229.00, 1, 2800, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop', '2026-01-22 20:17:47');



-- Estructura de tabla para la tabla `usuarios`
CREATE TABLE `usuarios` (
  `dni` varchar(9) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `iban` varchar(34) DEFAULT NULL,
  `telefono` varchar(15) NOT NULL,
  `hash_contrasena` varchar(255) NOT NULL,
  `creado_en` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Volcado de datos para la tabla `usuarios`
INSERT INTO `usuarios` 
(`dni`, `nombre`, `email`, `iban`, `telefono`, `hash_contrasena`, `creado_en`) 
VALUES
('11111111A', 'Usuario 1', 'usu1@email.com', 'ES7620770024003102575766', '600000001', '$2y$10$UvTyUkl8l75t5aCUViF7YO6o.18KNQf06OaF9/zGRh.4uRcvV.Z7K', '2026-01-23 16:22:58'),
('22222222B', 'Usuario 2', 'usu2@email.com', 'ES7620770024003102575767', '600000002', '$2y$10$ZD5M/BTSgSNr0NW63j.faOvHMuiSDfh6c4.4hzWmfX.HvMEHsx83m', '2026-01-23 16:22:58'),
('33333333C', 'Usuario 3', 'usu3@email.com', 'ES7620770024003102575768', '600000003', '$2y$10$tORUlP2PZ.XfYEz6hFFlTOjzVXrWZ.wKj22FkblMGi4qg9LEwCjga', '2026-01-23 16:22:58'),
('78764111J', 'FER', 'fer@gm.co', NULL, '767676767', '$2y$10$.ubBcgQLuEBkAfyg3ZlVKeHVa0HVAj8zy.9Xi/PjuY1qyxH97jy9W', '2026-01-25 12:41:40');


-- Indices de la tabla `cursos`
ALTER TABLE `cursos`
  ADD PRIMARY KEY (`id`);


-- Indices de la tabla `usuarios`
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`dni`),
  ADD UNIQUE KEY `email` (`email`);


-- AUTO_INCREMENT de la tabla `cursos`
ALTER TABLE `cursos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;