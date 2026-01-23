<?php
header('Content-Type: application/json');

require_once '..\conexion.php';

$data = json_decode(file_get_contents('php://input'), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (!$email || !$password) {
    echo json_encode([
        'success' => false,
        'message' => 'Datos incompletos'
    ]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT dni, nombre, email, hash_contrasena
    FROM usuarios
    WHERE email = ?
    LIMIT 1
");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['hash_contrasena'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Usuario o contraseña incorrectos'
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'user' => [
        'dni' => $user['dni'],
        'nombre' => $user['nombre'],
        'email' => $user['email']
    ]
]);
