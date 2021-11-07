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
});
is_table_loaded=false
function firestore_farmacos(){
    (is_table_loaded)?$('#farmacos_dt').DataTable().clear().destroy():null; $('#farmacos_dt').contents().remove();

    //Creación de la DataTable con Resultados
    is_table_loaded=true
    $('#farmacos_dt').DataTable({
        destroy: true,responsive: true,"paging": true,searching: true,
        data: farmacos,autoWidth: false,
        columns: [
            {   
                title: "Nombre", 
                data: "data.nombre", 
                width: "30%", 
                render: function (data, type, full, meta) {
                    return data+'<div class="small text-muted"><span>'+full.data.forma+'</span> | '+full.data.dosificacion.join()+'</div>'
                }
            }, 
            {   
                title: "Enfermedad", 
                data: "data.enfermedad_asociada", 
                width: "25%", 
                render: function (data, type, full, meta) {
                    return '<div class="text-muted">'+data.join('</div><div class="text-muted">')
                }
            },    
            {   
                title: "Frecuencia", 
                data: "data.frecuencia_administracion", 
                width: "11%", 
                render: function (data, type, full, meta) {
                    string=''
                    for (var i = 0, len = data.length; i < len; i++) {
                        data[i]==1?string+='<span class="text-capitalize badge bg-twitter" style="color:white;">'+data[i]+' al día</span>':
                        data[i]==2?string+='<span class="text-capitalize badge bg-youtube" style="color:white;">'+data[i]+' al día</span>':
                        data[i]==3?string+='<span class="text-capitalize badge bg-facebook" style="color:white;">'+data[i]+' al día</span>':
                        data[i]==4?string+='<span class="text-capitalize badge bg-primary" style="color:white;">'+data[i]+' al día</span>':
                        null
                        i<len?string+='<br>':null
                    }
                    return string
                }
            },    
            {   
                title: "N. Comercial", 
                data: "data.nombre_comercial", 
                //width: "11%", 
                render: function (data, type, full, meta) {
                    if(data.length==1){
                        if(data[0]==""){
                            return "-"
                        }
                        return '<span class="text-capitalize badge bg-primary" style="color:white;">'+data
                    }else{
                        return '<span class="text-capitalize badge bg-primary" style="color:white;">'+data.join('</span><br><span class="text-capitalize badge bg-primary" style="color:white;">')+'</span>'
                    } 
                }
            },        
            {   
                title: "Recomendaciones", 
                data: "data.recomendaciones", 
                className: "text-center",
                //width: "11%", 
                render: function (data, type, full, meta) {
                    if(data==""){
                    return '<button disabled class="btn btn-dark" href="' + data + '" target="_blank"><i class="cil-info"></i></button>'}
                    return '<a class="btn btn-info" href="' + data + '" target="_blank"><i class="cil-info"></i></a>'
                }
            },        
        ],
        "pageLength": 10,
        "lengthMenu": [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"] ],
        language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
        initComplete: function () {
            $('#farmacos_dt thead').addClass('thead-light');
        }            
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