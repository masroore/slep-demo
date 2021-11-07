$(function(){
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
    btnCloseEM = $('#closeEmpresaModal')
    nombreI =  $("#nombreEmpresa");

    div_selectOpt = this.getElementById('container_selectOptionME')
    div_createEnt = this.getElementById('container_crearEmpresa')
    div_selectEnt = this.getElementById('container_seleccionarEmpresa')

    div_createEnt.setAttribute("hidden","hidden")
    div_selectEnt.setAttribute("hidden","hidden")

    btnCloseEM.on('click', function(){selectOptionModal(-1)})

    empresas_select = document.getElementById("all_empresas")
    $('#all_empresas').multipleSelect({
        width: '100%'
    });

})
var empresasSeleccionadas
function addEmpresa(){
    $.ajax({                                  
        url: '/tables/create_enterprise',       
        type: 'post',
        data: {
            _token : "mnt5AmLAnrXUPZbWb8gXt8Ohtb9wPdD1xEiVILb8",
            nombreEmpresa: nombreI.val()
        },
        beforeSend: function () {
            //console.log('Loading Screen On');
            showLoading();
        },
        complete: function () {
            //console.log('Loading Screen Off');
            //hideLoading();
        },
        success: function (response) {
            nombreI.val('');
            btnCloseEM.click()
            //alert('Etiquetas agregadas');
            hideLoading();
            toastr["success"]("Empresa Creada")
            loadSelectAllEmpresas()
        },
        error: function (jqXHR, exception) {
            if (jqXHR.status === 0) {
                alert('No conectado.\n Verificar Red.');
                hideLoading();
            } else if (jqXHR.status == 404) {
                alert('Error 404');
                hideLoading();
            } else if (jqXHR.status == 500) {
                alert('Error 500')
                hideLoading();
            } else if (exception === 'parsererror') {
                alert('Requested JSON parse failed.');
                hideLoading();
            } else if (exception === 'timeout') {
                alert('Error Timeout.');
                hideLoading();
            } else if (exception === 'abort') {
                alert('Ajax Request Abortada');
                hideLoading();
            } else {
               alert('Error no capturado.\n' + jqXHR.responseText);
               hideLoading();                    
            }
        },
    });
}
function selectOptionModal(n){
    if(n==1){
        div_selectOpt.setAttribute("hidden","hidden")
        div_selectEnt.setAttribute("hidden","hidden")
        div_createEnt.removeAttribute("hidden")
    }
    if(n==2){
        div_selectOpt.setAttribute("hidden","hidden")
        div_createEnt.setAttribute("hidden","hidden")
        div_selectEnt.removeAttribute("hidden")
        loadSelectAllEmpresas()        
    }
    if(n==-1){
        console.log('sss')
        div_createEnt.setAttribute("hidden","hidden")
        div_selectEnt.setAttribute("hidden","hidden")
        div_selectOpt.removeAttribute("hidden")
    }
}
function loadSelectAllEmpresas(){
    $('#all_empresas').multipleSelect('uncheckAll');   

    url_reg=env_url_base+'/tables/get_enterprises'

    $.get(url_reg).done(function(allEmpresas) {
        while (empresas_select .firstChild) {
            empresas_select .removeChild(empresas_select.firstChild);
        }
        
        allEmpresas.map((o,i)=>{
            var option = document.createElement('option')
                option.setAttribute('value',o.id);
                option.textContent = o.nombre
            empresas_select.appendChild(option)
        })

        $('#all_empresas').change(function() {
            console.log($(this).val());
            empresasSeleccionadas=$(this).val();
        }).multipleSelect({
            width: '100%'
        });
    });
}
function selectEmpresa(){
    console.log(empresasSeleccionadas)
    $.ajax({                                  
        url: '/tables/select_enterprise',       
        type: 'post',
        //dataType: 'json',
        data: {
            _token : "mnt5AmLAnrXUPZbWb8gXt8Ohtb9wPdD1xEiVILb8",
            e_ids: empresasSeleccionadas,
        },
        beforeSend: function () {
            //console.log('Loading Screen On');
            btnCloseEM.click()
            showLoading();
        },
        complete: function () {
            //console.log('Loading Screen Off');
            //hideLoading();
        },
        success: function (response) {
            toastr["success"]("Empresa Asociada")
            hideLoading()
            //location.reload();
            
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