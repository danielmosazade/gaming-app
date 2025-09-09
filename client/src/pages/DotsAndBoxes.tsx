import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

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

  const resetGame = () => {
    setLines(new Set());
    setSquares({});
    setScores({ 1: 0, 2: 0 });
    setCurrentPlayer(1);
  };

  const handleLineClick = (lineKey: string) => {
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
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      p={2}
    >
      <Typography variant="h4">Dots & Boxes</Typography>

      {!isGameOver ? (
        <>
          <Typography>
            שחקן נוכחי: {currentPlayer === 1 ? "🟦 שחקן 1" : "🟥 שחקן 2"}
          </Typography>
          <Typography>
            ניקוד – 🟦: {scores[1]} | 🟥: {scores[2]}
          </Typography>

          {/* לוח */}
          <Box
            display="grid"
            gridTemplateColumns={`repeat(${gridSize * 2 - 1}, 24px)`}
            gridTemplateRows={`repeat(${gridSize * 2 - 1}, 24px)`}
            gap={0}
          >
            {Array.from({ length: gridSize * 2 - 1 }).map((_, row) =>
              Array.from({ length: gridSize * 2 - 1 }).map((_, col) => {
                // נקודה
                if (row % 2 === 0 && col % 2 === 0) {
                  return (
                    <Box
                      key={`${row}-${col}`}
                      width={10}
                      height={10}
                      bgcolor="black"
                      borderRadius="50%"
                      mx="auto"
                      my="auto"
                    />
                  );
                }
                // קו אופקי
                if (row % 2 === 0 && col % 2 === 1) {
                  const r = row / 2;
                  const c = (col - 1) / 2;
                  const lineKey = `${r}-${c}-H`;
                  return (
                    <Box
                      key={lineKey}
                      width={24}
                      height={4}
                      bgcolor={getLineColor(lineKey)}
                      sx={{
                        cursor: lines.has(lineKey) ? "default" : "pointer",
                        opacity: lines.has(lineKey) ? 1 : 0.5,
                        transition: "0.2s",
                      }}
                      onClick={() =>
                        !lines.has(lineKey) && handleLineClick(lineKey)
                      }
                    />
                  );
                }
                // קו אנכי
                if (row % 2 === 1 && col % 2 === 0) {
                  const r = (row - 1) / 2;
                  const c = col / 2;
                  const lineKey = `${r}-${c}-V`;
                  return (
                    <Box
                      key={lineKey}
                      width={4}
                      height={24}
                      bgcolor={getLineColor(lineKey)}
                      sx={{
                        cursor: lines.has(lineKey) ? "default" : "pointer",
                        opacity: lines.has(lineKey) ? 1 : 0.5,
                        transition: "0.2s",
                      }}
                      onClick={() =>
                        !lines.has(lineKey) && handleLineClick(lineKey)
                      }
                    />
                  );
                }
                // ריבוע
                if (row % 2 === 1 && col % 2 === 1) {
                  const r = (row - 1) / 2;
                  const c = (col - 1) / 2;
                  const squareKey = `${r}-${c}`;
                  return (
                    <Box
                      key={squareKey}
                      width={24}
                      height={24}
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
        </>
      ) : (
        <>
          <Typography variant="h5">🎉 המשחק נגמר!</Typography>
          <Typography variant="h6">המנצח: {winner}</Typography>
          <Box display="flex" gap={2} mt={2}>
            <Button variant="contained" color="primary" onClick={resetGame}>
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
