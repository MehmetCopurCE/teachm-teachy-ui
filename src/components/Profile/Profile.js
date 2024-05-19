import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Paper } from '@mui/material';
import ProfileCard from '../ProfileCard/ProfileCard.js';
import SearchUsers from '../SearchUsers/SearchUsers.js';
import FriendsList from '../FriendLists/FriendsList.js';
import RejectedList from '../FriendLists/RejectedList.js';
import PendingList from '../FriendLists/PendingList.js';

const Profile = () => {
   
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [notificationOpen, setNotificationOpen] = useState(false);   
    const [userId, setUserId] = useState(null);
    const handleCloseNotification = () => {
        setNotificationOpen(false);
    };

    return (
        <Box sx={{ padding: '20px' }}>
            <ProfileCard userId={userId} />
            <PendingList />
            <FriendsList />
            <RejectedList />
            <SearchUsers />
            <Snackbar
                open={notificationOpen}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                message={notificationMessage}
                severity={notificationType} 
                sx={{ bottom: '20px' }}
            />
        </Box>
    );
};

export default Profile;