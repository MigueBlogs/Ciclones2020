Handlebars.registerHelper('compare', function(lvalue, rvalue, options) {
	if (arguments.length < 3)
	    throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

	operator = options.hash.operator || "==";

	var operators = {
	    '==':       function(l,r) { return l == r; },
	    '===':      function(l,r) { return l === r; },
	    '!=':       function(l,r) { return l != r; },
	    '<':        function(l,r) { return l < r; },
	    '>':        function(l,r) { return l > r; },
	    '<=':       function(l,r) { return l <= r; },
	    '>=':       function(l,r) { return l >= r; },
	    'typeof':   function(l,r) { return typeof l == r; }
	}

	if (!operators[operator])
	    throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

	var result = operators[operator](lvalue,rvalue);

	if( result ) {
	    return options.fn(this);
	} else {
	    return options.inverse(this);
	}
});

Handlebars.registerHelper("elementIndex", function(array, index) {
    return array[index];
});

Handlebars.registerHelper("fechaLarga", function(dateString) {
    debugger
    var date = new Date((dateString + " (CDT)").replace(/-/g, '/'));
    var fecha = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    return date.toLocaleString("es-MX", fecha);
});

Handlebars.registerHelper("getRegiones", function(statesDictionary, typeAlert, levelAlert) {
    var colorAlerts = ["AZUL", "VERDE", "AMARILLA", "NARANJA", "ROJA"];
    var tipo = typeAlert == "1" ? "ACERCÁNDOSE" : "ALEJANDOSE";
    var level = parseInt(levelAlert) - 1;
    var states = Object.keys(statesDictionary[tipo][colorAlerts[level]]);
    var text = "";

    if(states.length == 0) return "---";
    else {
        states.forEach(function(state) {
            statesDictionary[tipo][colorAlerts[level]][state]["regiones"]["nombres"].forEach(function(region, idx) {
                if(statesDictionary[tipo][colorAlerts[level]][state]["regiones"]["nombres"].length == 1) {
                    text += region + " de " + statesDictionary[tipo][colorAlerts[level]][state]["estado"];
                } else {
                    if(idx == (statesDictionary[tipo][colorAlerts[level]][state]["regiones"]["nombres"].length - 1)) text += " y "  + region + " de " + statesDictionary[tipo][colorAlerts[level]][state]["estado"];
                    else text += region;
    
                    if(idx < (statesDictionary[tipo][colorAlerts[level]][state]["regiones"]["nombres"].length - 2)) text += ", "
                }
            });
    
            if (states.length != 1) text += "; "
        });
    }

    return text;
});

Handlebars.registerHelper("getEfectos", function(efectosArray, index) {
    var efectos = efectosArray[index];
    var descripciones = efectos.split("\n");
    var output = "";

    descripciones.forEach(function(descripcion) {
        output += "<li class='listElement'>" + descripcion + "</li>";
    });

    return new Handlebars.SafeString(output);
});

Handlebars.registerHelper("getComentarios", function(comentarios) {
    var descripciones = comentarios.split("\n");
    var output = "";

    descripciones.forEach(function(descripcion) {
        output += "<li class='listElement'>" + descripcion + "</li>";
    });

    return new Handlebars.SafeString(output);
});


Handlebars.registerHelper("getEstados", function(statesDictionary) {
    var states = [];
    var colors = Object.keys(statesDictionary["ACERCÁNDOSE"]);

    colors.forEach(function(color) {
        var ac = Object.keys(statesDictionary["ACERCÁNDOSE"][color]);
        var al = Object.keys(statesDictionary["ALEJANDOSE"][color]);

        states = [...new Set([...ac, ...al, ...states])];
    });

    return states.length;
});

Handlebars.registerHelper("getListaEstados", function(statesDictionary) {
    var states = [];
    var colors = Object.keys(statesDictionary["ACERCÁNDOSE"]);

    colors.forEach(function(color) {
        var ac = Object.keys(statesDictionary["ACERCÁNDOSE"][color]);
        var al = Object.keys(statesDictionary["ALEJANDOSE"][color]);

        states = [...new Set([...ac, ...al, ...states])];
    });

    states.sort();
    var output = "";

    states.forEach(function(state) {
        output += "<li class='listElement'>" + state + "</li>";
    });

    return new Handlebars.SafeString(output);
});

Handlebars.registerHelper("getMunicipios", function(statesDictionary) {
    var municipios = 0;
    var colors = Object.keys(statesDictionary["ACERCÁNDOSE"]);
    var municipiosPorEstado = {};
    var municipiosPorNivel = {};

    colors.forEach(function(color) {
        var statesColorAc = Object.keys(statesDictionary["ACERCÁNDOSE"][color]);
        var statesColorAl = Object.keys(statesDictionary["ALEJANDOSE"][color]);

        statesColorAc.forEach(function(state) {
            municipios += statesDictionary["ACERCÁNDOSE"][color][state]["municipios"].length;
            if(!municipiosPorEstado.hasOwnProperty(state)) {
                municipiosPorEstado[state] = {
                    municipios: [],
                    alertas: []
                };
            }
            municipiosPorEstado[state]["municipios"] = municipiosPorEstado[state]["municipios"].concat(statesDictionary["ACERCÁNDOSE"][color][state]["municipios"]);
            municipiosPorEstado[state]["alertas"].push({
                nivelAlerta: color,
                estado: state,
                municipios: statesDictionary["ACERCÁNDOSE"][color][state]["municipios"],
                tipo: "ACERCÁNDOSE"
            });

            if(!municipiosPorNivel.hasOwnProperty(color)) {
                municipiosPorNivel[color] = {
                    municipiosAc: [],
                    municipiosAl: []
                }
            }

            municipiosPorNivel[color]["municipiosAc"] = municipiosPorNivel[color]["municipiosAc"].concat(statesDictionary["ACERCÁNDOSE"][color][state]["municipios"]);
        });

        statesColorAl.forEach(function(state) {
            municipios += statesDictionary["ALEJANDOSE"][color][state]["municipios"].length;
            if(!municipiosPorEstado.hasOwnProperty(state)) municipiosPorEstado[state] = {
                municipios: [],
                alertas: []
            };
            municipiosPorEstado[state]["municipios"] = municipiosPorEstado[state]["municipios"].concat(statesDictionary["ALEJANDOSE"][color][state]["municipios"]);
            municipiosPorEstado[state]["alertas"].push({
                nivelAlerta: color,
                estado: state,
                municipios: statesDictionary["ALEJANDOSE"][color][state]["municipios"],
                tipo: "ALEJANDOSE"
            });

            if(!municipiosPorNivel.hasOwnProperty(color)) {
                municipiosPorNivel[color] = {
                    municipiosAc: [],
                    municipiosAl: []
                }
            }

            municipiosPorNivel[color]["municipiosAl"] = municipiosPorNivel[color]["municipiosAl"].concat(statesDictionary["ALEJANDOSE"][color][state]["municipios"]);
        });
    });

    var barchartData = [];
    var donutchartData = [];
    var groupedBarchart = {};
    var groupedBarchartData = [];

    Object.keys(municipiosPorEstado).forEach(function(estado) {
        var estadoInfo = {
            estado: estado,
            municipios: municipiosPorEstado[estado]["municipios"].length
        };

        barchartData.push(estadoInfo);

        if(!groupedBarchart.hasOwnProperty(estado)) groupedBarchart[estado] = { estado: estado, ACERCÁNDOSE: 0, ALEJANDOSE: 0 };
        municipiosPorEstado[estado]["alertas"].forEach(function(alerta) {
            groupedBarchart[estado][alerta["tipo"]] = alerta["municipios"].length;
        });
    });

    Object.keys(municipiosPorNivel).forEach(function(color) {
        var colorInfo = {
            color: color,
            municipios: municipiosPorNivel[color]["municipiosAc"].length + municipiosPorNivel[color]["municipiosAl"].length
        };

        donutchartData.push(colorInfo);
    });

    Object.keys(groupedBarchart).forEach(function(estado) {
        groupedBarchartData.push(groupedBarchart[estado]);
    });

    activeEvents["chartDrawing"] = window.setTimeout(function() {
        // createBarChart("#countyChart", barchartData);
        createGroupedBarChart("#countyChart", groupedBarchartData);
        createDonutChart("#warningChart", donutchartData);

        window.addEventListener("resize", function() {
            $("#countyChart").html("");
            $("#warningChart").html("");
            createGroupedBarChart("#countyChart", groupedBarchartData);
            createDonutChart("#warningChart", donutchartData);
        });
    }, 1000);

    return municipios;
});