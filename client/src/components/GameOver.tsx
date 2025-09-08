import { Box, Button, Typography } from "@mui/material";

interface GameOverProps {
  winner: string | null;
  onRestart: () => void;
  onBackToMenu: () => void;
}

const GameOver = ({ winner, onRestart, onBackToMenu }: GameOverProps) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={2}>
      <Typography variant="h5">
        {winner ? `Winner: ${winner.toUpperCase()}` : "Draw!"}
      </Typography>
      <Box display="flex" gap={2}>
        <Button variant="contained" color="primary" onClick={onRestart}>
          משחק חדש
        </Button>
        <Button variant="outlined" color="secondary" onClick={onBackToMenu}>
          חזור לתפריט
        </Button>
      </Box>
    </Box>
  );
};

export default GameOver;
