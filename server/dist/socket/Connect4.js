"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConnect4 = handleConnect4;
function handleConnect4(socket, io) {
    socket.on("connect4_move", (data) => {
        console.log("Server received move:", data);
        socket.broadcast.emit("connect4_update_board", data);
    });
    socket.on("connect4_restart", () => {
        io.emit("connect4_game_restart");
    });
    socket.on("connect4_winner", (winner) => {
        io.emit("connect4_winner_declared", winner);
    });
}
