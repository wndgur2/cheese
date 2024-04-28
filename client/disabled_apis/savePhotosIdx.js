export default function savePhotosIdx(images, callback){

    let db;
    const request = indexedDB.open("CheeseDB");
    request.onerror = (event) => {
        console.error("Why didn't you allow my web app to use IndexedDB?!");
    };
    request.onsuccess = (event) => {
        db = event.target.result;
        console.log("indexed db opened")

        const transaction = db.transaction(["photos"], "readwrite");
        const photos = transaction.objectStore("photos");
        //clean images
        const request = photos.clear();
        request.onerror = (event) => {
            console.error("Why didn't you allow my web app to use IndexedDB?!");
        };
        request.onsuccess = (event) => {
            //store images in indexed db
            images.forEach((image)=>{photos.add(image);});
            console.log("indexed db replaced")
            if(callback) callback();
        };
    };
    request.onupgradeneeded = (event) => {
        // create an object store called "photos"
        db = event.target.result;
        db.createObjectStore("photos", { autoIncrement: true });
        console.log("indexed db created/updated.");
    }
}