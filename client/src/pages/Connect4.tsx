import { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import GameOver from "../components/GameOver";

type Cell = null | "red" | "yellow";

interface Connect4Props {
  onBackToMenu: () => void;
}

const ROWS = 5;
const COLS = 6;

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

  const makeMove = (col: number) => {
    if (winner) return;

    // מוצא את השורה הפנויה מהתחתית
    const rowIndex = [...board].reverse().findIndex(row => !row[col]);
    if (rowIndex === -1) return;
    const actualRow = ROWS - 1 - rowIndex;

    const newBoard = board.map(row => [...row]);
    newBoard[actualRow][col] = turn;

    const result = checkWinner(newBoard);
    if (result) setWinner(result);

    setBoard(newBoard);
    setTurn(turn === "red" ? "yellow" : "red");
  };

  const restart = () => {
    setBoard(initialBoard);
    setTurn("red");
    setWinner(null);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Typography variant="h6">
        {winner ? "" : `Turn: ${turn?.toUpperCase()}`}
      </Typography>

      <Paper sx={{ p: 2, backgroundColor: "#eee" }}>
        {board.map((row, rIdx) => (
          <Box display="flex" key={rIdx}>
            {row.map((cell, cIdx) => (
              <Box
                key={cIdx}
                onClick={() => makeMove(cIdx)}
                sx={{
                  width: 50,
                  height: 50,
                  m: 0.5,
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
        <GameOver
          winner={winner === "Draw" ? null : winner}
          onRestart={restart}
          onBackToMenu={onBackToMenu}
        />
      )}
    </Box>
  );
};

export default Connect4;
