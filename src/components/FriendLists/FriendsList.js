// src/components/FriendsList/FriendsList.js

import React, { useState, useEffect } from 'react';
import { Paper, Snackbar } from '@mui/material';
import './FriendsList.css'; // Import the CSS file

const FriendsList = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [friends, setFriends] = useState([]);
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
        <Paper className="friends-list" elevation={3}>
            <h2 className="friends-title">Friends</h2> {/* Updated title */}
            <ul className="friend-list">
                {friends.map((friend) => (
                    <li key={friend.friendId}>
                        <div className="friend-card">
                            <img 
                                src={`https://icons.iconarchive.com/icons/aha-soft/free-large-boss/256/Devil-icon.png`} 
                                alt={friend.friendUsername} 
                                className="profile-photo-lg"
                            />
                            <div className="card-info">
                                <h4 className="text-green">{friend.friendUsername}</h4>
                                <p>Some info about the friend</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <Snackbar
                open={notificationOpen}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                message={notificationMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Paper>
    );
};

export default FriendsList;
