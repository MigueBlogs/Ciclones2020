<?php 
    require_once("db_global.php");
    require_once("db_fns.php");

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

        $queryStr = "UPDATE CICLON SET FECHA_INICIO = :fecha_inicio, FECHA_FIN = :fecha_fin, LLUVIA = :lluvia WHERE ID = :id";
        
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

        $queryStr = "UPDATE DECLARATORIA SET ID_ESTADO = :id_estado, TIPO = :tipo, URL = :url WHERE ID_CICLON = :id_ciclon";
        
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