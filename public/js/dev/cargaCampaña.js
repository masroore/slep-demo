var busquedasSeleccionadas=[]
var c_id_selected=''
var busquedas_de_campaña = []
var selected_i;
var id_campaña_to_tag;
var tags_of_campaña;

var name_of_campaña;

arrayMotivos=["cil-happy","cil-frown","cil-meh"]

$(function(){
    if(this.getElementById('select2-add') != null){
        $('#select2-add, #select2-del').select2({
            theme: 'coreui'
        });
        $('#select2-add').change(function() {
            //console.log($(this).val());
            busquedasSeleccionadas=[$(this).val()]
        })
        $('#select2-del').change(function() {
            //console.log($(this).val());
            busquedasSeleccionadas=[$(this).val()]
        })
    }
    if (window.location.href.indexOf("tables/campa%C3%B1as_def") != -1){
        btnCloseAdd = $('#closeAddModal');
        btnCloseDelete = $('#closeDeleteModal');
        btnCloseTags = $('#closeTagsModal');
        tagsCampaniaInput =  $("#tagsOfCampania");
    }else{
        tags_c=  $("#tagsOfCampaignV2");

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

          title_div=document.getElementById('titleTagsDiv')
    }
    if (window.location.href.indexOf("/tables/campa%C3%B1as_def") != -1){
        //console.log('CAMPAÑAS VIEW')
        loadTableCampañas()
    }else{
        //console.log("Vista Campaña")
        loadTableBusquedas()
    }
    $(".container").fadeIn(1000);
    //console.log(window.location.href)
});

function addTagsToCamp(){
    var tags_c_to_add = tags_c.val().split(',')
    var tagsParsed= tags_c_to_add.map((o=>{
        return capitalize(o)
    })).join()
    $.ajax({                                  
        url: '/tables/campaña_add_tags',       
        type: 'post',
        //dataType: 'json',
        data: {
            _token : "mnt5AmLAnrXUPZbWb8gXt8Ohtb9wPdD1xEiVILb8",
            c_id: id_campaña_to_tag,
            tags: tagsParsed
        },
        beforeSend: function () {
            ////console.log('Loading Screen On');
            //showLoading();
        },
        complete: function () {
            ////console.log('Loading Screen Off');
            //hideLoading();
        },
        success: function (response) {
            //console.log('All right Etiquetas Agregadas');
            toastr["success"](tagsParsed,"Etiquetas Agregadas" )
            tags_c.tagsinput('removeAll');
            tags_c.tagsinput('add', tagsParsed);
            //hideLoading()
        },
        error: function (jqXHR, exception) {
            if (jqXHR.status === 0) {
                //console.log('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
                //console.log('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
               //console.log('Internal Server Error [500].')
            } else if (exception === 'parsererror') {
                //console.log('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                //console.log('Time out error.');
            } else if (exception === 'abort') {
                //console.log('Ajax request aborted.');
            } else {
               //console.log('Uncaught Error.\n' + jqXHR.responseText);
            }
        },
    }); 
}
function capitalize(str){
    return str.charAt(0).toUpperCase()+str.slice(1)
}

function loadTableCampañas(){
    //console.log(data)
    allData=[] ; nCampañas=0
    $.get('campañas/getAll').done(function(campañas){
        //console.log(campañas)
        campañas.map((o)=>{
            allData.push({
                n: nCampañas+1,
                nombre: o.nombre_campania,
                creacion: date_and_time(new Date(o.created_at))[0]+' '+date_and_time(new Date(o.created_at))[1],
                id: o.id,
                tags: o.tags
            })
            nCampañas++
        })
        $('#tablaCampañas').DataTable({
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
                    width: "5%",
                },
                {   //1, Visible, No Exportar
                    title: "Nombre", 
                    data: "nombre", 
                    width: "10%"
                },
                {   //2, Oculta, Exportar
                    title: "Fecha de Creación", 
                    data: "creacion", 
                    width: "10%"
                },
                {
                    title: "",
                    data: "id",
                    render: function ( data, type, full, meta ) {
                        if(data!=''){
                            return  ' <a class="btn btn-primary" title="Ver detalle de Campaña" href="campaña/' + data + '"><i class="cil-link"></i></a>'+
                                    ' <a class="btn btn-warning" data-toggle="modal" data-target="#addTagsModal" title="Etiquetas" onclick="loadTagsOnInput('+full.n+')"><i class="cil-tags"></i></a>'+
                                    ' <a class="btn btn-success" data-toggle="modal" data-target="#addModal" title="Añadir búsquedas" onclick="select_c_id('+data+')""><i class="cil-plus"></i></a>'+
                                    ' <a class="btn btn-danger" data-toggle="modal" data-target="#deleteModal" title="Quitar búsquedas" onclick="select_c_id('+data+')""><i class="cil-x"></i></a>'
                        }else{
                            return data
                        }
                    }
                }
            ],
            initComplete : function(settings,json){
                $('#tablaCampañas').DataTable({
                    destroy:true,
                    "columnDefs": [
                        {orderable: false, targets: [3]},
                        { className: "text-right", "targets": [3] }
                    ],
                    "order": [[ 0, "desc" ]],
                    language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"}
                })
            }    
        })
    }) 
}
function loadTableBusquedas(){
    showLoading() ; $('#totalPosts').val(0); $('#totalBusquedas').val(0);
    allData=[] ; busquedasData=[] ; nBusquedas=0 ; id_campaña=id ; nombre_campaña = '' ; fecha_campaña = ''
    all_desde = [] ; all_hasta = []

    $.get('../campañabyid/'+id_campaña).done(function(campaña) {
        //tagsinthisview
        id_campaña_to_tag=campaña[0].id
        tags_of_campaña=campaña[0].tags
        tags_c.tagsinput('add', tags_of_campaña);
        title_div.innerHTML=`Etiquetas de Campaña: `+ campaña[0].nombre_campania

        nombre_campaña = campaña[0].nombre_campania
        fecha_campaña = campaña[0].created_at
        $('#fechaCampaña').val(date_and_time(new Date(fecha_campaña))[0]); $('#horaCampaña').val(date_and_time(new Date(fecha_campaña))[1]);
        $('#nombreCampaña').val(nombre_campaña);
    });

    data_busquedas.map((o)=>{
        busquedasData.push({
            n: nBusquedas+1,
            nombre: o.nombre_busqueda.charAt(0).toUpperCase() + o.nombre_busqueda.slice(1),
            palabras: o.palabra_busqueda.charAt(0).toUpperCase() + o.palabra_busqueda.slice(1),
            desde: o.fecha_inicial_original,
            hasta: o.fecha_final,
            creacion: date_and_time(new Date(o.created_at))[0]+' '+date_and_time(new Date(o.created_at))[1],
            id: o.id
        })
        nBusquedas++
        all_desde.push(o.fecha_inicial_original)
        all_hasta.push(o.fecha_final)
    })

    const desde_unicas = [...new Set(all_desde.map((o) => JSON.stringify(o))),].map((string) => JSON.parse(string)).sort()
    const hasta_unicas = [...new Set(all_hasta.map((o) => JSON.stringify(o))),].map((string) => JSON.parse(string)).sort()

    $('#fechaRangoDesde').val(desde_unicas[0]); $('#fechaRangoHasta').val(hasta_unicas[hasta_unicas.length-1]);

    $('#tablaBusquedas').DataTable({
        responsive: true,
        destroy: true,
        "paging": false,
        searching: true,
        info: false,
        data: busquedasData,
        columns: [
            { //0, Visible, Exportar
                title: "N°", 
                data: "n", 
                width: "9%",
            },
            {   //1, Visible, No Exportar
                title: "Nombre de Busqueda", 
                data: "nombre", 
                width: "15%"
            },
            {
                title: "Palabras Clave",
                data: "palabras"
            },
            {
                title: "Desde",
                data: "desde"
            },
            {
                title: "Hasta",
                data: "hasta"
            },
            {   //2, Oculta, Exportar
                title: "Fecha de Creación", 
                data: "creacion", 
            },
            {
                title: "",
                data: "id",
                render: function ( data, type, row, meta ) {
                    if(data!=''){
                        return  '<a class="btn btn-primary" href="../resultado/' + data + '"><i class="cil-external-link"></i></a>'
                    }else{
                        return data
                    }
                }
            }
        ],
        initComplete : function(settings,json){
            $('#tablaBusquedas').DataTable({
                destroy:true,
                "columnDefs": [
                    {width: '250px', targets: [1]},
                ],
                info: false,
                paging: false,
                language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"}
            })
        }                     
    })
    var nResults=0
    words= []; //reinicializacion del array cada vez que cambia el select
    var wordsCloudArray = []; //array que contendra los objetos word en base al array words y será ocupado por la wordcloud  
    var datos_fuentes = []; //Elementos de la tabla de fuentes
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
         total_seguidores_ig = 0;
         total_likes_ig = 0;
         total_viralizacion_ig = 0;
         total_resultados_ig = 0;
    $.get('../campañas/'+id_campaña+'/all').done(function(all) {
        posts=all[0];videos=all[1];news=all[2];fbposts=all[3];igposts=all[4];
        Object.values(posts).forEach(function callback(post, i, data) {
            allData.push({
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
                id_db: post.id,
                tags: post.tags
            })
            ////console.log('Dato '+allData.length+' Twitter')
            stringToWordsToWordsArray(post.tweet)
            total_seguidores_twitter+=parseInt(post.followers)
            total_likes_twitter+=parseInt(post.fav)
            total_viralizacion_twitter+=parseInt(post.rt)
            total_resultados_twitter++
            nResults++
        })
        Object.values(videos).forEach(function callback(video, i, data) {
            allData.push({
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
                id_db: video.id,
                tags: video.tags
            })
            ////console.log('Dato '+allData.length+' Youtube')
            stringToWordsToWordsArray(video.description)
            total_seguidores_youtube+=parseInt(video.channel_subs)
            total_likes_youtube+=parseInt(video.likes)
            total_viralizacion_youtube+=parseInt(video.views)
            total_resultados_youtube++
            nResults++
        })
        /*Object.values(news).forEach(function callback(art, i, data) {
            if(art.link.includes('https://www') || art.link.includes('http://www')){
                if(!art.link.includes('&')){
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
                    ////console.log('Dato '+allData.length+' GNews')
                    stringToWordsToWordsArray(art.title)
                    total_seguidores_google_news+=parseInt(0)
                    total_likes_google_news+=parseInt(0)
                    total_viralizacion_google_news+=parseInt(0)
                    total_resultados_google_news++
                    nResults++
                }
            }
        })*/
        Object.values(fbposts).forEach(function callback(fbpost, i, data) {
            if(fbpost.url.includes('https://www') || fbpost.url.includes('http://www')){
                if(!fbpost.url.includes('&')){
                    allData.push({
                        n: nResults+1, 
                        tipoPagina: "Facebook", 
                        linkPost: fbpost.url,
                        fecha: date_and_time(new Date(fbpost.date.replaceAll('-','/')))[0],
                        hora:date_and_time(new Date(fbpost.date.replaceAll('-','/')))[1],
                        seguidores: parseInt(fbpost.followers),
                        likes: parseInt(fbpost.likes),
                        viralizacion: parseInt(fbpost.shares)+parseInt(fbpost.comments), //Comentarios sumados a viraliacion
                        img: fbpost.image_url,
                        mensaje: fbpost.message,
                        autor: fbpost.autor,
                        impacto: getIndiceImpacto(parseInt(fbpost.followers),parseInt(fbpost.likes),(parseInt(fbpost.shares)+parseInt(fbpost.comments))),
                        id_db: fbpost.id,
                        tags: fbpost.tags
                    })
                    ////console.log('Dato '+allData.length+' Facebook')
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
                        id_db: igpost.id,
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
        $('#totalBusquedas').val(nBusquedas);

        //wordsCloudArray=llenarArray(words);
        //wordscloud(wordsCloudArray);
        /*for(var i=0;i<wordsCloudArray.length;i++){
            //console.log(wordsCloudArray[i].size)
        }*/
        
        
        //Totales en la ultima fila
        allData.push({
            n: nResults,
            tipoPagina: 'Total', 
            linkPost: '',
            fecha: '', 
            hora: '',
            seguidores: total_seguidores_twitter+total_seguidores_youtube+total_seguidores_google_news+total_seguidores_fb,
            likes: total_likes_twitter+total_likes_youtube+total_likes_google_news+total_likes_fb,
            viralizacion: total_viralizacion_twitter+total_viralizacion_youtube+total_viralizacion_google_news+total_viralizacion_fb,
            img: '',
            mensaje: '',
            autor: '',
            impacto: '',
            id_db:'',
            tags:''
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
        $('#tablaResultados').DataTable({
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
                {   //2 VISIBLE NO EXPORTAR FUENTE
                    title: "<center>Fuente</center>", 
                    data: "tipoPagina", 
                    //width: "15%",
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
                {   //3 VISIBLE NO EXPORTAR ALCANCE
                    title: "Alcance", 
                    data: "seguidores", 
                    //width: "15%",
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
                                '<small class="text-muted"> Viralizaciones</small><br>';
                    }
                },
                {   //4 VISIBLE NO EXPORTAR LINK
                    title: "", 
                    data: "linkPost", 
                    //width: "15%",
                    render: function ( data, type, row, meta ) {
                        if(data!=''){
                            return '<a class="btn btn-primary" href="' + data + '" target="_blank"><i class="cil-external-link"></i></a>'
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
        //Botones Descargar y Actualizar
        $(document).ready(function() {
            $('#tablaResultados').DataTable( {
                destroy: true,
                //Ocultar la columnas de autor, pagina y link
                order: [],
                columnDefs: [
                    {orderable: false, targets: [0,1,2,3,4]}, //falta 12
                    {visible: false, targets: [15,7,6,8,9,10,11,12,13,14,5,16,17]},
                    {width: '300px', targets: [1]},
                ],  
                "pageLength": -1,
                language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
                dom: 'Bfrtip',
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
                        title: 'Campaña: '+nombre_campaña,
                        filename: 'Campaña '+nombre_campaña,
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
                    /*{
                        //Botón Actualizar
                        text:'Actualizar <i class="cil-sync"></i>',
                        titleAttr: 'Actualizar resultados',
                        action: function ( e, dt, node, config ) {
                            updateBusqueda();
                        },
                        type:'submit',
                        className: 'btn btn-success',
                    },*/
                    {
                        //Botón Ir al Dashboard
                        text:'Menú Dashboard <i class="cil-sync"></i>',
                        titleAttr: 'Ir al dashboard de la búsqueda',
                        action: function ( e, dt, node, config ) {
                            dashboardByCId('c'+id_campaña);
                        },
                        type:'submit',
                        className: 'btn btn-info',
                    },
                    {
                        //Botón Ir al Informe Lector
                        text:'Informe Lector <i class="cil-spreadsheet"></i>',
                        titleAttr: 'Ir al informe lector de la búsqueda',
                        action: function ( e, dt, node, config ) {
                            informeByCId('c'+id_campaña);
                        },
                        type:'submit',
                        className: 'btn btn-light',
                    }
                ],
            }); 
            wordsTEST(words);
            hideLoading();         
        }); 
    })
}
function loadTagsOnInput(i){
    c_id_selected=allData[i-1].id
    selected_i=i-1
    tagsCampaniaInput.tagsinput('removeAll');
    tagsCampaniaInput.tagsinput('add', allData[i-1].tags);
}

function addSearch(){
    //console.log('c_id: '+c_id_selected)
    //console.log('b_id: '+busquedasSeleccionadas)
    //console.log(busquedas_de_campaña)

    busquedasFiltradas=busquedasSeleccionadas

    busquedas_de_campaña.map((s_in_c=>{
        busquedasSeleccionadas.map((selected_s=>{
            if(s_in_c == selected_s){
                busquedasFiltradas = arrayRemove(busquedasFiltradas,selected_s)
            }
        }))
    }))

    
    $.ajax({                                  
        url: '/tables/campaña_add_busquedas',       
        type: 'post',
        //dataType: 'json',
        data: {
            _token : "mnt5AmLAnrXUPZbWb8gXt8Ohtb9wPdD1xEiVILb8",
            c_id: c_id_selected,
            b_id: busquedasFiltradas
        },
        beforeSend: function () {
            ////console.log('Loading Screen On');
            showLoading();
        },
        complete: function () {
            ////console.log('Loading Screen Off');
            //hideLoading();
        },
        success: function (response) {
            //console.log('All right');
            $('#select2-add').val(null)
            $('#select2-del').val(null)
            hideLoading()
            //location.reload();
            loadTableCampañas()
            btnCloseAdd.click()
        },
        error: function (jqXHR, exception) {
            if (jqXHR.status === 0) {
                //console.log('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
                //console.log('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
               //console.log('Internal Server Error [500].')
            } else if (exception === 'parsererror') {
                //console.log('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                //console.log('Time out error.');
            } else if (exception === 'abort') {
                //console.log('Ajax request aborted.');
            } else {
               //console.log('Uncaught Error.\n' + jqXHR.responseText);
            }
        },
    }); 
    

}
function deleteSearch(){
    //console.log('c_id: '+c_id_selected)
    //console.log('b_id: '+busquedasSeleccionadas)
    //console.log(busquedas_de_campaña)

    $.ajax({                                  
        url: '/tables/campaña_delete_busquedas',       
        type: 'post',
        //dataType: 'json',
        data: {
            _token : "mnt5AmLAnrXUPZbWb8gXt8Ohtb9wPdD1xEiVILb8",
            c_id: c_id_selected,
            b_id: busquedasSeleccionadas
        },
        beforeSend: function () {
            ////console.log('Loading Screen On');
            showLoading();
        },
        complete: function () {
            ////console.log('Loading Screen Off');
            //hideLoading();
        },
        success: function (response) {
            $('#select2-add').val(null)
            $('#select2-del').val(null)
            //console.log('All right');
            hideLoading()
            //location.reload();
            loadTableCampañas()
            btnCloseDelete.click()
        },
        error: function (jqXHR, exception) {
            if (jqXHR.status === 0) {
                //console.log('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
                //console.log('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
               //console.log('Internal Server Error [500].')
            } else if (exception === 'parsererror') {
                //console.log('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                //console.log('Time out error.');
            } else if (exception === 'abort') {
                //console.log('Ajax request aborted.');
            } else {
               //console.log('Uncaught Error.\n' + jqXHR.responseText);
            }
        },
    }); 
}
function addTagsCampania(){
    var the_tags_campania = tagsCampaniaInput.val()
    $.ajax({                                  
        url: '/tables/campaña_add_tags',       
        type: 'post',
        //dataType: 'json',
        data: {
            _token : "mnt5AmLAnrXUPZbWb8gXt8Ohtb9wPdD1xEiVILb8",
            c_id: c_id_selected,
            tags: the_tags_campania
        },
        beforeSend: function () {
            ////console.log('Loading Screen On');
            showLoading();
        },
        complete: function () {
            ////console.log('Loading Screen Off');
            //hideLoading();
        },
        success: function (response) {
            //console.log('All right');
            hideLoading()
            loadTableCampañas()
            //location.reload();
            btnCloseTags.click()
            tagsCampaniaInput.tagsinput('removeAll');
        },
        error: function (jqXHR, exception) {
            if (jqXHR.status === 0) {
                //console.log('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
                //console.log('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
               //console.log('Internal Server Error [500].')
            } else if (exception === 'parsererror') {
                //console.log('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                //console.log('Time out error.');
            } else if (exception === 'abort') {
                //console.log('Ajax request aborted.');
            } else {
               //console.log('Uncaught Error.\n' + jqXHR.responseText);
            }
        },
    }); 
}

function dashboardByCId(id){
    window.location.href='../menu_dashboard/'+id
}
function informeByCId(id){
    window.location.href='/../../../informe/'+id
}

function select_c_id(id){
    c_id_selected = id
    $('#select2-add').val(null);
    busquedasSeleccionadas=[]
    busquedas_de_campaña=[]

    $.get('busquedasbyid/'+id).done(function(busquedas) {
        busquedas.map((o=>{
            busquedas_de_campaña.push(o.id)
        }))

        d_select = document.getElementById("select2-del")
        
        while (d_select.firstChild) {
            d_select.removeChild(d_select.firstChild);
        }
        if(busquedas_de_campaña.length==0){
            var option_def = document.createElement('option')
                option_def.setAttribute('selected','true');
                option_def.setAttribute('disabled','true');
                option_def.textContent = 'Esta campaña no tiene busquedas';
            d_select.appendChild(option_def)
        }else{
            var option_def = document.createElement('option')
                option_def.setAttribute('selected','true');
                option_def.setAttribute('disabled','true');
                option_def.textContent = 'Seleccionar una busqueda...';
            d_select.appendChild(option_def)
            busquedas.map((o,i)=>{
                var option = document.createElement('option')
                    option.setAttribute('value',o.id);
                    option.textContent = o.nombre_busqueda+':'+o.palabra_busqueda;
                d_select.appendChild(option)
            })
        }
        
    });
}

function arrayRemove(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}