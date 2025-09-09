import { useEffect, useState } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";

interface SnakeGameProps {
  onBackToMenu: () => void;
}

type Point = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const GRID_SIZE = 15;
const INITIAL_SNAKE: Point[] = [{ x: 7, y: 7 }];

export default function SnakeGame({ onBackToMenu }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // האזנה למקשים
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && direction !== "DOWN") setDirection("UP");
      else if (e.key === "ArrowDown" && direction !== "UP") setDirection("DOWN");
      else if (e.key === "ArrowLeft" && direction !== "RIGHT") setDirection("LEFT");
      else if (e.key === "ArrowRight" && direction !== "LEFT") setDirection("RIGHT");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  // לולאת המשחק
  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      moveSnake();
    }, 200);

    return () => clearInterval(interval);
  });

  const moveSnake = () => {
    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };

      if (direction === "UP") head.y -= 1;
      if (direction === "DOWN") head.y += 1;
      if (direction === "LEFT") head.x -= 1;
      if (direction === "RIGHT") head.x += 1;

      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      if (head.x === food.x && head.y === food.y) {
        setFood({
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        });
        setScore((s) => s + 1);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  };

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    });
    setDirection("RIGHT");
    setIsGameOver(false);
    setScore(0);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={0.5} >
      <Typography variant="h4">🐍 Snake</Typography>
      <Typography>ניקוד: {score}</Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`,
          gap: "1px",
          backgroundColor: "grey.800",
          border: "2px solid black",
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some((s) => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <Paper
              key={i}
              sx={{
                width: 20,
                height: 20,
                backgroundColor: isSnake
                  ? "green"
                  : isFood
                  ? "red"
                  : "white",
              }}
            />
          );
        })}
      </Box>

      <Box mt={2} display="flex" flexDirection="column" alignItems="center" gap={1}>
        <Button
          variant="outlined"
          onClick={() => direction !== "DOWN" && setDirection("UP")}
        >
          ⬆️
        </Button>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            onClick={() => direction !== "RIGHT" && setDirection("LEFT")}
          >
            ⬅️
          </Button>
          <Button
            variant="outlined"
            onClick={() => direction !== "UP" && setDirection("DOWN")}
          >
            ⬇️
          </Button>
          <Button
            variant="outlined"
            onClick={() => direction !== "LEFT" && setDirection("RIGHT")}
          >
            ➡️
          </Button>
        </Box>
      </Box>

      {/* כפתורי פעולה באותה השורה */}
      {isGameOver && (
        <Box display="flex" gap={2} mt={2}>
          <Button variant="contained" onClick={restartGame}>
            שחק שוב
          </Button>
          <Button variant="contained" color="secondary" onClick={onBackToMenu}>
            חזור לתפריט
          </Button>
        </Box>
      )}

      {!isGameOver && (
        <Button variant="contained" color="secondary" onClick={onBackToMenu}>
          חזור לתפריט
        </Button>
      )}
    </Box>
  );
}
