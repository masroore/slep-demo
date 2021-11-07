$(function(){
    var userAgent = window.navigator.userAgent;
    if(userAgent.includes('iPhone')){
        $("#doublecard").attr("style", "max-height:21%")
    }
});

function load_titleInforme(){
    titleInforme = document.getElementById("titleInforme")
    if(original_data[0].nombre_busqueda != null){
        nombre = capitalize(original_data[0].nombre_busqueda)
        palabra = capitalize(original_data[0].palabra_busqueda)

        fi=new Date(original_data[0].fecha_inicial)
        ff=new Date(original_data[0].fecha_final)
        if(fi.getUTCMonth() == ff.getUTCMonth() && fi.getFullYear() == ff.getFullYear()){
            intervalo = fi.getUTCDate()+' al '+ff.getUTCDate()+' de '+ capitalize(fi.toLocaleString('default', { month: 'long' }));
        }else{
            intervalo = fi.getUTCDate()+' de '+ capitalize(fi.toLocaleString('default', { month: 'long' }))+' al '+
                        ff.getUTCDate()+' de '+ capitalize(ff.toLocaleString('default', { month: 'long' }))
        }
        titleInforme.textContent =  'ANÁLISIS CONTENIDO EN REDES SOCIALES / '+nombre+' - '+palabra+' / '+intervalo+
                                    '\r\nSEGUIDORES: '+formatNumberSeparator(data[data.length-1].seguidores)+
                                    ' / INTERACCIONES: '+formatNumberSeparator(data[data.length-1].likes)+
                                    ' / VIRALIZACIÓN: '+formatNumberSeparator(data[data.length-1].viralizacion)
        titleInforme.innerHTML = titleInforme.innerHTML.replace(/\n\r?/g, '<br />');

    }else{
        nombre = capitalize(original_data[0].nombre_campania)
        palabra=''
        busquedasData=[]
        all_desde = []
        all_hasta = []
        nBusquedas=0

        informe_busquedas.map((o)=>{
            busquedasData.push({
                n: nBusquedas+1,
                nombre: capitalize(o.nombre_busqueda.charAt(0)),
                palabras: capitalize(o.palabra_busqueda.charAt(0)),
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

        c_desde = new Date(desde_unicas[0])
        c_hasta = new Date(hasta_unicas[hasta_unicas.length-1])

        if(c_desde.getFullYear() == c_hasta.getFullYear()){
            intervalo = c_desde.getUTCDate()+' de '+ capitalize(c_desde.toLocaleString('default', { month: 'long' }))+' al '+
            c_hasta.getUTCDate()+' de '+ capitalize(c_hasta.toLocaleString('default', { month: 'long' }))
        }else{
            intervalo = 
            c_desde.getUTCDate()+' de '+ capitalize(c_desde.toLocaleString('default', { month: 'long' }))+' del '+c_desde.getFullYear()+' al '+
            c_hasta.getUTCDate()+' de '+ capitalize(c_hasta.toLocaleString('default', { month: 'long' }))+' del '+c_hasta.getFullYear()
        }

        titleInforme.textContent =  'Análisis de contenido en Redes Sociales / Campaña: '+nombre+' / '+intervalo+
                                    '\r\nSeguidores: '+formatNumberSeparator(data[data.length-1].seguidores)+
                                    ' / Interacciones: '+formatNumberSeparator(data[data.length-1].likes)+
                                    ' / Viralización: '+formatNumberSeparator(data[data.length-1].viralizacion)
        titleInforme.innerHTML = titleInforme.innerHTML.replace(/\n\r?/g, '<br />');
        load_datatable_informe()
    }
}
function dataToInforme(){
    load_titleInforme()
    load_AllStats()
    load_grid()
}
function load_datatable_informe(){
    let table_data = []
    data.map(((o,i)=>{
        if(o.tipoPagina != 'Total'){
            table_data.push(o)
        }
    }))

    $('#table_informe').DataTable({
        destroy: true,
        responsive: true,

        paging: true, //pagingLenght -1 es mostrar todo en la misma pagina
        pageLength: 5,
        lengthMenu: [ 3, 5, 10, 25, 50, 75, 100 ],

        language: {"url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"},
        searching: true,
        info: true,
        data: table_data,
        autoWidth: false,
        columns: [
            //Palabras Clave
            {
                title: "Palabras Clave", 
                data: "idBusqueda",
                width: '20%',
                render: function(data,type,full,meta){
                    return '<p class="text-capitalize">'+getKeywordsByResult(data)
                }
            },
            //Autor
            {
                title: "Autor", 
                data: "autor",
                width: '20%',
                render: function(data,type,full,meta){
                    return '<div>'+data+'</div><div class="small text-muted"><svg class="c-icon mx-1"><use xlink:href="../../assets/icons/coreui/free-symbol-defs.svg#cui-calendar"></use></svg>'+date_to_format_slash(full.fecha)+'</div>'
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
            //Comentario
            {
                title: "Posteo", 
                data: "mensaje",
                width: '30%',
                render: function(data,type,full,meta){
                    if(data.length>75){
                        return '<small class="text-muted">'+data.slice(0,75)+'...'
                    }else{
                        return '<small class="text-muted">'+data
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
}
function getKeywordsByResult(id){
    retorno=''
    informe_busquedas.map((search=>{
        if(id == search.id){
            retorno = search.palabra_busqueda
        }
    }))
    return retorno
}
function getCantidadBusquedas(){
    cantidad=0
    informe_busquedas.map((search=>{
        cantidad++
    }))
    return cantidad
}
function load_grid(){
    nCols=0
    getCantidadBusquedas()>=3?nCols=3:nCols=getCantidadBusquedas()

    dataGrid = data.slice(0,data.length-1)
    dataGrid.sort(function (a, b) {
        if (a.viralizacion > b.viralizacion) {
          return -1;
        }
        if (a.viralizacion < b.viralizacion) {
          return 1;
        }
        // a must be equal to b
        return 0;
    });
    //console.log(dataGrid)

    const idBusqueda_unicos = [...new Set(dataGrid.map((o) => JSON.stringify(o.idBusqueda))),].map((string) => JSON.parse(string))
    //console.log(idBusqueda_unicos)

    //Tengo los idBusqueda unicos ordenados por viralizacion, esto determina el orden de los items
    //Son 3 resultados por columna
    specific_dataGrid=[]
    idBusqueda_unicos.forEach(o => {
        arr=[]
        dataGrid.map((obj=>{
            obj.idBusqueda == o ? arr.push(obj) : null
        }))
        specific_dataGrid.push(arr)
    });
    //console.log(specific_dataGrid)

    //A veces hay 3 busquedas, pero no necesariamente tienen resultados, entonces hay errores al tratar de apuntar a un post que no existe, entonces se reduce nCols para que solo cargue columnas que tengan contenido con sentido
    if(specific_dataGrid.length!=nCols){
        nCols=specific_dataGrid.length
    }

    gridContainer = document.getElementById("gridContainer")

    for (let x = 0; x < nCols; x++) {
        datePost=new Date((specific_dataGrid[x])[0].fecha)

        cont = document.createElement('div')
        cont.className = "cont"

            item = document.createElement('div')
            item.className = "caluga cal1"
            item.innerHTML = `
            <img src="`+(specific_dataGrid[x])[0].img+`" class="img-c">
            <a class="informe" href="`+(specific_dataGrid[x])[0].linkPost+`" target="_blank" ><div class="cont-c">
                <span class="text-capitalize">`+getKeywordsByResult(idBusqueda_unicos[x])+`</span>
                <h4>`+(specific_dataGrid[x])[0].mensaje+`</h4>
                <p class="sec">`+datePost.getUTCDate()+' de '+ datePost.toLocaleString('default', { month: 'long' })+' / '+(specific_dataGrid[x])[0].autor+`</p>
            </div></a>`

            sec2 = document.createElement('div')
            sec2.className = 'sec2'

            for (let z = 1; z <= 2; z++) {
                datePost2=new Date((specific_dataGrid[x])[z].fecha)

                item2 = document.createElement('div')
                item2.className = 'caluga cal2'
                item2.innerHTML = `
                <img class="img-c bg-img" src="`+(specific_dataGrid[x])[z].img+`">
                <a class="informe" href="`+(specific_dataGrid[x])[z].linkPost+`" target="_blank" ><div class="cont-c">
                    <span class="text-capitalize">`+getKeywordsByResult(idBusqueda_unicos[x])+`</span>
                    <h5>`+(specific_dataGrid[x])[z].mensaje.slice(0,42)+`...</h5>
                    <p class="sec">`+datePost2.getUTCDate()+' de '+ datePost2.toLocaleString('default', { month: 'long' })+' / '+(specific_dataGrid[x])[z].autor+`</p>
                </div></a>
                `
                sec2.appendChild(item2)
            }
            cont.appendChild(item)
            cont.appendChild(sec2)
        gridContainer.appendChild(cont)
    }
    $("#container-informe-lector").fadeIn(1000);
}
function capitalize(str){
    return str.charAt(0).toUpperCase()+str.slice(1)
}