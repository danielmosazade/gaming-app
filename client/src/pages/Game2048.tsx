import { useEffect, useState } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";

interface Game2048Props {
  onBackToMenu: () => void;
}

const GRID_SIZE = 4;
type Grid = number[][];

export default function Game2048({ onBackToMenu }: Game2048Props) {
  const [grid, setGrid] = useState<Grid>(initGrid());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  function initGrid(): Grid {
    const newGrid: Grid = Array.from({ length: GRID_SIZE }, () =>
      Array(GRID_SIZE).fill(0)
    );
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    return newGrid;
  }

  function addRandomTile(grid: Grid) {
    const empty: [number, number][] = [];
    grid.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell === 0) empty.push([r, c]);
      })
    );
    if (empty.length === 0) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  function cloneGrid(grid: Grid): Grid {
    return grid.map((row) => [...row]);
  }

  function move(direction: "up" | "down" | "left" | "right") {
    let moved = false;
    const newGrid = cloneGrid(grid);
    let newScore = score;

    const mergeLine = (line: number[]) => {
      let newLine = line.filter((n) => n !== 0);
      for (let i = 0; i < newLine.length - 1; i++) {
        if (newLine[i] === newLine[i + 1]) {
          newLine[i] *= 2;
          newScore += newLine[i];
          newLine[i + 1] = 0;
        }
      }
      newLine = newLine.filter((n) => n !== 0);
      while (newLine.length < GRID_SIZE) newLine.push(0);
      return newLine;
    };

    if (direction === "left" || direction === "right") {
      for (let r = 0; r < GRID_SIZE; r++) {
        let line =
          direction === "left" ? newGrid[r] : [...newGrid[r]].reverse();
        const merged = mergeLine(line);
        if (direction === "right") merged.reverse();
        if (!arraysEqual(merged, newGrid[r])) moved = true;
        newGrid[r] = merged;
      }
    } else {
      for (let c = 0; c < GRID_SIZE; c++) {
        let line = [];
        for (let r = 0; r < GRID_SIZE; r++) line.push(newGrid[r][c]);
        if (direction === "down") line.reverse();
        const merged = mergeLine(line);
        if (direction === "down") merged.reverse();
        for (let r = 0; r < GRID_SIZE; r++) {
          if (newGrid[r][c] !== merged[r]) moved = true;
          newGrid[r][c] = merged[r];
        }
      }
    }

    if (moved) {
      addRandomTile(newGrid);
      setGrid(newGrid);
      setScore(newScore);
      if (checkGameOver(newGrid)) setGameOver(true);
    }
  }

  const arraysEqual = (a: number[], b: number[]) =>
    a.every((v, i) => v === b[i]);

  function checkGameOver(grid: Grid): boolean {
    for (let r = 0; r < GRID_SIZE; r++)
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c] === 0) return false;
        if (c < GRID_SIZE - 1 && grid[r][c] === grid[r][c + 1]) return false;
        if (r < GRID_SIZE - 1 && grid[r][c] === grid[r + 1][c]) return false;
      }
    return true;
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === "ArrowUp") move("up");
      else if (e.key === "ArrowDown") move("down");
      else if (e.key === "ArrowLeft") move("left");
      else if (e.key === "ArrowRight") move("right");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [grid, gameOver]);

  const restartGame = () => {
    setGrid(initGrid());
    setScore(0);
    setGameOver(false);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={1}
      p={1}
    >
      <Box display="flex" alignItems="center" gap={2} >
        <Typography variant="h5">2048</Typography>|
        <Typography fontSize={14}>Score: {score}</Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 40px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 40px)`,
          gap: 2,
          backgroundColor: "#bbada0",
          padding: 3,
          borderRadius: 1,
        }}
      >
        {grid.flat().map((cell, idx) => (
          <Paper
            key={idx}
            sx={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: 16,
              backgroundColor: cell === 0 ? "#cdc1b4" : "#eee4da",
            }}
          >
            {cell !== 0 ? cell : ""}
          </Paper>
        ))}
      </Box>

      {gameOver && (
        <Typography color="error" variant="subtitle1">
          Game Over! 💀
        </Typography>
      )}

      <Box display="flex" gap={1} mt={1}>
        <Button variant="contained" size="small" onClick={restartGame}>
          🔄 חדש
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={onBackToMenu}
        >
          ↩️ חזור
        </Button>
      </Box>
    </Box>
  );
}
