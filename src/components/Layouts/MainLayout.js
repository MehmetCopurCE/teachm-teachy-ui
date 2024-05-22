// MainLayout.js

import React from 'react';
import { Box, Grid } from '@mui/material';
import Home from '../Home/Home';
import Profile from '../Profile/Profile';
import LoginBar from '../LoginSignup/LoginSignup'; // Import your LoginBar component
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Search } from '@mui/icons-material';

const MainLayout = () => {
  return (
    <Box sx={{ padding: '20px' }}>
      {/* LoginBar component */}
      <LoginBar />
        <Grid container spacing={70}>
          {/* Left panel for Home component */}
          <Grid item xs={12} md={5}>
            <Home />
          </Grid>
          {/* Middle panel for Profile component */}
          <Grid item xs={12} md={6}>
            <Profile />
          </Grid>
          {/* Right panel for any additional content */}
          <Grid item xs={12} md={6}>
          <Search />
          </Grid>
        </Grid>
      </Box>
  );
};

export default MainLayout;
