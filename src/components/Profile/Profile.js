import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import orange from '@mui/material/colors/orange';
import teal from '@mui/material/colors/teal';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Remove the declaration of the 'setFriends' variable since it is not being used
    const [friends] = useState([]);

    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIDEiLCJpYXQiOjE3MTE5NzA0NjEsImV4cCI6MTcxMTk3MjI2MX0.hBNYhaRsce3TkHllkitLYGLVbfMZd0urYARtFyzGCbk';
// the users part will be something like $users when login is implemented
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`http://localhost/api/users/1`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUserData(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchUserProfile();
    
    }, [token]);

    /* const handleSendFriendRequest = async () => {
        try {
            const response = await fetch(`http://localhost/api/users/1/send-friend-request?friendId=2`, {
                method: 'POST', // or 'PUT', 'DELETE', etc.
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to send friend request');
                
            }

            // Assuming you want to update the list of friends after sending the request
        
            console.log('Friend request sent successfully!');
        } catch (error) {
            console.error('Failed to send friend request:', error);
        }
    }; */

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Box sx={{ backgroundColor: orange[500], color: teal[900], padding: '20px', borderRadius: '5px' }}>
            <Typography variant="h2" gutterBottom>Profile</Typography>
            <div>
                <Typography variant="body1">Name: {userData.username}</Typography>
                <Typography variant="body1">Email: {userData.email}</Typography>
                <Typography variant="body1">First Name: {userData.firstName}</Typography>
                <Typography variant="body1">Last Name: {userData.lastName}</Typography>
                <Typography variant="body1">User Statistics: Soon to be here!ಥ_ಥ</Typography>
                <Typography variant="body1">Friends:</Typography>
                <List>
                    {friends.map((friend) => (
                        <ListItem key={friend.id}>
                            <ListItemText primary={friend.username} />
                        </ListItem>
                    ))}
                </List>
            </div>
        </Box>
    );
};

export default Profile;
