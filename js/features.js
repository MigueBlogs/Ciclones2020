var sistemaExpuestoActivo = "";
var featureTables = [];

$(function(){
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

    $("#info").on("click", function(){
        $(".clicked").click();
    });

    $("#BtnLimpiar").on("click", function(){
        borrarCapas();
    });
    

    $(".clickable").on("click", function(){
        var clicked = this;
        $(clicked).toggleClass("clicked");
        $(".clickable").each(function(id, el){
            if($(el).hasClass("clicked") && $(el).attr("id") != $(clicked).attr("id")) $(el).removeClass("clicked");
        })
        borrarCapas();
        // if(featureTables.length > 0){
        //     featureTables.forEach(function(ft){
        //         ft.destroy();
        //     })
        //     $(".closeFeatures").on('click', function(event){
        //         $(".clicked").click();

        //         removeClassification("#escuelas_type");
        //     });
        // }
        if($(clicked).hasClass("clicked") && lastGeometry){
            //showElem();
            var sourcesClicked = $(clicked).attr("data-sources");
            var sources = sourcesClicked.split("/").map(function(source){ return {name: source, shortName: source.split(" ").join("")} });

            if(sourcesClicked == "Escuelas") {
                $(this).parent().addClass("col-2");
                getSchoolTypes(featureLayer_urls[sourcesClicked], lastGeometry, sources);
                 //vacía tabla en el caso de un análisis previo o de otro tipo
                 $('#tableDiv').empty();
                 $('#tableDivPobUrb').empty();
                 $('#tableDivPobUrb').text("No hay resultados de población Urbana en el área de búsqueda");
                 $('#tableDivPobRur').empty();
                 $('#tableDivPobRur').text("No hay resultados de población Rural en el área de búsqueda");
                 $('#poblacion').hide();
                 //borra contenido actual y reescribe la tabla
                 $("#defaultMsj").show()
                 $('#escuelas_type').text('');
            } else {

                removeClassification("#escuelas_type");

                var templateSource = $("#featureTable-template").html();
                var template = Handlebars.compile(templateSource);
                var outputHTML = template({features: sources});
                $('#featureTable').html(outputHTML);

                sistemaExpuestoActivo = $(".tabs__item.active").text();

                // $(".tabs__item").on("click", function(){
                //     var tab = $(".tabs__item").index(this);
                //     $(".tabs__item").removeClass("active");
                //     $(".panels__item").removeClass("active");
                //     $(this).addClass("active");
                //     var panel = $(".panels__item")[tab];
                //     $(panel).addClass("active");
                //     sistemaExpuestoActivo = $(this).text();
                // });

                $("#downloadFeature").on("click", function(){
                    var activeFeature = $(".tabs__item.active").attr("data-feature");
                    createFeatureTableCSV(activeFeature);
                });

                $(".closeFeatures").on('click', function(event){
                    $(".clicked").click();
                });

                //showElem();
                sourcesClicked.split("/").forEach(function(source){
                    mostrarFeaturesDentro(lastGeometry, featureLayer_urls[source], source, true);
                    
                });
                //hideElem();
            }
        } else {
            sistemaExpuestoActivo = "";
            $("#featureTable").css("display", "none");

            removeClassification("#escuelas_type");
        }
    })

    function borrarCapas(){
        Object.keys(featureLayer_urls).forEach(function(key){
            if(map.findLayerById(key))
                map.remove(map.findLayerById(key));
        })
    }
});

function removeClassification(element){
    $(".desagregar").removeClass("col-2");
    $(element).html("");

    $("#featureTable").css("display", "none");

    if(featureTables.length > 0){
        featureTables.forEach(function(ft){
            ft.destroy();
        })
        $(".closeFeatures").on('click', function(event){
            $(".clicked").click();

            removeClassification("#escuelas_type");
        });
    }
}

function getSchoolTypes(url, geometry, sources){
    require([
        "esri/tasks/QueryTask",
        "esri/tasks/support/Query",
        "esri/tasks/support/StatisticDefinition"
    ], function(
        QueryTask,
        Query,
        StatisticDefinition
    ){

        var outFields = ["NIVEL"];

        var statistics = new StatisticDefinition();
        statistics.onStatisticField = "NIVEL";
        statistics.statisticType = "count";
        statistics.outStatisticFieldName = "TOTAL";

        var queryTask = new QueryTask(url);
        var query = new Query();
        query.geometry = geometry;
        query.returnGeometry = false;
        query.groupByFieldsForStatistics = outFields;
        query.outFields = outFields;
        query.outStatistics = [statistics];

        queryTask.execute(query).then(function(queryResults){
            var types = queryResults.features.map(function(type){
                return {
                    tipo: type["attributes"]["NIVEL"],
                    total: type["attributes"]["TOTAL"]
                }
            });
            // console.log(types);

            types.sort(function(a, b){
                if (a.total < b.total) {
                    return 1;
                  }
                  if (a.total > b.total) {
                    return -1;
                  }
                  // a must be equal to b
                  return 0;
            });
            var templateSource = $("#layersResultsType-template").html();
            var template = Handlebars.compile(templateSource);
            var outputHTML = template(types);
            //borra contenido actual y reescribe la tabla
            $("#defaultMsj").hide()
            $('#escuelas_type').html('');
            $('#escuelas_type').html(outputHTML);
            //selecciona automaticamente la tabla de atributos
            document.querySelector('[href="#tab2"]').click();

            // hideElem();

            $(".resultType").on("click", function(){
                var filter = $(this).attr("data-type");

                if(map.getLayer("Escuelas"))
                    map.removeLayer(map.getLayer("Escuelas"));
                
                if(featureTables.length > 0){
                    featureTables.forEach(function(ft){
                        ft.destroy();
                    });
                }
                //debugger
                crearTablaSeleccion(url, geometry, sources, filter);
            });
        });
    });
}

function crearTablaSeleccion(url, geometry, sources, filter) {
    debugger
    var templateSource = $("#featureTable-template").html();
    var template = Handlebars.compile(templateSource);
    var outputHTML = template({features: sources});
    $('#featureTable').html(outputHTML);

    sistemaExpuestoActivo = $(".tabs__item.active").text();

    $(".tabs__item").on("click", function(){
        var tab = $(".tabs__item").index(this);
        $(".tabs__item").removeClass("active");
        $(".panels__item").removeClass("active");
        $(this).addClass("active");
        var panel = $(".panels__item")[tab];
        $(panel).addClass("active");
        sistemaExpuestoActivo = $(this).text();
    });

    $("#downloadFeature").on("click", function(){
        var activeFeature = $(".tabs__item.active").attr("data-feature");
        createFeatureTableCSV(activeFeature);
    });

    $(".closeFeatures").on('click', function(event){
        $(".clicked").click();
    });

    showElem();
    sources.forEach(function(source) {
        mostrarFeaturesDentro(geometry, url, source["name"], true, filter);
    });
    
    hideElem();
}

// function addLayer(layerItemPromise, index) {
//     return layerItemPromise.then(function (layer) {
//       map.add(layer, index);
//     });
//   }

function mostrarFeaturesDentro(geometry, url, name, visible = false, filter){
    
    require([
        "esri/layers/FeatureLayer",
        "esri/widgets/FeatureTable",
        "esri/tasks/support/Query",
        "esri/tasks/QueryTask",
        "esri/geometry/Circle",
        "esri/Graphic",
        "esri/PopupTemplate",
        "esri/symbols/PictureMarkerSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/renderers/SimpleRenderer",
        "esri/config",
        "esri/Color"
        ], function(
            FeatureLayer,
            FeatureTable,
            Query,
            QueryTask,
            Circle,
            Graphic,
            InfoTemplate,
            PictureMarkerSymbol,
            SimpleMarkerSymbol,
            SimpleLineSymbol,
            SimpleFillSymbol,
            SimpleRenderer,
            esriConfig,
            Color
        ){

        // var attributes = {
        //     outFields: ["*"],
        //     mode: FeatureLayer.MODE_ONDEMAND,
        //     visible: visible,
        //     infoTemplate: new InfoTemplate("Feature", "${*}"),
        //     id: name
        // };

        var template = {
            // autocasts as new PopupTemplate()
            title: "Detalles:",
            content: getInfo,
            outFields: ["*"],
            collapseEnabled: false
            };
        function getInfo(feature) {
            var graphic, attributes, content;
            graphic = feature.graphic;
            attributes = graphic.attributes;
            //console.log(attributes);
            var result ="";
            Object.keys(attributes).forEach(function(key){
                
                result = result+key+': '+attributes[key]+'<br>';
            });
            content =  result;
            
            return content;
            }

        if(name == "Escuelas") {
            attributes["definitionExpression"] = "NIVEL = '" + filter + "'";
        }

        var featureLayer = new FeatureLayer({
            url: url,
            outFields: ["*"]
          });
        featureLayer.popupTemplate = template;      
        
        //map.add(featureLayer,90);
        
        featureLayer.load().then(
            function(){
                
                var queryTask = new QueryTask(url);
                var queryFeature = new Query();
                queryFeature.geometry = geometry;
                queryFeature.returnGeometry = false;
                queryFeature.maxAllowableOffset = 10;
                var act = "";
                switch(name){
                    case "Bancos":
                        act = "CODIGO_ACT = '521110' OR CODIGO_ACT = '522110'"
                    break;
                    case "Hoteles":
                        act = "CODIGO_ACT = '721111' OR CODIGO_ACT = '721112' OR CODIGO_ACT = '721113' OR CODIGO_ACT = '721190' OR CODIGO_ACT = '721210' OR CODIGO_ACT = '721311' OR CODIGO_ACT = '721312'"
                    break;
                    case "Gasolineras":
                        act = "CODIGO_ACT = '468411'"
                    break;
                    case "Supermercados":
                        act = "CODIGO_ACT = '462111' OR CODIGO_ACT = '462112' OR CODIGO_ACT = '462210'"
                    break;
                    case "Escuelas":
                        act = "NIVEL = '" + filter + "'";
                    default:
                        act = "1=1";
                }
                queryFeature.where = act;

                // queryTask.on("error", function(error){
                //     alert("Ocurrió un error", error);
                // })
                
                queryTask.executeForIds(queryFeature).then(function(results){
                    if(!results){
                        if(name== "Población Urbana"){
                                $('#tableDivPobUrb').text("No hay resultados de población Urbana en el área de búsqueda");
                                debugger
                        }else if(name == "Población Rural"){
                                $('#tableDivPobRur').text("No hay resultados de población Rural en el área de búsqueda");
                        }
                        console.log("Sin resultados", name.split(" ").join(""));
                        return;
                    } else {
                        var noResults = results.length;
                        var defExp = getQuery(results, featureLayer.objectIdField);

                        featureLayer.definitionExpression=defExp;
                        featureLayer.id=name;
                        
                        map.add(featureLayer,90);
                        //Idea para hacer que se genere correctamente la tabla:
                        // 1.- ejecutar funcion que genera tabla
                        // 2.- verifica que tenga renglones
                        // 3.- si no tiene rengliones dejar pasar 1 segundo y ejectutar nuevamente la función
                        // 4.- ejecutar los pasos anteriores y hasta verificar que existan renglones y se de un fin de ciclo.
                        function esperaRecursiva(time){
                            //console.log(name);
                            loadFetureTable(featureLayer, name, noResults);
                            setTimeout(function(){
                                if($('#tableDiv').find('vaadin-checkbox').length <= 2){
                                    $('#tableDiv').html('');
                                    time+=500;
                                    esperaRecursiva(time);
                                }else{
                                    //selecciona automaticamente la tabla de atributos
                                    document.querySelector('[href="#tab2"]').click();
                                    return 0;
                                }
                            },  time);
                        }
                        function esperaRecursivaPobUrb(time){
                            $('#PobUrb').show();
                            $('#PobRur').show();
                            loadFetureTable(featureLayer, name, noResults);
                            setTimeout(function(){
                                if($('#tableDivPobUrb').find('vaadin-checkbox').length <= 2){
                                    $('#tableDivPobUrb').html('');
                                    time+=500;
                                    //console.log("Falla en Pob Urbana, le doy mas tiempo: ",time/1000," segundos");
                                    esperaRecursivaPobUrb(time);
                                }else{
                                    // //selecciona automaticamente la tabla de atributos
                                    // document.querySelector('[href="#tab2"]').click();
                                    // //selecciona automaticamente la tabla de Pob Urbana
                                    document.querySelector('[href="#PobUrb"]').click();
                                    console.log("Éxito en Pob Urbana, tiempo total: ",time/1000," segundos");                                     
                                    return 0;
                                }
                            },  time);
                        }
                        function esperaRecursivaPobRur(time){
                            $('#PobUrb').show();
                            $('#PobRur').show();
                            loadFetureTable(featureLayer, name, noResults);
                            setTimeout(function(){
                                if($('#tableDivPobRur').find('vaadin-checkbox').length <= 2){
                                    $('#tableDivPobRur').html('');
                                    time+=500;
                                    //onsole.log("Falla en Pob Rural, le doy mas tiempo: ",time/1000," segundos");
                                    esperaRecursivaPobRur(time);
                                }else{
                                    // //selecciona automaticamente la tabla de atributos
                                    // document.querySelector('[href="#tab2"]').click();
                                    // //selecciona automaticamente la tabla de Pob Urbana
                                    document.querySelector('[href="#PobRur"]').click();  
                                    console.log("Éxito en Pob Rural, tiempo total: ",time/1000," segundos");                                  
                                    return 0;
                                }
                            },  time);
                        }
                        //vacía tabla en el caso de un análisis previo o de otro tipo
                        $('#tableDiv').empty();
                        $('#tableDivPobUrb').empty();
                        $('#tableDivPobUrb').text("No hay resultados de población Urbana en el área de búsqueda");
                        $('#tableDivPobRur').empty();
                        $('#tableDivPobRur').text("No hay resultados de población Rural en el área de búsqueda");
                        $('#poblacion').hide();
                        //borra contenido actual y reescribe la tabla
                        $("#defaultMsj").hide()
                        $('#escuelas_type').html('');
                        if(name== "Población Urbana"){
                            $('#poblacion').show();
                            //selecciona automaticamente la tabla de atributos
                            document.querySelector('[href="#tab2"]').click();
                            //selecciona automaticamente la tabla de Pob Urbana
                            loadFetureTable(featureLayer, name, noResults);
                            setTimeout(function(){
                                var time=1000;
                                if($('#tableDivPobUrb').find('vaadin-checkbox').length <= 2){
                                    $('#tableDivPobUrb').html('');
                                    time+=500;
                                    //console.log("Falla en Pob Urbana, le doy mas tiempo: ",time/1000," segundos");
                                    esperaRecursivaPobUrb(time);
                                }
                            });
                            // document.querySelector('[href="#PobUrb"]').click(); 
                            //esperaRecursivaPobUrb(1000);
                        }else if(name == "Población Rural"){
                            $('#poblacion').show();
                            //selecciona automaticamente la tabla de atributos
                            document.querySelector('[href="#tab2"]').click();
                            //selecciona automaticamente la tabla de Pob Urbana
                            // loadFetureTable(featureLayer, name, noResults);
                            // document.querySelector('[href="#PobRur"]').click();
                            //esperaRecursivaPobRur(1000)

                            loadFetureTable(featureLayer, name, noResults);
                            setTimeout(function(){
                                var time=1000;
                                if($('#tableDivPobRur').find('vaadin-checkbox').length <= 2){
                                    $('#tableDivPobRur').html('');
                                    time+=500;
                                    //console.log("Falla en Pob Urbana, le doy mas tiempo: ",time/1000," segundos");
                                    esperaRecursivaPobRur(time);
                                }
                            });
                        }else{
                            //selecciona automaticamente la tabla de atributos
                            document.querySelector('[href="#tab2"]').click();
                            esperaRecursiva(2000);
                        }
                    };
                });
            }
        );
    })
    
}

function getQuery(array, objectidName = "OBJECTID"){
    if(array.length <= 1000)
        return  objectidName + " IN (" + array.join(',') + ")";

    return objectidName + " IN (" + array.splice(0, 1000).join(",") + ") OR " + getQuery(array, objectidName);
}

function loadFetureTable(featureLayer, name, noItems){
    require([
        "esri/layers/FeatureLayer",
        "esri/widgets/FeatureTable",
        "esri/tasks/support/Query",
        "esri/tasks/QueryTask",
        "esri/Graphic",
        "esri/symbols/PictureMarkerSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/renderers/SimpleRenderer",
        "esri/Color"
        ], function(
            FeatureLayer,
            FeatureTable,
            Query,
            QueryTask,
            Graphic,
            PictureMarkerSymbol,
            SimpleMarkerSymbol,
            SimpleLineSymbol,
            SimpleFillSymbol,
            SimpleRenderer,
            Color
        ){
        
        if(name== "Población Urbana"){
            var featureTable = new FeatureTable({
                view:view,
                layer:featureLayer,
                container: document.getElementById("tableDivPobUrb")
            });
            
        }else if(name == "Población Rural"){
            var featureTable = new FeatureTable({
                view:view,
                layer:featureLayer,
                container: document.getElementById("tableDivPobRur")
            });  
        }else{
            //caso de otros (bancos, presas, aeropuertos, etc...)
            var featureTable = new FeatureTable({
                view:view,
                layer:featureLayer,
                container: document.getElementById("tableDiv")
            });
        }
        
        
        //featureTables.push(featureTable);


        //Listen for the table's selection-change event
        // featureTable.on("selection-change", function (changes) {
        //     // If the selection is removed, remove the feature from the array
        //     changes.removed.forEach(function (item) {
        //       const data = features.find(function (data) {
        //         return data.feature === item.feature;
        //       });
        //       if (data) {
        //         features.splice(features.indexOf(data), 1);
        //       }
        //     });

        //     // If the selection is added, push all added selections to array
        //     changes.added.forEach(function (item) {
        //       const feature = item.feature;
        //       features.push({
        //         feature: feature
        //       });
        //     });
        // });

        // // Listen for the click on the view and select any associated row in the table
        // view.on("immediate-click", function (event) {
        // view.hitTest(event).then(function (response) {
        //     const candidate = response.results.find(function (result) {
        //     return (
        //         result.graphic &&
        //         result.graphic.layer &&
        //         result.graphic.layer === featureLayer
        //     );
        //     });
        //     // Select the rows of the clicked feature
        //     candidate && featureTable.selectRows(candidate.graphic);
        // });
        // });

        // featureTable.on("row-select", function(e){
        //     var featureId = e.rows[0].data[featureLayer.objectIdField];

        //     var query = new Query();
        //     query.returnGeometry = false;
        //     query.objectIds = [featureId];
        //     query.where = "1=1";
            
        //     map.getLayer(name).queryFeatures(query, function(featureSet){
        //         if(featureSet.features[0].geometry.type === "polygon"){
        //             var selectionSymbol =  new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        //                 new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
        //                 new Color([0, 255, 17]), 4), // Color contorno
        //                 new Color([0, 255, 17, 0.4])  // Color fondo
        //             );
        //             map.getLayer(name).setSelectionSymbol(selectionSymbol);
        //             map.getLayer(name).selectFeatures(query, FeatureLayer.SELECTION_NEW);
        //             // map.setExtent(featureSet.features[0].geometry.getExtent().expand(2.5));
        //         } else if(featureSet.features[0]._graphicsLayer.renderer.getSymbol(featureSet.features[0])){
        //             var imageUrl = featureSet.features[0]._graphicsLayer.renderer.getSymbol(featureSet.features[0]).url;
        //             var selectionSymbol = new PictureMarkerSymbol(imageUrl, 48 ,48);
        //             map.getLayer(name).setSelectionSymbol(selectionSymbol);
        //             map.getLayer(name).selectFeatures(query, FeatureLayer.SELECTION_NEW);
        //             // map.centerAndZoom(featureSet.features[0].geometry, 16);
        //         }
        //     })
            
        // })

        // featureTable.on("load", function(){
        //     //hideElem();
        //     map.getLayer(name).on("click", function(evt){
        //         if(evt.graphic.geometry.type == "polygon"){
        //             var selectionSymbol =  new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        //                 new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
        //                 new Color([0, 255, 17]), 4), // Color contorno
        //                 new Color([0, 255, 17, 0.4])  // Color fondo
        //             );
        //             map.getLayer(name).setSelectionSymbol(selectionSymbol);
        //         } else {
        //             var imageUrl = evt.toElement.attributes["xlink:href"].value
        //             var selectionSymbol = new PictureMarkerSymbol(imageUrl, 48 ,48);
        //             map.getLayer(name).setSelectionSymbol(selectionSymbol);
        //         }

        //         if (evt.graphic && evt.graphic.attributes) {
        //             var feature = evt.graphic
        //             var featureId = feature.attributes[evt.graphic.getLayer().objectIdField];
        
        //             var query = new Query();
        //             query.returnGeometry = false;
        //             query.objectIds = [featureId];
        //             query.where = "1=1";
        
        //             map.getLayer(name).selectFeatures(query, FeatureLayer.SELECTION_NEW);
        //             // featureTable.centerOnSelection();
        //         }                   
        //     });
        // })

        // featureTable.on("error", function(){
        //     hideElem();
        //     alert("Ocurrió un error", error);
        //     featureTable.sort("OBJECTID", true);
        // })

        // featureTable.startup();

        //$("#featureTable").css("display", "block");
    });
}

$("#BtnLimpiar").on("click", function(){
    if(featureTables.length > 0){
        featureTables.forEach(function(ft){
            ft.destroy();
        })
        $(".closeFeatures").on('click', function(event){
            $(".clicked").click();
        });
    }
    $("#featureTable").css("display", "none");
    $(".clickable").each(function(id, el){
        if($(el).hasClass("clicked")) $(el).removeClass("clicked");
    });
});

function createFeatureTableCSV(identificador){
    var date = new Date();
    var headersArray = [];
    var headers = $("#panels__item-" + identificador + " .esri-feature-table-grid .esri-feature-table-column-header-title").each(function(f){
        headersArray.push($(this).text().replace(/,/gi, "."))
    });
    headers = headersArray.join(",");
    var tableText = "";
    $("#panels__item-" + identificador + " .dgrid-scroller .dgrid-cell div").each(function(idx, el){
        if(idx != 0 && idx % (headersArray.length) == 0)
            tableText += "\n";
        tableText += $(el).text().replace(/,/gi, ".") + ",";
    })
    var csv = headers + "\n" + tableText;

    var a         = document.createElement('a');
    a.href        = 'data:application/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(csv);
    a.target      = '_blank';
    a.download    = sistemaExpuestoActivo + '_analisis_' + date.getFullYear() + (date.getMonth() + 1) + date.getDate() +'.csv';

    document.body.appendChild(a);
    a.click();
}