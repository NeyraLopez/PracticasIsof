<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type");

include('../conexion.php'); // Archivo con la conexión a la BD

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    if (
        isset($data['id']) &&
        isset($data['nombreCarrera']) 
    ) {
        try {
            $stmt = $conn->prepare("UPDATE tblcarreras SET 
                nombreCarrera = ?
                WHERE id = ?");
            
            $stmt->bind_param("ss", 
                $data['nombreCarrera'],
                $data['id']
            );
            
            if ($stmt->execute()) {
                if ($stmt->affected_rows > 0) {
                    echo json_encode(array("mensaje" => "Carrera actualizada correctamente"));
                } else {
                    echo json_encode(array("error" => "No se realizaron cambios"));
                }
            } else {
                echo json_encode(array("error" => "Error al actualizar"));
            }
            
            $stmt->close();
        } catch(Exception $e) {
            echo json_encode(array("error" => "Error: " . $e->getMessage()));
        }
    } else {
        echo json_encode(array("error" => "Datos incompletos"));
    }
} else {
    echo json_encode(array("error" => "Método no permitido"));
}

$conn->close();
?>