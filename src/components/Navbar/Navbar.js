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
        window.location.href = "/"; 
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
        [`& .MuiDrawer-paper`]: { width: 60, boxSizing: 'border-box', backgroundColor: '#gray' },
    }}
>
    <Box sx={{ overflow: 'auto' }}>
        <List>
            <ListItem button onClick={Home}>
                <ListItemIcon>
                    <Roofing fontSize="large" sx={{ color: '#gray' }} />
                </ListItemIcon>
                
            </ListItem>

            <ListItem button onClick={Profile}>
                <ListItemIcon>
                    <AccountCircle fontSize="large" sx={{ color: '#gray' }} />
                </ListItemIcon>
               
            </ListItem>
            
            <ListItem button onClick={friendslist}>
                <ListItemIcon>
                    <Groups fontSize="large" sx={{ color: '#gray' }} />
                </ListItemIcon>
               
            </ListItem>

            <ListItem button onClick={Logout}>
                <ListItemIcon>
                    <ExitToApp fontSize="large" sx={{ color: '#gray' }} />
                </ListItemIcon>
               
            </ListItem>
        </List>
    </Box>
</Drawer>

    );
}

export default Navbar;


