import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

const Navbar = () => {
  return (
    <AppBar position="static" color="primary" sx={{ borderRadius: "0 0 12px 12px" }}>
      <Toolbar>
        {/* לוגו + טקסט */}
        <SportsEsportsIcon sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          ONLINE GAME
        </Typography>

        {/* לינקים */}
        <Box>
          <Button color="inherit">About</Button>
          <Button color="inherit">Help</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
