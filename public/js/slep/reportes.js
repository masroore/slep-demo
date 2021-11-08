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
            rbd:4531,
            est:'Colegio Marina de Chile',
            total:106280015
        },
        {
            rbd:4540,
            est:'Escuela Parvularia Blanca Estela',
            total:7219611
        },
        {
            rbd:4543,
            est:'Escuela Especial Chile España',
            total:17743490
        },
        {
            rbd:4544,
            est:'Escuela Nuevo Horizontes',
            total:2073304
        },
        {
            rbd:4546,
            est:'Centro Integrado de Educación Especial',
            total:13700396
        },
        {
            rbd:4548,
            est:'Colegio Biobío',
            total:33573802
        },
        {
            rbd:4551,
            est:'Escuela Básica Común Hospital',
            total:1788990
        },
        {
            rbd:4553,
            est:'Liceo de Niñas',
            total:44537792
        }
    ]
    document.getElementById('totalMes').textContent='$'+Intl.NumberFormat().format(329476991)
    document.getElementById('totalAño').textContent='$'+Intl.NumberFormat().format(94257472932)
    loadReporte()
    loadGraph()
});
var selected
function loadReporte(){
    table=$('#reporte_dt').DataTable({
        destroy: true,responsive: true,"paging": true,searching: true,
        data: data,autoWidth: false,
        columns: [
            {   
                title: "RBD", 
                data: "rbd", 
                width: "10%", 
            },     
            {   
                title: "Establecimiento", 
                data: "est", 
                //width: "11%", 
            },        
            {   
                title: "Total a Pago", 
                data: "total", 
                render: function (data, type, full, meta) {
                    return '$'+Intl.NumberFormat().format(data)
                }
            },     
        ],
        "pageLength": 10,
        "lengthMenu": [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"] ],
        language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
        initComplete: function () {
            $('#reporte_dt thead').addClass('thead-light');
        }            
    })
}
function loadGraph(){
    mainChart = new Chart(document.getElementById('reporte-chart'), {
        type: 'bar',
        data: {
          labels: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre'],
          datasets: [{
            label: 'Total del Mes',
            backgroundColor: coreui.Utils.hexToRgba(coreui.Utils.getStyle('--info'), 10),
            borderColor: coreui.Utils.getStyle('--info'),
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: [122941252,84629435,325562333,627868889,323564363,424414323,786967976,315554555,385677766,372551644,211553000]
          }]
        },
        options: {
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              gridLines: {
                drawOnChartArea: false
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
                maxTicksLimit: 5,
                stepSize: Math.ceil(786967976 / 5),
                max: 786967976
              }
            }]
          },
          elements: {
            point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 4,
              hoverBorderWidth: 3
            }
          }
        }
      });
}