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
    load_data()
});

var all_data=[]

function load_data(){
    all_data=[]
    url_reg=env_url_base+'/tables/registros_data'

    $.get(url_reg).done(function(registros){
        registros.map((reg=>{
            $.get('consulta_resultados/'+reg.busqueda_id+'/detalles').done(function(busqueda){
                all_data.push({
                    keywords: capitalize(busqueda[0].palabra_busqueda),
                    tw: reg.twitter,
                    yt: reg.youtube,
                    gn: reg.google,
                    fb: reg.facebook,
                    ig: reg.instagram,
                    id_db: reg.busqueda_id,
                    date: date_and_time(new Date(busqueda[0].created_at))[0]+' '+date_and_time(new Date(busqueda[0].created_at))[1]
                })
                if(reg == registros[registros.length-1]){
                    load_table()
                }
            })
        }))
    })
}
function load_table(){
    $('#tablaRegistros').DataTable({
        destroy: true,
        data: all_data,
        autoWidth: false,
        columns: [
            { 
                title: '<strong class="align-text-top">Fecha', 
                data: "date"
            },
            { 
                title: '<strong class="align-text-top">Palabras Clave', 
                data: "keywords"
            },
            { 
                title: '<i class="cib-twitter"></i>', 
                data: "tw"
            },
            { 
                title: '<i class="cib-youtube"></i>', 
                data: "yt"
            },
            { 
                title: '<i class="cib-google"></i>', 
                data: "gn"
            },
            { 
                title: '<i class="cib-facebook-f"></i>', 
                data: "fb"
            },
            { 
                title: '<i class="cib-instagram"></i>', 
                data: "ig"
            },
            { 
                title: '', 
                data: "id_db",
                render: function ( data, type, row, meta ) {
                     return '<a class="btn btn-primary" onclick=busquedaBtn("'+data+'")><i class="cil-external-link"></i></a>'
                }
            }
        ]            
    })
    $(function() {
        $('#tablaRegistros').DataTable( {
            responsive: true,
            "paging": 10, //pagingLenght -1 es mostrar todo en la misma pagina
            searching: true,
            info: true,
            "deferRender": true,
            destroy: true,
            fixedColums: true,
            "columnDefs": [
                
            ],
            "order": [[ 0, "desc" ]],
            columnDefs: [
                {orderable: false, targets: [1,2,3,4,5,6]},
                { className: "text-center", "targets": [1,2,3,4,5,6] }
            ],  
            language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
        });     
    });
    toastr["warning"]("Registros actualizados")
}
function busquedaBtn(id){
    window.location.href=env_url_base+'/tables/resultado/'+id
}
function capitalize(str){
    return str.charAt(0).toUpperCase()+str.slice(1)
}