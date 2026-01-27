<?php

$env_path = __DIR__ . '/../.env';
if (!file_exists($env_path)) {
    die("El archivo .env no existe.");
}

$lines = file($env_path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

foreach ($lines as $line) {
    if (str_starts_with(trim($line), '#')) {
        continue;
    }

    [$key, $value] = explode('=', $line, 2);
    $_ENV[trim($key)] = trim($value);
}

$host = $_ENV['DB_HOST'] ?? 'localhost';
$db   = $_ENV['DB_NAME'];
$user = $_ENV['DB_USER'];
$pass = $_ENV['DB_PASS'];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass,
    [ PDO::ATTR_ERRMODE   => PDO::ERRMODE_EXCEPTION ]);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);  
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión a la base de datos: ' . $e->getMessage()]);
    exit;
}
?>