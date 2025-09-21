import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { Box, Button, Paper, Typography } from "@mui/material";
import GameOver from "../components/GameOver";

type Cell = null | "red" | "yellow";

interface Connect4Props {
  onBackToMenu: () => void;
}

const ROWS = 5;
const COLS = 6;
const CELL_SIZE = 35; // קטן יותר
const CELL_MARGIN = 1;

const socket: Socket = io("http://localhost:5000");

const Connect4 = ({ onBackToMenu }: Connect4Props) => {
  const initialBoard: Cell[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const [board, setBoard] = useState<Cell[][]>(initialBoard);
  const [turn, setTurn] = useState<Cell>("red");
  const [winner, setWinner] = useState<Cell | "Draw" | null>(null);

  const checkWinner = (b: Cell[][]) => {
    const directions = [
      { r: 0, c: 1 },
      { r: 1, c: 0 },
      { r: 1, c: 1 },
      { r: 1, c: -1 },
    ];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = b[r][c];
        if (!cell) continue;
        for (const { r: dr, c: dc } of directions) {
          let count = 1;
          for (let k = 1; k < 4; k++) {
            const nr = r + dr * k;
            const nc = c + dc * k;
            if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) break;
            if (b[nr][nc] === cell) count++;
          }
          if (count === 4) return cell;
        }
      }
    }
    return b.flat().every(Boolean) ? "Draw" : null;
  };

  const makeMoveFromServer = (col: number, player: Cell) => {
    const rowIndex = [...board].reverse().findIndex(row => !row[col]);
    if (rowIndex === -1) return;
    const actualRow = ROWS - 1 - rowIndex;
    const newBoard = board.map(row => [...row]);
    newBoard[actualRow][col] = player;
    const result = checkWinner(newBoard);
    if (result) setWinner(result);
    setBoard(newBoard);
    setTurn(player === "red" ? "yellow" : "red");
  };

  const makeMove = (col: number) => {
    if (winner) return;
    const rowIndex = [...board].reverse().findIndex(row => !row[col]);
    if (rowIndex === -1) return;
    const actualRow = ROWS - 1 - rowIndex;
    const newBoard = board.map(row => [...row]);
    newBoard[actualRow][col] = turn;
    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      socket.emit("connect4_winner", result);
    }
    setBoard(newBoard);
    setTurn(turn === "red" ? "yellow" : "red");
    socket.emit("connect4_move", { col, player: turn });
  };

  const restart = () => {
    setBoard(initialBoard);
    setTurn("red");
    setWinner(null);
    socket.emit("connect4_restart");
  };

  useEffect(() => {
    socket.on("connect4_update_board", data => makeMoveFromServer(data.col, data.player));
    socket.on("connect4_game_restart", () => {
      setBoard(initialBoard);
      setTurn("red");
      setWinner(null);
    });
    socket.on("connect4_winner_declared", (winner: "red" | "yellow" | "Draw") => {
      setWinner(winner);
    });
    return () => {
      socket.off("connect4_update_board");
      socket.off("connect4_game_restart");
      socket.off("connect4_winner_declared");
    };
  }, [board]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={0.5} p={0.5}>
      <Typography variant="subtitle2" fontSize={{ xs: 10, sm: 12 }}>
        {winner ? "" : `Turn: ${turn?.toUpperCase()}`}
      </Typography>

      <Paper sx={{ p: 0.5, backgroundColor: "#eee" }}>
        {board.map((row, rIdx) => (
          <Box display="flex" key={rIdx}>
            {row.map((cell, cIdx) => (
              <Box
                key={cIdx}
                onClick={() => makeMove(cIdx)}
                sx={{
                  width: { xs: 25, sm: CELL_SIZE },
                  height: { xs: 25, sm: CELL_SIZE },
                  m: CELL_MARGIN,
                  borderRadius: "50%",
                  backgroundColor: cell ? cell : "#fff",
                  border: "1px solid #999",
                  cursor: winner ? "default" : "pointer",
                }}
              />
            ))}
          </Box>
        ))}
      </Paper>

      {winner && (
        <GameOver winner={winner === "Draw" ? null : winner} onRestart={restart} onBackToMenu={onBackToMenu} />
      )}

      {!winner && (
        <Button size="small" variant="contained" color="secondary" sx={{ mt: 0.5 }} onClick={onBackToMenu}>
          חזור לתפריט
        </Button>
      )}
    </Box>
  );
};

export default Connect4;
