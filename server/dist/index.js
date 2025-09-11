"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/index.ts
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const PORT = Number(process.env.PORT) || 5000;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
app.use((0, cors_1.default)());
app.get("/", (_req, res) => {
    res.send("server is running");
});
io.on("connection", (socket) => {
    console.log("User cosadsnnected:", socket.id);
    socket.emit("welcome", "ברוך הבא למשחק!");
    socket.on("send_message", (msgText) => {
        const message = {
            id: Math.random().toString(36).slice(2, 10),
            text: msgText,
            // senderId: socket.id,
            time: new Date().toLocaleTimeString(),
        };
        io.emit("receive_message", message);
    });
    socket.on("make_move", (data) => {
        console.log(`Move from ${socket.id}:`, data);
        io.emit("move_made", data); // שולח לכולם את המהלך
    });
    // ✅ אירוע איפוס המשחק
    socket.on("reset_game", () => {
        console.log(`Game reset by ${socket.id}`);
        io.emit("game_reset");
    });
    socket.on("disconnect", () => {
        console.log("User zxczx:", socket.id);
    });
});
server.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});
