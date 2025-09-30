import { Container, Box, Paper, Slide, Fade } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "./components/Navbar";
import WelcomeCard from "./components/StartGame";
import ChatBox from "./components/ChatBox";
import { useState } from "react";
import Footer from "./components/Footer";
import GameMenu from "./components/GameMenu";

const theme = createTheme();

function App() {
  const [started, setStarted] = useState<boolean>(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",          // ✅ מוסיפים Flex
          flexDirection: "column",  // ✅ סידור טורים
          bgcolor: "linear-gradient(to right, #4facfe, #00f2fe)",
        }}
      >
        <Navbar />

        {/* התוכן גודל דינאמית כדי לדחוף את הפוטר */}
        <Container sx={{ py: 5, flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
            }}
          >
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
                  <GameMenu onBackToMenu={() => setStarted(false)} />
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

        {/* הפוטר תמיד בתחתית */}
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
