import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom'; // Import Link component from React Router

// Define orange theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#FFA500', // Orange color
    },
  },
});

export default function Navbar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        {/* Button to open the drawer */}
        <button onClick={toggleDrawer(true)}>Open drawer</button>
        
        {/* Drawer component */}
        <Drawer
  open={open}
  onClose={toggleDrawer(false)}
  anchor="right" // Set the anchor to left
  sx={{
    '& .MuiDrawer-paper': {
      backgroundColor: theme.palette.primary.main,
      width: '200px',
    },
  }}
>
  {/* Drawer content */}
</Drawer>

      </div>
    </ThemeProvider>
  );
}
