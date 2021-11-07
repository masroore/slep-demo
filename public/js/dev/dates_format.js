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