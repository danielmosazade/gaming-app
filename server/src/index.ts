import express, { Response, Request } from "express";
import http from "http";
import { Server, } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); 
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["get", "post"],
  },
});
app.use(cors);
app.get("/", (req: Request, res: Response) => {
  res.send("server is running");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.emit("welcome", "ברוך הבא למשחק!");

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
server.listen(process.env.PORT,()=>{
    console.log(`server running on http://localhost${process.env.PORT}`)
})