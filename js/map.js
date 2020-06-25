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

$(function() {
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
            "esri/widgets/Home"
        ], function(
            Map,
            MapView,
            esriConfig,
            Fullscreen,
            GraphicsLayer,
            Sketch,
            ImageryLayer,
            MapImage,
            Home
        ) {
            esriConfig.request.proxyUrl = "http://rmgir.cenapred.gob.mx/proxy/proxy.php";
            const layer = new GraphicsLayer();
            map = new Map({
                basemap: "hybrid"
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
            view.when(function(event){
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
                        let tmp = 0;
                        setInterval(function(){
                            let today = new Date();
                            let end = new Date(today);
                            end.setMinutes(end.getMinutes() - (end.getMinutes() % 10 + 20));
                            end.setSeconds(0);
                            end.setMilliseconds(0);

                            let start = new Date(end);
                            start.setDate(today.getDate()-1);
                            
                            start.setHours(start.getHours() + 1);
                            let start_temp = new Date(start);
                            start_temp.setHours(start_temp.getHours() + tmp);
                            $('#timeDiv p').text("Nubes: " + start_temp.toLocaleString());
                            
                            tmp += 1;
                            if (tmp > 23){
                                tmp = 0
                            }
                            let layer = map.findLayerById("TopClouds");
                            layer.timeExtent = {
                                start: start_temp,
                                end: start_temp,
                                useViewTime: false,
                            };
                        }, 2000);
                    },
                    function(error){
                        alert("Hubo un problema al cargar la información de nubes. Te pedimos refrescar la página.")
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
                    // var rBand = [];
                    // var gBand = [];
                    // var bBand = [];
                    var mask = [];
                  
                    // Loop through all the pixels in the view
                    for (i = 0; i < numPixels; i++) {
                        // Get the pixel value recorded at the pixel location
                        var r = rband[i];
                        var g = gband[i];
                        var b = bband[i];

                        // rBand[i] = r;
                        // gBand[i] = g;
                        // bBand[i] = b;
                        mask[i] = 1;
                        //aBand[i] = 255;
                        // quita los azules y los colores oscuros
                        if ((b > g && b > r) || (r < 50 && g < 50 && b < 50)){
                            // rBand[i] = 0;
                            // gBand[i] = 0;
                            // bBand[i] = 0;
                            mask[i] = 0;
                        }
                    }                  
                    pixelData.pixelBlock.mask = mask;
                    // Set the new pixel values on the pixelBlock (now three bands)
                    // pixelData.pixelBlock.pixels = [rBand, gBand, bBand];
                    //pixelData.pixelBlock.addData({pixels: aBand})
                    pixelData.pixelBlock.pixelType = "u8"; // u8 is used for color
                }

                map.add(weather);
            });

            const sketch = new Sketch({
                layer: layer,
                view: view,
                // graphic will be selected as soon as it is created
                creationMode: "update"
            });
      
            view.ui.add(sketch, "top-right");
                sketch.on("create", function(event) {
                    // check if the create event's state has changed to complete indicating
                    // the graphic create operation is completed.
                    if (event.state === "complete") {
                        // remove the graphic from the layer. Sketch adds
                        // the completed graphic to the layer by default.
                        //layer.remove(event.graphic);
                    
                        // use the graphic.geometry to query features that intersect it
                        console.log(event.graphic.geometry);
                        realizarAnalisis(event.graphic.geometry, exceptLayers);
                        $("#analisis").slideDown(3000);
                        createRandomText();
                    }
                }
            );

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
            map.on("load", function (event){
                
                search = new Search({
                    map: map
                }, "ui-dijit-search");
                search.startup();
    
                basemapGallery = new BasemapGallery({
                    showArcGISBasemaps: true,
                    map: map
                }, "basemapGallery");
                basemapGallery.startup();
    
                geoLocate = new LocateButton({
                    map: map
                }, "LocateButton");
                geoLocate.startup();
    
                home = new HomeButton({
                    map: map
                }, "HomeButton");
                home.startup();
    
                editToolbar = new Edit(map);
                map.on("click", function(evt) {
                    editToolbar.deactivate();
                });
    
                map.on("mouse-move", showCoordinates);
                map.on("mouse-drag", showCoordinates);
                //showScale();
                map.on("zoom-end", showScale);
    
                map.addLayer(bufferGraphics);
    
                //createGraphicsMenu();
                initToolbar();
            });
            
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
        function addGraphic(evt) {
            $("#analisis span").removeClass("active");
            if(clickDraw) clickDraw.remove();
            if(overDraw) overDraw.remove();
            if(dragDraw) dragDraw.remove();
            if(dragStartDraw) dragStartDraw.remove();
            if(dragEndDraw) dragEndDraw.remove();
            var geometry = evt.geometry;
            //deactivate the toolbar and clear existing graphics
            tb.deactivate();
            map.enableMapNavigation();

            // figure out which symbol to use
            var symbol;
            if (evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
                symbol = markerSymbol;
            } else if (evt.geometry.type === "line" || evt.geometry.type === "polyline") {
                symbol = lineSymbol;
            }
            else {
                symbol = fillSymbol;
            }

            map.graphics.add(new Graphic(geometry, symbol));

            //Calculo de área y perímetro
            calcularAreaPerimetro(geometry);

            //Funciones geo --> outStatistics
            showElem();
            createRandomText();
            lastGeometry = evt.geometry;
            realizarAnalisis(evt.geometry, exceptLayers);

            // Poblacion mundial
            $("#world").css("display", "block");
            $("#world").on("click", function(){
                $("#world").unbind();
                $("#worldPopulation").css("display", "block");
                $("#world").css("display", "none");

                // Población mundial
                createWorldPopulationRandomText();
                var features= [];
                features.push(new Graphic(evt.geometry, symbol));

                var featureSet = new FeatureSet();
                featureSet.features = features;
                
                var params = { "inputPoly": featureSet };
                worldPopulationGP.execute(params);
                worldPopulationGP.on("execute-complete", function(evtObj){
                    clearInterval(randomWorldTextInterval);
                    var valor;
                    var results = evtObj.results;
                    valor = {number:results[0].value.features[0].attributes.SUM};
      
                    valorNuevo = new Intl.NumberFormat("en-US").format(valor.number);    
                  
                    console.log(valorNuevo);
                    $("#worldPopulationResult").text(valorNuevo.split(".",1));
                });
            });
        };
    });
           
    }  

    function addFeatureLayer(map, url, properties, renderer = null) {
        require([
            "esri/layers/FeatureLayer"
        ], function(
            FeatureLayer
        ) {
            const layer = new FeatureLayer(url, properties);
            map.add(layer);
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
        const conesLayers = map.layers["items"].filter(function(item) {
            return item["id"].indexOf("Cone") != -1;
        });

        const forecastPointsLayers = map.layers["items"].filter(function(item) {
            return item["id"].indexOf("forecastPoints") != -1;
        });

        var activeConesPromises = [];
        var activeConesAT = [];
        var activeConesEP = [];
        conesLayers.forEach(function(layer) {
            activeConesPromises.push(layer.queryFeatures());
        });

        forecastPointsLayers.forEach(function(layer) {
            activeConesPromises.push(layer.queryFeatures());
        });

        Promise.all(activeConesPromises).then(function(results) {
            results.forEach(function(result, resultIdx) {
                if(resultIdx < conesLayers.length && result["features"].length) {
                    // debugger;
                    var eventActive = result["features"][0]["layer"]["id"].split("_")[0];
                    if (getSea(conesLayers[resultIdx]["id"]) == "EP"){
                        activeConesEP.push({
                            stormname: result["features"][0]["attributes"]["stormname"],
                            stormtype: results[conesLayers.length + resultIdx]["features"][0]["attributes"]["stormtype"],
                            geometry: result["features"][0]["geometry"],
                            maxwind: results[conesLayers.length + resultIdx]["features"][0]["attributes"]["maxwind"],
                            layerid: conesLayers[resultIdx]["id"]
                        });
                    }
                    else {
                        activeConesAT.push({
                            stormname: result["features"][0]["attributes"]["stormname"],
                            stormtype: results[conesLayers.length + resultIdx]["features"][0]["attributes"]["stormtype"],
                            geometry: result["features"][0]["geometry"],
                            maxwind: results[conesLayers.length + resultIdx]["features"][0]["attributes"]["maxwind"],
                            layerid: conesLayers[resultIdx]["id"]
                        });
                    }
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
                    "esri/tasks/support/ProjectParameters"
                ], function(
                    GeometryService,
                    ProjectParameters
                ) {
                    
                    var layerid = $(select).children("option:selected").attr("data-layerid");
                    
                    //si no hay Evento en la selección
                    if(!layerid) {
                        $("#type").text("");
                        $("#sea").text("");
                        $("#name").text("");
                        $(".TitleOceano").text("");
                        $(".TitleTipo").text('');
                        // $('#tablaEdos1 > tbody').html("");
	                    // $('#tablaEdos2 > tbody').html("");
                        $("#regiones").hide();
                        $("#mostrar").hide();
                        $('#tablaEditar').show();
                        let ocean = $(select).attr("ocean");
                        map.allLayers.map(function(layer) {
                            if (layer["id"] == "EP_Area_5d_area" || layer["id"] == "EP_Area_5d_label"){
                                return;
                            }
                            if (ocean == "A" && layer["id"].indexOf("AT") != -1){
                                layer.visible = false;
                            }
                            else if (ocean == "P" && layer["id"].indexOf("EP") != -1){
                                layer.visible = false;
                            }
                        });
                        return;
                    }else{//si existe el evento muestra la tabla correspondiente
                        $("#regiones").hide();
                        $("#mostrar").hide();
                        $('#tablaEditar').show();
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

                    var coneActive = activeConesAT.filter(function(activeConesAT) { if(activeConesAT["layerid"] == layerid) return activeConesAT; })[0];
                    
                    var coneActive2 = activeConesEP.filter(function(activeConesEP) { if(activeConesEP["layerid"] == layerid) return activeConesEP; })[0];


                    var geometryService = new GeometryService({ url: "http://rmgir.proyectomesoamerica.org/server/rest/services/Utilities/Geometry/GeometryServer" });
                    if (coneActive) {
                        var params = new ProjectParameters({
                            geometries: [coneActive["geometry"]["extent"]],
                            outSpatialReference: mapView["spatialReference"]
                        });

                        geometryService.project(params).then(function(result) {
                            mapView.goTo(result[0]);

                            var tipoHuracan = getCicloneType(coneActive["stormtype"], coneActive["maxwind"]);
                            $("#type").text(tipoHuracan);
                            $("#type").attr("data-typeId", getIdCicloneTypeId(tipoHuracan));
                            $("#name").text(coneActive["stormname"]);
                            $("#sea").text(getSea(coneActive["layerid"]) + " / ");
                            $("#sea").attr("data-ocean", (getSea(coneActive["layerid"]) == "EP" ? "P" : "A"));
                            //tituloSecundario();
                            const oceano = getSea(coneActive["layerid"]) == "EP" ? "PACÍFICO" : "ATLÁNTICO"; 
                            $(".TitleOceano").text(oceano);
                            //queryRegions(map, mapView, [coneActive["geometry"]], "FID");
                            var zoomComplete = new Event("eventSelected");
                            document.dispatchEvent(zoomComplete);
                        });
                    }
                    if (coneActive2) {
                        var params2 = new ProjectParameters({
                            geometries: [coneActive2["geometry"]["extent"]],
                            outSpatialReference: mapView["spatialReference"]
                        });
                        geometryService.project(params2).then(function(result) {
                            mapView.goTo(result[0]);

                            var tipoHuracan = getCicloneType(coneActive2["stormtype"], coneActive2["maxwind"]);
                            $("#type").text(tipoHuracan);
                            $("#type").attr("data-typeId", getIdCicloneTypeId(tipoHuracan));
                            $("#name").text(coneActive2["stormname"]);
                            $("#sea").text(getSea(coneActive2["layerid"]) + " / ");
                            $("#sea").attr("data-ocean", (getSea(coneActive2["layerid"]) == "EP" ? "P" : "A"));
                            //tituloSecundario();
                            const oceano = getSea(coneActive2["layerid"]) == "EP" ? "PACÍFICO" : "ATLÁNTICO"; 
                            $(".TitleOceano").text(oceano);
                            //queryRegions(map, mapView, [coneActive2["geometry"]], "FID");
                            var zoomComplete = new Event("eventSelected");
                            document.dispatchEvent(zoomComplete);
                        });
                    }
                })
            });
        });
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

        activeHurricanesEPUrls.forEach(function(hurricaneEvent) {
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
                    visible: false,
                    ocean: "P"
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

        activeHurricanesATUrls.forEach(function(hurricaneEvent) {
            const name = hurricaneEvent["name"];
            const layers = hurricaneEvent["layers"];
            Object.keys(layers).forEach(function(type) {
                const layerId = name + "_" + type;
                const properties = {
                    id: layerId,  
                    opacity: 0.8,
                    refreshInterval: 60,
                    showLabels: true,
                    outFields: ["*"],
                    visible: false,
                    ocean: "A"
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

    loadMap("map");
    //getAutoresDefault();
});
