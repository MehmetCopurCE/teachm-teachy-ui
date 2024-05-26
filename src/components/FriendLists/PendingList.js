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

                const simplifiedRequests = pendingRequestsData.map(request => ({
                    senderId: request.senderId,
                    senderName: request.senderName,
                    createdAt: request.createdAt,
                }));

                setPendingRequests(simplifiedRequests);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
            <Typography className="pending-title" variant="h4" gutterBottom>Pending Friend Requests</Typography>
            <List className="pending-list-items">
                {Array.isArray(pendingRequests) && pendingRequests.map((request) => (
                    <ListItem key={request.senderId} className="pending-list-item">
                        <div className="pending-card">
                            <Avatar
                                src={`https://icons.iconarchive.com/icons/aha-soft/free-large-boss/256/Devil-icon.png`}
                                alt={request.senderName}
                                className="profile-photo-lg"
                                onClick={() => handleAvatarClick(request.senderId)}
                                style={{ cursor: 'pointer' }}
                            />
                            <div className="card-info">
                                <Typography className="text-info" variant="h6">{request.senderName}</Typography>
                                <Typography className="time-ago">{request.createdAt}</Typography>
                            </div>
                            <Button variant="contained" className="accept-button" onClick={() => handleAcceptFriendRequest(request.senderId)}>Accept</Button>
                            <Button variant="contained" color="secondary" className="reject-button" onClick={() => handleRejectFriendRequest(request.senderId)}>Reject</Button>
                        </div>
                    </ListItem>
                ))}
            </List>
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