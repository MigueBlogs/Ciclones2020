$(function(){
    //functions for modal
    $('#exampleModal').modal('show');
    $('input:radio[name=choiceRatios]').on("change", function() {
        if (this.value == 'nuevo') {
            $("#events").hide();
            $("#next").removeAttr("disabled");
            $("#caseEdit").hide();
            $("#caseNew").show();
        }
        else if (this.value == 'editar') {
            $("#events").show();
            $("#next").attr("disabled","");
            $("#caseEdit").show();
            $("#caseNew").hide();
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
                        agregarEditado('tablaEdos1', e.ID_ESTADO, e.URL);
                    }
                    else {
                        agregarEditado('tablaEdos2', e.ID_ESTADO, e.URL);
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
    function agregarEditado(nameTable, estado, url){
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
            $('#fila'+cont+' select').val(estado);
            $('#enlace'+cont).val(url).text(url);
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
});