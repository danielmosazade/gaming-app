import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // הגדרות מותאמות למובייל
  const py = isMobile ? 2 : 4;
  const fontSizeTitle = isMobile ? "1rem" : "1.2rem";
  const fontSizeSub = isMobile ? "0.7rem" : "0.85rem";
  const particleCount = isMobile ? 30 : 50;
  const particleSize = isMobile ? 3 : 4;

  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        py,
        px: 2,
        position: "relative",
        overflow: "hidden",
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
        background: "radial-gradient(circle at center, #4facfe 0%, #00f2fe 100%)",
        boxShadow: "0 0 30px #4facfe, 0 0 60px #00f2fe",
      }}
    >
      {/* חלקיקים */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
          "&::before": {
            content: '""',
            position: "absolute",
            width: `${particleSize}px`,
            height: `${particleSize}px`,
            borderRadius: "50%",
            background: "#fff",
            top: "50%",
            left: "50%",
            boxShadow: Array.from({ length: particleCount }, () => {
              const x = Math.random() * 600 - 300;
              const y = Math.random() * 80 - 40;
              const color = ["#fff", "#4facfe", "#00f2fe"][Math.floor(Math.random() * 3)];
              return `${x}px ${y}px ${color}`;
            }).join(","),
            animation: "particlesFloat 6s ease-in-out infinite",
          },
          "@keyframes particlesFloat": {
            "0%": { transform: "translate(0,0) scale(1)" },
            "25%": { transform: "translate(15px,-7px) scale(1.05)" },
            "50%": { transform: "translate(0,-15px) scale(1.1)" },
            "75%": { transform: "translate(-15px,-7px) scale(1.05)" },
            "100%": { transform: "translate(0,0) scale(1)" },
          },
        }}
      />

      {/* כותרת */}
      <Typography
        variant="h6"
        sx={{
          position: "relative",
          zIndex: 1,
          textShadow:
            "0 0 8px #fff, 0 0 15px #4facfe, 0 0 25px #00f2fe, 0 0 40px #4facfe",
          fontSize: fontSizeTitle,
          animation: "glowText 2s ease-in-out infinite alternate",
          "@keyframes glowText": {
            "0%": { textShadow: "0 0 8px #fff, 0 0 15px #4facfe, 0 0 25px #00f2fe" },
            "50%": { textShadow: "0 0 15px #fff, 0 0 30px #4facfe, 0 0 50px #00f2fe" },
            "100%": { textShadow: "0 0 8px #fff, 0 0 15px #4facfe, 0 0 25px #00f2fe" },
          },
        }}
      >
        © {new Date().getFullYear()} Your Game App
      </Typography>

      {/* כותרת משנה */}
      <Typography
        variant="body2"
        sx={{
          mt: 0.5,
          position: "relative",
          zIndex: 1,
          textShadow: "0 0 4px #fff, 0 0 8px #4facfe",
          fontSize: fontSizeSub,
        }}
      >
        Built with ❤️ by Daniel
      </Typography>
    </Box>
  );
}
