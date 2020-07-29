$(function(){
    function buttonInfo() {
        $(this).siblings(".boxInfo").show('slow');
        $(this).siblings(".buttonClose").show();
        $(this).hide();
    }
    function buttonClose() {
        $(this).siblings(".boxInfo").hide('slow');
        $(this).siblings(".buttonInfo").show();
        $(this).hide();
    }
    $(".buttonInfo").on('click',function(event){
        event.stopPropagation();
        event.stopImmediatePropagation();
        buttonInfo.call(this);
    });

    $(".buttonClose").on('click',function(){
        event.stopPropagation();
        event.stopImmediatePropagation();
        buttonClose.call(this);
    });
    $('li.pasado').on('click', function() {
        let info = $(this).children('.buttonInfo');
        let close = $(this).children('.buttonClose');
        if (info.is(':visible')) {            
            buttonInfo.call(info);
        }
        else if (close.is(':visible')){
            buttonClose.call(close);
        }
    })
    $(".buttonCloseTable").on('click',function(){
        $("#analisis").slideUp(3000);
    });
    $("#openBtn").on('click',function(){
        $("#analisis").slideDown(3000);
    });
    // $("#muestraTablaEdos").on('click',function(){
    //     $("#showTableEdos").slideDown(3000);
    // });
    //Elimina los elementos de "title" de ionicon de todos los elementos
    // setTimeout(function(){
    //     $("ion-icon").each(function(){this.shadowRoot.querySelector('div').querySelector('svg').querySelector('title').remove()});
    //   }, 3000);
});
$(function(){
    $('ul.tabs li a').addClass('inactive');
    $('ul.tabs li a:first').removeClass('inactive');
    $('ul.tabs li a:first').addClass('active');
    $('.secciones article').hide();
    $('.secciones article:first').show();

    $('ul.tabs li a').on("click",function(){
        $('ul.tabs li a').removeClass('active');
        $('ul.tabs li a').addClass('inactive');
        $(this).removeClass('inactive');
        $(this).addClass('active');
        $('.secciones article').hide();
        var activeTab = $(this).attr('href');
        $(activeTab).show();
    });
});

$(function(){
    
    $('ul.tabsPob li a').addClass('inactive');
    $('ul.tabsPob li a:first').removeClass('inactive');
    $('ul.tabsPob li a:first').addClass('active');
    $('.seccionesPob article').hide();
    $('.seccionesPob article:first').show();

    $('ul.tabsPob li a').on("click",function(){
        $('ul.tabsPob li a').removeClass('active');
        $('ul.tabsPob li a').addClass('inactive');
        $(this).removeClass('inactive');
        $(this).addClass('active');
        $('.seccionesPob article').hide();
        var activeTab = $(this).attr('href');
        $(activeTab).show();
    });
});