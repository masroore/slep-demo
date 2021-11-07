$(function(){
    load_data()
    if (window.location.href.indexOf("menu_dashboard") != -1){
        //Superiores
        $('#option1').on('click', load_AllStats);
        $('#option2').on('click', load_SourceStats);
        $('#option3').on('click', load_SourceStats);
        $('#option4').on('click', load_SourceStats);
        $('#option5').on('click', load_SourceStats);
        //Inferiores
        $('#option6').on('click', load_AllStats);
        $('#option7').on('click', load_SourceStats);
        $('#option8').on('click', load_SourceStats);
        $('#option9').on('click', load_SourceStats);
        $('#option10').on('click', load_SourceStats);

        //Listener del select
        $('#canvas_filter').on('change', handler_grafico);
    }
    //$("#container-informe-lector").fadeIn(1000)
});

var data=[]
var dataFuentes=[]
var autores=[]
var cards=['#autores_card','#posteos_card','#interac_card','#viraliz_card','#alcance_card']
var footerCards = ['#twCard','#fbCard','#ytCard','#igCard']

var words= [];
var reduction=new Intl.NumberFormat('en-GB', { notation: "compact", compactDisplay: "short" }) //reductor de numeros en 1000 -> 1K

var currentSource=''
var currentFilter='interactions'

function load_totalCards(){
    document.getElementById("totalcards").textContent = '';
    var cards=[
        {
            colClass: 'col-md-4 col-lg col-sm-4',//'col-6 col-sm-4 col-lg-2'
            bgGradient: 'primary',
            xlinkHref : '../../assets/icons/coreui/free-symbol-defs.svg#cui-user-follow',
            title : 'Autores',
            idValue : 'autores_card'
        },
        {
            colClass: 'col-md-4 col-lg col-sm-4',//'col-6 col-sm-4 col-lg-2'
            bgGradient: 'info',
            xlinkHref : '../../assets/icons/coreui/free-symbol-defs.svg#cui-pencil',
            title : 'Posteos',
            idValue : 'posteos_card'
        },
        {
            colClass: 'col-md-4 col-lg col-sm-4',//'col-sm-8 col-lg-4',
            bgGradient: 'success',
            xlinkHref : '../../assets/icons/coreui/free-symbol-defs.svg#cui-chart-pie',
            title : 'Seguidores',
            idValue : 'alcance_card'
        },
        {
            colClass: 'col-md-6 col-lg col-sm-4',//'col-6 col-sm-4 col-lg-2'
            bgGradient: 'danger',
            xlinkHref : '../../assets/icons/coreui/free-symbol-defs.svg#cui-speech',
            title : 'Interacciones',
            idValue : 'interac_card'
        },
        {
            colClass: 'col-md-6 col-lg col-sm-4',//'col-6 col-sm-4 col-lg-2'
            bgGradient: 'warning',
            xlinkHref : '../../assets/icons/coreui/free-symbol-defs.svg#cui-cursor',
            title : 'Viralización',
            idValue : 'viraliz_card'
        }
    ]
    cards.map((item)=>{
        //Crear col
        var col = document.createElement('div')
        col.className = item.colClass
        var card = document.createElement('div')
            card.className = "card text-white bg-gradient-"+item.bgGradient
            var body = document.createElement('div')
                body.className = "card-body card-body d-flex justify-content-between align-items-start"
                var div = document.createElement('div')
                    var textValue = document.createElement('div')
                        textValue.className = "text-value-lg"
                        textValue.id = item.idValue
                        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
                            svg.setAttribute('class','c-icon text-white');
                            var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                                use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', item.xlinkHref);
                        svg.appendChild(use)
                        var div_2 = document.createElement('div')
                            $(div_2).append(item.title).css('margin-top', '5px')
                    $(textValue).append(svg,"\n0")
                $(div).append(textValue,div_2)
            body.appendChild(div)
        card.appendChild(body)
        col.appendChild(card)
        //Ingresar col dentro de totalcards
        document.getElementById("totalcards").appendChild(col);
    })
}
function load_footerCards(source){
    clearElements(footerCards)
    footerCards.map((card)=>{
        switch(card){
            case '#twCard':
                sourceUsers = dataFuentes[0].t_seguidores
                sourceColor = 'bg-twitter'
                sourceIcon = '../../assets/icons/brands/brands-symbol-defs.svg#twitter'
                source=='tw' ? focusedCard = 1: focusedCard = 0.5
                break
            case '#fbCard':
                sourceUsers = dataFuentes[3].t_seguidores
                sourceColor = 'bg-facebook'
                sourceIcon = '../../assets/icons/brands/brands-symbol-defs.svg#facebook-f'
                source=='fb' ? focusedCard = 1: focusedCard = 0.5
                break    
            case '#ytCard':
                sourceUsers = dataFuentes[1].t_seguidores
                sourceColor = 'bg-youtube'
                sourceIcon = '../../assets/icons/brands/brands-symbol-defs.svg#youtube'
                source=='yt' ? focusedCard = 1: focusedCard = 0.5
                break
            case '#igCard':
                sourceUsers = dataFuentes[4].t_seguidores
                sourceColor = 'bg-instagram'
                sourceIcon = '../../assets/icons/brands/brands-symbol-defs.svg#instagram'
                source=='ig' ? focusedCard = 1: focusedCard = 0.5
                break
        }
        source=='all'?focusedCard=1:null

        //console.log(focusedCard)
        porcentaje = (100*sourceUsers)/(data[data.length-1].seguidores)
        //Card Header
        var cardHeader = document.createElement('div')
            cardHeader.className = 'card-header '+sourceColor+' content-center'
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
                svg.setAttribute('class','c-icon c-icon-2xl text-white my-2');
                var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', sourceIcon);
            svg.appendChild(use)
        cardHeader.appendChild(svg)
        //Card Body
        var cardBody = document.createElement('div')
            cardBody.className = 'card-body'
            var strong = document.createElement('strong')
                strong.append(reduction.format(sourceUsers)+' Usuarios ('+Number.parseFloat(porcentaje).toFixed(1)+'%)')
            //Contenedor de la barra
            var progress_container = document.createElement('div')
                progress_container.className = 'progress progress-xs mt-1'
            //Barra de progreso
                var progress = document.createElement('div')
                    progress.className = 'progress-bar '+sourceColor
                    $(progress).attr({'role':'progressbar','aria-valuenow':porcentaje,'aria-valuemin':'0','aria-valuemax':'100'}).css({'width':porcentaje+'%'})
            progress_container.appendChild(progress)
        $(cardBody).append(strong,progress_container)

        $(card).append(cardHeader,cardBody).css({'filter':'brightness('+focusedCard+')'})
    })  
}
function handler_grafico(){
    currentFilter=$(this).val()
    load_grafico(currentSource,currentFilter)
}
function load_grafico(source,filter){

    //Limpiar grafico
    document.getElementById('graph-inside').innerHTML = `<canvas class="chart" id="graph-inter" height="300"></canvas>`
    
    tw_data_per_date = []
    yt_data_per_date = []
    fb_data_per_date = []
    ig_data_per_date = []

    fechas = [] //eje X

    _allCanvasData=[]

    //Obtengo arreglo con todas las fechas unicas de la busqueda
        data.map((o) => {o.tipoPagina!='Total' ? fechas.push((o.fecha)) : null})
        fechas2=Array.from(new Set(fechas)).sort() 
        //console.log(fechas)

    //Interacciones por pagina y datos del gráfico (valor maximo del eje Y / arreglo de opciones
        fechas2.map((f) => {
            //Variables de interacciones por origen
            tw_canvas_data = 0; yt_canvas_data = 0; fb_canvas_data = 0; ig_canvas_data = 0
            //Recorro data, dependiendo del tipo de pagina va sumando las interacciones por origen
            //Switch para detectar la seleccion (interacciones, viralizaciones o seguidores)
            switch(filter){
                case 'interactions':
                    data.map((o) => {
                        switch(o.tipoPagina){
                            case ('Twitter'):
                                f == o.fecha ? tw_canvas_data+=o.likes : null
                                break
                            case ('Youtube'):
                                f == o.fecha ? yt_canvas_data+=o.likes : null
                                break
                            case ('Facebook'):
                                f == o.fecha ? fb_canvas_data+=o.likes : null
                                break;
                            case ('Instagram'):
                                f == o.fecha ? ig_canvas_data+=o.likes : null
                                break;
                        }
                    })
                    break;
                case 'followers':
                    data.map((o) => {
                        switch(o.tipoPagina){
                            case ('Twitter'):
                                f == o.fecha ? tw_canvas_data+=o.seguidores : null
                                break
                            case ('Youtube'):
                                f == o.fecha ? yt_canvas_data+=o.seguidores : null
                                break
                            case ('Facebook'):
                                f == o.fecha ? fb_canvas_data+=o.seguidores : null
                                break;
                            case ('Instagram'):
                                f == o.fecha ? ig_canvas_data+=o.seguidores : null
                                break;
                        }
                    })
                    break;
                case 'viralization':
                    data.map((o) => {
                        switch(o.tipoPagina){
                            case ('Twitter'):
                                f == o.fecha ? tw_canvas_data+=o.viralizacion : null
                                break
                            case ('Youtube'):
                                f == o.fecha ? yt_canvas_data+=o.viralizacion : null
                                break
                            case ('Facebook'):
                                f == o.fecha ? fb_canvas_data+=o.viralizacion : null
                                break;
                            case ('Instagram'):
                                f == o.fecha ? ig_canvas_data+=o.viralizacion : null
                                break;
                        }
                    })
                    break;
            }
            
            //Lista con valores de interacciones de todos los origenes, con esto calculo  el valor maximo
            _allCanvasData.push(tw_canvas_data, yt_canvas_data,fb_canvas_data,ig_canvas_data)
            //Listas con interacciones por fecha
            tw_data_per_date.push(tw_canvas_data)
            yt_data_per_date.push(yt_canvas_data)
            fb_data_per_date.push(fb_canvas_data)
            ig_data_per_date.push(ig_canvas_data)
        })
        maxValue = Math.max.apply(Math, _allCanvasData)
        
        options = {
            maintainAspectRatio: false,
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                gridLines: {
                  drawOnChartArea: false
                },
                /*type: "time",
                time: {  
					unit: "day",
					displayFormats: {
                        day: "D"+ "/" +"MMM"
					}
				}*/
              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  maxTicksLimit: 5,
                  stepSize: Math.ceil(maxValue / 5),
                  max: maxValue
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

    //Cargar gráfico de interacciones por origen    
        switch(source){
            case 'all':
                entfernen = new Chart(document.getElementById('graph-inter'), {
                    type: 'line',
                    data: {
                      labels: fechas2,
                      datasets: [{
                        label: 'Twitter',
                        backgroundColor: coreui.Utils.hexToRgba('#00aced', 10),
                        borderColor: '#00aced',
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2,
                        data: tw_data_per_date
                      }, {
                        label: 'Youtube',
                        backgroundColor: coreui.Utils.hexToRgba('#b00', 10),
                        borderColor: '#b00',
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2,
                        data:  yt_data_per_date
                      }, {
                        label: 'Facebook',
                        backgroundColor: coreui.Utils.hexToRgba('#3b5998', 10),
                        borderColor: '#3b5998',
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2,
                        //borderDash: [8, 5],
                        data: fb_data_per_date
                      }, {
                        label: 'Instagram',
                        backgroundColor: coreui.Utils.hexToRgba('#3b9098', 10),
                        borderColor: '#3b9098',
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2,
                        //borderDash: [8, 5],
                        data: ig_data_per_date
                      }]
                    },
                    options: options
                });
                break
            case 'tw':
                new Chart(document.getElementById('graph-inter'), {
                    type: 'line',
                    data: {
                      labels: fechas2,
                      datasets: [{
                        label: 'Twitter',
                        backgroundColor: coreui.Utils.hexToRgba('#00aced', 10),
                        borderColor: '#00aced',
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2,
                        data: tw_data_per_date
                      }]
                    },
                    options: options
                });
                break
            case 'yt':
                new Chart(document.getElementById('graph-inter'), {
                    type: 'line',
                    data: {
                      labels: fechas2,
                      datasets: [{
                        label: 'Youtube',
                        backgroundColor: coreui.Utils.hexToRgba('#b00', 10),
                        borderColor: '#b00',
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2,
                        data:  yt_data_per_date
                      }]
                    },
                    options: options
                });
                break
            case 'fb':
                new Chart(document.getElementById('graph-inter'), {
                    type: 'line',
                    data: {
                      labels: fechas2,
                      datasets: [{
                        label: 'Facebook',
                        backgroundColor: coreui.Utils.hexToRgba('#3b5998', 10),
                        borderColor: '#3b5998',
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2,
                        //borderDash: [8, 5],
                        data: fb_data_per_date
                      }]
                    },
                    options: options
                });
                break
            case 'ig':
                new Chart(document.getElementById('graph-inter'), {
                    type: 'line',
                    data: {
                        labels: fechas2,
                        datasets: [{
                        label: 'Instagram',
                        backgroundColor: coreui.Utils.hexToRgba('#3b9098', 10),
                        borderColor: '#3b9098',
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2,
                        //borderDash: [8, 5],
                        data: ig_data_per_date
                        }]
                    },
                    options: options
                });
                break
        }
}
function load_datatable_autores(source){
//PRIMERA TABLA
    let table_data = []
    switch(source){
        case 'all':
            data.map((o=>{
                o.tipoPagina != 'Google News' && o.tipoPagina != 'Total' ? (table_data.push(o)) : null
            }))
            break;
        case 'tw':
            data.map((o=>{
                o.tipoPagina == 'Twitter' ? (table_data.push(o)) : null
            }))
            break;
        case 'yt':
            data.map((o=>{
                o.tipoPagina == 'Youtube' ? (table_data.push(o)) : null
            }))
            break;
        case 'fb':
            data.map((o=>{
                o.tipoPagina == 'Facebook' ? (table_data.push(o)) : null
            }))
            break;
        case 'ig':
            data.map((o=>{
                o.tipoPagina == 'Instagram' ? (table_data.push(o)) : null
            }))
            break;
    }

    table1=$('#table_autores').DataTable({
        destroy: true,
        responsive: true,

        paging: true, //pagingLenght -1 es mostrar todo en la misma pagina
        pageLength: 3,
        lengthMenu: [ 3, 5, 10, 25, 50, 75, 100 ],

        language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
        searching: true,
        info: true,
        data: table_data,
        autoWidth: false,
        columns: [
            //Autor
            {
                title: "Autor", 
                data: "autor",
                width: '20%',
                render: function(data,type,full,meta){
                    return '<div>'+data+'</div><div class="small text-muted"><svg class="c-icon mx-1"><use xlink:href="../../assets/icons/coreui/free-symbol-defs.svg#cui-calendar"></use></svg>'+date_to_format_slash(full.fecha)+'</div>'
                }
            },
            //Posteo
            {
                title: "Posteo", 
                data: "mensaje",
                width: '30%',
                render: function(data,type,full,meta){
                    return '<small class="text-muted">'+data
                }
            },
             //Seguidores formatNumberSeparator(
             {
                title: "Seguidores", 
                data: "seguidores",
                render: {
                    _:function(data,type,full,meta){
                        return  formatNumberSeparator(data)
                    },
                    sort: function(data,type,full,meta){
                        return data
                    }
                }
            },
            //Interacciones
            {
                title: "Interacciones", 
                data: "likes",
                render: {
                    _:function(data,type,full,meta){
                        return  formatNumberSeparator(data)
                    },
                    sort: function(data,type,full,meta){
                        return data
                    }
                }
            },
            //Viralización
            {
                title: "Viralización", 
                data: "viralizacion",
                render: {
                    _:function(data,type,full,meta){
                        return  formatNumberSeparator(data)
                    },
                    sort: function(data,type,full,meta){
                        return data
                    }
                }
            },
            //Ir
            {
                title: "Ir", 
                data: "tipoPagina",
                render: function (data, type, full, meta) {
                    switch(data){
                        case 'Youtube': return '<a class="btn btn-sm btn-youtube" href="'+full.linkPost+'" target="_blank"><svg class="c-icon"><use xlink:href="../../assets/icons/brands/brands-symbol-defs.svg#youtube">'; break;
                        case 'Twitter': return '<a class="btn btn-sm btn-twitter" href="'+full.linkPost+'" target="_blank"><svg class="c-icon"><use xlink:href="../../assets/icons/brands/brands-symbol-defs.svg#twitter">'; break;
                        case 'Facebook': return '<a class="btn btn-sm btn-facebook" href="'+full.linkPost+'" target="_blank"><svg class="c-icon"><use xlink:href="../../assets/icons/brands/brands-symbol-defs.svg#facebook-f">'; break;
                        case 'Instagram': return '<a class="btn btn-sm btn-instagram" href="'+full.linkPost+'" target="_blank"><svg class="c-icon"><use xlink:href="../../assets/icons/brands/brands-symbol-defs.svg#instagram">'; break;
                        
                        case 'Google News': return '<center><i class="cib-google"></i></center>'; break;
                        case 'Total': return data; break;
                    }
                }
            },
        ],
        "order": [[ 4, "desc" ]],                  
    })

//SEGUNDA TABLA

    let table2_elements_raw=[]
    
    autores.map((autor=>{
        if(autor.origen!='gn'){
            let o = {autor:'',origen:'',seguidores:0,interaccion:0,viralizacion:0,link:'',n_posts:0}
            table_data.map((post=>{
                post.autor == autor.autor ? (
                    o.autor=autor.autor,
                    o.origen=autor.origen,
                    o.seguidores=post.seguidores,
                    o.interaccion+=post.likes,
                    o.viralizacion+=post.viralizacion,
                    o.link=post.linkAutor,
                    o.n_posts++
                ) : null
            }))
            table2_elements_raw.push(o)
        }
    }))

    let maxSeguidores=[]
    let maxLikes=[]
    let maxViralizaciones=[]
    
    let table2_elements=[]
    switch(source){
        case 'all':
            table2_elements_raw.map((o=>{
                table2_elements.push(o)
                maxSeguidores.push(o.seguidores)
                maxLikes.push(o.interaccion)
                maxViralizaciones.push(o.viralizacion)
            }))
            break;
        case 'tw':
            table2_elements_raw.map((o=>{
                o.origen == 'tw' ? (
                    table2_elements.push(o),
                    maxSeguidores.push(o.seguidores),
                    maxLikes.push(o.interaccion),
                    maxViralizaciones.push(o.viralizacion)) : null
            }))
            break;
        case 'yt':
            table2_elements_raw.map((o=>{
                o.origen == 'yt' ? (
                    table2_elements.push(o),
                    maxSeguidores.push(o.seguidores),
                    maxLikes.push(o.interaccion),
                    maxViralizaciones.push(o.viralizacion)) : null
            }))
            break;
        case 'fb':
            table2_elements_raw.map((o=>{
                o.origen == 'fb' ? (
                    table2_elements.push(o),
                    maxSeguidores.push(o.seguidores),
                    maxLikes.push(o.interaccion),
                    maxViralizaciones.push(o.viralizacion)) : null
            }))
            break;
        case 'ig':
            table2_elements_raw.map((o=>{
                o.origen == 'ig' ? (
                    table2_elements.push(o),
                    maxSeguidores.push(o.seguidores),
                    maxLikes.push(o.interaccion),
                    maxViralizaciones.push(o.viralizacion)) : null
            }))
            break;
    }

    let cien_porciento_source = {
        t_seguidores : Math.max(...maxSeguidores),
        t_likes : Math.max(...maxLikes),
        t_viralizacion : Math.max(...maxViralizaciones)
    }
    //console.log(table_data)
    table2=$('#table_comunidad_x_interaccion_x_viralizacion').DataTable({
        destroy: true,
        responsive: true,

        scrollY:        '40vh',
        scrollCollapse: true,
        paging:         false,

        language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
        searching: true,
        info: false,
        data: table2_elements,
        autoWidth: false,
        columns: [
            //Autor
            {
                title: "Autor", 
                data: "autor",
                width: '40%',
                render: {
                    _:function(data,type,full,meta){
                        return '<small>'+data+' ('+full.n_posts+') '+'<a href="'+full.link+'" target="_blank"><svg class="c-icon"><use xlink:href="../../assets/icons/coreui/free-symbol-defs.svg#cui-external-link">'
                    },
                    sort: function(data,type,full,meta){
                        return full.n_posts
                    }
                }
            },
            //Comunidad Interaccion Alcance
            {
                title: '<span class="badge badge-success">Seguidores</span>  <span class="badge badge-danger">Interacción</span>  <span class="badge badge-warning">Viralización</span>  ',
                data : "viralizacion",
                width: '60%',
                //"@data-order": "viralizacion",
                render: {
                    _:function(datav,type,full,meta){
                    return  '<div class="progress mb-1"><div class="progress-bar bg-success" role="progressbar"style="width: '+(100*(full.seguidores))/(cien_porciento_source.t_seguidores)+'%;"aria-valuemin="0" aria-valuemax="100">'+formatNumberSeparator(full.seguidores)+'</div></div>'+
                            '<div class="progress mb-1"><div class="progress-bar bg-danger" role="progressbar"style="width: '+(100*(full.interaccion))/(cien_porciento_source.t_likes)+'%;"aria-valuemin="0"aria-valuemax="100">'+formatNumberSeparator(full.interaccion)+'</div></div>'+
                            '<div class="progress"><div class="progress-bar bg-warning" role="progressbar"style="width: '+(100*(datav))/(cien_porciento_source.t_viralizacion)+'%;" aria-valuemin="0"aria-valuemax="100">'+formatNumberSeparator(datav)+'</div></div>'
                    },
                    sort: function(datav,type,full,meta){
                        return datav
                    }
                }
            }
        ]  ,

        "order": [[ 1, "desc" ]],
        columnDefs: [
            {type:Number, targets: [0]}
        ],  

        "initComplete": function(settings, json) {
            $('body').find('.dataTables_scrollBody').addClass("scrollbar");
            $('#table_comunidad_x_interaccion_x_viralizacion tbody').on('click', 'td', function () {
                var tr = $(this).closest('tr');
                var row = table2.row( tr );
                //console.log(row.data().autor);
                table1.search( row.data().autor ).draw();
            } );
        },                 
    })
    
}
function load_words_cloud(source){
    words=[]
    data.map((o=>{
        source=='all'?stringToWordsToWordsArray(o.mensaje):null
        source=='tw'?(
            o.tipoPagina=='Twitter'?stringToWordsToWordsArray(o.mensaje):null):null
        source=='yt'?(
            o.tipoPagina=='Youtube'?stringToWordsToWordsArray(o.mensaje):null):null
        source=='fb'?(
            o.tipoPagina=='Facebook'?stringToWordsToWordsArray(o.mensaje):null):null
        source=='ig'?(
            o.tipoPagina=='Instagram'?stringToWordsToWordsArray(o.mensaje):null):null
    }))
    wordsTEST(words);
}

function load_AllStats(){
    currentSource='all'
    valueButton = 0
    $(this)[0].id === undefined?valueButton=1:valueButton=parseInt(($(this)[0].id)[($(this)[0].id).length-1])
    valueButton>5 ? valueButton=valueButton-5:null
    console.log(valueButton,'all')
    load_grafico('all',currentFilter)
    if (window.location.href.indexOf("menu_dashboard") != -1){load_footerCards('all')}
    if (window.location.href.indexOf("menu_dashboard") != -1){load_datatable_autores('all')}
    load_words_cloud('all')

    if (window.location.href.indexOf("menu_dashboard") != -1){setSourceButtons(valueButton)}
    if (window.location.href.indexOf("menu_dashboard") != -1){removeValues(cards)}
    
    $('#autores_card').append("\n"+reduction.format(autores.length))
    $('#posteos_card').append("\n"+reduction.format(data.length-1))
    $('#interac_card').append("\n"+reduction.format(data[data.length-1].likes))
    $('#viraliz_card').append("\n"+reduction.format(data[data.length-1].viralizacion))
    $('#alcance_card').append("\n"+reduction.format(data[data.length-1].seguidores))
}
function load_SourceStats(){
    valueButton=parseInt(($(this)[0].id).replace('option',''));
    valueButton>5 ? valueButton=valueButton-5:null
    _autores=0
    df_index = -1

    switch(valueButton){
        case 2:
            source = 'tw'
            df_index = 0
            break
        case 3:
            source = 'yt'
            df_index = 1
            break
        case 4:
            source = 'fb'
            df_index = 3
            break
        case 5:
            source = 'ig'
            df_index = 4
            break
    }
    currentSource=source
    console.log(valueButton,source)
    load_grafico(source,currentFilter)
    load_footerCards(source)
    load_datatable_autores(source)
    load_words_cloud(source)

    setSourceButtons(valueButton)
    removeValues(cards)
    autores.map((autor)=>{autor.origen==source ? _autores++ : null})
    $('#autores_card').append("\n"+reduction.format(_autores))
    $('#posteos_card').append("\n"+reduction.format(dataFuentes[df_index].t_resultados))
    $('#interac_card').append("\n"+reduction.format(dataFuentes[df_index].t_likes))
    $('#viraliz_card').append("\n"+reduction.format(dataFuentes[df_index].t_viralizacion))
    $('#alcance_card').append("\n"+reduction.format(dataFuentes[df_index].t_seguidores))
}

function setSourceButtons(id){
    Object.values([1,2,3,4,5,6,7,8,9,10]).forEach(function callback(option){
        if(option==id || option==id+5){
            //console.log('Pressed',option)
            document.getElementById("option"+(option)).setAttribute("class","btn btn-outline-secondary active")
        }else{
            document.getElementById("option"+(option)).setAttribute("class","btn btn-outline-secondary")
        }
    })
}
function removeValues(values){
    Object.values(values).forEach(function callback(item){
        //Limpiar texto de un elemento
        $(item).contents().filter(function(){
            return (this.nodeType == 3);
        }).remove();
    })
}
function clearElements(values){
    values.map((e)=>{
        $(e).contents().remove();
    })
}

function date_to_format_slash(string){
    formatted = string.split('-')
    return formatted[2]+'/'+formatted[1]+'/'+formatted[0]
}

function load_data(){
    showLoading();
    var autoresStr = []
    var allData=[]
    var datos_fuentes = [];
    var nResults=0
    //Totales Twitter
        var total_seguidores_twitter = 0;
        var total_likes_twitter = 0;
        var total_viralizacion_twitter = 0;
        var total_resultados_twitter = 0;
    //Totales YT
        var total_seguidores_youtube = 0;
        var total_likes_youtube = 0;
        var total_viralizacion_youtube = 0;
        var total_resultados_youtube = 0;
    //Totales GN
        var total_seguidores_google_news = 0;
        var total_likes_google_news = 0;
        var total_viralizacion_google_news = 0;
        var total_resultados_google_news = 0;
    //TotalesFB
        var total_seguidores_fb = 0;
        var total_likes_fb = 0;
        var total_viralizacion_fb = 0;
        var total_resultados_fb = 0;
    //TotalesIG
        var total_seguidores_ig = 0;
        var total_likes_ig = 0;
        var total_viralizacion_ig = 0;
        var total_resultados_ig = 0;
    if(original_data[0].nombre_campania){
        //Es una campaña
        var idCampaña = original_data[0].id
        if (window.location.href.indexOf("menu_dashboard") != -1){load_totalCards()}


        var url_request='../campañas/'
        if(window.location.href.indexOf("informe") != -1){
            url_request='../campañas/'
        }
        $.get(url_request+idCampaña+'/posts').done(function(posts) {
            $.get(url_request+idCampaña+'/videos').done(function(videos) {
                $.get(url_request+idCampaña+'/facebookposts').done(function(fbposts) {
                    $.get(url_request+idCampaña+'/instagramposts').done(function(igposts) {
                        posts.map((post)=>{
                            allData.push({
                                n: nResults+1, 
                                tipoPagina: "Twitter", 
                                linkPost: "https://www.twitter.com/"+post.usuario+"/status/"+post.id_tweet,
                                linkAutor: "https://www.twitter.com/"+post.usuario,
                                fecha: date_and_time(new Date((post.fecha_creacion).replaceAll('-','/')))[0],
                                hora:date_and_time(new Date((post.fecha_creacion).replaceAll('-','/')))[1], 
                                seguidores: parseInt(post.followers),
                                likes: parseInt(post.fav),
                                viralizacion: parseInt(post.rt),
                                img: post.url_imagen,
                                mensaje: post.tweet,
                                autor: post.usuario,
                                impacto: getIndiceImpacto(parseInt(post.followers),parseInt(post.fav),parseInt(post.rt)),
                                idBusqueda: post.busqueda_id
                            })
                            autoresStr.push({autor:post.usuario,origen:"tw"})
                            //console.log('Dato '+allData.length+' Twitter')
                            //stringToWordsToWordsArray(post.tweet)
                            total_seguidores_twitter+=parseInt(post.followers)
                            total_likes_twitter+=parseInt(post.fav)
                            total_viralizacion_twitter+=parseInt(post.rt)
                            total_resultados_twitter++
                            nResults++
                        })
                        videos.map((video)=>{
                            video.id_channel==''?link_channel="https://www.youtube.com/results?search_query="+video.channel_name:link_channel="https://www.youtube.com/channel/"+video.id_channel
                            allData.push({
                                n: nResults+1, 
                                tipoPagina: "Youtube", 
                                linkPost: "https://www.youtube.com/watch?v="+video.id_video,
                                linkAutor: link_channel,
                                fecha: date_and_time(new Date((video.upload_date).replaceAll('-','/')))[0],
                                hora:date_and_time(new Date((video.upload_date).replaceAll('-','/')))[1], 
                                seguidores: parseInt(video.channel_subs),
                                likes: parseInt(video.likes),
                                viralizacion: parseInt(video.views),
                                img: video.url_imagen,
                                mensaje: video.description,
                                autor: video.channel_name,
                                impacto: getIndiceImpacto(parseInt(video.channel_subs),parseInt(video.likes),parseInt(video.views)),
                                idBusqueda: video.busqueda_id
                            })
                            autoresStr.push({autor:video.channel_name,origen:"yt"})
                            //console.log('Dato '+allData.length+' Youtube')
                            //stringToWordsToWordsArray(video.description)
                            total_seguidores_youtube+=parseInt(video.channel_subs)
                            total_likes_youtube+=parseInt(video.likes)
                            total_viralizacion_youtube+=parseInt(video.views)
                            total_resultados_youtube++
                            nResults++
                        })
                        fbposts.map((fbpost)=>{
                            allData.push({
                                n: nResults+1, 
                                tipoPagina: "Facebook", 
                                linkPost: fbpost.url,
                                linkAutor: fbpost.autor_url,
                                fecha: date_and_time(new Date((fbpost.date).replaceAll('-','/')))[0],
                                hora:date_and_time(new Date((fbpost.date).replaceAll('-','/')))[1],
                                seguidores: parseInt(fbpost.followers),
                                likes: parseInt(fbpost.likes),
                                viralizacion: parseInt(fbpost.shares)+parseInt(fbpost.comments),
                                img: fbpost.image_url,
                                mensaje: fbpost.message,
                                autor: fbpost.autor,
                                impacto: getIndiceImpacto(parseInt(fbpost.followers),parseInt(fbpost.likes),(parseInt(fbpost.shares)+parseInt(fbpost.comments))),
                                idBusqueda: fbpost.busqueda_id
                            })
                            autoresStr.push({autor:fbpost.autor,origen:"fb"})
                            //console.log('Dato '+allData.length+' Facebook')
                            //stringToWordsToWordsArray(fbpost.description)
                            total_seguidores_fb+=parseInt(fbpost.followers)
                            total_likes_fb+=parseInt(fbpost.likes)
                            total_viralizacion_fb+=parseInt(fbpost.shares)+parseInt(fbpost.comments)
                            total_resultados_fb++
                            nResults++
                        })
                        igposts.map((igpost)=>{
                            allData.push({
                                n: nResults+1, 
                                tipoPagina: "Instagram", 
                                linkPost: igpost.url,
                                linkAutor: igpost.autor_url,
                                fecha: date_and_time(new Date((igpost.date).replaceAll('-','/')))[0],
                                hora:date_and_time(new Date((igpost.date).replaceAll('-','/')))[1],
                                seguidores: parseInt(igpost.followers),
                                likes: parseInt(igpost.likes),
                                viralizacion: parseInt(igpost.shares),
                                img: igpost.image_url,
                                mensaje: igpost.message,
                                autor: igpost.autor,
                                impacto: getIndiceImpacto(parseInt(igpost.followers),parseInt(igpost.likes),parseInt(igpost.shares)),
                                idBusqueda: igpost.busqueda_id
                            })
                            autoresStr.push({autor:igpost.autor,origen:"ig"})
                            total_seguidores_ig+=parseInt(igpost.followers)
                            total_likes_ig+=parseInt(igpost.likes)
                            total_viralizacion_ig+=parseInt(igpost.shares)
                            total_resultados_ig++
                            nResults++
                        })
                        const autoresUnicos = [...new Set(autoresStr.map((o) => JSON.stringify(o))),].map((string) => JSON.parse(string))

                        $('#totalPosts').val(nResults);
                        //Totales en la ultima fila
                        allData.push({
                            n: nResults,
                            tipoPagina: 'Total', 
                            linkPost: '',
                            linkAutor: '',
                            fecha: '', 
                            hora: '',
                            seguidores: total_seguidores_twitter+total_seguidores_youtube+total_seguidores_google_news+total_seguidores_fb+total_seguidores_ig,
                            likes: total_likes_twitter+total_likes_youtube+total_likes_google_news+total_likes_fb+total_likes_ig,
                            viralizacion: total_viralizacion_twitter+total_viralizacion_youtube+total_viralizacion_google_news+total_viralizacion_fb+total_viralizacion_ig,
                            img: '',
                            mensaje: '',
                            autor: '',
                            impacto: 0        
                        })
                        datos_fuentes.push(
                            {
                                fuente: 'Twitter', 
                                t_resultados: total_resultados_twitter,
                                t_seguidores: total_seguidores_twitter, 
                                t_likes: total_likes_twitter,
                                t_viralizacion: total_viralizacion_twitter,
                            },
                            {
                                fuente: 'Youtube', 
                                t_resultados: total_resultados_youtube,
                                t_seguidores: total_seguidores_youtube, 
                                t_likes: total_likes_youtube,
                                t_viralizacion: total_viralizacion_youtube,
                            },
                            {
                                fuente: 'Google News', 
                                t_resultados: total_resultados_google_news,
                                t_seguidores: total_seguidores_google_news, 
                                t_likes: total_likes_google_news,
                                t_viralizacion: total_viralizacion_google_news,
                            },
                            {
                                fuente: 'Facebook', 
                                t_resultados: total_resultados_fb,
                                t_seguidores: total_seguidores_fb, 
                                t_likes: total_likes_fb,
                                t_viralizacion: total_viralizacion_fb,
                            },
                            {
                                fuente: 'Instagram', 
                                t_resultados: total_resultados_ig,
                                t_seguidores: total_seguidores_ig, 
                                t_likes: total_likes_ig,
                                t_viralizacion: total_viralizacion_ig,
                            }
                        )
                        data=allData
                        dataFuentes=datos_fuentes
                        autores=autoresUnicos
                        
                        if (window.location.href.indexOf("informe") != -1){dataToInforme()}
                        if (window.location.href.indexOf("informe") == -1){load_AllStats()}
                        hideLoading() 
                    })
                })
            })
        })

    }else{
        //Es una busqueda
        var idBusqueda = original_data[0].id
        load_totalCards()
        $.get('../consulta_resultados/'+idBusqueda+'/detalles', function(detalles){
            

            var fechaBusquedaOriginal = new Date(detalles[0].created_at);  
            var createdAt = date_and_time(fechaBusquedaOriginal);

            fechaBusqueda = new Date(detalles[0].updated_at);   
            var updatedAt = date_and_time(fechaBusqueda);

            $('#fechaBusqueda').val(createdAt[0]);
                fechaDeLaBusqueda=createdAt[0]; //Nombre del Excel
            $('#horaBusqueda').val(updatedAt[1]);
            $('#fechaRangoDesde').val(detalles[0].fecha_inicial_original);
                fechaMenor = detalles[0].fecha_inicial;
                fechaMenorOriginal = detalles[0].fecha_inicial_original;
            $('#fechaRangoHasta').val(detalles[0].fecha_final);
                fechaMayor = detalles[0].fecha_final;

            palabraClave = detalles[0].palabra_busqueda;

            nombreDeLaBusqueda = detalles[0].nombre_busqueda; //Nombre del Excel
            idCampaña = detalles[0].campania_id;
            $('#totalPosts').val(0);
        })
        $.get('../consulta_resultados/'+idBusqueda+'/posts').done(function(posts){
            $.get('../consulta_resultados/'+idBusqueda+'/videos').done(function(videos){
                $.get('../consulta_resultados/'+idBusqueda+'/facebookposts').done(function(fbposts){
                    $.get('../consulta_resultados/'+idBusqueda+'/instagramposts').done(function(igposts){
                        //console.log(posts)
                        posts.map((post)=>{
                            allData.push({
                                n: nResults+1, 
                                tipoPagina: "Twitter", 
                                linkPost: "https://www.twitter.com/"+post.usuario+"/status/"+post.id_tweet,
                                linkAutor: "https://www.twitter.com/"+post.usuario,
                                fecha: date_and_time(new Date(((post.fecha_creacion).replaceAll('-','/')).replaceAll('-','/')))[0],
                                hora:date_and_time(new Date(((post.fecha_creacion).replaceAll('-','/')).replaceAll('-','/')))[1], 
                                seguidores: parseInt(post.followers),
                                likes: parseInt(post.fav),
                                viralizacion: parseInt(post.rt),
                                img: post.url_imagen,
                                mensaje: post.tweet,
                                autor: post.usuario,
                                impacto: getIndiceImpacto(parseInt(post.followers),parseInt(post.fav),parseInt(post.rt))
                            })
                            autoresStr.push({autor:post.usuario,origen:"tw"})
                            //console.log('Dato '+allData.length+' Twitter')
                            //stringToWordsToWordsArray(post.tweet)
                            total_seguidores_twitter+=parseInt(post.followers)
                            total_likes_twitter+=parseInt(post.fav)
                            total_viralizacion_twitter+=parseInt(post.rt)
                            total_resultados_twitter++
                            nResults++
                        })
                        videos.map((video)=>{
                            video.id_channel==''?link_channel="https://www.youtube.com/results?search_query="+video.channel_name:link_channel="https://www.youtube.com/channel/"+video.id_channel
                            allData.push({
                                n: nResults+1, 
                                tipoPagina: "Youtube", 
                                linkPost: "https://www.youtube.com/watch?v="+video.id_video,
                                linkAutor: link_channel,
                                fecha: date_and_time(new Date((video.upload_date).replaceAll('-','/')))[0],
                                hora:date_and_time(new Date((video.upload_date).replaceAll('-','/')))[1], 
                                seguidores: parseInt(video.channel_subs),
                                likes: parseInt(video.likes),
                                viralizacion: parseInt(video.views),
                                img: video.url_imagen,
                                mensaje: video.description,
                                autor: video.channel_name,
                                impacto: getIndiceImpacto(parseInt(video.channel_subs),parseInt(video.likes),parseInt(video.views))
                            })
                            autoresStr.push({autor:video.channel_name,origen:"yt"})
                            //console.log('Dato '+allData.length+' Youtube')
                            //stringToWordsToWordsArray(video.description)
                            total_seguidores_youtube+=parseInt(video.channel_subs)
                            total_likes_youtube+=parseInt(video.likes)
                            total_viralizacion_youtube+=parseInt(video.views)
                            total_resultados_youtube++
                            nResults++
                        })
                        fbposts.map((fbpost)=>{
                            allData.push({
                                n: nResults+1, 
                                tipoPagina: "Facebook", 
                                linkPost: fbpost.url,
                                linkAutor: fbpost.autor_url,
                                fecha: date_and_time(new Date((fbpost.date).replaceAll('-','/')))[0],
                                hora:date_and_time(new Date((fbpost.date).replaceAll('-','/')))[1],
                                seguidores: parseInt(fbpost.followers),
                                likes: parseInt(fbpost.likes),
                                viralizacion: parseInt(fbpost.shares)+parseInt(fbpost.comments),
                                img: fbpost.image_url,
                                mensaje: fbpost.message,
                                autor: fbpost.autor,
                                impacto: getIndiceImpacto(parseInt(fbpost.followers),parseInt(fbpost.likes),(parseInt(fbpost.shares)+parseInt(fbpost.comments)))
                            })
                            autoresStr.push({autor:fbpost.autor,origen:"fb"})
                            //console.log('Dato '+allData.length+' Facebook')
                            //stringToWordsToWordsArray(fbpost.description)
                            total_seguidores_fb+=parseInt(fbpost.followers)
                            total_likes_fb+=parseInt(fbpost.likes)
                            total_viralizacion_fb+=parseInt(fbpost.shares)+parseInt(fbpost.comments)
                            total_resultados_fb++
                            nResults++
                        })
                        igposts.map((igpost)=>{
                            allData.push({
                                n: nResults+1, 
                                tipoPagina: "Instagram", 
                                linkPost: igpost.url,
                                linkAutor: igpost.autor_url,
                                fecha: date_and_time(new Date((igpost.date).replaceAll('-','/')))[0],
                                hora:date_and_time(new Date((igpost.date).replaceAll('-','/')))[1],
                                seguidores: parseInt(igpost.followers),
                                likes: parseInt(igpost.likes),
                                viralizacion: parseInt(igpost.shares),
                                img: igpost.image_url,
                                mensaje: igpost.message,
                                autor: igpost.autor,
                                impacto: getIndiceImpacto(parseInt(igpost.followers),parseInt(igpost.likes),parseInt(igpost.shares))
                            })
                            autoresStr.push({autor:igpost.autor,origen:"ig"})
                            total_seguidores_ig+=parseInt(igpost.followers)
                            total_likes_ig+=parseInt(igpost.likes)
                            total_viralizacion_ig+=parseInt(igpost.shares)
                            total_resultados_ig++
                            nResults++
                        })
                        const autoresUnicos = [...new Set(autoresStr.map((o) => JSON.stringify(o))),].map((string) => JSON.parse(string))

                        $('#totalPosts').val(nResults);
                        //Totales en la ultima fila
                        allData.push({
                            n: nResults,
                            tipoPagina: 'Total', 
                            linkPost: '',
                            linkAutor: '',
                            fecha: '', 
                            hora: '',
                            seguidores: total_seguidores_twitter+total_seguidores_youtube+total_seguidores_google_news+total_seguidores_fb+total_seguidores_ig,
                            likes: total_likes_twitter+total_likes_youtube+total_likes_google_news+total_likes_fb+total_likes_ig,
                            viralizacion: total_viralizacion_twitter+total_viralizacion_youtube+total_viralizacion_google_news+total_viralizacion_fb+total_viralizacion_ig,
                            img: '',
                            mensaje: '',
                            autor: '',
                            impacto: 0        
                        })
                        datos_fuentes.push(
                            {
                                fuente: 'Twitter', 
                                t_resultados: total_resultados_twitter,
                                t_seguidores: total_seguidores_twitter, 
                                t_likes: total_likes_twitter,
                                t_viralizacion: total_viralizacion_twitter,
                            },
                            {
                                fuente: 'Youtube', 
                                t_resultados: total_resultados_youtube,
                                t_seguidores: total_seguidores_youtube, 
                                t_likes: total_likes_youtube,
                                t_viralizacion: total_viralizacion_youtube,
                            },
                            {
                                fuente: 'Google News', 
                                t_resultados: total_resultados_google_news,
                                t_seguidores: total_seguidores_google_news, 
                                t_likes: total_likes_google_news,
                                t_viralizacion: total_viralizacion_google_news,
                            },
                            {
                                fuente: 'Facebook', 
                                t_resultados: total_resultados_fb,
                                t_seguidores: total_seguidores_fb, 
                                t_likes: total_likes_fb,
                                t_viralizacion: total_viralizacion_fb,
                            },
                            {
                                fuente: 'Instagram', 
                                t_resultados: total_resultados_ig,
                                t_seguidores: total_seguidores_ig, 
                                t_likes: total_likes_ig,
                                t_viralizacion: total_viralizacion_ig,
                            }
                        )
                        data=allData
                        dataFuentes=datos_fuentes
                        autores=autoresUnicos
                        
                        if (window.location.href.indexOf("informe") != -1){dataToInforme()}
                        if (window.location.href.indexOf("informe") == -1){load_AllStats()}

                        hideLoading() 
                    })
                })
            })
        })
    }
}