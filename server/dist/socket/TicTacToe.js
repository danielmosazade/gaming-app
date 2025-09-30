"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTicTacToe = handleTicTacToe;
function handleTicTacToe(socket, io) {
    socket.on("tic_move", (data) => {
        console.log(`TicTacToe move from ${socket.id}:`, data);
        socket.broadcast.emit("tic_update_board", data);
    });
    socket.on("tic_reset", () => {
        io.emit("tic_game_reset");
    });
    socket.on("tic_winner", (player) => {
        io.emit("tic_winner_declared", player);
    });
}
