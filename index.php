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
    <!-- <script src="https://unpkg.com/ionicons@5.0.0/dist/ionicons.js"></script> -->
    <script src="https://unpkg.com/ionicons@5.1.2/dist/ionicons.js"></script>
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
            <button type="button" class="collapsible active">Leyenda</button>
            <div class="content" style="display: block;">
                <ol style="font-size: 0.8rem;list-style-type: none;padding-left:0;">
                    <li><s style="color: gray;">Evento</s> Evento pasado</li>
                    <li><span style="color: green;">Evento</span> Evento activo</li>
                    <li class="siguiente">Evento <span style="color:black!important;">Evento esperado</span></li>
                </ol>
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
            <div id="refugiosDiv">
                <!-- <p id="titleDesktop" class="refugios-titulo">Refugios temporales</p> -->
                <p id="titleMobile" style="display:none;" class="refugios-titulo">Opciones de mapa</p>
                <div id="gridOpciones" style="width: 168px; display: grid; grid-template-columns: 50% 50%; height: 38px;">
                    <div class="refugios-iconos" id="refugios-div" style="border-radius: 20px;">
                        <div style="padding: 2px;">
                            <img src="img/refugios.png" width="24px" height="24px">
                        </div>
                        <div style="padding: 5px;">&nbsp;
                            <label class="switch" style="vertical-align: middle;">
                                <input type="checkbox" id="refugios-checkbox">
                                <span class="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div class="refugios-iconos" style="padding: 3px 3px 0 0; display:none; border-radius:0 20px 20px 0;" id="vientos-div">
                        <div style="padding: 2px;">
                            <img src="img/wind.png" style="width: 30px; height: 30px;"></img>
                        </div>
                        <div style="padding: 5px;">&nbsp;
                            <!-- <label style="font-size: smaller;">Apag/Enc</label> -->
                            <label class="switch" style="vertical-align: middle;">
                                <input type="checkbox" id="vientos-checkbox">
                                <span class="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div class="refugios-iconos"  style="padding: 2px; display:none;" id="clouds-div">
                        <div style="padding: 2px;">
                            <span class="material-icons">wb_cloudy</span>
                        </div>
                        <div style="padding: 5px;">
                            <label class="switch" style="vertical-align: middle;">
                                <input type="checkbox" id="nubes-checkbox2"> 
                                <span class="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div>
                    <select id="refugios-select" style="opacity: 0;">
                        <option value="">Selecciona estado</option>
                        <option value='1'>AGUASCALIENTES</option>
                        <option value='2'>BAJA CALIFORNIA</option>
                        <option value='3'>BAJA CALIFORNIA SUR</option>
                        <option value='4'>CAMPECHE</option>
                        <option value='5'>COAHUILA</option>
                        <option value='6'>COLIMA</option>
                        <option value='7'>CHIAPAS</option>
                        <option value='8'>CHIHUAHUA</option>
                        <option value='9'>CIUDAD DE MÉXICO</option>
                        <option value='10'>DURANGO</option>
                        <option value='11'>GUANAJUATO</option>
                        <option value='12'>GUERRERO</option>
                        <option value='13'>HIDALGO</option>
                        <option value='14'>JALISCO</option>
                        <option value='15'>ESTADO DE MÉXICO</option>
                        <option value='16'>MICHOACÁN</option>
                        <option value='17'>MORELOS</option>
                        <option value='18'>NAYARIT</option>
                        <option value='19'>NUEVO LEÓN</option>
                        <option value='20'>OAXACA</option>
                        <option value='21'>PUEBLA</option>
                        <option value='22'>QUERÉTARO</option>
                        <option value='23'>QUINTANA ROO</option>
                        <option value='24'>SAN LUIS POTOSÍ</option>
                        <option value='25'>SINALOA</option>
                        <option value='26'>SONORA</option>
                        <option value='27'>TABASCO</option>
                        <option value='28'>TAMAULIPAS</option>
                        <option value='29'>TLAXCALA</option>
                        <option value='30'>VERACRUZ</option>
                        <option value='31'>YUCATÁN</option>
                        <option value='32'>ZACATECAS</option>
                    </select>
                </div>
            </div>
            <div id="timeDiv">
                <div style="display: grid; grid-template-columns: 20% 80%; text-align:center; padding: 3px;">
                    <div style="padding: 2px;">
                        <span class="material-icons">wb_cloudy</span>
                    </div>
                    <div style="padding: 5px;">&nbsp;
                        <label class="switch" style="vertical-align: middle;">
                            <input type="checkbox" id="nubes-checkbox"> 
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
                <p style="margin: 0; padding: 5px; font-size: smaller;">Cargando...</p>
            </div>
            <div id="analisis" style="display:none;">
                <center> Análisis de Exposición </center><ion-icon class="buttonCloseTable" name="close-circle-outline" title="Cerrar Análisis"></ion-icon>
                <div style="overflow-x:auto;">
                    <table>
                        <tr>
                            <th rowspan="2" id="Poblacion">
                                <div class="row">
                                    <div class="column1">
                                        <ion-icon style="font-size: 70px;" name="people-outline"></ion-icon>
                                    </div>
                                    <div class="column2">
                                        Población: <span class="resultNumber"></span><br><button id="muestraTabla" class="buttonGreen">+Población por edo.</button><button id="muestraTablaEdos" class="buttonGreen">+Lista de Municipios</button>
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
                                    <div class="column1 clickables" data-sources="Aeropuertos">
                                        <ion-icon name="airplane-outline"></ion-icon>
                                    </div>
                                    <div class="column2">
                                    Aeropuertos:<br><span class="resultNumber"></span>
                                    </div>
                                </div>
                            </td>
                            <td id="Presas">
                                <div class="row">
                                    <div class="column1 clickables" data-sources="Presas">
                                        <ion-icon name="water-outline"></ion-icon>
                                    </div>
                                    <div class="column2">
                                    Presas:<br><span class="resultNumber"></span>
                                    </div>
                                </div>
                            </td>
                            <td id="Colonias">
                                <div class="row">
                                    <div class="column1 clickables" data-sources="Colonias">
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
                                    <div class="column1 clickables" data-sources="Hospitales">
                                        <ion-icon name="medkit-outline"></ion-icon>
                                    </div>
                                    <div class="column2">
                                    Estab. de Salud:<br><span class="resultNumber"></span>
                                    </div>
                                </div>    
                            </td>
                            <td id="Supermercados">
                                <div class="row">
                                    <div class="column1 clickables" data-sources="Supermercados">
                                        <ion-icon name="cart-outline"></ion-icon>
                                    </div>
                                    <div class="column2">
                                    Supermercados:<br><span class="resultNumber"></span>
                                    </div>
                                </div> 
                            </td>
                            <td id="Hoteles">
                                <div class="row">
                                    <div class="column1 clickables" data-sources="Hoteles">
                                        <ion-icon name="business-outline"></ion-icon>
                                    </div>
                                    <div class="column2">
                                    Hoteles:<br><span class="resultNumber"></span>
                                    </div>
                                </div>
                            </td>
                            <td id="Gasolineras">
                                <div class="row">
                                    <div class="column1 clickables" data-sources="Gasolineras">
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
                                    <div class="column1 clickables" data-sources="Ganadero">
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
                </div>
                
                <div id="showTable" style="display:none">
                    <br>
                    <div id="table-container" class="tabla-datos" style="overflow-x:auto;">
                    </div>
                        <a href="#" id="csvPob" class="a-datos">Descarga esta información en formato .CSV</a>
                </div>
                <div id="showTableEdos" style="display:none">
                    <div id="table-municipios" class="tabla-datos" style="text-align:center; overflow-x:auto;">
                        <p style="background-color: white; color: black;">Lista de municipios por estado dentro del análisis</p>
                        <label>Cargando.</label>
                    </div>
                    <a href="#" id="csvMun" class="a-datos">Descarga esta lista en formato .CSV</a>
                </div>
            </div>
            <div id="map">
                <div class="loading-gif">
                    <img src="./img/loading.gif" alt="Cargando" style="display: none;">
                </div>
                <div class="cnpc-logos">
                    <img src="http://www.atlasnacionalderiesgos.gob.mx/Imagenes/Logos/SSyPC_CNPC_blanco.png" alt="CENACOM">
                </div>
            </div>
        </div>
    </div>
    
    <button id="botonTop" type="button" class="boton-volver" style="display: none;"><ion-icon name="arrow-up-outline"></ion-icon></button>
    <!-- Feature Table template  -->
  <script id="featureTable-template" type="text/x-handlebars-template">
    <a title="Cerrar" href="#" class="ui-btn ui-btn-inline ui-icon-delete ui-btn-icon-notext closeFeatures" style="border:none;margin:0"></a>
    <div class="tabs-container">
      <ul class="tabs">
        {{#each features}}
          {{#if @first}}
            <li class="tabs__item active" data-feature="{{this.shortName}}" data-parent="{{this.parent}}" data-layerId="{{this.layerId}}">{{this.name}}</li>
          {{else}}
            <li class="tabs__item" data-feature="{{this.shortName}}" data-parent="{{this.parent}}" data-layerId="{{this.layerId}}">{{this.name}}</li>
          {{/if}}
        {{/each}}
      </ul>
      <div class="panels">
        {{#each features}}
          {{#if @first}}
            <div class="panels__item active">
              <div id="panels__item-{{this.shortName}}"></div>
            </div>
          {{else}}
            <div class="panels__item">
              <div id="panels__item-{{this.shortName}}"></div>
            </div>
          {{/if}}
        {{/each}}
      </div>
    </div>
    <div><a href='#' id="downloadFeature">Descargar CSV</a></div>
  </script>
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
    <script src="js/features.js"></script>
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
            if (document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) {
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
