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
    data=[
        {
            n: 1,
            rbd: 4531,
            dv: 4,
            est: 'Colegio Marina de Chile',
            com: 'Concepción'
        },
        {
            n: 2,
            rbd: 4540,
            dv: null,
            est: 'Escuela Parvularia Blanca Estela',
            com: 'Concepción'
        },
        {
            n: 3,
            rbd: 4544,
            dv: 6,
            est: 'Escuela Nuevos Horizontes',
            com: 'Concepción'
        },
        {
            n: 4,
            rbd: 4546,
            dv: null,
            est: 'Centro Integral de Educación Especial',
            com: 'Concepción'
        },
        {
            n: 5,
            rbd: 4548,
            dv: 9,
            est: 'Colegio Biobío',
            com: 'Concepción'
        },
        {
            n: 6,
            rbd: 4551,
            dv: 9,
            est: 'Escuela Básica Común Hospital',
            com: 'Concepción'
        },
        {
            n: 7,
            rbd: 4553,
            dv: 5,
            est: 'Liceo de Niñas',
            com: 'Concepción'
        },
        {
            n: 8,
            rbd: 4554,
            dv: 3,
            est: 'Liceo Andalien',
            com: 'Concepción'
        }
    ]
    loadMantenedor()
});
var selected
function loadMantenedor(){
    table=$('#mantenedor_dt').DataTable({
        destroy: true,responsive: true,"paging": true,searching: true,
        data: data,autoWidth: false,
        columns: [
            {   
                title: "N°", 
                data: "n", 
                width: "5%", 
            }, 
            {   
                title: "RBD", 
                data: "rbd", 
                width: "10%", 
            },    
            {   
                title: "DV", 
                data: "dv", 
                width: "5%", 
            },    
            {   
                title: "Establecimiento", 
                data: "est", 
                //width: "11%", 
            },        
            {   
                title: "Comuna", 
                data: "com", 
                className: "text-center",
                //width: "11%", 
            },   
            {   
                title: "Acciones", 
                data: "n", 
                className: "text-center",
                width: "105px", 
                render: function (data, type, full, meta) {
                    return '<a class="btn btn-success" data-toggle="modal" data-target= "#editItemModal"><i style="color:black" class="cil-pencil"></i></a> '+
                    '<a class="btn btn-danger"><i style="color:black" class="cil-trash"></i></a>'
                }
            },      
        ],
        "pageLength": 10,
        "lengthMenu": [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"] ],
        language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
        initComplete: function () {
            $('#mantenedor_dt thead').addClass('thead-light');
        }            
    })
    $('#mantenedor_dt tbody').on( 'click', 'a.btn.btn-danger', function (e, dt, type, indexes) {
        table.row( $(this).parents('tr') ).remove().draw(false);
    });
    $('#mantenedor_dt tbody').on( 'click', 'a.btn.btn-success', function (e, dt, type, indexes) {
        selected=table.row( $(this).parents('tr') ).index()
        document.getElementById('edit_n').value = table.row(selected).data().n
        document.getElementById('edit_rbd').value = table.row(selected).data().rbd
        document.getElementById('edit_dv').value = table.row(selected).data().dv
        document.getElementById('edit_est').value = table.row(selected).data().est
        document.getElementById('edit_com').value = table.row(selected).data().com
    });
}
function edit(){
    table.row(selected).data(
        {
            n:table.row(selected).data().n,
            rbd:document.getElementById('edit_rbd').value,
            dv:document.getElementById('edit_dv').value,
            est:document.getElementById('edit_est').value,
            com:document.getElementById('edit_com').value
        }
    )
}
function clearFields(){
    document.getElementById('edit_n').value = ''
    document.getElementById('edit_rbd').value = ''
    document.getElementById('edit_dv').value = ''
    document.getElementById('edit_est').value = ''
    document.getElementById('edit_com').value = ''
}