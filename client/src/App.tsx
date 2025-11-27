import { Container, Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import FunFactsPage from "./pages/FunFactsPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";

const theme = createTheme();

function App() {
    return (
  <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            bgcolor: "linear-gradient(to right, #4facfe, #00f2fe)",
          }}
        >
          <Navbar />

          <Container sx={{ py: 5, flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/help" element={<FunFactsPage />} />
            </Routes>
          </Container>

          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
