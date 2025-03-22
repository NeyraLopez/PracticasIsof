<?php

include '../conexion.php';
header('Content-Type: application/json');

//Funcion par obneter la lista de registro
function obtenerRegistros($conn){

    //$sql = "SELECT * FROM tblalumnos"; //Funcion, procedimiento almacenado o consulta sql
    $sql = 'SELECT matricula, nombre, direccion, nombreCarrera as carrera
            FROM tblalumnos
            INNER JOIN  tblcarreras ON tblalumnos.idCarrera = tblcarreras.id';
    $result = $conn->query($sql);
    $registros = [];
    if($result -> num_rows > 0){
        while($row = $result -> fetch_assoc()){
            $registros[] = $row;
        }
    }
    return $registros;
}

$registros = obtenerRegistros($conn);

echo json_encode($registros); //Regresar en formato json para que se adapte

$conn->close();



?>