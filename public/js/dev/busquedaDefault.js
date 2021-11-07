toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": true,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "2000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}
fecha1.max = new Date().toISOString().split("T")[0];
fecha2.max = new Date().toISOString().split("T")[0];
tkn=document.querySelector('meta[name="csrf-token"]').getAttribute('content')

name_search = $('#nombreBusqueda')
campaign_selected = $('#select2-1')
keywords = $('#palabraClave')

$( document ).ready(function() {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
    $("#fecha1").val(today);
    $("#fecha2").val(today);

    //Listener para Activar el boton
    f1=false;f2=false;f3=false
    el = document.getElementById("nombreBusqueda");
    el.addEventListener("change", function(){
        (el.value)==""?f1=false:f1=true
        if(f1&&f2&&f3){document.getElementById("buscarButton").disabled=false}else{document.getElementById("buscarButton").disabled=true}
    }, false);
    el2 = document.getElementById("palabraClave");
    el2.addEventListener("change", function(){
        (el2.value)==""?f2=false:f2=true
        if(f1&&f2&&f3){document.getElementById("buscarButton").disabled=false}else{document.getElementById("buscarButton").disabled=true}
    }, false);
    $('#select2-1').on('change', function(){
        ( $('#select2-1').val())==null?f3=false:f3=true
        if(f1&&f2&&f3){document.getElementById("buscarButton").disabled=false}else{document.getElementById("buscarButton").disabled=true}
    });
    //Limpiar campos
    el.value="";el2.value="";$('#select2-1').val(null)
    //Toast
    $("#btn_srch_span").on('click', function (e) {
        if(name_search.val().length == 0) {
            toastr["warning"]("Debe ingresar un nombre de busqueda")
        }else{
            if(keywords.val().length == 0){
                toastr["warning"]("Debe ingresar palabras clave")
            }else{
                if(campaign_selected.val() === null){
                    toastr["warning"]("Debe seleccionar una campaña")
                }else{
                    searchSomething()
                }
            } 
        } 
    });
    $(".container").fadeIn(500);
});

$(function(){
    //Cuando se detecte un cambio sobre el select principal, se llama a la funcion onDateChange
    $('#fecha2').on('change', onDateChange);
});

function onDateChange(){
    fecha1.max=fecha2.value;
    if(fecha1.value > fecha2.value){
        $("#fecha1").val(fecha1.max);
    }
}
function searchSomething2(){
    $.ajax({                                  
        url: '/tables/buscador',       
        type: 'post',
        data: {
            _token : tkn,
            nombreBusqueda: name_search.val(),
            campañas_select: campaign_selected.val(),
            palabraClave: keywords.val(),
            fecha1: $('#fecha1').val(),
            fecha2: $('#fecha2').val(),
        },
        beforeSend: function () {
            //showLoading();
        },
        complete: function () {
        },
        success: function (response) {
            toastr["success"]("Buscando: "+keywords.val())
            hideLoading()
        },
        error: function (jqXHR, exception) {
            if (jqXHR.status === 0) {
                console.log('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
                console.log('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
               console.log('Internal Server Error [500].')
            } else if (exception === 'parsererror') {
                console.log('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                console.log('Time out error.');
            } else if (exception === 'abort') {
                console.log('Ajax request aborted.');
            } else {
               console.log('Uncaught Error.\n' + jqXHR.responseText);
            }
        },
    }); 
}
function searchSomething(){
    toastr["success"]("Buscando: "+keywords.val())
    showLoading()
    /*setTimeout(function(){
            window.location.href=env_url_base+'/tables/registros'
    }, 3000);*/
}