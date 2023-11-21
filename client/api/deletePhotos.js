export default async function deletePhotos(photoId, session) {
    // 서버에 delete photograph 요청
    const url = `http://${process.env.NEXT_PUBLIC_API}/cloud/${session.data.user.id}/photo/${photoId}`;
    try{
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                authorization: session.data.user.authorization,
                "refresh-token": session.data.user["refresh-token"],
            },
        })
        console.log(res);
        return true;
    } catch (err){
        console.log(err);
        return false;
    }
}