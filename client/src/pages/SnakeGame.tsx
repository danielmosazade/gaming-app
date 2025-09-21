import { useEffect, useState } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";

interface SnakeGameProps {
  onBackToMenu: () => void;
}

type Point = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const GRID_SIZE = 12;      // קטן יותר, עדיין מספיק כיף
const CELL_SIZE = 18;      // כל קוביה 18px
const GAP = 1;             // רווח קטן בין התאים
const INITIAL_SNAKE: Point[] = [{ x: Math.floor(GRID_SIZE/2), y: Math.floor(GRID_SIZE/2) }];

export default function SnakeGame({ onBackToMenu }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // מאזין למקשים
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
    const interval = setInterval(() => moveSnake(), 200);
    return () => clearInterval(interval);
  });

  const moveSnake = () => {
    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      if (direction === "UP") head.y -= 1;
      if (direction === "DOWN") head.y += 1;
      if (direction === "LEFT") head.x -= 1;
      if (direction === "RIGHT") head.x += 1;

      // בדיקת התנגשות בקירות
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setIsGameOver(true);
        return prevSnake;
      }

      // בדיקת התנגשות בגוף
      if (prevSnake.some(s => s.x === head.x && s.y === head.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // אם נאכל המזון
      if (head.x === food.x && head.y === food.y) {
        setFood({
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        });
        setScore(s => s + 1);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  };

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood({ x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) });
    setDirection("RIGHT");
    setIsGameOver(false);
    setScore(0);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={1} p={1}>
      <Typography variant="h5">🐍 Snake</Typography>
      <Typography fontSize={14}>ניקוד: {score}</Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gap: `${GAP}px`,
          backgroundColor: "grey.800",
          border: "2px solid black",
          mt: 1
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some(s => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <Paper
              key={i}
              sx={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: isSnake ? "green" : isFood ? "red" : "white",
              }}
            />
          );
        })}
      </Box>

      {/* כפתורי כיוון */}
      <Box mt={1} display="flex" flexDirection="column" alignItems="center" gap={0.5}>
        <Button size="small" variant="outlined" onClick={() => direction !== "DOWN" && setDirection("UP")}>⬆️</Button>
        <Box display="flex" gap={0.5}>
          <Button size="small" variant="outlined" onClick={() => direction !== "RIGHT" && setDirection("LEFT")}>⬅️</Button>
          <Button size="small" variant="outlined" onClick={() => direction !== "UP" && setDirection("DOWN")}>⬇️</Button>
          <Button size="small" variant="outlined" onClick={() => direction !== "LEFT" && setDirection("RIGHT")}>➡️</Button>
        </Box>
      </Box>

      {/* כפתורי פעולה */}
      {isGameOver && (
        <Box display="flex" gap={1} mt={1}>
          <Button size="small" variant="contained" onClick={restartGame}>שחק שוב</Button>
          <Button size="small" variant="contained" color="secondary" onClick={onBackToMenu}>חזור לתפריט</Button>
        </Box>
      )}

      {!isGameOver && (
        <Button size="small" variant="contained" color="secondary" sx={{ mt: 1 }} onClick={onBackToMenu}>
          חזור לתפריט
        </Button>
      )}
    </Box>
  );
}
