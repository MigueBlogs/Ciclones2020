<?php
    //session_start();
    require_once("db_fns.php");

    if(isset($_POST['obtenerEstados'])){
        getEstados();
    }
    
    
    function getEstados(){
        require_once("db_global.php");

        $conn = dbConnect(user, pass, server);

        $queryStr = "SELECT NOMBRE, ID_ESTADO FROM ESTADO";

        $query = oci_parse($conn, $queryStr);

        $resultados = Array();

        oci_execute($query);

        while ( ($row = oci_fetch_assoc($query)) != false) {
            $resultados[] = [
                "estado" => $row['NOMBRE'],
                "id_estado" => $row['ID_ESTADO']
            ];
        }
        echo json_encode($resultados);
    }
?>