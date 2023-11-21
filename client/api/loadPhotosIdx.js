export default function loadPhotosIdx(callback){
    console.log("load photos");
    // load photos from indexed db
    let db;
    const request = indexedDB.open("CheeseDB");
    request.onerror = (event) => {
        console.error("Why didn't you allow my web app to use IndexedDB?!");
    };
    request.onsuccess = (event) => {
        db = event.target.result;
        console.log("indexed db opened")

        //load images from indexed db
        const transaction = db.transaction(["photos"], "readwrite");
        const photos = transaction.objectStore("photos");
        const request = photos.getAll();
        request.onerror = (event) => {
            console.error("Why didn't you allow my web app to use IndexedDB?!");
        };
        request.onsuccess = (event) => {
            console.log("indexed db loaded");
            callback(request.result);
        };
    };
    request.onupgradeneeded = (event) => {
        // create an object store called "photos"
        db = event.target.result;
        db.createObjectStore("photos", { autoIncrement: true });
        console.log("indexed db created/updated");
    }
}