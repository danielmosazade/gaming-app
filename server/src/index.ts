// server/src/index.ts
import express, { Response, Request } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = Number(process.env.PORT) || 5000;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

app.get("/", (_req: Request, res: Response) => {
  res.send("server is running");
});


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.emit("welcome", "ברוך הבא למשחק!");

  socket.on("send_message", (msgText: string) => {
  const message = {
    id: Math.random().toString(36).slice(2, 10),
    text: msgText,
    // senderId: socket.id,
    time: new Date().toLocaleTimeString(),
  };

  io.emit("receive_message", message);
});
  socket.on("make_move", (data: { index: number; player: "X" | "O" }) => {
    console.log(`Move from ${socket.id}:`, data);
    io.emit("move_made", data); // שולח לכולם את המהלך
  });

  // ✅ אירוע איפוס המשחק
  socket.on("reset_game", () => {
    console.log(`Game reset by ${socket.id}`);
    io.emit("game_reset");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


server.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});


