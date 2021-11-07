var v1=false;var v2=false;var v3=false;var v4=false;
var all_v = ['v1','v2','v3','v4'];

var e1=true;var e2=true;var e3=true;var e4=true;
var all_e = ['e1','e2','e3','e4'];
var evt = document.createEvent('HTMLEvents');
    evt.initEvent('change', false, true);

$(function(){
    //Validador del modal Nuevo Medio
    add_listener('new_nombre_Medios','v1','',all_v,'successNewMedioModal')
    add_listener('new_tipo_Medios','v2','Seleccionar tipo del medio...',all_v,'successNewMedioModal')
    add_listener('new_alcance_Medios','v3','Seleccionar alcance del medio...',all_v,'successNewMedioModal')
    add_listener('new_url_Medios','v4','',all_v,'successNewMedioModal')
    $('#new_image_upload').on('change',function(e){
        $(this).next('.custom-file-label').html(e.target.files[0].name);
    })
    $('#new_image_upload_clear').on('click',function(){
        $("#new_image_upload").val('');
        $("#new_image_upload").next('.custom-file-label').html('Seleccionar un archivo...');
    })

    //Validador del modal Editar Medio
    add_listener('edit_nombre_Medios','e1','',all_e,'successEditMedioModal')
    add_listener('edit_tipo_Medios','e2','Seleccionar tipo del medio...',all_e,'successEditMedioModal')
    add_listener('edit_alcance_Medios','e3','Seleccionar alcance del medio...',all_e,'successEditMedioModal')
    add_listener('edit_url_Medios','e4','',all_e,'successEditMedioModal')
    $('#edit_image_upload').on('change',function(e){
        $(this).next('.custom-file-label').html(e.target.files[0].name);
    })
    $('#edit_image_upload_clear').on('click',function(){
        $("#edit_image_upload").val('');
        $("#edit_image_upload").next('.custom-file-label').html('Seleccionar un archivo...');
    })

    showLoading()
    title.includes('Busquedas')?c_busquedas():title.includes('Resultados Asíncronos')?c_async():title.includes('Web Services')?c_ws():title.includes('Roles')?c_roles_aslacker():title.includes('Medios Sociales')?c_medios_sociales():false
});

function add_listener(id,variable,condicion,variables,boton){
    document.getElementById(id).
    addEventListener("change", function(){
        console.log('called')
        document.getElementById(id).value==condicion?window[variable]=false:window[variable]=true
        var i = 0;var len = variables.length;
        while (i < len) {
            if(window[variables[i]]==false){nv=false;break;}            
            nv=true;i++
        }
        if(id.indexOf('new')!=-1){
            isValidUri(document.getElementById('new_url_Medios').value)?
            (document.getElementById('new_url_Medios').classList.remove('is-invalid'),console.log('VALIDA')):
            (document.getElementById('new_url_Medios').value=='')?(document.getElementById('new_url_Medios').classList.remove('is-invalid'),console.log('VACIA')):
            (document.getElementById('new_url_Medios').classList.add('is-invalid'),console.log('INVALIDA'),nv=false)
        }
        
        if(id.indexOf('edit')!=-1){
            isValidUri(document.getElementById('edit_url_Medios').value)?
            (document.getElementById('edit_url_Medios').classList.remove('is-invalid'),console.log('VALIDA')):
            (document.getElementById('edit_url_Medios').value=='')?(document.getElementById('edit_url_Medios').classList.remove('is-invalid'),console.log('VACIA')):
            (document.getElementById('edit_url_Medios').classList.add('is-invalid'),console.log('INVALIDA'),nv=false)
        }

        if(nv){document.getElementById(boton).disabled=false;document.getElementById(boton).setAttribute("data-dismiss","modal")}
        else{document.getElementById(boton).disabled=true;document.getElementById(boton).removeAttribute("data-dismiss")}
    }, false);
}

var csrf_token=document.querySelector('meta[name="csrf-token"]').getAttribute('content');
var table_busquedas
var editor;

/*Mantenedor Escrito*/
var table
var selected_row_data=[]
var selected_row_index;

function c_busquedas(){
    table_busquedas=$('#cpaneltable').DataTable({
        processing: true,
        serverSide: true,
        ajax: "/getBusquedasGestor",

       /* destroy:true,responsive:true,searching:true,info:true,data:data,autoWidth:true,*/
        columns: [
            {
                title: "User", 
                data: "user", 
                width: "5%", 
                render: {
                    _:function ( data, type, full, meta ) {
                        //return `<a data-toggle="modal" data-target="#userDetailsModal" title="`+data+`" onclick="loadUserDetails('`+btoa(JSON.stringify(full.user))+`')">`+data.slice(0,8)+`</a>`
                        return `<a class="btn btn-primary" data-toggle="modal" data-target="#userDetailsModal" title="`+data.name+`" onclick="loadUserDetails('`+btoa(JSON.stringify(full.user))+`')" style="min-width: 8vh;max-width: 8vh;"><small><strong>`+data.id
                    },
                    sort: function(data,type,full,meta){
                        return data.id
                    }
                }
            },
            {
                title: "Busq", 
                data: "id", 
                width: "5%", 
                render: {
                    _:function ( data, type, row, meta ) {
                        //return `<a data-toggle="modal" data-target="#busquedaDetailsModal" title="`+data+`" onclick="loadBusquedaDetails(`+row.id+`)">`+data.slice(0,8)+`</a>`
                        return `<a class="btn btn-facebook" data-toggle="modal" data-target="#busquedaDetailsModal" title="`+row.nombre_busqueda+`" onclick="loadBusquedaDetails(`+data+`)" style="min-width: 8vh;max-width: 8vh;"><small><strong>`+data
                    },
                    sort: function(data,type,row,meta){
                        return parseInt(data)
                    }
                }
            },     
            {
                title: "Camp", 
                data: "campañas", 
                width: "5%", 
                render: {
                    _:function ( data, type, full, meta ) {
                        if(full.campañas.length>0){
                            //return `<a data-toggle="modal" data-target="#campañaDetailsModal" title="`+data[0].nombre_campania+`" onclick="loadCampañaDetails('`+btoa(JSON.stringify(full.campañas[0]))+`')">`+data[0].nombre_campania.slice(0,8)+`</a>`
                            return `<a class="btn btn-yahoo" data-toggle="modal" data-target="#campañaDetailsModal" title="`+data[0].nombre_campania+`" onclick="loadCampañaDetails('`+btoa(JSON.stringify(full.campañas[0]))+`')" style="min-width: 8vh;max-width: 8vh;"><small><strong>`+data[0].id
                        }
                        return '-'
                    },
                    sort: function(data,type,full,meta){
                        return data[0].id
                    }
                }   
            },     
            {
                title: "Keywords", 
                data: "palabra_busqueda", 
                width: "5%" ,
                render: {
                    _:function ( data, type, full, meta ) {
                        return data
                    },
                    sort: function(data,type,full,meta){
                        return data
                    }
                }      
            },   
            {
                title: "Fecha", 
                data: "created_at", 
                width: "5%",
                render: {
                    _:function ( data, type, full, meta ) {
                        return `<small><strong>`+date_and_time(new Date(data.replaceAll('T',' ').replaceAll('-','/')))[0].replaceAll('-','/')+`<br>`+date_and_time(new Date(data.replaceAll('T',' ').replaceAll('-','/')))[1]
                    },
                    sort: function(data,type,full,meta){
                        return data
                    }
                } 
            },        
            {
                title: '<i class="cib-twitter"></i>', 
                data: "json_busqueda", 
                width: "5%",
                render: function ( data, type, full, meta ) {
                    if(data.includes('Invalid Request')){
                        return '<strong style="cursor: pointer;color:#d22a24" onclick=(download('+full.id+',"TW"))>NOK'
                    }
                    if(data.includes('result_count":0')){
                        return '<strong style="cursor: pointer;" onclick=(download('+full.id+',"TW"))>0'
                    }
                    return '<strong style="cursor: pointer;color:#2eb85c" onclick=(download('+full.id+',"TW"))>OK'
                }    
            },     
            {
                title: '<i class="cib-youtube"></i>', 
                data: "json_youtube", 
                width: "5%",
                render: function ( data, type, full, meta ) {
                    if(data.includes('"code":403')){
                        return '<strong style="cursor: pointer; color:#d22a24" onclick=(download('+full.id+',"YT"))>NOK'
                    }
                    if(data.includes('"totalResults":0')){
                        return '<strong style="cursor: pointer;" onclick=(download('+full.id+',"YT"))>0'
                    }
                    return '<strong style="cursor: pointer; color:#2eb85c" onclick=(download('+full.id+',"YT"))>OK'
                }     
            },     
            {
                title: '<i class="cib-facebook-f"></i>', 
                data: "async", 
                width: "5%",
                render: function ( data, type, full, meta ) {
                    if(data.length>0){
                        fb="S/C"
                        data.forEach(element => {
                            if(element.source=='Facebook'){
                                fb=element.status
                            }
                        });
                        if(fb=='OK'){
                            return '<strong style="color:#2eb85c">OK'
                        }
                        if(fb=='ERROR'){
                            return '<strong style="color:#d22a24">NOK'
                        }
                        if(fb=='Pendiente'){
                            return '<strong style="color:#61b5ff">Pendiente'
                        }
                        if(fb=='Codigo Pendiente'){
                            return '<strong style="color: #24dac1">Codigo Pendiente'
                        }
                        return fb
                    }
                    return 'S/C'
                }    
            },     
            {
                title: '<i class="cib-instagram"></i>', 
                data: "async", 
                width: "5%",
                render: function ( data, type, full, meta ) {
                    if(data.length>0){
                        ig='S/C'
                        data.forEach(element => {
                            if(element.source=='Instagram'){
                                ig=element.status
                            }
                        });
                        if(ig=='OK'){
                            return '<strong style="color:#2eb85c">OK'
                        }
                        if(ig=='ERROR'){
                            return '<strong style="color:#d22a24">NOK'
                        }
                        if(ig=='Pendiente'){
                            return '<strong style="color:#61b5ff">Pendiente'
                        }
                        if(ig=='Codigo Pendiente'){
                            return '<strong style="color: #24dac1">Codigo Pendiente'
                        }
                        return ig
                    }
                    return 'S/C'
                }    
            },     
            {
                title: '<i class="cib-google"></i>', 
                data: "googlenews", 
                width: "5%",
                render: function ( data, type, full, meta ) {
                    if(data.length>0){
                        return '<strong style="color:#2eb85c">OK'
                    }
                    return 0
                }    
            },  
            {
                title: 'Origen', 
                data: "user.roles", 
                width: "5%",
                render: function ( data, type, full, meta ) {
                    if(data[0].id==1){
                        return 'ADM'
                    }
                    if(data[0].id==2){
                        return 'USR'
                    }
                    if(data[0].id==3){
                        return 'ONB'
                    }
                    if(data[0].id==4){
                        return 'GST'
                    }
                }    
            },                          
        ],
        "pageLength": 50,
        "lengthMenu": [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"] ],
        language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
         
    }).order( [ 1, 'desc' ] )
    hideLoading()
    /*
    $("#cpaneltable_wrapper").css("display","none")
    //Botones Descargar y Actualizar
    $(document).ready(function() {
        $("#cpaneltable_wrapper").css("display","none")
        $('#cpaneltable').DataTable( {
            destroy: true,
            "processing":true,
            "pageLength": 50,
            "lengthMenu": [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"] ],
            "order": [[ 2, "desc" ]],
            language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
            
            //dom: 'lrftip',

            initComplete: function () {
                $("#cpaneltable_wrapper").css("display","none")
                $("#cpaneltable_wrapper").fadeIn(1000);
            }
        }); 
        hideLoading();         
    }); 
    */
}
function c_async(){
    $('#cpaneltable').DataTable({
        destroy:true,responsive:true,"processing":true,"paging":false,searching:true,info:true,data:data,autoWidth:false,
        columns: [
            {
                title: "ID", 
                data: "id", 
                width: "2%", 
                
                render: function ( data, type, row, meta ) {
                    return parseInt(data)
                }   
            },
            {
                title: "Código", 
                data: "code", 
                width: "5%" 
            },
            {
                title: "Origen", 
                data: "source", 
                width: "5%", 
                render: function (data, type, full, meta) {
                    switch(data){
                        case 'Facebook': return '<center><i class="cib-facebook-f"></i></center>'; break;
                        case 'Instagram': return '<center><i class="cib-instagram"></i></center>'; break;
                    }
                }
            },
            {
                title: "Estado", 
                data: "status", 
                width: "5%",   
            },     
            {
                title: "IDB", 
                data: "busqueda_id", 
                width: "5%", 
                render: function ( data, type, row, meta ) {
                    return parseInt(data)
                }   
            },
            {
                title: "IDU", 
                data: "user_id", 
                width: "5%", 
                render: function ( data, type, full, meta ) {
                    return parseInt(data)
                }   
            },     
            {
                title: "Fecha", 
                data: "created_at", 
                width: "5%" ,
                render: function(data){
                    return date_and_time(new Date(data.replaceAll('T',' ').replaceAll('-','/')))[0]+' '+date_and_time(new Date(data.replaceAll('T',' ').replaceAll('-','/')))[1]
                }  
            }                        
        ]                   
    })
    $("#cpaneltable_wrapper").css("display","none")
    //Botones Descargar y Actualizar
    $(document).ready(function() {
        $("#cpaneltable_wrapper").css("display","none")
        $('#cpaneltable').DataTable( {
            destroy: true,
            "processing":true,
            "pageLength": 50,
            "lengthMenu": [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"] ],
            "order": [[ 0, "desc" ]],
            language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
            
            //dom: 'lrftip',

            initComplete: function () {
                $("#cpaneltable_wrapper").css("display","none")
                $("#cpaneltable_wrapper").fadeIn(1000);
            }
        }); 
        hideLoading();         
    }); 
}
function c_ws(){
    $('#cpaneltable').DataTable({
        destroy:true,responsive:true,"processing":true,"paging":false,searching:true,info:true,data:data,autoWidth:false,
        columns: [
            {
                title: "WS Key", 
                data: "wskey", 
                width: "2%" 
            },
            {
                title: "Status", 
                data: "status", 
                width: "5%" 
            },
            {
                title: "Fecha", 
                data: "creation_timestamp", 
                width: "5%",
                render: function(data){
                    return date_and_time(new Date(data.replaceAll('-','/')))[0]+' '+date_and_time(new Date(data.replaceAll('-','/')))[1]
                }
            }                      
        ]                   
    })
    $("#cpaneltable_wrapper").css("display","none")
    //Botones Descargar y Actualizar
    $(document).ready(function() {
        $("#cpaneltable_wrapper").css("display","none")
        $('#cpaneltable').DataTable( {
            destroy: true,
            "processing":true,
            "pageLength": 50,
            "lengthMenu": [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"] ],
            "order": [[ 2, "desc" ]],
            language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
            
            //dom: 'lrftip',

            initComplete: function () {
                $("#cpaneltable_wrapper").css("display","none")
                $("#cpaneltable_wrapper").fadeIn(1000);
            }
        }); 
        hideLoading();         
    }); 
}

function c_roles(){
    editor = new $.fn.dataTable.Editor( {
        table: "#cpaneltable",
        idSrc:  'id',
        fields: [ {
                label: "ID",
                name: "id"
            }, {
                label: "Nombre",
                name: "name"
            }, {
                label: "Email",
                name: "email"
            }, {
                label: "Rol",
                name: function ( row, type, set ) {
                    return row.roles[0].name
                }
            }
        ]
    } );
    $('#cpaneltable').DataTable({
        processing: true,
        serverSide: true,
        ajax: "/get_userwroles_gst/",
        /*destroy:true,responsive:true,"processing":true,"paging":false,searching:true,info:true,data:data,autoWidth:false,*/
        columns: [
            {
                title: "ID", 
                data: "id", 
                width: "2%" 
            },
            {
                title: "Nombre", 
                data: "name", 
                width: "5%" 
            },
            {
                title: "Email", 
                data: "email", 
                width: "5%" 
            },  
            {
                title: "Rol", 
                data: "id", 
                width: "5%",
                render: function ( data, type, row, meta ) {
                    return row.roles[0].name
                }   
            },               
        ],
        language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
            dom: 'lrBftip',
            select: true,
            buttons: [
                { extend: "create", editor: editor },
                { extend: "edit",   editor: editor },
                { extend: "remove", editor: editor }
            ],              
        
    })
    hideLoading();      
}

function loadUserDetails(user){
    usrData=JSON.parse(atob(user))
    usrData.empresas.length>0?empresa=usrData.empresas[0].nombre:empresa='Sin empresa'

    document.getElementById("user_details").textContent = '';
    var userDiv = document.createElement('div')
        userDiv.setAttribute('style','margin:2%');
        var usrDetails = document.createElement('div')
            usrDetails.setAttribute('style','margin:2%');
            usrDetails.innerHTML= `          
            <ul class="list-group">
                <li class="list-group-item list-group-item-action">ID: ${usrData.id}</li>
                <li class="list-group-item list-group-item-action">Nombre: ${usrData.name}</li>
                <li class="list-group-item list-group-item-action">E-mail: ${usrData.email}</li>
                <li class="list-group-item list-group-item-action">Empresa: ${empresa}</li>
                <li class="list-group-item list-group-item-action">Rol: ${usrData.roles[0].name}</li>
            </ul>
            `
        userDiv.appendChild(usrDetails)
    document.getElementById('user_details').appendChild(userDiv)
}
function loadBusquedaDetails(busqueda){
    busquedaData = (table_busquedas.rows().data().toArray()).find(x => x.id === busqueda);
    document.getElementById("busqueda_details").textContent = '';
    var busquedaDiv = document.createElement('div')
        busquedaDiv.setAttribute('style','margin:2%');
        var bsqDetails = document.createElement('div')
            bsqDetails.setAttribute('style','margin:2%');
            bsqDetails.innerHTML= `          
            <ul class="list-group">
                <li class="list-group-item list-group-item-action">ID: ${busquedaData.id}</li>
                <li class="list-group-item list-group-item-action">Nombre: ${busquedaData.nombre_busqueda}</li>
                <li class="list-group-item list-group-item-action">Keywords: ${busquedaData.palabra_busqueda}</li>
                <li class="list-group-item list-group-item-action">Fecha Inicial: ${busquedaData.fecha_inicial_original}</li>
                <li class="list-group-item list-group-item-action">Fecha Final: ${busquedaData.fecha_final}</li>
            </ul>
            `
        busquedaDiv.appendChild(bsqDetails)
    document.getElementById('busqueda_details').appendChild(busquedaDiv)
}
function loadCampañaDetails(campaña){
    cmpData=JSON.parse(atob(campaña))
    cmpData.tags==""||cmpData.tags==" "?tags="Sin Etiquetas":tags=cmpData.tags

    document.getElementById("campaña_details").textContent = '';
    var campañaDiv = document.createElement('div')
        campañaDiv.setAttribute('style','margin:2%');
        var cmpDetails = document.createElement('div')
            cmpDetails.setAttribute('style','margin:2%');
            cmpDetails.innerHTML= `          
            <ul class="list-group">
                <li class="list-group-item list-group-item-action">ID: ${cmpData.id}</li>
                <li class="list-group-item list-group-item-action">Nombre: ${cmpData.nombre_campania}</li>
                <li class="list-group-item list-group-item-action">Etiquetas: ${tags}</li>
            </ul>
            `
        campañaDiv.appendChild(cmpDetails)
    document.getElementById('campaña_details').appendChild(campañaDiv)
}
function download(id,source){
    toDownload = (table_busquedas.rows().data().toArray()).find(x => x.id === id);
    switch(source){
        case 'TW':
            downloadObjectAsJson(toDownload.json_busqueda, 'Busqueda_Twitter_'+id)
            break;
        case 'YT':
            downloadObjectAsJson(toDownload.json_youtube, 'Busqueda_Youtube_'+id)
            break;
    }
}
function downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function c_roles_aslacker(){
    table = $('#cpaneltable').DataTable({
        destroy: true,
        responsive: true,
        searching: true,
        info: true,
        data: data,
        autoWidth: false,
        columns: [
            {
                title: "ID", 
                data: "id", 
                width: "2%" 
            },
            {
                title: "Nombre", 
                data: "name", 
                width: "5%" 
            },
            {
                title: "Email", 
                data: "email", 
                width: "5%" 
            },  
            {
                title: "Rol", 
                data: "id", 
                width: "5%",
                render: function ( data, type, row, meta ) {
                    if(row.roles[0].name == "admin"){
                        return "Administrador"
                    }
                    if(row.roles[0].name == "user"){
                        return "Usuario"
                    }
                    if(row.roles[0].name == "guest"){
                        return "Invitado"
                    }
                    if(row.roles[0].name == "gestor"){
                        return "Gestor"
                    }
                }   
            },               
        ],
    })
    $(function() {
        $('#cpaneltable').DataTable( {
            "deferRender": true,
            destroy: true,
            order: [0,'desc'],
            fixedColums: true,
            "pageLength": 50,
            "lengthMenu": [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"] ],
            language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
            dom: 'lBfrtip',
            buttons: [
                //Botón Nuevo
                {
                    attr:  {
                        id:"newRowBtn",
                        "data-toggle": "modal",
                        "data-target": "#newRolModal"
                    },
                    text:'<i class="cil-plus"></i>',
                    titleAttr: 'Agregar Fila',
                    type:'submit',
                    className: 'btn btn-primary',
                },
                //Botón Editar
                {
                    attr:  {
                        id:"editRowBtn"
                    },
                    text:'<i class="cil-pencil"></i>',
                    titleAttr: 'Editar Fila Seleccionada',
                    action: function ( e, dt, node, config ) {
                       editSelectedRow();
                    },
                    type:'submit',
                    className: 'btn btn-warning2',
                },
                //Botón Eliminar
                {
                    attr:  {
                        id:"deleteRowBtn"
                    },
                    text:'<i class="cil-trash"></i>',
                    titleAttr: 'Eliminar Fila Seleccionada',
                    action: function ( e, dt, node, config ) {
                       deleteSelectedRow();
                    },
                    type:'submit',
                    className: 'btn btn-danger',
                }
            ],
            initComplete: function () {
                var btns = $('.dt-buttons');        btns.addClass('btnsOnTop');
                var fltr = $('.dataTables_filter'); fltr.addClass('fltrOnTop'); 

                $('tr').attr('style','cursor:pointer;')

                edit_modal_btn=document.getElementById("editRowBtn")
            }
        });     

        tableOfData = table;

        $('#cpaneltable tbody').on( 'click', 'tr', function (e, dt, type, indexes) {
            if ( $(this).hasClass('selected') ) {$(this).removeClass('selected');}else {table.$('tr.selected').removeClass('selected');$(this).addClass('selected');}
            selected_row_data=$('#cpaneltable').DataTable().rows('.selected').data()
            if(selected_row_data.length==0){
                edit_modal_btn.removeAttribute('data-toggle');          edit_modal_btn.removeAttribute('data-target');      
            }else{
                edit_modal_btn.setAttribute('data-toggle','modal');     edit_modal_btn.setAttribute('data-target','#editRolModal');     
                selected_row_index=$('#cpaneltable').DataTable().row( this ).index();        
            }              
        });
    }); 
    hideLoading();      
}
    function editSelectedRow(){
        if(selected_row_data.length>0){
            document.getElementById('edit_id').value = (selected_row_data[0])[0]
            document.getElementById('edit_name').value = (selected_row_data[0])[1]
            document.getElementById('edit_email').value = (selected_row_data[0])[2]
            document.getElementById('edit_rol').value = (selected_row_data[0])[3]
        }else{
            toastr["warning"]('Debe seleccionar una fila para editarla')
        }
    }
    function editSelectedRow_newData(){
        $('#cpaneltable').DataTable().row(selected_row_index).data( [
            document.getElementById('edit_id').value,
            document.getElementById('edit_name').value,
            document.getElementById('edit_email').value,
            document.getElementById('edit_rol').value
        ] ).draw();
        selected_row_data=$('#cpaneltable').DataTable().rows('.selected').data()
        rol_to_request=0
        switch(document.getElementById('edit_rol').value){
            case 'Administrador':
                rol_to_request = 1
                break;
            case 'Usuario':
                rol_to_request = 2
                break;
            case 'Invitado':
                rol_to_request = 3
                break;
            case 'Gestor':
                rol_to_request = 4
                break;
        }

        $.ajax({                                  
            url: '/control_roles_edit',       
            type: 'put',
            data: {
                _token : csrf_token,
                id:document.getElementById('edit_id').value,
                name:document.getElementById('edit_name').value,
                email:document.getElementById('edit_email').value,
                rol: rol_to_request
            },
            beforeSend: function () {
                showLoading()
            },
            complete: function () {hideLoading();
            },
            success: function (response) {hideLoading();
                toastr["success"]('Usuario editado con exito')
                clearFields()
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
    function deleteSelectedRow(){
        if(selected_row_data.length>0){
            $.ajax({                                  
                url: '/control_roles_delete',       
                type: 'delete',
                data: {
                    _token : csrf_token,
                    id:(selected_row_data[0])[0]
                },
                beforeSend: function () {
                    showLoading()
                },
                complete: function () {hideLoading();
                },
                success: function (response) {hideLoading();
                    $('#cpaneltable').DataTable().rows('.selected').remove().draw( false );
                    selected_row_data=[]
                    edit_modal_btn.removeAttribute('data-toggle');
                    edit_modal_btn.removeAttribute('data-target'); 
                    toastr["success"]('Usuario eliminado con exito')
                    clearFields()
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
        }else{
            toastr["error"]('Debe seleccionar una fila para eliminarla')
        }
    }
    function newUser(){
        rol_to_request=0
        switch(document.getElementById('new_rol').value){
            case 'Administrador':
                rol_to_request = 1
                break;
            case 'Usuario':
                rol_to_request = 2
                break;
            case 'Invitado':
                rol_to_request = 3
                break;
            case 'Gestor':
                rol_to_request = 4
                break;
        }
        $.ajax({                                  
            url: '/control_roles_new',       
            type: 'post',
            data: {
                _token : csrf_token,
                name:document.getElementById('new_name').value,
                email:document.getElementById('new_email').value,
                password:document.getElementById('new_pass').value,
                empresa:document.getElementById('new_ent').value,
                rol: rol_to_request
            },
            beforeSend: function () {
                showLoading()
            },
            complete: function () {hideLoading();
            },
            success: function (response) {hideLoading();
                $('#cpaneltable').DataTable().row.add( [
                    response,
                    document.getElementById('new_name').value,
                    document.getElementById('new_email').value,
                    document.getElementById('new_rol').value
                ] ).draw( false );
                toastr["success"]('Usuario creado con exito')
                clearFields()
            },
            error: function (jqXHR, exception) {
                if (jqXHR.status === 0) {
                    toastr["error"]('Error al crear Usuario')
                    hideLoading();
                } else if (jqXHR.status == 404) {
                    toastr["error"]('Error al crear Usuario')
                    hideLoading();
                } else if (jqXHR.status == 500) {
                    toastr["error"]('Error al crear Usuario')
                    hideLoading();
                } else if (exception === 'parsererror') {
                    toastr["error"]('Error al crear Usuario')
                    hideLoading();
                } else if (exception === 'timeout') {
                    toastr["error"]('Error al crear Usuario')
                    hideLoading();
                } else if (exception === 'abort') {
                    toastr["error"]('Error al crear Usuario')
                    hideLoading();
                } else {
                    toastr["error"]('Error al crear Usuario')
                    hideLoading();                    
                }
            },
        });
    }
    function clearFields(){
        document.getElementById('new_name').value=''
        document.getElementById('new_email').value=''
        document.getElementById('new_pass').value=''
        document.getElementById('new_ent').value=''
        document.getElementById('new_rol').value='Seleccionar un rol...'
        document.getElementById('edit_id').value = ''
        document.getElementById('edit_name').value = ''
        document.getElementById('edit_email').value = ''
        document.getElementById('edit_rol').value = 'Seleccionar un rol...'

    }

function c_medios_sociales(){
    table = $('#cpaneltable').DataTable({
        destroy: true,
        responsive: true,
        searching: true,
        info: true,
        data: data,
        autoWidth: false,
        columns: [
            {
                title: "ID", 
                data: "id", 
                width: "2%" 
            },
            {
                title: "Nombre", 
                data: "nombre", 
                width: "5%" 
            },
            {
                title: "Tipo", 
                data: "tipo_medio", 
                width: "5%" 
            },  
            {
                title: "Alcance", 
                data: "alcance", 
                width: "5%" 
            },  
            {
                title: "Imagen", 
                data: "imagen", 
                width: "5%",
                render: function (data, type, full, meta) {
                    if(data!="Sin imagen" && data!=""){
                        return '<center><img src="/assets/img/medios_images/' + data + '" style="width:80%;border-radius: 3px"></center>'}
                    else{
                        return '<center><img src="/assets/img/avatars/no_image_medios.png" style="width:80%;border-radius: 3px"></center>'
                    }
                }
            },
            {
                title: "Url", 
                data: "url", 
                width: "5%",
                render: function ( data, type, row, meta ) {
                    if(data == 'Sin url'){
                        return '<a class="btn btn-danger" disabled target="_blank"><i class="cil-link-broken"></i</a>'
                    }else{
                        return '<a class="btn btn-primary" href="' + data + '" target="_blank"><i class="cil-external-link"></i</a>'
                    }
                }   
            },               
        ],
    })
    $(function() {
        $('#cpaneltable').DataTable( {
            "deferRender": true,
            destroy: true,
            order: [0,'desc'],
            fixedColums: true,
            "pageLength": 50,
            "lengthMenu": [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"] ],
            language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
            dom: 'lBfrtip',
            buttons: [
                //Botón Nuevo
                {
                    attr:  {
                        id:"newRowBtn_Medios",
                        "data-toggle": "modal",
                        "data-target": "#newMedioModal"
                    },
                    text:'<i class="cil-plus"></i>',
                    titleAttr: 'Agregar Fila',
                    type:'submit',
                    className: 'btn btn-primary',
                },
                //Botón Editar
                {
                    attr:  {
                        id:"editRowBtn_Medios"
                    },
                    text:'<i class="cil-pencil"></i>',
                    titleAttr: 'Editar Fila Seleccionada',
                    action: function ( e, dt, node, config ) {
                        editSelectedRow_Medios();
                    },
                    type:'submit',
                    className: 'btn btn-warning2',
                },
                //Botón Eliminar
                {
                    attr:  {
                        id:"deleteRowBtn_Medios"
                    },
                    text:'<i class="cil-trash"></i>',
                    titleAttr: 'Eliminar Fila Seleccionada',
                    action: function ( e, dt, node, config ) {
                        deleteSelectedRow_Medios();
                    },
                    type:'submit',
                    className: 'btn btn-danger',
                }
            ],
            initComplete: function () {
                var btns = $('.dt-buttons');        btns.addClass('btnsOnTop');
                var fltr = $('.dataTables_filter'); fltr.addClass('fltrOnTop'); 

                $('tr').attr('style','cursor:pointer;')

                edit_modal_btn_Medios=document.getElementById("editRowBtn_Medios")
            }
        });     

        tableOfData = table;

        $('#cpaneltable tbody').on( 'click', 'tr', function (e, dt, type, indexes) {
            if ( $(this).hasClass('selected') ) {$(this).removeClass('selected');}else {table.$('tr.selected').removeClass('selected');$(this).addClass('selected');}
            selected_row_data=$('#cpaneltable').DataTable().rows('.selected').data()
            if(selected_row_data.length==0){
                edit_modal_btn_Medios.removeAttribute('data-toggle');          edit_modal_btn_Medios.removeAttribute('data-target');      
            }else{
                edit_modal_btn_Medios.setAttribute('data-toggle','modal');     edit_modal_btn_Medios.setAttribute('data-target','#editMedioModal');     
                selected_row_index=$('#cpaneltable').DataTable().row( this ).index();        
            }              
        });
    }); 
    hideLoading();      
}
    function editSelectedRow_Medios(){
        selected_row_data=$('#cpaneltable').DataTable().rows('.selected').data()
        if(selected_row_data.length>0){
            document.getElementById('edit_id_Medios').value = (selected_row_data[0])[0];
            document.getElementById('edit_nombre_Medios').value = (selected_row_data[0])[1];
            document.getElementById('edit_tipo_Medios').value = (selected_row_data[0])[2];
            document.getElementById('edit_alcance_Medios').value = (selected_row_data[0])[3];
            ((selected_row_data[0])[5].includes('disabled') || (selected_row_data[0])[5]=='') ?
                document.getElementById('edit_url_Medios').value = "Sin url" : 
                document.getElementById('edit_url_Medios').value = ((selected_row_data[0])[5].split("href=")[1]).split('"')[1];

            ((selected_row_data[0])[4].includes('no_image')) ?
                $("#edit_image_upload").next('.custom-file-label').html('Seleccionar un archivo...'): 
                $("#edit_image_upload").next('.custom-file-label').html((selected_row_data[0])[4].split("src=")[1].split('"')[1].split('/')[4]);

            document.getElementById("edit_nombre_Medios").dispatchEvent(evt);
        }else{
            toastr["warning"]('Debe seleccionar una fila para editarla')
        }
    }
    function editSelectedRow_newData_Medios(){
        valido=false
        selected_row_data=$('#cpaneltable').DataTable().rows('.selected').data()
        $("#edit_image_upload").next('.custom-file-label').html()=='Seleccionar un archivo...'?
        imagen_import='':
        $("#edit_image_upload").next('.custom-file-label').html() == document.getElementById('edit_id_Medios').value+'.png'?
        imagen_import='same':
        imagen_import=$("#edit_image_upload")[0].files[0];

        document.getElementById('edit_nombre_Medios').value==''?
            toastr["error"]('Debe ingresar un nombre','Error al editar Medio'):
        document.getElementById('edit_tipo_Medios').value=='Seleccionar tipo del medio...'?
            toastr["error"]('Debe seleccionar un tipo','Error al editar Medio'):
        document.getElementById('edit_alcance_Medios').value=='Seleccionar alcance del medio...'?
            toastr["error"]('Debe seleccionar un alcance','Error al editar Medio'):
        document.getElementById('edit_url_Medios').value==''?
            toastr["error"]('Debe ingresar una url del medio','Error al editar Medio'):
        document.getElementById('edit_url_Medios').classList.value.indexOf('invalid')!=-1?
            toastr["error"]('Url ingresada inválida','Error al editar Medio'):valido=true
        
        if(valido){
            var formDataEdit = new FormData();
            formDataEdit.append("imagen2", imagen_import);
            formDataEdit.append("_token", csrf_token)
            formDataEdit.append("nombre", document.getElementById('edit_nombre_Medios').value)
            formDataEdit.append("tipo_medio", document.getElementById('edit_tipo_Medios').value)
            formDataEdit.append("alcance", document.getElementById('edit_alcance_Medios').value)
            formDataEdit.append("url", document.getElementById('edit_url_Medios').value)
            formDataEdit.append("id", document.getElementById('edit_id_Medios').value)

            $.ajax({                                  
                url: '/control_medios_edit',       
                type: 'post',
                cache:false,
                contentType: false,
                processData: false,
                data: formDataEdit,
                beforeSend: function () {
                    showLoading()
                },
                complete: function () {hideLoading();
                },
                success: function (response) {hideLoading();
                    $('#cpaneltable').DataTable().row(selected_row_index).data( [
                        document.getElementById('edit_id_Medios').value,
                        document.getElementById('edit_nombre_Medios').value,
                        document.getElementById('edit_tipo_Medios').value,
                        document.getElementById('edit_alcance_Medios').value,    
                        response.imagen == "Sin imagen" ?
                                '<center><img src="/assets/img/avatars/no_image_medios.png" style="width:80%;border-radius: 3px"></center>' :
                                '<center><img src="/assets/img/medios_images/' + response.imagen + '" style="width:80%;border-radius: 3px"></center>',
                        (document.getElementById('edit_url_Medios').value == '' || document.getElementById('edit_url_Medios').value.includes('Sin url')) ?
                            '<a class="btn btn-danger" disabled target="_blank"><i class="cil-link-broken"></i</a>' :
                            '<a class="btn btn-primary" href="' + document.getElementById('edit_url_Medios').value + '" target="_blank"><i class="cil-external-link"></i</a>',
                    ] ).draw();
                    toastr["success"]('Medio editado con exito')
                    clearFields_Medios()
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
    function deleteSelectedRow_Medios(){
        if(selected_row_data.length>0){
            $.ajax({                                  
                url: '/control_medios_delete',       
                type: 'delete',
                data: {
                    _token : csrf_token,
                    id:(selected_row_data[0])[0]
                },
                beforeSend: function () {
                    showLoading()
                },
                complete: function () {hideLoading();
                },
                success: function (response) {hideLoading();
                    $('#cpaneltable').DataTable().rows('.selected').remove().draw( false );
                    selected_row_data=[]
                    edit_modal_btn_Medios.removeAttribute('data-toggle');
                    edit_modal_btn_Medios.removeAttribute('data-target'); 
                    toastr["success"]('Medio eliminado con exito')
                    clearFields_Medios()
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
        }else{
            toastr["error"]('Debe seleccionar una fila para eliminarla')
        }
    }

    function newMedio(){
        valido=false
        document.getElementById('new_nombre_Medios').value==''?
            toastr["error"]('Debe ingresar un nombre','Error al crear Medio'):
        document.getElementById('new_tipo_Medios').value=='Seleccionar tipo del medio...'?
            toastr["error"]('Debe seleccionar un tipo','Error al crear Medio'):
        document.getElementById('new_alcance_Medios').value=='Seleccionar alcance del medio...'?
            toastr["error"]('Debe seleccionar un alcance','Error al crear Medio'):
        //document.getElementById('new_imagen_Medios').value==''?
            //toastr["error"]('Debe ingresar una url de imagen','Error al crear Medio'):
        document.getElementById('new_url_Medios').value==''?
            toastr["error"]('Debe ingresar una url del medio','Error al crear Medio'):
        document.getElementById('new_url_Medios').classList.value.indexOf('invalid')!=-1?
            toastr["error"]('Url ingresada inválida','Error al crear Medio'):valido=true

        if(valido){
            document.getElementById('new_image_upload').value==''?imagen_import='':imagen_import=$("#new_image_upload")[0].files[0];

            var formData = new FormData();
            formData.append("imagen2", imagen_import);
            formData.append("_token", csrf_token)
            formData.append("nombre", document.getElementById('new_nombre_Medios').value)
            formData.append("tipo_medio", document.getElementById('new_tipo_Medios').value)
            formData.append("alcance", document.getElementById('new_alcance_Medios').value)
            //formData.append("imagen", document.getElementById('new_imagen_Medios').value)
            formData.append("url", document.getElementById('new_url_Medios').value)
    
            $.ajax({                                  
                url: '/control_medios_new',       
                type: 'post',
                data: formData,
                cache:false,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    showLoading()
                },
                complete: function () {
                    hideLoading();
                    document.getElementById('successNewMedioModal').disabled=true;
                    document.getElementById('successNewMedioModal').removeAttribute("data-dismiss")
                    valido = false;
                    v1=false;v2=false;v3=false;v4=false;v5=false
                },
                success: function (response) {hideLoading();
                    console.log(response)
                    table = $('#cpaneltable').DataTable().row.add( [
                        response.id,
                        document.getElementById('new_nombre_Medios').value,
                        document.getElementById('new_tipo_Medios').value,
                        document.getElementById('new_alcance_Medios').value,
                        response.imagen == "Sin imagen" ?
                            '<center><img src="/assets/img/avatars/no_image_medios.png" style="width:80%;border-radius: 3px"></center>' :
                            '<center><img src="/assets/img/medios_images/' + response.imagen + '" style="width:80%;border-radius: 3px"></center>',
                        
                        (document.getElementById('new_url_Medios').value == '' || document.getElementById('new_url_Medios').value.includes('Sin url')) ?
                            '<a class="btn btn-danger" disabled target="_blank"><i class="cil-link-broken"></i</a>' :
                            '<a class="btn btn-primary" href="' + document.getElementById('new_url_Medios').value + '" target="_blank"><i class="cil-external-link"></i</a>',
    
                    ] ).draw( false );
                    toastr["success"]('Medio creado con exito')
                    selected_row_data=[]
                    clearFields_Medios()
                },
                error: function (jqXHR, exception) {
                    if (jqXHR.status === 0) {
                        toastr["error"]('Error al crear Usuario')
                        hideLoading();
                    } else if (jqXHR.status == 404) {
                        toastr["error"]('Error al crear Usuario')
                        hideLoading();
                    } else if (jqXHR.status == 500) {
                        toastr["error"]('Error al crear Usuario')
                        hideLoading();
                    } else if (exception === 'parsererror') {
                        toastr["error"]('Error al crear Usuario')
                        hideLoading();
                    } else if (exception === 'timeout') {
                        toastr["error"]('Error al crear Usuario')
                        hideLoading();
                    } else if (exception === 'abort') {
                        toastr["error"]('Error al crear Usuario')
                        hideLoading();
                    } else if (jqXHR.status == 422) {
                        toastr["error"](jqXHR.responseText,jqXHR.responseJSON.message) ; console.log(jqXHR);
                        hideLoading();
                    } else {
                        toastr["error"]('Error al crear Usuario')
                        hideLoading();                    
                    }
                    clearFields_Medios()
                },
            });
        }
    }
    function clearFields_Medios(){
        document.getElementById('new_nombre_Medios').value = ''
        document.getElementById('new_tipo_Medios').value = 'Seleccionar tipo del medio...'
        document.getElementById('new_alcance_Medios').value = 'Seleccionar alcance del medio...'
        //document.getElementById('new_imagen_Medios').value = ''
        document.getElementById('new_url_Medios').value = ''
        document.getElementById('edit_id_Medios').value = ''
        document.getElementById('edit_nombre_Medios').value = ''
        document.getElementById('edit_tipo_Medios').value = 'Seleccionar tipo del medio...'
        document.getElementById('edit_alcance_Medios').value = 'Seleccionar alcance del medio...'
        //document.getElementById('edit_image_upload').value = ''
        document.getElementById('edit_url_Medios').value = ''
        $("#new_image_upload").val('');
        $("#new_image_upload").next('.custom-file-label').html('Seleccionar un archivo...');
        $("#edit_image_upload").val('');
        $("#edit_image_upload").next('.custom-file-label').html('Seleccionar un archivo...');
    }

    function imageNotFound() {
        console.log(this)
    }
    function isValidPngUri(str) {
        return str.indexOf('.png') > -1;
    }
    function isValidUri_old(str) {
        var dotIndex = str.indexOf('.');
        return (dotIndex > 0 && dotIndex < str.length - 2);
      }
      function isValidUri(string) {
        let url;
        
        try {
          url = new URL(string);
        } catch (_) {
          return false;  
        }
      
        return true//url.protocol === "http:" || url.protocol === "https:";
      }