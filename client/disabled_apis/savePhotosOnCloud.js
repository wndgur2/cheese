import axios from "axios";
import dataURItoBlob from "./dataUriToBlob";

export default async function savePhotosOnCloud(roomN, photos, session) {
    const url = `http://${process.env.NEXT_PUBLIC_API}/cloud/${session.data.user.id}/photo`;
    for (let photo of photos) {
        try {
            const data = new FormData();
            const blob = dataURItoBlob(photo);
            data.append("data", blob);
            const res = await axios.post(url, data, {
                headers: {
                    authorization: session.data.user.authorization,
                    "refresh-token": session.data.user["refresh-token"],
                },
                params: {
                    branchId: roomN,
                },
            });
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }
}
