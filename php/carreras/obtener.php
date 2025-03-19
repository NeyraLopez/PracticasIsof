<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include '../conexion.php';

// Obtener la matrícula de la petición GET
$id = $_GET['id'] ?? '';

if (empty($id)) {
    echo json_encode(["error" => "Id no proporcionada"]);
    exit;
}

//var_dump($id);

// Preparar la consulta SQL para obtener el alumno
$sql = "SELECT id, nombreCarrera FROM tblcarreras WHERE id = ?";

// Usar una declaración preparada
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die(json_encode(["error" => "Error en la consulta: " . $conn->error]));
}

$stmt->bind_param("s", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    header('Content-Type: application/json');
    echo json_encode($result->fetch_assoc());
} else {
    echo json_encode(["error" => "Dato no encontrado"]);
}

$stmt->close();
$conn->close();
?>