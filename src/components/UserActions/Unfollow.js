import React from 'react';
import { Button } from '@mui/material';

const UnfollowFriend = ({ friendId, removeFriendFromList, setNotificationType, setNotificationMessage, setNotificationOpen }) => {
    const handleUnfollow = async () => {
        try {
            console.log("Unfollowing friend with friendId:", friendId);
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('tokenKey');
            console.log("Authorization token:", token);

            const response = await fetch(`http://localhost/api/users/${userId}/unfollowFriend?friendId=${friendId}`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Failed to unfollow friend');
            }

            await response.json();

            // Call the function to remove the friend from the list
            removeFriendFromList(friendId);

            setNotificationType('success');
            setNotificationMessage('Unfollowed friend successfully!');
            setNotificationOpen(true);
        } catch (error) {
            console.error('Failed to unfollow friend:', error);
            setNotificationType('error');
            setNotificationMessage('Failed to unfollow friend');
            setNotificationOpen(true);
        }
    };

    return (
        <Button variant="contained" color="secondary" onClick={handleUnfollow}>Unfollow</Button>
    );
};

export default UnfollowFriend;
