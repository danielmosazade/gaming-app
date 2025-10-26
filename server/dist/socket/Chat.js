"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChat = handleChat;
function handleChat(socket, io) {
    socket.on("send_message", (msg) => {
        console.log(socket.id, "senp message:", msg);
        const message = {
            id: Math.random().toString(36).slice(2, 10),
            text: msg.text,
            senderId: msg.senderId || socket.id,
            time: msg.time || new Date().toLocaleTimeString(),
        };
        io.emit("receive_message", message);
    });
}
