<?php
include 'conexion.php';

if (
    isset($_POST['id']) && isset($_POST['nombre']) &&
    isset($_POST['email']) && isset($_POST['iban']) &&
    isset($_POST['telefono']) && isset($_POST['contrasena'])
) {
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $email = $_POST['email'];
    $iban = $_POST['iban'];
    $telefono = $_POST['telefono'];

    $hash = password_hash($_POST['contrasena'], PASSWORD_DEFAULT);

    // Consulta para insertar un nuevo cliente, evitando inyecciones SQL
    $sql = "INSERT INTO clientes (id, nombre, email, iban, telefono, hash_contrasena, creado_en) 
    VALUES 
    (:id, :nombre, :email, :iban, :telefono, :hash, NOW())";

    // Preparar la consulta
    $stmt = $pdo->prepare($sql);

    // Vincular los parámetros
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':iban', $iban);
    $stmt->bindParam(':telefono', $telefono);
    $stmt->bindParam(':hash', $hash);


    if ($stmt->execute()) {
        echo json_encode(["estado" => "ok"]);
    } else {
        echo json_encode(["estado" => "error"]);
    }
}