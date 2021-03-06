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
    <title>Temporada de Ciclones Tropicales 2021</title>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <!-- Styles -->
    <link rel="stylesheet" href="./css/main.css">
    <link rel="stylesheet" href="./css/styles.css">
    <!--JS IONICON-->
    <!-- se deahabilita el unpkg  porque da errores al cargar los ionicons -->
    <!-- <script src="https://unpkg.com/ionicons@5.1.2/dist/ionicons.js"></script> -->
    <script type="module" src="https://unpkg.com/ionicons@5.1.2/dist/ionicons/ionicons.esm.js" data-stencil-namespace="ionicons"></script>
    <script nomodule="" src="https://unpkg.com/ionicons@5.1.2/dist/ionicons/ionicons.js" data-stencil-namespace="ionicons"></script>
    <!-- <body translate="no"> -->
    <script src="https://unpkg.com/ionicons@5.1.2/dist/ionicons.js"></script>
    <!-- Material Icons -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!-- Handlebars -->
	<script src="./lib/handlebars.js"></script>
    <!-- ARCGIS MAP's -->
	<link rel="stylesheet" href="https://js.arcgis.com/4.15/esri/css/main.css">
    <script src="https://js.arcgis.com/4.15/dojo/dojo.js"></script>
    <!-- <script type="text/javascript" src="http://js.arcgis.com/3.20/"></script>
    <link rel="stylesheet" href="http://js.arcgis.com/3.20/dijit/themes/claro/claro.css">
    <link rel="stylesheet" href="http://js.arcgis.com/3.20/esri/css/esri.css"> -->
</head>
<body>
    <iframe id="iFrame-nav-gob" src="/nav.html" frameborder="0" style="width: 100%;height: 60px;margin-bottom: -5px;"></iframe>
    <?php includeNav(); ?>
    
    <div id="mapaDiv">
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
                                        <p>Precipitación: <?=$e["LLUVIA"]? $e["LLUVIA"]." L/m<sup>2</sup>":"Sin registro"?></p>
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
                                    <p>Precipitación: <?=$e["LLUVIA"]? $e["LLUVIA"]." L/m<sup>2</sup>":"Sin registro"?></p>
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
                    <!-- <div class="refugios-iconos"  style="padding: 2px; display:none;" id="clouds-div">
                        <div style="padding: 2px;">
                            <span class="material-icons">wb_cloudy</span>
                        </div>
                        <div style="padding: 5px;">&nbsp;
                            <label class="switch" style="vertical-align: middle;">
                                <input type="checkbox" id="nubes-checkbox2"> 
                                <span class="slider round"></span>
                            </label>
                        </div>
                    </div> -->
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
            <!-- <div id="timeDiv">
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
                <p style="margin: 0; padding: 5px; font-size: smaller;">Capa<br>Apagada</p>
            </div> -->
            <div id="analisis" style="display:none;">
                <ion-icon title="Minimizar Análisis" class="buttonCloseTable" name="remove-circle-outline"></ion-icon>
                <div class="wrap">
                    <ul class="tabs">
                        <li><a href="#tab1"><span>Análisis de Exposición</span></a></li>
                        <li id="attr"><a href="#tab2"><span>Atributos</span></a></li>
                    </ul>
                </div>
                <div class="secciones">
                    <article id="tab1">
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
                                            <div class="column1 clickable" id="Viviendas" data-sources="Población Urbana/Población Rural">
                                                <ion-icon name="home-outline"></ion-icon>
                                            </div>
                                            <div class="column2">
                                            Viviendas:<br><span class="resultNumber"></span>
                                            </div>
                                        </div>     
                                    </td>
                                    <td id="Escuelas">
                                        <div class="row">
                                            <!-- <div id="escuelas_type"></div> -->
                                            <div class="column1 clickable" data-sources="Escuelas">
                                                <ion-icon name="school-outline"></ion-icon>
                                            </div>
                                            <div class="column2">
                                            Escuelas:<br><span class="resultNumber"></span>
                                            </div>
                                        </div>     
                                    </td>
                                    <td id="Aeropuertos">
                                        <div class="row">
                                            <div class="column1 clickable" data-sources="Aeropuertos">
                                                <ion-icon name="airplane-outline"></ion-icon>
                                            </div>
                                            <div class="column2">
                                            Aeropuertos:<br><span class="resultNumber"></span>
                                            </div>
                                        </div>
                                    </td>
                                    <td id="Presas">
                                        <div class="row">
                                            <div class="column1 clickable" data-sources="Presas">
                                                <ion-icon name="water-outline"></ion-icon>
                                            </div>
                                            <div class="column2">
                                            Presas:<br><span class="resultNumber"></span>
                                            </div>
                                        </div>
                                    </td>
                                    <td id="Colonias">
                                        <div class="row">
                                            <div class="column1 clickable" data-sources="Colonias">
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
                                            <div class="column1 clickable" data-sources="Hospitales">
                                                <ion-icon name="medkit-outline"></ion-icon>
                                            </div>
                                            <div class="column2">
                                            Estab. de Salud:<br><span class="resultNumber"></span>
                                            </div>
                                        </div>    
                                    </td>
                                    <td id="Supermercados">
                                        <div class="row">
                                            <div class="column1 clickable" data-sources="Supermercados">
                                                <ion-icon name="cart-outline"></ion-icon>
                                            </div>
                                            <div class="column2">
                                            Supermercados:<br><span class="resultNumber"></span>
                                            </div>
                                        </div> 
                                    </td>
                                    <td id="Hoteles">
                                        <div class="row">
                                            <div class="column1 clickable" data-sources="Hoteles">
                                                <ion-icon name="business-outline"></ion-icon>
                                            </div>
                                            <div class="column2">
                                            Hoteles:<br><span class="resultNumber"></span>
                                            </div>
                                        </div>
                                    </td>
                                    <td id="Gasolineras">
                                        <div class="row">
                                            <div class="column1 clickable" data-sources="Gasolineras">
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
                                            <div class="column1 clickable" data-sources="Ganadero">
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
                    </article>
                    <article id="tab2">
                        <div id="escuelas_type"></div>
                        <div id="tableDiv"></div>
                        <div id="poblacion" class="container" style="display: none;">
                            <div class="wrap">
                                <ul class="tabsPob">
                                    <li><a href="#PobUrb"><span>Población urbana</span></a></li>
                                    <li><a href="#PobRur"><span>Población rural</span></a></li>
                                </ul>
                            </div>
                            <div class="seccionesPob">
                                    <article id="PobUrb">
                                        <div id="tableDivPobUrb"></div>
                                    </article>
                                    <article id="PobRur">
                                        <div id="tableDivPobRur"></div>
                                    </article>
                            </div>
                        </div>
                        <span id="defaultMsj">
                            Utiliza la "Herramienta de análisis" para obtener información de la zona o región que deseas analizar.
                            También puedes dar click sobre los íconos de tu interés en la pestaña de "Análisis de Exposición".
                        </span> 
                    </article>
                </div>
                
            </div>
            <div id="openBtn" style="display:none;" title="Mostrar análisis">
                <ion-icon name="caret-up-outline"></ion-icon>
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
    <iframe id="MyIframe" src="/footer.html" scrolling="no" width="100%" height="425.5px" style="border: 0px; margin-bottom: -5px;"></iframe>
    <script src="/js/nav-gob.js"></script>
    <script src="/js/footer.js"></script>
    <script>
        $(function(){
            if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
             
            setTimeout(function(){
                $('#MyIframe').css({'margin-top': 
                    // $('#mapaDiv').outerHeight() + 
                    $('#stormLabel').outerHeight() +
                    $('#stormSelection').outerHeight() +
                    $('#stormSelection2').outerHeight() +
                    $('#refugiosDiv').outerHeight() +
                    $('#map').outerHeight() +
                    'px'});
            }, 1000)
            }
        })
    </script>
    <!-- <div class="clickable">
        <ion-icon name="medkit-outline"></ion-icon> 
    </div> -->
    <button id="botonTop" type="button" class="boton-volver" style="display: none;"><ion-icon name="arrow-up-outline"></ion-icon></button>
    <!-- Resultados de análisis por tipo Template -->
    <script id="layersResultsType-template" type="text/x-handlebars-template">
        <div class="layersResultsType-container">
            <ul class="resultType-list">
            {{#each this}}
                <li class="resultType" data-type="{{this.tipo}}">{{this.tipo}}: <span class="typeNumber">{{this.total}}</span></li>
            {{/each}}
            </ul>
        </div>
    </script>
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
