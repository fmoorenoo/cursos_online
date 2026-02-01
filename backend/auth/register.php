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
        'error' => 'missingData'
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
    // Comprobar si ya existe usuario por dni o email
    $check = $pdo->prepare(
        "SELECT dni, email FROM usuarios WHERE dni = :dni OR email = :email"
    );
    $check->execute([
        ':dni' => $dni,
        ':email' => $email
    ]);

    $existingUser = $check->fetch(PDO::FETCH_ASSOC);

    if ($existingUser) {
        if ($existingUser['dni'] === $dni) {
            echo json_encode([
                'success' => false,
                'error' => 'dniAlreadyExists'
            ]);
            exit;
        }

        if ($existingUser['email'] === $email) {
            echo json_encode([
                'success' => false,
                'error' => 'emailAlreadyExists'
            ]);
            exit;
        }

        echo json_encode([
            'success' => false,
            'error' => 'userAlreadyExists'
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
        'success' => true
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'serverError'
    ]);
}