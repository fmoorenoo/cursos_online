<?php
include 'conexion.php';

// Obtener todos los cursos de la base de datos
$stmt = $pdo->query("SELECT * FROM cursos");
$cursos = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($cursos);
?>