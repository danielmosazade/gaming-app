"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTicTacToe = handleTicTacToe;
const rooms = {};
function handleTicTacToe(socket, io) {
    console.log("🎮 TicTacToe Socket connected:", socket.id);
    // יצירת חדר
    socket.on("create_room", (code) => {
        console.log("קיבל בקשה ליצור חדר:", code);
        if (!rooms[code]) {
            rooms[code] = { players: [socket.id], nextPlayer: "X" };
            socket.join(code);
            socket.emit("room_created", code);
            console.log(`📌 חדר נוצר: ${code}`);
        }
        else {
            socket.emit("room_exists", code);
        }
    });
    // הצטרפות לחדר
    socket.on("join_room", (code) => {
        const room = rooms[code];
        if (!room) {
            socket.emit("room_not_found", code);
            return;
        }
        if (room.players.length >= 2) {
            socket.emit("room_full", code);
            return;
        }
        room.players.push(socket.id);
        socket.join(code);
        socket.emit("joined_room", code);
        io.to(code).emit("both_players_joined");
        console.log(`🙋 שחקן הצטרף לחדר: ${code}`);
    });
    // מהלך בחדר
    socket.on("tic_move", (data) => {
        const room = rooms[data.room];
        if (!room)
            return;
        // בדיקה אם זה התור הנכון
        if (data.player !== room.nextPlayer)
            return;
        // עדכון לוח ושינוי תור
        room.nextPlayer = room.nextPlayer === "X" ? "O" : "X";
        io.to(data.room).emit("move_made", {
            index: data.index,
            player: data.player,
            nextPlayer: room.nextPlayer,
        });
    });
    // איפוס המשחק
    socket.on("reset_game", (roomCode) => {
        const room = rooms[roomCode];
        if (!room)
            return;
        room.nextPlayer = "X";
        io.to(roomCode).emit("game_reset");
    });
    // ניתוק שחקן
    socket.on("disconnect", () => {
        for (const code in rooms) {
            const room = rooms[code];
            const idx = room.players.indexOf(socket.id);
            if (idx !== -1) {
                room.players.splice(idx, 1);
                if (room.players.length === 0)
                    delete rooms[code];
            }
        }
        console.log("❌ Socket disconnected:", socket.id);
    });
}
