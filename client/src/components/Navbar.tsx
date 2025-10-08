// Navbar.tsx
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="static" color="primary" sx={{ borderRadius: "0 0 12px 12px" }}>
      <Toolbar>
        <SportsEsportsIcon sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          ONLINE GAME
        </Typography>

        <Box>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
          <Button color="inherit" component={Link} to="/help">
            Help
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
