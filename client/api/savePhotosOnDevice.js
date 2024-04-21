import JSZip from "jszip";

export default function savePhotosOnDevice(photos, timelapse) {
    // zip photos and download
    const zip = new JSZip();
    const folder = zip.folder("photos");
    for (let i = 0; i < photos.length; i++) {
        const data = photos[i].split(",")[1];
        folder.file(`photo${i}.jpg`, data, { base64: true });
    }
    if(timelapse)
        folder.file(`video.webm`, timelapse, { base64: true });

    zip.generateAsync({ type: "blob" }).then((content) => {
        const url = window.URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.download = "photos.zip";
        link.click();
    });
}