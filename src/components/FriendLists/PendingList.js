import React, { useState, useEffect } from 'react';
import { List, ListItem, Typography, Button, Paper, Snackbar, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './PendingList.css';

const PendingList = ({ setFriends }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationOpen, setNotificationOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const token = localStorage.getItem('tokenKey');

                if (!userId || !token) {
                    throw new Error('User ID or Token is missing');
                }

                const pendingRequestsResponse = await fetch(`http://localhost/api/users/${userId}/friend-requests`, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                });

                if (!pendingRequestsResponse.ok) {
                    throw new Error('Failed to fetch pending friend requests');
                }

                const pendingRequestsData = await pendingRequestsResponse.json();

                const pendingDetailsPromises = pendingRequestsData.map(request =>
                    fetch(`http://localhost/api/users/${request.senderId}`, {
                        headers: {
                            'Authorization': token,
                            'Content-Type': 'application/json'
                        },
                    })
                        .then(response => response.json())
                        .then(data => ({
                            ...request,
                            avatarUrl: data.avatarUrl,
                            timeElapsed: getTimeElapsed(request.createdAt) // Calculate time elapsed
                        }))
                );

                const pendingDetails = await Promise.all(pendingDetailsPromises);
                setPendingRequests(pendingDetails);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getTimeElapsed = (createdAt) => {
        const currentTime = new Date();
        const createdTime = new Date(createdAt);
        const timeDiff = Math.abs(currentTime - createdTime);
        const minutes = Math.floor(timeDiff / (1000 * 60));
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        if (days > 0) {
            return `${days}d ago`;
        } else if (hours > 0) {
            return `${hours}h ago`;
        } else {
            return `${minutes}m ago`;
        }
    };

    const handleAcceptFriendRequest = async (senderId) => {
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('tokenKey');

            const response = await fetch(`http://localhost/api/users/${userId}/accept-friend-request?senderId=${senderId}`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to accept friend request');
            }

            setPendingRequests(prevRequests => prevRequests.filter(request => request.senderId !== senderId));

            setNotificationMessage('Friend request accepted successfully!');
            setNotificationOpen(true);
        } catch (error) {
            console.error('Failed to accept friend request:', error);
            setNotificationMessage('Failed to accept friend request');
            setNotificationOpen(true);
        }
    };

    const handleRejectFriendRequest = async (senderId) => {
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('tokenKey');

            const response = await fetch(`http://localhost/api/users/${userId}/reject-friend-request?senderId=${senderId}`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to reject friend request');
            }

            setPendingRequests(prevRequests => prevRequests.filter(request => request.senderId !== senderId));

            setNotificationMessage('Friend request rejected successfully!');
            setNotificationOpen(true);
        } catch (error) {
            console.error('Failed to reject friend request:', error);
            setNotificationMessage('Failed to reject friend request');
            setNotificationOpen(true);
        }
    };

    const handleCloseNotification = () => {
        setNotificationOpen(false);
    };

    const handleAvatarClick = (senderId) => {
        navigate(`/profile/${senderId}`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Paper className="pending-list">
            {pendingRequests.length === 0 ? (
                <Typography variant="h6" align="center" color="textSecondary" style={{ padding: '20px' }}>
                    You have no follow requests yet...
                </Typography>
            ) : (
                <List className="pending-list-items">
                    {pendingRequests.map((request) => (
                        <ListItem key={request.senderId} className="pending-list-item">
                            <div className="pending-card">
                                <Avatar
                                    src={request.avatarUrl}
                                    alt={request.senderName}
                                    className="profile-photo-lg"
                                    onClick={() => handleAvatarClick(request.senderId)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <div className="card-info">
                                    <Typography className="text-info" variant="h6">{request.senderName}</Typography>
                                    <Typography className="time-ago">{request.timeElapsed}</Typography> {/* Display time elapsed */}
                                </div>
                                <Button variant="contained" className="accept-button" onClick={() => handleAcceptFriendRequest(request.senderId)}>Accept</Button>
                                <Button variant="contained" color="secondary" className="reject-button" onClick={() => handleRejectFriendRequest(request.senderId)}>Reject</Button>
                            </div>
                        </ListItem>
                    ))}
                </List>
            )}
            <Snackbar
                open={notificationOpen}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                message={notificationMessage}
                sx={{ bottom: '20px' }}
            />
        </Paper>
    );
};

export default PendingList;
