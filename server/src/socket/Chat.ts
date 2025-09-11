import { Server, Socket } from "socket.io";

export  function handleChat(socket: Socket, io: Server) {
  socket.on("send_message", (msg) => {
    console.log(socket.id, "sent message:", msg); 

    const message = {
      id: Math.random().toString(36).slice(2, 10),
      text: msg.text,
      senderId: msg.senderId || socket.id,
      time: msg.time || new Date().toLocaleTimeString(),
    };
    io.emit("receive_message", message);
  });
}
