import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Avatar, Snackbar } from '@mui/material';
import './ProfileCard.css';

const ProfileCard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [friendCount, setFriendCount] = useState(0);
    const [notificationType, setNotificationType] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationOpen, setNotificationOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('tokenKey');
                const userId = localStorage.getItem('userId');

                if (!userId || !token) {
                    throw new Error('User ID or Token is missing');
                }

                // Fetch user profile data
                const userProfileResponse = await fetch(`http://localhost/api/users/${userId}`, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                });

                if (!userProfileResponse.ok) {
                    throw new Error('Failed to fetch user information');
                }

                const userData = await userProfileResponse.json();
                setUserData(userData);

                // Fetch user friends data to calculate friend count
                const userFriendsResponse = await fetch(`http://localhost/api/users/${userId}/friends`, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                });

                if (!userFriendsResponse.ok) {
                    throw new Error('Failed to fetch friends information');
                }

                const friendsData = await userFriendsResponse.json();
                setFriendCount(friendsData.length);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error.message);
                setError(error.message);
                setNotificationMessage(error.message);
                setNotificationType('error');
                setNotificationOpen(true);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCloseNotification = () => {
        setNotificationOpen(false);
    };

    return (
        <Box className="wrapper">
            <Paper className="user-card" elevation={3}>
                <div className="user-card-img">
                    <Avatar
                        src={userData?.avatarUrl}//it works!!!!!!! 
                        alt={userData?.username}
                        className="profile-avatar"
                    />
                </div>
                <div className="user-card-info">
                    <Typography variant="h2">{userData?.username}</Typography>
                    <Typography variant="body1">
                        <span>Name:</span> {userData?.firstName}
                    </Typography>
                    <Typography variant="body1">
                        <span>Surname:</span> {userData?.lastName}
                    </Typography>
                    <Typography variant="body1">
                        <span>E-mail:</span> {userData?.email}
                    </Typography>
                    <Typography variant="body1">
                        <span>User Statistics:</span> {userData?.userStatistic}
                    </Typography>
                    <Typography variant="body1">
                        <strong>{friendCount}</strong> Friends
                    </Typography>
                </div>
            </Paper>
            <Snackbar
                open={notificationOpen}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                message={notificationMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Box>
    );
};

export default ProfileCard;
