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
    $('#select2-1').on('change', onSelectCampania);
});
tokken=document.querySelector('meta[name="csrf-token"]').getAttribute('content');

var status_sidebar=true;
var allData=[]
var allCampañas=[]
var allBusquedas=[]
var allKeywordsC=[]

var allResults=[]
var busquedas_de_campaña=[]
var keywords=''

function export_database(){
    toastr["warning"]("Actualizando Reportes...")
    showLoading()

    url_first=env_url_base+'/tables/export_campañas'

    $.get(url_first).done(function(campañas){
        allCampañas=campañas
        console.log(campañas)

        allCampañas.map((o=>{
            //busquedasdelacampaña=o[0].busquedas;
            busquedasdelacampaña=o[1];
            console.log(busquedasdelacampaña)
                keywords=''
                busquedas_de_campaña=[]
                busquedasdelacampaña.map((busquedadelacampaña=>{
                    keywords+=busquedadelacampaña[0].palabra_busqueda+', '
                    busquedas_de_campaña.push({
                        id_busqueda : busquedadelacampaña[0].id,
                        nombre_busqueda : busquedadelacampaña[0].nombre_busqueda,
                        palabra_busqueda : busquedadelacampaña[0].palabra_busqueda,
                        posts:busquedadelacampaña[1],
                        videos:busquedadelacampaña[2],
                        news:busquedadelacampaña[3],
                        fbposts:busquedadelacampaña[4],
                    })
                }))

                allResults.push({
                    id_campania: o[0].id,
                    nombre_campania: o[0].nombre_campania,
                    keywords_campania:keywords.slice(0,-2),
                    busquedas:busquedas_de_campaña,
                })
                    
                if(o == allCampañas[allCampañas.length-1]){
                    load_results()
                }
        }))
    })
}
function load_results(){
    nResults=0
    allResults.map((campaña=>{if(campaña.busquedas.length!=0){
        campaña.busquedas.map((busqueda=>{
            posts = busqueda.posts;
            videos = busqueda.videos;
            news = busqueda.news;
            fbposts = busqueda.fbposts;
                 
                name_campania=campaña.nombre_campania
                id_campania=campaña.id_campania
                kw_campania=campaña.keywords_campania
                
                Object.values(posts).forEach(function callback(post, i, data) {
                    allData.push({
                        id_db: post.id,
                        n: nResults+1, 
                        tipoPagina: "Twitter", 
                        linkPost: "https://www.twitter.com/"+post.usuario+"/status/"+post.id_tweet,
                        fecha: date_and_time(new Date(post.fecha_creacion))[0],
                        hora:date_and_time(new Date(post.fecha_creacion))[1], 
                        seguidores: parseInt(post.followers),
                        likes: parseInt(post.fav),
                        viralizacion: parseInt(post.rt),
                        img: post.url_imagen,
                        mensaje: post.tweet,
                        autor: post.usuario,
                        impacto: getIndiceImpacto(parseInt(post.followers),parseInt(post.fav),parseInt(post.rt)),
                        tags: post.tags,
                        keywords: busqueda.palabra_busqueda,
                        nameSearch: busqueda.nombre_busqueda,
                        id_search: busqueda.id_busqueda,
                        nameCampaign: name_campania,
                        id_campaign: id_campania,
                        campaign_keywords: kw_campania
                    })
                    nResults++
                })
            
                Object.values(videos).forEach(function callback(video, i, data) {
                    allData.push({
                        id_db: video.id,
                        n: nResults+1, 
                        tipoPagina: "Youtube", 
                        linkPost: "https://www.youtube.com/watch?v="+video.id_video,
                        fecha: date_and_time(new Date(video.upload_date))[0],
                        hora:date_and_time(new Date(video.upload_date))[1], 
                        seguidores: parseInt(video.channel_subs),
                        likes: parseInt(video.likes),
                        viralizacion: parseInt(video.views),
                        img: video.url_imagen,
                        mensaje: video.description,
                        autor: video.channel_name,
                        impacto: getIndiceImpacto(parseInt(video.channel_subs),parseInt(video.likes),parseInt(video.views)),
                        tags: video.tags,
                        keywords: busqueda.palabra_busqueda,
                        nameSearch: busqueda.nombre_busqueda,
                        id_search: busqueda.id_busqueda,
                        nameCampaign: name_campania,
                        id_campaign: id_campania,
                        campaign_keywords: kw_campania
                    })
                    nResults++
                })
    
                Object.values(news).forEach(function callback(art, i, data) {
                    if(art.link.includes('https://www') || art.link.includes('http://www')){
                        if(!art.link.includes('&')){
                            allData.push({
                                id_db: art.id,
                                n: nResults+1, 
                                tipoPagina: "Google News", 
                                linkPost: art.link,
                                fecha: date_and_time(new Date(art.published_date))[0],
                                hora:date_and_time(new Date(art.published_date))[1], 
                                seguidores: parseInt(0),
                                likes: parseInt(0),
                                viralizacion: parseInt(0),
                                img: 'Sin imagen',
                                mensaje: art.title,
                                autor: art.source,
                                impacto: getIndiceImpacto(0,0,0),
                                tags: art.tags,
                                keywords: busqueda.palabra_busqueda,
                                nameSearch: busqueda.nombre_busqueda,
                                id_search: busqueda.id_busqueda,
                                nameCampaign: name_campania,
                                id_campaign: id_campania,
                                campaign_keywords: kw_campania
                            })
                            nResults++
                        }
                    }
                })
                                
                Object.values(fbposts).forEach(function callback(fbpost, i, data) {
                    if(fbpost.url.includes('https://www') || fbpost.url.includes('http://www')){
                        if(!fbpost.url.includes('&')){
                            allData.push({
                                id_db: fbpost.id,
                                n: nResults+1, 
                                tipoPagina: "Facebook", 
                                linkPost: fbpost.url,
                                fecha: date_and_time(new Date(fbpost.date))[0],
                                hora:date_and_time(new Date(fbpost.date))[1],
                                seguidores: parseInt(fbpost.followers),
                                likes: parseInt(fbpost.likes),
                                viralizacion: parseInt(fbpost.shares),
                                img: fbpost.image_url,
                                mensaje: fbpost.message,
                                autor: fbpost.autor,
                                impacto: getIndiceImpacto(parseInt(fbpost.followers),parseInt(fbpost.likes),parseInt(fbpost.shares)),
                                tags: fbpost.tags,
                                keywords: busqueda.palabra_busqueda,
                                nameSearch: busqueda.nombre_busqueda,
                                id_search: busqueda.id_busqueda,
                                nameCampaign: name_campania,
                                id_campaign: id_campania,
                                campaign_keywords: kw_campania
                            })
                            nResults++
                        }
                    }
                })

                if(campaña == allResults[allResults.length-1] && busqueda == campaña.busquedas[campaña.busquedas.length-1]){
                    url_post=env_url_base+'/tables/to_reporte'
                    $.ajax({                                  
                        url: 'to_reporte',       
                        type: 'post',
                        //dataType: 'json',
                        data: {
                            _token : tokken,
                            posts:JSON.stringify(allData)
                        },
                        beforeSend: function () {
                            toastr["warning"]("Comprobando Reportes...")
                            //console.log('Loading Screen On');
                        },
                        complete: function () {
                            //console.log('Loading Screen Off');
                            //hideLoading();
                        },
                        success: function (response) {
                            toastr["success"]("Reportes Actualizados!")
                            hideLoading() 
                            //console.log(JSON.stringify(allData));
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
        }))
    }}))
}
function onSelectCampania(){
    showLoading()
    if($(this).val() != -1){
        $.get('reporte_by_id/'+$(this).val()).done(function(reporte){
            loadTable(reporte)
        })
    }else{
        $.get('reporte_all/').done(function(reporte){
            loadTable(reporte)
        })
    }
}
function loadTable(reporte){
    //console.log(reporte)
    //Creación de la DataTable
    $('#reporte_campania').DataTable({
        destroy: true,
        responsive: true,
        
        "paging": false, //pagingLenght -1 es mostrar todo en la misma pagina
        searching: true,
        info: true,
        data: reporte,
        autoWidth: false,
        columns: [
            {   //0 EXPORTAR OCULTA FUENTE
                title: "Fuente", 
                data: "fuente",
                visible: false
            },
            {   //1 EXPORTAR OCULTA LINK
                title: "Link del post", 
                data: "link",
                visible: false,
                render: function ( data, type, row, meta ) {
                    if(data!=''){
                        return '<a href="' + data + '" target="_blank">'+data+'</a>'
                    }else{
                        return data
                    }
                }         
            },
            {   //2 EXPORTAR OCULTA AUTOR
                title: "Autor",
                data: "autor",
                visible: false
            },
            {   //3 EXPORTAR OCULTA FECHA
                title: "Fecha ", 
                data: "fecha", 
                visible: false
            },
            {   //4 EXPORTAR OCULTA HORA
                title: "Hora ", 
                data: "hora", 
                visible: false
            },
            {   //5 EXPORTAR OCULTA SEGUIDORES
                title: "Seguidores", 
                data: "seguidores",
                visible: false
            },
            {   //6 EXPORTAR OCULTA INTERACCIONES
                title: "Interacciones", 
                data: "interacciones", 
                visible: false
            },
            {   //7 EXPORAR OCULTA VIRALIZACIONES
                title: "Viralizaciones", 
                data: "viralizaciones", 
                visible: false
            },
            {   //8 EXPORTAR OCULTA INPACTO
                title: "Impacto", 
                data: "impacto",
                visible: false
            },
            {   //9 EXPORTAR OCULTA ETIQUETAS
                title: "Etiquetas", 
                data: "etiquetas",
                visible: false
            },
            {   //10 EXPORTAR OCULTA MENSAJE
                title: "Mensaje", 
                data: "mensaje",
                visible: false
            },
            {   //11 EXPORTAR OCULTA ID_DB
                title: "ID_DB", 
                data: "id_db",
                visible: false
            },     

            {   //12 EXPORTAR OCULTA ID_DB
                title: "Keywords", 
                data: "keywords_busqueda",
                visible: false
            },     
            {   //13 EXPORTAR OCULTA ID_DB
                title: "Nombre de la búsqueda", 
                data: "nombre_busqueda",
                visible: false
            },  
            {   //14 EXPORTAR OCULTA ID_DB
                title: "Nombre de la Campaña", 
                data: "nombre_campania",
                visible: false
            },  
            {   //15 EXPORTAR OCULTA ID_DB
                title: "ID Busqueda", 
                data: "busqueda_id",
                visible: false
            },  
            {   //16 EXPORTAR OCULTA ID_DB
                title: "ID Campaña", 
                data: "campania_id",
                visible: false
            }, 
            {   //17 EXPORTAR OCULTA ID_DB
                title: "Keywords de la Campaña", 
                data: "keywords_campania",
                visible: false
            }, 
            {   //18 NO EXPORTAR OCULTA FUENTE
                title: "Fuente", 
                data: "fuente",
                width: "5%",
                render: function (data, type, full, meta) {
                    switch(data){
                        case 'Youtube': return '<center><i class="cib-youtube"></i></center>'; break;
                        case 'Twitter': return '<center><i class="cib-twitter"></i></center>'; break;
                        case 'Google News': return '<center><i class="cib-google"></i></center>'; break;
                        case 'Facebook': return '<center><i class="cib-facebook-f"></i></center>'; break;
                        case 'Instagram': return '<center><i class="cib-instagram"></i></center>'; break;
                        case 'Total': return data; break;
                    }
                }
            },
            {   //19 NO EXPORTAR OCULTA FUENTE
                title: "Mensaje", 
                data: "mensaje",
                width: "20%",
                render: function (data, type, full, meta) {
                    if(full.fuente!='Total'){

                        color='bg-secondary'

                        switch(full.fuente){
                            case 'Youtube'  :color='bg-youtube'; break;
                            case 'Twitter'  :color='bg-twitter'; break;
                            case 'Google News'  :color='bg-google'; break;
                            case 'Facebook' :color='bg-facebook'; break;
                            case 'Instagram':color='bg-instagram'; break;
                        }

                        tagsDiv=full.etiquetas.split(',')
                        div='<div>'
                        ntags=0

                        if(tagsDiv[0]==''||tagsDiv[0]==' '){
                            div+='<span class="badge bg-secondary"> Sin etiquetas </span> <span class="small text-muted"></span></div>'
                        }else{
                            if(tagsDiv.length>3){
                                tagsDiv.map((tag,i)=>{
                                    if(i<=2){
                                        div+='<span class="text-capitalize badge '+ color+'">'+tag+'</span> '
                                    }else{
                                        ntags++
                                    }
                                })
                                div+='<span class="small text-muted"> y '+ntags+' más...</span></div>'
                            }else{
                                tagsDiv.map((tag,i)=>{
                                    div+='<span class="text-capitalize badge '+ color+'">'+tag+'</span> '
                                })
                                div+='<span class="small text-muted"></span></div>'
                            }
                        }
                        return  '<div class="small text-muted" style="width:300px"><span>Fecha: '+full.fecha+' - Hora: '+full.hora+'</span><br><br></div><div style="width:250px">' + data+'<br><br></div>'+div;
                    }else{
                        return '' 
                    }
                }
            },
            {   //20 VISIBLE NO EXPORTAR ALCANCE
                title: "Alcance", 
                data: "seguidores", 
                width: "17%",
                render: function (data, type, full, meta) {
                return  '<div class="clearfix"><div class="float-left"><strong>'+ formatNumberSeparator(full.seguidores) +
                        '<small class="text-muted"> Seguidores</small><br>'+ formatNumberSeparator(full.interacciones) +
                        '<small class="text-muted"> Interacciones</small><br>'+ formatNumberSeparator(full.viralizaciones) +
                        '<small class="text-muted"> Viralizaciones</small><br>';}
            },
            {   //21 VISIBLE NO EXPORTAR LINK
                title: "", 
                data: "link", 
                width: "5%",
                render: function ( data, type, row, meta ) {
                    if(data!=''){
                        return '<a class="btn btn-primary" href="' + data + '" target="_blank"><i class="cil-external-link"></i></a>'
                    }else{
                        return data
                    }
                }
            },
        ]            
    })
    $(function() {
        $('#reporte_campania').DataTable( {
            "deferRender": true,
            destroy: true,
            order: [],
            fixedColums: true,
            //select:         true,
            columnDefs: [
                {orderable: false, targets: [1]},
                {visible: false, targets: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]}
            ],  
            "pageLength": 10,
            language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
            
            dom: 'Bfrtip',
            buttons: [
                {
                //Botón Exportar a Excel
                    extend:    'excelHtml5',
                    exportOptions: {
                        columns: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]
                    },
                    autoFilter: true, //Sort en los header del excel exportado
                    footer: true,
                    text:      'Descargar <i class="fas fa-file-excel"></i>',
                    titleAttr: 'Exportar a Excel',
                    className: 'btn btn-primary',
                    title: 'BIRS DATABASE',
                    filename: 'Export Database',
                    customize: function( xlsx ) {

                        var sheet = xlsx.xl.worksheets['sheet1.xml'];
                
                        // Loop over all cells in sheet
                        $('row c', sheet).each( function () {
                
                            // if cell starts with http
                            if ( $('is t', this).text().indexOf("http") === 0 ) {
                
                                // (2.) change the type to `str` which is a formula
                                $(this).attr('t', 'str');
                                //append the formula
                                $(this).append('<f>' + 'HYPERLINK("'+$('is t', this).text()+'","'+$('is t', this).text()+'")'+ '</f>');
                                //remove the inlineStr
                                $('is', this).remove();
                                // (3.) underline
                                $(this).attr( 's', '4' );
                            }
                        });
                    }                                    
                },
                
            ]
        });    
        hideLoading()
    });
}
//Formatear un valor: si es menor que 10, agregar un 0 a la izquierda
function checkValue(value) {
    if(value<10){value='0'+value;}
    return value;
}
//Fecha y Hora separados en un arreglo de string a partir de una fecha (array[0]=fecha && array[1]=hora)
function date_and_time(date){
    var y = date.getFullYear();      
    var m = checkValue(date.getMonth()+1);       
    var d = checkValue(date.getDate());
    var h = checkValue(date.getHours());
    var min = checkValue(date.getMinutes());
    var sec = checkValue(date.getSeconds());
    var returnArray = [];
        returnArray[0] = y+'-'+m+'-'+d;
        returnArray[1] = h+':'+min+':'+sec
    return returnArray
}
function getIndiceImpacto(followers,likes,views){
    return (followers*.2)+(likes*.3)+(views*.5);
}
//Formatear numero en miles
function formatNumberSeparator (n) {
    n = String(n).replace(/\D/g, "");
return n === '' ? n : Number(n).toLocaleString();
}


function _load_results_useless(){
    allBusquedas.map((busqueda=>{
        $.get('consulta_resultados/'+busqueda.id+'/posts').done(function(posts){
            $.get('consulta_resultados/'+busqueda.id+'/videos').done(function(videos){
                $.get('consulta_resultados/'+busqueda.id+'/news').done(function(news){
                    $.get('consulta_resultados/'+busqueda.id+'/facebookposts').done(function(fbposts){

                        name_campania=busqueda.nombre_campania
                        id_campania=busqueda.id_campania
                        kw_campania=busqueda.keywords_campania
                        
                        Object.values(posts).forEach(function callback(post, i, data) {
                            allData.push({
                                id_db: post.id,
                                n: nResults+1, 
                                tipoPagina: "Twitter", 
                                linkPost: "https://www.twitter.com/"+post.usuario+"/status/"+post.id_tweet,
                                fecha: date_and_time(new Date(post.fecha_creacion))[0],
                                hora:date_and_time(new Date(post.fecha_creacion))[1], 
                                seguidores: parseInt(post.followers),
                                likes: parseInt(post.fav),
                                viralizacion: parseInt(post.rt),
                                img: post.url_imagen,
                                mensaje: post.tweet,
                                autor: post.usuario,
                                impacto: getIndiceImpacto(parseInt(post.followers),parseInt(post.fav),parseInt(post.rt)),
                                tags: post.tags,
                                keywords: busqueda.palabra_busqueda,
                                nameSearch: busqueda.nombre_busqueda,
                                id_search: busqueda.id,
                                nameCampaign: name_campania,
                                id_campaign: id_campania,
                                campaign_keywords: kw_campania
                            })
                            nResults++
                        })
                        Object.values(videos).forEach(function callback(video, i, data) {
                            allData.push({
                                id_db: video.id,
                                n: nResults+1, 
                                tipoPagina: "Youtube", 
                                linkPost: "https://www.youtube.com/watch?v="+video.id_video,
                                fecha: date_and_time(new Date(video.upload_date))[0],
                                hora:date_and_time(new Date(video.upload_date))[1], 
                                seguidores: parseInt(video.channel_subs),
                                likes: parseInt(video.likes),
                                viralizacion: parseInt(video.views),
                                img: video.url_imagen,
                                mensaje: video.description,
                                autor: video.channel_name,
                                impacto: getIndiceImpacto(parseInt(video.channel_subs),parseInt(video.likes),parseInt(video.views)),
                                tags: video.tags,
                                keywords: busqueda.palabra_busqueda,
                                nameSearch: busqueda.nombre_busqueda,
                                id_search: busqueda.id,
                                nameCampaign: name_campania,
                                id_campaign: id_campania,
                                campaign_keywords: kw_campania
                            })
                            nResults++
                        })
                        Object.values(news).forEach(function callback(art, i, data) {
                            if(art.link.includes('https://www') || art.link.includes('http://www')){
                                if(!art.link.includes('&')){
                                    allData.push({
                                        id_db: art.id,
                                        n: nResults+1, 
                                        tipoPagina: "Google News", 
                                        linkPost: art.link,
                                        fecha: date_and_time(new Date(art.published_date))[0],
                                        hora:date_and_time(new Date(art.published_date))[1], 
                                        seguidores: parseInt(0),
                                        likes: parseInt(0),
                                        viralizacion: parseInt(0),
                                        img: 'Sin imagen',
                                        mensaje: art.title,
                                        autor: art.source,
                                        impacto: getIndiceImpacto(0,0,0),
                                        tags: art.tags,
                                        keywords: busqueda.palabra_busqueda,
                                        nameSearch: busqueda.nombre_busqueda,
                                        id_search: busqueda.id,
                                        nameCampaign: name_campania,
                                        id_campaign: id_campania,
                                        campaign_keywords: kw_campania
                                    })
                                    nResults++
                                }
                            }
                        })
                        Object.values(fbposts).forEach(function callback(fbpost, i, data) {
                            if(fbpost.url.includes('https://www') || fbpost.url.includes('http://www')){
                                if(!fbpost.url.includes('&')){
                                    allData.push({
                                        id_db: fbpost.id,
                                        n: nResults+1, 
                                        tipoPagina: "Facebook", 
                                        linkPost: fbpost.url,
                                        fecha: date_and_time(new Date(fbpost.date))[0],
                                        hora:date_and_time(new Date(fbpost.date))[1],
                                        seguidores: parseInt(fbpost.followers),
                                        likes: parseInt(fbpost.likes),
                                        viralizacion: parseInt(fbpost.shares),
                                        img: fbpost.image_url,
                                        mensaje: fbpost.message,
                                        autor: fbpost.autor,
                                        impacto: getIndiceImpacto(parseInt(fbpost.followers),parseInt(fbpost.likes),parseInt(fbpost.shares)),
                                        tags: fbpost.tags,
                                        keywords: busqueda.palabra_busqueda,
                                        nameSearch: busqueda.nombre_busqueda,
                                        id_search: busqueda.id,
                                        nameCampaign: name_campania,
                                        id_campaign: id_campania,
                                        campaign_keywords: kw_campania
                                    })
                                    nResults++
                                }
                            }
                        })
                        if(busqueda== allBusquedas[allBusquedas.length-1]){
                            $.ajax({                                  
                                url: 'to_reporte/',       
                                type: 'post',
                                //dataType: 'json',
                                data: {
                                    _token : tokken,
                                    posts:JSON.stringify(allData)
                                },
                                beforeSend: function () {
                                    //console.log('Loading Screen On');
                                },
                                complete: function () {
                                    //console.log('Loading Screen Off');
                                    //hideLoading();
                                },
                                success: function (response) {
                                    console.log(JSON.stringify(allData));
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
                            console.log(allData)
                            hideLoading() 
                        } 
                    })
                })
            })
        })
    })) 
}
function _export_database_useless(){
    showLoading()
    nResults=0
    $.get('export_campañas/').done(function(campañas){
        $.get('export_busquedas/').done(function(busquedas){
            allCampañas=campañas

            busquedas.map((busqueda=>{
                $.get('campañas_de_busqueda/'+busqueda.id).done(function(campañasdebusqueda){
                    var kamp=[]
                    campañasdebusqueda.map((o=>{
                        $.get('busquedasbyid/'+o.id).done(function(busquedasdelacampaña){
                            var keywords=''
                            busquedasdelacampaña.map((busquedadelacampaña=>{
                                keywords+=busquedadelacampaña.palabra_busqueda+', '
                            }))
                            kamp.push({
                                id: o.id,
                                nombre_campania: o.nombre_campania,
                                keywords: keywords.slice(0,-2)
                            })
                            
                        })
                    }))

                    allBusquedas.push({
                        id: busqueda.id,
                        nombre_busqueda: busqueda.nombre_busqueda,
                        palabra_busqueda: busqueda.palabra_busqueda,
                        campañasDeLaBusqueda: kamp
                    })

                    if(busqueda == busquedas[busquedas.length-1]){
                        load_results()
                    }
                })
            }))

        })
    })

}
function _load_results_useless_useless(){
    allBusquedas.map((busqueda=>{
        $.get('consulta_resultados/'+busqueda.id+'/posts').done(function(posts){
            $.get('consulta_resultados/'+busqueda.id+'/videos').done(function(videos){
                $.get('consulta_resultados/'+busqueda.id+'/news').done(function(news){
                    $.get('consulta_resultados/'+busqueda.id+'/facebookposts').done(function(fbposts){
                        no_hay_campañas=(busqueda.campañasDeLaBusqueda.length==0)
                        if(no_hay_campañas){
                            name_campania='Sin campaña asociada'
                            id_campania='Sin campaña asociada'
                            kw_campania='Sin campaña asociada'
                        }else{
                            name_campania=busqueda.campañasDeLaBusqueda[0].nombre_campania
                            id_campania=busqueda.campañasDeLaBusqueda[0].id
                            kw_campania=busqueda.campañasDeLaBusqueda[0].keywords
                        }
                        Object.values(posts).forEach(function callback(post, i, data) {
                            allData.push({
                                id_db: post.id,
                                n: nResults+1, 
                                tipoPagina: "Twitter", 
                                linkPost: "https://www.twitter.com/"+post.usuario+"/status/"+post.id_tweet,
                                fecha: date_and_time(new Date(post.fecha_creacion))[0],
                                hora:date_and_time(new Date(post.fecha_creacion))[1], 
                                seguidores: parseInt(post.followers),
                                likes: parseInt(post.fav),
                                viralizacion: parseInt(post.rt),
                                img: post.url_imagen,
                                mensaje: post.tweet,
                                autor: post.usuario,
                                impacto: getIndiceImpacto(parseInt(post.followers),parseInt(post.fav),parseInt(post.rt)),
                                tags: post.tags,
                                keywords: busqueda.palabra_busqueda,
                                nameSearch: busqueda.nombre_busqueda,
                                id_search: busqueda.id,
                                nameCampaign: name_campania,
                                id_campaign: id_campania,
                                campaign_keywords: kw_campania
                            })
                            nResults++
                        })
                        Object.values(videos).forEach(function callback(video, i, data) {
                            allData.push({
                                id_db: video.id,
                                n: nResults+1, 
                                tipoPagina: "Youtube", 
                                linkPost: "https://www.youtube.com/watch?v="+video.id_video,
                                fecha: date_and_time(new Date(video.upload_date))[0],
                                hora:date_and_time(new Date(video.upload_date))[1], 
                                seguidores: parseInt(video.channel_subs),
                                likes: parseInt(video.likes),
                                viralizacion: parseInt(video.views),
                                img: video.url_imagen,
                                mensaje: video.description,
                                autor: video.channel_name,
                                impacto: getIndiceImpacto(parseInt(video.channel_subs),parseInt(video.likes),parseInt(video.views)),
                                tags: video.tags,
                                keywords: busqueda.palabra_busqueda,
                                nameSearch: busqueda.nombre_busqueda,
                                id_search: busqueda.id,
                                nameCampaign: name_campania,
                                id_campaign: id_campania,
                                campaign_keywords: kw_campania
                            })
                            nResults++
                        })
                        Object.values(news).forEach(function callback(art, i, data) {
                            if(art.link.includes('https://www') || art.link.includes('http://www')){
                                if(!art.link.includes('&')){
                                    allData.push({
                                        id_db: art.id,
                                        n: nResults+1, 
                                        tipoPagina: "Google News", 
                                        linkPost: art.link,
                                        fecha: date_and_time(new Date(art.published_date))[0],
                                        hora:date_and_time(new Date(art.published_date))[1], 
                                        seguidores: parseInt(0),
                                        likes: parseInt(0),
                                        viralizacion: parseInt(0),
                                        img: 'Sin imagen',
                                        mensaje: art.title,
                                        autor: art.source,
                                        impacto: getIndiceImpacto(0,0,0),
                                        tags: art.tags,
                                        keywords: busqueda.palabra_busqueda,
                                        nameSearch: busqueda.nombre_busqueda,
                                        id_search: busqueda.id,
                                        nameCampaign: name_campania,
                                        id_campaign: id_campania,
                                        campaign_keywords: kw_campania
                                    })
                                    nResults++
                                }
                            }
                        })
                        Object.values(fbposts).forEach(function callback(fbpost, i, data) {
                            if(fbpost.url.includes('https://www') || fbpost.url.includes('http://www')){
                                if(!fbpost.url.includes('&')){
                                    allData.push({
                                        id_db: fbpost.id,
                                        n: nResults+1, 
                                        tipoPagina: "Facebook", 
                                        linkPost: fbpost.url,
                                        fecha: date_and_time(new Date(fbpost.date))[0],
                                        hora:date_and_time(new Date(fbpost.date))[1],
                                        seguidores: parseInt(fbpost.followers),
                                        likes: parseInt(fbpost.likes),
                                        viralizacion: parseInt(fbpost.shares),
                                        img: fbpost.image_url,
                                        mensaje: fbpost.message,
                                        autor: fbpost.autor,
                                        impacto: getIndiceImpacto(parseInt(fbpost.followers),parseInt(fbpost.likes),parseInt(fbpost.shares)),
                                        tags: fbpost.tags,
                                        keywords: busqueda.palabra_busqueda,
                                        nameSearch: busqueda.nombre_busqueda,
                                        id_search: busqueda.id,
                                        nameCampaign: name_campania,
                                        id_campaign: id_campania,
                                        campaign_keywords: kw_campania
                                    })
                                    nResults++
                                }
                            }
                        })
                        if(busqueda== allBusquedas[allBusquedas.length-1]){
                            $.ajax({                                  
                                url: 'to_reporte/',       
                                type: 'post',
                                //dataType: 'json',
                                data: {
                                    _token : tokken,
                                    posts:JSON.stringify(allData)
                                },
                                beforeSend: function () {
                                    //console.log('Loading Screen On');
                                },
                                complete: function () {
                                    //console.log('Loading Screen Off');
                                    //hideLoading();
                                },
                                success: function (response) {
                                    console.log(JSON.stringify(allData));
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
                            console.log(allData)
                            hideLoading() 
                        } 
                    })
                })
            })
        })
    })) 
}
function obsolete_useless(){
    if(busqueda== allBusquedas[allBusquedas.length-1]){
        $('#allDataBase').DataTable({
            destroy: true,
            responsive: true,
            "paging": true, //pagingLenght -1 es mostrar todo en la misma pagina
            searching: true,
            info: true,
            data: allData,
            autoWidth: false,
            columns: [
                /*Columnas Visibles*/
                {   //0 VISIBLE NO EXPORTAR IMG
                    title: "", 
                    data: "img", 
                    width: "11%", 
                    render: function (data, type, full, meta) {
                        if(data!="Sin imagen"){
                            return '<center><img src="' + data + '" style="width:80%;border-radius: 3px"></center>'}
                        else{
                            return '<center>'+data+'</center>'
                        }
                    }
                },
                {   //1 VISIBLE EXPORTAR MENSAJE
                    title: "Publicación", 
                    data: "mensaje",
                    width: "300px",
                    render: function (data, type, full, meta) {
                        if(full.tipoPagina!='Total'){
                            return  '<div class="small text-muted" style="width:300px"><span>Fecha: '+full.fecha+' - Hora: '+full.hora+'</span><br><br></div><div style="width:250px">' + data+'<br><br></div>';
                        }else{
                            return '' 
                        }
                    }
                },
                {   //2 VISIBLE NO EXPORTAR FUENTE
                    title: "<center>Fuente</center>", 
                    data: "tipoPagina", 
                    //width: "15%",
                    render: function (data, type, full, meta) {
                        switch(data){
                            case 'Youtube': return '<center><i class="cib-youtube"></i></center>'; break;
                            case 'Twitter': return '<center><i class="cib-twitter"></i></center>'; break;
                            case 'Facebook': return '<center><i class="cib-facebook-f"></i></center>'; break;
                            case 'Instagram': return '<center><i class="cib-instagram"></i></center>'; break;
                            case 'Google News': return '<center><i class="cib-google"></i></center>'; break;
                            case 'Total': return data; break;
                        }
                    }
                },
                {   //3 VISIBLE NO EXPORTAR ALCANCE
                    title: "Alcance", 
                    data: "seguidores", 
                    width: "17%",
                    render: function (data, type, full, meta) {
                    return  '<div class="clearfix"><div class="float-left"><strong>'+ formatNumberSeparator(full.seguidores) +
                            '<small class="text-muted"> Seguidores</small><br>'+ formatNumberSeparator(full.likes) +
                            '<small class="text-muted"> Interacciones</small><br>'+ formatNumberSeparator(full.viralizacion) +
                            '<small class="text-muted"> Viralizaciones</small><br>';}
                },
                {   //4 VISIBLE NO EXPORTAR BOTON ETIQUETAS
                    title: "", 
                    data: "n", 
                    width: "5%",
                    render: function ( data, type, row, meta ) {
                        if(data!=''){
                            return '<a class="btn btn-warning" data-toggle="modal" data-target="#tagsModal" onclick="showTags('+data+')"><i class="cil-tags"></i></a>'
                        }else{
                            return data
                        }
                    }
                },
                {   //5 VISIBLE NO EXPORTAR LINK
                    title: "", 
                    data: "linkPost", 
                    width: "5%",
                    render: function ( data, type, row, meta ) {
                        if(data!=''){
                            return '<a class="btn btn-primary" href="' + data + '" target="_blank"><i class="cil-external-link"></i></a>'
                        }else{
                            return data
                        }
                    }
                },
                /* Columnas Ocultas que serán exportadas */
                {   //6 EXPORTAR OCULTA N
                    title: "N°", 
                    data: "n", 
                    visible: false
                },
                {   //7 EXPORTAR OCULTA FUENTE
                    title: "Fuente", 
                    data: "tipoPagina",
                    visible: false
                },
                {   //8 EXPORTAR OCULTA LINK
                    title: "Link del post", 
                    data: "linkPost",
                    visible: false,
                    render: function ( data, type, row, meta ) {
                        if(data!=''){
                            return '<a href="' + data + '" target="_blank">'+data+'</a>'
                        }else{
                            return data
                        }
                    }         
                },
                {   //9 EXPORTAR OCULTA AUTOR
                    title: "Autor",
                    data: "autor",
                    visible: false
                },
                {   //10 EXPORTAR OCULTA FECHA
                    title: "Fecha ", 
                    data: "fecha", 
                    visible: false
                    //render: function (data, type, full, meta) {
                    //return '<div title="'+"Fecha y hora de esta publicación"+ '">' + data;}
                },
                {   //11 EXPORTAR OCULTA HORA
                    title: "Hora ", 
                    data: "hora", 
                    visible: false
                },
                {   //12 EXPORTAR OCULTA SEGUIDORES
                    title: "Seguidores", 
                    data: "seguidores",
                    visible: false
                    //render: function (data, type, full, meta) {
                    //return '<div title="'+"Twitter: Seguidores de la cuenta\nYoutube: Suscriptores del Canal" + '">' + data;} 
                },
                {   //13 EXPORTAR OCULTA INTERACCIONES
                    title: "Interacciones", 
                    data: "likes", 
                    visible: false
                    //render: function (data, type, full, meta) {
                    //return '<div title="'+"Twitter: Me gusta de la publicación\nYoutube: Likes del video" + '">' + data;} 
                },
                {   //14 EXPORAR OCULTA VIRALIZACIONES
                    title: "Viralizaciones", 
                    data: "viralizacion", 
                    visible: false
                    //render: function (data, type, full, meta) {
                    //return '<div title="'+"Twitter: Retweets\nYoutube: Visualizaciones\nGoogle News: Visualizaciones" + '">' + data;} 
                },
                {   //15 EXPORTAR OCULTA INPACTO
                    title: "Impacto", 
                    data: "impacto",
                    visible: false
                },
                {   //16 EXPORTAR OCULTA MENSAJE
                    title: "Mensaje", 
                    data: "mensaje",
                    visible: false
                    //render: function (data, type, full, meta) {
                    //return '<div title="'+"Twitter: Contenido del post\nYoutube: Título del video\nGoogle News: Título de la noticia"  + '">' + data;} 
                },
                {   //17 EXPORTAR OCULTA ETIQUETAS
                    title: "Etiquetas", 
                    data: "tags",
                    visible: false
                    //render: function (data, type, full, meta) {
                    //return '<div title="'+"Twitter: Contenido del post\nYoutube: Título del video\nGoogle News: Título de la noticia"  + '">' + data;} 
                },
                {   //18 VISIBLE NO EXPORTAR LINK
                    title: "", 
                    data: "n", 
                    width: "5%",
                    render: function ( data, type, full, meta ) {
                        return ''
                    }
                },
                {   //19 EXPORTAR OCULTA ID_DB
                    title: "ID_DB", 
                    data: "id_db",
                    visible: false
                    //render: function (data, type, full, meta) {
                    //return '<div title="'+"Twitter: Contenido del post\nYoutube: Título del video\nGoogle News: Título de la noticia"  + '">' + data;} 
                },     

                {   //20 EXPORTAR OCULTA ID_DB
                    title: "Keywords", 
                    data: "keywords",
                    visible: false
                    //render: function (data, type, full, meta) {
                    //return '<div title="'+"Twitter: Contenido del post\nYoutube: Título del video\nGoogle News: Título de la noticia"  + '">' + data;} 
                },     
                {   //21 EXPORTAR OCULTA ID_DB
                    title: "Nombre de la búsqueda", 
                    data: "nameSearch",
                    visible: false
                    //render: function (data, type, full, meta) {
                    //return '<div title="'+"Twitter: Contenido del post\nYoutube: Título del video\nGoogle News: Título de la noticia"  + '">' + data;} 
                },  
                {   //22 EXPORTAR OCULTA ID_DB
                    title: "Nombre de la Campaña", 
                    data: "nameCampaign",
                    visible: false
                    //render: function (data, type, full, meta) {
                    //return '<div title="'+"Twitter: Contenido del post\nYoutube: Título del video\nGoogle News: Título de la noticia"  + '">' + data;} 
                },  
                {   //23 EXPORTAR OCULTA ID_DB
                    title: "ID Busqueda", 
                    data: "id_search",
                    visible: false
                    //render: function (data, type, full, meta) {
                    //return '<div title="'+"Twitter: Contenido del post\nYoutube: Título del video\nGoogle News: Título de la noticia"  + '">' + data;} 
                },  
                {   //24 EXPORTAR OCULTA ID_DB
                    title: "ID Campaña", 
                    data: "id_campaign",
                    visible: false
                    //render: function (data, type, full, meta) {
                    //return '<div title="'+"Twitter: Contenido del post\nYoutube: Título del video\nGoogle News: Título de la noticia"  + '">' + data;} 
                }, 
                {   //25 EXPORTAR OCULTA ID_DB
                    title: "Keywords de la Campaña", 
                    data: "campaign_keywords",
                    visible: false
                    //render: function (data, type, full, meta) {
                    //return '<div title="'+"Twitter: Contenido del post\nYoutube: Título del video\nGoogle News: Título de la noticia"  + '">' + data;} 
                }, 
            ]            
        })
        $(function() {
            $('#allDataBase').DataTable( {
                "deferRender": true,
                destroy: true,
                //Ocultar la columnas de autor, pagina y link
                order: [],
                fixedColums: true,
                //select:         true,
                columnDefs: [
                    {orderable: false, targets: [0,1,2,3,4,5]}, //falta 12
                    {visible: false, targets: [6,7,8,9,10,11,12,13,14,15,16,17,19,20,21,22,23,24,25]},
                    {width: '300px', targets: [1]}
                ],  
                "pageLength": 10,
                language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
                
                dom: 'Bfrtip',
                buttons: [
                    {
                    //Botón Exportar a Excel
                        extend:    'excelHtml5',
                        exportOptions: {
                            columns: [6,7,8,9,10,11,12,13,14,15,17,16,19,20,21,22,23,24,25]
                        },
                        autoFilter: true, //Sort en los header del excel exportado
                        footer: true,
                        text:      'Descargar <i class="fas fa-file-excel"></i>',
                        titleAttr: 'Exportar a Excel',
                        className: 'btn btn-primary',
                        title: 'BIRS DATABASE',
                        filename: 'Export Database',
                        customize: function( xlsx ) {

                            var sheet = xlsx.xl.worksheets['sheet1.xml'];
                    
                            // Loop over all cells in sheet
                            $('row c', sheet).each( function () {
                    
                                // if cell starts with http
                                if ( $('is t', this).text().indexOf("http") === 0 ) {
                    
                                    // (2.) change the type to `str` which is a formula
                                    $(this).attr('t', 'str');
                                    //append the formula
                                    $(this).append('<f>' + 'HYPERLINK("'+$('is t', this).text()+'","'+$('is t', this).text()+'")'+ '</f>');
                                    //remove the inlineStr
                                    $('is', this).remove();
                                    // (3.) underline
                                    $(this).attr( 's', '4' );
                                }
                            });
                        }                                    
                    },
                    
                ]
            });    
        });
        hideLoading() 
    } 
}