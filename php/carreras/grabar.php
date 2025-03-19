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
if (!isset($data['id']) || !isset($data['nombreCarrera'])){
    echo json_encode(array("error" => "Datos incompletos"));
    exit();
}
        try {
            $stmt = $conn->prepare("INSERT INTO tblcarreras (id,nombreCarrera) VALUES(?, ?)");
            
            $stmt->bind_param("ss", 
                 $data['id'],
                $data['nombreCarrera']
                
            );
            
            if ($stmt->execute()) {
                if ($stmt->affected_rows > 0) {
                    echo json_encode(array("mensaje" => "Carrera registrada correctamente"));
                } else {
                    echo json_encode(array("error" => "No se registró la carrera"));
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


/*
include 'conexion.php';

//procesar formulario
if($_SERVER["REQUEST_METHOD"] == "POST"){
    //Limpiar y validar datos
    $matricula = $conn->real_escape_string($_POST['matricula']);
    $nombre = $conn->real_escape_string($_POST['nombre']);
    $direccion = $conn->real_escape_string($_POST['direccion']);

    //Insertar datos
    $sql = "INSERT INTO tblalumnos (matricula, nombre, direccion)
    VALUES ('$matricula', '$nombre', '$direccion')";

    if ($conn->query($sql) === TRUE) {
        echo"<h1>Registro Exitoso!</h1>";

    } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
    }


}

$conn->close();
*/

?>