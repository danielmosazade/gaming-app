"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const TicTacToe_1 = require("./socket/TicTacToe");
const Chat_1 = require("./socket/Chat");
const Connect4_1 = require("./socket/Connect4");
const DotsAndBoxes_1 = require("./socket/DotsAndBoxes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const PORT = Number(process.env.PORT) || 5000;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
app.use((0, cors_1.default)());
app.get("/", (_req, res) => {
    res.send("server is running");
});
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    (0, Chat_1.handleChat)(socket, io);
    (0, TicTacToe_1.handleTicTacToe)(socket, io);
    (0, Connect4_1.handleConnect4)(socket, io);
    (0, DotsAndBoxes_1.handleDotsAndBoxes)(socket, io);
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});
server.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});
