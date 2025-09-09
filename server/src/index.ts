
import express, { Response, Request } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { handleTicTacToe } from "./socket/TicTacToe";
import  handleChat  from "./socket/Chat";


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
  handleChat(socket, io);
 socket.on("send_message", (msg) => {
    console.log(socket.id, "sent message:", msg);
 })
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


server.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});


