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
    <!-- Handlebars -->
	<script src="./lib/handlebars.js"></script>
    <!-- ARCGIS MAP's -->
	<link rel="stylesheet" href="https://js.arcgis.com/4.11/esri/css/main.css">
    <script src="https://js.arcgis.com/4.11/"></script>
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
                                        <p>Precipitación: <?=$e["LLUVIA"]? $e["LLUVIA"]."mm":"Sin registro"?></p>
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
                                    <p>Precipitación: <?=$e["LLUVIA"]? $e["LLUVIA"]."mm":"Sin registro"?></p>
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
                                        <p>Precipitación: <?=$e["LLUVIA"]? $e["LLUVIA"]."mm":"Sin registro"?></p>
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
                                    <p>Precipitación: <?=$e["LLUVIA"]? $e["LLUVIA"]."mm":"Sin registro"?></p>
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
            <div id="stormSelection">
                <div class="title">Ciclón tropical en el Pacífico</div>
                <div class="options">
                    <select name="stormsActive" id="stormsActive">
                        <option value="">Cargando</option>
                    </select>
                </div>
            </div>
            <div id="stormSelection2">
                <div class="title">Ciclón tropical en el Atlántico</div>
                <div class="options">
                    <select name="stormsActive2" id="stormsActive2">
                        <option value="">Cargando</option>
                    </select>
                </div>
            </div>
            <div id="map">
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

	<!-- <script id="autoresDefault-template" type="text/x-handlebars-template">
		{{#each autores as |autor|}}
			{{#if @last}}
				<span class="autor" data-autorId={{autor.idAutor}}>{{autor.nombre}}</span>
			{{else}}
				<span class="autor" data-autorId={{autor.idAutor}}>{{autor.nombre}}</span>,<br/>
			{{/if}}
		{{/each}}
	</script>

	<script id="activeEvents-template" type="text/x-handlebars-template">
		<select id="activeEventsOptions">
			{{#each activeEvents as |event|}}
				{{#if @first}}
					<option value="">Selecciona</option>
				{{/if}}
				<option value="{{event.idBoletin}}">{{event.nombre}}</option>
			{{else}}
				<option value="">Sin eventos</option>
			{{/each}}
		</select>
	</script>

	<script id="filesUploaded-template" type="text/x-handlebars-template">
		<ul id="filesUploadedList" class="filesList">
			{{#each files as |file|}}
			<li class="file-item"><span data-fileUrl="{{file.url}}" data-fileExt="{{file.ext}}">{{file.name}}</span><button data-fileUrl="{{file.url}}" class="deleteFile">Borrar</button></li>
			{{/each}}
		</ul>
	</script> -->
    <script src="js/map.js"></script>	
    <script src="js/funciones.js"></script>
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
        $('.collapsible').on('click', function(){
            let other = $('.collapsible').not(this);
            other.next().hide();
            // if ($('.collapsible.active').length == 0){
            //     $('#dataSection').css('height', '');
            //     $('#dataSection').css('width', '');
            // }
            // else {
            //     if ($(window).width() > 500) {
            //         // $('#dataSection').css('height', '100vh');
            //         // $('#dataSection').css('width', '15px');
            //     }
            // }
        });
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
