import { Box, Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { calculateGameResult } from "../components/CalculateGameResult";

type Player = "X" | "O" | null;
let socket: Socket;

interface TicTacToeProps {
  onBackToMenu: () => void;
}

function TicTacToe({ onBackToMenu }: TicTacToeProps) {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<Player>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);

  // חיבור ל-socket
  useEffect(() => {
    socket = io(import.meta.env.VITE_SERVER_URL,{
  transports: ["websocket"],
} );

    socket.on("connect_error", (error) => {
      console.error("❌ TicTacToe socket connection error:", error);
    });

    socket.on("move_made", (data: { index: number; player: "X" | "O" }) => {
      setBoard((prevBoard) => {
        const newBoard = [...prevBoard];
        newBoard[data.index] = data.player;

        const result = calculateGameResult(newBoard);
        setWinner(result.winner);
        setIsDraw(result.isDraw);

        setXIsNext(data.player === "X" ? false : true);
        return newBoard;
      });
    });

    socket.on("game_reset", () => {
      resetGame();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // טיפול בלחיצה על תא
  const handleClick = (index: number) => {
    if (board[index] || winner || isDraw) return;

    const player = xIsNext ? "X" : "O";
    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    const result = calculateGameResult(newBoard);
    setWinner(result.winner);
    setIsDraw(result.isDraw);

    setXIsNext(!xIsNext);

    socket.emit("tic_move", { index, player });
  };

  // אתחול המשחק
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setIsDraw(false);
  };

  const sendReset = () => {
    socket.emit("reset_game");
    resetGame();
  };

  const renderSquare = (index: number) => (
    <Button
      key={index}
      variant="outlined"
      sx={{ width: 60, height: 60, fontSize: 24, minWidth: 0 }}
      onClick={() => handleClick(index)}
    >
      {board[index]}
    </Button>
  );

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      {/* לוח המשחק */}
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1}>
        {board.map((_, i) => renderSquare(i))}
      </Box>

      {/* הודעות תור / מנצח / תיקו */}
      <Box mt={2} textAlign="center">
        {winner ? (
          <Typography variant="h6" color="secondary">
            🎉 Winner: {winner}
          </Typography>
        ) : isDraw ? (
          <Typography variant="h6" color="warning.main">
            🤝 It's a Draw!
          </Typography>
        ) : (
          <Typography variant="h6">
            Next: {xIsNext ? "X" : "O"}
          </Typography>
        )}
      </Box>

      {/* כפתורים בסיום המשחק */}
      {(winner !== null || isDraw) && (
        <Box display="flex" gap={2} mt={2}>
          <Button variant="contained" color="primary" onClick={sendReset}>
            משחק חדש
          </Button>
          <Button variant="outlined" color="secondary" onClick={onBackToMenu}>
            חזור לתפריט
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default TicTacToe;
