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

    title_div_options=document.getElementById('titleMultipleOptions')
    mModal_btn=''
    //mModal_btn=document.getElementById("openMultipleTagsModalBtn")
    load_one_search_table()
    /*
    disabled = document.getElementById('tags-disabled')
    enabled = document.getElementById('tags-enabled')
    deleteAll_disabled = document.getElementById('deletetags-disabled')
    deleteAll_enabled = document.getElementById('deletetags-enabled')*/
     //tagsInput =  $("#tagsOfElement");
    tagsInModal = document.getElementById('tagsInModal')
    btnCloseTagsModal = $('#closeTagsModal');
    btnCloseMultipleTagsModal = $('#closeMultipleTagsModal');
    $(".container").fadeIn(1000);
});
var reduction=new Intl.NumberFormat('en-GB', { notation: "compact", compactDisplay: "short" })
var tableOfData;
var to_multiple_function=[]
var selected_multiple_rows=[]

var tags_available=[]
var the_tags
var allData=[]
var itemSelected
var wannaDeleteThis

var total_seguidores_twitter = 0;
var total_seguidores_youtube = 0;
var total_seguidores_fb = 0;
var total_seguidores_ig = 0;

var total_likes_twitter = 0;
var total_likes_youtube = 0;
var total_likes_fb = 0;
var total_likes_ig = 0;

var total_viralizacion_twitter = 0;
var total_viralizacion_youtube = 0;
var total_viralizacion_fb = 0;
var total_viralizacion_ig = 0;

var total_resultados_ig = 0;
var total_resultados_fb = 0;
var total_resultados_youtube = 0;
var total_resultados_twitter = 0;
datos_fuentes = [];

is_table_loaded=false
arrayMotivos=["cil-happy","cil-frown","cil-meh"]
function load_one_search_table(){
    (is_table_loaded)?$('#tablaPostsV3').DataTable().clear().destroy():null
    $('#tablaPostsV3').contents().remove();
    showLoading()
    idBusqueda = one_search.id
    nombreDeLaBusqueda = one_search.nombre_busqueda ; //title_div_options.innerHTML=`Opciones de Busqueda: `+ nombreDeLaBusqueda
    palabraClave = one_search.palabra_busqueda
    fechaMenor = one_search.fecha_inicial
    fechaMayor = one_search.fecha_final

    var fechaBusquedaOriginal = new Date(one_search.created_at);  
    var createdAt = date_and_time(fechaBusquedaOriginal);

    fechaBusqueda = new Date(one_search.updated_at);   
    var updatedAt = date_and_time(fechaBusqueda);

    fechaDeLaBusqueda=createdAt[0]; //Nombre del Excel

    $('#nombreBusqueda').val(nombreDeLaBusqueda)
    $('#keyWords').val(palabraClave)
    $('#fechaBusqueda').val(createdAt[0])
    $('#horaBusqueda').val(createdAt[1])
    $('#fechaRangoDesde').val(fechaMenor)
    $('#fechaRangoHasta').val(fechaMayor)


    allData=[]
    var nResults=0
    var fechaMenorOriginal=new Date();    
    words= []; //reinicializacion del array cada vez que cambia el select
    var wordsCloudArray = []; //array que contendra los objetos word en base al array words y será ocupado por la wordcloud  
    //Totales Twitter
        total_seguidores_twitter = 0;
        total_likes_twitter = 0;
        total_viralizacion_twitter = 0;
        total_resultados_twitter = 0;
    //Totales YT
        total_seguidores_youtube = 0;
        total_likes_youtube = 0;
        total_viralizacion_youtube = 0;
        total_resultados_youtube = 0;
    //TotalesFB
        total_seguidores_fb = 0;
        total_likes_fb = 0;
        total_viralizacion_fb = 0;
        total_resultados_fb = 0;
    //TotalesIG
        total_seguidores_ig = 0;
        total_likes_ig = 0;
        total_viralizacion_ig = 0;
        total_resultados_ig = 0;
    datos_fuentes = []; //Elementos de la tabla de fuentes
    //AJAX nos devuelve informacion, en este caso en un json y la mostramos a traves de js
    $.get('../consulta_resultados/'+idBusqueda+'/all').done(function(all){
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
            tags: '',
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
        load_sheet2_table()
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
                            <use xlink:href="../../assets/icons/brands/brands-symbol-defs.svg#twitter"></use>
                            </svg>
                            <div class="c-chart-wrapper">
                            <canvas id="social-box-chart-1" height="90"></canvas>
                            </div>
                        </div>
                        <div class="card-body row text-center">
                            <div class="col">
                                <div id="_all_fo_TW" class="text-value-xl">${reduction.format(total_seguidores_twitter)}</div>
                                <div class="text-uppercase text-muted small">Seguidores</div>
                            </div>
                            <div class="c-vr"></div>
                            <div class="col">
                                <div id="_all_TW" class="text-value-xl">${reduction.format(total_resultados_twitter)}</div>
                                <div class="text-uppercase text-muted small">Tweets</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 col-lg-3">
                    <div class="card">
                        <div class="card-header bg-youtube content-center">
                            <svg class="c-icon c-icon-3xl text-white my-4">
                            <use xlink:href="../../assets/icons/brands/brands-symbol-defs.svg#youtube"></use>
                            </svg>
                            <div class="c-chart-wrapper">
                            <canvas id="social-box-chart-1" height="90"></canvas>
                            </div>
                        </div>
                        <div class="card-body row text-center">
                            <div class="col">
                            <div id="_all_fo_YT" class="text-value-xl">${reduction.format(total_seguidores_youtube)}</div>
                            <div class="text-uppercase text-muted small">Subs</div>
                            </div>
                            <div class="c-vr"></div>
                            <div class="col">
                            <div id="_all_YT" class="text-value-xl">${reduction.format(total_resultados_youtube)}</div>
                            <div class="text-uppercase text-muted small">Videos</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 col-lg-3">
                    <div class="card">
                        <div class="card-header bg-facebook content-center">
                            <svg class="c-icon c-icon-3xl text-white my-4">
                            <use xlink:href="../../assets/icons/brands/brands-symbol-defs.svg#facebook-f"></use>
                            </svg>
                            <div class="c-chart-wrapper">
                            <canvas id="social-box-chart-1" height="90"></canvas>
                            </div>
                        </div>
                        <div class="card-body row text-center">
                            <div class="col">
                            <div id="_all_fo_FB" class="text-value-xl">${reduction.format(total_seguidores_fb)}</div>
                            <div class="text-uppercase text-muted small">Seguidores</div>
                            </div>
                            <div class="c-vr"></div>
                            <div class="col">
                            <div id="_all_FB" class="text-value-xl">${reduction.format(total_resultados_fb)}</div>
                            <div class="text-uppercase text-muted small">Posts</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 col-lg-3">
                    <div class="card">
                        <div class="card-header bg-instagram content-center">
                            <svg class="c-icon c-icon-3xl text-white my-4">
                            <use xlink:href="../../assets/icons/brands/brands-symbol-defs.svg#instagram"></use>
                            </svg>
                            <div class="c-chart-wrapper">
                            <canvas id="social-box-chart-1" height="90"></canvas>
                            </div>
                        </div>
                        <div class="card-body row text-center">
                            <div class="col">
                            <div id="_all_fo_IG" class="text-value-xl">${reduction.format(total_seguidores_ig)}</div>
                            <div class="text-uppercase text-muted small">Seguidores</div>
                            </div>
                            <div class="c-vr"></div>
                            <div class="col">
                            <div id="_all_IG" class="text-value-xl">${reduction.format(total_resultados_ig)}</div>
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
        $('#tablaPostsV3').DataTable({
            destroy: true,
            responsive: true,
            
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
                            return  '<div class="small text-muted" style="width:300px"><span>Fecha: '+full.fecha+' - Hora: '+full.hora+'</span><br><br><strong><i class="'+arrayMotivos[Math.floor(Math.random() * arrayMotivos.length)]+' face-on-table"></i>  '+full.autor+'</strong><br><br></div><div style="width:300px">' + data+'<br><br></div>'+div;
                        }else{
                            return '' 
                        }
                    }
                },
                {   //TEST ANIMO (es la 2, oculta por ahora)
                    title: "<center>Sentimental</center>", 
                    data: "tipoPagina", 
                    //width: "15%",
                    render: function (data, type, full, meta) {
                        switch(data){
                            case 'Youtube': return '<center><i class="'+arrayMotivos[Math.floor(Math.random() * arrayMotivos.length)]+'"></i></center>'; break;
                            case 'Twitter': return '<center><i class="cil-meh"></i></center>'; break;
                            case 'Facebook': return '<center><i class="cil-frown"></i></center>'; break;
                            case 'Instagram': return '<center><i class="cil-meh"></i></center>'; break;
                            case 'Total': return data; break;
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
                            case 'Total': return data; break;
                        }
                    }
                },
                {   //3 VISIBLE NO EXPORTAR ALCANCE
                    title: "Alcance", 
                    data: "seguidores", 
                    render: function (data, type, full, meta) {
                        tooltip=""
                        switch(full.tipoPagina){
                            case 'Youtube': tooltip='<div class="clearfix" title="Seguidores: Suscriptores\u000dInteracciones: Likes\u000dViralizaciones: Visualizaciones">'; break;
                            case 'Twitter': tooltip='<div class="clearfix" title="Seguidores: Seguidores\u000dInteracciones: Likes\u000dViralizaciones: Retweets">'; break;
                            case 'Facebook': tooltip='<div class="clearfix" title="Seguidores: Amigos/Seguidores\u000dInteracciones: Reacciones\u000dViralizaciones: Veces compartido">'; break;
                            case 'Instagram': tooltip='<div class="clearfix" title="Seguidores: Seguidores\u000dInteracciones: Likes\u000dViralizaciones: Veces compartido">'; break;
                            case 'Total': tooltip='<div class="clearfix" title="Totales">'; break;
                        }
                    return  tooltip+'<div class="float-left"><strong>'+ formatNumberSeparator(full.seguidores) +
                            '<small class="text-muted"> Seguidores</small><br>'+ formatNumberSeparator(full.likes) +
                            '<small class="text-muted"> Interacciones</small><br>'+ formatNumberSeparator(full.viralizacion) +
                            '<small class="text-muted"> Viralizaciones</small><br>';}
                },
                {   //4 NO VISIBLE NO EXPORTAR BOTON ETIQUETAS
                    title: "", 
                    data: "n", 
                    /*width: "5%",
                    render: function ( data, type, row, meta ) {
                        if(data!=''){
                            return '<a class="btn btn-warning" data-toggle="modal" data-target="#tagsModal" onclick="showTags('+data+')"><i class="cil-tags"></i></a>'
                        }else{
                            return data
                        }
                    }*/
                },
                {   //5 VISIBLE NO EXPORTAR LINK
                    title: "", 
                    data: "linkPost", 
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
                {   //15 EXPORTAR OCULTA IMPACTO
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
                {   //18 NO VISIBLE NO EXPORTAR DELETE
                    title: "", 
                    data: "n", 
                    /*width: "5%",
                    render: function ( data, type, full, meta ) {
                        if(full.tipoPagina!='Total'){
                            if(data!=''){
                                return '<a class="btn btn-danger" onclick="deletePost('+data+')""><i class="cil-trash"></i></a>'
                            }else{
                                return data
                            }
                        }else{
                            return ''
                        }
                    }*/
                },
                {   //19 EXPORTAR OCULTA ID_DB
                    title: "ID_DB", 
                    data: "id_db",
                    visible: false
                    //render: function (data, type, full, meta) {
                    //return '<div title="'+"Twitter: Contenido del post\nYoutube: Título del video\nGoogle News: Título de la noticia"  + '">' + data;} 
                },     
            ]            
        })
            
        //Botones Descargar y Actualizar
        $(function() {
            $('#tablaPostsV3').DataTable( {
                "deferRender": true,
                destroy: true,
                //Ocultar la columnas de autor, pagina y link
                order: [],
                fixedColums: true,
                //select:         true,
                columnDefs: [
                    {orderable: false, targets: [0,1,2,3,4,5]}, //falta 12
                     //{visible: false, targets: [6,7,8,9,10,11,12,13,14,15,16,17,19]},
                    {visible: false, targets: [2,7,8,9,10,11,12,13,14,15,16,17,18,20,5,19]},
                    {width: '300px', targets: [1]}
                ],  
                "pageLength": -1,
                "lengthMenu": [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"] ],
                language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
                
                dom: 'lBfrtip',
                buttons: [
                    {
                    //Botón Exportar a Excel
                        extend:    'excelHtml5',
                        exportOptions: {
                            //columns: [7,8,9,10,11,12,13,14,15,17,16,19]
                            columns: [8,9,10,11,12,13,14,15,18,16,17,20]
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
                            addSheet(xlsx, '#resultados_sumatoria', 'Resultados por RR.SS', 'Sumatoria por red', '2');
                        }                                    
                    },
                    {
                        //Botón Ir al Dashboard
                        text:'Menú Dashboard <i class="cil-chart-line"></i>',
                        titleAttr: 'Ir al dashboard de la búsqueda',
                        action: function ( e, dt, node, config ) {
                            dashboardOneSearchById(idBusqueda);
                        },
                        type:'submit',
                        className: 'btn btn-info',
                    },
                    //<a id="openMultipleTagsModalBtn" class="btn btn-info" onclick="showMultipleTags()">Etiquetar <i class="cil-tags"></i></a>
                    {
                        //Botón Etiquetas
                        attr:  {
                            id:"openMultipleTagsModalBtn"
                        },
                        text:'Etiquetar <i class="cil-tags"></i>',
                        titleAttr: 'Etiquetar resultados seleccionados',
                        action: function ( e, dt, node, config ) {
                            showMultipleTags();
                        },
                        type:'submit',
                        className: 'btn btn-warning3',
                    },
                    {
                        //Botón Eliminar
                        attr:  {
                            id:"deleteMultipleRows"
                        },
                        text:'Eliminar <i class="cil-trash"></i>',
                        titleAttr: 'Eliminar resultados seleccionados',
                        action: function ( e, dt, node, config ) {
                            checkDeleteMultipleRows();
                        },
                        type:'submit',
                        className: 'btn btn-danger',
                    }
                ],
                initComplete: function () {
                    var btns = $('.dt-buttons');
                    btns.addClass('btnsOnTop');
                    var fltr = $('.dataTables_filter');
                    fltr.addClass('fltrOnTop');
                    mModal_btn=document.getElementById("openMultipleTagsModalBtn")
                }
            });     
            var table = $('#tablaPostsV3').DataTable();  
            tableOfData = table;
            //Al seleccionar una fila se lanza la siguiente funcion
            $('#tablaPostsV3 tbody').on( 'click', 'tr', function (e, dt, type, indexes) {
                $(this).toggleClass('selected');
                selected_multiple_rows=table.rows('.selected').data()
                if(selected_multiple_rows.length==0){
                    mModal_btn.removeAttribute('data-toggle');
                    mModal_btn.removeAttribute('data-target');         
                }else{
                    mModal_btn.setAttribute('data-toggle','modal');
                    mModal_btn.setAttribute('data-target','#multipleTagsModal');  
                    //Condicion para validar que existan etiquetas
                    if(tags_available.length==0){
                        mModal_btn.removeAttribute('data-toggle');
                        mModal_btn.removeAttribute('data-target'); 
                    }        
                }              
                /* FUNCION QUE SELECCIONA SOLO UNA FILA DE LA TABLA
                
                if ( $(this).hasClass('selected') ) {
                    $(this).removeClass('selected');
                }
                else {
                    table.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }
                */
            } );
            /*$('#buttonLRT').click( function () {
                to_multiple_function=[]

                alert( table.rows('.selected').data().length +' row(s) selected' );
                selected_multiple_rows=table.rows('.selected').data()
                selected_multiple_rows.map((row=>{
                    to_multiple_function.push({
                        source: row[7],
                        id_db: row[19]
                    })
                }))
            } );*/
        }); 
        tags_available=[]
        $.get('../campañas_de_busqueda/'+idBusqueda).done(function(campañas){
            campañas.map((campaña=>{
                campaña.tags.split(',').map((tag=>{
                    (tag!='' && tag!=' ')?tags_available.push(tag):null
                }))
            }))
        })
        wordsTEST(words);
        hideLoading();  
    })
}
function load_sheet2_table(){
    $('#resultados_sumatoria').contents().remove();
    $('#resultados_sumatoria').DataTable({
        destroy: true,
        responsive: true,
        paging: false, //pagingLenght -1 es mostrar todo en la misma pagina
        searching: false,
        info: false,
        autoWidth: false,
        data: datos_fuentes,
        columns: [
            { 
                title: "Fuente", 
                data: "fuente"
            },  
            { 
                title: "Resultados", 
                data: "t_resultados"
            },    
            { 
                title: "Seguidores", 
                data: "t_seguidores"
            },    
            { 
                title: "Interacciones", 
                data: "t_likes"
            },    
            { 
                title: "Viralización", 
                data: "t_viralizacion"
            },     
        ]            
    })
    $(function() {
        $('#resultados_sumatoria').DataTable( {
            destroy: true,
            searching: false,
            order: [],
            fixedColums: true,
            language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
            dom: 'Bfrt',
            buttons: [

            ]
        });     
    }); 
}
function dashboardOneSearchById(id){
    window.location.href='../menu_dashboard/'+id
}
function addTags(){
    //alert(itemSelected.id+' '+itemSelected.source)
    //var the_tags = tagsInput.val()
    switch(itemSelected.source){
        case 'Twitter':
            $.ajax({                                  
                url: '/tables/tags_tw',       
                type: 'post',
                data: {
                    _token : "mnt5AmLAnrXUPZbWb8gXt8Ohtb9wPdD1xEiVILb8",
                    id: itemSelected.id,
                    tags: the_tags
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
                    allData[itemSelected.i-1].tags=the_tags
                    toastr["success"]('Etiqueta agregada al resultado')
                    hideLoading();
                    load_one_search_table()
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
            break;
        case 'Youtube':
            $.ajax({                                  
                url: '/tables/tags_yt',       
                type: 'post',
                data: {
                    _token : "mnt5AmLAnrXUPZbWb8gXt8Ohtb9wPdD1xEiVILb8",
                    id: itemSelected.id,
                    tags: the_tags
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
                    allData[itemSelected.i-1].tags=the_tags
                    toastr["success"]('Etiqueta agregada al resultado')
                    hideLoading();
                    load_one_search_table()
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
            break;
        case 'Google News':
            $.ajax({                                  
                url: '/tables/tags_gn',       
                type: 'post',
                data: {
                    _token : "mnt5AmLAnrXUPZbWb8gXt8Ohtb9wPdD1xEiVILb8",
                    id: itemSelected.id,
                    tags: the_tags
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
                    allData[itemSelected.i-1].tags=the_tags
                    toastr["success"]('Etiqueta agregada al resultado')
                    hideLoading();
                    load_one_search_table()
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
            break;
        case 'Facebook':
            $.ajax({                                  
                url: '/tables/tags_fb',       
                type: 'post',
                data: {
                    _token : "mnt5AmLAnrXUPZbWb8gXt8Ohtb9wPdD1xEiVILb8",
                    id: itemSelected.id,
                    tags: the_tags
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
                    allData[itemSelected.i-1].tags=the_tags
                    toastr["success"]('Etiqueta agregada al resultado')
                    hideLoading();
                    load_one_search_table()
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
            break;
        case 'Instagram':
            $.ajax({                                  
                url: '/tables/tags_ig',       
                type: 'post',
                data: {
                    _token : "mnt5AmLAnrXUPZbWb8gXt8Ohtb9wPdD1xEiVILb8",
                    id: itemSelected.id,
                    tags: the_tags
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
                    allData[itemSelected.i-1].tags=the_tags
                    toastr["success"]('Etiqueta agregada al resultado')
                    hideLoading();
                    load_one_search_table()
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
            break;
    }
}
function showTags(i){
    /*
    disabled.setAttribute("hidden","hidden")
    deleteAll_disabled.setAttribute("hidden","hidden")
    enabled.removeAttribute("hidden")
    deleteAll_enabled.removeAttribute("hidden")
    */
    itemSelected={
        i: i,
        id: allData[i-1].id_db,
        source: allData[i-1].tipoPagina
    }
    console.log(allData[i-1].id_db)
    /*
    tagsInput.tagsinput('removeAll');
    tagsInput.tagsinput('add', allData[i-1].tags);
    */
//DESDE AQUI NUEVA FUNCION DE TAGS
    $(tagsInModal).contents().remove();
    tags_available.map((tag=>{
        col = document.createElement('div')
        col.className = 'col'

        center = document.createElement('center')

        btn = document.createElement('button')
        btn.setAttribute('class','btn btn-primary');
        btn.setAttribute('type','button');
        btn.textContent = tag;
        btn.setAttribute('onclick','setTags("'+tag+'")');

        center.append(btn)
        col.append(center)

        tagsInModal.append(col)
    }))
}
function setTags(tag){
    the_tags=tag
    if(allData[itemSelected.i-1].tags.includes(tag)){
        the_tags=allData[itemSelected.i-1].tags
        toastr["success"]('Esta etiqueta ya está asociada al resultado')
    }else{
        if(allData[itemSelected.i-1].tags==''||allData[itemSelected.i-1].tags==' '){
            the_tags=tag
        }else{
            the_tags=allData[itemSelected.i-1].tags+','+tag
        }
        btnCloseTagsModal.click()
        addTags()   
    }
}
//NO SE USA
function selectSomething(){
    alert('Debes seleccionar un resultado')
}
//NO SE USA
function removeAllTags(){
    tagsInput.tagsinput('removeAll');
    addTags()
    load_one_search_table()
}
function deletePost(i){
    console.log(allData[i-1])

    wannaDeleteThis={
        i: i,
        id: allData[i-1].id_db,
        source: allData[i-1].tipoPagina
    }

    console.log(wannaDeleteThis)

    /*tagsInput.tagsinput('removeAll');
    disabled.removeAttribute("hidden")
    deleteAll_disabled.removeAttribute("hidden")
    enabled.setAttribute("hidden","hidden")
    deleteAll_enabled.setAttribute("hidden","hidden")*/

    switch(wannaDeleteThis.source){
        case 'Twitter':
            $.ajax({                                  
                url: '/tables/delete_tw',       
                type: 'post',
                data: {
                    _token : "mnt5AmLAnrXUPZbWb8gXt8Ohtb9wPdD1xEiVILb8",
                    id: wannaDeleteThis.id,

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
                    toastr["success"]('Resultado eliminado')
                    hideLoading();
                    load_one_search_table()
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
            break;
        case 'Youtube':
            $.ajax({                                  
                url: '/tables/delete_yt',       
                type: 'post',
                data: {
                    _token : "mnt5AmLAnrXUPZbWb8gXt8Ohtb9wPdD1xEiVILb8",
                    id: wannaDeleteThis.id,

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
                    toastr["success"]('Resultado eliminado')
                    hideLoading();
                    load_one_search_table()
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
            break;
        case 'Google News':
            $.ajax({                                  
                url: '/tables/delete_gn',       
                type: 'post',
                data: {
                    _token : "mnt5AmLAnrXUPZbWb8gXt8Ohtb9wPdD1xEiVILb8",
                    id: wannaDeleteThis.id,

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
                    toastr["success"]('Resultado eliminado')
                    hideLoading();
                    load_one_search_table()
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
            break;
        case 'Facebook':
            $.ajax({                                  
                url: '/tables/delete_fb',       
                type: 'post',
                data: {
                    _token : "mnt5AmLAnrXUPZbWb8gXt8Ohtb9wPdD1xEiVILb8",
                    id: wannaDeleteThis.id,
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
                    toastr["success"]('Resultado eliminado')
                    hideLoading();
                    load_one_search_table()
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
            break;
        case 'Instagram':
            $.ajax({                                  
                url: '/tables/delete_ig',       
                type: 'post',
                data: {
                    _token : "mnt5AmLAnrXUPZbWb8gXt8Ohtb9wPdD1xEiVILb8",
                    id: wannaDeleteThis.id,
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
                    toastr["success"]('Resultado eliminado')
                    hideLoading();
                    load_one_search_table()
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
            break;
    }
}

//Implementacion para eliminacion y etiquetado de multiples filas de una tabla
function showMultipleTags(){
    to_multiple_function=[]
    //Condicion para validar que existan etiquetas
    if(tags_available.length==0){
        toastr["warning"]("Debes agregar etiquetas en la campaña para usar esta función")
    }else{
        if(selected_multiple_rows.length==0){
            toastr["success"]("Debes seleccionar resultados para usar esta función")
        }else{
               // originalmente 7 y 19
                selected_multiple_rows.map((row=>{
                    to_multiple_function.push({
                        source: row[8],
                        id_db: row[20]
                    })
                }))
                
                $(multipleTagsInModal).contents().remove();
                tags_available.map((tag=>{
                    col = document.createElement('div')
                    col.className = 'col'
                    center = document.createElement('center')
                    btn = document.createElement('button')
                    btn.setAttribute('class','btn btn-primary');
                    btn.setAttribute('type','button');
                    btn.textContent = tag;
                    btn.setAttribute('onclick','addTagsToMultipleResults("'+tag+'")');
                    center.append(btn)
                    col.append(center)
                    multipleTagsInModal.append(col)
                })) 
            
            
        }
    }
    
}
function addTagsToMultipleResults(tag){
    btnCloseMultipleTagsModal.click()

    console.log(tag)
    console.log(to_multiple_function)

    $.ajax({                                  
        url: '/tables/multiple_tags',       
        type: 'post',
        data: {
            _token : "mnt5AmLAnrXUPZbWb8gXt8Ohtb9wPdD1xEiVILb8",
            results: to_multiple_function,
            tag: tag
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
            toastr["success"]("Etiquetas Agregadas en "+(to_multiple_function.length)+" resultados")
            hideLoading();
            selected_multiple_rows=[]
            to_multiple_function=[]
            mModal_btn.removeAttribute('data-toggle');
            mModal_btn.removeAttribute('data-target');         
            load_one_search_table()
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
function checkDeleteMultipleRows(){
    to_multiple_function=[]
    if(selected_multiple_rows.length==0){
        toastr["success"]("Debes seleccionar resultados para usar esta función")
    }else{
        selected_multiple_rows.map((row=>{
            //7,19,12,13,14 originalmente
            to_multiple_function.push({
                source: row[8],
                id_db: row[20],
                followers: row[13],
                likes: row[14],
                vir: row[15]
            })
        }))
        tableOfData.rows('.selected').remove().draw( false );
        $.ajax({                                  
            url: '/tables/multiple_delete',       
            type: 'post',
            data: {
                _token : "mnt5AmLAnrXUPZbWb8gXt8Ohtb9wPdD1xEiVILb8",
                results: to_multiple_function
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
                toastr["success"]("Se eliminaron "+(to_multiple_function.length)+" resultados")
                var del_tw=0;var del_yt=0;var del_fb=0;var del_ig=0
                var del_tw_followers=0;var del_yt_followers=0;var del_fb_followers=0;var del_ig_followers=0
                var del_tw_likes=0;var del_yt_likes=0;var del_fb_likes=0;var del_ig_likes=0
                var del_tw_vir=0;var del_yt_vir=0;var del_fb_vir=0;var del_ig_vir=0
                var new_followers=0;var new_likes=0;var new_vir=0
                to_multiple_function.map((o=>{
                    switch(o.source){
                        case 'Twitter':
                            del_tw++
                            del_tw_followers+=parseInt(o.followers)
                            del_tw_likes+=parseInt(o.likes)
                            del_tw_vir+=parseInt(o.vir)
                            break;
                        case 'Youtube':
                            del_yt++
                            del_yt_followers+=parseInt(o.followers)
                            del_yt_likes+=parseInt(o.likes)
                            del_yt_vir+=parseInt(o.vir)
                            break;
                        case 'Facebook':
                            del_fb++
                            del_fb_followers+=parseInt(o.followers)
                            del_fb_likes+=parseInt(o.likes)
                            del_fb_vir+=parseInt(o.vir)
                            break;
                        case 'Instagram':
                            del_ig++
                            del_ig_followers+=parseInt(o.followers)
                            del_ig_likes+=parseInt(o.likes)
                            del_ig_vir+=parseInt(o.vir)
                            break;    
                    }
                }))
                //console.log(del_tw+' '+del_yt+' '+del_fb+' '+del_ig)
                //console.log('Total: '+(del_tw+del_yt+del_fb+del_ig))
                $('#totalPosts').val($('#totalPosts').val()-(del_tw+del_yt+del_fb+del_ig)); 
                document.getElementById('_all_TW').innerHTML = parseInt(document.getElementById('_all_TW').innerHTML)-del_tw
                document.getElementById('_all_YT').innerHTML = parseInt(document.getElementById('_all_YT').innerHTML)-del_yt
                document.getElementById('_all_FB').innerHTML = parseInt(document.getElementById('_all_FB').innerHTML)-del_fb
                document.getElementById('_all_IG').innerHTML = parseInt(document.getElementById('_all_IG').innerHTML)-del_ig

                datos_fuentes[0].t_seguidores=(datos_fuentes[0].t_seguidores)-del_tw_followers
                datos_fuentes[1].t_seguidores=(datos_fuentes[1].t_seguidores)-del_yt_followers
                datos_fuentes[2].t_seguidores=(datos_fuentes[2].t_seguidores)-del_fb_followers
                datos_fuentes[3].t_seguidores=(datos_fuentes[3].t_seguidores)-del_ig_followers

                datos_fuentes[0].t_resultados=(datos_fuentes[0].t_resultados)-del_tw
                datos_fuentes[1].t_resultados=(datos_fuentes[1].t_resultados)-del_yt
                datos_fuentes[2].t_resultados=(datos_fuentes[2].t_resultados)-del_fb
                datos_fuentes[3].t_resultados=(datos_fuentes[3].t_resultados)-del_ig

                datos_fuentes[0].t_likes=(datos_fuentes[0].t_likes)-del_tw_likes
                datos_fuentes[1].t_likes=(datos_fuentes[1].t_likes)-del_yt_likes
                datos_fuentes[2].t_likes=(datos_fuentes[2].t_likes)-del_fb_likes
                datos_fuentes[3].t_likes=(datos_fuentes[3].t_likes)-del_ig_likes

                datos_fuentes[0].t_viralizacion=(datos_fuentes[0].t_viralizacion)-del_tw_vir
                datos_fuentes[1].t_viralizacion=(datos_fuentes[1].t_viralizacion)-del_yt_vir
                datos_fuentes[2].t_viralizacion=(datos_fuentes[2].t_viralizacion)-del_fb_vir
                datos_fuentes[3].t_viralizacion=(datos_fuentes[3].t_viralizacion)-del_ig_vir
                
                document.getElementById('_all_fo_TW').innerHTML = reduction.format((datos_fuentes[0].t_seguidores))
                document.getElementById('_all_fo_YT').innerHTML = reduction.format((datos_fuentes[1].t_seguidores))
                document.getElementById('_all_fo_FB').innerHTML = reduction.format((datos_fuentes[2].t_seguidores))
                document.getElementById('_all_fo_IG').innerHTML = reduction.format((datos_fuentes[3].t_seguidores))

                new_followers=(allData[allData.length-1].seguidores)-(del_tw_followers+del_yt_followers+del_fb_followers+del_ig_followers)
                new_likes=(allData[allData.length-1].likes)-(del_tw_likes+del_yt_likes+del_fb_likes+del_ig_likes)
                new_vir=(allData[allData.length-1].viralizacion)-(del_tw_vir+del_yt_vir+del_fb_vir+del_ig_vir)
                //console.log(new_followers,new_likes,new_vir)
                //console.log(del_tw_followers+del_yt_followers+del_fb_followers+del_ig_followers)

                /*
                tableOfData.row(tableOfData.rows()[0].length-1).data(
                    ["<center><img src=\"\" style=\"width:80%;border-radius: 3px\"></center>",
                    "",
                    "Total",
                    "<div class=\"clearfix\"><div class=\"float-left\"><strong>"+formatNumberSeparator(new_followers)+"<small class=\"text-muted\"> Seguidores</small><br>"+formatNumberSeparator(new_likes)+"<small class=\"text-muted\"> Interacciones</small><br>"+formatNumberSeparator(new_vir)+"<small class=\"text-muted\"> Viralizaciones</small><br></strong></div></div>",
                    "<a class=\"btn btn-warning\" data-toggle=\"modal\" data-target=\"#tagsModal\" onclick=\"showTags(allData.length-1)\"><i class=\"cil-tags\"></i></a>",
                    "",
                    allData.length,
                    "Total",
                    "",
                    "",
                    "",
                    "",
                    ""+new_followers+"",
                    ""+new_likes+"",
                    ""+new_vir+"",
                    "0","","","",""])
                */
                    tableOfData.row(tableOfData.rows()[0].length-1).data(
                        ["<center><img src=\"\" style=\"width:80%;border-radius: 3px\"></center>",
                        "",
                        "Total",
                        "Total",
                        "<div class=\"clearfix\"><div class=\"float-left\"><strong>"+formatNumberSeparator(new_followers)+"<small class=\"text-muted\"> Seguidores</small><br>"+formatNumberSeparator(new_likes)+"<small class=\"text-muted\"> Interacciones</small><br>"+formatNumberSeparator(new_vir)+"<small class=\"text-muted\"> Viralizaciones</small><br></strong></div></div>",
                        "<a class=\"btn btn-warning\" data-toggle=\"modal\" data-target=\"#tagsModal\" onclick=\"showTags(allData.length-1)\"><i class=\"cil-tags\"></i></a>",
                        "",
                        allData.length,
                        "Total",
                        "",
                        "",
                        "",
                        "",
                        ""+new_followers+"",
                        ""+new_likes+"",
                        ""+new_vir+"",
                        "0","","","",""])
                load_sheet2_table()
                hideLoading();
                selected_multiple_rows=[]
                to_multiple_function=[]
                mModal_btn.removeAttribute('data-toggle');
                mModal_btn.removeAttribute('data-target');  
                //load_one_search_table()
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
}
//2 Hojas Excel
function addSheet(xlsx, table, title, name, sheetId) {
    //Clones sheet from Sheet1 to build new sheet.
    //Params:
    //  xlsx: xlsx object.
    //  table: table ID.
    //  title: Title for top row or blank if no title.
    //  name: Name of new sheet.
    //  sheetId: string containing sheetId for new sheet.
    //Returns:
    //  Updated sheet object.
    
    //Add sheet2 to [Content_Types].xml => <Types>
    //============================================
    var source = xlsx['[Content_Types].xml'].getElementsByTagName('Override')[1];
    var clone = source.cloneNode(true);
    clone.setAttribute('PartName','/xl/worksheets/sheet' + sheetId + '.xml');
    xlsx['[Content_Types].xml'].getElementsByTagName('Types')[0].appendChild(clone);
    
    //Add sheet relationship to xl/_rels/workbook.xml.rels => Relationships
    //=====================================================================
    var source = xlsx.xl._rels['workbook.xml.rels'].getElementsByTagName('Relationship')[0];
    var clone = source.cloneNode(true);
    clone.setAttribute('Id','rId'+sheetId+1);
    clone.setAttribute('Target','worksheets/sheet' + sheetId + '.xml');
    xlsx.xl._rels['workbook.xml.rels'].getElementsByTagName('Relationships')[0].appendChild(clone);
    
    //Add second sheet to xl/workbook.xml => <workbook><sheets>
    //=========================================================
    var source = xlsx.xl['workbook.xml'].getElementsByTagName('sheet')[0];
    var clone = source.cloneNode(true);
    clone.setAttribute('name', name);
    clone.setAttribute('sheetId', sheetId);
    clone.setAttribute('r:id','rId'+sheetId+1);
    xlsx.xl['workbook.xml'].getElementsByTagName('sheets')[0].appendChild(clone);
    
    //Add sheet2.xml to xl/worksheets
    //===============================
    var newSheet = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" mc:Ignorable="x14ac">'+
      getTableData(table, title) +
      
      '</worksheet>';

    xlsx.xl.worksheets['sheet' + sheetId + '.xml'] = $.parseXML(newSheet);
}
function getHeaderNames(table) {
    // Gets header names.
    //params:
    //  table: table ID.
    //Returns:
    //  Array of column header names.

    var header = $(table).DataTable().columns().header().toArray();

    var names = [];
    header.forEach(function(th) {
        names.push($(th).html());
    });
        
    return names;
}
function buildCols(data) {
    // Builds cols XML.
    //To do: deifne widths for each column.
    //Params:
    //  data: row data.
    //Returns:
    //  String of XML formatted column widths.

    var cols = '<cols>';

    for (i=0; i<data.length; i++) {
        colNum = i + 1;
        cols += '<col min="' + colNum + '" max="' + colNum + '" width="20" customWidth="1"/>';
    }

    cols += '</cols>';

    return cols;
}
function buildRow(data, rowNum, styleNum) {
    // Builds row XML.
    //Params:
    //  data: Row data.
    //  rowNum: Excel row number.
    //  styleNum: style number or empty string for no style.
    //Returns:
    //  String of XML formatted row.

    var style = styleNum ? ' s="' + styleNum + '"' : '';

    var row = '<row r="' + rowNum + '">';

    for (i=0; i<data.length; i++) {
        colNum = (i + 10).toString(36).toUpperCase();  // Convert to alpha
        
        var cr = colNum + rowNum;
        
        row += '<c t="inlineStr" r="' + cr + '"' + style + '>' +
                '<is>' +
                '<t>' + data[i] + '</t>' +
                '</is>' +
            '</c>';
    }
        
    row += '</row>';
        
    return row;
}
function getTableData(table, title) {
    // Processes Datatable row data to build sheet.
    //Params:
    //  table: table ID.
    //  title: Title displayed at top of SS or empty str for no title.
    //Returns:
    //  String of XML formatted worksheet.

    var header = getHeaderNames(table);
    var table = $(table).DataTable();
    var rowNum = 1;
    var mergeCells = '';
    var ws = '';

    ws += buildCols(header);
    ws += '<sheetData>';

    if (title.length > 0) {
        ws += buildRow([title], rowNum, 51);
        rowNum++;
        
        mergeCol = ((header.length - 1) + 10).toString(36).toUpperCase();
        
        mergeCells = '<mergeCells count="1">'+
        '<mergeCell ref="A1:' + mergeCol + '1"/>' +
                    '</mergeCells>';
    }
                        
    ws += buildRow(header, rowNum, 2);
    rowNum++;

    // Loop through each row to append to sheet.    
    table.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var data = this.data();
        
        // If data is object based then it needs to be converted 
        // to an array before sending to buildRow()
        ws += buildRow(data, rowNum, '');
        
        rowNum++;
    } );

    ws += '</sheetData>' + mergeCells;
        
    return ws;
}
function setSheetName(xlsx, name) {
    // Changes tab title for sheet.
    //Params:
    //  xlsx: xlxs worksheet object.
    //  name: name for sheet.

    if (name.length > 0) {
        var source = xlsx.xl['workbook.xml'].getElementsByTagName('sheet')[0];
        source.setAttribute('name', name);
    }
}

