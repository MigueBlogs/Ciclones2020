var map, navToolbar;
var basemapGallery;
var geoLocate;
var home;
var s;
var overviewMapDijit;
var resizeTimer;
var tb;

var conaguaLayerCAP;
 
var geometryService;
var distanceParams;
var bufferParams;
var bufferGraphics;

var clickDraw;
var overDraw;
var dragDraw;
var dragStartDraw;
var dragEndDraw;
var drawVertex;
var endGraphic;
var lastVertex;

var cambioBarra = false;
var stopBarra;

var hurricane = false;
var municipios = false;
var rios = false;
var viento = false;
var visible = [];

 /*para viento*/
var rasterLayer;
var canvasSupport;

var renderer;

var conoLayer;
var editToolbar, ctxMenuForGraphics;
var selected, currentLocation;

var lastGeometry;
var exceptLayers = ["PoblacionITER"];
var marInterval;

var goesTopAnimation;
var goesRGBAnimation;
var radarImagesAnimation;
var goesAnimationDuration = 100;
var radarImagesAnimationDuration = 500;
var windy;

var windUpdateTimeInterval = 6 * 60 * 60 * 1000;
var windUpdateEvent;
var airplanespdateTimeInterval = 10 * 1000;
var ariplanesUpdateEvent;
var rgbCloudsUpdateTimeInterval = 1 * 60 * 60 * 1000;
var rgbCloudsUpdateEvent;
var topCloudsUpdateTimeInterval = 1 * 60 * 60 * 1000;
var topCloudsUpdateEvent;
var radarImagesUpdateTimeInterval = 1 * 60 * 60 * 1000;
var radarImagesUpdateEvent;
var wazeAlertsUpdateTimeInterval = 10 * 60 * 1000;
var wazeAlertsUpdateEvent;
var wazeJamsUpdateTimeInterval = 30 * 60 * 1000;
var wazeJamsUpdateEvent;
var sismosUpdateEvent;

require([
  "esri/map",

  "esri/geometry/Extent",

  "esri/toolbars/draw",
  "esri/dijit/BasemapToggle",
  "esri/dijit/BasemapGallery",
  "esri/dijit/HomeButton",
  "esri/dijit/Search",
  "esri/arcgis/utils",

  "esri/units" ,
  "esri/dijit/Legend",

  "dojo/on",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/PictureFillSymbol",
  "esri/symbols/CartographicLineSymbol",
  
  "esri/symbols/PictureMarkerSymbol",
  
  "esri/symbols/TextSymbol",
  "esri/symbols/Font",
  
  "esri/renderers/SimpleRenderer",
  "esri/renderers/UniqueValueRenderer",
  
  "esri/graphic",
  "dijit/registry",
  "esri/Color",
  
  "esri/tasks/query",
  "esri/tasks/QueryTask",
  
  "esri/geometry/Circle",
  "esri/geometry/Point",
  "esri/layers/FeatureLayer",

  "esri/config",
  "esri/toolbars/navigation",
  "dojo/parser",
  "esri/InfoTemplate",

  "esri/dijit/PopupTemplate",
  "esri/urlUtils",

  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/layers/ImageParameters",
  
  "esri/layers/LabelClass",

  "esri/layers/GraphicsLayer",
  "esri/geometry/Polygon",
  "esri/SpatialReference",

  "esri/Color",
  /**/
  "dojo/json",
  "dojo/dom",
  "dojo/dom-construct",
  /**/
  "esri/request",

  "dojo/parser",
  "dojo/_base/array",
  /**/
  "plugins/RasterLayer",

  "esri/toolbars/edit",
  "esri/geometry/jsonUtils",
  "dijit/Menu",
  "dijit/MenuItem",
  "dijit/MenuSeparator",

  "esri/tasks/GeometryService",
  "esri/tasks/DistanceParameters",

  "esri/layers/MapImageLayer",
  "esri/geometry/Extent",

  "dojo/domReady!"
], function (
  Map,

  Extent,

  Draw,
  BasemapToggle,
  BasemapGallery,
  HomeButton,
  Search,
  arcgisUtils,

  Units,
  Legend,

  on,
  SimpleFillSymbol,
  SimpleMarkerSymbol,
  SimpleLineSymbol,
  PictureFillSymbol,
  CartographicLineSymbol,
  
  PictureMarkerSymbol,

  TextSymbol,
  Font,

  SimpleRenderer,
  UniqueValueRenderer,
  
  Graphic,
  registry,
  Color,
  
  Query,
  QueryTask,
  
  Circle,
  Point,
  FeatureLayer,

  esriConfig,
  Navigation,
  parser,
  InfoTemplate,

  PopupTemplate,
  urlUtils,

  ArcGISDynamicMapServiceLayer,
  ImageParameters,
  
  LabelClass,

  GraphicsLayer,
  Polygon,
  SpatialReference,


  Color,
  /**/
  JSON,
  dom,
  domConstruct,
  /**/
  esriRequest,

  parser,
  arrayUtils,

  RasterLayer,

  Edit,
  geometryJsonUtils,
  Menu,
  MenuItem,
  MenuSeparator,

  GeometryService,
  DistanceParameters,
  
  MapImageLayer,
  Extent
  ) {
  
  esriConfig.defaults.io.proxyUrl = "http://www.atlasnacionalderiesgos.gob.mx/proxy/proxy.php";
  esriConfig.defaults.io.alwaysUseProxy = false;

  geometryService = new GeometryService("http://servicios1.cenapred.unam.mx:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer");

  distanceParams = new DistanceParameters();
  distanceParams.distanceUnit = GeometryService.UNIT_METER;
  
  function crearMapa() {
    map = new esri.Map("map", {
        center: [-101.608429, 23.200961],
        zoom: 5,
        basemap: "satellite",
        slider: true, //mostrar botones zoom en el mapa
        autoResize: true,
        showLabels : true
    });

    basemapGallery = new esri.dijit.BasemapGallery({
      showArcGISBasemaps: true,
      map: map
    }, "basemapGallery");
    basemapGallery.startup();
    basemapGallery.on("load", function(){
      basemapGallery.select("basemap_8");
    });

    home = new esri.dijit.HomeButton({
      map: map
    }, "HomeButton");
    home.startup();

    s = new esri.dijit.Search({
      map: map,
      autonavigate:true
    }, "search");
    s.startup();

    editToolbar = new Edit(map);

    conaguaLayerCAP = new GraphicsLayer({id: "conaguaCAP"});
    map.addLayer(conaguaLayerCAP);

    var sismosLayer = new GraphicsLayer({id: "sismosLayer" });
    map.addLayer(sismosLayer);

    var volcanesLayer = new GraphicsLayer({id: "volcanesLayer" });
    map.addLayer(volcanesLayer);
	
	//addFeatureLayer(map, "https://rmgir.proyectomesoamerica.org/server/rest/services/Trans_Sept_2018/SIMULACRO/MapServer/1", "sismo19s", 0.6);

    /*Servicio Predicción huracán*/
    prediccionLayer = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/0",{
      id: "prediccionCiclones",
      mode: FeatureLayer.MODE_SNAPSHOT,    
      opacity: 0.7,
      showLabels: true,
      outFields: ["*"]
    });
       
    var prediccionLabel = new TextSymbol().setColor(new Color([255,255,255])).setFont(new Font("24px", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLD, "Arial")).setOffset(11, -5).setAlign(TextSymbol.ALIGN_START);
  
    var prediccionlabelJson = {
      "labelExpressionInfo": {
        "value": "{prob2day}", 
      }
    };

    var lc = new LabelClass(prediccionlabelJson);
    lc.symbol = prediccionLabel; // symbol also can be set in LabelClass' json
    prediccionLayer.setLabelingInfo([ lc ]);

    prediccionAreaLayer = new ArcGISDynamicMapServiceLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer", {
          id: "areaPrediccionCiclones",
          "opacity" : 0.5          
    });

    prediccionAreaLayer.setVisibleLayers([1]);

    map.addLayer(prediccionLayer);
    map.addLayer(prediccionAreaLayer);

    /*Fin Servicio Predicción Hueracán*/

    /*Servicio Huracan*/
    /*warnings en la costa*/
	/*
    var warningColor = new Color("#740000");
    var warningColorLine = new SimpleLineSymbol("solid", warningColor, 1.5);
    var warningColorRender = new SimpleRenderer(warningColorLine);

    c2 = new FeatureLayer("https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/wwa_meteocean_tropicalcyclones_trackintensityfcsts_time/MapServer/2",{
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"]
    });
	*/
    //c2.setRenderer(warningColorRender);

    /*Posición del huracan*/
	/*
    var defaultSymbol;
    var renderPosition = new UniqueValueRenderer(defaultSymbol,"dvlbl");

    renderPosition.addValue("S", new PictureMarkerSymbol('imagenes/imgS.png',40,40));
    renderPosition.addValue("D", new PictureMarkerSymbol('imagenes/imgD.png',40,40));
    renderPosition.addValue("H", new PictureMarkerSymbol('imagenes/imgH.png',40,40));
    renderPosition.addValue("M", new PictureMarkerSymbol('imagenes/imgH.png',40,40));

    c3 = new FeatureLayer("https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/wwa_meteocean_tropicalcyclones_trackintensityfcsts_time/MapServer/3",{
      mode: FeatureLayer.MODE_SNAPSHOT,
      showLabels:true,
      opacity: 1,
      showLabels: true,
      outFields: ["*"]
    });

    c3.setRenderer(renderPosition);
	*/
    /*label de la posición huracan*/
	/*
    var c3Label = new TextSymbol().setColor(new Color([255,255,255]));
    c3Label.font.setSize("10pt");
    c3Label.font.setFamily("arial");

    var json = {
      "labelExpressionInfo": {
        "value": "{stormname}, Cat. {ssnum}, {datelbl}, {tcdvlp}", 
      }
    };

    var labelClass = new LabelClass(json);
    labelClass.symbol = c3Label;
    c3.setLabelingInfo([ labelClass ]);
	*/
    /*Linea Recorrido*/
	/*
    c4 = new FeatureLayer("https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/wwa_meteocean_tropicalcyclones_trackintensityfcsts_time/MapServer/4",{
      mode: FeatureLayer.MODE_ONDEMAND,
      opacity: 1,
      showLabels: true,
      outFields: ["*"]
    });
	*/
    /*Cono Incertidumbre*/
	/*
    c5 = new FeatureLayer("https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/wwa_meteocean_tropicalcyclones_trackintensityfcsts_time/MapServer/5",{
	//c5 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones_active/MapServer/16",{
      mode: FeatureLayer.MODE_ONDEMAND,
      opacity: 0.5
    });
	*/
    /*//c5 = new FeatureLayer("https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/wwa_meteocean_tropicalcyclones_trackintensityfcsts_time/MapServer/5",{
	c12 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones_active/MapServer/26",{
      mode: FeatureLayer.MODE_ONDEMAND,
      opacity: 0.5
    });

    //c5 = new FeatureLayer("https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/wwa_meteocean_tropicalcyclones_trackintensityfcsts_time/MapServer/5",{
	c13 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones_active/MapServer/36",{
      mode: FeatureLayer.MODE_ONDEMAND,
      opacity: 0.5
    });	
	*/
	
    /*Posicón Pasada Huracan*/
	/*
    var renderPastPosition = new UniqueValueRenderer(defaultSymbol,"basin");
    renderPastPosition.addValue("ep", new PictureMarkerSymbol('imagenes/imgTrack.png',8,8));
    renderPastPosition.addValue("al", new PictureMarkerSymbol('imagenes/imgTrack.png',8,8));

    c7 = new FeatureLayer("https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/wwa_meteocean_tropicalcyclones_trackintensityfcsts_time/MapServer/7",{
      mode: FeatureLayer.MODE_AUTO,
      opacity: 1
    });

    c7.setRenderer(renderPastPosition);
	*/
    /*Recorrido observado huracan*/
	/*
    c8 = new FeatureLayer("https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/wwa_meteocean_tropicalcyclones_trackintensityfcsts_time/MapServer/8",{
      mode: FeatureLayer.MODE_AUTO,
      opacity: 1
    });

    c2.setRefreshInterval(10);
    c3.setRefreshInterval(10);
    c4.setRefreshInterval(10);
    c5.setRefreshInterval(10);
    c7.setRefreshInterval(10);

	*/
	

    /*conoLayer = new FeatureLayer("https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/wwa_meteocean_tropicalcyclones_trackintensityfcsts_time/MapServer/6",{
      id: "conoHuracan",
      mode: FeatureLayer.AUTO,
      opacity: 0
    });
    conoLayer.setRefreshInterval(10);

    var conoLoadEvent = conoLayer.on("load", function(){
      conoLoadEvent.remove();
      map.addLayer(conoLayer);

      var conoEvent = map.on("layer-add-result", function(){
        conoEvent.remove();
        conoLayer.on("update-end", function(graphic){
		  console.log("Analizando capa");
          var geometries = map.getLayer("conoHuracan").graphics.map(function(graphic){ return graphic.geometry });
          if(geometries.length > 0) unionGeometries(geometries);
        });
      });
    });

    conoLayer.on("mouse-over", function(evt) {
      selected = evt.graphic;
      ctxMenuForGraphics.bindDomNode(evt.graphic.getDojoShape().getNode());
    });

    conoLayer.on("mouse-out", function(evt) {
      ctxMenuForGraphics.unBindDomNode(evt.graphic.getDojoShape().getNode());
    });
*/
    /*
	*/
    /**/
	
	// Servicio de huracanes Alternativo

    // EP1

    noaaAlt1 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/4",{
      id: "ep1_ForecastPoints",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt1_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/4",{
      id: "at1_ForecastPoints",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt2 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/5",{
      id: "ep1_ForecastTrack",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt2_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/5",{
      id: "at1_ForecastTrack",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });    

    noaaAlt3 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/6",{
      id: "ep1_ForecastCone",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 0.5,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt3_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/6",{
      id: "at1_ForecastCone",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 0.5,
      showLabels: true,
      outFields: ["*"],
      visible: false
    }); 

    noaaAlt4 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/7",{
      id: "ep1_WatchWarnings",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt4_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/7",{
      id: "at1_WatchWarnings",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });    

    noaaAlt5 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/8",{
      id: "ep1_PastPoints",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt5_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/8",{
      id: "at1_PastPoints",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });    

    // EP2

    noaaAlt6 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/14",{
      id: "ep2_ForecastPoints",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });    

    noaaAlt7 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/15",{
      id: "ep2_ForecastTrack",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt8 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/16",{
      id: "ep2_ForecastCone",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 0.5,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt9 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/17",{
      id: "ep2_WatchWarnings",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });    

    noaaAlt10 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/18",{
      id: "ep2_PastPoints",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });


    noaaAlt6_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/15",{
      id: "at2_ForecastPoints",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });    

    noaaAlt7_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/16",{
      id: "at2_ForecastTrack",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt8_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/17",{
      id: "at2_ForecastCone",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 0.5,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt9_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/18",{
      id: "at2_WatchWarnings",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });    

    noaaAlt10_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/19",{
      id: "at2_PastPoints",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });


    // EP3

    noaaAlt11 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/24",{
      id: "ep3_ForecastPoints",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt12 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/25",{
      id: "ep3_ForecastTrack",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });    

    noaaAlt13 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/26",{
      id: "ep3_ForecastCone",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 0.5,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt14 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/27",{
      id: "ep3_WatchWarnings",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });
   
    noaaAlt15 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/28",{
      id: "ep3_PastPoints",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });        

    noaaAlt11_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/26",{
      id: "at3_ForecastPoints",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt12_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/27",{
      id: "at3_ForecastTrack",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });    

    noaaAlt13_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/28",{
      id: "at3_ForecastCone",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 0.5,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt14_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/29",{
      id: "at3_WatchWarnings",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });
   
    noaaAlt15_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/30",{
      id: "at3_PastPoints",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });    



    // EP4

    noaaAlt16 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/34",{
      id: "ep4_ForecastPoints",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt17 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/35",{
      id: "ep4_ForecastTrack",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt18 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/36",{
      id: "ep4_ForecastCone",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 0.5,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });    

    noaaAlt19 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/37",{
      id: "ep4_WatchWarnings",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt20 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/38",{
      id: "ep4_PastPoints",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });


    noaaAlt16_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/37",{
      id: "at4_ForecastPoints",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt17_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/38",{
      id: "at4_ForecastTrack",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt18_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/39",{
      id: "at4_ForecastCone",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 0.5,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });    

    noaaAlt19_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/40",{
      id: "at4_WatchWarnings",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt20_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/41",{
      id: "at4_PastPoints",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });


    // EP5

    noaaAlt21 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/44",{
      id: "ep5_ForecastPoints",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });    

    noaaAlt22 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/45",{
      id: "ep5_ForecastTrack",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt23 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/46",{
      id: "ep5_ForecastCone",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 0.5,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt24 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/47",{
      id: "ep5_WatchWarnings",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });   

    noaaAlt25 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/48",{
      id: "ep5_PastPoints",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });


    noaaAlt21_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/48",{
      id: "at5_ForecastPoints",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });    

    noaaAlt22_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/49",{
      id: "at5_ForecastTrack",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt23_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/50",{
      id: "at5_ForecastCone",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 0.5,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    noaaAlt24_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/51",{
      id: "at5_WatchWarnings",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });   

    noaaAlt25_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/52",{
      id: "at5_PastPoints",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    // Past Track Line
    noaaAlt26 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/9",{
      id: "ep1_PastTrack",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });
    noaaAlt27 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/19",{
      id: "ep2_PastTrack",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });
    noaaAlt28 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/29",{
      id: "ep3_PastTrack",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });
    noaaAlt29 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/39",{
      id: "ep4_PastTrack",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });
    noaaAlt30 = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/49",{
      id: "ep5_PastTrack",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });

    // Past Track Line Atlantic
    noaaAlt26_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/9",{
      id: "at1_PastTrack",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });
    noaaAlt27_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/19",{
      id: "at2_PastTrack",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });
    noaaAlt28_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/29",{
      id: "at3_PastTrack",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });
    noaaAlt29_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/39",{
      id: "at4_PastTrack",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });
    noaaAlt30_At = new FeatureLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/49",{
      id: "at5_PastTrack",
      mode: FeatureLayer.MODE_ONDEMAND,    
      opacity: 1,
      showLabels: true,
      outFields: ["*"],
      visible: false
    });



    noaaAlt1.setRefreshInterval(10);
    noaaAlt2.setRefreshInterval(10);
    noaaAlt3.setRefreshInterval(10);
    noaaAlt4.setRefreshInterval(10);
    noaaAlt5.setRefreshInterval(10);
    noaaAlt6.setRefreshInterval(10);
    noaaAlt7.setRefreshInterval(10);
    noaaAlt8.setRefreshInterval(10);
    noaaAlt9.setRefreshInterval(10);
    noaaAlt10.setRefreshInterval(10);
    noaaAlt11.setRefreshInterval(10);
    noaaAlt12.setRefreshInterval(10);
    noaaAlt13.setRefreshInterval(10);
    noaaAlt14.setRefreshInterval(10);
    noaaAlt15.setRefreshInterval(10);
    noaaAlt16.setRefreshInterval(10);
    noaaAlt17.setRefreshInterval(10);
    noaaAlt18.setRefreshInterval(10);
    noaaAlt19.setRefreshInterval(10);
    noaaAlt20.setRefreshInterval(10);
    noaaAlt21.setRefreshInterval(10);
    noaaAlt22.setRefreshInterval(10);
    noaaAlt23.setRefreshInterval(10);
    noaaAlt24.setRefreshInterval(10);    
    noaaAlt25.setRefreshInterval(10);

    noaaAlt1_At.setRefreshInterval(10);
    noaaAlt2_At.setRefreshInterval(10);
    noaaAlt3_At.setRefreshInterval(10);
    noaaAlt4_At.setRefreshInterval(10);
    noaaAlt5_At.setRefreshInterval(10);
    noaaAlt6_At.setRefreshInterval(10);
    noaaAlt7_At.setRefreshInterval(10);
    noaaAlt8_At.setRefreshInterval(10);
    noaaAlt9_At.setRefreshInterval(10);
    noaaAlt10_At.setRefreshInterval(10);
    noaaAlt11_At.setRefreshInterval(10);
    noaaAlt12_At.setRefreshInterval(10);
    noaaAlt13_At.setRefreshInterval(10);
    noaaAlt14_At.setRefreshInterval(10);
    noaaAlt15_At.setRefreshInterval(10);
    noaaAlt16_At.setRefreshInterval(10);
    noaaAlt17_At.setRefreshInterval(10);
    noaaAlt18_At.setRefreshInterval(10);
    noaaAlt19_At.setRefreshInterval(10);
    noaaAlt20_At.setRefreshInterval(10);
    noaaAlt21_At.setRefreshInterval(10);
    noaaAlt22_At.setRefreshInterval(10);
    noaaAlt23_At.setRefreshInterval(10);
    noaaAlt24_At.setRefreshInterval(10);    
    noaaAlt25_At.setRefreshInterval(10);

    var defaultSymbol;
    var renderPastPosition = new UniqueValueRenderer(defaultSymbol,"basin");
    renderPastPosition.addValue("ep", new PictureMarkerSymbol('imagenes/imgTrack.png',8,8));
    renderPastPosition.addValue("al", new PictureMarkerSymbol('imagenes/imgTrack.png',8,8));

    noaaAlt5.setRenderer(renderPastPosition);
    noaaAlt10.setRenderer(renderPastPosition);
    noaaAlt15.setRenderer(renderPastPosition);
    noaaAlt20.setRenderer(renderPastPosition);
    noaaAlt25.setRenderer(renderPastPosition);

    noaaAlt5_At.setRenderer(renderPastPosition);
    noaaAlt10_At.setRenderer(renderPastPosition);
    noaaAlt15_At.setRenderer(renderPastPosition);
    noaaAlt20_At.setRenderer(renderPastPosition);
    noaaAlt25_At.setRenderer(renderPastPosition);

    var renderForecastPosition = new UniqueValueRenderer(defaultSymbol,"dvlbl");

    renderForecastPosition.addValue("S", new PictureMarkerSymbol('imagenes/imgS.png',40,40));
    renderForecastPosition.addValue("D", new PictureMarkerSymbol('imagenes/imgD.png',40,40));
    renderForecastPosition.addValue("H", new PictureMarkerSymbol('imagenes/imgH.png',40,40));
    renderForecastPosition.addValue("M", new PictureMarkerSymbol('imagenes/imgH.png',40,40));

    noaaAlt1.setRenderer(renderForecastPosition);
    noaaAlt6.setRenderer(renderForecastPosition);
    noaaAlt11.setRenderer(renderForecastPosition);
    noaaAlt16.setRenderer(renderForecastPosition);
    noaaAlt21.setRenderer(renderForecastPosition);

    noaaAlt1_At.setRenderer(renderForecastPosition);
    noaaAlt6_At.setRenderer(renderForecastPosition);
    noaaAlt11_At.setRenderer(renderForecastPosition);
    noaaAlt16_At.setRenderer(renderForecastPosition);
    noaaAlt21_At.setRenderer(renderForecastPosition);

    var lineColor = new Color("#079BFF");
    var lineStyleDash = new SimpleLineSymbol("dash", lineColor, 2.5);
    var lineStyleSolid = new SimpleLineSymbol("solid", lineColor, 2.5);

    var lineRenderDash = new SimpleRenderer(lineStyleDash);
    var lineRenderSolid = new SimpleRenderer(lineStyleSolid);

    /*Label de la posición huracan*/
    var positionLayerLabel = new TextSymbol().setColor(new Color([255,255,255]));
    positionLayerLabel.font.setSize("10pt");
    positionLayerLabel.font.setFamily("arial");
    var jsonPosition = {
      "labelExpressionInfo": {"value": "{stormname}, Cat. {ssnum}, {datelbl}, {tcdvlp}"}
    };
    var labelClass = new LabelClass(jsonPosition);
    labelClass.symbol = positionLayerLabel;

    noaaAlt1.setLabelingInfo([ labelClass ]);
    noaaAlt6.setLabelingInfo([ labelClass ]);
    noaaAlt11.setLabelingInfo([ labelClass ]);
    noaaAlt16.setLabelingInfo([ labelClass ]);
    noaaAlt21.setLabelingInfo([ labelClass ]);    

    noaaAlt1_At.setLabelingInfo([ labelClass ]);
    noaaAlt6_At.setLabelingInfo([ labelClass ]);
    noaaAlt11_At.setLabelingInfo([ labelClass ]);
    noaaAlt16_At.setLabelingInfo([ labelClass ]);
    noaaAlt21_At.setLabelingInfo([ labelClass ]);     

    noaaAlt2.setRenderer(lineRenderDash);
    noaaAlt7.setRenderer(lineRenderDash);
    noaaAlt12.setRenderer(lineRenderDash);
    noaaAlt17.setRenderer(lineRenderDash);
    noaaAlt22.setRenderer(lineRenderDash);

    noaaAlt2_At.setRenderer(lineRenderDash);
    noaaAlt7_At.setRenderer(lineRenderDash);
    noaaAlt12_At.setRenderer(lineRenderDash);
    noaaAlt17_At.setRenderer(lineRenderDash);
    noaaAlt22_At.setRenderer(lineRenderDash);

    noaaAlt26.setRenderer(lineRenderSolid);
    noaaAlt27.setRenderer(lineRenderSolid);
    noaaAlt28.setRenderer(lineRenderSolid);
    noaaAlt29.setRenderer(lineRenderSolid);
    noaaAlt30.setRenderer(lineRenderSolid);

    noaaAlt26_At.setRenderer(lineRenderSolid);
    noaaAlt27_At.setRenderer(lineRenderSolid);
    noaaAlt28_At.setRenderer(lineRenderSolid);
    noaaAlt29_At.setRenderer(lineRenderSolid);
    noaaAlt30_At.setRenderer(lineRenderSolid);

    map.addLayers([
      noaaAlt3,noaaAlt3_At,noaaAlt2,noaaAlt2_At,noaaAlt1,noaaAlt1_At,noaaAlt4,noaaAlt4_At,noaaAlt26,noaaAlt26_At,noaaAlt5,noaaAlt5_At,
      noaaAlt8,noaaAlt8_At,noaaAlt7,noaaAlt7_At,noaaAlt6,noaaAlt6_At,noaaAlt9,noaaAlt9_At,noaaAlt27,noaaAlt27_At,noaaAlt10,noaaAlt10_At,
      noaaAlt13,noaaAlt13_At,noaaAlt12,noaaAlt12_At,noaaAlt11,noaaAlt11_At,noaaAlt14,noaaAlt14_At,noaaAlt28,noaaAlt28_At,noaaAlt15,noaaAlt15_At,
      noaaAlt18,noaaAlt18_At,noaaAlt17,noaaAlt17_At,noaaAlt16,noaaAlt16_At,noaaAlt19,noaaAlt19_At,noaaAlt29,noaaAlt29_At,noaaAlt20,noaaAlt20_At,
      noaaAlt23,noaaAlt23_At,noaaAlt22,noaaAlt22_At,noaaAlt21,noaaAlt21_At,noaaAlt24,noaaAlt24_At,noaaAlt30,noaaAlt30_At,noaaAlt25,noaaAlt25_At,
    ]);

  /*Fin Servicio Alterno NOAA*/
  
  /* Probabilidad de velocidad de vientos NOAA */

  probVientosLayer = new ArcGISDynamicMapServiceLayer("https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer", {
    id: "windSpeed",
    opacity: 0.50
  });

  probVientosLayer.setVisibleLayers([-1]);
  map.addLayers([probVientosLayer]);

  /* Probabilidad de velocidad de vientos NOAA */

    /* Imágenes de Tope de Nubes */
    var imageNubesLayer = new MapImageLayer({
      id: "topClouds",
      opacity: 0.5,
      visible: true
    });

    imageNubesLayer.on("visibility-change", function(){
      if(!map.getLayer("topClouds").visible){
        clearInterval(topCloudsUpdateEvent);
      }
    });

    var imageNubesRGBLayer = new MapImageLayer({
      id: "rgbClouds",
      opacity: 0.5,
      visible: false
    });

    imageNubesRGBLayer.on("visibility-change", function(){
      if(!map.getLayer("rgbClouds").visible){
        clearInterval(rgbCloudsUpdateEvent);
      }
    });
    /* Fin de Imágenes de Tope de Nubes */

    /* Imágenes de radar */
    var radarImagesLayer = new MapImageLayer({
      id: "radarImages",
      opacity: 0.8,
      visible: false
    });

    radarImagesLayer.on("visibility-change", function(){
      if(!map.getLayer("radarImages").visible){
        clearInterval(rgbCloudsUpdateEvent);
      }
    });
    /* Fin de Imágenes de radar */

    /* Vuelos */
    var airplanesLayer = new GraphicsLayer({
      id: "airplanes",
      visible: false
    });
    /* Fin de Vuelos */

    /* Avisos Waze */
    var wazeAlertsLayer = new GraphicsLayer({
      id: "wazeAlerts",
      visible: false
    });

    var wazeJamsLayer = new GraphicsLayer({
      id: "wazeJams",
      visible: false
    });
    /* Fin de Avisos Waze */

    /* Movimientos sociales */
    var puntosMarchasLayer = new FeatureLayer("http://rmgir.proyectomesoamerica.org/server/rest/services/Hosted/Marchas_pto/FeatureServer/0", {
      id: "puntosSociales",
      visible: false
    });

    var symbol = new PictureMarkerSymbol({
      "url": "./imagenes/marcha.png",
      "height": 20,
      "width": 20
    });

    var marchasRenderer = new SimpleRenderer(symbol);
    puntosMarchasLayer.setRenderer(marchasRenderer);

    var rutasAMLOLayer = new FeatureLayer("http://rmgir.proyectomesoamerica.org/server/rest/services/Hosted/Rutas_AMLO/FeatureServer/0", {
      id: "rutasAMLO",
      visible: false
    });
    /* Fin de Movimientos sociales */

    /* Estaciones de Monitoreo del SMN */

    // Temperatura
    var featureCollection = {
      "layerDefinition": null,
      "featureSet": {
        "features": [],
        "geometryType": "esriGeometryPoint"
      }
    };
    featureCollection.layerDefinition = {
      "geometryType": "esriGeometryPoint",
      "objectIdField": "ObjectID",
      "drawingInfo": {
        "renderer": {
          "type": "simple",
          "symbol": {
            "type": "esriPMS",
            "url": "./imagenes/Temperatura/SinServicio.png",
            "contentType": "image/png",
            "width": 15,
            "height": 12
          }
        }
      },
      "fields": [{
        "name": "ObjectID",
        "alias": "ObjectID",
        "type": "esriFieldTypeOID"
      }, {
        "name": "stationId",
        "alias": "Identificador",
        "type": "esriFieldTypeString"
      }, {
        "name": "nombre",
        "alias": "Nombre",
        "type": "esriFieldTypeString"
      }, {
        "name": "temperatura",
        "alias": "Temperatura (°C)",
        "type": "esriFieldTypeDouble"
      }, {
        "name": "precipitacion",
        "alias": "Precipitación (mm)",
        "type": "esriFieldTypeDouble"
      }]
    };

    var automaticStationsLayer = new FeatureLayer(featureCollection, {
      id: "automaticStations", 
      visible: false
    });

    automaticStationsLayer.on("visibility-change", function(){
      var event = new CustomEvent("temp-visibility-change", {
        detail: {
          layerId: "automaticStations",
          visible: map.getLayer("automaticStations").visible,
          variable: "t"
        }
      });
      document.dispatchEvent(event);
    });

    // Lluvia
    var featureCollectionRain = {
      "layerDefinition": null,
      "featureSet": {
        "features": [],
        "geometryType": "esriGeometryPoint"
      }
    };
    featureCollectionRain.layerDefinition = {
      "geometryType": "esriGeometryPoint",
      "objectIdField": "ObjectID",
      "drawingInfo": {
        "renderer": {
          "type": "simple",
          "symbol": {
            "type": "esriPMS",
            "url": "./imagenes/Temperatura/SinServicio.png",
            "contentType": "image/png",
            "width": 15,
            "height": 12
          }
        }
      },
      "fields": [{
        "name": "ObjectID",
        "alias": "ObjectID",
        "type": "esriFieldTypeOID"
      }, {
        "name": "nombreEstacion",
        "alias": "Nombre de estación",
        "type": "esriFieldTypeString"
      }, {
        "name": "organismo",
        "alias": "Organismo",
        "type": "esriFieldTypeString"
      }, {
        "name": "estado",
        "alias": "Estado",
        "type": "esriFieldTypeString"
      }, {
        "name": "municipio",
        "alias": "Municipio",
        "type": "esriFieldTypeString"
      }, {
        "name": "fechaLocal",
        "alias": "Fecha Local del Centro",
        "type": "esriFieldTypeString"
      }, {
        "name": "fechaUTC",
        "alias": "Fecha UTC",
        "type": "esriFieldTypeString"
      }, {
        "name": "precipitacion",
        "alias": "Precipitación acumulada (mm)",
        "type": "esriFieldTypeDouble"
      }]
    };

    var automaticStationsRainLayer = new FeatureLayer(featureCollectionRain, {
      id: "automaticStationsRain", 
      visible: false
    });

    automaticStationsRainLayer.on("visibility-change", function(){
      var event = new CustomEvent("rain-visibility-change", {
        detail: {
          layerId: "automaticStationsRain",
          visible: map.getLayer("automaticStationsRain").visible,
          variable: "r"
        }
      });
      document.dispatchEvent(event);
    });

    /* Fin de Estaciones de Monitoreo del SMN */

    /* Viento */
    rasterLayer = new RasterLayer(null, {
      opacity: 0.55,
      id: "wind",
      visible: false
    });

    rasterLayer.setRefreshInterval(1);

    map.on("extent-change", redraw);

    rasterLayer.on("visibility-change", function() {
      if(!map.getLayer("wind").visible) {
        clearInterval(windUpdateEvent);
      }
    });
    /* Fin de Viento */

    map.on("update-start", function(){
      imageNubesLayer.suspend();
      imageNubesRGBLayer.suspend();
    });

    map.on("update-end", function(){
      imageNubesLayer.resume();
      imageNubesRGBLayer.resume();
    });

    var noOfRing = 0;
    var noOfLastRing = 0;

    map.on("load", function(){
      map.getLayer("sismosLayer").on("graphic-node-add", function(evt){
        if(evt.graphic["attributes"]["type"] == "sismo"){
          evt.node.setAttribute("class", "sismo");
          if(noOfRing == 0) evt.node.setAttribute("class", "sismo");
          if(noOfRing == 1) evt.node.setAttribute("class", "sismo first-circle");
          else if(noOfRing == 2) evt.node.setAttribute("class", "sismo second-circle");
          else if(noOfRing == 3) evt.node.setAttribute("class", "sismo third-circle");

          if(noOfRing > 3) noOfRing = 0;
          else noOfRing++;
        } else if(evt.graphic["attributes"]["type"] == "ultimoSismo"){
          evt.node.setAttribute("class", "ultimoSismo");
          if(noOfLastRing == 0) evt.node.setAttribute("class", "ultimoSismo");
          if(noOfLastRing == 1) evt.node.setAttribute("class", "ultimoSismo first-circle");
          else if(noOfLastRing == 2) evt.node.setAttribute("class", "ultimoSismo second-circle");
          else if(noOfLastRing == 3) evt.node.setAttribute("class", "ultimoSismo third-circle");
          else if(noOfLastRing == 4) evt.node.setAttribute("class", "ultimoSismo crecimiento");

          if(noOfLastRing > 4) noOfLastRing = 0;
          else noOfLastRing++;
        }
      });
    });
        
    map.on("load", function(){
      var layersToAdd = [rasterLayer, imageNubesLayer, imageNubesRGBLayer, radarImagesLayer, automaticStationsLayer, automaticStationsRainLayer, airplanesLayer, wazeAlertsLayer, wazeJamsLayer, puntosMarchasLayer, rutasAMLOLayer]; 
      map.addLayers(layersToAdd);

      var layersResult = map.on("layers-add-result", function(result){
        layersResult.remove();
        drawVolcanos();
      });

      $(".layers-types .layer").on("click", function(){
        var layerId = $(this).attr("data-layerId");

        if($(this).hasClass("active")) {
          if(layerId != "hurricanes" && layerId != "automaticStationsRain" && layerId != "cloudsLANOT" && layerId != "waze" && layerId != "marchas") $(this).removeClass("active");
          
          if(layerId != "hurricanes" && layerId != "cloudsLANOT" && layerId != "waze" && layerId != "marchas"){
            map.getLayer(layerId).hide();
          }

          switch(layerId) {
            case "wind":
              if(windUpdateEvent) clearInterval(windUpdateEvent);
            break;
            case "hurricanes":   
            break;
            case "cloudsLANOT":
            break;
            case "automaticStations":
            break;
            case "sismosLayer":
              if(sismosUpdateEvent) clearInterval(sismosUpdateEvent);
            break;
            case "airplanes":
              if(airplanesUpdateEvent) clearInterval(airplanesUpdateEvent);
            break;
          }
        } else {
          if(layerId != "hurricanes" && layerId != "automaticStationsRain" && layerId != "cloudsLANOT" && layerId != "waze" && layerId != "marchas") $(this).addClass("active");

          switch(layerId) {
            case "wind":
              if(windUpdateEvent) clearInterval(windUpdateEvent);

              map.getLayer(layerId).show();
              getWindData();
              windUpdateEvent = window.setInterval(function(){
                getWindData();
              }, windUpdateTimeInterval);
            break;
            case "hurricanes":
            break;
            case "cloudsLANOT":
            break;
            case "automaticStations":
              map.getLayer(layerId).show();
            break;
            case "sismosLayer":
              if(sismosUpdateEvent) clearInterval(sismosUpdateEvent);

              map.getLayer(layerId).show();
              obtenerUltimoSismo()
              sismosUpdateEvent = window.setInterval(function(){ 
                obtenerUltimoSismo() 
              }, 10000);
            break;
            case "airplanes":
              var planes_csv_url = "http://rmgir.proyectomesoamerica.org/Planes/planesData.csv";
              map.getLayer(layerId).show();
              loadCSVPlanes(planes_csv_url, layerId);

              airplanesUpdateEvent = window.setInterval(function(){
                loadCSVPlanes(planes_csv_url, layerId);
              }, airplanespdateTimeInterval);
            break;
          }
        }
      });
    });

    $(".layers-types .layer .layerOption input").on("change", function(){
      var layerId = $(this).attr("data-layerId");

      if(layerId == "rgbClouds"){
        if($(this).is(":checked") && $(this).attr("data-period") !== "0") {
          $(".layer[data-layerId='cloudsLANOT']").addClass("active");

          if(goesRGBAnimation) clearTimeout(goesRGBAnimation);
          if(rgbCloudsUpdateEvent) clearInterval(rgbCloudsUpdateEvent);

          var period = parseInt($(this).attr("data-period"));
              
          map.getLayer(layerId).removeAllImages();
          map.getLayer(layerId).show();
          getCloudData(layerId, period);
          rgbCloudsUpdateEvent = window.setInterval(function(){
            if(goesRGBAnimation) clearTimeout(goesRGBAnimation);
            if(rgbCloudsUpdateEvent) clearInterval(rgbCloudsUpdateEvent);

            map.getLayer(layerId).removeAllImages();
            getCloudData(layerId, period);
          }, rgbCloudsUpdateTimeInterval);
        } else {
          if($(".layer[data-layerId='cloudsLANOT'] input[name='topClouds']:checked").attr("data-period") === "0") $(".layer[data-layerId='cloudsLANOT']").removeClass("active");

          if(goesRGBAnimation) clearTimeout(goesRGBAnimation);
          if(rgbCloudsUpdateEvent) clearInterval(rgbCloudsUpdateEvent);

          map.getLayer(layerId).hide();
        }
      } else if(layerId == "topClouds") {
        if($(this).is(":checked") && $(this).attr("data-period") !== "0"){
          $(".layer[data-layerId='cloudsLANOT']").addClass("active");

          if(goesTopAnimation) clearTimeout(goesTopAnimation);
          if(topCloudsUpdateEvent) clearInterval(topCloudsUpdateEvent);

          var period = parseInt($(this).attr("data-period"));
          
          map.getLayer(layerId).removeAllImages();
          map.getLayer(layerId).show();
          getCloudData(layerId, period);
          topCloudsUpdateEvent = window.setInterval(function(){
            if(goesTopAnimation) clearTimeout(goesTopAnimation);
            if(topCloudsUpdateEvent) clearInterval(topCloudsUpdateEvent);

            map.getLayer(layerId).removeAllImages();
            getCloudData(layerId, period);
          }, topCloudsUpdateTimeInterval);
        } else {
          if($(".layer[data-layerId='cloudsLANOT'] input[name='rgbClouds']:checked").attr("data-period") === "0") $(".layer[data-layerId='cloudsLANOT']").removeClass("active");

          if(goesTopAnimation) clearTimeout(goesTopAnimation);
          if(topCloudsUpdateEvent) clearInterval(topCloudsUpdateEvent);

          map.getLayer(layerId).hide();
        }
      } else if(layerId == "radarImages") {
        if($(this).is(":checked")) {
          map.getLayer(layerId).removeAllImages();
          map.getLayer(layerId).show();
          getRadarData(layerId);
          radarImagesUpdateEvent = window.setInterval(function(){
            if(radarImagesAnimation) clearTimeout(radarImagesAnimation);
            if(radarImagesUpdateEvent) clearInterval(radarImagesUpdateEvent);

            map.getLayer(layerId).removeAllImages();
            getRadarData(layerId);
          }, radarImagesUpdateTimeInterval);
        } else {
          if(radarImagesAnimation) clearTimeout(radarImagesAnimation);
          if(radarImagesUpdateEvent) clearInterval(radarImagesUpdateEvent);

          map.getLayer(layerId).hide();
        }
      } else if(layerId == "windSpeed"){
        var visibleLayers = parseInt($(this).attr("data-visibleLayers"));
        map.getLayer(layerId).setVisibleLayers([visibleLayers]);
        map.getLayer(layerId).show();
        map.getLayer(layerId).refresh();

        if(visibleLayers != -1) $(".layer[data-layerId='hurricanes']").addClass("active");
        if($(".layer[data-layerId='hurricanes'] input[name='hurricanesNOAA']:checked").length == 0 && parseInt($(".layer[data-layerId='hurricanes'] input[name='widnSpeed']:checked").attr("data-visibleLayers")) == -1) $(".layer[data-layerId='hurricanes']").removeClass("active");
      } else if(layerId == "activeHurricanes") {
        if($(this).is(":checked")) {
          enciendeCiclones();

          $(".layer[data-layerId='hurricanes']").addClass("active");
        } else {
          apagaCiclones();

          if($(".layer[data-layerId='hurricanes'] input[name='hurricanesNOAA']:checked").length == 0 && parseInt($(".layer[data-layerId='hurricanes'] input[name='widnSpeed']:checked").attr("data-visibleLayers")) == -1) $(".layer[data-layerId='hurricanes']").removeClass("active");
        }
      } else if(layerId == "outlookTropical") {
        if($(this).is(":checked")) {
          if(map.getLayer("prediccionCiclones")) map.getLayer("prediccionCiclones").show();
          if(map.getLayer("areaPrediccionCiclones")) map.getLayer("areaPrediccionCiclones").show();

          $(".layer[data-layerId='hurricanes']").addClass("active");
        } else {
          if(map.getLayer("prediccionCiclones")) map.getLayer("prediccionCiclones").hide();
          if(map.getLayer("areaPrediccionCiclones")) map.getLayer("areaPrediccionCiclones").hide();

          if($(".layer[data-layerId='hurricanes'] input[name='hurricanesNOAA']:checked").length == 0 && parseInt($(".layer[data-layerId='hurricanes'] input[name='widnSpeed']:checked").attr("data-visibleLayers")) == -1) $(".layer[data-layerId='hurricanes']").removeClass("active");
        }
      } else if(layerId == "automaticStationsRain"){
        map.getLayer(layerId).show();

        var period = $(this).attr("data-period");

        if(period == "A0") {
          $(".layer[data-layerId='automaticStationsRain']").removeClass("active");
        } else {
          $(".layer[data-layerId='automaticStationsRain']").addClass("active");
        }
      } else if(layerId == "wazeAlerts") {
        if($(this).is(":checked")) {
          map.getLayer(layerId).show();
          wazeAlertsUrl = "http://rmgir.proyectomesoamerica.org/Waze/alerts/wazeAlerts.csv"
          drawAlerts(layerId, wazeAlertsUrl);
          wazeAlertsUpdateEvent = window.setInterval(function(){
            if(wazeAlertsUpdateEvent) clearInterval(wazeAlertsUpdateEvent);

            drawAlerts(layerId, wazeAlertsUrl);
          }, wazeAlertsUpdateTimeInterval);
        } else {
          if(wazeAlertsUpdateEvent) clearInterval(wazeAlertsUpdateEvent);
          map.getLayer(layerId).hide();
        }
      } else if(layerId == "wazeJams") {
        if($(this).is(":checked")) {
          map.getLayer(layerId).show();
          drawTrafficLines(layerId);
          wazeJamsUpdateEvent = window.setInterval(function(){
            if(wazeJamsUpdateEvent) clearInterval(wazeJamsUpdateEvent);

            drawTrafficLines(layerId);
          }, wazeJamsUpdateTimeInterval);
        } else {
          if(wazeJamsUpdateEvent) clearInterval(wazeJamsUpdateEvent);
          map.getLayer(layerId).hide();
        }
      } else if(layerId == "puntosSociales") {
        if($(this).is(":checked")) {
          map.getLayer(layerId).show();
        } else {
          map.getLayer(layerId).hide();
        }
      } else if(layerId == "rutasAMLO") {
        if($(this).is(":checked")) {
          map.getLayer(layerId).show();
        } else {
          map.getLayer(layerId).hide();
        }
      }
    });

    map.on("load", initToolbar);
    map.on("load", function(){
    cargarKML();
	  //obtenerUltimoSismo();     
      //xhttp.open("GET", "CAP-SMN-Ultimo.xml", true);
      xhttp.open("GET", "http://rmgir.proyectomesoamerica.org/ANR/apps/Monitoreo/CAP-SMN-Ultimo.xml", true);
      xhttp.send();
      $("#top6").click();  
    });
	
	map.on("load",function(){
		obtenerBoletinVolcan(); 
	});

    dojo.connect(dijit.byId('map'), 'resize', function () {
        resizeMap();
    });

    // map.on("resize", function(){});
    // map.on("zoom-start", redraw);
    // map.on("pan-start", redraw);

    setInterval(function(){ obtenerBoletinVolcan() }, 300000);
    //setInterval(function(){ obtenerUltimoSismo() }, 10000);
    setInterval(function(){ obtenerHora() }, 1000);
    //setInterval(function(){ xhttp.open("GET", "CAP-SMN-Ultimo.xml", true); xhttp.send();  }, 900000);
    //setInterval(function(){ redraw() }, 300000);

    createGraphicsMenu();
  }

  dojo.addOnLoad(crearMapa);

  function initToolbar() {
    require([
      "esri/symbols/Font",
      "esri/symbols/TextSymbol",
      "esri/toolbars/draw",
      "esri/graphic",
      "esri/geometry/Point",
    ], function(
      Font,
      TextSymbol,
      Draw,
      Graphic,
      Point
    ){
      var totalDistance = 0;
      var textSymbol;
      var extraTextSymbol;
      var point;
      var extraPoint;
      var distanceRequest;
      var font = new Font("18px", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLDER, "sans-serif");
      tb = new Draw(map);
      tb.on("draw-end", addGraphic);
      $("#analisis").click(function (evt) {
        if (evt.target.id === "BtnLimpiar" || evt.target.id === "BtnInformacion") {
            return;
        }
        //limpiarGeometria();
        var dibujo = evt.target.id;
        map.graphics.clear();
        var tool = evt.target.id.toLowerCase();
        map.disableMapNavigation();
        if(tb) tb.deactivate();
        tb.activate(tool);
        drawVertex = [];
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
                textSymbol = new TextSymbol(distance < 1000 ? agregasComas(distance.toFixed(2)) + " m" : (distance/1000).toFixed(2) + " km", font, new Color([255, 255, 255]));
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
                extraTextSymbol = new TextSymbol(distance < 1000 ? agregasComas(distance.toFixed(2)) + " m" : (distance/1000).toFixed(2) + " km", font, new Color([255, 255, 255]));
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
                textSymbol = new TextSymbol(distance < 1000 ? agregasComas(distance.toFixed(2)) + " m" : (distance/1000).toFixed(2) + " km", font, new Color([255, 255, 255]));
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
              textSymbol = new TextSymbol("Radio: " + (distance < 1000 ? agregasComas(distance.toFixed(2)) + " m" : (distance/1000).toFixed(2) + " km"), font, new Color([255, 255, 255]));
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
              textSymbol = new TextSymbol("Radio: " + (distance < 1000 ? agregasComas(distance.toFixed(2)) + " m" : (distance/1000).toFixed(2) + " km"), font, new Color([255, 255, 255]));
              textSymbol.horizontalAlignment = "center";
              textSymbol.verticalAlignment = "top";
              if (endGraphic) { //if an end label already exists remove it
                map.graphics.remove(endGraphic);
              }
              endGraphic = new Graphic(point, textSymbol);
              map.graphics.add(endGraphic);
            });
          })
        }
      });
    });
}

  // Menu que aparece al dar click derecho
  function createGraphicsMenu() {
    // Creates right-click context menu for GRAPHICS
    ctxMenuForGraphics = new Menu({});
    // ctxMenuForGraphics.addChild(new MenuItem({
    //   label: "Editar",
    //   onClick: function() {
    //     if ( selected.geometry.type !== "point" ) {
    //       editToolbar.activate(Edit.EDIT_VERTICES, selected);
    //     } else {
    //       alert("Not implemented");
    //     }
    //   }
    // }));

    // ctxMenuForGraphics.addChild(new MenuItem({
    //   label: "Mover",
    //   onClick: function() {
    //     editToolbar.activate(Edit.MOVE, selected);
    //   }
    // }));

    ctxMenuForGraphics.addChild(new MenuItem({
      label: "Analizar",
      onClick: function() {
        if ( selected.geometry.type != "point" ) {
            showElem();
            // createRandomText();
            lastGeometry = selected.geometry;
            realizarAnalisis(selected.geometry, exceptLayers);
            analizaEstMun(lastGeometry);
        } else {
            showElem();
            showBuffer(selected.geometry);
        }
      }
    }));

    // ctxMenuForGraphics.addChild(new MenuSeparator());
    // ctxMenuForGraphics.addChild(new MenuItem({
    //   label: "Borrar",
    //   onClick: function() {
    //     map.graphics.remove(selected);
    //     bufferGraphics.clear();
    //   }
    // }));

    ctxMenuForGraphics.startup();
  }

  var circle;
  var fillSymbol =
    new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
    new Color([255,28,28]), 4), // Color contorno
    new Color([255,28,28, 0.25])  // Color fondo
  );

  function addGraphic(evt) {
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
      } else {
          symbol = fillSymbol;
      }

      map.graphics.add(new Graphic(evt.geometry, symbol));

      //Funciones geo --> outStatistics
      showElem();
      lastGeometry = evt.geometry;
      realizarAnalisis(lastGeometry, exceptLayers);
      analizaEstMun(lastGeometry);
  }

  function resizeMap() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      map.resize();
      map.reposition();
    }, 800);
  }
  dojo.ready(resizeMap);

  // does the browser support canvas?
  function supports_canvas() {
    return !!document.createElement("canvas").getContext;
  }

  function redraw(){
    if(rasterLayer && rasterLayer._element){
      rasterLayer._element.width = map.width;
      rasterLayer._element.height = map.height;
    }

    if(windy) windy.stop();

    var extent = map.geographicExtent;
    setTimeout(function(){
      if(windy) {
        windy.start(
          [[0,0],[map.width, map.height]],
          map.width,
          map.height,
          [[extent.xmin, extent.ymin],[extent.xmax, extent.ymax]]
        );
      }
    },500);
  }

  window.redraw = redraw;

});

var tokensolo = '';
var primeraVezSismos = true;
var sonido;
var ultimoEpicentro;
var stringUltimoEpicentro;

function obtenerUltimoSismo(){
  require([
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/InfoTemplate",
    "esri/geometry/Point", 
    "esri/graphic",
    "esri/Color"
  ], function(
    SimpleMarkerSymbol,
    PictureMarkerSymbol,
    SimpleLineSymbol,
    InfoTemplate,
    Point,
    Graphic,
    Color
  ){
    var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
    var dataObj = {
      "sismosRSS":'http://www.ssn.unam.mx/rss/ultimos-sismos.xml'
    };

    var baseEarthquakeSize = 10;
    var redColor = [255, 60, 30];
    var yellowColor = [255, 191, 0];
    var greenColor = [64, 171, 93];
    var whiteColor = [255, 255, 255];
    
    $.ajax({
      type: "GET",
      url: "vppr.php",
      data: dataObj,
      dataType: "json",
      success: function (data) {
        var size;
        
        ultimoEpicentro = new Point(data["eventos"][0]["longitud"], data["eventos"][0]["latitud"]);
        stringUltimoEpicentro = ultimoEpicentroFecha + "," + ultimoEpicentroHora + " hrs";
        var ultimoEpicentroFecha = data["eventos"][0]["fecha"];
        var ultimoEpicentroHora = data["eventos"][0]["hora"];
        stringUltimoEpicentro = ultimoEpicentroFecha + "," + ultimoEpicentroHora + " hrs";   

        if (tokensolo != stringUltimoEpicentro ){
          primeraVezSismos = true;
          map.getLayer("sismosLayer").clear();

          sonido = 1;
          tokensolo = stringUltimoEpicentro;
          var eventos = {
            "eventos": data["eventos"].slice(0, 5)
          };
          var templateSource = $("#sismosRecientes-template").html();
          template = Handlebars.compile(templateSource);
          var reporteVolcanHTML = template(eventos);
          $('#huracanInfo').html(reporteVolcanHTML);

          clearInterval(marInterval);
          var marquee = $('div.marquee');
          marquee.each(function() {
            var mar = $(this), indent = mar.width();
            mar.marquee = function() {
                indent--;
                mar.css('text-indent',indent);
                if (indent < -1 * mar.children('div.marquee-text').width()) {
                    indent = mar.width();
                }
            };
            mar.data('interval', marInterval = setInterval(mar.marquee,1000/60));
          });

          if(data["eventos"][1]) {
            for(var i = 1; i < data["eventos"].length; i++){
              var infoTemplateSismo = new InfoTemplate("Evento sísmico",
                "Fecha: " + data["eventos"][i]["fecha"] + "<br/>"
                + "Hora: " + data["eventos"][i]["hora"] + "<br/>"
                + "Magnitud: " + data["eventos"][i]["magnitud"] + "<br/>"
                + "Lugar: " + data["eventos"][i]["lugar"] + "<br/>"
                + "Latitud: " + data["eventos"][i]["latitud"] + "<br/>"
                + "Longitud: " + data["eventos"][i]["longitud"]
              );
      
              if(parseFloat(data["eventos"][0]["magnitud"]) <= 4) size = baseEarthquakeSize;
              else if(parseFloat(data["eventos"][0]["magnitud"]) > 4) size = baseEarthquakeSize + 2;
              else if(parseFloat(data["eventos"][0]["magnitud"]) > 5) size = baseEarthquakeSize + 4;
              else if(parseFloat(data["eventos"][0]["magnitud"]) > 6) size = baseEarthquakeSize + 6;
              else if(parseFloat(data["eventos"][0]["magnitud"]) > 7) size = baseEarthquakeSize + 8;
              else if(parseFloat(data["eventos"][0]["magnitud"]) > 8) size = baseEarthquakeSize + 10;

              for(var j = 0; j <= 3; j++){
                var sms = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, size, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(whiteColor), 1), new Color(greenColor));
                var eventoLoc = new Point(data["eventos"][i]["longitud"], data["eventos"][i]["latitud"]);
                var graphic = new Graphic(eventoLoc, sms);
                graphic.setAttributes({type: "sismo"});
                graphic.setInfoTemplate(infoTemplateSismo);
                map.getLayer("sismosLayer").add(graphic);
              }
            }
          }
          
          var infoTemplateSismo = new InfoTemplate("Último evento sísmico",
            "Fecha: " + data["eventos"][0]["fecha"] + "<br/>"
            + "Hora: " + data["eventos"][0]["hora"] + "<br/>"
            + "Magnitud: " + data["eventos"][0]["magnitud"] + "<br/>"
            + "Lugar: " + data["eventos"][0]["lugar"] + "<br/>"
            + "Latitud: " + data["eventos"][0]["latitud"] + "<br/>"
            + "Longitud: " + data["eventos"][0]["longitud"]
          )

          if(parseFloat(data["eventos"][0]["magnitud"]) <= 4) size = baseEarthquakeSize;
          else if(parseFloat(data["eventos"][0]["magnitud"]) > 4) size = baseEarthquakeSize + 2;
          else if(parseFloat(data["eventos"][0]["magnitud"]) > 5) size = baseEarthquakeSize + 4;
          else if(parseFloat(data["eventos"][0]["magnitud"]) > 6) size = baseEarthquakeSize + 6;
          else if(parseFloat(data["eventos"][0]["magnitud"]) > 7) size = baseEarthquakeSize + 8;
          else if(parseFloat(data["eventos"][0]["magnitud"]) > 8) size = baseEarthquakeSize + 10;
          
          for(var j = 0; j <= 4; j++){
            var sms = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, size, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(whiteColor), 1), new Color(yellowColor));
            var graphic = new Graphic(ultimoEpicentro, sms);
            graphic.setInfoTemplate(infoTemplateSismo);
            graphic.setAttributes({type: "ultimoSismo"});

            map.getLayer("sismosLayer").add(graphic);
          }
        }
  
        if(sonido == 1){
          reproducirSonido();
          sonido = 0;
          primeraVezSismos = false;
        }
      },
      error: function (msg) {
        console.log(msg);
      }
    });
  });
}

function drawVolcanos(){
  require([
    "esri/symbols/PictureMarkerSymbol",
    "esri/InfoTemplate",
    "esri/geometry/Point", 
    "esri/graphic"
  ], function(
    PictureMarkerSymbol,
    InfoTemplate,
    Point,
    Graphic
  ){
    /*var volcanSimbolo = new esri.symbol.PictureMarkerSymbol('imagenes/volcan.png', 30, 30);*/
    var infoTemplVolcan = new InfoTemplate("","Último Boletín del<br> Volcán Popocatépetl: <a href='http://www.cenapred.gob.mx/reportesVolcanGobMX/Procesos?tipoProceso=detallesUltimoReporteVolcan' target='_blank'>Boletín</a>");
    var volcanSimbolo = new PictureMarkerSymbol('imagenes/volcan-exhalacion.gif', 40, 40);
    var puntoVolcan = new Point(-98.6233,19.0229);
    var volcan = new Graphic(puntoVolcan, volcanSimbolo);
    volcan.setInfoTemplate(infoTemplVolcan);

    var infoTemplVolcanSantiaguito = new InfoTemplate("","Reporte del Volcán Santiaguito: <a href='http://www.insivumeh.gob.gt/geofisica/vulcanologia/boletin%20formato.pdf' target='_blank'>Boletín</a>");
    var volcanSimbolo = new PictureMarkerSymbol('imagenes/volcan-exhalacion.gif', 40, 40);
    var puntoVolcan = new Point(-91.571,14.7447);
    var volcanSantiaguito = new Graphic(puntoVolcan, volcanSimbolo);
    volcanSantiaguito.setInfoTemplate(infoTemplVolcanSantiaguito);
    
    var infoTemplVolcanColima = new InfoTemplate("","Volcán de Colima <a href='http://www.proteccioncivil.col.gob.mx/boletin.php?c=NzA0MQ==' target='_blank'>Más Información</a> ");
    var volcanSimbolo = new PictureMarkerSymbol('imagenes/volcan-exhalacion.gif', 40, 40);
    var puntoVolcan = new Point(-103.616916,19.512944);
    var volcanColima = new Graphic(puntoVolcan, volcanSimbolo);
    volcanColima.setInfoTemplate(infoTemplVolcanColima);

    map.getLayer("volcanesLayer").add(volcan);
    map.getLayer("volcanesLayer").add(volcanSantiaguito);
    map.getLayer("volcanesLayer").add(volcanColima);
  });
}

function obtenerBoletinVolcan(){
    $.ajax({
        type:"GET",
        url:"http://www.cenapred.gob.mx/WSReporteVolcan/servicio/popocatepetl.json",
        dataType:"json",
        success:function(data) {
          var templateSource = $("#reporteVolcan-template").html();
          template = Handlebars.compile(templateSource);
          reporteVolcanHTML = template(data[0]);
          $('#reporteVolcan').html(reporteVolcanHTML);
        },
        error: function(msg){
          console.log(msg);
        }
    });
}

function reproducirSonido(){
    var sound = document.getElementById("myAudio");
    sound.play();
}

function limpiarGeometria() {
    map.graphics.clear();
    clearInterval(stopBarra);
    $("#analisis-container").hide();
    $("#barra1").show();
}

//Obtener La hora cada segundo
function obtenerHora(){
    var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
    var f = new Date();

    var hora = f.getHours();
    var minutos = f.getMinutes();
    var segundos = f.getSeconds();

    var fechaString = f.getDate() + " / " + meses[f.getMonth()] + " / " + f.getFullYear();
    var horaString = hora24Ahora12(hora, minutos, segundos);

    document.getElementById('fechaActual').innerHTML =  fechaString + " <br/> " + horaString;
}

function hora24Ahora12(hora, minutos, segundos){
    var sufijos = ["a.m.", "p.m."];
    var sufijo;

    if( hora > 12){
        sufijo = 1;
        if( hora - 12 < 10 )
            hora = "0" + (hora - 12);
        else
            hora = hora - 12;
    }
    else if( hora == 12){
        sufijo = 1;
    }
    else if( hora < 12 ){
        sufijo = 0;
        if( hora < 10 )
            hora = "0" + hora;
    }
    if(minutos < 10){
        minutos = "0" + minutos;
    }
    if(segundos < 10){
        segundos = "0" + segundos;
    }

    return hora + ":" + minutos + ":" + segundos + " " + sufijos[sufijo];
}
document.addEventListener('estados-completo', function(result){
  var respuesta = result.detail["estados"];
  var templateSource = $("#huracan-template").html();
  var template = Handlebars.compile(templateSource);
  var reporteVolcanHTML = template({estados: respuesta});
  $('#estadosInfo').html(reporteVolcanHTML);

  clearInterval(marInterval);
  var marquee = $('div.marquee');
  marquee.each(function() {
    var mar = $(this), indent = mar.width();
    mar.marquee = function() {
        indent--;
        mar.css('text-indent',indent);
        if (indent < -1 * mar.children('div.marquee-text').width()) {
            indent = mar.width();
        }
    };
    mar.data('interval', marInterval = setInterval(mar.marquee,1000/60));
  });
});

// Análisis
document.addEventListener('analisis-completo', function(result){
  if(result.detail["Poblacion"] != 0){
    $("#Poblacion figcaption").text(agregasComas(result.detail["Poblacion"]));
    $("#Viviendas figcaption").text(agregasComas(result.detail["Viviendas"]));
    $("#Hospitales figcaption").text(agregasComas(result.detail["Hospitales"]));
    $("#Escuelas figcaption").text(agregasComas(result.detail["Escuelas"]));
    $("#Supermercados figcaption").text(agregasComas(result.detail["Supermercados"]));
    $("#Aeropuertos figcaption").text(agregasComas(result.detail["Aeropuertos"]));
    $("#Hoteles figcaption").text(agregasComas(result.detail["Hoteles"]));
    $("#Bancos figcaption").text(agregasComas(result.detail["Bancos"]));
    $("#Gasolineras figcaption").text(agregasComas(result.detail["Gasolineras"]));
    $("#Presas figcaption").text(agregasComas(result.detail["Presas"]));
    $("#Ganadero figcaption").text(agregasComas(result.detail["Ganaderias"]));
    $("#Colonias figcaption").text(agregasComas(result.detail["Colonias"]));

    var gvs = JSON.parse(result.detail["GradoVulnerabilidadSocial"]);
    $("#gvsMuyBajo").text(agregasComas(gvs["Muy Bajo"]));
    $("#gvsBajo").text(agregasComas(gvs["Bajo"]));
    $("#gvsMedio").text(agregasComas(gvs["Medio"]));
    $("#gvsAlto").text(agregasComas(gvs["Alto"]));
    $("#gvsMuyAlto").text(agregasComas(gvs["Muy Alto"]));

    //
    $("#pob_m_t").text(agregasComas(result.detail["TotalPobMas"]));
    $("#pob_f_t").text(agregasComas(result.detail["TotalPobFem"]));
    $("#pob_menor_12").text(agregasComas(result.detail["TotalMenor12"]));
    $("#pob_m_menor_12").text(agregasComas(result.detail["TotalMenor12M"]));
    $("#pob_f_menor_12").text(agregasComas(result.detail["TotalMenor12F"]));
    $("#pob_mayor_60").text(agregasComas(result.detail["TotalMayor60"]));
    $("#pob_m_mayor_60").text(agregasComas(result.detail["TotalMayor60M"]));
    $("#pob_f_mayor_60").text(agregasComas(result.detail["TotalMayor60F"]));
    $("#LenguasIndigenas figcaption").text(agregasComas(result.detail["TotalLenguasIndigenas"]));

    $("#barra1").hide();
    $("#analisis-container").show();

    stopBarra = setInterval(function(){ if (cambioBarra){            
            $("#barra1").hide();
            $("#analisis-container").show();
            cambioBarra = !cambioBarra;

        }
        else {
                $("#analisis-container").hide();
                $("#barra1").show();
                cambioBarra = !cambioBarra;
        }   
        }, 40000);

  }
  else {
    clearInterval(stopBarra);
    $("#analisis-container").hide();
    $("#barra1").show();  
  }

  hideElem();
});

function showElem() {
    document.getElementById("Img1").style.visibility = "visible";
}
function hideElem() {
    document.getElementById("Img1").style.visibility = "hidden";
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

function unionGeometries(geometriesArray, previousGeometry){
  if(previousGeometry) geometriesArray.splice(0,0,previousGeometry);
  var elements = geometriesArray.splice(0, geometriesArray > 50 ? 250 : 10 );
  if(elements.length > 1){
    geometryService.union(elements, function(geometry){
      require([
      "esri/symbols/SimpleFillSymbol",
      "esri/symbols/SimpleLineSymbol",
      "esri/graphic",
      "esri/Color"
    ], function(
      SimpleFillSymbol,
      SimpleLineSymbol,
      Graphic,
      Color
    ){
      // map.graphics.clear();
      var polySym = new SimpleFillSymbol()
          .setColor(new Color([56, 102, 164, 0.4]))
          .setOutline(
              new SimpleLineSymbol()
              .setColor(new Color([56, 102, 164, 0.8]))
          );
      var graphic = new Graphic(geometry, polySym);
      // map.graphics.add(graphic);
    });
      
      unionGeometries(geometriesArray, geometry);
    })
  } else {
    require([
      "esri/symbols/SimpleFillSymbol",
      "esri/symbols/SimpleLineSymbol",
      "esri/graphic",
      "esri/Color"
    ], function(
      SimpleFillSymbol,
      SimpleLineSymbol,
      Graphic,
      Color
    ){
      if(!previousGeometry) previousGeometry = elements[0];
      // console.log(previousGeometry);
      // map.graphics.clear();
      var polySym = new SimpleFillSymbol()
          .setColor(new Color([56, 102, 164, 0.4]))
          .setOutline(
              new SimpleLineSymbol()
              .setColor(new Color([56, 102, 164, 0.8]))
          );
      var graphic = new Graphic(previousGeometry, polySym);
      //map.graphics.add(graphic);
      // createRandomText();
      lastGeometry = previousGeometry;
      analizaEstMun(lastGeometry);
      realizarAnalisis(lastGeometry, exceptLayers);      
    })
  }
}

function cargarKML(){
  require([ 
      "esri/layers/KMLLayer",
      "esri/SpatialReference",
      "esri/graphicsUtils",
  ], function(
      KMLLayer,
      SpatialReference,
      graphicsUtils
  ) {    

		    var f = new Date();
                    var dia = f.getDate().toString().padStart(2, "0");
                    var m = f.getMonth()+1;
                    var mes = m.toString().padStart(2, "0");
                    var year = f.getFullYear();
                    var fecha = ""+dia+""+mes+""+year;

//var url = "http://rmgir.proyectomesoamerica.org/uploads/MapaIntensidades/MapaIntensidades"+fecha+".kmz";
var url = "http://rmgir.proyectomesoamerica.org/uploads/MapaIntensidades/MapaIntensidades"+fecha+".kmz?numero=" + Math.random();
//var url = "http://rmgir.proyectomesoamerica.org/uploads/MapaIntensidades/MapaIntensidades06032020.kmz";
//var url = "http://rmgir.cenapred.gob.mx/uploads/mapaintensidades16012020_kmz.kmz";
    var kml = new KMLLayer(url, {
        id: "mapaIntensidades",
        opacity: 0.7,
        outSR: new SpatialReference(4326)
    });
    var kmlLoad = kml.on("load", function() {
        map.addLayer(kml);
        kmlLoad.remove();
    });

  });
}

function cargarEvento(){
  require([ 
      "esri/layers/KMLLayer",
      "esri/SpatialReference",
      "esri/graphicsUtils",
  ], function(
      KMLLayer,
      SpatialReference,
      graphicsUtils
  ) {
    var url = "http://rmgir.cenapred.gob.mx/uploads/mapa16_kmz.kmz"
    var kml = new KMLLayer(url, {
        id: "adrian",
        outSR: new SpatialReference(4326)
    });
    var kmlLoad = kml.on("load", function() {
        map.addLayer(kml);
        kmlLoad.remove();
    });

    mapLayerLoad = map.on("layer-add-result", function(obj){
      showElem();
      var geometry = map.getLayer("adrian").getLayers()[0].graphics[0].geometry;
      var extent = esri.graphicsExtent(map.getLayer("adrian").getLayers()[0].graphics);
      map.setExtent(extent.expand(2.5));
      lastGeometry = geometry;
      //realizarAnalisis(lastGeometry, exceptLayers);
      //analizaEstMun(lastGeometry)
    });
  });
}

//setInterval(function(){ cargarEvento() }, 25000);

/* Viento */
function getWindData(){
  require([
    "esri/request"
  ], function(
    esriRequest
  ){
    var layersRequest = esriRequest({
      url: 'gfs.json',
      content: {},
      handleAs: "json"
    }).then(
      function(response) {
        windy = new Windy({ canvas: rasterLayer._element, data: response });
        redraw();
      }, function(error) {
        console.log("Error: ", error.message);
      });
  });
}
/* Fin de Viento */

function addFeatureLayer(map, url, layerId, opacity) {
  require([
    "esri/layers/FeatureLayer",
	"esri/Color",
	"esri/symbols/TextSymbol",
	"esri/layers/LabelClass",
	"esri/symbols/Font"
  ], function(
    FeatureLayer,
	Color,
	TextSymbol,
	LabelClass,
	Font
  ){
	  
	var label = new TextSymbol().setColor(new Color([0,0,0]));
    label.font.setSize("24pt");
    label.font.setFamily("arial");
	label.font.setWeight(Font.WEIGHT_BOLD); 

    var json = {
      "labelExpressionInfo": {
        //"value": "SIMULACRO"
		"value": "{text}"
      }
    };

    var labelClass = new LabelClass(json);
    labelClass.symbol = label;
    
	
    var layer = new FeatureLayer(url, {
      id: layerId,
      opacity: opacity,
	  outFields:["*"],
	  showLabels: true
    });
	
	layer.setLabelingInfo([ labelClass ]);

    layer.on("load", function(){
      map.addLayer(layer);
    });
  });
}

/*********** LANOT ************/
function addImageLayer(layerId, imageUrl){
  require([
    "esri/geometry/Extent",
    "esri/SpatialReference",
    "esri/tasks/ProjectParameters",
    "esri/layers/MapImage",
    "esri/layers/MapImageLayer",
  ], function(
    Extent,
    SpatialReference,
    ProjectParameters,
    MapImage,
    MapImageLayer
  ){
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
      }),
      "radarImages": new Extent({
        xmax: -98.128231,
        xmin: -99.695687,
        ymax: 19.935281,
        ymin: 18.755601,
        spatialReference: new SpatialReference(4326)
      }),
    };

    var image = new MapImage({
      'extent': tipos[layerId],
      'href': imageUrl
    });
  
    if(!map.getLayer(layerId)){
      
    } else {
      // map.getLayer(layerId).removeAllImages();
      map.getLayer(layerId).addImage(image);
      var images = map.getLayer(layerId).getImages();
      if(images.length >= 3) map.getLayer(layerId).removeImage(images[0]);
    }
  });
}

function animateLayer(layerId, prev, min, max, animationDuration, images){
  var tipos = {
    "topClouds": [
      "TopClouds/OR_ABI.",
      ".goes-16.tope_nubes.png"
    ],
    "rgbClouds": [
      "RGBClouds/",
      ".goes-16.rgb_ch14.jpg"
    ]
  };

  var baseUrl = "http://rmgir.proyectomesoamerica.org/GOES16/";

  var next = prev < max-1 ? prev + 1 : min;

  if(layerId == "radarImages") {
    addImageLayer(layerId, images[next]);
  } else {
    addImageLayer(layerId, baseUrl + tipos[layerId][0] + images[next] + tipos[layerId][1]);
  }

  if(layerId == "topClouds") {
    if(goesTopAnimation) clearTimeout(goesTopAnimation);
    goesTopAnimation = window.setTimeout(function(){
      animateLayer(layerId, next, min, max, animationDuration, images);
    }, animationDuration);
  } else if(layerId == "rgbClouds") {
    if(goesRGBAnimation) clearTimeout(goesRGBAnimation);
    goesRGBAnimation = window.setTimeout(function(){
      animateLayer(layerId, next, min, max, animationDuration, images);
    }, animationDuration);
  } else if(layerId == "radarImages") {
    if(radarImagesAnimation) clearTimeout(radarImagesAnimation);
    radarImagesAnimation = window.setTimeout(function(){
      animateLayer(layerId, next, min, max, animationDuration, images);
    }, animationDuration);
  }
}

function getCloudData(layerId, period){
  var types = {
    "rgbClouds": "http://rmgir.proyectomesoamerica.org/GOES16/RGBClouds/names.csv",
    "topClouds": "http://rmgir.proyectomesoamerica.org/GOES16/TopClouds/names.csv"
  };

  $.ajax({
    url: "imagenesLANOT.php",
    type: "GET",
    data: {
      url: types[layerId] + "?" + Math.random()
    },
    dataType: "json",
    success: function (data) {
      animateLayer(layerId, data.length - (4 * period), data.length - (4 * period), data.length, goesAnimationDuration, data);
    },
    error: function(err){

    }
  });
}

function getRadarData(layerId) {
  var radarUrl = "http://rmgir.proyectomesoamerica.org/ImagenesRadar/CDMX/radar_images.csv"

  $.ajax({
    url: "imagenesLANOT.php",
    type: "GET",
    data: {
      url: radarUrl + "?" + Math.random()
    },
    dataType: "json",
    success: function (data) {
      animateLayer(layerId, 0, 0, data.length, 500, data);
    },
    error: function(err){

    }
  });
}
/********* Fin LANOT **********/

/* Huracanes NOAA */
function enciendeCiclones(){
  var eps = ["ep1","ep2","ep3","ep4","ep5"];
  var types = ["ForecastPoints", "ForecastTrack", "ForecastCone", "WatchWarnings",  "PastPoints", "PastTrack"];

  eps.forEach(function(ep, epIndex){
    types.forEach(function(type, typeIndex){
      if(map.getLayer(ep + "_" + type)) map.getLayer(ep + "_" + type).show();
    });
  });

  var ats = ["at1","at2","at3","at4","at5"];
  var types_At = ["ForecastPoints", "ForecastTrack", "ForecastCone", "WatchWarnings",  "PastPoints", "PastTrack"];

  ats.forEach(function(at, atIndex){
    types_At.forEach(function(type_At, typeIndex_At){
      if(map.getLayer(at + "_" + type_At)) map.getLayer(at + "_" + type_At).show();
    });
  });

}

function apagaCiclones(){
  var eps = ["ep1", "ep2", "ep3", "ep4", "ep5"];
  var types = ["ForecastPoints", "ForecastTrack", "ForecastCone","WatchWarnings", "PastPoints","PastTrack"];

  eps.forEach(function(ep, epIndex){
    types.forEach(function(type, typeIndex){
      if(map.getLayer(ep + "_" + type)) map.getLayer(ep + "_" + type).hide();
    });
  });

  var ats = ["at1","at2","at3","at4","at5"];
  var types_At = ["ForecastPoints", "ForecastTrack", "ForecastCone", "WatchWarnings",  "PastPoints", "PastTrack"];

  ats.forEach(function(at, atIndex){
    types_At.forEach(function(type_At, typeIndex_At){
      if(map.getLayer(at + "_" + type_At)) map.getLayer(at + "_" + type_At).hide();
    });
  });



}
/* Fin Huracanes NOAA */