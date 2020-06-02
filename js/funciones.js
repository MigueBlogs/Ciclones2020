$(function(){
    
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
        change(this.id)})
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

    $(".buttonInfo").on('click',function(){
        $(this).siblings(".boxInfo").show('slow');
        $(this).siblings(".buttonClose").show();
        $(this).hide();
    });

    $(".buttonClose").on('click',function(){
        $(this).siblings(".boxInfo").hide('slow');
        $(this).siblings(".buttonInfo").show();
        $(this).hide();
    });
   
});
