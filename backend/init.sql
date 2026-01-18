-- Crear la base de datos y tablas
CREATE DATABASE IF NOT EXISTS tienda_cursos
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tienda_cursos;

-- Tabla 1: Cursos
CREATE TABLE IF NOT EXISTS cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  imagen_url VARCHAR(255) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla 2: clientes
CREATE TABLE IF NOT EXISTS clientes (
  id VARCHAR(20) PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  iban VARCHAR(34) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  hash_contrasena VARCHAR(255) NOT NULL,
  creado_en DATETIME NOT NULL
);

-- Cursos de ejemplo
INSERT INTO cursos (nombre, descripcion, precio, imagen_url)
VALUES
('Curso Vue 3 desde cero',
 'Aprende Vue 3 con Composition API, componentes, rutas y estado.',
 39.99, ''),

('Linux para administradores de sistemas',
 'Comandos esenciales, permisos, servicios, logs y automatización.',
 49.00, ''),

('Python práctico',
 'Scripts reales: ficheros, APIs, automatización y datos.',
 29.50, ''),

('SQL y MySQL',
 'Consultas, joins, índices y diseño de tablas.',
 34.90, ''),

('Ciberseguridad básica',
 'Buenas prácticas, phishing, contraseñas, redes y hardening.',
 45.00, '');