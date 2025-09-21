import { Server, Socket } from "socket.io";

export function handleDotsAndBoxes(socket: Socket, io: Server) {
  socket.on("dots_move", (data: { lineKey: string; player: 1 | 2 }) => {
    console.log(`DotsAndBoxes move from ${socket.id}:`, data);
    socket.broadcast.emit("dots_update_board", data);
  });

  socket.on("dots_reset", () => {
    io.emit("dots_game_reset");
  });
}