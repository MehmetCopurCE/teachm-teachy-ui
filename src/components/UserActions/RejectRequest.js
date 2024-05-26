import React from 'react';
import { Button } from '@mui/material';

const RejectFriendRequest = ({ senderId, setPendingRequests, setNotificationType, setNotificationMessage, setNotificationOpen }) => {
    const handleReject = async () => {
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

            if (!response.ok) {
                throw new Error('Failed to reject friend request');
            }

            const responseData = await response.json();

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

    return (
        <Button variant="contained" color="secondary" onClick={handleReject}>Reject</Button>
    );
};

export default RejectFriendRequest;
