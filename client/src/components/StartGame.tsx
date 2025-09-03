import { Box, Button, Typography } from "@mui/material";

interface WelcomeCardProps {
  onStart: () => void;
}

function WelcomeCard({ onStart }: WelcomeCardProps) {
  return (
    <Box textAlign="center">
      <Typography variant="h4" gutterBottom>
        👋 Welcome to the Game!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={onStart}
      >
        Start Game
      </Button>
    </Box>
  );
}

export default WelcomeCard;
