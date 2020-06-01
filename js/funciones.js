$(function(){
    
    var cont =1;
    function agregar(nameTable){
    cont++;
    var fila='<tr id="fila'+cont+'">\
                <th class="solid">\
                        <select id="NivelDeAlerta"> \
                            <option value="1" style="background-color: red; ">ROJA</option>\
                            <option value="2" style="background-color: orange;">NARANJA</option>\
                            <option value="3" style="background-color: yellow;">AMARILLA</option>\
                            <option value="4" style="background-color: #38BF34;">VERDE</option>\
                            <option value="5" style="background-color: #4F81BC">AZUL</option>\
                        </select>\
                </th>\
                <th class="solid">\
                    <select id="Estado" class="edosFila'+cont+'">\
                    </select>\
                        <select id="Region">\
                            <option value="-1">Todo el Edo</option>\
                            <option value="0">Centro</option>\
                            <option value="1">Centro-Norte</option>\
                            <option value="2">Centro-Sur</option>\
                            <option value="3">Centro-Oeste</option>\
                            <option value="4">Noroeste</option>\
                            <option value="5">Norte</option>\
                            <option value="6">Noreste</option>\
                            <option value="7">Este</option>\
                            <option value="8">Sureste</option>\
                            <option value="9">Sur</option>\
                            <option value="10">Suroeste</option>\
                            <option value="11">Oeste</option>\
                        </select>\
                        <button id="fila'+cont+'" type="button" class="btn btn-outline-danger btn-sm botonborrar" title="Elimina una por una las filas"><ion-icon name="close"></ion-icon></button>\
                        <button id="fila'+cont+'" type="button" class="btn btn-outline-info btn-sm rotate-90 switch"><ion-icon name="swap"></ion-icon></button>\
                </th>\
            </tr>';
            $.post( "./evento_fns.php",{ obtenerEstados: true }, function( data ) {
                console.log(data);
              });
    // $.getJSON('JS/estados.json',function(data){
    //     $.each(data,function(key, value){
    //         $('.edosFila'+cont).append('<option value=' + key.clave + '>' + value.nombre + '</option>');
    //     });
    // });
    $('#'+nameTable).append(fila);
    // $(".botonborrar").click(function(event){
    //     event.stopPropagation();
    //     event.stopImmediatePropagation();
    //     eliminar(this.id); 
    // });
    // $(".switch").click(function(event){
    //     event.stopPropagation();
    //     event.stopImmediatePropagation();
    //     change(this.id)})
    }

    $("#bt_add1").click(function(){ agregar('tablaEdos1'); });
    $("#bt_add2").click(function(){ agregar('tablaEdos2'); });
});
