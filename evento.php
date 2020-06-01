<?php
    session_start();
    require_once("pagina_fns.php");
    require_once("evento_fns.php");
    #Validando sesión...
    // if(!isset($_SESSION["username"])) {
	// 	$_SESSION['username'] = $ar["username"];
	// 	$host  = $_SERVER['HTTP_HOST'];
	// 	$uri   = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
	// 	$extra = 'login.php';
    //     header("Location: http://$host$uri/$extra");
    //     die(); // detiene la ejecución de código subsecuente
    // }
?>
<head>
    <link rel="shortcut icon" href="http://www.atlasnacionalderiesgos.gob.mx/Imagenes/Logos/cenapred_icon.ico"/>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Temporada de Ciclones Tropicales 2020</title>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <!-- Styles -->
    <link rel="stylesheet" href="css/evento.css">
    <link rel="stylesheet" href="./css/styles.css">
    <!--JS IONICON-->
	<script src="https://unpkg.com/ionicons@4.5.5/dist/ionicons.js"></script>
    <!--CSS BOOTSTRAP-->
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
	<!--JS BOOTSTRAP & JQUERY-->
	<script src="http://code.jquery.com/jquery-3.3.1.min.js"  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="  crossorigin="anonymous"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
</head>
<body>
    <?php includeNav(); ?>
    <div class="row main-container" style="margin-top: 70px;">
        <div class="adjust col d-flex justify-content-center">Selecciona el evento 
                <select>
                    <option value="1">Arthur</option>
                    <option value="2">Bertha</option>
                    <option value="3">Cristóbal</option>
                </select>
        </div>
        <div class="w-100"></div>
        <div class=" adjust col">
            <div id="tablaEditar" class="tableRegiones solid">
                <div class="solid" style="background-color: #DBBE99">Declaratoria de Emergencia</div>
                <div class="solid">
                    <table id="tablaEdos1" style=" border-collapse: collapse; width: 100%; text-align: center;">
                        <thead>
                            <tr id="Encabezado">
                                <th class="solid" style="background-color: #D9D9D9">Estado</th>
                                <th class="solid" style="background-color: #D9D9D9">Enlace</th>	
                            </tr>
                        </thead>
                        <tbody></tbody>
                        <tr id="filatest">
                                <th class="solid">
                                    <select id="Estado"> 
                                        <option value="1">Baja California Norte</option>
                                        <option value="2">Baja California Sur</option>
                                        <option value="3">Sinaloa</option>
                                    </select>
                                </th>
                                <th class="solid">
                                    
                                        <select id="Region">
                                            <option value="-1">Todo el Edo</option>
                                            <option value="0">Centro</option>
                                            <option value="1">Norte</option>
                                            <option value="2">Noreste</option>
                                            <option value="3">Este</option>
                                            <option value="4">Sureste</option>
                                            <option value="5">Sur</option>
                                            <option value="6">Suroeste</option>
                                            <option value="7">Oeste</option>
                                            <option value="8">Noroeste</option>
                                        </select>
                                        <button id="filatest" type="button" class="btn btn-outline-danger btn-sm botoncito" title="Elimina una por una las filas"><ion-icon name="close"></ion-icon></button>
                                        <button id="filatest" type="button" class="btn btn-outline-info btn-sm rotate-90"><ion-icon name="swap"></ion-icon></button>
                                </th>
                        </tr>
                    </table>
                    <button  id="bt_add1" type="button" class="btn btn-outline-info btn-sm" title="Agregar una región"><ion-icon name="add"></ion-icon></button>
                </div>
                <div class="solid" style="background-color: #DBBE99">Declaratoria de desastre</div>
                <div class="solid">
                <div class="solid">
                    <table id="tablaEdos2" style=" border-collapse: collapse; width: 100%; text-align: center;">
                        <thead>
                            <tr id="Encabezado">
                                    <th class="solid" style="background-color: #D9D9D9">Estado</th>
                                    <th class="solid" style="background-color: #D9D9D9">Enlace</th>	
                            </tr>
                        </thead>
                        <tbody></tbody>
                            <!--<tr id="filatest">
                            <th class="solid">
                                    <select id="NivelDeAlerta"> 
                                        <option value="1" style="background-color: red; ">ROJA</option>
                                        <option value="2" style="background-color: orange;">NARANJA</option>
                                        <option value="3" style="background-color: yellow;">AMARILLA</option>
                                        <option value="4" style="background-color: #38BF34;">VERDE</option>
                                        <option value="5" style="background-color: #4F81BC">AZUL</option>
                                    </select>
                            </th>
                            <th class="solid">
                                    <select id="Estado"> 
                                        <option value="">Baja California Norte</option>
                                        <option value="">Baja California Sur</option>
                                        <option value="">Sinaloa</option>
                                    </select>
                                    <select id="Region"> 
                                        <option value="">Norte</option>
                                        <option value="">Centro</option>
                                        <option value="">Sur</option>
                                    </select>
                                    <button id="filatest" type="button" class="btn btn-outline-danger btn-sm botoncito" title="Elimina una por una las filas"><ion-icon name="close"></ion-icon></button>
                            </th>
                        </tr>-->
                    </table>
                    <button id="bt_add2" type="button" class="btn btn-outline-info btn-sm" title="Agregar una región"><ion-icon name="add"></ion-icon></button>
                </div>
                <center>
                <button class="btn btn-outline-success" id="GuardaTabla">Guardar datos</button>	
                </center>
                </div>	
            </div>
        </div>
        <div class="adjust col">
            <div id="information">
            <div class="form-group">
                <label for="exampleInputEmail1">Cantidad de lluvia</label>
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Lluvia generada por este evento">
                <small id="emailHelp" class="form-text text-muted">Ingresa la cantidad de lluvia en mms</small>
            </div>
            </div>
        </div>
    </div>
    <script src="js/funciones.js"></script>
</body>


