import { Box, Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { calculateGameResult } from "./CalculateGameResult";

type Player = "X" | "O" | null;

interface GameResult {
  winner: Player;
  isDraw: boolean;
}

let socket: Socket;

function Game() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<Player>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);

  useEffect(() => {
    socket = io("http://localhost:5000");

    socket.on("move_made", (data: { index: number; player: "X" | "O" }) => {
      const newBoard = [...board];
      newBoard[data.index] = data.player;
      setBoard(newBoard);
      setXIsNext(data.player === "X" ? false : true);

      const result = calculateGameResult(newBoard);
      setWinner(result.winner);
      setIsDraw(result.isDraw);
    });

    socket.on("game_reset", () => {
      resetGame();
    });

    return () => {
      socket.disconnect();
    };
  }, [board]);

  const handleClick = (index: number) => {
    if (board[index] || winner || isDraw) return;

    const player = xIsNext ? "X" : "O";
    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);
    setXIsNext(!xIsNext);

    const result = calculateGameResult(newBoard);
    setWinner(result.winner);
    setIsDraw(result.isDraw);

    socket.emit("make_move", { index, player });
  };

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
    <Box>
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1}>
        {board.map((_, i) => renderSquare(i))}
      </Box>
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
      <Box mt={2} textAlign="center">
        <Button variant="contained" color="secondary" onClick={sendReset}>
          Reset Game
        </Button>
      </Box>
    </Box>
  );
}

export default Game;
