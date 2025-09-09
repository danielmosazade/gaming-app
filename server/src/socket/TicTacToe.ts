import { Server, Socket } from "socket.io";

export function handleTicTacToe(socket: Socket, io: Server) {
  socket.on("tic_move", (data: { index: number; player: "X" | "O" }) => {
    console.log(`TicTacToe move from ${socket.id}:`, data);
    socket.broadcast.emit("tic_update_board", data);
  });

  socket.on("tic_reset", () => {
    io.emit("tic_game_reset");
  });

  socket.on("tic_winner", (player: "X" | "O") => {
    io.emit("tic_winner_declared", player);
  });
}
