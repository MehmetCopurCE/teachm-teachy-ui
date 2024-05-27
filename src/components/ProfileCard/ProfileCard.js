import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Avatar, Snackbar } from '@mui/material';
import './ProfileCard.css'; // Import the CSS file

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
        <Box className="profile-container">
            <Paper className="profile-card" elevation={3}>
                {loading && <div>Loading...</div>}
                {error && <div>Error: {error}</div>}
                {userData && (
                    <>
                        <Avatar
                            src={userData?.avatarUrl}
                            alt={userData.username}
                            className="profile-avatar"
                        />
                        <Typography variant="h5" className="profile-username">{userData.username}</Typography>
                        <div className="profile-divider" />
                        <div className="profile-info">
                            <Typography variant="body1"><strong>Email:</strong> {userData.email}</Typography>
                            <Typography variant="body1"><strong>First Name:</strong> {userData.firstName}</Typography>
                            <Typography variant="body1"><strong>Last Name:</strong> {userData.lastName}</Typography>
                            <Typography variant="body1"><strong>User Statistics:</strong> {userData.userStatistic}</Typography>
                            <Typography variant="body1"><strong>{friendCount}</strong> Friends</Typography>
                        </div>
                    </>
                )}
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
