var status_sidebar=true;
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
function checkValue(value) {
    if(value<10){value='0'+value;}
    return value;
}