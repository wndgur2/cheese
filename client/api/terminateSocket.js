export default function terminateSocket(branchId, uuid) {
    console.log("terminateSocket", branchId, uuid);
    let socket = new WebSocket(`ws://${process.env.NEXT_PUBLIC_API}/signal`);
    socket.onopen = () => {
        socket.send(JSON.stringify({
            type: "leave",
            data: branchId,
            from: uuid
        }));
    }
}