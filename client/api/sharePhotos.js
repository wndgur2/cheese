import axios from "axios";
import dataURItoBlob from "./dataUriToBlob";

export default function sharePhotos(photographs, session) {
    // 서버에 share post 요청
    const url = `http://${process.env.NEXT_PUBLIC_API}/share/${session.data.user.id}`;
    const data = new FormData();
    photographs.forEach((photo)=>{
      data.append("photo", dataURItoBlob(photo));
    })
    axios.post(url, data, {
      headers:{
        authorization: session.data.user.authorization,
        "refresh-token": session.data.user["refresh-token"],
      }}
    ).then((res)=>{ console.log(res); })
    .catch((err)=>{ console.log(err); })
}