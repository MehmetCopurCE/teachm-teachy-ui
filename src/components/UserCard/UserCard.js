import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import { useParams } from 'react-router-dom';
import './UserCard.css'; // Import the CSS file

const UserCard = () => {
    const { userId } = useParams(); // Get userId from URL parameters
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('tokenKey');

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
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]); // Run effect whenever userId changes

    return (
        <Box className="profile-container">
            <Paper className="profile-card" elevation={3}>
                {loading && <div>Loading...</div>}
                {error && <div>Error: {error}</div>}
                {userData && (
                    <>
                        <Avatar
                           src={userData?.avatarUrl}// userdatadan url geliyor sadece
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

export default UserCard;
