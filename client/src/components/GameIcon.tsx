import { Box, Typography } from "@mui/material";

interface GameIconProps {
  title: string;
  onClick: () => void;
}

const GameIcon = ({ title, onClick }: GameIconProps) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: 80,
        height: 80,
        border: "2px solid #333",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        transition: "0.2s",
        "&:hover": { backgroundColor: "#f0f0f0" },
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        {title === "X/O" ? "X / O" : title === "Connect 4" ? "4" : ""}
      </Typography>
      <Typography variant="caption" sx={{ mt: 1 }}>
        {title}
      </Typography>
    </Box>
  );
};

export default GameIcon;
