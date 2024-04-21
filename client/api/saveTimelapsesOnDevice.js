import JSZip from "jszip";

export default function saveTimelapseOnDevice(timelapses) {
    // zip photos and download
    const zip = new JSZip();
    const folder = zip.folder("videos");
    for (let i = 0; i < timelapses.length; i++) {
        folder.file(`video${i}.webm`, timelapses[i].split(',')[1], { base64: true });
    }


    zip.generateAsync({ type: "blob" }).then((content) => {
        const url = window.URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.download = "videos.zip";
        link.click();
    });
}