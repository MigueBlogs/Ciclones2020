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
   
});
