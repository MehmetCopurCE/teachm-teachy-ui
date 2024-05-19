import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Snackbar } from '@mui/material';


const FriendsList = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [friends, setFriends] = useState([]);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [notificationOpen, setNotificationOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('tokenKey');
                const userId = localStorage.getItem('userId');

                if (!userId || !token) {
                    throw new Error('User ID or Token is missing');
                }

                const response = await fetch(`http://localhost/api/users/${userId}/friends`, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch friend list');
                }

                const friendsData = await response.json();
                const filteredFriends = friendsData.filter(friend => friend.friendId !== parseInt(userId));
                setFriends(filteredFriends);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching friend list:', error.message);
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Paper elevation={3} sx={{
            background: 'linear-gradient(to right, rgba(192, 192, 192, 0.3), rgba(70, 130, 180, 0.3))',
            color: '#000',
            padding: '20px',
            borderRadius: '5px',
            marginBottom: '20px'
        }}>
            <Typography variant="h4" gutterBottom>Friends</Typography>
            <List>
                {friends.map((friend) => (
                    <ListItem key={friend.friendId}>
                        <ListItemText primary={friend.friendUsername} />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default FriendsList;
