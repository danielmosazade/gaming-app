import { useState, useEffect, useRef } from "react";
import { Box, Button, Typography, TextField, Snackbar } from "@mui/material";
import { io, Socket } from "socket.io-client";
import { calculateGameResult } from "../components/CalculateGameResult";

type Player = "X" | "O" | null;

interface TicTacToeProps {
  onBackToMenu: () => void;
}

export default function TicTacToe({ onBackToMenu }: TicTacToeProps) {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState<Player>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [playerSymbol, setPlayerSymbol] = useState<Player>(null);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(
        import.meta.env.VITE_SERVER_URL || "http://localhost:10000",
        {
          transports: ["websocket", "polling"],
        }
      );
    }

    const socket = socketRef.current;

    socket.on("connect_error", (err) => console.error("Socket Error:", err));
    console.log("📡 Server URL:", import.meta.env.VITE_SERVER_URL);
    socket.on("room_created", (code: string) => {
      setPlayerSymbol("X");
      setRoomCode(code);
      setJoinedRoom(true);
    });

    socket.on("joined_room", (code: string) => {
      setPlayerSymbol("O");
      setRoomCode(code);
      setJoinedRoom(true);
    });

    socket.on("room_exists", () => alert("חדר כבר קיים!"));
    socket.on("room_not_found", () => alert("החדר לא נמצא!"));
    socket.on("room_full", () => alert("החדר מלא!"));
    socket.on("both_players_joined", () => {
      setGameStarted(true);
      setToastMessage("שחקן הצטרף! המשחק מתחיל!");
      setToastOpen(true);
      console.log("שני השחקנים בחדר, המשחק מתחיל!");
    });

    socket.on(
      "move_made",
      (data: { index: number; player: Player; nextPlayer: Player }) => {
        setBoard((prev) => {
          const newBoard = [...prev];
          newBoard[data.index] = data.player;
          const result = calculateGameResult(newBoard);
          setWinner(result.winner);
          setIsDraw(result.isDraw);
          setXIsNext(data.nextPlayer === "X");
          return newBoard;
        });
      }
    );

    socket.on("game_reset", () => resetGame());

    socket.on("opponent_disconnected", (message: string) => {
      setToastMessage(message);
      setToastOpen(true);
      setTimeout(() => {
        onBackToMenu();
      }, 3000);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const handleClick = (index: number) => {
    if (board[index] || winner || isDraw || !joinedRoom || !gameStarted) return;
    // רק אם זה התור שלך לפי מה שמגיע מהשרת
    if (playerSymbol !== (xIsNext ? "X" : "O")) return;
    socketRef.current?.emit("tic_move", {
      index,
      player: playerSymbol,
      room: roomCode,
    });
  };

  const createRoom = () => {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    console.log("מבקש ליצור חדר:", code);

    if (socketRef.current?.connected) {
      socketRef.current.emit("create_room", code);
    } else {
      socketRef.current?.once("connect", () => {
        socketRef.current?.emit("create_room", code);
      });
    }
  };

  const joinRoom = () => {
    if (!inputCode) return;
    const code = inputCode.toUpperCase();
    socketRef.current?.emit("join_room", code);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setIsDraw(false);
  };

  const sendReset = () => {
    socketRef.current?.emit("reset_game", roomCode);
    resetGame();
  };

  const isMyTurn = playerSymbol === (xIsNext ? "X" : "O");

  const renderSquare = (index: number) => (
    <Button
      key={index}
      variant="outlined"
      disabled={
        !isMyTurn || board[index] !== null || !!winner || isDraw || !gameStarted
      }
      sx={{
        width: 60,
        height: 60,
        fontSize: 20,
        minWidth: 0,
        padding: 0,
        border: "2px solid #333",
        backgroundColor: board[index] ? "#f5f5f5" : "white",
        "&:hover": {
          backgroundColor:
            isMyTurn && !board[index] && gameStarted ? "#e0e0e0" : "white",
        },
        "&.Mui-disabled": {
          backgroundColor: "#f0f0f0",
          color: "#999",
        },
      }}
      onClick={() => handleClick(index)}
    >
      {board[index]}
    </Button>
  );

  if (!joinedRoom) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Typography variant="h5" mb={2}>
          איקס עיגול אונליין 🎮
        </Typography>

        <Button variant="contained" onClick={createRoom}>
          צור חדר חדש
        </Button>

        <Box display="flex" gap={1} alignItems="center">
          <TextField
            size="small"
            placeholder="קוד חדר"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />
          <Button variant="outlined" onClick={joinRoom}>
            הצטרף
          </Button>
        </Box>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#ff4d4d",
            color: "white",
            borderRadius: "20px",
            "&:hover": { backgroundColor: "#ff1a1a" },
          }}
          onClick={onBackToMenu}
        >
          חזור
        </Button>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Typography variant="h6" sx={{ mt: 1 }}>
        אתה {playerSymbol === "X" ? "❌" : "⭕"}
      </Typography>

      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1}>
        {board.map((_, i) => renderSquare(i))}
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="280px"
        sx={{ mt: 2 }}
      >
        <Typography variant="body1">🧾 {roomCode}</Typography>
        <Typography variant="body1">תור: {xIsNext ? "X" : "O"}</Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#ff4d4d",
            color: "white",
            borderRadius: "20px",
            "&:hover": { backgroundColor: "#ff1a1a" },
          }}
          onClick={onBackToMenu}
        >
          חזור
        </Button>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
        {(winner || isDraw) && (
          <Typography variant="h6" color="secondary">
            {winner ? `🎉 מנצח: ${winner}` : "🤝 תיקו!"}
          </Typography>
        )}

        {(winner || isDraw) && (
          <Button variant="contained" onClick={sendReset}>
            משחק חדש
          </Button>
        )}
      </Box>
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // מיקום
      />
    </Box>
  );
}
