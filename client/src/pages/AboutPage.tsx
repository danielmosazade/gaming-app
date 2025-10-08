import { useState, useEffect } from "react";
import { Box, Typography, Button, Container, Fade } from "@mui/material";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

const easterText = [
  "האתר הזה נבנה בשעות הקפה המוקדמות של דניאל ☕",
  "אם תמצא באג, הוא כנראה שם בכוונה 😉",
  "זכור: כל משחק כאן הוא הזדמנות לצחוק קצת יותר 🎉",
  "טיפ סודי: לוחץ על האייקון החמוד פעם חמישית? יש הפתעה! 🐾",
];

export default function AboutPage() {
  const [currentText, setCurrentText] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % easterText.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleCatClick = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);

    if (newClicks >= 5) {
      setShowEasterEgg(true);
      setClicks(0);

      confetti({
        particleCount: 120,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#ff0a54", "#ff477e", "#ff85a1", "#fbb1b1", "#f9bec7"],
      });

      setTimeout(() => setShowEasterEgg(false), 4000);
    }
  };

  return (
    <Box
      sx={{
        // minHeight: "calc(100vh - 60px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start", // למעלה
        bgcolor: "linear-gradient(to right, #1e3c72, #2a5298)",
        px: { xs: 1, md: 2 },
        py: { xs: 2, md: 3 },
        color: "white",
      }}
    >
      <Container
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start", // למעלה
          textAlign: "center",
          gap: 1, // רווח מצומצם עוד יותר
        }}
      >
        <Box
          sx={{
            fontSize: { xs: 35, md: 50 },
            animation: "bounce 1.5s infinite",
            cursor: "pointer",
          }}
          onClick={handleCatClick}
        >
          🐾
        </Box>

        <Typography variant="h6" gutterBottom     sx={{
            mb: 2,
            fontWeight: "bold",
            textAlign: "center",
            color: "black", 
          }}>
          ברוכים הבאים לעולם המשחקים שלנו!
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mb: 2,
            fontWeight: "bold",
            textAlign: "center",
            color: "black", 
          }}
          gutterBottom
        >
          כאן תוכלו לאתגר את עצמכם, לשחק עם חברים ולגלות הפתעות בכל משחק.
        </Typography>

        <Fade in timeout={700}>
          <Typography
            variant="body2"
            sx={{
              mt: 0.3,
              fontStyle: "italic",
              color: "secondary.light",
              fontWeight: "bold",
            }}
          >
            {easterText[currentText]}
          </Typography>
        </Fade>

        {showEasterEgg && (
          <Typography
            variant="subtitle2"
            sx={{ mt: 1, color: "yellow", fontWeight: "bold" }}
          >
            🎊 מזל טוב! גילית את ההפתעה המיוחדת שלנו! 🎊
          </Typography>
        )}

        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/")}
          sx={{ mt: 1, fontSize: "0.8rem", py: 0.7, px: 2 }}
        >
          חזרה למשחקים
        </Button>
      </Container>

      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}
      </style>
    </Box>
  );
}
