"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDotsAndBoxes = handleDotsAndBoxes;
function handleDotsAndBoxes(socket, io) {
    socket.on("dots_move", (data) => {
        console.log(`DotsAndBoxes move from ${socket.id}:`, data);
        socket.broadcast.emit("dots_update_board", data);
    });
    socket.on("dots_reset", () => {
        io.emit("dots_game_reset");
    });
}
