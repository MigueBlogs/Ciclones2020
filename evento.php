<?php
    session_start();
    require_once("pagina_fns.php");
    require_once("evento_fns.php");
    require_once("consulta.php");
    #Validando sesión...
    if(!isset($_SESSION["username"])) {
		$_SESSION['username'] = $ar["username"];
		$host  = $_SERVER['HTTP_HOST'];
		$uri   = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
		$extra = 'login.php';
        header("Location: http://$host$uri/$extra");
        die(); // detiene la ejecución de código subsecuente
    }
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
    <!-- Menú del Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div style="background-color: #35695D; color:white" class="modal-header">
            <h5 class="modal-title"  id="exampleModalLabel">Menú de Inicio</h5>
            </div>
            <div class="modal-body">
            Elige la opción deseada:
            <div class="form-check">
                <input  class="form-check-input" type="radio" name="choiceRatios" id="nuevoEvento" value="nuevo">
                <label class="form-check-label" for="nuevoEvento">
                Insertar un nuevo evento (no listado)
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="choiceRatios" id="editarEvento" value="editar">
                <label class="form-check-label" for="editarEvento">
                Editar un evento previsto (listado)
                    <select id="events" style="display:none;">
                        <optgroup style="background-color: aquamarine;" label="Atlántico ▼">
                        <?php foreach (getEventosAT() as $key => $e) { ?>
                            <option style="background-color: white;" value="<?=$e["ID_CICLON"]?>"><?=$e["NOMBRE"]?></option>
                        <?php } ?>
                        </optgroup>
                        <optgroup  style="background-color: mediumaquamarine;" label="Pacífico ▼">
                            <?php foreach (getEventosEP() as $key => $e) { ?>
                                <option style="background-color: white;" value="<?=$e["ID_CICLON"]?>"><?=$e["NOMBRE"]?></option>
                            <?php } ?>
                        </optgroup>
                    </select>
                </label>
            </div>
            <br>
            <div id="activeEvents"></div>
            </div>
            <div class="modal-footer">
            <small>Este listado es referente al publicado por el <a target="_blank" href="https://www.nhc.noaa.gov/aboutnames.shtml">NHC</a></small>
            <button id="next" style="border-color:unset;" type="button" disabled class=" btn btn-primary guinda" data-dismiss="modal">Continuar</button>
            <a style="border-color:unset;" class="verde-oscuro btn btn-primary guinda" href="index.php">Cancelar</a>
            </div>
        </div>
        </div>
    </div>
    <!-- modal para confirmar selección -->
    <div class="modal fade" id="seleccionaEventoModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div style="background-color: #35695D; color:white" class="modal-header">
            <h5 class="modal-title"  id="exampleModalLabel">Menú de Inicio</h5>
            </div>
            <div class="modal-body">
            Elige el evento al que deseas evolucionar:
            <select id="porAsignar">
                <optgroup style="background-color: aquamarine;" label="Atlántico ▼">
                    <?php foreach (getEventosAT() as $key => $e) { ?>
                        <option style="background-color: white;" value="<?=$e["ID_CICLON"]?>"><?=$e["NOMBRE"]?></option>
                    <?php } ?>
                </optgroup>
                <optgroup  style="background-color: mediumaquamarine;" label="Pacífico ▼">
                    <?php foreach (getEventosEP() as $key => $e) { ?>
                        <option style="background-color: white;" value="<?=$e["ID_CICLON"]?>"><?=$e["NOMBRE"]?></option>
                    <?php } ?>
                </optgroup>
            </select>
            <br>
            <div id="activeEvents"></div>
            </div>
            <div class="modal-footer">
            <button id="confirmarAsignacion" style="border-color:unset;" type="button" disabled class=" btn btn-primary guinda" data-dismiss="modal">Continuar</button>
            <a style="border-color:unset;" class="verde-oscuro btn btn-primary guinda" href="index.php">Cancelar</a>
            </div>
        </div>
        </div>
    </div>
    <div class="row main-container" style="margin-top: 70px;">
        <div class="adjust col d-flex justify-content-center">
            <div id="caseEdit">Estás editando el ciclón tropical <span id="nombreEvento" class="font-weight-bold"></span>, en el océano <span id="oceano" class="font-weight-bold"></span>
            </div> 
            <div id="caseNew" style="width:100%;">
                <div class="form-group" >
                    <label for="nombreCiclon">Nombre del evento</label>
                    <input type="text" class="form-control" id="nombreCiclon" aria-describedby="Nombre-Evento" placeholder="Ingresa el nombre del evento">
                </div>
                <div class="form-group" >
                    <label for="oceano">Océano donde se formó</label>
                    <select id="nuevo-oceano">
                        <option value="A">Atlántico</option>
                        <option value="P">Pacífico</option>
                    </select>
                </div>
            </div>   
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
                        <!-- <tr id="filatest">
                                <th class="solid">
                                    <select id="Estado"> 
                                        <option value="1">Baja California Norte</option>
                                        <option value="2">Baja California Sur</option>
                                        <option value="3">Sinaloa</option>
                                    </select>
                                </th>
                                <th class="solid">
                                    <div class="row">
                                        <div class="w-100"></div>
                                        <div class=" adjust col-9 form-group">
                                            <input type="text" class="form-control enlace" id="enlace'+cont+'" aria-describedby="emailHelp" placeholder="Pega aquí el enlace de la declaratoria">
                                        </div>
                                        <div class=" adjust col">
                                            <button id="filatest" type="button" class="btn btn-outline-danger btn-sm botoncito" title="Elimina una por una las filas"><ion-icon name="close"></ion-icon></button>
                                            <button id="filatest" type="button" class="btn btn-outline-info btn-sm rotate-90"><ion-icon name="swap"></ion-icon></button>
                                        </div>
                                    </div>
                                </th>
                        </tr> -->
                    </table>
                    <button  id="bt_add1" type="button" class="btn btn-outline-info btn-sm" title="Agregar una declaratoria"><ion-icon name="add"></ion-icon></button>
                </div>
                <div class="solid" style="background-color: #DBBE99">Declaratoria de Desastre</div>
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
                    <button id="bt_add2" type="button" class="btn btn-outline-info btn-sm" title="Agregar una declaratoria"><ion-icon name="add"></ion-icon></button>
                </div>
                <!-- <center>
                    <button class="btn btn-outline-success" id="GuardaTabla">Guardar datos</button>	
                </center> -->
            </div>	
            </div>
            <p class="row justify-content-center">Dejar vacío si no hay declaratorias</p>
        </div>
        <div class="adjust col">
            <div id="information">
            <div class="form-group">
                <label for="lluvias">Cantidad de lluvia</label>
                <input type="number" class="form-control" id="lluvias"  placeholder="Lluvia generada por este evento">
                <small id="lluviasHelp" class="form-text text-muted">Ingresa la cantidad de lluvia en mm</small>
            </div>
            <div class="form-group">
                <label for="fecha_inicio">Fecha de inicio</label>
                <input type="date" class="form-control" id="fecha_inicio" aria-describedby="fecha_inicio_help" placeholder="Fecha inicial del evento">
                <small id="fecha_inicio_help" class="form-text text-muted">Ingresa la fecha en la que inició este evento</small>
            </div>
            <div class="form-group">
                <label for="fecha_fin">Fecha término</label>
                <input type="date" class="form-control" id="fecha_fin" aria-describedby="fecha_fin_help" placeholder="Fecha final del evento">
                <small id="fecha_fin_help" class="form-text text-muted">Ingresa la fecha en la que terminó este evento</small>
            </div>
            </div>
        </div>
        <div class="w-100 row justify-content-center">
            <button class="btn btn-primary guinda" id="guardarDatos" style="border-color:unset;">Guardar cambios</button>

            <button style="display:none;" class="btn btn-primary" id="asignar" style="border-color:unset;">Asignar a otro evento</button>
        </div>
        <div class="w-100 row justify-content-center">
            <button class="btn btn-primary guinda" id="borrarEvento" style="border-color:unset; display:none;">Eliminar evento</button>
            <div class="w-100 row justify-content-center" style="display:none;">
                <p>Esta acción no se puede revertir, ni se podrán recuperar los datos previamente guardados</p>
            </div>
        </div>
    </div>
    <script src="js/evento.js"></script>
</body>


