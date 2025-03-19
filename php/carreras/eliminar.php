<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include('../conexion.php'); // Archivo con la conexión a la BD

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener matrícula desde la URL
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if ($id) {
        try {
            $stmt = $conn->prepare("DELETE FROM tblcarreras WHERE id = ?");
            $stmt->bind_param("s", $id);
            
            if ($stmt->execute()) {
                if ($stmt->affected_rows > 0) {
                    echo json_encode(array("mensaje" => "Carrera eliminada correctamente"));
                } else {
                    echo json_encode(array("error" => "No se encontró la carrera"));
                }
            } else {
                echo json_encode(array("error" => "Error al eliminar la carrera"));
            }
            
            $stmt->close();
        } catch(Exception $e) {
            echo json_encode(array("error" => "Error: " . $e->getMessage()));
        }
    } else {
        echo json_encode(array("error" => "id no proporcionado"));
    }
} else {
    echo json_encode(array("error" => "Método no permitido"));
}

$conn->close();
?>