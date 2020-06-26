<?php
    session_start();
    require_once("pagina_fns.php");
    require_once("consulta.php");
    
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <link rel="shortcut icon" href="http://www.atlasnacionalderiesgos.gob.mx/Imagenes/Logos/cenapred_icon.ico"/>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Temporada de Ciclones Tropicales 2020</title>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <!-- Styles -->
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="./css/styles.css">
    <!--JS IONICON-->
    <script src="https://unpkg.com/ionicons@5.0.0/dist/ionicons.js"></script>
    <!-- Material Icons -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!-- Handlebars -->
	<script src="./lib/handlebars.js"></script>
    <!-- ARCGIS MAP's -->
	<link rel="stylesheet" href="https://js.arcgis.com/4.15/esri/css/main.css">
    <script src="https://js.arcgis.com/4.15/"></script>
    <!-- <script type="text/javascript" src="http://js.arcgis.com/3.20/"></script>
    <link rel="stylesheet" href="http://js.arcgis.com/3.20/dijit/themes/claro/claro.css">
    <link rel="stylesheet" href="http://js.arcgis.com/3.20/esri/css/esri.css"> -->
</head>
<body>
    <?php includeNav(); ?>
    <div id="mapaDiv" style="margin-top: 70px;">
        <div id="dataSection">
            <div class="title">Ciclones tropicales</div>
            <button type="button" class="collapsible">Atlántico</button>
            <div class="content">
                <div class="options">
                    <ol>
                        <?php foreach (getEventos() as $key => $e) {
                            #print_r($e);
                            if ($e["OCEANO"] != "A"){
                                continue;
                            }
                            if ($e["PASADO"]) { ?>
                                <li class="pasado"><s><?=$e["NOMBRE"]?></s>
                                    <ion-icon class="buttonInfo" name="chevron-down"></ion-icon>
                                    <ion-icon style="display:none;" class="buttonClose" name="chevron-up"></ion-icon>
                                    <div class="boxInfo" style="display:none;">
                                        <p>Fecha de inicio: <?=$e["FECHA_INICIO"]?></p>
                                        <p>Fecha término: <?=$e["FECHA_FIN"]?></p>
                                        <p>Precipitación: <?=$e["LLUVIA"]? $e["LLUVIA"]." L/m"."<sup>2</sup>":"Sin registro"?></p>
                                        <?php $decl = getDeclaratoriasPorID($e["ID_CICLON"]);
                                        if (empty($decl)) { ?>
                                            <p>Sin declaratorias registradas</p> 
                                            <br>   
                                        <?php }
                                        else { ?>
                                            <ul>
                                                <?php 
                                                foreach ($decl as $key => $d) { ?>
                                                <li>
                                                    <p>Declaratoria de <?=$d["TIPO"]=="E"?"Emergencia":"Desastre"?></p>
                                                    <p>Estado: <?=$d["ESTADO"]?></p>
                                                    <p>Enlace <a target="_blank" href="<?=$d["URL"]?>">aquí</a></p>
                                                </li>
                                                <br>
                                                <?php } ?>
                                                </ul>
                                        <?php } ?>
                                    </div>
                                </li>
                            <?php } 
                            else if ($e["ACTIVO"]) { ?>
                                <li class="activo"><span style="color:green;"><?=$e["NOMBRE"]?></span>
                                    <p>Fecha de inicio: <?=$e["FECHA_INICIO"]?></p>
                                    <p>Precipitación: <?=$e["LLUVIA"]? $e["LLUVIA"]." L/m"."<sup>2</sup>":"Sin registro"?></p>
                                    <?php $decl = getDeclaratoriasPorID($e["ID_CICLON"]);
                                    if (empty($decl)) { ?>
                                        <p>Sin declaratorias aún</p>    
                                    <?php }
                                    else { ?>
                                        <ul>
                                            <?php 
                                            foreach ($decl as $key => $d) { ?>
                                            <li>
                                                <p>Declaratoria de <?=$d["TIPO"]=="E"?"Emergencia":"Desastre"?></p>
                                                <p>Estado: <?=$d["ESTADO"]?></p>
                                                <p>Enlace <a target="_blank" href="<?=$d["URL"]?>">aquí</a></p>
                                            </li>
                                            <?php } ?>
                                            </ul>
                                    <?php } ?>
                                </li>
                            <?php } else { ?>
                                <li class="siguiente"><?=$e["NOMBRE"]?></li>
                            <?php } ?>
                        <?php } ?>
                    </ol>
                </div>
            </div>
            <button type="button" class="collapsible">Pacífico</button>
            <div class="content">
                <div class="options">
                    <ol>
                        <?php foreach (getEventos() as $key => $e) {
                            if ($e["OCEANO"] != "P"){
                                continue;
                            }
                            if ($e["PASADO"]) { ?>
                                <li class="pasado"><s><?=$e["NOMBRE"]?></s>
                                    <ion-icon class="buttonInfo" name="chevron-down"></ion-icon>
                                    <ion-icon style="display:none;" class="buttonClose" name="chevron-up"></ion-icon>
                                    <div class="boxInfo" style="display:none;">
                                        <p>Fecha de inicio: <?=$e["FECHA_INICIO"]?></p>
                                        <p>Fecha término: <?=$e["FECHA_FIN"]?></p>
                                        <p>Precipitación: <?=$e["LLUVIA"]? $e["LLUVIA"]." L/m"."<sup>2</sup>":"Sin registro"?></p>
                                        <?php $decl = getDeclaratoriasPorID($e["ID_CICLON"]);
                                        if (empty($decl)) { ?>
                                            <p>Sin declaratorias registradas</p> 
                                            <br>   
                                        <?php }
                                        else { ?>
                                            <ul>
                                                <?php 
                                                foreach ($decl as $key => $d) { ?>
                                                <li>
                                                    <p>Declaratoria de <?=$d["TIPO"]=="E"?"Emergencia":"Desastre"?></p>
                                                    <p>Estado: <?=$d["ESTADO"]?></p>
                                                    <p>Enlace <a target="_blank" href="<?=$d["URL"]?>">aquí</a></p>
                                                </li>
                                                <br>
                                                <?php } ?>
                                                </ul>
                                        <?php } ?>
                                    </div>
                                </li>
                            <?php }  
                            else if ($e["ACTIVO"]) { ?>
                                <li class="activo"><span style="color:green;"><?=$e["NOMBRE"]?></span>
                                    <p>Fecha de inicio: <?=$e["FECHA_INICIO"]?></p>
                                    <p>Precipitación: <?=$e["LLUVIA"]? $e["LLUVIA"]." L/m"."<sup>2</sup>":"Sin registro"?></p>
                                    <?php $decl = getDeclaratoriasPorID($e["ID_CICLON"]);
                                    if (empty($decl)) { ?>
                                        <p>Sin declaratorias aún</p>
                                    <?php }
                                    else { ?>
                                        <ul>
                                            <?php 
                                            foreach ($decl as $key => $d) { ?>
                                            <li>
                                                <p>Declaratoria de <?=$d["TIPO"]=="E"?"Emergencia":"Desastre"?></p>
                                                <p>Estado: <?=$d["ESTADO"]?></p>
                                                <p>Enlace <a target="_blank" href="<?=$d["URL"]?>">aquí</a></p>
                                            </li>
                                            <?php } ?>
                                            </ul>
                                    <?php } ?>
                                </li>
                            <?php } else { ?>
                                <li class="siguiente"><?=$e["NOMBRE"]?></li>
                            <?php } ?>
                        <?php } ?>
                    </ol>
                </div>
            </div>
        </div>
        <div id="map-container">
            <div id="stormLabel">
                <p style="margin: 0; padding: 5px; font-size: smaller;">Ciclones actuales</p>
            </div>
            <div id="stormSelection">
                <div class="title">Ciclón tropical en el Pacífico</div>
                <div class="options">
                    <select name="stormsActive" id="stormsActive" ocean="P">
                        <option value="">Cargando</option>
                    </select>
                </div>
            </div>
            <div id="stormSelection2">
                <div class="title">Ciclón tropical en el Atlántico</div>
                <div class="options">
                    <select name="stormsActive2" id="stormsActive2" ocean="A">
                        <option value="">Cargando</option>
                    </select>
                </div>
            </div>
            <div id="timeDiv">
                <p style="margin: 0; padding: 5px; font-size: smaller;">Cargando...</p>
            </div>
            <div id="analisis" style="display:none;">
            <center> Análisis de Exposición </center><ion-icon class="buttonCloseTable" name="close-circle-outline" title="Cerrar Análisis"></ion-icon>
            <table>
                <tr>
                    <th rowspan="2" id="Poblacion">
                        <div class="row">
                            <div class="column1">
                                <ion-icon style="font-size: 70px;" name="people-outline"></ion-icon>
                            </div>
                            <div class="column2">
                                Población:<br><span class="resultNumber"></span><br><button id="muestraTabla" class="buttonGreen">Más información</button>
                            </div>
                        </div>
                    </th>
                    <td id="pob_f_t">
                        <div class="row">
                            <div class="column1">
                                <ion-icon name="woman-outline"></ion-icon>
                            </div>
                            <div class="column2">
                            Pob. Fem:<br><span class="resultNumber"></span>
                            </div>
                        </div>    
                   </td>
                    <td id="Viviendas">
                        <div class="row">
                            <div class="column1">
                                <ion-icon name="home-outline"></ion-icon>
                            </div>
                            <div class="column2">
                            Viviendas:<br><span class="resultNumber"></span>
                            </div>
                        </div>     
                    </td>
                    <td id="Escuelas">
                        <div class="row">
                            <div class="column1">
                                <ion-icon name="school-outline"></ion-icon>
                            </div>
                            <div class="column2">
                            Escuelas:<br><span class="resultNumber"></span>
                            </div>
                        </div>     
                    </td>
                    <td id="Aeropuertos">
                        <div class="row">
                            <div class="column1">
                                <ion-icon name="airplane-outline"></ion-icon>
                            </div>
                            <div class="column2">
                            Aeropuertos:<br><span class="resultNumber"></span>
                            </div>
                        </div>
                    </td>
                    <td id="Presas">
                        <div class="row">
                            <div class="column1">
                                <ion-icon name="water-outline"></ion-icon>
                            </div>
                            <div class="column2">
                            Presas:<br><span class="resultNumber"></span>
                            </div>
                        </div>
                    </td>
                    <td id="Colonias">
                        <div class="row">
                            <div class="column1">
                                <ion-icon name="map-outline"></ion-icon>
                            </div>
                            <div class="column2">
                            Colonias:<br><span class="resultNumber"></span>
                            </div>
                        </div>    
                    </td>
                </tr>
                <tr>
                    <td id="pob_m_t">
                        <div class="row">
                            <div class="column1">
                                <ion-icon name="man-outline"></ion-icon>
                            </div>
                            <div class="column2">
                            Pob. Mas.<br><span class="resultNumber"></span>
                            </div>
                        </div>
                    </td>
                    <td id="Hospitales">
                        <div class="row">
                            <div class="column1">
                                <ion-icon name="medkit-outline"></ion-icon>
                            </div>
                            <div class="column2">
                            Estab. de Salud:<br><span class="resultNumber"></span>
                            </div>
                        </div>    
                    </td>
                    <td id="Supermercados">
                        <div class="row">
                            <div class="column1">
                                <ion-icon name="cart-outline"></ion-icon>
                            </div>
                            <div class="column2">
                            Supermercados:<br><span class="resultNumber"></span>
                            </div>
                        </div> 
                    </td>
                    <td id="Hoteles">
                        <div class="row">
                            <div class="column1">
                                <ion-icon name="business-outline"></ion-icon>
                            </div>
                            <div class="column2">
                            Hoteles:<br><span class="resultNumber"></span>
                            </div>
                        </div>
                    </td>
                    <td id="Gasolineras">
                        <div class="row">
                            <div class="column1">
                                <span class="material-icons">
                                local_gas_station
                                </span>
                            </div>
                            <div class="column2">
                            Gasolineras:<br><span class="resultNumber"></span>
                            </div>
                        </div>
                    </td>
                    <td id="Ganadero">
                        <div class="row">
                            <div class="column1">
                            <span class="material-icons">
                            agriculture
                            </span>
                            </div>
                            <div class="column2">
                            Ganaderías:<br><span class="resultNumber"></span>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
            <div id="showTable" style="display:none">
                <br>
                <div id="table-container"></div>
                <a href="#" id="csvPob">Descarga esta información en formato .CSV</a></div>
            </div>
            <div id="map">
                <div class="cnpc-logos">
                    <img src="http://www.atlasnacionalderiesgos.gob.mx/Imagenes/Logos/SSyPC_CNPC_h.png" alt="CENACOM">
                </div>
            </div>
        </div>
    </div>
    
    <button id="botonTop" type="button" class="boton-volver" style="display: none;"><ion-icon name="arrow-up-outline"></ion-icon></button>
    <script id="stormsActiveEP-template" type="text/x-handlebars-template">
		{{#each storms as |storm|}}
			{{#if @first}}
				<option value="">Selecciona</option>
			{{/if}}
			<option value="{{storm.stormname}}" data-layerid="{{storm.layerid}}">{{storm.stormname}}</option>
		{{else}}
			<option value="">Sin ciclones tropicales</option>
		{{/each}}
    </script>
    <script id="stormsActiveAT-template" type="text/x-handlebars-template">
		{{#each storms as |storm|}}
			{{#if @first}}
				<option value="">Selecciona</option>
			{{/if}}
			<option value="{{storm.stormname}}" data-layerid="{{storm.layerid}}">{{storm.stormname}}</option>
		{{else}}
			<option value="">Sin ciclones tropicales</option>
		{{/each}}
	</script>
    <script src="js/map.js"></script>	
    <script src="js/funciones.js"></script>
    <!-- <script src="js/TOC.js"></script> -->
    <script src="js/analisis.js"></script>
    <script src="js/csv.js"></script>
    <script>
        var coll = document.getElementsByClassName("collapsible");
        var i;

        for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
            content.style.display = "none";
            } else {
            content.style.display = "block";
            }
        });
        }
        window.onscroll = function() {scrollFunction()};
        
        function scrollFunction() {
            if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
                $('#botonTop').show();
            } else {
                $('#botonTop').hide();
            }
        }

        $('#botonTop').on('click', function () {
            $('html, body').animate({
                scrollTop: 0
            }, 750, function() {
                $('#botonTop').hide();
            });
        }); 
    </script>
</body>
</html>
