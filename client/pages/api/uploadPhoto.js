import axios from "axios";

export default async function uploadPhoto(req, res) {
    // console.log("query: ", req.query);
    // console.log(req.body);
    const url = `http://${process.env.NEXT_PUBLIC_API}/cloud/${req.query.id}/photo`;
    const boundary = "--" + req.headers["content-type"].split("boundary=")[1];
    const formData = new FormData();
    const data = req.body.split(boundary)[1].split("Content-Type: image/jpeg")[1];
    formData.append("image", data);
    // console.log(data.slice(0, 200));
    try{
        const response = await axios.post(url, formData, {
                headers: {
                    authorization: req.headers.authorization,
                    "refresh-token": req.headers["refresh-token"],
                }
            }
        )
        console.log(response.data);
        res.status(200).json(response.data);
    } catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}