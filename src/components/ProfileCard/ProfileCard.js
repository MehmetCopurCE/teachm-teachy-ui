import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import './ProfileCard.css'; // Import the CSS file

const ProfileCard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('tokenKey');
                const userId = localStorage.getItem('userId');
              
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

                // Get user data
                const userData = await userProfileResponse.json();
                setUserData(userData);
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Added dependency array to run effect only once after mount

    return (
        <Box className="profile-container">
            <Paper className="profile-card" elevation={3}>
                {loading && <div>Loading...</div>}
                {error && <div>Error: {error}</div>}
                {userData && (
                    <>
                        <Avatar
                            src={`https://icons.iconarchive.com/icons/aha-soft/free-large-boss/256/Devil-icon.png`}
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
                        </div>
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default ProfileCard;
