"use strict"
 var bd;
 var salida ;
 window.addEventListener("load",init);
 function init() {
    //establecemos la conexion y añadimos eventlisteners
    var conexion = indexedDB.open("crud");
    conexion.addEventListener("error",errorConexion);
    conexion.addEventListener("success",conectar);
    conexion.addEventListener("upgradeneeded",crear);
    //identifico y asigno funcion al boton guardar
    var btnGuardar = document.getElementById("guardar");
    btnGuardar.addEventListener("click",almacenar);

    salida = document.getElementById("salida");

}
 function errorConexion(evento){
    console.log("Hay un error.");
 }
 function conectar(evento){
    bd = evento.target.result;
    mostrar();
    console.log("Conectado...");
 }
 function crear(evento) {
    //apunto a la indexDb y creo el almacen contactos
    var baseDatos = evento.target.result;
    var almacen = baseDatos.createObjectStore("contactos",{keyPath: "id"});
    console.log("Su base de datos ha sido creada");
}
function almacenar(){
    //obtengo valores
    var nombre = document.getElementById("nombre").value;
    var id = document.getElementById("id").value;
    //vacio los campos
    document.getElementById("nombre").value = "";
    document.getElementById("id").value = "";

    //transaccion a la indexDB
    var transaction =  bd.transaction(["contactos"],"readwrite");
    var almacen =transaction.objectStore("contactos");
    transaction.addEventListener("complete",mostrar);
    //añado el objeto
    almacen.add({
                    nombre: nombre,
                    id: id,
   })
}
function mostrar(){
    salida.innerHTML = "";
    var almacen = bd.transaction(["contactos"],"readonly").objectStore("contactos");
    var puntero = almacen.openCursor();
    //para que se actualice sin tener que cargar la pagina
    //añado un eventlistener que cuando se complete la accion se muestren los contactos de nuevo.
    puntero.addEventListener("success", mostrarContactos);
}
function mostrarContactos(evento) {
    var puntero = evento.target.result;
    if (puntero) {
        salida.innerHTML += "<div id='puntero'>"+ puntero.value.id +"</div><div id='puntero'>" +puntero.value.nombre +"</div>";
        //para que continue mostrando los registros
        puntero.continue();
    }
}

