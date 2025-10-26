import express, { Response, Request } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { handleTicTacToe } from "./socket/TicTacToe";
import { handleChat } from "./socket/Chat";
import { handleConnect4 } from "./socket/Connect4";
import { handleDotsAndBoxes } from "./socket/DotsAndBoxes";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = Number(process.env.PORT) || 10000;

// 🧩 חשוב מאוד – תגדיר במפורש את ה-origin של ה-Frontend שלך
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "https://gaming-hub2.netlify.app",
    methods: ["GET", "POST"],
    credentials: true, // מוסיף אמינות לחיבורים חוצי דומיינים
  },
});


app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://gaming-hub2.netlify.app",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (_req: Request, res: Response) => {
  res.send("server is running");
});

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);
  handleChat(socket, io);
  handleTicTacToe(socket, io);
  handleConnect4(socket, io);
  handleDotsAndBoxes(socket, io);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
  
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
