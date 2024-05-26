import React, { useState } from 'react';

const AcceptRequest = ({ senderId,setNotificationType, setNotificationMessage, setNotificationOpen }) => {
    
    const handleAccept = async () => {
        try {
            console.log("Accepting friend request from friendId:", senderId);  
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('tokenKey');
            console.log("Authorization token:", token);

            const response = await fetch(`http://localhost/api/users/${userId}/accept-friend-request?senderId=${senderId}`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json' // Add Content-Type header if necessary
                },
            });
            const responseData = await response.json(); // Parse response JSON

            if (!response.ok) {
                throw new Error('Failed to accept friend request');
            }

            // Handle success notification
            setNotificationType('success');
            setNotificationMessage('Friend request accepted successfully!');
            setNotificationOpen(true);
        } catch (error) {
            console.error('Failed to accept friend request:', error);
            // Handle error notification
            setNotificationType('error');
            setNotificationMessage('Failed to accept friend request');
            setNotificationOpen(true);
        }
    };

    return (
        <button onClick={handleAccept}>Accept</button>
    );
};

export default AcceptRequest;
