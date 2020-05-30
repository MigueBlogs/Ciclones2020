<?php
    function includeNav() {
        ?>
        <header>
            <nav id="mainNavHeader">
                <input class="trigger" type="checkbox" id="mainNavButton">
                <label for="mainNavButton"><a href="http://www.preparados.gob.mx" target="_blank"><img src="http://www.atlasnacionalderiesgos.gob.mx/Imagenes/Logos/chimali.png" alt="CNPC"></a></label>
                <ul>
                    <li><a href="http://www.preparados.gob.mx" target="_blank"><img src="http://www.atlasnacionalderiesgos.gob.mx/Imagenes/Logos/chimali.png" alt="CNPC"></a></li>
                    <li><a href="index.php">Inicio</a></li>
                    <li><a href="consulta.php">Consulta</a></li>
                    <?php
                        if(isset($_SESSION['username'])) {
                    ?>
                        <li><a href="alta.php" class="sessionActive">Nuevo</a></li>
                        <li><a href="logout.php" class="sessionActive logout">Salir</a></li>
                    <?php
                        }
                    ?>
                </ul>
            </nav>
        </header>
        <?php
    }

    function getFooter() {
        ?>
        <footer>
            <div class="footer-container">
                <div class="section logo">
                    <h4><img src="http://www.preparados.gob.mx/blog/sites/default/files/inline-images/logofooter_0.png" alt="Gobierno de México"></h4>
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