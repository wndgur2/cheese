import axios from "axios";

export default async function saveTimelapseOnCloud(roomN, timelapse, session) {
    const url = `http://${process.env.NEXT_PUBLIC_API}/cloud/${session.data.user.id}/timelapse`;
    try{
        const data = new FormData();
        // const blob = dataURItoBlob(timelapse);
        // console.log(blob);
        data.append("data", timelapse);
        const res = await axios.post(url, data, {
            headers: {
                authorization: session.data.user.authorization,
                "refresh-token": session.data.user["refresh-token"],
            }, 
            params:{
                branchId:roomN,
            }
        })
        console.log(res)
    } catch (err){
        console.log(err);
    }
}