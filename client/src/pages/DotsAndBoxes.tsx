import { Box, Button, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface DotsAndBoxesProps {
  onBackToMenu: () => void;
}

type Player = 1 | 2;

export default function DotsAndBoxes({ onBackToMenu }: DotsAndBoxesProps) {
  const gridSize = 4; // 4x4 נקודות
  const totalSquares = (gridSize - 1) * (gridSize - 1);

  const [lines, setLines] = useState<Set<string>>(new Set());
  const [squares, setSquares] = useState<Record<string, Player>>({});
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [scores, setScores] = useState<{ 1: number; 2: number }>({
    1: 0,
    2: 0,
  });
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    socketRef.current.on("dots_update_board", (data: { lineKey: string; player: 1 | 2 }) => {
      handleLineClick(data.lineKey, false);
    });

    socketRef.current.on("dots_game_reset", () => {
      resetGame();
    });

    return () => {
      socketRef.current?.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  const resetGame = () => {
    setLines(new Set());
    setSquares({});
    setScores({ 1: 0, 2: 0 });
    setCurrentPlayer(1);
  };

  // ריסט דרך השרת
  const resetGameWithServer = () => {
    socketRef.current?.emit("dots_reset");
    resetGame();
  };

  const handleLineClick = (lineKey: string, sendToServer: boolean = true) => {
    if (lines.has(lineKey)) return;

    const newLines = new Set(lines);
    newLines.add(lineKey);

    const newSquares = { ...squares };
    const newScores = { ...scores };
    let completedSquare = false;

    // בדיקה אם נסגר ריבוע חדש
    for (let r = 0; r < gridSize - 1; r++) {
      for (let c = 0; c < gridSize - 1; c++) {
        const squareKey = `${r}-${c}`;
        const top = `${r}-${c}-H`;
        const bottom = `${r + 1}-${c}-H`;
        const left = `${r}-${c}-V`;
        const right = `${r}-${c + 1}-V`;

        if (
          newLines.has(top) &&
          newLines.has(bottom) &&
          newLines.has(left) &&
          newLines.has(right) &&
          !newSquares[squareKey]
        ) {
          newSquares[squareKey] = currentPlayer;
          newScores[currentPlayer]++;
          completedSquare = true;
        }
      }
    }

    setLines(newLines);
    setSquares(newSquares);
    setScores(newScores);

    if (!completedSquare) {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
    // שלח לשרת רק אם זה מהלך מקומי
    if (sendToServer && socketRef.current) {
      socketRef.current.emit("dots_move", { lineKey, player: currentPlayer });
    }
  };

  const isGameOver = Object.keys(squares).length === totalSquares;
  let winner: string | null = null;
  if (isGameOver) {
    if (scores[1] > scores[2]) winner = "שחקן 1 🟦";
    else if (scores[2] > scores[1]) winner = "שחקן 2 🟥";
    else winner = "תיקו 🤝";
  }

  const getLineColor = (lineKey: string) => {
    if (!lines.has(lineKey)) return "lightgray";
    // קווים שסגרו ריבוע ישמרו בצבע של השחקן שסגר אותו
    for (let r = 0; r < gridSize - 1; r++) {
      for (let c = 0; c < gridSize - 1; c++) {
        const squareKey = `${r}-${c}`;
        const top = `${r}-${c}-H`;
        const bottom = `${r + 1}-${c}-H`;
        const left = `${r}-${c}-V`;
        const right = `${r}-${c + 1}-V`;
        if (
          lines.has(top) &&
          lines.has(bottom) &&
          lines.has(left) &&
          lines.has(right) &&
          squares[squareKey]
        ) {
          if ([top, bottom, left, right].includes(lineKey)) {
            return squares[squareKey] === 1 ? "blue" : "red";
          }
        }
      }
    }
    // קו לחיץ לפני סגירת ריבוע
    return currentPlayer === 1 ? "blue" : "red";
  };

  return (
<Box display="flex" flexDirection="column" alignItems="center" gap={1} p={2}>
  <Typography variant="h5">Dots & Boxes</Typography>

  {!isGameOver ? (
    <>
      <Typography fontSize={14}>
        שחקן נוכחי: {currentPlayer === 1 ? "🟦 שחקן 1" : "🟥 שחקן 2"}
      </Typography>
      <Typography fontSize={14}>
        ניקוד – 🟦: {scores[1]} | 🟥: {scores[2]}
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns={`repeat(${gridSize * 2 - 1}, 16px)`}
        gridTemplateRows={`repeat(${gridSize * 2 - 1}, 16px)`}
        gap={1}
      >
        {Array.from({ length: gridSize * 2 - 1 }).map((_, row) =>
          Array.from({ length: gridSize * 2 - 1 }).map((_, col) => {
            if (row % 2 === 0 && col % 2 === 0) {
              // נקודה
              return (
                <Box
                  key={`${row}-${col}`}
                  width={6}
                  height={6}
                  bgcolor="black"
                  borderRadius="50%"
                  mx="auto"
                  my="auto"
                />
              );
            }
            if (row % 2 === 0 && col % 2 === 1) {
              const r = row / 2;
              const c = (col - 1) / 2;
              const lineKey = `${r}-${c}-H`;
              return (
                <Box
                  key={lineKey}
                  width={16}
                  height={3}
                  bgcolor={getLineColor(lineKey)}
                  sx={{
                    cursor: lines.has(lineKey) ? "default" : "pointer",
                    opacity: lines.has(lineKey) ? 1 : 0.5,
                    transition: "0.2s",
                  }}
                  onClick={() => !lines.has(lineKey) && handleLineClick(lineKey)}
                />
              );
            }
            if (row % 2 === 1 && col % 2 === 0) {
              const r = (row - 1) / 2;
              const c = col / 2;
              const lineKey = `${r}-${c}-V`;
              return (
                <Box
                  key={lineKey}
                  width={3}
                  height={16}
                  bgcolor={getLineColor(lineKey)}
                  sx={{
                    cursor: lines.has(lineKey) ? "default" : "pointer",
                    opacity: lines.has(lineKey) ? 1 : 0.5,
                    transition: "0.2s",
                  }}
                  onClick={() => !lines.has(lineKey) && handleLineClick(lineKey)}
                />
              );
            }
            if (row % 2 === 1 && col % 2 === 1) {
              const r = (row - 1) / 2;
              const c = (col - 1) / 2;
              const squareKey = `${r}-${c}`;
              return (
                <Box
                  key={squareKey}
                  width={16}
                  height={16}
                  bgcolor={
                    squares[squareKey]
                      ? squares[squareKey] === 1
                        ? "lightblue"
                        : "lightcoral"
                      : "transparent"
                  }
                  border={squares[squareKey] ? "1px solid gray" : undefined}
                  sx={{ opacity: squares[squareKey] ? 0.7 : 1 }}
                />
              );
            }
            return null;
          })
        )}
      </Box>

      <Box display="flex" gap={2} mt={2}>
        <Button variant="contained" color="primary" onClick={resetGameWithServer}>
          🔄 משחק חדש
        </Button>
        <Button variant="outlined" color="secondary" onClick={onBackToMenu}>
          ↩️ חזור לתפריט
        </Button>
      </Box>
    </>
  ) : (
    <>
      <Typography variant="h5">🎉 המשחק נגמר!</Typography>
      <Typography variant="h6">המנצח: {winner}</Typography>
      <Box display="flex" gap={2} mt={2}>
        <Button variant="contained" color="primary" onClick={resetGameWithServer}>
          🔄 משחק חדש
        </Button>
        <Button variant="outlined" color="secondary" onClick={onBackToMenu}>
          ↩️ חזור לתפריט
        </Button>
      </Box>
    </>
  )}
</Box>


  );
}