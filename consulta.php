<?php 
    require_once("db_global.php");
    require_once("db_fns.php");

    if(isset($_POST['obtenerEvento']) && isset($_POST["id"])){
        getEventoByID($_POST['id']);
    }
    else if(isset($_POST['obtenerEvento']) && isset($_POST["nombre"])){
        // echo json_encode(array("ID_CICLON"=>1));  // test
        echo json_encode(getEventoByNombre($_POST['nombre']));
        return;
    }
    else if(isset($_POST['obtenerDeclaratorias']) && isset($_POST["id"])){
        echo json_encode(getDeclaratoriasPorID($_POST['id']));
    }

    else if(isset($_POST['editaEvento']) && isset($_POST["id"])){
        // echo 1; // Test

        if (editaEvento($_POST["id"], $_POST["inicio"], $_POST["fin"], $_POST["lluvias"])){
            echo 1;
        }
        else {
            echo 0;
        }
    }
    else if(isset($_POST['agregaEvento']) && isset($_POST["nombre"]) && isset($_POST["oceano"])){
        // echo 1; // TEST
        
        if (agregaEvento($_POST["nombre"], $_POST["oceano"], $_POST["inicio"], $_POST["fin"], $_POST["lluvias"])){
            echo 1;
        }
        else {
            echo 0;
        }
    }
    else if(isset($_POST['agregaDeclaratoria']) && isset($_POST["ciclon"]) && isset($_POST["estado"]) && isset($_POST["tipo"]) && isset($_POST["url"])){
        // echo 0; // Test
        
        if (agregaDeclaratoria($_POST["ciclon"], $_POST["estado"], $_POST["tipo"], $_POST["url"])){
            echo 1;
        }
        else {
            echo 0;
        }
    }
    else if(isset($_POST['eliminaDeclaratoria']) && isset($_POST["id"])){
        // echo 0; // Test
        
        if (borraDeclaratoria($_POST["id"])){
            echo 1;
        }
        else {
            echo 0;
        }
    }
    else if(isset($_POST['editaDeclaratoria']) && isset($_POST["id_declaratoria"]) && isset($_POST["estado"]) && isset($_POST["tipo"]) && isset($_POST["url"])){
        // echo 1; // Test

        if (editaDeclaratoria($_POST["id_declaratoria"], $_POST["estado"], $_POST["tipo"], $_POST["url"])){
            echo 1;
        }
        else {
            echo 0;
        }
        return;
    }

    function getEventoByID($id_evento){
        $conn = dbConnect(user, pass, server);

        $paramsArray = Array(
            ":id"=>$id_evento
        );

        $queryStr = "SELECT ID as ID_CICLON, NOMBRE, TO_CHAR(FECHA_INICIO, 'YYYY-MM-DD') FECHA_INICIO, TO_CHAR(FECHA_FIN, 'YYYY-MM-DD') FECHA_FIN, LLUVIA, OCEANO FROM CICLON WHERE ID = :id";
        
        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        oci_execute($query);
        $todos = null;

        while ( ($row = oci_fetch_assoc($query)) != false) {
            $todos = $row;
        }
        dbClose($conn, $query);
        echo json_encode($todos);
    }
    function getEventoByNombre($nombre){
        $conn = dbConnect(user, pass, server);

        $paramsArray = Array(
            ":nombre"=>$nombre
        );

        $queryStr = "SELECT ID as ID_CICLON, NOMBRE, TO_CHAR(FECHA_INICIO, 'YYYY-MM-DD') FECHA_INICIO, TO_CHAR(FECHA_FIN, 'YYYY-MM-DD') FECHA_FIN, LLUVIA, OCEANO FROM CICLON WHERE NOMBRE = :nombre";
        
        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        oci_execute($query);
        $todos = null;

        while ( ($row = oci_fetch_assoc($query)) != false) {
            $todos = $row;
        }
        dbClose($conn, $query);
        return $todos;
    }

    function getEventos(){
        $conn = dbConnect(user, pass, server);

        $paramsArray = Array(
        );

        $queryStr = "SELECT ID as ID_CICLON, NOMBRE, TO_CHAR(FECHA_INICIO, 'YYYY-MM-DD') FECHA_INICIO, TO_CHAR(FECHA_FIN, 'YYYY-MM-DD') FECHA_FIN, LLUVIA, OCEANO, 
        CASE WHEN FECHA_INICIO is not null AND FECHA_INICIO <= sysdate AND FECHA_FIN is not null then 1 else 0 END AS PASADO, 
        CASE WHEN FECHA_INICIO is not null AND FECHA_INICIO <= sysdate AND FECHA_FIN is null then 1 else 0 END AS ACTIVO FROM CICLON";
        
        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        oci_execute($query);
        $todos = Array();

        while ( ($row = oci_fetch_assoc($query)) != false) {
            $todos[] = $row;
        }
        dbClose($conn, $query);
        return $todos;
    }

    function getEventosActivos(){
        $conn = dbConnect(user, pass, server);

        $paramsArray = Array(
        );

        $queryStr = "SELECT C.ID ID_CICLON, C.NOMBRE NOMBRE, TO_CHAR(C.FECHA_INICIO, 'YYYY-MM-DD') FECHA_INICIO, TO_CHAR(C.FECHA_FIN, 'YYYY-MM-DD') FECHA_FIN, C.LLUVIA LLUVIA, C.OCEANO OCEANO 
        FROM CICLON C WHERE C.FECHA_INICIO is not null AND C.FECHA_INICIO <= sysdate AND C.FECHA_FIN is null";
        
        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        oci_execute($query);
        $todos = Array();

        while ( ($row = oci_fetch_assoc($query)) != false) {
            $todos[] = $row;
        }
        dbClose($conn, $query);
        return $todos;
    }

    function getEventosPasados(){
        $conn = dbConnect(user, pass, server);

        $paramsArray = Array(
        );

        $queryStr = "SELECT C.ID ID_CICLON, C.NOMBRE NOMBRE, TO_CHAR(C.FECHA_INICIO, 'YYYY-MM-DD') FECHA_INICIO, TO_CHAR(C.FECHA_FIN, 'YYYY-MM-DD') FECHA_FIN, C.LLUVIA LLUVIA, C.OCEANO OCEANO
        FROM CICLON C 
        WHERE C.FECHA_INICIO is not null AND C.FECHA_INICIO <= sysdate AND C.FECHA_FIN is not null";
        
        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        oci_execute($query);
        $todos = Array();

        while ( ($row = oci_fetch_assoc($query)) != false) {
            $todos[] = $row;
        }
        dbClose($conn, $query);
        return $todos;
    }

    function editaEvento($id_evento, $fecha_inicio=null, $fecha_fin=null, $lluvia=null){
        $conn = dbConnect(user, pass, server);

        $paramsArray = Array(
            ":id"=>$id_evento,
            ":fecha_inicio"=>$fecha_inicio,
            ":fecha_fin"=>$fecha_fin,
            ":lluvia"=>$lluvia
        );

        $queryStr = "UPDATE CICLON SET FECHA_INICIO = TO_DATE(:fecha_inicio, 'YYYY-MM-DD'), FECHA_FIN = TO_DATE(:fecha_fin, 'YYYY-MM-DD'), LLUVIA = :lluvia WHERE ID = :id";
        
        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        if (oci_execute($query, OCI_NO_AUTO_COMMIT)){
            oci_commit($conn);
            dbClose($conn, $query);
            return True;
        }
        else {
            oci_rollback($conn);
            dbClose($conn, $query);
            return False;
        }
    }
    function agregaEvento($nombre, $oceano, $fecha_inicio=null, $fecha_fin=null, $lluvia=null) {
        $conn = dbConnect(user, pass, server);

        $paramsArray = Array(
            ":nombre"=>$nombre,
            ":oceano"=>$oceano,
            ":inicio"=>$fecha_inicio,
            ":fin"=>$fecha_fin,
            ":lluvia"=>$lluvia
        );

        $queryStr = "INSERT INTO CICLON(NOMBRE,OCEANO,FECHA_INICIO,FECHA_FIN,LLUVIA) VALUES (:nombre,:oceano,TO_DATE(:inicio, 'YYYY-MM-DD'),TO_DATE(:fin, 'YYYY-MM-DD'),:lluvia)";
        
        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        if (oci_execute($query, OCI_NO_AUTO_COMMIT)){
            oci_commit($conn);
            dbClose($conn, $query);
            return True;
        }
        else {
            oci_rollback($conn);
            dbClose($conn, $query);
            return False;
        }
    }

    function getDeclaratoriasPorID($id_ciclon) {
        $conn = dbConnect(user, pass, server);

        $paramsArray = Array(
            ":id"=>$id_ciclon
        );

        $queryStr = "SELECT D.ID ID_DECLARATORIA, D.ID_ESTADO ID_ESTADO, E.NOMBRE ESTADO, D.TIPO TIPO, D.URL URL 
        FROM DECLARATORIA D, ESTADO E 
        WHERE :id = D.ID_CICLON(+) AND D.ID_ESTADO = E.ID_ESTADO";
        
        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        oci_execute($query);
        $todos = Array();

        while ( ($row = oci_fetch_assoc($query)) != false) {
            $todos[] = $row;
        }
        dbClose($conn, $query);
        return $todos;
    }

    function agregaDeclaratoria($id_ciclon, $id_estado, $tipo, $url) {
        $conn = dbConnect(user, pass, server);

        $paramsArray = Array(
            ":id_ciclon"=>$id_ciclon,
            ":id_estado"=>$id_estado,
            ":tipo"=>$tipo,
            ":url"=>$url
        );

        $queryStr = "INSERT INTO DECLARATORIA(ID_CICLON,ID_ESTADO,TIPO,URL) VALUES (:id_ciclon,:id_estado,:tipo,:url)";
        
        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        if (oci_execute($query, OCI_NO_AUTO_COMMIT)){
            oci_commit($conn);
            dbClose($conn, $query);
            return True;
        }
        else {
            oci_rollback($conn);
            dbClose($conn, $query);
            return False;
        }
    }
    function editaDeclaratoria($id_dec, $id_estado, $tipo, $url){
        $conn = dbConnect(user, pass, server);

        $paramsArray = Array(
            ":id_dec"=>$id_dec,
            ":id_estado"=>$id_estado,
            ":tipo"=>$tipo,
            ":url"=>$url
        );

        $queryStr = "UPDATE DECLARATORIA SET ID_ESTADO = :id_estado, TIPO = :tipo, URL = :url WHERE ID = :id_dec";
        
        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        if (oci_execute($query, OCI_NO_AUTO_COMMIT)){
            oci_commit($conn);
            dbClose($conn, $query);
            return True;
        }
        else {
            oci_rollback($conn);
            dbClose($conn, $query);
            return False;
        }
    }

    function borraDeclaratoria($id_dec){
        $conn = dbConnect(user, pass, server);

        $paramsArray = Array(
            ":id_dec"=>$id_dec
        );

        $queryStr = "DELETE FROM DECLARATORIA WHERE ID = :id_dec";
        
        $query = oci_parse($conn, $queryStr);

        foreach ($paramsArray as $key => $value) {
            oci_bind_by_name($query, $key, $paramsArray[$key]);
        }

        if (oci_execute($query, OCI_NO_AUTO_COMMIT)){
            oci_commit($conn);
            dbClose($conn, $query);
            return True;
        }
        else {
            oci_rollback($conn);
            dbClose($conn, $query);
            return False;
        }
    }
?>