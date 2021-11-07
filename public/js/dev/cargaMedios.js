$(function(){
    $('#select2-1').on('change', onSelectBusquedaMedios);
    //Loading WordCloud
    if(document.getElementById('loadingWordcloud')!=null){
        ldnWC = document.getElementById('loadingWordcloud')
        ldnWC.setAttribute("hidden","hidden")
        if ((window.location.href.indexOf("tables/campa%C3%B1a/")||window.location.href.indexOf("tables/resultado/")) != -1){
            ldnWC.removeAttribute("hidden")
        }
    }
    $(".container").fadeIn(500);
});
/*Variables Globales*/
    var nResults=0
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
    function onSelectBusquedaMedios(){
        $("#wordscloud").empty();
        ldnWC.removeAttribute("hidden")
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
        var palabraClave=new String;
        loadTableMedios(busquedaId, fechaMenor, fechaMayor, fechaBusqueda, palabraClave);
    }
    is_table_loaded=false
//Función que llama a la carga de la tabla al seleccionar una búsqueda
    function loadTableMedios(busquedaId, fechaMenor, fechaMayor, fechaBusqueda, palabraClave){
        (is_table_loaded)?$('#tablaMedios').DataTable().clear().destroy():null
        $('#tablaMedios').contents().remove();
        var idBusqueda = busquedaId
        var allData=[]
        
        $('#totalPosts').val(0);
        var fechaMenorOriginal=new Date();    
        words= []; //reinicializacion del array cada vez que cambia el select
        var wordsCloudArray = []; //array que contendra los objetos word en base al array words y será ocupado por la wordcloud  
        
        //Totales GN
            var total_seguidores_google_news = 0;
            var total_likes_google_news = 0;
            var total_viralizacion_google_news = 0;
            var total_resultados_google_news = 0;

        var idCampaña=''

        var datos_fuentes = []; //Elementos de la tabla de fuentes
        //AJAX nos devuelve informacion, en este caso en un json y la mostramos a traves de js
        $.get('consulta_resultados/'+idBusqueda+'/detalles', function(detalles){

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
            
        })
        $.get('consulta_resultados/'+idBusqueda+'/news').done(function(news){
            nResults=0
            Object.values(news).forEach(function callback(art, i, data) {  
            if(art.link.includes('https://www') || art.link.includes('http://www')){
                if(!art.link.includes('&')){

                    (av_medios.find(x => (x.url.indexOf(art.link.match(/:\/\/(.[^/]+)/)[0].split('//')[1]))!=-1))!=undefined?
                    media_image = (av_medios.find(x => (x.url.indexOf(art.link.match(/:\/\/(.[^/]+)/)[0].split('//')[1]))!=-1)).imagen:
                    media_image = "Sin imagen"

                    allData.push({
                        n: nResults+1, 
                        tipoPagina: "Google News", 
                        linkPost: art.link,
                        fecha: date_and_time(new Date(art.published_date.replaceAll('-','/')))[0],
                        hora:date_and_time(new Date(art.published_date.replaceAll('-','/')))[1], 
                        seguidores: parseInt(0),
                        likes: parseInt(0),
                        viralizacion: parseInt(0),
                        img: media_image,
                        mensaje: art.title,
                        autor: art.source,
                        impacto: getIndiceImpacto(0,0,0)
                    })
                    //console.log('Dato '+allData.length+' GNews')
                    stringToWordsToWordsArray(art.title)
                    total_seguidores_google_news+=parseInt(0)
                    total_likes_google_news+=parseInt(0)
                    total_viralizacion_google_news+=parseInt(0)
                    total_resultados_google_news++
                    nResults++
                }
            }
            })
            $('#totalPosts').val(nResults);
            
            /*Totales en la ultima fila
            allData.push({
                n: nResults,
                tipoPagina: 'Total', 
                linkPost: '',
                fecha: '', 
                hora: '',
                seguidores: total_seguidores_google_news,
                likes: total_likes_google_news,
                viralizacion: total_viralizacion_google_news,
                img: '',
                mensaje: '',
                autor: '',
                impacto: 0        
            })*/
            datos_fuentes.push(
                {
                    fuente: 'Google News', 
                    t_resultados: total_resultados_google_news,
                    t_seguidores: total_seguidores_google_news, 
                    t_likes: total_likes_google_news,
                    t_viralizacion: total_viralizacion_google_news,
                }
            )
            
            //Creación de la DataTable con Resultados
            is_table_loaded=true
            $('#tablaMedios').DataTable({
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
                                return '<center><img src="/assets/img/medios_images/'+ data + '" style="width:80%;border-radius: 3px"></center>'}
                            else{
                                return '<center><img src="/assets/img/avatars/no_image_medios.png" style="width:80%;border-radius: 3px"></center>'
                            }
                        }
                    },
                    {   //1 VISIBLE EXPORTAR MENSAJE
                        title: "Publicación", 
                        data: "mensaje",
                        width: "70% !important",
                        render: function (data, type, full, meta) {
                            if(full.tipoPagina!='Total'){
                                return '<div style="width:100%">' + data.substring(0, data.lastIndexOf(" -")) + '</div><br><div class="small text-muted" style="width:100%"><span>Fecha: '+full.fecha+' - Hora: '+full.hora;
                            }else{
                                return '' 
                            }
                        }
                    },
                    /*
                    {   //2 VISIBLE NO EXPORTAR FUENTE
                        title: "<center>Fuente</center>", 
                        data: "tipoPagina", 
                        //width: "15%",
                        render: function (data, type, full, meta) {
                            switch(data){
                                case 'Google News': return '<center><i class="cib-google"></i></center>'; break;
                                case 'Total': return data; break;
                            }
                        }
                    },
                    */
                    {   //2 VISIBLE NO EXPORTAR AUTOR
                        title: "<center>Autor</center>", 
                        data: "autor", 
                        width: "14% !important",
                        className: "text-center",
                        render: function ( data, type, row, meta ) {
                            if(data!=''){
                                return '<smail><strong>'+data
                            }else{
                                return data
                            }
                        }
                    },
                    {   //3 INVISIBLE NO EXPORTAR ALCANCE
                        title: "Alcance", 
                        data: "seguidores", 
                        //width: "25%",
                        render: function (data, type, full, meta) {
                        return  '<div class="clearfix"><div class="float-left"><strong>'+ formatNumberSeparator(full.seguidores) +
                                '<small class="text-muted"> Seguidores</small><br>'+ formatNumberSeparator(full.likes) +
                                '<small class="text-muted"> Interacciones</small><br>'+ formatNumberSeparator(full.viralizacion) +
                                '<small class="text-muted"> Viralizaciones</small><br>';}
                    },
                    {   //4 VISIBLE NO EXPORTAR LINK
                        title: "", 
                        data: "linkPost", 
                        className: "text-center",
                        width: "15%",
                        render: function ( data, type, row, meta ) {
                            if(data!=''){
                                return '<a class="btn btn-primary" href="' + data + '" target="_blank"><center><i class="cil-external-link"></center></a>'
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
                        visible: false,
                        render: function (data, type, full, meta) {
                            return data.substring(0, data.lastIndexOf(" -"));
                        } 
                    }       
                ]                   
            })
            //Botones Descargar y Actualizar
            $(document).ready(function() {
                $('#tablaMedios').DataTable( {
                    destroy: true,
                    //Ocultar la columnas de autor, pagina y link
                    order: [],
                    columnDefs: [
                        {orderable: false, targets: [0,1,2,3,4]}, //falta 12
                        {visible: false, targets: [15,7,6,8,9,10,11,12,13,14,5,3]},
                    ],  
                    "pageLength": -1,
                    language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
                    
                    dom: 'Bfrtip',
                    buttons: [
                        {
                        //Botón Exportar a Excel
                            extend:    'excelHtml5',
                            exportOptions: {
                                columns: [5,7,8,9,10,11,12,13,14,15]
                            },
                            autoFilter: true, //Sort en los header del excel exportado
                            footer: true,
                            text:      'Descargar <i class="fas fa-file-excel"></i>',
                            titleAttr: 'Exportar a Excel',
                            className: 'btn btn-primary',
                            title: 'Medios Sociales: '+nombreDeLaBusqueda+' - '+palabraClave+' | Desde el '+fechaMenorOriginal+' Hasta el '+fechaMayor,
                            filename: fechaDeLaBusqueda+' Medios Sociales de la Busqueda '+nombreDeLaBusqueda+' '+palabraClave,
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
                            titleAttr: 'Ir al dashboard de la búsqueda',
                            action: function ( e, dt, node, config ) {
                                dashboardMediosById(busquedaId);
                            },
                            type:'submit',
                            className: 'btn btn-info',
                        }
                    ],
                }); 
                wordsTEST(words);
                hideLoading();         
            }); 
        })
    }
//Función que redirige al menu dashboard con la busqueda o campaña seleccionada
    function dashboardMediosById(id){
        window.location.href='menu_dashboard_medios/'+id
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
    addClassNameListener("sidebar", function(){
        status_sidebar=!status_sidebar;
        if(!status_sidebar){
            //console.log("changed to: "+ status_sidebar +' (la barra está cerrada)'); 
        }else{
            //console.log("changed to: "+ status_sidebar +' (la barra está abierta)'); 
        }
    });
//Mostrar la pantalla de carga
    function showLoading() {
        if(!status_sidebar){
            document.querySelector('#loading').classList.add('loading_closedsidebar');
            document.querySelector('#loading-content').classList.add('loading-content_closedsidebar');
        }else{
            document.querySelector('#loading').classList.add('loading_opensidebar');
            document.querySelector('#loading-content').classList.add('loading-content_opensidebar');
        }
            
    }
//Esconder la pantalla de carga
    function hideLoading() {
        if(!status_sidebar){
            document.querySelector('#loading').classList.remove('loading_closedsidebar');
            document.querySelector('#loading-content').classList.remove('loading-content_closedsidebar');
        }else{
            document.querySelector('#loading').classList.remove('loading_opensidebar');
            document.querySelector('#loading-content').classList.remove('loading-content_opensidebar');
        }
    }  
//Formatear numero en miles
    function formatNumberSeparator (n) {
        n = String(n).replace(/\D/g, "");
    return n === '' ? n : Number(n).toLocaleString();
    }