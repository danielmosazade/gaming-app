import { Box, Typography, Paper, IconButton, Button } from "@mui/material";
import { useState } from "react";
import TicTacToe from "../pages/TicTacToe";
import Connect4 from "../pages/Connect4";
import MemoryGame from "../pages/MemoryGame";
import SnakeGame from "../pages/SnakeGame";
import RockPaperScissors from "../pages/RockPaperScissors";
import DotsAndBoxes from "../pages/DotsAndBoxes";
import Game2048 from "../pages/Game2048";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Fab } from "@mui/material";

import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import SportsIcon from "@mui/icons-material/Sports";
import MemoryIcon from "@mui/icons-material/Memory";
import PetsIcon from "@mui/icons-material/Pets";
import HandshakeIcon from "@mui/icons-material/Handshake";
import GridOnIcon from "@mui/icons-material/GridOn";
import Filter2Icon from "@mui/icons-material/Filter2";
interface GameMenuProps {
  onBackToMenu: () => void;
}
type GameKey =
  | "TicTacToe"
  | "Connect4"
  | "MemoryGame"
  | "Snake"
  | "RPS"
  | "DotsAndBoxes"
  | "2048"
  | null;

const games: {
  key: GameKey;
  name: string;
  Icon: any;
  color: string;
  description: string;
}[] = [
  {
    key: "TicTacToe",
    name: "TicTacToe",
    Icon: SportsEsportsIcon,
    color: "#FF6B6B",
    description: "איקס ועיגול – המשחק הקלאסי",
  },
  {
    key: "Connect4",
    name: "Connect 4",
    Icon: SportsIcon,
    color: "#4ECDC4",
    description: "חבר ארבעה בטעינה אופקית/אנכית/אלכסונית",
  },
  {
    key: "MemoryGame",
    name: "Memory",
    Icon: MemoryIcon,
    color: "#FFD93D",
    description: "זיכרון – מצא זוגות של קלפים",
  },
  {
    key: "Snake",
    name: "Snake",
    Icon: PetsIcon,
    color: "#6A4C93",
    description: "הנחש הקלאסי – אכול את הפירות והשתדל לא להיתקל בקיר",
  },
  {
    key: "RPS",
    name: "RPS",
    Icon: HandshakeIcon,
    color: "#1FAB89",
    description: "אבן-נייר-מספריים מול השחקן השני",
  },
  {
    key: "DotsAndBoxes",
    name: "Dots & Boxes",
    Icon: GridOnIcon,
    color: "#FF9F1C",
    description: "חבר נקודות ליצירת ריבועים",
  },
  {
    key: "2048",
    name: "2048",
    Icon: Filter2Icon,
    color: "#2EC4B6",
    description: "חיבור מספרים – הגיעו ל־2048!",
  },
];

export default function GameMenu({ onBackToMenu }: GameMenuProps) {
  const [currentGame, setCurrentGame] = useState<GameKey>(null);

  const renderGame = () => {
    switch (currentGame) {
      case "TicTacToe":
        return <TicTacToe onBackToMenu={() => setCurrentGame(null)} />;
      case "Connect4":
        return <Connect4 onBackToMenu={() => setCurrentGame(null)} />;
      case "MemoryGame":
        return <MemoryGame onBackToMenu={() => setCurrentGame(null)} />;
      case "Snake":
        return <SnakeGame onBackToMenu={() => setCurrentGame(null)} />;
      case "RPS":
        return <RockPaperScissors onBackToMenu={() => setCurrentGame(null)} />;
      case "DotsAndBoxes":
        return <DotsAndBoxes onBackToMenu={() => setCurrentGame(null)} />;
      case "2048":
        return <Game2048 onBackToMenu={() => setCurrentGame(null)} />;
      default:
        return null;
    }
  };

  if (currentGame) return renderGame();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={1}
      p={1}
    >
      <Typography variant="h3" mb={2} fontSize={24}>
        🎮 Game Hub
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(70px, 1fr))" // יותר עמודות
        gap={1} // פחות מרווח בין הכרטיסים
        width="100%"
        maxWidth={300}
        maxHeight={400} // גובה קבוע
        p={1}
        sx={{
          overflowY: "auto", // גלילה אנכית
          overflowX: "hidden",
        }}
      >
        {games.map(({ key, name, Icon, color }) => (
          <Paper
            key={key}
            elevation={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: 60,
              height: 60,
              borderRadius: 2,
              cursor: "pointer",
              transition: "0.2s",
              backgroundColor: color,
              color: "white",
              "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
            }}
            onClick={() => setCurrentGame(key)}
          >
            <Icon sx={{ fontSize: 20, mb: 0 }} />
            <Typography variant="caption" textAlign="center">
              {name}
            </Typography>
          </Paper>
        ))}
        <Fab
          color="primary"
          onClick={onBackToMenu}
          sx={{
            mt: 2,
            bgcolor: "#4ECDC4", // צבע טורקיז
            color: "white",
            "&:hover": {
              bgcolor: "#38b2ac", // כהה יותר בהובר
              transform: "scale(1.1)",
              boxShadow: 6,
            },
          }}
        >
          <ArrowBackIcon />
        </Fab>
      </Box>
    </Box>
  );
}
