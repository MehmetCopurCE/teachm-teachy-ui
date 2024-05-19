import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ProfileCard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('tokenKey');
                const userId = localStorage.getItem('userId');
                setUserId(userId);
              
                // Fetch user ProfileCard
                const userProfileCardResponse = await fetch(`http://localhost/api/users/${userId}`, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                });

                if (!userProfileCardResponse.ok) {
                    throw new Error('Failed to fetch user information');
                }

                // Get user data
                const userData = await userProfileCardResponse.json();
                setUserId(userData);
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Added dependency array to run effect only once after mount

    return (
        <Box sx={{ padding: '20px' }}>
            {/* User Information */}
            <Paper elevation={3} sx={{
                background: 'linear-gradient(to right, rgba(192, 192, 192, 0.3), rgba(70, 130, 180, 0.3))',
                color: '#000',
                padding: '20px',
                borderRadius: '5px',
                marginBottom: '20px'
            }}>
                <Typography variant="h4" gutterBottom>User Information</Typography>
                {/* Check if user data is available before rendering */}
                {userId && (
                    <>
                        <Typography variant="body1" gutterBottom><strong>Name:</strong> {userId.username}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Email:</strong> {userId.email}</Typography>
                        <Typography variant="body1" gutterBottom><strong>First Name:</strong> {userId.firstName}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Last Name:</strong> {userId.lastName}</Typography>
                        <Typography variant="body1" gutterBottom><strong>User Statistics:</strong> {userId.userStatistic}</Typography>
                    </>
                )}
                {/* Display error if there is any */}
                {error && (
                    <Typography variant="body1" gutterBottom color="error">{error}</Typography>
                )}
            </Paper>
        </Box>
    );
};

export default ProfileCard;
