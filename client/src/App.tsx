import { Container, Box, Paper, Slide, Fade } from "@mui/material";
import Navbar from "./components/Navbar";
import WelcomeCard from "./components/StartGame";
import ChatBox from "./components/ChatBox";
import { useState } from "react";
import Footer from "./components/Footer";
import GameSelector from "./components/GameSelector";

function App() {
  const [started, setStarted] = useState<boolean>(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(to right, #4facfe, #00f2fe)",
      }}
    >
      <Navbar />
      <Container sx={{ py: 5 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          {/* צד שמאל - WelcomeCard או המשחק */}
          <Slide direction="right" in={!started} mountOnEnter unmountOnExit>
            <Fade in={!started} timeout={500}>
              <Paper
                elevation={6}
                sx={{
                  flex: 1,
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 300,
                  overflow: "hidden",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 12,
                  },
                }}
              >
                <WelcomeCard onStart={() => setStarted(true)} />
              </Paper>
            </Fade>
          </Slide>

          <Slide direction="right" in={started} mountOnEnter unmountOnExit>
            <Fade in={started} timeout={500}>
              <Paper
                elevation={6}
                sx={{
                  flex: 1,
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 300,
                  overflow: "hidden",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 12,
                  },
                }}
              >
                <GameSelector/>
              </Paper>
            </Fade>
          </Slide>

          {/* צד ימין - Chat */}
          <Slide direction="left" in={true} mountOnEnter>
            <Fade in={true} timeout={700}>
              <Paper
                elevation={6}
                sx={{
                  flex: 1,
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "white",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 300,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 12,
                  },
                }}
              >
                <ChatBox />
              </Paper>
            </Fade>
          </Slide>
        </Box>
      </Container>
        <Footer/>
    </Box>
  );
}

export default App;
