import React from 'react';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Groups from '@mui/icons-material/Groups';
import ExitToApp from '@mui/icons-material/ExitToApp';
import { Typography } from '@mui/material';
import { Roofing } from '@mui/icons-material';

function Navbar() {
    const navigate = useNavigate();

    const Logout = () => {
        window.localStorage.removeItem("tokenKey");
        window.localStorage.removeItem("refreshKey");
        window.localStorage.removeItem("userId");
        window.localStorage.removeItem("userName");
        navigate("/loginsignup");
    };

    const Profile = () => {
        navigate("/profile");
    };

    const friendslist = () => {
        navigate("/friendslist");
    };

    const Home = () => {
        navigate("/home");
    };

    return (
<Drawer
    variant="permanent"
    sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', backgroundColor: '#4c00b4' },
    }}
>
    <Box sx={{ overflow: 'auto' }}>
        <List>
            <ListItem button onClick={Home}>
                <ListItemIcon>
                    <Roofing fontSize="large" sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary={<Typography variant="h6" sx={{ color: 'white' }}>Home</Typography>} />
            </ListItem>

            <ListItem button onClick={Profile}>
                <ListItemIcon>
                    <AccountCircle fontSize="large" sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary={<Typography variant="h6" sx={{ color: 'white' }}>Profile</Typography>} />
            </ListItem>
            
            <ListItem button onClick={friendslist}>
                <ListItemIcon>
                    <Groups fontSize="large" sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary={<Typography variant="h6" sx={{ color: 'white' }}>Friends</Typography>} />
            </ListItem>

            <ListItem button onClick={Logout}>
                <ListItemIcon>
                    <ExitToApp fontSize="large" sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary={<Typography variant="h6" sx={{ color: 'white' }}>Logout</Typography>} />
            </ListItem>
        </List>
    </Box>
</Drawer>

    );
}

export default Navbar;


