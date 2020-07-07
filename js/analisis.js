
/*
**********************************************************
	funciones de outStatistics

  Análisis  con Ageb y Puntual

  Última Actualización 17/06/2020
  Por: Miguel Vargas y Luis Pinto
**********************************************************
*/

/////////////////////////////////////////////////////////
//Variables
// Población
var pobTotal;
var pobTotalAjustada;
var pobTotalXEstado;
var estados = [];
// Totales
var TotalPobFinal = 0;
var TotalVivFinal = 0;
var TotalPobFem = 0;
var TotalPobMas = 0;
var TotalMenor12 = 0;
var TotalMenor12F = 0;
var TotalMenor12M = 0;
var TotalMayor60 = 0;
var TotalMayor60F = 0;
var TotalMayor60M = 0;
var TotalLenguasIndigenas = 0;

var resultados = {};

var resultadosAnalisis = 0;
var conteoLenguas = 0;

var queryPromises = [];
var queryTaskPobArray = [];

var maxFeaturesReturned = 20000;

//Other variables from "principal.js"
var randomTextInterval;
var delay = 50;

var id_anim_mun_cargando;
/*
  Los nombres a buscar deben ser a nivel de capas
  TODO:
    -> Si el nombre de una capa no es único no se garantiza el resultado del análisis
*/

var tiposAnalisisEspecial = {
    "Poblacion": ["PoblacionAgeb", "PoblacionRural", "PoblacionITER"],
    "GradoVulnerabilidadSocial": ["GradoVulnerabilidadSocial"],
    "LenguasIndigenas": ["FamiliaKickapoo", "FamiliaYutoNahua", "FamiliaCochimíYumana", "FamiliaSeri", "FamiliaOtoMangue", "FamiliaMaya", "FamiliaTotonacoTepehua", "FamiliaTarasca", "FamiliaMixeZoque", "FamiliaChontalDeOaxaca", "FamiliaHuave"]
}

var nombresCapas = {
  //"http://rmgir.proyectomesoamerica.org/server/rest/services/analysis/Analisis/MapServer": [
  "http://servicios1.cenapred.unam.mx:6080/arcgis/rest/services/Analysis/Analisis/MapServer": [
    {
      "name": "Área geoestadística básica urbana 2010",
      "parent": "Censo 2010 (INEGI, 2010)",
      "tipo": "PoblacionAgeb"
    },
    {
      "name": "Colonias ",
      "parent": "Censo 2010 (INEGI, 2010)",
      "tipo": "Colonias"
    },
    {
      "name": "2010",
      "parent": "Grado de Vulnerabilidad Social (Indicadores Socioeconómicos)",
      "tipo": "GradoVulnerabilidadSocial"
    },
    {
      "name": "ITER (INEGI, 2010)",
      "parent": "Población y Vivienda",
      "tipo": ["PoblacionRural", "PoblacionITER"]
    },
    {
      "name": "Establecimientos de salud",
      "parent": "Infraestructura de Salud (Secretaría de Salud, 2015)",
      "tipo": "Hospitales"
    },
    {
      "name": "Centros de Trabajo Educativo",
      "parent": "Infraestructura Educativa (SEP, 2014-2015)",
      "tipo": "Escuelas"
    },
    {
      "name": "Aeropuertos (SCT, 2014)",
      "parent": "Áerea",
      "tipo": "Aeropuertos"
    },
    {
      "name": "Hoteles, gasolineras, bancos, supermercados ( INEGI, 2016)",
      "parent": "Servicios",
      "tipo": ["Supermercados", "Hoteles", "Bancos", "Gasolineras"]
    },
    {
      "name": "Inventario Nacional de Presas (CONAGUA, 2015)",
      "parent": "Infraestructura Hidráulica",
      "tipo": "Presas"
    },
    {
      "name": "Unidades de Producción Ganadera (SAGARPA, 2015)",
      "parent": "Sector Agropecuario (SAGARPA, 2015)",
      "tipo": "Ganaderias"
    },
    {
        "name": "Kickapoo",
        "parent": "I.  Álgica",
        "tipo": "FamiliaKickapoo"
    },
    {
        "name": "Agrupaciones",
        "parent": "II. Yuto -Nahua ",
        "tipo": "FamiliaYutoNahua"
    },
    {
        "name": "Agrupaciones",
        "parent": "III. Cochimí -Yumana",
        "tipo": "FamiliaCochimíYumana"
    },
    {
        "name": "Seri",
        "parent": "IV. Seri",
        "tipo": "FamiliaSeri"
    },
    {
        "name": "Agrupaciones",
        "parent": "V. Oto - Mangue",
        "tipo": "FamiliaOtoMangue"
    },
    {
        "name": "Agrupaciones",
        "parent": "VI. Maya",
        "tipo": "FamiliaMaya"
    },
    {
        "name": "Agrupaciones",
        "parent": "VII. Totonaco -Tepehua",
        "tipo": "FamiliaTotonacoTepehua"
    },
    {
        "name": "Agrupación tarasca",
        "parent": "VIII. Tarasca",
        "tipo": "FamiliaTarasca"
    },
    {
        "name": "Agrupación tarasca",
        "parent": "IX. Mixe -Zoque",
        "tipo": "FamiliaMixeZoque"
    },
    {
        "name": "Agrupación Chontal de Oaxaca",
        "parent": "X. Chontal de Oaxaca",
        "tipo": "FamiliaChontalDeOaxaca"
    },
    {
        "name": "Agrupación huave",
        "parent": "XI. Huave",
        "tipo": "FamiliaHuave"
    },
    {
      "name": "Zona Arqueológica Abierta al Público",
      "parent": "Patrimonio Cultural (INAH, 2015)",
      "tipo": "ZonasArqueologicas"
    },
    {
      "name": "Patrimonio Mundial",
      "parent": "Patrimonio Cultural (INAH, 2015)",
      "tipo": "PatrimonioMundial"
    },
    {
      "name": "Monumento Histórico",
      "parent": "Patrimonio Cultural (INAH, 2015)",
      "tipo": "MonumentoHistorico"
    },
    {
      "name": "Museo INAH",
      "parent": "Patrimonio Cultural (INAH, 2015)",
      "tipo": "MuseoINAH"
    },
    {
      "name": "Biblioteca INAH",
      "parent": "Patrimonio Cultural (INAH, 2015)",
      "tipo": "BibliotecaINAH"
    }
  ]
}

var queryParams = {
    "Colonias": {
        "outFields": [],
        "where": ""
    },
    "Hospitales": {
        "outFields": [],
        "where": ""
    },
    "Escuelas": {
        "outFields": [],
        "where": ""
    },
    "Supermercados": {
        "outFields": ["CODIGO_ACT"],
        "where": "CODIGO_ACT = '462111' OR CODIGO_ACT = '462112' OR CODIGO_ACT = '462210'"
    },
    "Hoteles": {
        "outFields": ["CODIGO_ACT"],
        "where": "CODIGO_ACT = '721111' OR CODIGO_ACT = '721112' OR CODIGO_ACT = '721113' OR CODIGO_ACT = '721190' OR CODIGO_ACT = '721210' OR CODIGO_ACT = '721311' OR CODIGO_ACT = '721312'"
    },
    "Bancos": {
        "outFields": ["CODIGO_ACT"],
        "where": "CODIGO_ACT = '521110' OR CODIGO_ACT = '522110'"
    },
    "Gasolineras": {
        "outFields": ["CODIGO_ACT"],
        "where": "CODIGO_ACT = '468411'"
    },
    "Aeropuertos": {
        "outFields": [],
        "where": ""
    },
    "Presas": {
        "outFields": [],
        "where": ""
    },
    "Ganaderias": {
        "outFields": [],
        "where": ""
    },
    "GradoVulnerabilidadSocial": {
        "outFields": ["GVS_ISE10"],
        "where": ""
    },
    "PoblacionAgeb": {
        "outFields": ["NOM_ENT", "POBTOT", "VIVTOT", "POBFEM", "POBMAS", "P_12YMAS", "P_12YMAS_M", "P_12YMAS_F", "P_60YMAS", "P_60YMAS_M", "P_60YMAS_F"],
        "where": ""
    },
    "PoblacionRural": {
        "outFields": ["NOM_ENT", "POBTOT", "VIVTOT", "POBFEM", "POBMAS", "P_12YMAS", "P_12YMAS_M", "P_12YMAS_F", "P_60YMAS", "P_60YMAS_M", "P_60YMAS_F"],
        "where": "POBTOT <= 2500"
    },
    "PoblacionITER": {
        "outFields": ["NOM_ENT", "POBTOT", "VIVTOT", "POBFEM", "POBMAS", "P_12YMAS", "P_12YMAS_M", "P_12YMAS_F", "P_60YMAS", "P_60YMAS_M", "P_60YMAS_F"],
        "where": ""
    },
    "FamiliaKickapoo": {
        "outFields": ["NOMAGRUP"],
        "where": ""
    },
    "FamiliaYutoNahua": {
        "outFields": ["NOMAGRUP"],
        "where": ""
    },
    "FamiliaCochimíYumana": {
        "outFields": ["NOMAGRUP"],
        "where": ""
    },
    "FamiliaSeri": {
        "outFields": ["NOMAGRUP"],
        "where": ""
    },
    "FamiliaOtoMangue": {
        "outFields": ["NOMAGRUP"],
        "where": ""
    },
    "FamiliaMaya": {
        "outFields": ["NOMAGRUP"],
        "where": ""
    },
    "FamiliaTotonacoTepehua": {
        "outFields": ["NOMAGRUP"],
        "where": ""
    },
    "FamiliaTarasca": {
        "outFields": ["NOMAGRUP"],
        "where": ""
    },
    "FamiliaMixeZoque": {
        "outFields": ["NOMAGRUP"],
        "where": ""
    },
    "FamiliaChontalDeOaxaca": {
        "outFields": ["NOMAGRUP"],
        "where": ""
    },
    "FamiliaHuave": {
        "outFields": ["NOMAGRUP"],
        "where": ""
    },
    "ZonasArqueologicas" : {
        "outFields": [],
        "where": ""
    },
    "PatrimonioMundial" : {
        "outFields": [],
        "where": ""
    },
    "MonumentoHistorico" : {
        "outFields": [],
        "where": ""
    },
    "MuseoINAH" : {
        "outFields": [],
        "where": ""
    },
    "BibliotecaINAH" : {
        "outFields": [],
        "where": ""
    }
}

var urls = {}
var QueryTask;
var Query;
require(["esri/tasks/QueryTask", "esri/tasks/support/Query"], function(QueryTaski, Queryi) {
    QueryTask = QueryTaski;
    Query = Queryi;
});
function obtenerURLServicios(serviciosObj, geo, exceptLayers){
    //console.log(serviciosObj);
    require(["esri/request"], function(esriRequest) { 
        var promises = [];
        var layersNames = [];
        var layersNamesCopy = [];
        var serviceUrls = [];
        Object.keys(serviciosObj).forEach(function(serviceUrl, idx){
            serviceUrls.push(serviceUrl);
            var options = {
                query: {
                  f: 'json'
                },
                responseType: 'json'
              };
            var serviceRequest = esriRequest(serviceUrl,options);
            //console.log(serviceRequest);
            promises.push(serviceRequest);
            layersNames.push([]);
            layersNamesCopy.push([]);
            Object.keys(serviciosObj[serviceUrl]).forEach(function(layerDataIdx){
            layersNames[idx].push(serviciosObj[serviceUrl][layerDataIdx]["name"]);
            layersNamesCopy[idx].push(serviciosObj[serviceUrl][layerDataIdx]["name"]);
            })
        });
        //console.log('promesas',promises);
        Promise.all(promises).then(function(data){
            //console.log('este es data',data);
            data[0]=data[0].data; //esto extrae data del promise que debería ser un deferred
            //console.log('este es nuevo data',data);
            data.forEach(function(serviceInfo, serviceInfoIdx){
            // console.log('Este es service info',serviceInfo);
            // console.log(serviceInfoIdx);
            serviceInfo.layers.forEach(function(layer, layerIdx){
                var indexOfLayer = layersNames[serviceInfoIdx].indexOf(layer.name);
                if(indexOfLayer !== -1){
                layersNames[serviceInfoIdx][indexOfLayer] = "";
                var matchLayerInfo = serviciosObj[serviceUrls[serviceInfoIdx]][indexOfLayer];
                var layerInfo = layer;
                if(matchLayerInfo["parent"] === "" && layerInfo.parentLayerId === -1){
                    urls[matchLayerInfo["tipo"]] = serviceUrls[serviceInfoIdx] + "/" + layerInfo.id;
                } else {
                    var parentLayerInfo = serviceInfo.layers[layerInfo.parentLayerId];
                    if(parentLayerInfo.name === matchLayerInfo["parent"]){
                    if(typeof matchLayerInfo["tipo"] === "string"){
                        urls[matchLayerInfo["tipo"]] = serviceUrls[serviceInfoIdx] + "/" + layerInfo.id;
                    } else{
                        matchLayerInfo["tipo"].forEach(function(el){
                        urls[el] = serviceUrls[serviceInfoIdx] + "/" + layerInfo.id;
                        })
                    }
                    } else {
                        console.log("No se encontró: (servicio)" + parentLayerInfo.name + ", (proporcionado)" + matchLayerInfo["parent"])
                    } 
                }
                layersNamesCopy[serviceInfoIdx].splice(indexOfLayer, 1);
                if(layersNamesCopy[serviceInfoIdx].length === 0) return;
                }
            });
            });
            
            var evt = new CustomEvent('urls-listas', {detail: {geometry: geo, exceptLayers: exceptLayers}});
            document.dispatchEvent(evt);
        }, function(reason){
            console.log("Ocurrió un error", reason);
        });
    });
}

function realizarAnalisis(geo, exceptLayers = []){
    pobTotal = [];
    pobTotalAjustada = {};
    pobTotalXEstado = [];
    estados = [];

    //TOTALES
    TotalPobFinal = 0;
    TotalVivFinal = 0;
    TotalPobFem = 0;
    TotalPobMas = 0;
    TotalMenor12 = 0;
    TotalMenor12F = 0;
    TotalMenor12M = 0;
    TotalMayor60 = 0;
    TotalMayor60F = 0;
    TotalMayor60M = 0;
    TotalLenguasIndigenas = 0;

    resultadosAnalisis = 0;
    conteoLenguas = 0;

    obtenMunicipios(geo);

    if(Object.keys(urls) == 0) obtenerURLServicios(nombresCapas, geo, exceptLayers);
    else {
        if(queryPromises.length > 0){
            queryPromises.forEach(function(query){
                //console.log("cancelando", query);
                query=null;
            })
        }
        if(queryTaskPobArray.length > 0){
            queryTaskPobArray.forEach(function(query){
                //console.log("cancelando Pob", query);
                query=null;
            })
        }
        var evt = new CustomEvent('urls-listas', {detail: {geometry: geo, exceptLayers: exceptLayers}});
        document.dispatchEvent(evt);
    }
}
function anima_mun_carga(){
    let current = $('#table-municipios label').text();
    let after = current + ".";
    $('#table-municipios label').text(after);    
    if (after == "Cargando...."){
        $('#table-municipios label').text("Cargando");
    }
}
function obtenMunicipios(geometry) {
    require([
        "esri/tasks/support/Query",
        "esri/tasks/GeometryService",
        "esri/tasks/support/ProjectParameters"
    ], function(
        Query,
        GeometryService,
        ProjectParameters
    ) {
        $('#table-municipios table').remove();
        $('#table-municipios label').text("Cargando").show();
        $('.loading-gif img').show();
        id_anim_mun_cargando = setInterval(anima_mun_carga, 1000);

        var geometryService = new GeometryService({url: "http://rmgir.proyectomesoamerica.org/server/rest/services/Utilities/Geometry/GeometryServer"});
        
        let layer = map.findLayerById("municipios");
        
        let query = new Query();
        query.geometry = geometry;
        query.returnGeometry = true;
        query.outFields = [ "*" ];
        query.outSpatialReference = view["spatialReference"];
        //query.where = "admin1Name_es = 'Tabasco'";

        
        //layer.refresh();

        //console.log(query.where);

        layer.queryFeatures(query).then(function(result) {
            var tabla = {};
            var geometries = result["features"].map(function(feature) { return feature["geometry"]; });
            var ids = result["features"].map(function(feature) {
                const estado = feature["attributes"].admin1Name_es;
                const municipio = feature["attributes"].admin2Name_es
                if (!(estado in tabla)){
                    tabla[estado] = [];
                }
                tabla[estado].push(municipio);
                return feature["attributes"].OBJECTID; 
            });
            
            creaTablaMunicipios(tabla);
            var params = new ProjectParameters({
                geometries: geometries,
                outSpatialReference: view["spatialReference"]
            });
            geometryService.project(params).then(function(r) {
                layer.definitionExpression = "OBJECTID in ("+ids.join()+")";
                layer.opacity = 0.5;
                //Vulve a funcionar el sketch
                $(".esri-sketch__button").removeClass("sketchDisabled");
                $(".esri-sketch__button").removeAttr("disabled","");
                $(".esri-icon-trash").removeClass("sketchDisabled")
                $(".esri-icon-trash").removeAttr("disabled","");
                $('.loading-gif img').hide();
            });
        }).catch(function(error){
            clearInterval(id_anim_mun_cargando);
            $('#table-municipios label').text("El área es demasiado grande").show();
            //Vulve a funcionar el sketch
            $(".esri-sketch__button").removeClass("sketchDisabled");
            $(".esri-sketch__button").removeAttr("disabled","");
            $('.loading-gif img').hide();
        });
    });
}
function creaTablaMunicipios(datos) {
    $('#table-municipios table').remove();
    $('#table-municipios label').hide();
    clearInterval(id_anim_mun_cargando);
    if (Object.keys(datos).length > 0) {
        $('#table-municipios').append("<table><thead><tr><td>Estado</td><td>Municipio(s)</td></tr></thead><tbody></tbody></table>")
        estd = Object.keys(datos)
        estd.sort();
        for (const estado in estd) {
            datos[estd[estado]].sort();
            $('#table-municipios tbody').append("<tr><td>"+estd[estado]+"</td><td>"+datos[estd[estado]].join(", ")+"</td></tr>");
        }
    }
    else {
        $('#table-municipios label').text("No hay municipios").show();
    }
}
function agregasComas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

document.addEventListener('urls-listas', function(response){
        var geo = response.detail.geometry;
        var exceptLayers = response.detail.exceptLayers;
        queryPromises = [];
        resultados = {};
        if(exceptLayers.length > 0){
            removeLayers(exceptLayers);
        }
        //console.log(queryParams);
        Object.keys(queryParams).forEach(function(key){
            var queryTask = new QueryTask(urls[key]);
            var query = new Query();
            query.returnGeometry = false;
            query.geometry = geo;
            query.outFields = queryParams[key].outFields;
            query.where = queryParams[key].where;
            query.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
            if(tiposAnalisisEspecial["Poblacion"] && tiposAnalisisEspecial["Poblacion"].includes(key)){
                queryPromises.push(queryTask.executeForIds(query));
            } else if(tiposAnalisisEspecial["GradoVulnerabilidadSocial"] && tiposAnalisisEspecial["GradoVulnerabilidadSocial"].includes(key)){
                queryPromises.push(queryTask.execute(query));
            } else if(tiposAnalisisEspecial["LenguasIndigenas"] && tiposAnalisisEspecial["LenguasIndigenas"].includes(key)){
                queryPromises.push(queryTask.executeForIds(query));
            } else{
                queryPromises.push(queryTask.executeForCount(query));
            }
            
        })
        //console.log('this is query promises',queryPromises);
        Promise.all(queryPromises).then(function(result){ 
            //console.log('este es result',result);
            Object.keys(queryParams).forEach(function(key, idx){
                if(tiposAnalisisEspecial["Poblacion"] && tiposAnalisisEspecial["Poblacion"].includes(key)){       
                    var tipo;
                    if(key == "PoblacionAgeb") tipo = "ageb";
                    else if(key == "PoblacionRural") tipo = "rural";
                    else if(key == "PoblacionITER") tipo = "iter";
                    //console.log("la cosa rara", result[idx]);
                    processResultPob(tipo, urls[key], queryParams[key].outFields, result[idx], 0);
                } else if(tiposAnalisisEspecial["GradoVulnerabilidadSocial"] && tiposAnalisisEspecial["GradoVulnerabilidadSocial"].includes(key)){
                    var gradoVulnerabilidadSocial = {
                        "Muy Bajo": 0,
                        "Bajo": 0,
                        "Medio": 0,
                        "Alto": 0,
                        "Muy Alto": 0
                    }
                    result[idx].features.forEach(function(val, idx){
                        gradoVulnerabilidadSocial[val.attributes.GVS_ISE10]++;
                    });
                    resultados[key] = JSON.stringify(gradoVulnerabilidadSocial);
                    resultadosAnalisis++;
                    //t Analisis: ",resultadosAnalisis);
                } else if(tiposAnalisisEspecial["LenguasIndigenas"] && tiposAnalisisEspecial["LenguasIndigenas"].includes(key)){
                    processResultLenguas(result[idx], urls[key], queryParams[key].outFields);
                } else {
                    resultados[key] = result[idx];
                }
            })
            if(resultadosAnalisis === Object.keys(tiposAnalisisEspecial).length){
                
                var evt = new CustomEvent('analisis-completo', { 'detail': resultados });
                document.dispatchEvent(evt);
            }       
        }, function(error){
            console.log(err);
        });
    
});

document.addEventListener('lenguas-obtenidas', function(){
    //console.log("Lenguas obtenidas. ESCUCHADO")
    resultadosAnalisis++;
    //console.log("esto es result Analisis: ",resultadosAnalisis);
    if(resultadosAnalisis === Object.keys(tiposAnalisisEspecial).length){
        
        var evt = new CustomEvent('analisis-completo', { 'detail': resultados });
        document.dispatchEvent(evt);
    }   
})

document.addEventListener('poblacion-obtenida', function(){
   // console.log("Poblacion obtenida ESCUCHADO!!!!");
    sumaPoblacion();
    resultados["Poblacion"] = TotalPobFinal;
    resultados["Viviendas"] = TotalVivFinal;
    resultados["TotalPobFem"] = TotalPobFem;
    resultados["TotalPobMas"] = TotalPobMas;
    resultados["TotalMenor12"] = TotalMenor12;
    resultados["TotalMenor12F"] = TotalMenor12F;
    resultados["TotalMenor12M"] = TotalMenor12M;
    resultados["TotalMayor60"] = TotalMayor60;
    resultados["TotalMayor60F"] = TotalMayor60F;
    resultados["TotalMayor60M"] = TotalMayor60M;
    resultadosAnalisis++;
    //console.log("esto es result Analisis: ",resultadosAnalisis);

    if(resultadosAnalisis === Object.keys(tiposAnalisisEspecial).length){
        
        var evt = new CustomEvent('analisis-completo', { 'detail': resultados });
        document.dispatchEvent(evt);
    }
})
document.addEventListener('analisis-completo', function(result){
    //console.log(result);
    clearInterval(randomTextInterval);
    $("#Poblacion .resultNumber").text(agregasComas(result.detail["Poblacion"]));
    $("#Viviendas .resultNumber").text(agregasComas(result.detail["Viviendas"]));
    $("#Hospitales .resultNumber").text(agregasComas(result.detail["Hospitales"]));
    $("#Escuelas .resultNumber").text(agregasComas(result.detail["Escuelas"]));
    $("#Supermercados .resultNumber").text(agregasComas(result.detail["Supermercados"]));
    $("#Aeropuertos .resultNumber").text(agregasComas(result.detail["Aeropuertos"]));
    $("#Hoteles .resultNumber").text(agregasComas(result.detail["Hoteles"]));
    $("#Bancos .resultNumber").text(agregasComas(result.detail["Bancos"]));
    $("#Gasolineras .resultNumber").text(agregasComas(result.detail["Gasolineras"]));
    $("#Presas .resultNumber").text(agregasComas(result.detail["Presas"]));
    $("#Ganadero .resultNumber").text(agregasComas(result.detail["Ganaderias"]));
    $("#Colonias .resultNumber").text(agregasComas(result.detail["Colonias"]));
    $("#AntropologiaINAH .resultNumber").text(agregasComas(result.detail["BibliotecaINAH"] + result.detail["MonumentoHistorico"] + result.detail["MuseoINAH"] + result.detail["PatrimonioMundial"] + result.detail["ZonasArqueologicas"]));
  
    var gvs = JSON.parse(result.detail["GradoVulnerabilidadSocial"]);
    $("#gvsMuyBajo").text(agregasComas(gvs["Muy Bajo"]));
    $("#gvsBajo").text(agregasComas(gvs["Bajo"]));
    $("#gvsMedio").text(agregasComas(gvs["Medio"]));
    $("#gvsAlto").text(agregasComas(gvs["Alto"]));
    $("#gvsMuyAlto").text(agregasComas(gvs["Muy Alto"]));
  
    //
    $("#pob_m_t .resultNumber").text(agregasComas(result.detail["TotalPobMas"]));
    $("#pob_f_t .resultNumber").text(agregasComas(result.detail["TotalPobFem"]));
    $("#pob_menor_12").text(agregasComas(result.detail["TotalMenor12"]));
    $("#pob_m_menor_12").text(agregasComas(result.detail["TotalMenor12M"]));
    $("#pob_f_menor_12").text(agregasComas(result.detail["TotalMenor12F"]));
    $("#pob_mayor_60").text(agregasComas(result.detail["TotalMayor60"]));
    $("#pob_m_mayor_60").text(agregasComas(result.detail["TotalMayor60M"]));
    $("#pob_f_mayor_60").text(agregasComas(result.detail["TotalMayor60F"]));
    $("#LenguasIndigenas .resultNumber").text(agregasComas(result.detail["TotalLenguasIndigenas"]));
  
    /*Abrir el panel al hacer un análisis*/
    // if($(".ui-panel").hasClass("ui-panel-closed"))
    //   $("#ui-settings-button")[0].click();
    // if($("#analisis-container div")[0].attributes[1].value == "true")
    //       $("#analisis-container h4")[0].click();
    
    generaTabla(pobTotalXEstado);
});
function removeLayers(layerNames){
    //
    var index;
    layerNames.forEach(function(name){
        index = Object.keys(queryParams).indexOf(name);
        if(index != -1)
            delete queryParams[name];
        Object.keys(tiposAnalisisEspecial).forEach(function(tipo){
            index = tiposAnalisisEspecial[tipo].indexOf(name);
            if(index != -1) tiposAnalisisEspecial[tipo].splice(index, 1);
        })
    })

    Object.keys(tiposAnalisisEspecial).forEach(function(tipo){
        if(tiposAnalisisEspecial[tipo].length == 0) delete tiposAnalisisEspecial[tipo];
    })
}

function getQuery(array, objectidName = "OBJECTID"){
    if(array.length <= maxFeaturesReturned)
        return  objectidName + " IN (" + array.join(',') + ")";

    return objectidName + " IN (" + array.splice(0, maxFeaturesReturned).join(",") + ") OR " + getQuery(array, objectidName);
}

function processResultLenguas(idsArray, serviceUrl, outFields){
    
    if(idsArray){
        var queryTask = new QueryTask(serviceUrl);
        var query = new Query();
        query.returnGeometry = false;
        query.outFields = outFields;
        query.where = getQuery(idsArray);
        query.returnDistinctValues = true;
        queryTask.execute(query).then(function(results){
            TotalLenguasIndigenas += results.features.length;
            conteoLenguas++;
            if(conteoLenguas === tiposAnalisisEspecial["LenguasIndigenas"].length) {
                resultados["TotalLenguasIndigenas"] = TotalLenguasIndigenas;
                var evt = new CustomEvent('lenguas-obtenidas');
                document.dispatchEvent(evt);
            }
        });
    } else {
        conteoLenguas++;
            if(conteoLenguas === tiposAnalisisEspecial["LenguasIndigenas"].length) {
                resultados["TotalLenguasIndigenas"] = TotalLenguasIndigenas;
                var evt = new CustomEvent('lenguas-obtenidas');
                document.dispatchEvent(evt);
            }
    }
}

function processResultPob(type, url, outFields, idsArray, suma, pobResult = []){
    //console.log("estos son los queryparams outfields",outFields);
    //console.log("esto es idarray: ",idsArray)
    if(!idsArray){
         pobTotalAjustada[type] = [];
         if(Object.keys(pobTotalAjustada).length === tiposAnalisisEspecial["Poblacion"].length){
            var evt = new CustomEvent('poblacion-obtenida');
            document.dispatchEvent(evt);
        }
    } else {
            var objId = type == "ageb" ? "OBJECTID_1" : "OBJECTID";
            var ids = idsArray.splice(0, maxFeaturesReturned);
            var queryTask = new QueryTask(url);
            var query = new Query();
            query.returnGeometry = false;
            query.outFields = outFields;
            query.spatialRelationship = "esriSpatialRelIntersects";
            query.where = objId + " IN (" + ids.join(",") + ")";
            
            // console.log('este es el query: ',query);
            // console.log('este es el queryTask: ',queryTask);
            var queryPob = queryTask.execute(query).then(function(result){ //el then aregló todo
                
                //console.log("este es result del query de pob",result);
                for (var idx in result.features) {
                    if(!pobResult.hasOwnProperty(result.features[idx].attributes.NOM_ENT)){
                        if(!estados.includes(result.features[idx].attributes.NOM_ENT)) estados.push(result.features[idx].attributes.NOM_ENT);
                        
                        pobResult[result.features[idx].attributes.NOM_ENT] = {
                            "Estado": result.features[idx].attributes.NOM_ENT,
                            "TotPob": result.features[idx].attributes.POBTOT,
                            "TotViv": result.features[idx].attributes.VIVTOT,
                            "PobMas": result.features[idx].attributes.POBMAS,
                            "PobFem": result.features[idx].attributes.POBFEM,
                            "Menor12": result.features[idx].attributes.POBTOT - result.features[idx].attributes.P_12YMAS,
                            "Menor12M": result.features[idx].attributes.POBMAS - result.features[idx].attributes.P_12YMAS_M,
                            "Menor12F": result.features[idx].attributes.POBFEM - result.features[idx].attributes.P_12YMAS_F,
                            "Mas60": result.features[idx].attributes.P_60YMAS,
                            "Mas60M": result.features[idx].attributes.P_60YMAS_M,
                            "Mas60F": result.features[idx].attributes.P_60YMAS_F
                        }
                    } else {
                        pobResult[result.features[idx].attributes.NOM_ENT] = {
                            "Estado": result.features[idx].attributes.NOM_ENT,
                            "TotPob": pobResult[result.features[idx].attributes.NOM_ENT]["TotPob"] + result.features[idx].attributes.POBTOT,
                            "TotViv": pobResult[result.features[idx].attributes.NOM_ENT]["TotViv"] + result.features[idx].attributes.VIVTOT,
                            "PobMas": pobResult[result.features[idx].attributes.NOM_ENT]["PobMas"] + result.features[idx].attributes.POBMAS,
                            "PobFem": pobResult[result.features[idx].attributes.NOM_ENT]["PobFem"] + result.features[idx].attributes.POBFEM,
                            "Menor12": pobResult[result.features[idx].attributes.NOM_ENT]["Menor12"] + result.features[idx].attributes.POBTOT - result.features[idx].attributes.P_12YMAS,
                            "Menor12M": pobResult[result.features[idx].attributes.NOM_ENT]["Menor12M"] + result.features[idx].attributes.POBMAS - result.features[idx].attributes.P_12YMAS_M,
                            "Menor12F": pobResult[result.features[idx].attributes.NOM_ENT]["Menor12F"] + result.features[idx].attributes.POBFEM - result.features[idx].attributes.P_12YMAS_F,
                            "Mas60": pobResult[result.features[idx].attributes.NOM_ENT]["Mas60"] + result.features[idx].attributes.P_60YMAS,
                            "Mas60M": pobResult[result.features[idx].attributes.NOM_ENT]["Mas60M"] + result.features[idx].attributes.P_60YMAS_M,
                            "Mas60F": pobResult[result.features[idx].attributes.NOM_ENT]["Mas60F"] + result.features[idx].attributes.P_60YMAS_F
                        }
                    }
                    suma += result.features[idx].attributes.POBTOT;
                }

                if(idsArray.length > 0) {
                    processResultPob(type, url, outFields, idsArray, suma, pobResult);
                    console.log("Restantes: " + type + ":" + idsArray.length)
                } else {
                    pobTotal.push(pobResult);

                    //console.log(type, suma);
                    
                    Object.keys(pobResult).forEach(function(d){
                        ajustaDatosObjPob(pobResult[d]);
                    });

                    pobTotalAjustada[type] = pobResult;
                    //console.log(Object.keys(pobTotalAjustada).length == tiposAnalisisEspecial["Poblacion"].length);
                    if(Object.keys(pobTotalAjustada).length === tiposAnalisisEspecial["Poblacion"].length){
                        var evt = new CustomEvent('poblacion-obtenida');
                        document.dispatchEvent(evt);
                    }
                }
            }).then(function(value) {
                //console.log("exito!",value); // Success!
              }, function(reason) {
                console.log("error",reason); // Error!
              });;
            queryTaskPobArray.push(queryPob);
    }
}


function sumaPoblacion(){
    var obj;

    if(estados.length > 0){
        estados.forEach(function(edo){
            if(pobTotalAjustada["ageb"] && Object.keys(pobTotalAjustada["ageb"]).includes(edo) && pobTotalAjustada["rural"] && Object.keys(pobTotalAjustada["rural"]).includes(edo) ){
                obj = {
                    "Estado": edo,
                    "TotPob": pobTotalAjustada["ageb"][edo].TotPob + pobTotalAjustada["rural"][edo].TotPob,
                    "TotViv": pobTotalAjustada["ageb"][edo].TotViv + pobTotalAjustada["rural"][edo].TotViv,
                    "PobMas": pobTotalAjustada["ageb"][edo].PobMas + pobTotalAjustada["rural"][edo].PobMas,
                    "PobFem": pobTotalAjustada["ageb"][edo].PobFem + pobTotalAjustada["rural"][edo].PobFem,
                    "Menor12": pobTotalAjustada["ageb"][edo].Menor12 + pobTotalAjustada["rural"][edo].Menor12,
                    "Menor12M": pobTotalAjustada["ageb"][edo].Menor12M + pobTotalAjustada["rural"][edo].Menor12M,
                    "Menor12F": pobTotalAjustada["ageb"][edo].Menor12F + pobTotalAjustada["rural"][edo].Menor12F,
                    "Mas60": pobTotalAjustada["ageb"][edo].Mas60 + pobTotalAjustada["rural"][edo].Mas60,
                    "Mas60M": pobTotalAjustada["ageb"][edo].Mas60M + pobTotalAjustada["rural"][edo].Mas60M,
                    "Mas60F": pobTotalAjustada["ageb"][edo].Mas60F + pobTotalAjustada["rural"][edo].Mas60F
                }
            } else if(pobTotalAjustada["ageb"] && Object.keys(pobTotalAjustada["ageb"]).includes(edo)){
                // console.log("Rural no contiene: " + edo);
                obj = {
                    "Estado": edo,
                    "TotPob": pobTotalAjustada["ageb"][edo].TotPob,
                    "TotViv": pobTotalAjustada["ageb"][edo].TotViv,
                    "PobMas": pobTotalAjustada["ageb"][edo].PobMas,
                    "PobFem": pobTotalAjustada["ageb"][edo].PobFem,
                    "Menor12": pobTotalAjustada["ageb"][edo].Menor12,
                    "Menor12M": pobTotalAjustada["ageb"][edo].Menor12M,
                    "Menor12F": pobTotalAjustada["ageb"][edo].Menor12F,
                    "Mas60": pobTotalAjustada["ageb"][edo].Mas60,
                    "Mas60M": pobTotalAjustada["ageb"][edo].Mas60M,
                    "Mas60F": pobTotalAjustada["ageb"][edo].Mas60F
                }
            } else if(pobTotalAjustada["rural"] && Object.keys(pobTotalAjustada["rural"]).includes(edo)){
                // console.log("AGEB no contiene: " + edo);
                obj = {
                    "Estado": edo,
                    "TotPob": pobTotalAjustada["rural"][edo].TotPob,
                    "TotViv": pobTotalAjustada["rural"][edo].TotViv,
                    "PobMas": pobTotalAjustada["rural"][edo].PobMas,
                    "PobFem": pobTotalAjustada["rural"][edo].PobFem,
                    "Menor12": pobTotalAjustada["rural"][edo].Menor12,
                    "Menor12M": pobTotalAjustada["rural"][edo].Menor12M,
                    "Menor12F": pobTotalAjustada["rural"][edo].Menor12F,
                    "Mas60": pobTotalAjustada["rural"][edo].Mas60,
                    "Mas60M": pobTotalAjustada["rural"][edo].Mas60M,
                    "Mas60F": pobTotalAjustada["rural"][edo].Mas60F
                }
            } else if(pobTotalAjustada["iter"] && Object.keys(pobTotalAjustada["iter"]).includes(edo)){
                // console.log("AGEB no contiene: " + edo);
                obj = {
                    "Estado": edo,
                    "TotPob": pobTotalAjustada["iter"][edo].TotPob,
                    "TotViv": pobTotalAjustada["iter"][edo].TotViv,
                    "PobMas": pobTotalAjustada["iter"][edo].PobMas,
                    "PobFem": pobTotalAjustada["iter"][edo].PobFem,
                    "Menor12": pobTotalAjustada["iter"][edo].Menor12,
                    "Menor12M": pobTotalAjustada["iter"][edo].Menor12M,
                    "Menor12F": pobTotalAjustada["iter"][edo].Menor12F,
                    "Mas60": pobTotalAjustada["iter"][edo].Mas60,
                    "Mas60M": pobTotalAjustada["iter"][edo].Mas60M,
                    "Mas60F": pobTotalAjustada["iter"][edo].Mas60F
                }
            }
            
            pobTotalXEstado.push(obj);
        });

        pobTotalXEstado.forEach(function(value, idx){
            ajustaDatosObjPob(value);
        });

        pobTotalXEstado.forEach(function(value, idx){
            TotalPobFinal += value.TotPob;
            TotalVivFinal += value.TotViv;
            TotalMenor12 += value.Menor12;
            TotalMayor60 += value.Mas60;

            TotalPobFem += value.PobFem;
            TotalPobMas += value.PobMas;

            TotalMenor12F += value.Menor12F;
            TotalMenor12M += value.Menor12M;

            TotalMayor60F += value.Mas60F;
            TotalMayor60M += value.Mas60M;
        })
    } else {
        TotalPobFinal = 0;
        TotalVivFinal = 0;
        TotalMenor12 = 0;
        TotalMayor60 = 0;

        TotalPobFem = 0;
        TotalPobMas = 0;

        TotalMenor12F = 0;
        TotalMenor12M = 0;

        TotalMayor60F = 0;
        TotalMayor60M = 0;
    }
}

function ajustaDatosObjPob(obj){
  /**
   ****Función Ajuste Población****
   *Cálculo de población Femenino y Masculino a partir de AGEB y Localidad Rural
   *obteniendo la diferencia del total con respecto a la suma de ambos campos
   *ajustando el resultado datos tomados de INEGI al 2010 (Total = 112,336,538
   *Mujeres = 57,481,307 Hombres = 51,855,231//Con porcentaje de Mujeres = 51.17%
   *Hombres 48.83%)
   **/

  //Diferencia de poblacion Completa
    var difPobTot = obj.TotPob - (obj.PobFem + obj.PobMas);
    var difPobFem = difPobTot * 0.512;
    var difPobMas = difPobTot * 0.488;
    difPobFem = Math.round(difPobFem);
    difPobMas = Math.round(difPobMas);
    obj.PobFem = obj.PobFem + difPobFem;
    obj.PobMas = obj.PobMas + difPobMas;
  //Diferencia Menores a 12 años
    var difPobTot12 = obj.Menor12 - ( obj.Menor12M + obj.Menor12F );
    var difPobFem12 = difPobTot12 * 0.512;
    var difPobMas12 = difPobTot12 * 0.488;
    difPobFem12 = Math.round(difPobFem12);
    difPobMas12 = Math.round(difPobMas12);
    obj.Menor12F = obj.Menor12F + difPobFem12;
    obj.Menor12M = obj.Menor12M + difPobMas12;
  //Diferencia Mayores a 60
    var difPobTot60 = obj.Mas60 - ( obj.Mas60M + obj.Mas60F );
    var difPobFem60 = difPobTot60 * 0.512;
    var difPobMas60 = difPobTot60 * 0.488;
    difPobFem60 = Math.round(difPobFem60);
    difPobMas60 = Math.round(difPobMas60);
    obj.Mas60F = obj.Mas60F + difPobFem60;
    obj.Mas60M = obj.Mas60M + difPobMas60;

    return obj;
}

function createRandomText(){
    randomTextInterval = setInterval(function(){
            $(".resultNumber").each(function(){
              $(this).text(agregasComas(Math.floor(Math.random() * 99999)));
            })
          }, delay);
  }
/*
**********************************************************
	Fin funciones de Obtener resultados outStatistics
**********************************************************
*/
