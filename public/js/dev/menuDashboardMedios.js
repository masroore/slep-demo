$(function(){
    load_data()
});

var data=[]
var dataFuentes=[]
var autores=[]
var cards=['#autores_card','#posteos_card']

var words= [];
var reduction=new Intl.NumberFormat('en-GB', { notation: "compact", compactDisplay: "short" }) //reductor de numeros en 1000 -> 1K

function load_totalCards(){
    document.getElementById("totalcards").textContent = '';
    var cards=[
        {
            colClass: 'col-md-6 col-lg-6 col-sm-6',//'col-6 col-sm-4 col-lg-2'
            bgGradient: 'primary',
            xlinkHref : '../../assets/icons/coreui/free-symbol-defs.svg#cui-user-follow',
            title : 'Autores',
            idValue : 'autores_card'
        },
        {
            colClass: 'col-md-6 col-lg-6 col-sm-6',//'col-6 col-sm-4 col-lg-2'
            bgGradient: 'info',
            xlinkHref : '../../assets/icons/coreui/free-symbol-defs.svg#cui-pencil',
            title : 'Posteos',
            idValue : 'posteos_card'
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

function load_datatable_autores(source){
//PRIMERA TABLA
    let table_data = []
    data.map((o=>{
        o.tipoPagina == 'Google News' && o.tipoPagina != 'Total' ? (table_data.push(o)) : null
    }))

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
                width: '70%',
                render: function(data,type,full,meta){
                    return '<small class="text-muted">'+data
                }
            },
            //Ir
            {
                title: "Ir", 
                data: "tipoPagina",
                className: "text-center",
                render: function (data, type, full, meta) {
                    switch(data){
                        case 'Youtube': return '<a class="btn btn-sm btn-youtube" href="'+full.linkPost+'" target="_blank"><svg class="c-icon"><use xlink:href="../../assets/icons/brands/brands-symbol-defs.svg#youtube">'; break;
                        case 'Twitter': return '<a class="btn btn-sm btn-twitter" href="'+full.linkPost+'" target="_blank"><svg class="c-icon"><use xlink:href="../../assets/icons/brands/brands-symbol-defs.svg#twitter">'; break;
                        case 'Facebook': return '<a class="btn btn-sm btn-facebook" href="'+full.linkPost+'" target="_blank"><svg class="c-icon"><use xlink:href="../../assets/icons/brands/brands-symbol-defs.svg#facebook-f">'; break;
                        case 'Instagram': return '<a class="btn btn-sm btn-instagram" href="'+full.linkPost+'" target="_blank"><svg class="c-icon"><use xlink:href="../../assets/icons/brands/brands-symbol-defs.svg#instagram">'; break;
                        
                        case 'Google News': return '<a class="btn btn-sm btn-primary" href="'+full.linkPost+'" target="_blank"><svg class="c-icon"><use xlink:href="../../assets/icons/brands/brands-symbol-defs.svg#google">'; break;
                        case 'Total': return data; break;
                    }
                }
            },
        ],
        order: [],
        columnDefs: [
            {orderable: false, targets: [2]}
        ],                 
    })

//SEGUNDA TABLA

    let table2_elements_raw=[]
    
    autores.map((autor=>{
        if(autor.origen=='gn'){
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
    
 
    table2_elements_raw.map((o=>{
        o.origen == 'gn' ? (
            table2_elements.push(o),
            maxSeguidores.push(o.seguidores),
            maxLikes.push(o.interaccion),
            maxViralizaciones.push(o.viralizacion)) : null
    }))
    console.log(table2_elements)


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
        searching: false,
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
                        return '<small>'+data+' ('+full.n_posts+') '+'</small><a class="float-right" href="'+full.link+'" target="_blank"><svg class="c-icon"><use xlink:href="../../assets/icons/coreui/free-symbol-defs.svg#cui-external-link">'
                    },
                    sort: function(data,type,full,meta){
                        return full.n_posts
                    }
                }
            },
            //Comunidad Interaccion Alcance
            {
                title: '<span class="badge badge-info">Cantidad de Posts</span>  ',
                data : "viralizacion",
                width: '60%',
                //"@data-order": "viralizacion",
                render: {
                    _:function(datav,type,full,meta){
                    return  '<div class="progress mb-1"><div class="progress-bar bg-info" role="progressbar"style="width: '+(100*(full.n_posts))/(data.length-1)+'%;"aria-valuemin="0" aria-valuemax="100">'+parseInt(full.n_posts)+'</div></div>'
                    },
                    sort: function(datav,type,full,meta){
                        return full.n_posts
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
    if (window.location.href.indexOf("menu_dashboard") != -1){load_datatable_autores('all')}
    load_words_cloud('all')

    removeValues(cards)
    
    $('#autores_card').append("\n"+reduction.format(autores.length))
    $('#posteos_card').append("\n"+reduction.format(data.length-1))
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

    //Totales GN
        var total_seguidores_google_news = 0;
        var total_likes_google_news = 0;
        var total_viralizacion_google_news = 0;
        var total_resultados_google_news = 0;

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
                                viralizacion: parseInt(fbpost.shares),
                                img: fbpost.image_url,
                                mensaje: fbpost.message,
                                autor: fbpost.autor,
                                impacto: getIndiceImpacto(parseInt(fbpost.followers),parseInt(fbpost.likes),parseInt(fbpost.shares)),
                                idBusqueda: fbpost.busqueda_id
                            })
                            autoresStr.push({autor:fbpost.autor,origen:"fb"})
                            //console.log('Dato '+allData.length+' Facebook')
                            //stringToWordsToWordsArray(fbpost.description)
                            total_seguidores_fb+=parseInt(fbpost.followers)
                            total_likes_fb+=parseInt(fbpost.likes)
                            total_viralizacion_fb+=parseInt(fbpost.shares)
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

        $.get('../consulta_resultados/'+idBusqueda+'/news').done(function(news){
            //console.log(posts)
            news.map((gnpost)=>{
                if(gnpost.link.includes('https://www') || gnpost.link.includes('http://www')){
                    if(!gnpost.link.includes('&')){
                        allData.push({
                            n: nResults+1, 
                            tipoPagina: "Google News", 
                            linkPost: gnpost.link,
                            linkAutor: 'http'+gnpost.link.match(/:\/\/(.[^/]+)/)[0],
                            fecha: date_and_time(new Date(((gnpost.published_date).replaceAll('-','/')).replaceAll('-','/')))[0],
                            hora:date_and_time(new Date(((gnpost.published_date).replaceAll('-','/')).replaceAll('-','/')))[1], 
                            mensaje: gnpost.title,
                            autor: gnpost.source,
                        })
                        autoresStr.push({autor:gnpost.source,origen:"gn"})
                        total_resultados_google_news++
                        nResults++
                    }
                }
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
                seguidores: total_seguidores_google_news,
                likes: total_likes_google_news,
                viralizacion: total_viralizacion_google_news,
                img: '',
                mensaje: '',
                autor: '',
                impacto: 0        
            })
            datos_fuentes.push(
                {
                    fuente: 'Google News', 
                    t_resultados: total_resultados_google_news,
                    t_seguidores: total_seguidores_google_news, 
                    t_likes: total_likes_google_news,
                    t_viralizacion: total_viralizacion_google_news,
                }
            )
            data=allData
            dataFuentes=datos_fuentes
            autores=autoresUnicos
            
            if (window.location.href.indexOf("informe") != -1){dataToInforme()}
            if (window.location.href.indexOf("informe") == -1){load_AllStats()}

            hideLoading() 
        })
    }
}