$(function(){
    var userAgent = window.navigator.userAgent;
    if(userAgent.includes('iPhone') && !window.location.href.includes("informe")){
        $("#wordscloud").attr("style", "margin-top:2.5%;height: 36vh; !important;")
    }

    if (window.location.href.indexOf("tables/consulta_resultados_def")!=-1){
        $('#select2-1').val(null)
    }
    //Cuando se detecte un cambio sobre el select principal, se llama a la funcion onSelectChange
    //$('#selectBusqueda').on('change', onSelectChange);
    if (window.location.href.indexOf("tables/consulta_resultados")!=-1){
        isSearch?onInitPage():null
    }
    //Campaña
    $('#selectCampaña').on('change', onSelectCampaña);
    //Busqueda v2
    $('#select2-1').on('change', onSelectBusqueda);

    $('#cc').on('click', cc);

    //Loading WordCloud
    if(document.getElementById('loadingWordcloud')!=null){
        ldnWC = document.getElementById('loadingWordcloud')
        ldnWC.setAttribute("hidden","hidden")
        if ((window.location.href.indexOf("tables/campa%C3%B1a/")||window.location.href.indexOf("tables/resultado/")) != -1){
            ldnWC.removeAttribute("hidden")
        }
    }
    if ((window.location.href.indexOf("informe") == -1)){
        $(".container").fadeIn(500);
    }
});
/*Variables Globales*/
    arrayMotivos=["cil-happy","cil-frown","cil-meh"]
    var busquedaId='';
    var palabraClave=''
//Lista de palabras que luego se transformarán en objetos {word: string, size: random (por ahora)}
    var words= []; 
//Variables necesarias para la Actualización
    var params = [];
    var idUpdate = ''; 
    var status_sidebar=true;
//Variables necesarias para el nombre del Excel
    var fechaDeLaBusqueda='';
    var nombreDeLaBusqueda='';

/*Manejo de fechas*/
//Añadir minutos a una fecha
    function addMinutes(date, hours) {
        var result = new Date(date);
        result.setMinutes(result.getMinutes() + hours);
        return result;
    }
//Añadir horas a una fecha
    function addHours(date, hours) {
        var result = new Date(date);
        result.setHours(result.getHours() + hours);
        return result;
    }
//Añadir días a una fecha
    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days+1);
        return result;
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

/*Funciones de manejo de información primarias e imprescindibles*/
//Función para calcular indice de impacto de un post
    function getIndiceImpacto(followers,likes,views){
        return (followers*.2)+(likes*.3)+(views*.5);
    }
    
//Función que carga el resultado más reciente
    function onInitPage(){
        words= []; //reinicializacion del array cada vez que cambia el select
        //console.log("Estoy viendo la busqueda con el id: "+$('#select2-1').val());
        busquedaId = $('#select2-1').val();
        idUpdate = busquedaId;
        //console.log("Si quiero actualizar, se usara el id: "+idUpdate);

        var fechaMenor=new Date();
        var fechaMayor=new Date();
        var fechaBusqueda=new Date();

        loadTable(busquedaId, fechaMenor, fechaMayor, fechaBusqueda);
    }
//Función que llama a la carga de la tabla al seleccionar una campaña
    function onSelectCampaña(){
        var idCampaña = $(this).val();
        var datos_tablaBusquedas=[]
        var allData=[]
        var nResults=0
        $.get('campañas/'+idCampaña).done(function(data) {
            Object.values(data).forEach(function callback(search, i, data) {
                datos_tablaBusquedas.push({
                    n:i+1,
                    clave: search.palabra_busqueda.charAt(0).toUpperCase() + search.palabra_busqueda.slice(1),
                    desde: search.fecha_inicial_original,
                    hasta: search.fecha_final,
                    creada:date_and_time(new Date(search.created_at))[0]
                })
            }) 
        });
        showLoading();
        $.get('campañas/'+idCampaña+'/posts').done(function(posts) {
            $.get('campañas/'+idCampaña+'/videos').done(function(videos) {
                $.get('campañas/'+idCampaña+'/news').done(function(news) {
                    $.get('campañas/'+idCampaña+'/userposts').done(function(fbposts) {
                        Object.values(posts).forEach(function callback(post, i, data) {
                            allData.push({
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
                                impacto: getIndiceImpacto(parseInt(post.followers),parseInt(post.fav),parseInt(post.rt))
                            })
                            console.log('Dato '+allData.length+' Twitter')
                            nResults++
                        })
                        Object.values(videos).forEach(function callback(video, i, data) {
                            allData.push({
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
                                impacto: getIndiceImpacto(parseInt(video.channel_subs),parseInt(video.likes),parseInt(video.views))
                            })
                            console.log('Dato '+allData.length+' Youtube')
                            nResults++
                        })
                        Object.values(news).forEach(function callback(art, i, data) {
                        //if(news[i].published_date>=search.fecha_inicial_original+' 00:00:00' && news[i].published_date<=search.fecha_final+' '+date_and_time(addHours(new Date(new Date(search.updated_at)),6))[1]){
                            allData.push({
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
                                impacto: getIndiceImpacto(0,0,0)
                            })
                            console.log('Dato '+allData.length+' GNews')
                            nResults++
                        //}
                        })
                        Object.values(fbposts).forEach(function callback(fbpost, i, data) {
                        allData.push({
                                n: nResults+1, 
                                tipoPagina: "Facebook", 
                                linkPost: 'http://www.fbpost.com/'+fbpost.id_post,
                                fecha: date_and_time(fecha)[0],
                                hora:date_and_time(fecha)[1],  
                                seguidores: parseInt(fbpost.user_friends),
                                likes: parseInt(0),
                                viralizacion: parseInt(fbpost.shares),
                                img: fbpost.picture_url,
                                mensaje: fbpost.description,
                                autor: fbpost.user_name,
                                impacto: getIndiceImpacto(0,0,0)
                            })
                            console.log('Dato '+allData.length+' Facebook')
                            nResults++
                        }) 
                        //Creación de la DataTable
                        $('#tablaBusquedas').DataTable({
                            language: {
                                "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
                            responsive: true,
                            destroy: true,
                            "paging": false, //pagingLenght -1 es mostrar todo en la misma pagina
                            searching: false,
                            info: false,
                            data: datos_tablaBusquedas,
                            columns: [
                                {
                                    title: 'N',
                                    data: 'n'
                                },
                                {
                                    title: 'Clave',
                                    data: 'clave'
                                },
                                {
                                    title: 'Desde',
                                    data: 'desde'
                                },
                                {
                                    title: 'Hasta',
                                    data: 'hasta'
                                },
                                {
                                    title: 'Creada',
                                    data: 'creada'
                                }
                            ]                     
                        })
                        //Creación de la DataTable
                        $('#tablaResultados').DataTable({
                            responsive: true,
                            destroy: true,
                            "paging": false, //pagingLenght -1 es mostrar todo en la misma pagina
                            searching: true,
                            info: true,
                            data: allData,
                            columns: [
                                { //0, Visible, Exportar
                                    title: "N°", 
                                    data: "n", 
                                    width: "9%",
                                },
                                {   //1, Visible, No Exportar
                                    title: "Fuente", 
                                    data: "tipoPagina", 
                                    width: "15%",
                                    render: function (data, type, full, meta) {
                                        switch(data){
                                            case 'Youtube': return '<center><i class="cib-youtube"></i></center>'; break;
                                            case 'Twitter': return '<center><i class="cib-twitter"></i></center>'; break;
                                            case 'Google News': return '<center><i class="cib-google"></i></center>'; break;
                                            case 'Total': return data; break;
                                        }
                                    }
                                },
                                {   //2, Oculta, Exportar
                                    title: "Fuente", 
                                    data: "tipoPagina", 
                                },
                                {   //3, Visible, No Exportar
                                    title: "Link", 
                                    data: "linkPost",
                                    width: "13%",
                                    render: function ( data, type, row, meta ) {
                                        if(data!=''){
                                            return '<a href="' + data + '" target="_blank">Link</a>'
                                        }else{
                                            return data
                                        }
                                    }
                                },
                                {   //4, Oculta, Exportar
                                    title: "Link del post", 
                                    data: "linkPost",
                                    render: function ( data, type, row, meta ) {
                                        if(data!=''){
                                            return '<a href="' + data + '" target="_blank">'+data+'</a>'
                                        }else{
                                            return data
                                        }
                                    }         
                                },
                                {  //5 Oculta, Exportar
                                    title: "Autor",
                                    data: "autor",
                                },
                                {   //6, Visible, Exportar
                                    title: "Fecha ", 
                                    data: "fecha", 
                                    width: "20%",
                                    //render: function (data, type, full, meta) {
                                    //return '<div title="'+"Fecha y hora de esta publicación"+ '">' + data;}
                                },
                                {   //7, Visible, Exportar
                                    title: "Hora ", 
                                    data: "hora", 
                                    width: "15%",
                                },
                                {   //8, Visible, Exportar
                                    title: "Seguidores", 
                                    data: "seguidores",
                                    width: "19%",
                                    //render: function (data, type, full, meta) {
                                    //return '<div title="'+"Twitter: Seguidores de la cuenta\nYoutube: Suscriptores del Canal" + '">' + data;} 
                                },
                                {   //9, Visible, Exportar
                                    title: "Interacciones", 
                                    data: "likes", 
                                    width: "22%",
                                    //render: function (data, type, full, meta) {
                                    //return '<div title="'+"Twitter: Me gusta de la publicación\nYoutube: Likes del video" + '">' + data;} 
                                },
                                {   //10, Visible, Exportar
                                    title: "Viralizaciones", 
                                    data: "viralizacion", 
                                    width: "25%",
                                    //render: function (data, type, full, meta) {
                                    //return '<div title="'+"Twitter: Retweets\nYoutube: Visualizaciones\nGoogle News: Visualizaciones" + '">' + data;} 
                                },
                                {   //11, Visible, No Exportar
                                    title: "Imagen", 
                                    data: "img", 
                                    width: "20%", 
                                    render: function (data, type, full, meta) {
                                        if(data!="Sin imagen"){
                                            return '<center><img src="' + data + '" style="width:100%;"></center>'}
                                        else{
                                            return data
                                        }
                                    }
                                },
                                {   //12, Visible, Exportar (OCULTA, se exporta)
                                    title: "Mensaje", 
                                    data: "mensaje",
                                    width: "30%",
                                    //render: function (data, type, full, meta) {
                                    //return '<div title="'+"Twitter: Contenido del post\nYoutube: Título del video\nGoogle News: Título de la noticia"  + '">' + data;} 
                                },
                                {   //13, Oculta, Exportar
                                    title: "Impacto", 
                                    data: "impacto",
                                }
                            ]                     
                        })
                        //Botones tablaResultados
                        $(document).ready(function() {
                            $('#tablaResultados').DataTable( {
                                //Ocultar la columnas de autor, pagina y link
                                columnDefs: [
                                    {orderable: false, targets: [1,3,11]}, //falta 12
                                    {visible: false, targets: [2,4,5,13,12]}  //no estaba 12
                                ],  
                                "pageLength": -1,
                                "initComplete": function(settings){ //Tooltip
                                    $('#tablaResultados thead th').each(function (i,item) {
                                        var $tr = $(item);
                                        switch($tr[0].innerText){
                                            case 'Seguidores':      return $tr.attr('title', "Twitter: Seguidores de la cuenta\nYoutube: Suscriptores del Canal"); break;
                                            case 'Interacciones':   return $tr.attr('title', "Twitter: Likes de la publicación\nYoutube: Likes del video"); break;
                                            case 'Viralizaciones':  return $tr.attr('title', "Twitter: Retweets (Veces compartido)\nYoutube: Visualizaciones del video\nGoogle News: Visualizaciones del artículo"); break;
                                            case 'Mensaje':         return $tr.attr('title', "Twitter: Contenido del post\nYoutube: Título del video\nGoogle News: Título de la noticia"); break;
                                        } 
                                    });
                                },  
                                language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
                                destroy: true,
                                dom: 'Bfrtip',
                                buttons: [
                                    {
                                    //Botón Exportar a Excel
                                        extend:    'excelHtml5',
                                        exportOptions: {
                                            columns: [ 0, 2, 4, 5, 6 ,7, 8, 9, 10, 13, 12 ]
                                        },
                                        autoFilter: true, //Sort en los header del excel exportado
                                        footer: true,
                                        text:      'Descargar <i class="fas fa-file-excel"></i>',
                                        titleAttr: 'Exportar a Excel',
                                        className: 'btn btn-primary',
                                        title: 'Campaña ID ',
                                        filename: 'Campaña ID',
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
                                    {
                                        //Botón Ir al Dashboard
                                        text:'Menú Dashboard <i class="cil-sync"></i>',
                                        titleAttr: 'Ir al dashboard de la campaña',
                                        action: function ( e, dt, node, config ) {
                                            dashboardById('c'+idCampaña);
                                        },
                                        type:'submit',
                                        className: 'btn btn-info',
                                    }
                                ],
                            }); 
                            hideLoading();         
                        });
                    })
                })
            })
        })
    }
    function onSelectBusqueda(){
        //$("#wordscloud").empty();
        if (currentwc!='') {
            $('.current_wordcloud').fadeOut(600)
        }
        $('#totalPosts').val(0);
        showLoading();
        words= []; //reinicializacion del array cada vez que cambia el select
        
        var busquedaId='';

            //console.log("Estoy viendo la busqueda con el id: "+$(this).val());
            busquedaId = $(this).val();
            idUpdate = busquedaId;
            //console.log("Si quiero actualizar, se usara el id: "+idUpdate);

        var fechaMenor=new Date();
        var fechaMayor=new Date();
        var fechaBusqueda=new Date();
        
        loadTable(busquedaId, fechaMenor, fechaMayor, fechaBusqueda);
    }
    is_table_loaded=false
//Función que llama a la carga de la tabla al seleccionar una búsqueda
    function loadTable(busquedaId, fechaMenor, fechaMayor, fechaBusqueda){
        (is_table_loaded)?$('#tablaPostsV2').DataTable().clear().destroy():null
        $('#tablaPostsV2').contents().remove();
        var idBusqueda = busquedaId
        var allData=[]
        var nResults=0
        var fechaMenorOriginal=new Date();    
        words= []; //reinicializacion del array cada vez que cambia el select
        var wordsCloudArray = []; //array que contendra los objetos word en base al array words y será ocupado por la wordcloud  
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

            var idCampaña=''
            palabraClave=''

        var datos_fuentes = []; //Elementos de la tabla de fuentes
        //AJAX nos devuelve informacion, en este caso en un json y la mostramos a traves de js
        $.get('consulta_resultados/'+idBusqueda+'/detalles').done(function(detalles){
            palabraClave = detalles[0].palabra_busqueda;
            //console.log(palabraClave)
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

            nombreDeLaBusqueda = detalles[0].nombre_busqueda; //Nombre del Excel
            $.get('consulta_resultados/'+idBusqueda+'/all').done(function(all){
                (all[5].length!=0)?idCampaña=((all[5])[0].id):null;
                posts=all[0];videos=all[1];news=all[2];fbposts=all[3];igposts=all[4]
                Object.values(posts).forEach(function callback(post, i, data) {
                    allData.push({
                        id_db: post.id,
                        n: nResults+1, 
                        tipoPagina: "Twitter", 
                        linkPost: "https://www.twitter.com/"+post.usuario+"/status/"+post.id_tweet,
                        fecha: date_and_time(new Date(post.fecha_creacion.replaceAll('-','/')))[0],
                        hora:date_and_time(new Date(post.fecha_creacion.replaceAll('-','/')))[1], 
                        seguidores: parseInt(post.followers),
                        likes: parseInt(post.fav),
                        viralizacion: parseInt(post.rt),
                        img: post.url_imagen,
                        mensaje: post.tweet,
                        autor: post.usuario,
                        impacto: getIndiceImpacto(parseInt(post.followers),parseInt(post.fav),parseInt(post.rt)),
                        tags: post.tags
                    })
                    //console.log('Dato '+allData.length+' Twitter')
                    stringToWordsToWordsArray(post.tweet)
                    total_seguidores_twitter+=parseInt(post.followers)
                    total_likes_twitter+=parseInt(post.fav)
                    total_viralizacion_twitter+=parseInt(post.rt)
                    total_resultados_twitter++
                    nResults++
                })
                Object.values(videos).forEach(function callback(video, i, data) {
                    allData.push({
                        id_db: video.id,
                        n: nResults+1, 
                        tipoPagina: "Youtube", 
                        linkPost: "https://www.youtube.com/watch?v="+video.id_video,
                        fecha: date_and_time(new Date(video.upload_date.replaceAll('-','/')))[0],
                        hora:date_and_time(new Date(video.upload_date.replaceAll('-','/')))[1], 
                        seguidores: parseInt(video.channel_subs),
                        likes: parseInt(video.likes),
                        viralizacion: parseInt(video.views),
                        img: video.url_imagen,
                        mensaje: video.description,
                        autor: video.channel_name,
                        impacto: getIndiceImpacto(parseInt(video.channel_subs),parseInt(video.likes),parseInt(video.views)),
                        tags: video.tags
                    })
                    //console.log('Dato '+allData.length+' Youtube')
                    stringToWordsToWordsArray(video.description)
                    total_seguidores_youtube+=parseInt(video.channel_subs)
                    total_likes_youtube+=parseInt(video.likes)
                    total_viralizacion_youtube+=parseInt(video.views)
                    total_resultados_youtube++
                    nResults++
                })
                Object.values(fbposts).forEach(function callback(fbpost, i, data) {
                    if(fbpost.url.includes('https://www') || fbpost.url.includes('http://www')){
                        if(!fbpost.url.includes('&')){
                            allData.push({
                                id_db: fbpost.id,
                                n: nResults+1, 
                                tipoPagina: "Facebook", 
                                linkPost: fbpost.url,
                                fecha: date_and_time(new Date(fbpost.date.replaceAll('-','/')))[0],
                                hora:date_and_time(new Date(fbpost.date.replaceAll('-','/')))[1],
                                seguidores: parseInt(fbpost.followers),
                                likes: parseInt(fbpost.likes),
                                viralizacion: parseInt(fbpost.shares)+parseInt(fbpost.comments),
                                img: fbpost.image_url,
                                mensaje: fbpost.message,
                                autor: fbpost.autor,
                                impacto: getIndiceImpacto(parseInt(fbpost.followers),parseInt(fbpost.likes),(parseInt(fbpost.shares)+parseInt(fbpost.comments))),
                                tags: fbpost.tags
                            })
                            //console.log('Dato '+allData.length+' Facebook')
                            stringToWordsToWordsArray(fbpost.message)
                            total_seguidores_fb+=parseInt(fbpost.followers)
                            total_likes_fb+=parseInt(fbpost.likes)
                            total_viralizacion_fb+=parseInt(fbpost.shares)+parseInt(fbpost.comments)
                            total_resultados_fb++
                            nResults++
                        }
                    }
                })
                Object.values(igposts).forEach(function callback(igpost, i, data) {
                    if(igpost.url.includes('https://') || igpost.url.includes('http://')){
                        if(!igpost.url.includes('&')){
                            allData.push({
                                id_db: igpost.id,
                                n: nResults+1, 
                                tipoPagina: "Instagram", 
                                linkPost: igpost.url,
                                fecha: date_and_time(new Date(igpost.date.replaceAll('-','/')))[0],
                                hora:date_and_time(new Date(igpost.date.replaceAll('-','/')))[1],
                                seguidores: parseInt(igpost.followers),
                                likes: parseInt(igpost.likes),
                                viralizacion: parseInt(igpost.shares),
                                img: igpost.image_url,
                                mensaje: igpost.message,
                                autor: igpost.autor,
                                impacto: getIndiceImpacto(parseInt(igpost.followers),parseInt(igpost.likes),parseInt(igpost.shares)),
                                tags: igpost.tags
                            })
                            stringToWordsToWordsArray(igpost.message)
                            total_seguidores_ig+=parseInt(igpost.followers)
                            total_likes_ig+=parseInt(igpost.likes)
                            total_viralizacion_ig+=parseInt(igpost.shares)
                            total_resultados_ig++
                            nResults++
                        }
                    }
                })
                //console.log(allData)
                $('#totalPosts').val(nResults);
                
                //Totales en la ultima fila
                allData.push({
                    n: nResults,
                    tipoPagina: 'Total', 
                    linkPost: '',
                    fecha: '', 
                    hora: '',
                    seguidores: total_seguidores_twitter+total_seguidores_youtube+total_seguidores_fb+total_seguidores_ig,
                    likes: total_likes_twitter+total_likes_youtube+total_likes_fb+total_likes_ig,
                    viralizacion: total_viralizacion_twitter+total_viralizacion_youtube+total_viralizacion_fb+total_viralizacion_ig,
                    img: '',
                    mensaje: '',
                    autor: '',
                    impacto: '',
                    tags: ''   ,
                    id_db: ''          
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
                var reduction=new Intl.NumberFormat('en-GB', { notation: "compact", compactDisplay: "short" })
                //Eliminar todo lo que está dentro de fuentesV2
                document.getElementById("fuentesV2").textContent = '';
                //Crear DIV
                var element = document.createElement('div')
                //Insertar los datos de fuentesV2 dentro de element
                element.innerHTML= `  
                    <div class="row text-center">
                        <div class="col-sm-6 col-lg-3">
                            <div class="card">
                                <div class="card-header bg-twitter content-center">
                                    <svg class="c-icon c-icon-3xl text-white my-4">
                                    <use xlink:href="../assets/icons/brands/brands-symbol-defs.svg#twitter"></use>
                                    </svg>
                                    <div class="c-chart-wrapper">
                                    <canvas id="social-box-chart-1" height="90"></canvas>
                                    </div>
                                </div>
                                <div class="card-body row text-center">
                                    <div class="col">
                                        <div class="text-value-xl">${reduction.format(total_seguidores_twitter)}</div>
                                        <div class="text-uppercase text-muted small">Seguidores</div>
                                    </div>
                                    <div class="c-vr"></div>
                                    <div class="col">
                                        <div class="text-value-xl">${reduction.format(total_resultados_twitter)}</div>
                                        <div class="text-uppercase text-muted small">Tweets</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-3">
                            <div class="card">
                                <div class="card-header bg-youtube content-center">
                                    <svg class="c-icon c-icon-3xl text-white my-4">
                                    <use xlink:href="../assets/icons/brands/brands-symbol-defs.svg#youtube"></use>
                                    </svg>
                                    <div class="c-chart-wrapper">
                                    <canvas id="social-box-chart-1" height="90"></canvas>
                                    </div>
                                </div>
                                <div class="card-body row text-center">
                                    <div class="col">
                                    <div class="text-value-xl">${reduction.format(total_seguidores_youtube)}</div>
                                    <div class="text-uppercase text-muted small">Subs</div>
                                    </div>
                                    <div class="c-vr"></div>
                                    <div class="col">
                                    <div class="text-value-xl">${reduction.format(total_resultados_youtube)}</div>
                                    <div class="text-uppercase text-muted small">Videos</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-3">
                            <div class="card">
                                <div class="card-header bg-facebook content-center">
                                    <svg class="c-icon c-icon-3xl text-white my-4">
                                    <use xlink:href="../assets/icons/brands/brands-symbol-defs.svg#facebook-f"></use>
                                    </svg>
                                    <div class="c-chart-wrapper">
                                    <canvas id="social-box-chart-1" height="90"></canvas>
                                    </div>
                                </div>
                                <div class="card-body row text-center">
                                    <div class="col">
                                    <div class="text-value-xl">${reduction.format(total_seguidores_fb)}</div>
                                    <div class="text-uppercase text-muted small">Seguidores</div>
                                    </div>
                                    <div class="c-vr"></div>
                                    <div class="col">
                                    <div class="text-value-xl">${reduction.format(total_resultados_fb)}</div>
                                    <div class="text-uppercase text-muted small">Posts</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-3">
                            <div class="card">
                                <div class="card-header bg-instagram content-center">
                                    <svg class="c-icon c-icon-3xl text-white my-4">
                                    <use xlink:href="../assets/icons/brands/brands-symbol-defs.svg#instagram"></use>
                                    </svg>
                                    <div class="c-chart-wrapper">
                                    <canvas id="social-box-chart-1" height="90"></canvas>
                                    </div>
                                </div>
                                <div class="card-body row text-center">
                                    <div class="col">
                                    <div class="text-value-xl">${reduction.format(total_seguidores_ig)}</div>
                                    <div class="text-uppercase text-muted small">Seguidores</div>
                                    </div>
                                    <div class="c-vr"></div>
                                    <div class="col">
                                    <div class="text-value-xl">${reduction.format(total_resultados_ig)}</div>
                                    <div class="text-uppercase text-muted small">Posts</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
                //Ingresar element dentro de fuentesV2
                document.getElementById("fuentesV2").appendChild(element);
                
                //Creación de la DataTable con Resultados
                is_table_loaded=true
                $('#tablaPostsV2').DataTable({
                    destroy: true,
                    responsive: true,
                    "processing":true,
                    "paging": false, //pagingLenght -1 es mostrar todo en la misma pagina
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
                                    return '<center><img src="/assets/img/avatars/no_image.jpg" style="width:80%;border-radius: 3px"></center>'
                                }
                            }
                        },
                        {   //1 VISIBLE EXPORTAR MENSAJE
                            title: "Publicación", 
                            data: "mensaje",
                            width: "300px",
                            render: function (data, type, full, meta) {
                                if(full.tipoPagina!='Total'){
                                    //TAGS
                                    color='bg-secondary'
                                    switch(full.tipoPagina){
                                        case 'Youtube'  :color='bg-youtube'; break;
                                        case 'Twitter'  :color='bg-twitter'; break;
                                        case 'Facebook' :color='bg-facebook'; break;
                                        case 'Instagram':color='bg-instagram'; break;
                                    }
                                    tagsDiv=full.tags.split(',')
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
                                    //SENTIMENTAL ICON
                                    //Renderizar contenido
                                    window.matchMedia("(max-width: 748px)").matches?st='style="width:260px"':st='style="width:300px"'
                                    return  '<div class="small text-muted" '+st+'><span>Fecha: '+full.fecha+' - Hora: '+full.hora+'</span><br><br><strong><i class="'+arrayMotivos[Math.floor(Math.random() * arrayMotivos.length)]+' face-on-table"></i>  '+full.autor+'</strong><br><br></div><div '+st+'>' + data+'<br><br></div>'+div;
                                }else{
                                    return '' 
                                }
                            }
                            /*
                            render: function (data, type, full, meta) {
                                if(full.tipoPagina!='Total'){
                                    return '<div style="width:250px">' + data + '</div><br><div class="small text-muted" style="width:250px"><span>Fecha: '+full.fecha+' - Hora: '+full.hora;
                                }else{
                                    return '' 
                                }
                            }
                            */
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
                                    case 'Total': return data; break;
                                }
                            }
                        },
                        {   //3 VISIBLE NO EXPORTAR ALCANCE
                            title: "Alcance", 
                            data: "seguidores", 
                            //width: "15%",
                            render: function (data, type, full, meta) {
                            window.matchMedia("(max-width: 748px)").matches?st='style="min-width:158px':st=''
                            return  '<div class="clearfix" '+st+'"><div><strong>'+ formatNumberSeparator(full.seguidores) +
                                    '<small class="text-muted"> Seguidores</small><br>'+ formatNumberSeparator(full.likes) +
                                    '<small class="text-muted"> Interacciones</small><br>'+ formatNumberSeparator(full.viralizacion) +
                                    '<small class="text-muted"> Viralizaciones</small><br>';}
                        },
                        {   //4 VISIBLE NO EXPORTAR LINK
                            title: "", 
                            data: "linkPost", 
                            //width: "15%",
                            render: function ( data, type, row, meta ) {
                                if(data!=''){
                                    return '<a class="btn btn-primary" href="' + data + '" target="_blank"><i class="cil-external-link"></i</a>'
                                }else{
                                    return data
                                }
                            }
                        },
                        /* Columnas Ocultas que serán exportadas */
                        {   //5 EXPORTAR OCULTA N
                            title: "N°", 
                            data: "n", 
                            visible: false
                        },
                        {   //6 EXPORTAR OCULTA FUENTE
                            title: "Fuente", 
                            data: "tipoPagina",
                            visible: false
                        },
                        {   //7 EXPORTAR OCULTA LINK
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
                        {   //8 EXPORTAR OCULTA AUTOR
                            title: "Autor",
                            data: "autor",
                            visible: false
                        },
                        {   //9 EXPORTAR OCULTA FECHA
                            title: "Fecha ", 
                            data: "fecha", 
                            visible: false
                            //render: function (data, type, full, meta) {
                            //return '<div title="'+"Fecha y hora de esta publicación"+ '">' + data;}
                        },
                        {   //10 EXPORTAR OCULTA HORA
                            title: "Hora ", 
                            data: "hora", 
                            visible: false
                        },
                        {   //11 EXPORTAR OCULTA SEGUIDORES
                            title: "Seguidores", 
                            data: "seguidores",
                            visible: false
                            //render: function (data, type, full, meta) {
                            //return '<div title="'+"Twitter: Seguidores de la cuenta\nYoutube: Suscriptores del Canal" + '">' + data;} 
                        },
                        {   //12 EXPORTAR OCULTA INTERACCIONES
                            title: "Interacciones", 
                            data: "likes", 
                            visible: false
                            //render: function (data, type, full, meta) {
                            //return '<div title="'+"Twitter: Me gusta de la publicación\nYoutube: Likes del video" + '">' + data;} 
                        },
                        {   //13 EXPORAR OCULTA VIRALIZACIONES
                            title: "Viralizaciones", 
                            data: "viralizacion", 
                            visible: false
                            //render: function (data, type, full, meta) {
                            //return '<div title="'+"Twitter: Retweets\nYoutube: Visualizaciones\nGoogle News: Visualizaciones" + '">' + data;} 
                        },
                        {   //14 EXPORTAR OCULTA INPACTO
                            title: "Impacto", 
                            data: "impacto",
                            visible: false
                        },
                        {   //15 EXPORTAR OCULTA MENSAJE
                            title: "Mensaje", 
                            data: "mensaje",
                            visible: false
                            //render: function (data, type, full, meta) {
                            //return '<div title="'+"Twitter: Contenido del post\nYoutube: Título del video\nGoogle News: Título de la noticia"  + '">' + data;} 
                        },
                        {   //16 EXPORTAR OCULTA ETIQUETAS (Congruente con /resultados/id)
                            title: "Etiquetas", 
                            data: "tags",
                            visible: false
                            //render: function (data, type, full, meta) {
                            //return '<div title="'+"Twitter: Contenido del post\nYoutube: Título del video\nGoogle News: Título de la noticia"  + '">' + data;} 
                        },
                        {   //17 EXPORTAR OCULTA ID_DB (Congruente con /resultados/id)
                            title: "ID_DB", 
                            data: "id_db",
                            visible: false
                            //render: function (data, type, full, meta) {
                            //return '<div title="'+"Twitter: Contenido del post\nYoutube: Título del video\nGoogle News: Título de la noticia"  + '">' + data;} 
                        }         
                    ]                   
                })
                $("#tablaPostsV2_wrapper").css("display","none")
                //Botones Descargar y Actualizar
                $(document).ready(function() {
                    $("#tablaPostsV2_wrapper").css("display","none")
                    $('#tablaPostsV2').DataTable( {
                        destroy: true,
                        //Ocultar la columnas de autor, pagina y link
                        "processing":true,
                        order: [],
                        columnDefs: [
                            {orderable: false, targets: [0,1,2,3,4]}, //falta 12
                            {visible: false, targets: [15,7,6,8,9,10,11,12,13,14,5,16,17]},
                            {width: '300px', targets: [1]}
                        ],  
                        "pageLength": -1,
                        "lengthMenu": [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"] ],
                        /*
                        "initComplete": function(settings){ //Tooltip
                            $('#tablaPostsV2 thead th').each(function (i,item) {
                                var $tr = $(item);
                                switch($tr[0].innerText){
                                    case 'Seguidores':      return $tr.attr('title', "Twitter: Seguidores de la cuenta\nYoutube: Suscriptores del Canal"); break;
                                    case 'Interacciones':   return $tr.attr('title', "Twitter: Likes de la publicación\nYoutube: Likes del video"); break;
                                    case 'Viralizaciones':  return $tr.attr('title', "Twitter: Retweets (Veces compartido)\nYoutube: Visualizaciones del video\nGoogle News: Visualizaciones del artículo"); break;
                                    case 'Mensaje':         return $tr.attr('title', "Twitter: Contenido del post\nYoutube: Título del video\nGoogle News: Título de la noticia"); break;
                                } 
                            });
                            
                        },*/
                        language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
                        
                        dom: 'lrBftip',
                        buttons: [
                            {
                            //Botón Exportar a Excel
                                extend:    'excelHtml5',
                                exportOptions: {
                                    columns: [5,6,7,8,9,10,11,12,13,16,14,15,17]
                                },
                                autoFilter: true, //Sort en los header del excel exportado
                                footer: true,
                                text:      'Descargar <i class="fas fa-file-excel"></i>',
                                titleAttr: 'Exportar a Excel',
                                className: 'btn btn-primary',
                                title: nombreDeLaBusqueda+' - '+palabraClave+' | Desde el '+fechaMenorOriginal+' Hasta el '+fechaMayor,
                                filename: fechaDeLaBusqueda+' '+nombreDeLaBusqueda+' '+palabraClave,
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
                            {
                                //Botón Actualizar
                                text:'Actualizar <i class="cil-sync"></i>',
                                titleAttr: 'Actualizar resultados',
                                action: function ( e, dt, node, config ) {
                                    updateBusqueda();
                                },
                                type:'submit',
                                className: 'btn btn-success',
                            },
                            {
                                //Botón Ir al Dashboard
                                text:'Menú Dashboard <i class="cil-chart-line"></i>',
                                titleAttr: 'Ir al dashboard de la búsqueda',
                                action: function ( e, dt, node, config ) {
                                    dashboardById(busquedaId);
                                },
                                type:'submit',
                                className: 'btn btn-info',
                            },
                            //Propuesta de comodidad al usar el sistema
                            {
                                //Botón Ir a Campaña
                                text:'Campaña <i class="cil-newspaper"></i>',
                                titleAttr: 'Ir a la campaña de la búsqueda',
                                action: function ( e, dt, node, config ) {
                                    (all[5].length!=0)?campañaById_fromcr(idCampaña):toastr["success"]('La búsqueda no está en una campaña');
                                },
                                type:'submit',
                                className: 'btn btn-warning2', 
                            },
                            {
                                //Botón Ir a Análisis de resultados
                                text:'Análisis <i class="cil-filter"></i>',
                                titleAttr: 'Ir al análisis de resultados',
                                action: function ( e, dt, node, config ) {
                                    analisisById_fromcr(busquedaId);
                                },
                                type:'submit',
                                className: 'btn btn-warning3', 
                            }
                        ],
                        initComplete: function () {
                            $("#tablaPostsV2_wrapper").css("display","none")
                            var btns = $('.dt-buttons');    var fltr = $('.dataTables_filter');
                                btns.addClass('btnsOnTop');     fltr.addClass('fltrOnTop');
                            wordsTEST(words);
                            $("#tablaPostsV2_wrapper").fadeIn(1000);
                        }
                    }); 
                    hideLoading();         
                }); 
                //Integrar el boton de actualizar cuando la busqueda tiene el dia de ayer como maximo (captura de datos)
                //Se le suma un minuto a la fecha de la busqueda
                
                //Por alguna razon esto estaba asi, debia ser la fechaMayor
                var dateAndTimeMayorBusquedaUpdate=date_and_time(addMinutes(fechaBusqueda,0));
                if(dateAndTimeMayorBusquedaUpdate[0] != fechaMayor){
                    dateAndTimeMayorBusquedaUpdate[0]=fechaMayor;
                }
    
                FechaMenorUpdate=dateAndTimeMayorBusquedaUpdate[0] + 'T' + dateAndTimeMayorBusquedaUpdate[1]+ 'Z';
                //FechaMenorUpdate=dateAndTimeMayorBusquedaUpdate + 'T00:00:00Z';
    
                //console.log('Fecha Menor Update:' + FechaMenorUpdate);
                //Se actualiza la fecha mayor sumandole 1 dia y se le asignan las 08:00AM, con esto tengo la Fecha Mayor con la que se hará la actualización
                var todayDate=new Date();    
                var dateAndTimefechaMayorUpdate=date_and_time(todayDate);
                //se fijará a las 8 am
                //FechaMayorUpdate=dateAndTimefechaMayorUpdate[0]+ 'T08:00:00Z'
                //por ahora funciona en cualquier momento
                FechaMayorUpdate=dateAndTimefechaMayorUpdate[0]+ 'T' + dateAndTimefechaMayorUpdate[1]+ 'Z';
                //console.log('Temporal :' + FechaMenorUpdate+' -> '+FechaMayorUpdate)
                //console.log('Fecha Mayor Update:' + FechaMayorUpdate);
                //Código de la actualización
                //console.log('Termino de busqueda: ' + palabraClave);
                //console.log("Busqueda ID: "+ busquedaId);
                //Se tienen todos los datos necesarios para enviar a la funcion update.
                //Parametros asignados a la variable global   
                params = [busquedaId,palabraClave,FechaMenorUpdate,FechaMayorUpdate,dateAndTimeMayorBusquedaUpdate[0], dateAndTimefechaMayorUpdate[0],idCampaña]; 
                //params = [busquedaId,palabraClave,FechaMenorUpdate,FechaMayorUpdate,dateAndTimeMayorBusquedaUpdate, dateAndTimefechaMayorUpdate[0],idCampaña];  
            })
        })
    }

/*Administración de la Actualización*/
//Función que define los parametros y llama a la pantalla de carga con la información actualizada
    function updateThis(){
        words= []; //reinicializacion del array cada vez que cambia el select
        
        var busquedaId=idUpdate;
        //console.log('Se actualizará la tabla para el id: '+busquedaId);
        var fechaMenor=new Date();
        var fechaMayor=new Date();
        var fechaBusqueda=new Date();

        loadTable(busquedaId, fechaMenor, fechaMayor, fechaBusqueda);
    }
//Función que actualiza la información en la base de datos y solicita la recarga de la tabla (updateThis)
    function updateBusqueda(){
        console.log(params)
        //Definir fecha mayor de la actualizacion:
        var todayDate=new Date();    
        var dateAndTimefechaMayorUpdate=date_and_time(todayDate);
        params[3]=dateAndTimefechaMayorUpdate[0]+ 'T' + dateAndTimefechaMayorUpdate[1]+ 'Z';
        //console.log("SE HACE CON: "+ params[2]+' -> '+params[3])

        $.ajax({                                  
            url: '/tables/buscador',       
            type: 'post',
            //dataType: 'json',
            data: {
                _token : "mnt5AmLAnrXUPZbWb8gXt8Ohtb9wPdD1xEiVILb8",
                palabraClave: params[1],
                fecha1: params[2],
                fecha2: params[3],
                idBusqueda: params[0],
                uFecha1: params[4],
                uFecha2: params[5],
                idCampaña: params[6]
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
                console.log('Actualizacion con exito');
                updateThis(); 
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
//Función que redirige al menu dashboard con la busqueda o campaña seleccionada
    function dashboardById(id){
        window.location.href='menu_dashboard/'+id
    }


/*Administración de la pantalla de carga*/
//Funcion Agregar listener que está atento a un cambio de nombre en la clase de un elemento (id)
    function addClassNameListener(elemId, callback) {
        var elem = document.getElementById(elemId);
        var lastClassName = elem.className;
        window.setInterval( function() {   
        var className = elem.className;
            if (className !== lastClassName) {
                callback();   
                lastClassName = className;
            }
        },10);
    }
//Listener agregado a #sidebar; cuando cambie la variable sidebar_status lo reflejará, con esto controlo los 2 casos de la pantalla de carga
if (window.location.href.indexOf("informe") == -1 ){
    addClassNameListener("sidebar", function(){
        status_sidebar=!status_sidebar;
        if(!status_sidebar){
            //console.log("changed to: "+ status_sidebar +' (la barra está cerrada)'); 
        }else{
            //console.log("changed to: "+ status_sidebar +' (la barra está abierta)'); 
        }
    });
}
    
//Mostrar la pantalla de carga
    function showLoading() {
        if (window.location.href.indexOf("informe") == -1 ){if(!status_sidebar){
            document.querySelector('#loading').classList.add('loading_closedsidebar');
            document.querySelector('#loading-content').classList.add('loading-content_closedsidebar');
        }else{
            document.querySelector('#loading').classList.add('loading_opensidebar');
            document.querySelector('#loading-content').classList.add('loading-content_opensidebar');
        }}
        
            
    }
//Esconder la pantalla de carga
    function hideLoading() {
        if (window.location.href.indexOf("informe") == -1 ){ if(!status_sidebar){
            document.querySelector('#loading').classList.remove('loading_closedsidebar');
            document.querySelector('#loading-content').classList.remove('loading-content_closedsidebar');
        }else{
            document.querySelector('#loading').classList.remove('loading_opensidebar');
            document.querySelector('#loading-content').classList.remove('loading-content_opensidebar');
        }}
       
    }  
//Formatear numero en miles
    function formatNumberSeparator (n) {
        n = String(n).replace(/\D/g, "");
    return n === '' ? n : Number(n).toLocaleString();
    }
//Crear campaña
    function cc(){
        value = $(this).val()
        console.log(value)
    }
//Propuestas
//Función que redirige a la campaña de la busqueda en cuestion
function campañaById_fromcr(id){
    window.location.href='campaña/'+id
}
//Función que redirige al analisis de la busqueda en cuestion
function analisisById_fromcr(id){
    window.location.href='resultado/'+id
}