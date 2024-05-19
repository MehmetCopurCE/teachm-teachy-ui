import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Button, Paper, Typography, Snackbar } from '@mui/material';

const PendingList = ({ setFriends }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [notificationOpen, setNotificationOpen] = useState(false);

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
                        'Content-Type': 'application/json'
                    },
                });

                if (!pendingRequestsResponse.ok) {
                    throw new Error('Failed to fetch pending friend requests');
                }

                const pendingRequestsData = await pendingRequestsResponse.json();
                const requestsWithUsernames = await Promise.all(pendingRequestsData.map(async (request) => {
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
                        username: senderProfile.userName,
                        age: calculateRelativeTime(request.createdAt)
                    };
                }));
                setPendingRequests(requestsWithUsernames);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const calculateRelativeTime = (createdAt) => {
        const currentDate = new Date();
        const requestDate = new Date(createdAt);
        const timeDifference = currentDate - requestDate;
        const seconds = Math.floor(timeDifference / 1000);
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
            return `${seconds}s ago`;
        }
    };

    const handleAcceptFriendRequest = async (senderId) => {
        try {
            console.log("Accepting friend request from friendId:", senderId);
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('tokenKey');
            console.log("Authorization token:", token);

            const response = await fetch(`http://localhost/api/users/${userId}/accept-friend-request?senderId=${senderId}`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
            });
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error('Failed to accept friend request');
            }

            setPendingRequests(prevRequests => prevRequests.filter(request => request.senderId !== senderId));

           

            setNotificationType('success');
            setNotificationMessage('Friend request accepted successfully!');
            setNotificationOpen(true);
        } catch (error) {
            console.error('Failed to accept friend request:', error);
            setNotificationType('error');
            setNotificationMessage('Failed to accept friend request');
            setNotificationOpen(true);
        }
    };

    const handleRejectFriendRequest = async (senderId) => {
        try {
            console.log("Rejecting friend request from friendId:", senderId);
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('tokenKey');
            console.log("Authorization token:", token);

            const response = await fetch(`http://localhost/api/users/${userId}/reject-friend-request?senderId=${senderId}`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
            });
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error('Failed to reject friend request');
            }

            setPendingRequests(prevRequests => prevRequests.filter(request => request.senderId !== senderId));

            setNotificationType('success');
            setNotificationMessage('Friend request rejected successfully!');
            setNotificationOpen(true);
        } catch (error) {
            console.error('Failed to reject friend request:', error);
            setNotificationType('error');
            setNotificationMessage('Failed to reject friend request');
            setNotificationOpen(true);
        }
    };

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
            <Typography variant="h4" gutterBottom>Pending Friend Requests</Typography>
            <List>
                {Array.isArray(pendingRequests) && pendingRequests.map((request) => (
                    <ListItem key={request.senderId}>
                        <ListItemText primary={request.senderName} secondary={`Requested ${request.age}`} />
                        <Button variant="contained" onClick={() => handleAcceptFriendRequest(request.senderId)}>Accept</Button>
                        <Button variant="contained" color="secondary" onClick={() => handleRejectFriendRequest(request.senderId)}>Reject</Button>
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
