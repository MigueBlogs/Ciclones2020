 $(document).ready(function(){
   $("#mostrar").click(function(){
      $("#oculto").each(function() {
        displaying = $(this).css("display");
        if(displaying == "block") {          
           $(this).css("display","none");          
        } else {          
            $(this).css("display","block");          
        }
      });
    });
  });