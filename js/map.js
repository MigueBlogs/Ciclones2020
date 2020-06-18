var captured=false;
var map;
window.captured;
$(function() {
    function loadMap(container) {
        require([
            "esri/Map",
            "esri/views/MapView",
            "esri/config",
            "esri/widgets/Fullscreen"
        ], function(
            Map,
            MapView,
            esriConfig,
            Fullscreen
        ) {
            esriConfig.request.proxyUrl = "http://rmgir.cenapred.gob.mx/proxy/proxy.php";

            map = new Map({
                basemap: "hybrid"
            });
            const redProp = {
                id: "statesRed",
                opacity: 0,
                outFields: ["*"],
                renderer: {
                    type: "simple",
                    symbol: {
                              type: "simple-fill",  
                              color: "red",
                              style: "solid",
                              outline: {  
                                color: "white",
                                width: 0.5},
                            },
                        },
                definitionExpression: "1 = 0"
            };
            const orangeProp = {
                id: "statesOrange",
                opacity: 0,
                showLabels: true,
                outFields: ["*"],
                renderer: {
                    type: "simple",
                    symbol: {
                              type: "simple-fill", 
                              color: "#FFA500",
                              style: "solid",
                              outline: { 
                                color: "white",
                                width: 0.5
                                },
                            },
                        },
                definitionExpression: "1 = 0"
            };

            const yellowProp = {
                id: "statesYellow",
                opacity: 0,
                showLabels: true,
                outFields: ["*"],
                renderer: {
                    type: "simple",
                    symbol: {
                              type: "simple-fill",
                              color: "#FFFF00",
                              style: "solid",
                              outline: { 
                                color: "white",
                                width: 0.5
                                },
                            },
                        },
                definitionExpression: "1 = 0"
            };
            const greenProp = {
                id: "statesGreen",
                opacity: 0,
                showLabels: true,
                outFields: ["*"],
                renderer: {
                    type: "simple",
                    symbol: {
                              type: "simple-fill",
                              color: "#38BF34",
                              style: "solid",
                              outline: { 
                                color: "white",
                                width: 0.5
                                },
                            },
                        },
                definitionExpression: "1 = 0"
            };
            const blueProp = {
                id: "statesBlue",
                opacity: 0,
                showLabels: true,
                outFields: ["*"],
                renderer: {
                    type: "simple",
                    symbol: {
                              type: "simple-fill", 
                              color: "#4F81BC",
                              style: "solid",
                              outline: {  
                                color: "white",
                                width: 0.5
                                },
                            },
                        },
                definitionExpression: "1 = 0"
            };
            $("#GuardaTabla").click(function() { changeColoredRegions(map); });
            const url = "http://rmgir.proyectomesoamerica.org/server/rest/services/DGPC/Regionalizacion_SIAT_CT/MapServer/0";
            addFeatureLayer(map, url, redProp);
            addFeatureLayer(map, url, orangeProp);
            addFeatureLayer(map, url, yellowProp);
            addFeatureLayer(map, url, greenProp);
            addFeatureLayer(map, url, blueProp);
            var view = new MapView({
                container: container,
                map: map,
                center: [-101.608429, 23.200961],
                zoom: 5
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
            view.ui.add(
              new Fullscreen({
                view: view
                //element: applicationDiv
              }),
              "top-right"
            );
            
            $('#stormSelection').appendTo('.esri-view-root');
            $('#stormSelection2').appendTo('.esri-view-root');
            //$('#dataSection').appendTo('.esri-view-root'); // arruina la vista en mobil
            $('#mapa_ciclon').click(function() {
                $('.js-screenshot-image').hide();
                $('#uploadImg').show();
                $('#capture').show();
                $('#mapa_ciclon').hide();
                $('#mapaTemp').hide();
                $('#customFileLangDiv').hide();
                $('#map-container').show();
                if(guardadoGlobal){
                    $("#pdfError").show();
                    $("#pdf").hide();
                }  
                 window.captured=false;
            });
           
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
                            tituloSecundario();
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
                            tituloSecundario();
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
              expression: "$feature.prob5day"
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
            labelPlacement: "above-center",
           
            // Visibility
            // where: "ELEVATION > 2000"
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
    getAutoresDefault();
});
