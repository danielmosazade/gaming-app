import { Box } from "@mui/material";
import { useState } from "react";
import GameIcon from "./GameIcon";
import TicTacToe from "../pages/TicTacToe";
import Connect4 from "../pages/Connect4";

const GameSelector = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const renderGame = () => {
    if (selectedGame === "X/O") return <TicTacToe onBackToMenu={() => setSelectedGame(null)} />;
    if (selectedGame === "Connect 4") return <Connect4 onBackToMenu={() => setSelectedGame(null)} />;
    return null;
  };

  if (selectedGame) return renderGame();

  return (
    <Box display="flex" gap={2} flexWrap="wrap">
      <GameIcon title="X/O" onClick={() => setSelectedGame("X/O")} />
      <GameIcon title="Connect 4" onClick={() => setSelectedGame("Connect 4")} />
      {/* כאן אפשר להוסיף עוד משחקים */}
    </Box>
  );
};

export default GameSelector;
