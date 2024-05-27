import React, { useState, useEffect } from 'react';
import { Paper, Snackbar, Button, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './RejectedList.css'; // Import the CSS file

const RejectedList = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rejectedList, setRejectedList] = useState([]);
    const [notificationType, setNotificationType] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationOpen, setNotificationOpen] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

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

                // Fetch user details for each request to get avatar URL
                const rejectedDetailsPromises = data.map(request =>
                    fetch(`http://localhost/api/users/${request.senderId}`, {
                        headers: {
                            'Authorization': token,
                            'Content-Type': 'application/json'
                        },
                    })
                        .then(response => response.json())
                        .then(senderProfile => ({
                            ...request,
                            senderName: senderProfile.username,
                            avatarUrl: senderProfile.avatarUrl,
                        }))
                );

                const rejectedDetails = await Promise.all(rejectedDetailsPromises);
                setRejectedList(rejectedDetails);
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

    const resendRequest = async (friendId) => {
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('tokenKey');

            const response = await fetch(`http://localhost/api/users/${userId}/send-friend-request?friendId=${friendId}`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to resend friend request');
            }

            console.log('Friend request resent successfully!');
            setNotificationType('success');
            setNotificationMessage('Friend request resent successfully!');
            setNotificationOpen(true);

            // Update rejectedList to mark the request as resent
            setRejectedList(prevList =>
                prevList.map(request =>
                    request.senderId === friendId ? { ...request, isRequestSent: true } : request
                )
            );
        } catch (error) {
            console.error('Failed to resend friend request:', error);
            setNotificationType('error');
            setNotificationMessage(error.message || 'Failed to resend friend request');
            setNotificationOpen(true);
        }
    };

    const handleCloseNotification = () => {
        setNotificationOpen(false);
    };

    const handleAvatarClick = (senderId) => {
        navigate(`/profile/${senderId}`); // Navigate to the user profile page
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Paper className="rejected-list" elevation={3}>
            
            <ul className="rejected-list-items">
                {rejectedList.map((request) => (
                    <li key={request.senderId} className="rejected-list-item">
                        <div className="rejected-card">
                            <Avatar
                                src={request.avatarUrl}
                                alt={request.senderName}
                                className="profile-photo-lg"
                                onClick={() => handleAvatarClick(request.senderId)}
                                style={{ cursor: 'pointer' }}
                            />
                            <div className="card-info">
                                <h4 className="text-red">{request.senderName}</h4>
                                <p className="time-ago">{calculateTimeAgo(request.createdAt)}</p>
                            </div>
                            {request.isRequestSent ? (
                                <span className="follow-request-sent">Follow Request Sent ⏱</span>
                            ) : (
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    className="resend-button" 
                                    onClick={() => resendRequest(request.senderId)}>
                                    Oops! Resend Request
                                </Button>
                            )}
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
