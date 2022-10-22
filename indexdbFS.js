/**
 * this is an easy way to store files locally without hitting the localstorage 5mb limit
 * There are some compatibility issues but I will attempt to resolve them
 */


var dbfs = {};

// IndexedDB
    window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
    IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
    dbVersion = 1;

// create the db
var request = indexedDB.open("filesys", dbVersion);

request.onsuccess = function (event) {
    console.log("db Success!");
    db = request.result;

    db.onerror = function (event) {
        console.log("db Error");
    };
    
    // Interim solution for Google Chrome to create an objectStore. Will be deprecated
    if (db.setVersion) {
        if (db.version != dbVersion) {
            var setVersion = db.setVersion(dbVersion);
            setVersion.onsuccess = function () {
                createObjectStore(db);
                getFile();
            };
        }
        else {
            getFile();
        }
        }
        else {
            getFile();
    }
}
request.onupgradeneeded = function (event) {
    createObjectStore(event.target.result);
};
dataBase.createObjectStore("files");



//i stole the blob code shhh
dbfs.addFile = function(filename){

    // Create XHR
var xhr = new XMLHttpRequest(),
blob;

xhr.open("GET", filename, true);
// Set the responseType to blob
xhr.responseType = "blob";

xhr.addEventListener("load", function () {
if (xhr.status === 200) {
    console.log("file retrieved");
    
    // File as response
    blob = xhr.response;

    // Put the received blob into IndexedDB
    putFileInDb(blob);
}
}, false);
// Send XHR
xhr.send();

var transaction = db.transaction(["files"], IDBTransaction.READ_WRITE);
transaction.objectStore("files").put(blob, filename);
}

dbfs.getFile = function(filename){
    transaction.objectStore("files").get(filename).onsuccess = function (event) {
        var imgFile = event.target.result;
        console.log("file recieved" + imgFile);
}
}