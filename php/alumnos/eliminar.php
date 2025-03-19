<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include('conexion.php'); // Archivo con la conexión a la BD

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener matrícula desde la URL
    $matricula = isset($_GET['matricula']) ? $_GET['matricula'] : null;
    
    if ($matricula) {
        try {
            $stmt = $conn->prepare("DELETE FROM tblalumnos WHERE matricula = ?");
            $stmt->bind_param("s", $matricula);
            
            if ($stmt->execute()) {
                if ($stmt->affected_rows > 0) {
                    echo json_encode(array("mensaje" => "Alumno eliminado correctamente"));
                } else {
                    echo json_encode(array("error" => "No se encontró el alumno"));
                }
            } else {
                echo json_encode(array("error" => "Error al eliminar el alumno"));
            }
            
            $stmt->close();
        } catch(Exception $e) {
            echo json_encode(array("error" => "Error: " . $e->getMessage()));
        }
    } else {
        echo json_encode(array("error" => "Matrícula no proporcionada"));
    }
} else {
    echo json_encode(array("error" => "Método no permitido"));
}

$conn->close();
?>