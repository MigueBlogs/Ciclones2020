var captured=false;
var map;
var view;
window.captured;

var clickDraw;
var overDraw;
var dragDraw;
var dragStartDraw;
var dragEndDraw;
var drawVertex;
var endGraphic;
var lastVertex;

var exceptLayers = ["PoblacionITER"];

var lastGeometry;

var hour_delta = 0;
var timeExtentChanger;
var nubes_error = false;

$(function() {
    var featureLayer_urls = {
        "Hospitales": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/37",
        "Escuelas": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/39",
        "Supermercados": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/10",
        "Aeropuertos": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/41",
        "Hoteles": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/10",
        "Bancos": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/10",
        "Gasolineras": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/10",
        "Presas": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/43",
        "Ganadero": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/45",
        "Colonias": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/6",
        "Población Urbana": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/7",
        "Población Rural": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/12",
        "Zona Arqueológica": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/50",
        "Patrimonio Mundial": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/49",
        "Monumentos Históricos": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/51",
        "Museos": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/48",
        "Bibliotecas": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/47",
        "Álgica": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/15",
        "Yuto-Nahua": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/17",
        "Cochimí-Yumana": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/19",
        "Seri": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/21",
        "Oto-Mangue": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/23",
        "Maya": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/25",
        "Totonaco-Tepehua": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/27",
        "Tarasca": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/29",
        "Mixe-Zoque": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/31",
        "Chonatal": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/33",
        "Huave": "http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer/35"
    }
    function borrarCapas(){
        Object.keys(featureLayer_urls).forEach(function(key){
            if(map.findLayerById(key))
                map.remove(map.findLayerById(key));
        })
    }
    function changeTimeExtent(){
        let today = new Date();
        let end = new Date(today);
        end.setMinutes(end.getMinutes() - (end.getMinutes() % 10 + 20));
        end.setSeconds(0);
        end.setMilliseconds(0);

        let start = new Date(end);
        start.setDate(today.getDate()-1);
        
        start.setHours(start.getHours() + 1);
        let start_temp = new Date(start);
        start_temp.setHours(start_temp.getHours() + hour_delta);
        $('#timeDiv p').text(start_temp.toLocaleDateString() +"\n"+ start_temp.toLocaleTimeString());
        
        hour_delta += 1;
        if (hour_delta > 23){
            hour_delta = 0
        }
        let layer = map.findLayerById("TopClouds");
        layer.timeExtent = {
            start: start_temp,
            end: start_temp,
            useViewTime: false,
        };
    }
    function loadMap(container) {
        require([
            "esri/Map",
            "esri/views/MapView",
            "esri/config",
            "esri/widgets/Fullscreen",
            "esri/layers/GraphicsLayer",
            "esri/widgets/Sketch",
            "esri/layers/ImageryLayer",
            "esri/layers/support/MapImage",
            "esri/widgets/Home",
            "esri/geometry/support/geodesicUtils",
            "esri/geometry/support/webMercatorUtils",
            "esri/geometry/Polygon",
            "esri/Graphic",
            "esri/layers/FeatureLayer",
            "esri/geometry/geometryEngine"
        ], function(
            Map,
            MapView,
            esriConfig,
            Fullscreen,
            GraphicsLayer,
            Sketch,
            ImageryLayer,
            MapImage,
            Home,
            geodesicUtils,
            webMercatorUtils,
            Polygon,
            Graphic,
            FeatureLayer,
            geometryEngine
        ) {
            esriConfig.request.proxyUrl = "http://rmgir.cenapred.gob.mx/proxy/proxy.php";
            const layer = new GraphicsLayer({
                id: "tempGraphics"
            });
            map = new Map({
                basemap: "hybrid"
                //,
                // layers:[layer]
            });
            view = new MapView({
                container: container,
                map: map,
                center: [-101.608429, 23.200961],
                zoom: 5,
                constraints: {
                    rotationEnabled: false
                }
            });
            const textSymbol = {
                type: "text",  // autocasts as new TextSymbol()
                color: "white",
                haloColor: "black",
                haloSize: "4px",
                text: "",
                xoffset: 3,
                yoffset: 3,
                font: {  // autocast as new Font()
                  size: 20,
                  family: "sans-serif",
                  weight: "bold"
                }
              };
            const textSymbolPoint = {
                type: "text",  // autocasts as new TextSymbol()
                color: "white",
                haloColor: "black",
                haloSize: "4px",
                text: "",
                xoffset: 0,
                yoffset: 20,
                font: {  // autocast as new Font()
                  size: 14,
                  family: "sans-serif",
                  weight: "bold"
                }
              };
            view.when(function(event){

                function getInfo(feature) {
                    var attributes = feature.graphic.attributes;
                    var result = "";
                    Object.keys(attributes).forEach(function(key){
                        if (key == "objectid") {
                            return;
                        }
                        result = result + key + ': ' + attributes[key] + '<br>';
                    });
                    return result;
                }
                
                var properties = {
                    id: "refugios",  
                    opacity: 1,
                    showLabels: true,
                    outFields: ["*"],
                    visible: false,
                    definitionExpression: "1=0",
                    renderer: {
                        type: "simple",  // autocasts as new SimpleRenderer()
                        symbol: {
                            type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                            size: 5,
                            color: "red",
                            outline: {  // autocasts as new SimpleLineSymbol()
                                width: 0.5,
                                color: "white"
                            }
                        }
                    },
                    popupTemplate: {
                        title: "Detalles:",
                        content: getInfo,
                        outFields: ["*"]
                    }
                };
                
                const refugiosURL = "http://rmgir.proyectomesoamerica.org/server/rest/services/Hosted/RefugiosTemporalesCT/FeatureServer/0";

                addFeatureLayer(map, refugiosURL, properties);

                var weather = new ImageryLayer({
                    id: "TopClouds",
                    url: "https://satellitemaps.nesdis.noaa.gov/arcgis/rest/services/WST13_Last_24hr/ImageServer",
                    refreshInterval: 10, // every X minutes
                    noData: [0,0,0],
                    noDataInterpretation: "any",
                    pixelFilter: colorize,
                    useViewTime: false,
                });
                weather.when(
                    function(){
                        if (!$('#nubes-checkbox').is(":checked")){
                            return;
                        }
                        timeExtentChanger = setInterval(changeTimeExtent, 2000);
                        nubes_error = false;
                    },
                    function(error){
                        nubes_error = true;
                        $('#nubes-checkbox').prop("checked", false).attr("disabled", true);
                        $('#timeDiv p')
                            .css("background-color", "red")
                            .css("color", "white")
                            .text("Hubo un problema al cargar la información de nubes. Te pedimos refrescar la página.");
                        console.log(error);                        
                        // alert("Hubo un problema al cargar la información de nubes. Te pedimos refrescar la página.")
                    }
                )
                //console.log(weather);
                weather.opacity = 0.7;

                function colorize(pixelData) {
                    // If there isn't pixelData, a pixelBlock, nor pixels, exit the function
                    if (pixelData === null || pixelData.pixelBlock === null || pixelData.pixelBlock.pixels === null) {
                        return;
                    }
                    
                    // The pixelBlock stores the values of all pixels visible in the view
                    var pixelBlock = pixelData.pixelBlock;
                  
                    // Get the min and max values of the data in the current view
                    // var minValue = pixelBlock.statistics[0].minValue;
                    // var maxValue = pixelBlock.statistics[0].maxValue;
                  
                    // The mask is an array that determines which pixels are visible to the client
                    // pixelBlock.mask = [0, 0, 0];
                  
                    // The pixels visible in the view
                    var pixels = pixelBlock.pixels;
                  
                    // The number of pixels in the pixelBlock
                    var numPixels = pixelBlock.width * pixelBlock.height;
                  
                    // Calculate the factor by which to determine the red and blue
                    // values in the colorized version of the layer
                    // var factor = 255.0 / (maxValue - minValue);
                  
                    // Get the pixels containing temperature values in the only band of the data
                    var rband = pixels[0];
                    var gband = pixels[1];
                    var bband = pixels[2];
                    
                    // Create empty arrays for each of the RGB bands to set on the pixelBlock
                    var rBand = [];
                    var gBand = [];
                    var bBand = [];
                    var mask = [];
                  
                    // Loop through all the pixels in the view
                    for (i = 0; i < numPixels; i++) {
                        // Get the pixel value recorded at the pixel location
                        var r = rband[i];
                        var g = gband[i];
                        var b = bband[i];

                        rBand[i] = r;
                        gBand[i] = g;
                        bBand[i] = b;
                        mask[i] = 1;
                        //aBand[i] = 255;
                        // quita los azules y los colores oscuros
                        if ((b > g && b > r && r < 120 && g < 120) || (r < 50 && g < 50 && b < 50)){
                            // rBand[i] = 0;
                            // gBand[i] = 0;
                            // bBand[i] = 0;
                            mask[i] = 0;
                        }
                        else if (b > g && b > r && r >= 120 && g >= 120){
                            rBand[i] = b;
                            gBand[i] = b;
                            bBand[i] = b;
                            //mask[i] = 0;
                        }
                    }                  
                    pixelData.pixelBlock.mask = mask;
                    // Set the new pixel values on the pixelBlock (now three bands)
                    pixelData.pixelBlock.pixels = [rBand, gBand, bBand];
                    //pixelData.pixelBlock.addData({pixels: aBand})
                    pixelData.pixelBlock.pixelType = "u8"; // u8 is used for color
                }

                map.add(weather);
                //le puse 80 como valor arbitrario para que siempre esté en el TOP esta capa y se puedan hacer figuras de análisis sin problemas
                map.add(layer,80);
            });

            const sketch = new Sketch({
                layer: layer,
                view: view,
                creationMode: "single"
            });           
            
            var creando = false;
            view.ui.add(sketch, "top-right");
                sketch.on("create", function(event) {
                    $("#mensaje").remove();
                    //console.log("estoy creando:!",event)
                    creando=true;                
                    if(event.tool=="circle" || event.tool=="rectangle" || event.tool=="polygon"){
                        if (event.state === "complete") {
                            //previene que el usuario siga generando polígonos hasta que haya terminado de procesar y analisar la figura dibujada
                            $(".esri-sketch__button").addClass("sketchDisabled")
                            $(".esri-sketch__button").attr("disabled","");
                            var graphicSymbol = textSymbol;
                            lastGeometry = event.graphic.geometry;
                            realizarAnalisis(event.graphic.geometry, exceptLayers);
                            var temp =[];
                            event.graphic.geometry.rings[0].forEach( function(value,index){
                                    temp.push(webMercatorUtils.xyToLngLat(value[0],value[1]));
                                }
                            );

                            var polygon = new Polygon({rings: 
                                [temp]
                            })


                            const areas = geodesicUtils.geodesicAreas([polygon], "square-kilometers");
                            const area = areas[0].toLocaleString('es-MX', {maximumFractionDigits: 3});
                            graphicSymbol.text ="Área: "+area+" km²";

                            const graphic = new Graphic({
                                id: event.graphic.uid,
                                geometry: event.graphic.geometry.centroid,
                                symbol: graphicSymbol
                            });
                            // debugger
                            // console.log(graphic);

                            setTimeout(function(){ 
                                map.findLayerById("tempGraphics").add(graphic);
                                
                            }, 666);  
                            
                            $("#analisis").slideDown(3000);
                            createRandomText();
                            creando=false;
                        }
                    }else if(event.tool=="point"){
                        if(event.state === "complete"){
                            //previene que el usuario siga generando polígonos hasta que haya terminado de procesar y analisar la figura dibujada
                            $(".esri-sketch__button").addClass("sketchDisabled")
                            $(".esri-sketch__button").attr("disabled","");
                            lastGeometry = event.graphic.geometry;
                            var graphicSymbol = textSymbolPoint;
                            realizarAnalisis(event.graphic.geometry, exceptLayers);
                            var temp =[];
                            
                            temp[0] = event.graphic.geometry.latitude;
                            temp[1] = event.graphic.geometry.longitude;
                            
                            //console.log("Lat: ",temp[0].toFixed(2),"Long: ",temp[1].toFixed(2));
                            
                            graphicSymbol.text ="Lat: "+temp[0].toFixed(2)+", Long: "+temp[1].toFixed(2);
                            
                            const graphic = new Graphic({
                                id: event.graphic.uid,
                                geometry: {latitude:temp[0],longitude:temp[1],type:"point"},
                                symbol: graphicSymbol
                            });
                            
                            setTimeout(function(){ 
                                map.findLayerById("tempGraphics").add(graphic);
                                // //previene que el usuario elimine el análisis actual
                                // $(".esri-icon-trash").addClass("sketchDisabled")
                                // $(".esri-icon-trash").attr("disabled","");
                            }, 666);
                            $("#analisis").slideDown(3000);
                            createRandomText();
                            creando=false;
                        }else if(event.state === "cancel"){
                            creando=false;
                        }
                    }else if(event.tool=="polyline"){
                        if (event.state === "complete") {
                            //previene que el usuario siga generando polígonos hasta que haya terminado de procesar y analisar la figura dibujada
                            $(".esri-sketch__button").addClass("sketchDisabled")
                            $(".esri-sketch__button").attr("disabled","");
                            var graphicSymbol = textSymbol;
                            lastGeometry = event.graphic.geometry;
                            realizarAnalisis(event.graphic.geometry, exceptLayers);
                            
                            var temp =[];
                            event.graphic.geometry.paths[0].forEach( function(value,index){
                                    temp.push(webMercatorUtils.xyToLngLat(value[0],value[1]));
                                }
                            );

                            var polygon = new Polygon({rings: 
                                [temp]
                            });

                            const distancias = geodesicUtils.geodesicLengths([polygon], "kilometers");
                            const distancia = distancias[0].toLocaleString('es-MX', {maximumFractionDigits: 3});
                            graphicSymbol.text ="Distrancia: "+distancia+" km²";
                            const graphic = new Graphic({
                                id: event.graphic.uid,
                                //aqui no comprendo porque tuve que cambiar las coordenadas de posición (lat por long y viceversa pero así ya las dibuja)
                                geometry: {latitude:temp[0][1],longitude:temp[0][0],type:"point"},
                                symbol: graphicSymbol
                            });
                            //debugger
                            setTimeout(function(){ 
                                map.findLayerById("tempGraphics").add(graphic);
                                //debugger
                                // //previene que el usuario elimine el análisis actual
                                // $(".esri-icon-trash").addClass("sketchDisabled")
                                // $(".esri-icon-trash").attr("disabled","");
                            }, 666);  
                            
                            $("#analisis").slideDown(3000);
                            createRandomText();
                            creando=false;
                        }
                    }
                    
                }
            );
            
            sketch.on("update", function(event){
                
                //console.log("este es update: ",event);
                //previene que el usuario siga generando polígonos hasta que haya terminado de procesar y analisar la figura dibujada
                // debugger
                // $(".esri-sketch__button").addClass("sketchDisabled")
                // $(".esri-sketch__button").attr("disabled","");
                const eventInfo = event.toolEventInfo;
                //Evento cuando se mueve una gráfica de lugar sobre el mapa
                if (eventInfo && eventInfo.type.includes("move")){
                     //previene que el usuario elimine el análisis actual
                 $(".esri-icon-trash").addClass("sketchDisabled")
                 $(".esri-icon-trash").attr("disabled","");
                  //se verifica el caso cuando es el movimiento de un punto
                  if(event.graphics[0].geometry.type=="point"){
                    if(eventInfo.type=="move-stop"){
                        // ocultar capa de municipios
                          let layer = map.findLayerById("municipios");
                          layer.opacity = 0;
                          layer.definitionExpression = "1=0";
                        //buscamos la nueva posición
                            var graphicSymbol = textSymbolPoint;
                            var temp =[];
                            
                            temp[0] = event.graphics[0].geometry.latitude;
                            temp[1] = event.graphics[0].geometry.longitude;

                            graphicSymbol.text ="Lat: "+temp[0].toFixed(2)+", Long: "+temp[1].toFixed(2);

                          // buscar capa de texto para actualizar posición
                          map.findLayerById("tempGraphics").graphics.forEach(function(graphic){
                              
                              if(graphic.id==event.graphics[0].uid){
                                  graphic.geometry = {latitude:temp[0],longitude:temp[1],type:"point"};
                                  graphic.symbol.text=graphicSymbol.text;
                              } 
                          });
                          realizarAnalisis(event.graphics[0].geometry, exceptLayers);
                          createRandomText();
                          $("#analisis").slideDown(3000);
                        }
                  }else if(event.graphics[0].geometry.type=="circle" || event.graphics[0].geometry.type=="rectangle" || event.graphics[0].geometry.type=="polygon"){
                    if(eventInfo.type=="move-stop"){
                    // ocultar capa de municipios
                        let layer = map.findLayerById("municipios");
                        layer.opacity = 0;
                        layer.definitionExpression = "1=0";
                        // buscar capa de texto para actualizar posición
                        map.findLayerById("tempGraphics").graphics.forEach(function(graphic){
                            
                            if(graphic.id==event.graphics[0].uid){
                                graphic.geometry = event.graphics[0].geometry.centroid;
                            } 
                        });
                        realizarAnalisis(event.graphics[0].geometry, exceptLayers);
                        createRandomText();
                        $("#analisis").slideDown(3000);
                    } 
                  }else if(event.graphics[0].geometry.type=="polyline"){
                        if(eventInfo.type=="move-stop"){
                            // ocultar capa de municipios
                            let layer = map.findLayerById("municipios");
                            layer.opacity = 0;
                            layer.definitionExpression = "1=0";
                            //buscar nueva posición del punto para colocar el texto
                            var temp =[];
                            event.graphics[0].geometry.paths[0].forEach( function(value,index){
                                    temp.push(webMercatorUtils.xyToLngLat(value[0],value[1]));
                                }
                            );

                            var polygon = new Polygon({rings: 
                                [temp]
                            });
                            
                            // buscar capa de texto para actualizar posición
                            map.findLayerById("tempGraphics").graphics.forEach(function(graphic){
                                
                                if(graphic.id==event.graphics[0].uid){
                                    graphic.geometry = {latitude:temp[0][1],longitude:temp[0][0],type:"point"};
                                } 
                            });
                            realizarAnalisis(event.graphics[0].geometry, exceptLayers);
                            createRandomText();
                            $("#analisis").slideDown(3000);
                        }
                  } 
                }
                //evento para cuando se modifica un polígono ya dibujado sobre el mapa
                if (eventInfo && eventInfo.type.includes("reshape")){
                     //previene que el usuario elimine el análisis actual
                 $(".esri-icon-trash").addClass("sketchDisabled")
                 $(".esri-icon-trash").attr("disabled","");
                   //console.log(eventInfo.type, eventInfo, eventInfo.dy);
                    if(eventInfo.type=="reshape-stop"){
                        // ocultar capa de municipios
                        let layer = map.findLayerById("municipios");
                        layer.opacity = 0;
                        layer.definitionExpression = "1=0";
                        
                        if(event.graphics[0].geometry.type=="polyline"){
                            //recalcula la distancia en caso de polilínea
                            var tempPoly =[];
                            event.graphics[0].geometry.paths[0].forEach( function(value,index){
                                    tempPoly.push(webMercatorUtils.xyToLngLat(value[0],value[1]));
                                }
                            );

                            var polygon = new Polygon({rings: 
                                [tempPoly]
                            });

                            const distancias = geodesicUtils.geodesicLengths([polygon], "kilometers");
                            const distancia = distancias[0].toLocaleString('es-MX', {maximumFractionDigits: 3});
                            var textoNuevo ="Distrancia: "+distancia+" km²";

                        }else{
                            //recalcula el área en caso de Polígono
                            var temp =[];
                            event.graphics[0].geometry.rings[0].forEach( function(value,index){
                                temp.push(webMercatorUtils.xyToLngLat(value[0],value[1]));
                            }
                            );
                            var polygon = new Polygon({rings: 
                                [temp]
                            });
                            const areas = geodesicUtils.geodesicAreas([polygon], "square-kilometers");
                            const area = areas[0].toLocaleString('es-MX', {maximumFractionDigits: 3});
                            var textoNuevo ="Área: "+area+" km²";
                        
                        }
                        
                        //busca la figura del texto y remplaza contenido
                        map.findLayerById("tempGraphics").graphics.forEach(function(graphic){
                            if(graphic.id==event.graphics[0].uid){
                                graphic.symbol.text = textoNuevo;
                                if(event.graphics[0].geometry.type=="polyline"){
                                    graphic.geometry = {latitude:tempPoly[0][1],longitude:tempPoly[0][0],type:"point"}
                                }else{
                                    graphic.geometry = event.graphics[0].geometry.centroid;
                                }
                            } 
                        });

                        realizarAnalisis(event.graphics[0].geometry, exceptLayers);
                        createRandomText();
                        $("#analisis").slideDown(3000);
                    }
                  }
                //evento para cuando se reescala un polígono de análisis
                if (eventInfo && eventInfo.type.includes("scale")){
                     //previene que el usuario elimine el análisis actual
                    $(".esri-icon-trash").addClass("sketchDisabled")
                    $(".esri-icon-trash").attr("disabled","");
                    //console.log(eventInfo.type, eventInfo.dx, eventInfo.dy);
                    // if(eventInfo.type=="scale-stop"){
                    // // ocultar capa de municipios
                    // let layer = map.findLayerById("municipios");
                    // layer.opacity = 0;
                    // layer.definitionExpression = "1=0";
                    // realizarAnalisis(event.graphics[0].geometry, exceptLayers);
                    // createRandomText();
                    // $("#analisis").slideDown(3000);
                    // }
                    if(eventInfo.type=="scale-stop"){
                        // ocultar capa de municipios
                        let layer = map.findLayerById("municipios");
                        layer.opacity = 0;
                        layer.definitionExpression = "1=0";
                        
                        if(event.graphics[0].geometry.type=="polyline"){
                            //recalcula la distancia en caso de polilínea
                            var tempPoly =[];
                            event.graphics[0].geometry.paths[0].forEach( function(value,index){
                                    tempPoly.push(webMercatorUtils.xyToLngLat(value[0],value[1]));
                                }
                            );

                            var polygon = new Polygon({rings: 
                                [tempPoly]
                            });

                            const distancias = geodesicUtils.geodesicLengths([polygon], "kilometers");
                            const distancia = distancias[0].toLocaleString('es-MX', {maximumFractionDigits: 3});
                            var textoNuevo ="Distrancia: "+distancia+" km²";

                        }else{
                            //recalcula el área en caso de Polígono
                            var temp =[];
                            event.graphics[0].geometry.rings[0].forEach( function(value,index){
                                temp.push(webMercatorUtils.xyToLngLat(value[0],value[1]));
                            }
                            );
                            var polygon = new Polygon({rings: 
                                [temp]
                            });
                            const areas = geodesicUtils.geodesicAreas([polygon], "square-kilometers");
                            const area = areas[0].toLocaleString('es-MX', {maximumFractionDigits: 3});
                            var textoNuevo ="Área: "+area+" km²";
                        
                        }
                        
                        //busca la figura del texto y remplaza contenido
                        map.findLayerById("tempGraphics").graphics.forEach(function(graphic){
                            if(graphic.id==event.graphics[0].uid){
                                graphic.symbol.text = textoNuevo;
                                if(event.graphics[0].geometry.type=="polyline"){
                                    graphic.geometry = {latitude:tempPoly[0][1],longitude:tempPoly[0][0],type:"point"}
                                }else{
                                    graphic.geometry = event.graphics[0].geometry.centroid;
                                }
                            } 
                        });

                        realizarAnalisis(event.graphics[0].geometry, exceptLayers);
                        createRandomText();
                        $("#analisis").slideDown(3000);
                    }
                }
                
              });
            
            sketch.on("delete", function(event) {
                borrarCapas();
                $("#analisis").slideUp(3000);
                // ocultar capa de municipios
                let layerColor = map.findLayerById("municipios");
                layerColor.opacity = 0;
                layerColor.definitionExpression = "1=0";

                event.graphics.forEach(function(graphic){
                    if(graphic.id==null){
                        //Si es un polígono busca el texto en el layer.graphics que tengan por igual el uid(polygon) y el id(texto)
                        layer.graphics.forEach(function(graficoTexto){
                            if(graphic.uid==graficoTexto.id){
                                layer.graphics.remove(graficoTexto);
                            }
                        });
                    }else{
                        //Si es texto busca el polígono en el layer.graphics que tenga por igual el id(texto) y el uid(polygon)
                        layer.graphics.forEach(function(graficoPolygon){
                            if(graphic.id==graficoPolygon.uid){
                                layer.graphics.remove(graficoPolygon);
                            }
                        });
                    }
                  //console.log("deleted", graphic)
                });
            });

            view.on("click", function(mapClick) {
                // console.log("le di click a algo");
                setTimeout(function(){
                    function openBox(){
                        if((document.querySelector(".esri-popup__header-container--button") !== null) && ($(window).width()<500)){
                            if(!$(".esri-popup__content").is(":visible")){
                                document.querySelector(".esri-popup__header-container--button").click(); 
                                setTimeout(function(){
                                    openBox();
                                },1500)
                            }else{
                                return 0;
                            }
                        }else{
                            return 0;
                        }
                    }
                    openBox();
                },1000);
                //console.log("creando: ",creando);
                setTimeout(function(){
                    if(!creando){
                        $("#mensaje").remove();
                        var currentPoint = view.toMap(mapClick);
                        var tamano = layer.graphics.items.length-1;
                        //console.log("este es el tamaño del array: ",tamano);
                        layer.graphics.items.forEach(function(grafico,index){
                            // console.log("Estoy revisando el elemento: ",index)
                            // console.log(grafico.geometry);
                            // console.log(currentPoint);
                            if(grafico.geometry.type=="polygon" || grafico.geometry.type=="circle" || grafico.geometry.type=="rectangle" ){
                                var intersects = geometryEngine.intersects(grafico.geometry, currentPoint);
                                if(intersects){
                                    //mantiene selección
                                    // console.log("El punto intersecciona con el polígono: ",grafico.id)
                                    return true;
                                    
                                }else{
                                    // console.log("El punto no intersecciona")
                                    //pregunta si ya se han revisado todos los elementos del array
                                    if(index>=tamano){
                                        //si ya se revisaron todos y ninguno intersecta entonces:
                                        
                                        //Deselecciona
                                        setTimeout(function(){
                                            $("#mensaje").remove();
                                            document.querySelector('[aria-label="Dibujar punto"]').click();
                                            document.querySelector('[aria-label="Transformar"]').click();
                                        },6);
                                        //Vulve a funcionar el sketch
                                        $(".esri-sketch__button").removeClass("sketchDisabled");
                                        $(".esri-sketch__button").removeAttr("disabled","");
                                        $(".esri-icon-trash").removeClass("sketchDisabled")
                                        $(".esri-icon-trash").removeAttr("disabled","");
                                        $('.loading-gif img').hide();
                                        
                                    }else{
                                        // console.log("sigo buscando...")
                                    }
                                    
                                } 
                            }else{
                                if($("#mensaje").length){
                                    //no hacer nada
                                }else{
                                    $(".esri-sketch__info-panel").append("<p style='font-size: small;' id='mensaje'>Presiona ESC para <br> cancelar selección actual</p>");
                                }
                                $(document).on('keydown', function(event) {
                                    if (event.key == "Escape") {
                                        $("#mensaje").remove();
                                    }
                                });
                            }
                        });
                        mapClick.preventDefault()
                        mapClick.stopPropagation();
                    }
                },50);
                
            });


            view["ui"]["components"] = ["attributtion"];
            view.when(function() {
                loadCiclones(map);
                //loadKMLLayer(map, view, "https://www.nhc.noaa.gov/storm_graphics/api/AL072017_002Aadv_CONE.kmz", {id: "willa_cone"});

                const viewUpdating = view.watch("updating", function(){
                    viewUpdating.remove();
                    searchCicloneCones(map, view);
                });
            });
            var homeWidget = new Home({
                view: view
            });
              
            // adds the home widget to the top right corner of the MapView
            view.ui.add(homeWidget, "top-right");
            view.ui.add(
                new Fullscreen({
                    view: view
                    //element: applicationDiv
                }),
                "top-right"
            );
            // map.on("load", function (event){
                
            //     search = new Search({
            //       map: map
            //     }, "ui-dijit-search");
            //     search.startup();
    
            //     basemapGallery = new BasemapGallery({
            //     showArcGISBasemaps: true,
            //     map: map
            //     }, "basemapGallery");
            //     basemapGallery.startup();
    
            //     geoLocate = new LocateButton({
            //       map: map
            //     }, "LocateButton");
            //     geoLocate.startup();
    
            //     home = new HomeButton({
            //       map: map
            //     }, "HomeButton");
            //     home.startup();
    
            //     editToolbar = new Edit(map);
            //     map.on("click", function(evt) {
            //       editToolbar.deactivate();
            //     });
    
            //     map.on("mouse-move", showCoordinates);
            //     map.on("mouse-drag", showCoordinates);
            //     //showScale();
            //     map.on("zoom-end", showScale);
    
            //     map.addLayer(bufferGraphics);
    
            //     //createGraphicsMenu();
            //     initToolbar();
            // });
            
            function initToolbar() {
            var totalDistance = 0;
            var textSymbol;
            var extraTextSymbol;
            var point;
            var extraPoint;
            var distanceRequest;
            var font = new Font("18px", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLDER, "sans-serif");
            tb = new Draw(view);
            tb.on("draw-end", addGraphic);
            //on(dom.byId("info"), "click", function (evt) {
            $("#analisis span button").click(function (evt) {
                if (evt.target.id === "BtnLimpiar") {
                    if(tb) tb.deactivate();
                    map.enableMapNavigation();
                    if(clickDraw) clickDraw.remove();
                    if(overDraw) overDraw.remove();
                    if(dragDraw) dragDraw.remove();
                    if(dragStartDraw) dragStartDraw.remove();
                    if(dragEndDraw) dragEndDraw.remove();
                    if(locationEventClick) locationEventClick.remove();
                    $("#toolbar span").removeClass("active");
                    return;
                }
                $("#analisis span").removeClass("active");
                $(this).addClass("active");
                var dibujo = evt.target.id;
                map.graphics.clear();
                var tool = evt.target.id.toLowerCase();
                map.disableMapNavigation();
                if(tb) tb.deactivate();
                tb.activate(tool);
                drawVertex = [];
                // identify.remove();
                if(dibujo === "Polygon"){
                    clickDraw = map.on("click", function(evt){
                        drawVertex.push(evt.mapPoint);
                        if (endGraphic) { //if an end label already exists remove it
                            map.graphics.remove(endGraphic);
                        }
                        if(drawVertex.length >= 2){
                            if(distanceRequest) distanceRequest.cancel();
                            distanceParams.geometry1 = drawVertex[drawVertex.length - 2];
                            distanceParams.geometry2 = drawVertex[drawVertex.length - 1];
                            distanceParams.geodesic = true;
                            point = new Point((distanceParams.geometry1.x + distanceParams.geometry2.x)/2, (distanceParams.geometry1.y + distanceParams.geometry2.y)/2, distanceParams.geometry1.spatialReference);
                            distanceRequest = geometryService.distance(distanceParams, function(distance){
                                totalDistance += distance;
                                textSymbol = new TextSymbol(distance < 1000 ? agregasComas(distance.toFixed(2)) + " m" : agregasComas((distance/1000).toFixed(2)) + " km", font, new Color([255, 255, 255]));
                                textSymbol.horizontalAlignment = "center";
                                textSymbol.verticalAlignment = "top";
                                map.graphics.add(Graphic(point, textSymbol));
                                console.log("Acumulado: ", totalDistance.toFixed(2));
                            })
                        }
                        if(drawVertex.length >= 3){
                            distanceParams.geometry1 = drawVertex[drawVertex.length - 1];
                            distanceParams.geometry2 = drawVertex[0]
                            distanceParams.geodesic = true;
                            extraPoint = new Point((distanceParams.geometry1.x + distanceParams.geometry2.x)/2, (distanceParams.geometry1.y + distanceParams.geometry2.y)/2, distanceParams.geometry1.spatialReference);
                            geometryService.distance(distanceParams, function(distance){
                                extraTextSymbol = new TextSymbol(distance < 1000 ? agregasComas(distance.toFixed(2)) + " m" : agregasComas((distance/1000).toFixed(2)) + " km", font, new Color([255, 255, 255]));
                                extraTextSymbol.horizontalAlignment = "center";
                                extraTextSymbol.verticalAlignment = "top";
                                if (lastVertex) { //if an end label already exists remove it
                                    map.graphics.remove(lastVertex);
                                }
                                lastVertex = new Graphic(extraPoint, extraTextSymbol);
                                map.graphics.add(lastVertex);
                            });
                        }
                    });
                    overDraw = map.on("mouse-move", function(evt){
                        if(distanceRequest) distanceRequest.cancel();
                        if(drawVertex.length >= 1){
                            distanceParams.geometry1 = drawVertex[drawVertex.length - 1];
                            distanceParams.geometry2 = evt.mapPoint;
                            distanceParams.geodesic = true;
                            point = new Point((distanceParams.geometry1.x + distanceParams.geometry2.x)/2, (distanceParams.geometry1.y + distanceParams.geometry2.y)/2, distanceParams.geometry1.spatialReference);
                            distanceRequest = geometryService.distance(distanceParams, function(distance){
                                textSymbol = new TextSymbol(distance < 1000 ? agregasComas(distance.toFixed(2)) + " m" : agregasComas((distance/1000).toFixed(2)) + " km", font, new Color([255, 255, 255]));
                                textSymbol.horizontalAlignment = "center";
                                textSymbol.verticalAlignment = "top";
                                if (endGraphic) { //if an end label already exists remove it
                                    map.graphics.remove(endGraphic);
                                }
                            endGraphic = new Graphic(point, textSymbol);
                            map.graphics.add(endGraphic);
                            })
                        }
                    });
                } else if(dibujo === "Circle"){
                    dragStartDraw = map.on("mouse-drag-start", function(evt){
                        drawVertex.push(evt.mapPoint);
                    });
                    dragEndDraw = map.on("mouse-drag-end", function(evt){
                        if(distanceRequest) distanceRequest.cancel();
                        if (endGraphic) { //if an end label already exists remove it
                            map.graphics.remove(endGraphic);
                        }
                        distanceParams.geometry1 = drawVertex[0];
                        distanceParams.geometry2 = evt.mapPoint;
                        distanceParams.geodesic = true;
                        point = distanceParams.geometry1;
                        distanceRequest = geometryService.distance(distanceParams, function(distance){
                            drawVertex.push(evt.mapPoint);
                            textSymbol = new TextSymbol("Radio: " + (distance < 1000 ? agregasComas(distance.toFixed(2)) + " m" : agregasComas((distance/1000).toFixed(2)) + " km"), font, new Color([255, 255, 255]));
                            textSymbol.horizontalAlignment = "center";
                            textSymbol.verticalAlignment = "top";
                            map.graphics.add(Graphic(point, textSymbol));
                        });
                    })
                    dragDraw = map.on("mouse-drag", function(evt){
                        if(distanceRequest) distanceRequest.cancel();
                        distanceParams.geometry1 = drawVertex[0];
                        distanceParams.geometry2 = evt.mapPoint;
                        distanceParams.geodesic = true;
                        point = distanceParams.geometry1;
                        distanceRequest = geometryService.distance(distanceParams, function(distance){
                            textSymbol = new TextSymbol("Radio: " + (distance < 1000 ? agregasComas(distance.toFixed(2)) + " m" : agregasComas((distance/1000).toFixed(2)) + " km"), font, new Color([255, 255, 255]));
                            textSymbol.horizontalAlignment = "center";
                            textSymbol.verticalAlignment = "top";
                            if (endGraphic) { //if an end label already exists remove it
                                map.graphics.remove(endGraphic);
                            }
                            endGraphic = new Graphic(point, textSymbol);
                            map.graphics.add(endGraphic);
                        });
                    })
                } else {
                    if(clickDraw) clickDraw.remove();
                    if(overDraw) overDraw.remove();
                    if(dragDraw) dragDraw.remove();
                    if(dragStartDraw) dragStartDraw.remove();
                    if(dragEndDraw) dragEndDraw.remove();
                  }
              });
          };
        //   function addGraphic(evt) {
        //     $("#analisis span").removeClass("active");
        //     if(clickDraw) clickDraw.remove();
        //     if(overDraw) overDraw.remove();
        //     if(dragDraw) dragDraw.remove();
        //     if(dragStartDraw) dragStartDraw.remove();
        //     if(dragEndDraw) dragEndDraw.remove();
        //     var geometry = evt.geometry;
        //       //deactivate the toolbar and clear existing graphics
        //       tb.deactivate();
        //       map.enableMapNavigation();

        //       // figure out which symbol to use
        //       var symbol;
        //       if (evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
        //           symbol = markerSymbol;
        //       } else if (evt.geometry.type === "line" || evt.geometry.type === "polyline") {
        //           symbol = lineSymbol;
        //       }
        //       else {
        //           symbol = fillSymbol;
        //       }

        //       map.graphics.add(new Graphic(geometry, symbol));

        //       //Calculo de área y perímetro
        //       calcularAreaPerimetro(geometry);

        //       //Funciones geo --> outStatistics
        //       showElem();
        //       createRandomText();
        //       lastGeometry = evt.geometry;
        //       realizarAnalisis(evt.geometry, exceptLayers);

        //       // Poblacion mundial
        //       $("#world").css("display", "block");
        //       $("#world").on("click", function(){
        //         $("#world").unbind();
        //         $("#worldPopulation").css("display", "block");
        //         $("#world").css("display", "none");

        //         // Población mundial
        //         createWorldPopulationRandomText();
        //         var features= [];
        //         features.push(new Graphic(evt.geometry, symbol));

        //         var featureSet = new FeatureSet();
        //         featureSet.features = features;
                
        //         var params = { "inputPoly": featureSet };
        //         worldPopulationGP.execute(params);
        //         worldPopulationGP.on("execute-complete", function(evtObj){
        //           clearInterval(randomWorldTextInterval);
        //           var valor;
        //           var results = evtObj.results;
        //           valor = {number:results[0].value.features[0].attributes.SUM};
      
        //           valorNuevo = new Intl.NumberFormat("en-US").format(valor.number);    
                  
        //           console.log(valorNuevo);
        //           $("#worldPopulationResult").text(valorNuevo.split(".",1));
        //         });
        //       });
        //   };
        });
           
    }  
    function disabledButtons(){

    }

    function addFeatureLayer(map, url, properties,index=0) {
        require([
            "esri/layers/FeatureLayer"
        ], function(
            FeatureLayer
        ) {
            const layer = new FeatureLayer(url, properties);
            if(index==0){
                map.add(layer);
            }else if(index > 0){
                map.add(layer,index);
            }
            
        });
    }

    function addMapImageLayer(map, options) {
        require([
            "esri/layers/MapImageLayer",
            "esri/layers/support/Sublayer"
        ], function(
            MapImageLayer
        ) {
            const layer = new MapImageLayer(options);
            map.add(layer);
        });
    }

    function addImageToMapImage(map, layerId, imageUrl, imageOptions, type) {
        require([
            "esri/geometry/Extent",
            "esri/layers/support/MapImage"
        ], function(
            Extent,
            MapImage
        ) {
            var tipos = {
                "topClouds": new Extent({
                    xmax: -44.5,
                    xmin: -122.5,
                    ymax: 35,
                    ymin: -2,
                    spatialReference: new SpatialReference(4326)
                }),
                "rgbClouds": new Extent({
                    xmax: -78.9325,
                    xmin: -125.19056,
                    ymax: 34.7925,
                    ymin: 6.295,
                    spatialReference: new SpatialReference(4326)
                })
            };
          
            var image = new MapImage({
                'extent': tipos[layerId],
                'href': imageUrl
            });
            
            if(!map.findLayerById(layerId)) return
            
            map.findLayerById(layerId).addImage(image);
            var images = map.findLayerById(layerId).getImages();
            if(images.length >= 3) map.findLayerById(layerId).removeImage(images[0]);

        });
    }

    function loadKMLLayer(map, mapView, url, properties, renderer = null) {
        require([
            "esri/layers/KMLLayer"
        ], function(
            KMLLayer
        ) {
            const layer = new KMLLayer(url, properties);
            map.add(layer);

            mapView
                .whenLayerView(layer)
                .then(function(layerView) {
                    const handler = mapView.watch("updating", function() {
                        handler.remove();
                        const layerViewCreated = new CustomEvent("kml-added", {
                            detail: {
                                map: map,
                                view: mapView,
                                id: layerView["layer"]["id"],
                                geometries: {
                                    polygons: layerView["allVisiblePolygons"]["items"],
                                    points: layerView["allVisiblePoints"]["items"],
                                    polylines: layerView["allVisiblePolylines"]["items"]
                                }
                            }
                        });
    
                        document.dispatchEvent(layerViewCreated);
                    });
                });
        });
    }

    function searchCicloneCones(map, mapView) {    
        var activeConesAT = [];
        var activeConesEP = [];
        let EPAT = map.findLayerById("EPAT_forecastCone");

        EPAT.queryFeatures().then(function(results) {
            
            results["features"].forEach(function(result, resultIdx) {
                
                // debugger;
                //var eventActive = result["layer"]["id"].split("_")[0];
                let sea = result["attributes"]["BASIN"];
                
                if (sea == "EP"){
                    activeConesEP.push({
                        stormname: result["attributes"]["STORMNAME"],
                        stormtype: result["attributes"]["STORMTYPE"],
                        geometry: result["geometry"],
                        maxwind: result["attributes"]["maxwind"],
                        layerid: result["layer"]["id"]
                    });
                }
                else {
                    activeConesAT.push({
                        stormname: result["attributes"]["STORMNAME"],
                        stormtype: result["attributes"]["STORMTYPE"],
                        geometry: result["geometry"],
                        maxwind: result["attributes"]["maxwind"],
                        layerid: result["layer"]["id"]
                    });
                }
                
            });

            var templateSource = $("#stormsActiveEP-template").html();
            var template = Handlebars.compile(templateSource);
            var outputHTML = template({storms: activeConesEP});
            $("#stormsActive").html(outputHTML);

            var templateSource2 = $("#stormsActiveAT-template").html();
            var template2 = Handlebars.compile(templateSource2);
            var outputHTML2 = template({storms: activeConesAT});
            $("#stormsActive2").html(outputHTML2);

            $('#tablaEditar').show();
            $('#loading_table').hide();
            //loadEdo([]);

            $("#stormsActive, #stormsActive2").on("change", function() {
                let select = $(this);
                require([
                    "esri/tasks/GeometryService",
                    "esri/tasks/support/ProjectParameters",
                    "esri/tasks/support/Query"
                ], function(
                    GeometryService,
                    ProjectParameters,
                    Query
                ) {
                    
                    var layerid = "EPAT_forecastCone";
                    var EP_storm = $("#stormsActive").children("option:selected").val();
                    var AT_storm = $("#stormsActive2").children("option:selected").val();
                    //si no hay Evento en la selección
                    if(EP_storm == undefined && AT_storm == undefined) {
                        
                        let ocean = $(select).attr("ocean");
                        map.allLayers.map(function(layer) {
                            if (layer["id"] == "EP_Area_5d_area" || layer["id"] == "EP_Area_5d_label"){
                                return;
                            }
                            if (ocean == "A" && layer["id"].indexOf("AT") != -1){
                                layer.visible = false;
                            }
                            else if (ocean == "P" && layer["id"].indexOf("EP") != -1){
                                console.log(layer["id"]);
                            }
                        });
                        return;
                    }
                    let tormentas = []
                    if (EP_storm) {tormentas.push(EP_storm)}
                    if (AT_storm) {tormentas.push(AT_storm)}

                    // let query = new Query();
                    // query.returnGeometry = true;
                    // query.outFields = [ "*" ];
                    // query.outSpatialReference = view["spatialReference"];
                    // query.where = "STORMNAME in ('" + tormentas.join("','") + "')";

                    //var layer = map.findLayerById(layerid);
                    var event = layerid.split("_")[0];

                    map.allLayers.map(function(layer) {
                        if (layer["id"] == "EP_Area_5d_area" || layer["id"] == "EP_Area_5d_label"){
                            return;
                        }
                        if(layer["id"].indexOf(event) != -1){
                            layer.definitionExpression = "STORMNAME in ('" + tormentas.join("','") + "')";
                            layer.visible = true;  
                        } 
                        // else if(layer["id"].indexOf("AT") != -1 || layer["id"].indexOf("EP") != -1) {
                        //     layer.visible = false;
                        // }
                    });

                    var coneActive = activeConesAT.filter(function(activeConesAT) { 
                        //debugger;
                        if(activeConesAT["stormname"] == AT_storm) return activeConesAT; 
                    })[0];
                    
                    var coneActive2 = activeConesEP.filter(function(activeConesEP) {
                        //debugger;
                        if(activeConesEP["stormname"] == EP_storm) return activeConesEP; 
                    })[0];

                    let geometries = [];

                    if (coneActive) {
                        geometries.push(coneActive["geometry"])
                    }
                    if (coneActive2) {
                        geometries.push(coneActive2["geometry"])
                    }

                    if (geometries.length == 0) {
                        $('#vientos-div').hide();
                        map.findLayerById("area_34KtWinds").visible = false;
                        return;
                    }
                    $('#vientos-div').show();
                    if ($("#vientos-checkbox").is(":checked")){
                        map.findLayerById("area_34KtWinds").visible = true;
                    }
                    
                    var geometryService = new GeometryService({ url: "http://rmgir.proyectomesoamerica.org/server/rest/services/Utilities/Geometry/GeometryServer" });
                    geometryService.union(geometries).then(function(res) { 
                        if(res && res.extent) {
                            let extent = res.extent.expand(1.5);
            
                            view.extent = extent;
                        }
                    })
                })
            });
            function seleccion_inicio() {
                let geometries = [];
                let selects = [];
                
                if ($("#stormsActive option:eq(1)").val()){
                    $("#stormsActive").val($("#stormsActive option:eq(1)").val());
                    selects.push($('#stormsActive'));
                }
                if ($("#stormsActive2 option:eq(1)").val()){
                    $("#stormsActive2").val($("#stormsActive2 option:eq(1)").val());
                    selects.push($('#stormsActive2'));
                }
                $.each(selects, function( index, value ) {
                    var layerid = $(value).children("option:selected").attr("data-layerid");
                    //si no hay Evento en la selección
                    if(!layerid) {
                        return;
                    }
    
                    var layer = map.findLayerById(layerid);
                    var event = layerid.split("_")[0];
    
                    map.allLayers.map(function(layer) {
                        if (layer["id"] == "EP_Area_5d_area" || layer["id"] == "EP_Area_5d_label"){
                            return;
                        }
                        if(layer["id"].indexOf(event) != -1) layer.visible = true;
                        else if(layer["id"].indexOf("AT") != -1 || layer["id"].indexOf("EP") != -1) layer.visible = false;
                    });
                    // obtener geometria del seleccionado
                    var coneActive = activeConesAT.filter(function(activeConesAT) { if(activeConesAT["layerid"] == layerid) return activeConesAT; })[0];
                    
                    var coneActive2 = activeConesEP.filter(function(activeConesEP) { if(activeConesEP["layerid"] == layerid) return activeConesEP; })[0];
                    
                    if (coneActive) {
                        geometries.push(coneActive["geometry"])
                    }
                    if (coneActive2) {
                        geometries.push(coneActive2["geometry"])
                    }
                });
                if (geometries.length > 0) {
                    $('#vientos-div').show();
                    $("#vientos-checkbox").prop("checked", true);
                    $("#vientos-div img").attr("src", "img/wind_dorado.png");
                    map.findLayerById("area_34KtWinds").visible = true;
                    require([
                        "esri/tasks/GeometryService"
                    ], function(
                        GeometryService
                    ) {
                        geometryService = new GeometryService("http://rmgir.proyectomesoamerica.org/server/rest/services/Utilities/Geometry/GeometryServer");
                        geometryService.union(geometries).then(function(res) { 
                            if(res && res.extent) {
                                let extent = res.extent.expand(1.5);
                
                                view.extent = extent;
                            }
                        }).catch(function(error){
                            console.log("error", error);                        
                        });
                    })
                }
                else {
                    $('#vientos-div').hide();
                    $("#vientos-checkbox").prop("checked", false);
                    map.findLayerById("area_34KtWinds").visible = false;
                }
            }
            setTimeout(seleccion_inicio, 250);
            
        })

            // debugger

            // const conesLayers = map.layers["items"].filter(function(item) {
            //     return item["id"].indexOf("forecastCone") != -1;
            // });

            // const forecastPointsLayers = map.layers["items"].filter(function(item) {
            //     return item["id"].indexOf("forecastPoints") != -1;
            // });
            
            // conesLayers.forEach(function(layer) {
            //     activeConesPromises.push(layer.queryFeatures());
            // });

            // forecastPointsLayers.forEach(function(layer) {
            //     activeConesPromises.push(layer.queryFeatures());
            // });

    }

    function getCicloneType(type, maxwind) {
        //  Velocidad dada en mps
        if(type == "TS") return "TT";
        else if(type == "TD") return "DT";
        else if(type == "HU") {
            if(maxwind < 95) return "H1";
            else if(maxwind < 110) return "H2";
        } else if(type == "MH") {
            if(maxwind < 130) return "H3";
            else if(maxwind < 157) return "H4";
            else if(maxwind >= 157) return "H5";
        } else if(type == "STD") return "BP"
        else if(type == "STS") return "CTP"
        else if(type == "PTC") return "CPT"
        else return "NA";
    }

    function getIdCicloneTypeId(cicloneType) {
        if(cicloneType == "CTP") return "00";
        else if(cicloneType == "DT") return "01";
        else if(cicloneType == "TT") return "02";
        else if(cicloneType == "H1") return "03";
        else if(cicloneType == "H2") return "04";
        else if(cicloneType == "H3") return "05";
        else if(cicloneType == "H4") return "06";
        else if(cicloneType == "H5") return "07";
        else if(cicloneType == "BP") return "08";
        else if(cicloneType == "BPR") return "09";
        else if(cicloneType == "CPT") return "10";
    }

    function getSea(layerId) {
        if(layerId.indexOf("EP") != -1) return "EP";
        else return "AT";
    }

    function getQuery(array, objectidName = "OBJECTID"){
        if(array.length <= 1000)
            return  objectidName + " IN (" + array.join(',') + ")";
    
        return objectidName + " IN (" + array.splice(0, 1000).join(",") + ") OR " + getQuery(array, objectidName);
    }

    function queryRegions(map, mapView, geometries, objectidField) {
        require([
            "esri/tasks/QueryTask",
            "esri/tasks/support/Query"
        ], function(
            QueryTask,
            Query
        ) {
            const layerUrl = "http://rmgir.proyectomesoamerica.org/server/rest/services/DGPC/Regionalizacion_SIAT_CT/MapServer/0";
            var queryTask = new QueryTask({ url: layerUrl });
            var regionsLocated = [];
            var queryPromises = [];

            geometries.forEach(function(geometry) {
                var query = new Query();
                query.geometry = geometry;
                query.spatialRelationship = "intersects";

                queryPromises.push(queryTask.executeForIds(query));
            });

            Promise.all(queryPromises).then(function(results) {
                var featuresPromises = [];
                results.forEach(function(result) {
                    if(!result) return

                    const outFields = ["Regional_1", "Regional_2"];
                    var query = new Query();
                    query.where = getQuery(result, objectidField);
                    query.returnGeometry = false;
                    query.outFields = outFields;
                    query.returnDistinctValues = true;

                    featuresPromises.push(queryTask.execute(query));
                });

                Promise.all(featuresPromises).then(function(featureResults) {
                    var eventRegions = {};
                    featureResults.forEach(function(featureResult) {
                        featureResult["features"].forEach(function(feature) {
                            const attributes = feature["attributes"];
                            const edosMalos = {
                                "COAHUILA DE ZARAGOZA": "COAHUILA", 
                                "DISTRITO FEDERAL": "CIUDAD DE MÉXICO",
                                "MEXICO": "MÉXICO",
                                "MICHOACAN DE OCAMPO": "MICHOACÁN",
                                "NUEVO LEON": "NUEVO LEÓN",
                                "QUERETARO DE ARTEAGA": "QUERÉTARO",
                                "SAN LUIS POTOSI": "SAN LUIS POTOSÍ",
                                "VERACRUZ-LLAVE": "VERACRUZ",
                                "YUCATAN": "YUCATÁN"
                            };

                            var edo = attributes["Regional_1"];

                            if(edo in edosMalos) edo = edosMalos[edo];
                            if(!eventRegions[edo]) eventRegions[edo] = {};
                            if(!eventRegions[edo][attributes["Regional_2"]]) eventRegions[edo][attributes["Regional_2"]] = 0;
    
                            eventRegions[edo][attributes["Regional_2"]]++;
                        });
    
                        regionsLocated.push(eventRegions);
                    });
                    
                    console.log(regionsLocated);
                    loadEdo(regionsLocated[0]);
                });
            });
            
        });
    }

    function loadCiclones(map) {
        // nueva capa de ciclones por ESRI (a traves de la NOAA)
        const activeHurricanesBothUrls = [
            {
                "name": "EPAT",
                "layers": {
                    "forecastCone": "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/Active_Hurricanes_v1/FeatureServer/4",
                    "forecastPoints": "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/Active_Hurricanes_v1/FeatureServer/0",
                    "forecastTrack": "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/Active_Hurricanes_v1/FeatureServer/2",
                    "watchWarnings": "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/Active_Hurricanes_v1/FeatureServer/5",
                    "pastTrack": "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/Active_Hurricanes_v1/FeatureServer/3",
                    "pastPoints": "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/Active_Hurricanes_v1/FeatureServer/1"
                }
            }
        ]
        // capa de probabilidad de vientos de 34+ nudos
        const active34KtWindshUrl = {
            "name": "34KtWinds",
            "area": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/54"
        }

        // para la capa de vientos
        let properties_vientos = {
            id: "area_34KtWinds",  
            opacity: 0.5,
            refreshInterval: 60,
            showLabels: true,
            outFields: ["*"],
            visible: false,
            //ocean: "P",
            //labelingInfo: [labelClass]
        };
        addFeatureLayer(map, active34KtWindshUrl["area"], properties_vientos);
        
        const area_inestabilidad_EP = {
            // capa de inestabilidad en pacífico
            "name": "EP_Area_5d",
            "area": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones_active/MapServer/3",
            "text": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones_active/MapServer/2",            
        };
        const activeHurricanesEPUrls = [
            {
                "name": "EP1",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/6",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/4",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/5",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/7",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/9",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/8"
                }
            },{
                "name": "EP2",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/16",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/14",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/15",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/17",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/19",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/18"
                }
            },{
                "name": "EP3",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/26",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/24",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/25",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/27",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/29",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/28",
                }
            },{
                "name": "EP4",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/36",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/34",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/35",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/37",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/39",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/38",
                }
            },{
                "name": "EP5",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/46",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/44",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/45",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/47",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/49",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/48",
                }
            }
        ];

        const activeHurricanesATUrls = [
            {
                "name": "AT1",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/6",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/4",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/5",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/7",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/9",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/8",
                }
            },{
                "name": "AT2",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/17",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/15",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/16",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/18",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/20",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/19",
                }
            },{
                "name": "AT3",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/28",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/26",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/27",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/29",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/31",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/30",
                }
            },{
                "name": "AT4",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/39",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/37",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/38",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/40",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/42",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/41",
                }
            },{
                "name": "AT5",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/50",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/48",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/49",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/51",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/53",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/52",
                }
            }
        ];

        const forecastPointsLabelClass = {
            symbol: {
                type: "text",
                color: "white",
                haloColor: "black",
                font: {
                    family: "Arial",
                    size: 9,
                    weight: "bold"
                }
            },
            labelPlacement: "center-right",
            labelExpressionInfo: {
                expression: "$feature.STORMNAME + IIF($feature.SSNUM != 0, ' ,Cat ' + $feature.SSNUM, '') + ' ,' + $feature.DATELBL"
            }
        };

        const pointDepressionSymbol = {
            type: "picture-marker",
            url: "./img/ciclones/depresion.png",
            width: "20px",
            height: "20px"
        };

        const pointLowSymbol = {
            type: "picture-marker",
            url: "./img/ciclones/low.png",
            width: "20px",
            height: "20px"
        };

        const pointStormSymbol = {
            type: "picture-marker",
            url: "./img/ciclones/tormenta.png",
            width: "20px",
            height: "20px"
        };

        const pointHurricaneSymbol = {
            type: "picture-marker",
            url: "./img/ciclones/huracan.png",
            width: "20px",
            height: "20px"
        };

        var forecastPointsRenderer = {
            type: "unique-value",
            field: "DVLBL",
            uniqueValueInfos: [
              {
                value: "L",
                symbol: pointLowSymbol
              },
              {
                value: "D",
                symbol: pointDepressionSymbol
              }, {
                value: "S",
                symbol: pointStormSymbol
              }, {
                value: "H",
                symbol: pointHurricaneSymbol
              }, {
                value: "M",
                symbol: pointHurricaneSymbol
              }
            ]
        };

        const forecastTrackRenderer = {
            type: "simple",
            symbol: {
                type: "simple-line",
                color: "#079BFF",
                width: "3px",
                style: "dash"
            }
        };

        const pastTrackRenderer = {
            type: "simple",
            symbol: {
                type: "simple-line",
                color: "#079BFF",
                width: "1px",
                style: "solid"
            }
        };

        const pastTrackPointSymbol = {
            type: "picture-marker",
            url: "./img/ciclones/pastTrack.png",
            width: "8px",
            height: "8px"
        }

        const pastTrackPointRenderer = {
            type: "simple",
            symbol: pastTrackPointSymbol
        }

        activeHurricanesBothUrls.forEach(function(hurricaneEvent) {
            const name = hurricaneEvent["name"];
            const layers = hurricaneEvent["layers"];
            Object.keys(layers).forEach(function(type) {
                const layerId = name + "_" + type;
                var properties = {
                    id: layerId,  
                    opacity: 0.8,
                    refreshInterval: 60,
                    showLabels: true,
                    outFields: ["*"],
                    visible: false
                };

                if(type == "forecastPoints") {
                    properties["labelingInfo"] = [forecastPointsLabelClass];
                    properties["renderer"] = forecastPointsRenderer;
                } else if(type == "forecastTrack") {
                    properties["renderer"] = forecastTrackRenderer;
                } else if(type == "pastTrack") {
                    properties["renderer"] = pastTrackRenderer;
                } else if(type == "pastPoints") {
                    properties["renderer"] = pastTrackPointRenderer;
                }

                addFeatureLayer(map, layers[type], properties);
            });
        });

        // para la capa de inestabilidad
        let labelClass = {
            // Content
            labelExpressionInfo: {
              expression: "'Probabilidad de formación a 5 días: ' + $feature.prob5day"
            },
            
            // Appearance
            symbol: {
              type: "text",
              color: "white",
              haloColor: [30, 70, 190],
              haloSize: 1,
              font: {
                family: "Montserrat",
                style: "normal",
                weight: "bold",
                size: 10
              }
            },
            
            // Placement
            labelPlacement: "always-horizontal", // porque es geometría
           
            // Visibility
            // where: ""
        };
        let properties_area = {
            id: "EP_Area_5d_area",  
            opacity: 0.8,
            refreshInterval: 60,
            showLabels: true,
            outFields: ["*"],
            visible: true,
            ocean: "P",
            labelingInfo: [labelClass]
        };
        let properties_label = {
            id: "EP_Area_5d_label",  
            opacity: 1.0,
            refreshInterval: 60,
            showLabels: true,
            outFields: ["*"],
            visible: true,
            ocean: "P"
        };
        addFeatureLayer(map, area_inestabilidad_EP["area"], properties_area);
        addFeatureLayer(map, area_inestabilidad_EP["text"], properties_label);

        // capa de municipios
        const prop = {
            id: "municipios",
            opacity: 0,
            showLabels: true,
            outFields: ["admin1Name_es", "admin2Name_es"], // campos para url de gistmaps
            //outFields : ["NOM_ENT_", "NOM_MUN"],  // campos para capa rmgir
            renderer: {
                type: "simple",
                symbol: {
                          type: "simple-fill", 
                          color: "#000050",
                          style: "solid",
                          outline: {  
                            color: "white",
                            width: 2
                            },
                        },
                    },
            definitionExpression: "1 = 0",
            minScale: 10000000
        };
    
        const url = "https://gistmaps.itos.uga.edu/arcgis/rest/services/COD_External/MEX_ES/MapServer/3";
        //const url = "http://rmgir.proyectomesoamerica.org/server/rest/services/ANR/Datos_Basicos/MapServer/5";
        addFeatureLayer(map, url, prop,1);
    }

    function changeColoredRegions(map) {
        
        /*
       const url = "http://rmgir.proyectomesoamerica.org/server/rest/services/DGPC/Regionalizacion_SIAT_CT/MapServer/0";
       addFeatureLayer(map, url, propertiesStates);

       const layer = map.findLayerById("states");
       layer.definitionExpression = '<>':
       layer.refresh();
       */

        const data = get_regions();
        let new_data = {};
        let queries = {};
        $.each(data, function (estado, obj1) {
            $.each(obj1, function (tipo, obj2) {
                $.each(obj2, function (color, list) {
                    if (!(color in new_data)) new_data[color] = {};
                    if (!(estado in new_data[color])) new_data[color][estado] = list;
                    else {
                        $.each(list, function (index, region) {
                            new_data[color][estado].push(region);
                            }
                        );
                    }
                })
            })
        });
        
        const edosBuenos = {
            "COAHUILA": "COAHUILA DE ZARAGOZA", 
            "CIUDAD DE MÉXICO": "DISTRITO FEDERAL",
            "MÉXICO": "MEXICO",
            "MICHOACÁN": "MICHOACAN DE OCAMPO",
            "NUEVO LEÓN": "NUEVO LEON",
            "QUERÉTARO": "QUERETARO DE ARTEAGA",
            "SAN LUIS POTOSÍ": "SAN LUIS POTOSI",
            "VERACRUZ": "VERACRUZ-LLAVE",
            "YUCATÁN": "YUCATAN"
        };

        $.each(new_data, function (color, obj1) {
            queries[color] = "";
            let first = true;
            $.each(obj1, function (estado, lista) {
                if (!first){
                    queries[color] += " OR "
                }
                else {
                    first = false;
                }
                if(estado.toUpperCase() in edosBuenos) estado = edosBuenos[estado.toUpperCase()];
                queries[color] += "(Regional_1 = '" + estado.toUpperCase() +"'";
                //console.log("Este es el estado en el query", estado.toUpperCase());
                if (lista[0] === "T"){
                    queries[color] += ")";
                }
                else {
                    queries[color] += " AND Regional_2 IN ('" + lista.join("', '") + "'))"
                }
            })
        });
        //console.log(queries);

        let layer;
        layer = map.findLayerById("statesRed");
        if ("ROJA" in queries) {
            layer.definitionExpression = queries['ROJA'];
            layer.opacity = 0.6;

        }else{
            layer.definitionExpression = "1=0";
            layer.opacity = 0;
        }
        layer.refresh();

        layer = map.findLayerById("statesOrange");
        if("NARANJA" in queries){
            layer.definitionExpression = queries['NARANJA'];
            layer.opacity = 0.6;

        }else{
            layer.definitionExpression = "1=0";
            layer.opacity = 0;
        }
        layer.refresh();

        layer = map.findLayerById("statesYellow");
        if("AMARILLA" in queries){
            layer.definitionExpression = queries['AMARILLA'];
            layer.opacity = 0.6;
        }else{
            layer.definitionExpression = "1=0";
            layer.opacity = 0;
        }
        layer.refresh();

        layer = map.findLayerById("statesGreen");
        if("VERDE" in queries){
            layer.definitionExpression = queries['VERDE'];
            layer.opacity = 0.6;
        }else{
            layer.definitionExpression = "1=0";
            layer.opacity = 0;
        }
        layer.refresh();

        layer = map.findLayerById("statesBlue");
        if("AZUL" in queries){
            layer.definitionExpression = queries['AZUL'];
            layer.opacity = 0.6;
        }else{
            layer.definitionExpression = "1=0";
            layer.opacity = 0;
        }
        layer.refresh();
    }

    document.addEventListener("kml-added", function(evt) {
        const layerDetail = evt["detail"];
        const geometries = layerDetail["geometries"]["polygons"].map(function(polygon){ return polygon["geometry"]; });

        queryRegions(layerDetail["map"], layerDetail["view"], geometries, "FID");
    });

    function showPreview(screenshot) {
        $('.js-screenshot-image').show();
        const screenshotImage = document.getElementsByClassName("js-screenshot-image")[0];
        screenshotImage.width = screenshot.data.width;
        screenshotImage.height = screenshot.data.height;
        screenshotImage.src = screenshot.dataUrl;
        //$('#imagen').css("width","100%");
        //$('#imagen').css("height","100%");
    
        $('#map-container').hide();
    }

    function getRegiones() {
        $.ajax({
            type: "GET",
            url: "./siat_fns.php",
            data: { getRegions: true },
            dataType: "json",
            success: function(result) {

            },
            error: function(error) {

            }
        });
    }

    function getAutoresDefault() {
        $.ajax({
            type: "GET",
            url: "./siat_fns.php",
            data: { getAutoresDefault: true },
            dataType: "json",
            success: function(result) {
                var templateSource = $("#autoresDefault-template").html();
                var template = Handlebars.compile(templateSource);
                var outputHTML = template({autores: result});
                $("#autores").html(outputHTML);
            },
            error: function(error) {

            }
        });
    }

    function getActiveEvents() {
        $.ajax({
            type: "GET",
            url: "./siat_fns.php",
            data: { 
                eventos: true,
                active: true
            },
            dataType: "json",
            success: function(result) {
                var templateSource = $("#activeEvents-template").html();
                var template = Handlebars.compile(templateSource);
                var outputHTML = template({activeEvents: result});
                $("#activeEvents").html(outputHTML);
            },
            error: function(error) {

            }
        });
    }

    $("#seguimientoOption").on("change", function() {
        if($(this).prop('checked')) {
            getActiveEvents();
        } else {
            $("#activeEvents").html('');
        }
    });

    $('#nubes-checkbox').on('change', function(){
        if (nubes_error) {
            return;
        }
        let layer = map.findLayerById("TopClouds");
        if (layer == undefined){
            return;
        }
        layer.visible = this.checked;
        $('#timeDiv span.material-icons').toggleClass("dorado");
        $('#timeDiv p').text("Capa \nApagada");
        if (this.checked){
            $('#timeDiv p').text("Cargando \n capa");
            timeExtentChanger = setInterval(changeTimeExtent, 2000);
        }
        else {
            clearInterval(timeExtentChanger);
        }
    })

    $('#refugios-checkbox').on('change', function(){
        if (this.checked) {
            $('#refugios-select').css("opacity", 1);
            map.findLayerById("refugios").visible = true;
            $('#refugios-div span.material-icons').addClass("dorado");
        }
        else {
            $('#refugios-select').css("opacity", 0);
            $('#refugios-div span.material-icons').removeClass("dorado");
            map.findLayerById("refugios").visible = false;
        }
    });
    $('#refugios-select').on('change', function(){
        let value = this.value;  // valor del estado
        let layer = map.findLayerById("refugios");    
        if (value == "") {
            layer.definitionExpression = "1=0";
            layer.visible = false;
            return;
        }
        // pregunta quienes son del estado seleccionado
        layer.definitionExpression = "clave_estado = " + value;
        layer.visible = true;

    });

    $('#vientos-checkbox').on('change', function(){
        if (this.checked) {
            $("#vientos-div img").attr("src", "img/wind_dorado.png");
            map.findLayerById("area_34KtWinds").visible = true;
        }
        else {
            $("#vientos-div img").attr("src", "img/wind.png");
            map.findLayerById("area_34KtWinds").visible = false;
        }
    });

    loadMap("map");
    //getAutoresDefault();
});
