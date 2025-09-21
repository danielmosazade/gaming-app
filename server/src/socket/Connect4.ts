import { Server, Socket } from "socket.io";

export function handleConnect4(socket: Socket, io: Server) {
  socket.on("connect4_move", (data: { col: number; player: "red" | "yellow" }) => {
     console.log("Server received move:", data); 
    socket.broadcast.emit("connect4_update_board", data);
  });

  socket.on("connect4_restart", () => {
    io.emit("connect4_game_restart");
  });

  socket.on("connect4_winner", (winner: "red" | "yellow" | "Draw") => {
    io.emit("connect4_winner_declared", winner);
  });
}