export default async function deleteShare(shareId, session) {
    // 서버에 delete share 요청
    const url = `http://${process.env.NEXT_PUBLIC_API}/share/${session.data.user.id}/${shareId}`;
    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                authorization: session.data.user.authorization,
                "refresh-token": session.data.user["refresh-token"],
            },
        });
        console.log(res);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}
