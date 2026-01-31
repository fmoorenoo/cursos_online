<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../conexion.php';

$data = json_decode(file_get_contents('php://input'), true);

// Validación
if (
    empty($data['dni']) ||
    empty($data['nombre']) ||
    empty($data['email']) ||
    empty($data['telefono']) ||
    empty($data['iban']) ||
    empty($data['password'])
) {
    echo json_encode([
        'success' => false,
        'message' => 'Datos incompletos'
    ]);
    exit;
}

$dni = strtoupper(trim($data['dni']));
$nombre = trim($data['nombre']);
$email = strtolower(trim($data['email']));
$telefono = trim($data['telefono']);
$iban = strtoupper(trim($data['iban']));

// Encriptar contraseña
$hash = password_hash($data['password'], PASSWORD_DEFAULT);

try {
    // Comprobar si ya existe usuario por email o dni
    $check = $pdo->prepare(
        "SELECT dni FROM usuarios WHERE dni = :dni OR email = :email"
    );
    $check->execute([
        ':dni' => $dni,
        ':email' => $email
    ]);

    if ($check->fetch()) {
        echo json_encode([
            'success' => false,
            'message' => 'El usuario ya existe'
        ]);
        exit;
    }

    // Insertar usuario
    $stmt = $pdo->prepare("
        INSERT INTO usuarios
        (dni, nombre, email, iban, telefono, hash_contrasena, creado_en)
        VALUES
        (:dni, :nombre, :email, :iban, :telefono, :hash, NOW())
    ");

    $stmt->execute([
        ':dni' => $dni,
        ':nombre' => $nombre,
        ':email' => $email,
        ':iban' => $iban,
        ':telefono' => $telefono,
        ':hash' => $hash
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Registro correcto'
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}