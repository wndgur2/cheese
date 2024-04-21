import axios from "axios";
// import { NextApiRequest, NextApiResponse } from "next";

export default async function getAddress(req, res) {
    try {
        const response = await axios.get(
            "https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc",
            {
                params: req.query,
                headers: {
                    "X-NCP-APIGW-API-KEY-ID": process.env.NEXT_PUBLIC_NAVER_MAP,
                    "X-NCP-APIGW-API-KEY": process.env.NAVER_MAP_SECRET,
                },
            }
        );
        res.status(200).json(response.data);
    } catch (error) {
        console.log("error", error.response.data);
        res.status(405).send("Method not allowed.");
    }
}
