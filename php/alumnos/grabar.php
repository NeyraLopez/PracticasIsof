<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Incluir el archivo de conexión
include '../conexion.php';
// Obtener el cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);
// Procesar formulario
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // Verificar si los datos están completos
if (!isset($data['matricula']) || !isset($data['nombre']) || !isset($data['direccion'])) {
    echo json_encode(array("error" => "Datos incompletos"));
    exit();
}
        try {
            $stmt = $conn->prepare("INSERT INTO tblalumnos (matricula,nombre,direccion,idCarrera) VALUES(?, ?, ?, ?)");
            
            $stmt->bind_param("ssss", 
                 $data['matricula'],
                $data['nombre'],
                $data['direccion'],
                $data['idcarrera']  
                
            );
            
            if ($stmt->execute()) {
                if ($stmt->affected_rows > 0) {
                    echo json_encode(array("mensaje" => "Alumno registrado correctamente"));
                } else {
                    echo json_encode(array("error" => "No se registró el alumno"));
                }
            } else {
                echo json_encode(array("error" => "Error al grabar"));
            }
            
            $stmt->close();
        } catch(Exception $e) {
            echo json_encode(array("error" => "Error: " . $e->getMessage()));
        }
} else {
    echo json_encode(array("error" => "Método no permitido"));
}

$conn->close();