let failed1 = false, failed2 = false, failed3 = false;
function asyncFunction1 (item, r) {
    setTimeout(() => {
        item["editaDeclaratoria"] = 1;
        $.post("consulta.php", item, function(result) {
            if (result == 1) {
                // caso que se actualizó la declaratoria correctamente
                console.log("Declaratoria editada");
            }
            else {
                console.log("Declaratoria no editada");
                failed1 = true;
            }
        }, 'json')
        .fail(function(result) {
            failed1 = true;
            console.log(result);
        })
        .always(function(){
            // regresa el promise (significa que ya termina esta función)
            r();
        });
    }, 1);
}
function asyncFunction2 (item, r) {
    setTimeout(() => {
        item["agregaDeclaratoria"] = 1;
        item["ciclon"] = $("#events option:selected").val();
        $.post("consulta.php", item, function(result) {
            if (result == 1) {
                // caso que se actualizó la declaratoria correctamente
                console.log("Declaratoria agregada");
            }
            else {
                failed2 = true;
            }
        }, 'json')
        .fail(function(result) {
            failed2 = true;
            console.log(result);
        })
        .always(function(){
            // regresa el promise (significa que ya termina esta función)
            r();
        });
    }, 10);
}
function asyncFunction3 (item, r) {
    setTimeout(() => {
        //item["eliminaDeclaratoria"] = 1;
        $.post("consulta.php",{eliminaDeclaratoria:true, id:item}, function(result) {
            if (result == 1) {
                // caso que se actualizó la declaratoria correctamente
                console.log("Declaratoria eliminada correctamente!");
            }
            else {
                console.log("La declaratoria no se pudo eliminar");
                failed3 = true;
            }
        }, 'json')
        .fail(function(result) {
            failed3 = true;
            console.log(result);
        })
        .always(function(){
            // regresa el promise (significa que ya termina esta función)
            r();
        });
    }, 1);
}
$(function(){
    //functions for modal
    $('#exampleModal').modal('show');
    $('input:radio[name=choiceRatios]').on("change", function() {
        if (this.value == 'nuevo') {
            $("#events").hide();
            $("#next").removeAttr("disabled");
            $("#caseEdit").hide();
            $("#caseNew").show();
            $("#asignar").hide();
        }
        else if (this.value == 'editar') {
            $("#events").show();
            $("#next").attr("disabled","");
            $("#caseEdit").show();
            $("#caseNew").hide();
            $("#asignar").show();
        }
    });

    $("#events").on("click",function(){
        $("#next").removeAttr("disabled");
        $("#nombreEvento").text('');
        $("#nombreEvento").append($("#events option:selected").text());
        
    });

    //consulta la base de datos para extraer info sel evento seleccionado
    $("#next").on('click',function(){
        if($("#editarEvento").is(":checked")){
            $('#borrarEvento').show().siblings().show();

            var params = {
                obtenerEvento:true,
                id: $("#events option:selected").val()
            };
            $.post( "./consulta.php",params, function( data ) {
                console.log(data);
                $("#fecha_inicio").val(data["FECHA_INICIO"]);
                $("#fecha_fin").val(data["FECHA_FIN"]);
                $("#lluvias").val(data["LLUVIA"]);
                if(data["OCEANO"]=='A'){
                    $("#oceano").text("Atlántico")
                }else{
                    $("#oceano").text("Pacífico")
                }
            }, "json")
            .fail(function() {
                console.log( "error al consultar evento" );
            });
            var paramsD = {
                obtenerDeclaratorias:true,
                id: $("#events option:selected").val()
            };
            $.post( "./consulta.php",paramsD, function( data ) {
                console.log(data);
                data.forEach(e => {
                    if (e.TIPO == "E"){
                        agregarEditado('tablaEdos1', e.ID_ESTADO, e.URL, e.ID_DECLARATORIA);
                    }
                    else {
                        agregarEditado('tablaEdos2', e.ID_ESTADO, e.URL, e.ID_DECLARATORIA);
                    }
                    
                });
            }, "json")
            .fail(function() {
                console.log( "error al consultar declaratorias" );
            });
        };
    });
    

    var cont =1;
    function agregar(nameTable){
        cont++;
        var fila='<tr id="fila'+cont+'">\
                <th class="solid">\
                    <select id="Estado" class="edosFila'+cont+'">\
                    </select>\
                </th>\
                <th class="solid">\
                    <div class="row">\
                        <div class="w-100"></div>\
                        <div class=" adjust col-9">\
                            <input type="text" class="form-control enlace" id="enlace'+cont+'" aria-describedby="link" placeholder="Pega aquí el enlace de la declaratoria">\
                        </div>\
                        <div class=" adjust col">\
                            <button id="fila'+cont+'" type="button" class="btn btn-outline-danger btn-sm botonborrar" title="Elimina una por una las filas"><ion-icon name="close"></ion-icon></button>\
                            <button id="fila'+cont+'" type="button" class="btn btn-outline-info btn-sm rotate-90 switch"><ion-icon name="swap"></ion-icon></button>\
                        </div>\
                    </div>\
                </th>\
            </tr>';
        $.post( "./evento_fns.php",{ obtenerEstados: true }, function( data ) {
            $.each(data,function(key, value){
                $('.edosFila'+cont).append('<option value=' + value.id_estado + '>' + value.estado + '</option>');
            });
        }, "json");
        
        $('#'+nameTable).append(fila);
        
        $(".botonborrar").click(function(event){
            event.stopPropagation();
            event.stopImmediatePropagation();
            eliminar(this.id); 
        });
        window.eliminar =function(id_fila){
            
            $('#'+id_fila).remove();
        };
        $(".switch").click(function(event){
            event.stopPropagation();
            event.stopImmediatePropagation();
            change(this.id)}
            
        )
    }
    var porEliminar = [];
    //solo se agrega el array a los editados ya existentes
    function agregarEditado(nameTable, estado, url, id_decl){
        cont++;
        var fila='<tr id="fila'+cont+'">\
                <input type="hidden" id="decl'+nameTable+cont+'">\
                <th class="solid">\
                    <select id="Estado'+nameTable+cont+'" class="edosFila'+cont+'">\
                    </select>\
                </th>\
                <th class="solid">\
                    <div class="row">\
                        <div class="w-100"></div>\
                        <div class=" adjust col-9">\
                            <input type="text" class="form-control enlace" id="enlace'+nameTable+cont+'" aria-describedby="link" placeholder="Pega aquí el enlace de la declaratoria">\
                        </div>\
                        <div class=" adjust col">\
                            <button id="fila'+cont+'" type="button" class="btn btn-outline-danger btn-sm botonborrar" title="Elimina una por una las filas"><ion-icon name="close"></ion-icon></button>\
                            <button id="fila'+cont+'" type="button" class="btn btn-outline-info btn-sm rotate-90 switch"><ion-icon name="swap"></ion-icon></button>\
                        </div>\
                    </div>\
                </th>\
            </tr>';
        $('#'+nameTable).append(fila);
        $(".botonborrar").click(function(event){
            event.stopPropagation();
            event.stopImmediatePropagation();
            porEliminar.push($("#"+this.id).children().val());
            eliminar(this.id); 
        });
        window.eliminar =function(id_fila){
            $('#'+id_fila).remove();
        };
        $(".switch").click(function(event){
            event.stopPropagation();
            event.stopImmediatePropagation();
            change(this.id)}
        )
        let tmp = cont;  // <---- ES NECESARIO PARA QUE FUNCIONE EL POST
        $.post( "./evento_fns.php",{ obtenerEstados: true }, function( data ) {
            $.each(data,function(key, value){
                $("#Estado"+nameTable+tmp).append('<option value=' + value.id_estado + '>' + value.estado + '</option>');
            });            
            $("#Estado"+nameTable+tmp).val(estado);
            $('#enlace'+nameTable+tmp).val(url).text(url);
            $('#decl'+nameTable+tmp).val(id_decl);
        }, "json");
    }
    window.change = function(id_fila){
		var filaAct = document.getElementById(id_fila);
		var tablaFilaAct= $('#'+id_fila).parent().parent();
		console.log("Tabla actual: ",tablaFilaAct[0].id);

		if(tablaFilaAct[0].id === 'tablaEdos1'){
			$('#tablaEdos2').append(filaAct);
		}
		if (tablaFilaAct[0].id === 'tablaEdos2'){
			$('#tablaEdos1').append(filaAct);
		}
    }
    $("#bt_add1").click(function(){ agregar('tablaEdos1'); });
    $("#bt_add2").click(function(){ agregar('tablaEdos2'); });
    $('#guardarDatos').on('click', function(){
        // Cuando se edita un evento
        if($("#editarEvento").is(":checked")) {
            
            let lluvias = $('#lluvias').val().replace(/\D/, '');
            let fecha_inicio = $('#fecha_inicio').val()=="" ? null : $('#fecha_inicio').val();
            let fecha_fin = $('#fecha_fin').val()=="" ? null : $('#fecha_fin').val();

            let declaratorias1 = $('#tablaEdos1 tbody tr');
            let declaratorias2 = $('#tablaEdos2 tbody tr');
            let decl_agregar = [];
            let decl_editar = [];

            let vacio = false;
            // verificar que no estén vacías. También separar si es para editar o para insertar
            $.each(declaratorias1, function(index, value) {
                let tmp = $(value).find("input[type=text]").val().trim();
                if (tmp == "" || vacio){
                    vacio = true;
                    return;
                }
                let dec = {estado: $(value).find('select').val(), tipo: "E", url: tmp};
                tmp = $(value).find("input[type=hidden]");
                if (tmp.length > 0){
                    // agregar como para editar (y no como insertar)
                    dec["id_declaratoria"] = tmp.val();
                    decl_editar.push(dec);
                }
                else {
                    decl_agregar.push(dec);
                }
            });
            $.each(declaratorias2, function(index, value) {
                let tmp = $(value).find("input[type=text]").val().trim();
                if (tmp == "" || vacio){
                    vacio = true;
                    return;
                }
                let dec = {estado: $(value).find('select').val(), tipo: "D", url: tmp};
                tmp = $(value).find("input[type=hidden]");
                if (tmp.length > 0){
                    // agregar como para editar (y no como insertar)
                    dec["id_declaratoria"] = tmp.val();
                    decl_editar.push(dec);
                }
                else {
                    decl_agregar.push(dec);
                }
            });
            
            if (vacio) {
                alert("Completa el campo de enlace para cada declaratoria");
                return;
            }

            // editar primero el evento
            data = {editaEvento: 1, id: $("#events option:selected").val(), inicio:fecha_inicio, fin: fecha_fin, lluvias: lluvias};
            $.post("consulta.php", data, function(result) {
                failed1 = false,  failed2 = false, failed3 = false;
                if (result == 1) {
                    // caso que se editó el evento correctamente

                    // editar las declaratorias que ya existían
                    let requests1 = decl_editar.map((value) => {
                        return new Promise((resolve) => {
                            asyncFunction1(value, resolve);
                        })
                    })
                    // $.each(decl_editar, function(index, value ) {
                    //     value["editaDeclaratoria"] = 1;
                    //     $.post("consulta.php", value, function(result) {
                    //         if (result == 1) {
                    //             // caso que se actualizó la declaratoria correctamente
                    //         }
                    //         else {
                    //             failed1 = true;
                    //         }
                      
                    //     }, 'json')
                    //     .fail(function() {
                    //         alert( "error" );
                    //     });
                    // });
                    
                    // insertar las nuevas declaratorias
                    let requests2 = decl_agregar.map((value) => {
                        return new Promise((resolve) => {
                            asyncFunction2(value, resolve);
                        })
                    })
                    //eliminar declaratorias
                    let requests3 = porEliminar.map((value) => {
                        return new Promise((resolve) => {
                            //console.log(value);
                            asyncFunction3(value, resolve);
                        })
                    })
                    // $.each(decl_agregar, function(index, value ) {
                    //     value["agregaDeclaratoria"] = 1;
                    //     value["ciclon"] = $("#events option:selected").val();
                    //     $.post("consulta.php", value, function(result) {
                    //         if (result == 1) {
                    //             // caso que se insertó la declaratoria correctamente
                    //         }
                    //         else {
                    //             failed2 = true;
                    //         }
                      
                    //     }, 'json')
                    //     .fail(function() {
                    //         alert( "error" );
                    //     });
                    // });
                    Promise.all([requests1, requests2, requests3].map(Promise.all, Promise)).then(() => {
                        console.log(failed1, failed2, failed3);
                        
                        if (failed1 || failed2 || failed3) {
                            alert("Algunos datos no se pudieron actualizar correctamente. Por favor inténtalo de nuevo.");
                        }
                        else {
                            alert("Evento editado correctamente");
                        }
                        window.location.href = "evento.php";
                    });
                }
                else {
                    alert("No se pudo editar el evento correctamente");
                }
            }, 'json')
              .fail(function(result) {
                alert("Error de conexión con el servidor" );
                console.log(result);                
              });

        }
        // ---------------------------------------------------------------------------------------------------------------
        // Cuando se agrega un evento
        else {
            // Verificar que tenga nombre
            let nombre = $('#nombreCiclon').val().trim();
            if (nombre == "") {
                alert("Ingresa el nombre del evento primero.");
                return;
            }
            let oceano = $('#nuevo-oceano').val();
            let lluvias = $('#lluvias').val().replace(/\D/, '');
            let fecha_inicio = $('#fecha_inicio').val()=="" ? null : $('#fecha_inicio').val();
            let fecha_fin = $('#fecha_fin').val()=="" ? null : $('#fecha_fin').val();

            // Verificar que todas las URL tengan valor
            let declaratorias1 = $('#tablaEdos1 tbody tr');
            let declaratorias2 = $('#tablaEdos2 tbody tr');
            let declaratorias = [];
            
            let vacio = false;

            $.each(declaratorias1, function(index, value) {
                let tmp = $(value).find("input").val().trim();
                if (tmp == "" || vacio){
                    vacio = true;
                    return;
                }
                let dec = {estado: $(value).find('select').val(), tipo: "E", url: tmp};
                declaratorias.push(dec);
            });
            $.each(declaratorias2, function(index, value) {
                let tmp = $(value).find("input").val().trim();
                if (tmp == "" || vacio){
                    vacio = true;
                    return;
                }
                let dec = {estado: $(value).find('select').val(), tipo: "D", url: tmp};
                declaratorias.push(dec);
            });
            
            if (vacio) {
                alert("Completa el campo de enlace para cada declaratoria");
                return;
            }

            // primero se crea el evento
            let data = {agregaEvento:1, nombre:nombre, oceano:oceano, lluvias:lluvias, inicio:fecha_inicio, fin:fecha_fin};
            
            $.post("consulta.php", data, function(result) {
                let failed = false;
                // caso que sí se creo exitosamente
                if (result == 1){
                    // obtener su id (porque agregarlo no nos puede regresar el id)
                    $.post("consulta.php", {obtenerEvento:1, nombre:nombre}, function(result) {
                        let id_ciclon = result.ID_CICLON;
                        // agregar cada declaratoria (si existen)
                        $.each(declaratorias, function( index, value ) {
                            value["agregaDeclaratoria"] = 1;
                            value["ciclon"] = id_ciclon;
                            $.post("consulta.php", value, function(result) {
                                if (result == 1){
                                    // caso que se agregó la declaratoria exitosamente
                                    console.log("Declaratoria subida");
                                }
                                else {
                                    failed = true;
                                }
                            }, 'json')
                            .fail(function() {
                                failed= true;
                            });
                        });
                        alert("Evento agregado exitosamente");
                        if (failed){
                            alert("No se pudieron agregar la(s) declaratoria(s). Te pedimos editar el evento a continuación.")
                        }
                        window.location.href = "evento.php";
                    }, 'json')
                    .fail(function() {
                        alert("Evento agregado exitosamente");
                        alert("No se pudieron agregar la(s) declaratoria(s). Te pedimos editar el evento a continuación.")
                        window.location.href = "evento.php";
                    });
                    
                }
                else {
                    alert("Hubo un error al agregar el evento");
                }
            }, 'json')
              .fail(function(result) {
                alert("Error en la conexión al servidor");
                console.log(result);
              });
        }
    });
    //cuando se asigna un evento a otro
    $('#asignar').on('click', function(){
        //elige a que otro evento quieres asignar
        $('#seleccionaEventoModal').modal('show');
        $("#porAsignar").on("click",function(){
            $("#confirmarAsignacion").removeAttr("disabled");
        });
        //repito todo lo de edita evento con la diferencia de indicarle hacia que ID de evento se asigna
        $("confirmarAsignacion").on('click',function(){
            //obtengo el ID del evento por asignar
            var IDevento = $("#porAsignar option:selected").val();
            let lluvias = $('#lluvias').val().replace(/\D/, '');
            let fecha_inicio = $('#fecha_inicio').val()=="" ? null : $('#fecha_inicio').val();
            let fecha_fin = $('#fecha_fin').val()=="" ? null : $('#fecha_fin').val();

            let declaratorias1 = $('#tablaEdos1 tbody tr');
            let declaratorias2 = $('#tablaEdos2 tbody tr');
            let decl_agregar = [];
            let decl_editar = [];

            let vacio = false;
            // verificar que no estén vacías. También separar si es para editar o para insertar
            $.each(declaratorias1, function(index, value) {
                let tmp = $(value).find("input[type=text]").val().trim();
                if (tmp == "" || vacio){
                    vacio = true;
                    return;
                }
                let dec = {estado: $(value).find('select').val(), tipo: "E", url: tmp};
                tmp = $(value).find("input[type=hidden]");
                if (tmp.length > 0){
                    // agregar como para editar (y no como insertar)
                    dec["id_declaratoria"] = tmp.val();
                    decl_editar.push(dec);
                }
                else {
                    decl_agregar.push(dec);
                }
            });
            $.each(declaratorias2, function(index, value) {
                let tmp = $(value).find("input[type=text]").val().trim();
                if (tmp == "" || vacio){
                    vacio = true;
                    return;
                }
                let dec = {estado: $(value).find('select').val(), tipo: "D", url: tmp};
                tmp = $(value).find("input[type=hidden]");
                if (tmp.length > 0){
                    // agregar como para editar (y no como insertar)
                    dec["id_declaratoria"] = tmp.val();
                    decl_editar.push(dec);
                }
                else {
                    decl_agregar.push(dec);
                }
            });
            
            if (vacio) {
                alert("Completa el campo de enlace para cada declaratoria");
                return;
            }

            // editar primero el evento
            data = {editaEvento: 1, id: IDevento, inicio:fecha_inicio, fin: fecha_fin, lluvias: lluvias};
            $.post("consulta.php", data, function(result) {
                failed1 = false,  failed2 = false, failed3 = false;
                if (result == 1) {
                    // caso que se editó el evento correctamente

                    // editar las declaratorias que ya existían
                    let requests1 = decl_editar.map((value) => {
                        return new Promise((resolve) => {
                            asyncFunction1(value, resolve);
                        })
                    })
                    
                    // insertar las nuevas declaratorias
                    let requests2 = decl_agregar.map((value) => {
                        return new Promise((resolve) => {
                            asyncFunction2(value, resolve);
                        })
                    })
                    //eliminar declaratorias
                    let requests3 = porEliminar.map((value) => {
                        return new Promise((resolve) => {
                            //console.log(value);
                            asyncFunction3(value, resolve);
                        })
                    })

                    Promise.all([requests1, requests2, requests3].map(Promise.all, Promise)).then(() => {
                        console.log(failed1, failed2, failed3);
                        
                        if (failed1 || failed2 || failed3) {
                            alert("Algunos datos no se pudieron actualizar correctamente. Por favor inténtalo de nuevo.");
                        }
                        else {
                            alert("Evento asignado correctamente");
                        }
                        window.location.href = "evento.php";
                    });
                }
                else {
                    alert("No se pudo asignar el evento correctamente");
                }
            }, 'json')
              .fail(function(result) {
                alert("Error de conexión con el servidor" );
                console.log(result);                
              });
        });
        //elimino evento del que provenía la asignación
    });
    })
    $('#borrarEvento').on('click', function(){
        if (confirm("¿Estás seguro de eliminar este evento?. No se podrá revertir esta acción.")){
            data = {eliminaEvento:1, confirma:1, id:$("#events option:selected").val()};
            $.post( "consulta.php", data, function(result) {
                if (result == 1) {
                    // se elimina el evento correctamente
                    alert("Evento eliminado correctamente");
                    window.location.href = "evento.php";
                }
                else {
                    alert("No se pudo eliminar este evento. Inténtalo nuevamente en otra ocasión");
                }
            }, 'json')
            .fail(function(result) {
                console.log(result);
                alert( "Hubo un problema de conexión con el servidor" );
            });
        }
    })
});