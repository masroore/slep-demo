$(function(){
    get_state_table()
})

function async_facebook_check_status(code){
    urlBase='async_facebook_check_status/'
    if (window.location.href.indexOf("menu_dashboard") != -1 || window.location.href.indexOf("campa%C3%B1a") != -1 || window.location.href.indexOf("/resultado/") != -1 || window.location.href.indexOf("/informe/") != -1){
        urlBase='../'+urlBase
    }

    console.log('Consulta el estado del codigo: '+code)
    try {
        $.get(urlBase+code).done(function(response){
            estado=response.status
            if(estado==200){
                 console.log('El estado de la consulta '+code+' es: '+estado)
                /* AQUI DEBO LLAMAR A LA RUTA QUE OBTIENE LOS RESULTADOS, PUES SI ES 200 ESTAN LISTOS */
                async_facebook_get_results(code)
            }
            if(estado==201){
                 console.log('El estado de la consulta '+code+' es: '+estado)
                setTimeout(function(){ async_facebook_check_status(code) }, 1200000);
            }
            if(estado==404){
                console.log('El estado de la consulta '+code+' es: '+estado)
           }
        })
    } catch (error) {
        console.log(error)
    }
    
}
function async_facebook_get_results(code){
    urlBase='async_facebook_get_results/'
    if (window.location.href.indexOf("menu_dashboard") != -1 || window.location.href.indexOf("campa%C3%B1a") != -1 || window.location.href.indexOf("/resultado/") != -1 || window.location.href.indexOf("/informe/") != -1){
        urlBase='../'+urlBase
    }

    console.log('Obtiene los resultados del codigo: '+code)
    $.get(urlBase+code).done(function(output){
        console.log(output)
        //location.reload();
    })
}
function async_instagram_check_status(code){
    urlBase='async_instagram_check_status/'
    if (window.location.href.indexOf("menu_dashboard") != -1 || window.location.href.indexOf("campa%C3%B1a") != -1 || window.location.href.indexOf("/resultado/") != -1 || window.location.href.indexOf("/informe/") != -1){
        urlBase='../'+urlBase
    }

    console.log('Consulta el estado del codigo: '+code)
    $.get(urlBase+code).done(function(response){
        estado=response.status
        if(estado==200){
            console.log('El estado de la consulta '+code+' es: '+estado)
            /* AQUI DEBO LLAMAR A LA RUTA QUE OBTIENE LOS RESULTADOS, PUES SI ES 200 ESTAN LISTOS */
            async_instagram_get_results(code)
        }
        if(estado==201){
            console.log('El estado de la consulta '+code+' es: '+estado)
            setTimeout(function(){ async_instagram_check_status(code) }, 1200000);
        }
        if(estado==404){
            console.log('El estado de la consulta '+code+' es: '+estado)
       }
    })
}
function async_instagram_get_results(code){
    urlBase='async_instagram_get_results/'
    if (window.location.href.indexOf("menu_dashboard") != -1 || window.location.href.indexOf("campa%C3%B1a") != -1 || window.location.href.indexOf("/resultado/") != -1 || window.location.href.indexOf("/informe/") != -1){
        urlBase='../'+urlBase
    }

    console.log('Obtiene los resultados del codigo: '+code)
    $.get(urlBase+code).done(function(output){
        console.log(output)
        //location.reload();
    })
}

function get_state_table(){
    urlBase=env_url_base+'/tables/get_all_async_results'
    console.log('Obteniendo datos para la tabla de estado...')
    $.get(urlBase).done(function(data){
        console.log('Datos cargados!')
        console.log(data)
        data.map((o=>{
            if(o.source=='Facebook'){async_facebook_check_status(o.code)}
            if(o.source=='Instagram'){async_instagram_check_status(o.code)}
        }))
    })
}
