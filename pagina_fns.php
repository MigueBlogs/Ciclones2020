<?php
    function includeNav() {
        ?>
        <!-- IMPORTANTE AGREGAR REPARADOR DE ESTILOS -->
        <link rel="stylesheet" href="/css/fixStylesAlternative.css">
        <link rel="stylesheet" href="/css/onlyfornav.css">
        <!-- se tuvo que agregar este elemento de CSS para modificar las propiedades de bootstrap 4.3.1 y que el sub Nav Bar tenga una vista correcta -->
	    <link rel="stylesheet" href="./css/initialNav.css">
        <!-- sección de sub NavBar -->
        <nav id="mainNav" class="navbar navbar-inverse sub-navbar navbar-fixed-top">
            <div class="container containerNavBar">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#subenlaces">
                <span class="sr-only">Interruptor de Navegación</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                </button>
                <a href="http://www.preparados.gob.mx/">
                    <img id="chimali" src="http://www.atlasnacionalderiesgos.gob.mx/Imagenes/Logos/chimali.png" alt="Coordinación Nacional de Protección Civil">
                </a>
            </div>
            <div class="collapse navbar-collapse fixPosition" id="subenlaces">
                <ul class="nav navbar-nav navbar-right">
                    <?php $curPageName = substr($_SERVER["SCRIPT_NAME"],strrpos($_SERVER["SCRIPT_NAME"],"/")+1);
                        if ($curPageName == "evento.php") { ?>
                            <li><a href="index.php">Inicio</a></li>
                        <?php }
                        else { ?>
                            <li><a href="http://www.preparados.cenapred.unam.mx">Inicio</a></li>
                        <?php }
                    ?>
                    
                    <?php
                        if(isset($_SESSION['username'])) {
                    ?>
                        <!-- <li><a href="alta.php" class="sessionActive">Nuevo</a></li> -->
                        <li><a href="evento.php">Editar evento</a></li>
                        <li><a href="logout.php" class="sessionActive logout"  style="background-color:#9D2449;color:white;">Salir</a></li>
                    <?php
                        }
                    ?>
                </ul>
            </div>
            </div>
        </nav>
        <!-- myplugins.js complementa las funciones del toggle en el menú sel sub nav bar -->
        <script src="/js/myplugins.js"></script>
        <?php
    }

    function getFooter() {
        ?>
        <footer>
            <div class="footer-container">
                <div class="section logo">
                    <h4><img src="http://www.preparados.cenapred.unam.mx/blog/sites/default/files/inline-images/logofooter_0.png" alt="Gobierno de México"></h4>
                </div>
                <div class="section">
                    <h4>¿QUÉ ES PREPARADOS?</h4>
                    Es un portal que logra integrar, coordinar y supervisar el Sistema Nacional de Protección Civil para ofrecer prevención, auxilio y recuperación ante los desastres a toda la población, sus bienes y el entorno, a través de programas y acciones.
                </div>
                <div class="section">
                    <h4>Otros sitios de interés</h4>
                    <ul class="list">
                        <li class="list-item"><a href="https://datos.gob.mx/" target="_blank">Portal de datos abiertos</a></li>
                        <li class="list-item"><a href="https://www.gob.mx/accesibilidad" target="_blank">Declaración de accesibilidad</a></li>
                        <li class="list-item"><a href="https://www.gob.mx/privacidadintegral" target="_blank">Aviso de privacidad integral</a></li>
                        <li class="list-item"><a href="https://www.gob.mx/privacidadsimplificado" target="_blank">Aviso de privacidad simplificado</a></li>
                        <li class="list-item"><a href="https://www.gob.mx/terminos" target="_blank">Términos y condiciones</a></li>
                        <li class="list-item"><a href="https://www.gob.mx/terminos#medidas-seguridad-informacion" target="_blank">PolÃ­tica de seguridad</a></li>
                        <li class="list-item"><a href="https://www.gob.mx/sitemap" target="_blank">Mapa del sitio</a></li>
                    </ul>
                </div>
            </div>
        </footer>
        <?php
    }
?>