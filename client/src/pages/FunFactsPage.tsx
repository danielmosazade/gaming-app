import { useState } from "react";
import { Box, Typography, Container, Paper, Button } from "@mui/material";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

const funFacts = [
  { icon: "🎮", text: "ידעת? המשחק הכי נמכר בכל הזמנים הוא Minecraft!" },
  {
    icon: "🕹️",
    text: "ב־1983, יותר מ־10 מיליון עותקים של משחקי Atari נמכרו עם באג!",
  },
  {
    icon: "⚡",
    text: "הזוכה במשחקי השחמט הראשון נגד מחשב הפסיד תוך 6 מהלכים בלבד!",
  },
  { icon: "👾", text: "Pac-Man היה המשחק הראשון שהפך לפופ-קולטיורה!" },
  {
    icon: "🚀",
    text: "משחקי רשת ראשונים שימשו להמרות בין אוניברסיטאות בשנות ה-70.",
  },
];

export default function FunFactsPage() {
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleClick = (index: number) => {
    setClickedIndex(index);

    confetti({
      particleCount: 80,
      spread: 50,
      origin: { y: 0.6 },
      colors: ["#ff0a54", "#ff477e", "#ff85a1", "#fbb1b1", "#f9bec7"],
    });

    setTimeout(() => setClickedIndex(null), 1000);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        bgcolor: "linear-gradient(to right, #1e3c72, #2a5298)",
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 4 },
        color: "white",
      }}
    >
      <Container
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: "bold",
            textAlign: "center",
            color: "black", // כאן
          }}
        >
          🎉 עובדות מהנות על משחקים 🎉
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 2,
            width: "100%",
          }}
        >
          {funFacts.map((fact, index) => (
            <Paper
              key={index}
              onClick={() => handleClick(index)}
              sx={{
                flex: "1 1 250px",
                maxWidth: 300,
                p: 2,
                borderRadius: 3,
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                transform: clickedIndex === index ? "scale(1.05)" : "scale(1)",
                boxShadow:
                  clickedIndex === index
                    ? "0px 8px 24px rgba(255,255,255,0.3)"
                    : undefined,
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 8px 24px rgba(255,255,255,0.2)",
                },
                bgcolor: "rgba(255,255,255,0.05)",
              }}
            >
              <Typography sx={{ fontSize: { xs: 40, md: 50 }, mb: 1 }}>
                {fact.icon}
              </Typography>
              <Typography variant="body1">{fact.text}</Typography>
            </Paper>
          ))}
        </Box>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/")}
          sx={{ mt: 1, fontSize: "0.8rem", py: 0.7, px: 2 }}
        >
          חזרה למשחקים
        </Button>
      </Container>
    </Box>
  );
}
