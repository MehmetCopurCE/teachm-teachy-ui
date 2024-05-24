import React, { useState, useEffect } from 'react';
import { Paper, Snackbar, Button } from '@mui/material';
import './RejectedList.css'; // Import the CSS file

const RejectedList = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rejectedList, setRejectedList] = useState([]);
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

                const response = await fetch(`http://localhost/api/users/${userId}/rejected-requests`, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch rejected list');
                }

                const data = await response.json();

                const rejectedListWithUsernames = await Promise.all(data.map(async (request) => {
                    const senderProfileResponse = await fetch(`http://localhost/api/users/${request.senderId}`, {
                        headers: {
                            'Authorization': token,
                            'Content-Type': 'application/json'
                        },
                    });

                    if (!senderProfileResponse.ok) {
                        throw new Error(`Failed to fetch profile for sender ID ${request.senderId}`);
                    }

                    const senderProfile = await senderProfileResponse.json();
                    return {
                        ...request,
                        senderName: senderProfile.username,
                    };
                }));

                setRejectedList(rejectedListWithUsernames);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching rejected list:', error.message);
                setError(error.message);
                setNotificationMessage(error.message);
                setNotificationOpen(true);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const calculateTimeAgo = (timestamp) => {
        const now = new Date();
        const date = new Date(timestamp);
        const elapsed = now - date;

        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);

        if (weeks > 0) {
            return `${weeks}w ago`;
        } else if (days > 0) {
            return `${days}d ago`;
        } else if (hours > 0) {
            return `${hours}h ago`;
        } else if (minutes > 0) {
            return `${minutes}m ago`;
        } else {
            return 'Just now';
        }
    };

    const resendRequest = async (senderId) => {
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('tokenKey');

            const response = await fetch(`http://localhost/api/users/${userId}/resend-request`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ senderId })
            });

            if (!response.ok) {
                throw new Error('Failed to resend friend request');
            }

            setNotificationMessage('Friend request resent! 🎉');
            setNotificationOpen(true);
        } catch (error) {
            console.error('Error resending friend request:', error);
            setNotificationMessage('Failed to resend friend request');
            setNotificationOpen(true);
        }
    };

    const handleCloseNotification = () => {
        setNotificationOpen(false);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Paper className="rejected-list" elevation={3}>
            <h2 className="rejected-title">Rejected Friend Requests</h2>
            <ul className="rejected-list-items">
                {rejectedList.map((request) => (
                    <li key={request.senderId} className="rejected-list-item">
                        <div className="rejected-card">
                            <img 
                                src={`https://icons.iconarchive.com/icons/aha-soft/free-large-boss/256/Devil-icon.png`} 
                                alt={request.senderName} 
                                className="profile-photo-lg"
                            />
                            <div className="card-info">
                                <h4 className="text-red">{request.senderName}</h4>
                                <p className="time-ago">{calculateTimeAgo(request.createdAt)}</p>
                            </div>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                className="resend-button" 
                                onClick={() => resendRequest(request.senderId)}>
                                Oops! Resend Request
                            </Button>
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

export default RejectedList;