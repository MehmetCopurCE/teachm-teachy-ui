import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, TextField, Button, Snackbar, Grid, Paper } from '@mui/material';
import orange from '@mui/material/colors/orange';
import teal from '@mui/material/colors/teal';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [friends, setFriends] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);
    

    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIDEiLCJpYXQiOjE3MTIxMzQ1MjYsImV4cCI6MTcxMjEzNjMyNn0.C2wjuKdH4KYNk2wVcS41E9UESOt_nq0wPY4wO31yDj4';

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
      
          
        const fetchPendingRequests = async () => {
            try {
                const response = await fetch(`http://localhost/api/users/1/friend-requests`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch pending friend requests');
                }

                const data = await response.json();
                setPendingRequests(data);
            } catch (error) {
                console.error('Failed to fetch pending friend requests:', error);
            }
        };

        fetchUserProfile();
        fetchPendingRequests();
    }, [token]);

    // Function to handle search
    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost/api/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data for search');
            }

            const data = await response.json();
            
            // Assuming your backend returns an array of users
            const searchResults = data.filter(user =>
                user.username.toLowerCase().includes(searchQuery.toLowerCase())
            );
            
            setSearchResults(searchResults);
        } catch (error) {
            console.error('Failed to fetch user data for search:', error);
        }
    };

    // Function to send friend request
    const handleSendFriendRequest = async (friendId) => {
        try {
            // when login is here. we are gonna use userId everywhere.
             {/*}   here we need to write the sender AND RECEİVER. yoksa succes mesajı gelmez  */} 
            const response = await fetch(`http://localhost/api/users/1/send-friend-request?friendId=8`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to send friend request');
            }

            setNotificationType('success');
            setNotificationMessage('Friend request sent successfully!');
            setNotificationOpen(true);
        } catch (error) {
            console.error('Failed to send friend request:', error);
            setNotificationType('error');
            setNotificationMessage('Failed to send friend request');
            setNotificationOpen(true);
        }
    }; 

    // Function to handle accepting friend request
    const handleAcceptFriendRequest = async (requestId) => {
        try {
            {/*}   here we need to write the sender AND RECEİVER. yoksa succes mesajı gelmez  */}
            const response = await fetch(`http://localhost/api/users/1/accept-friend-request?senderId=7`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to accept friend request');
            }

            // Assuming you want to update the list of pending requests after accepting the request
            const updatedRequests = pendingRequests.filter(request => request.id !== requestId);
            setPendingRequests(updatedRequests);

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

    // Function to handle rejecting friend request
    const handleRejectFriendRequest = async (requestId) => {
        try {
             {/*}   here we need to write the sender AND RECEİVER. yoksa succes mesajı gelmez  */}
            const response = await fetch(`http://localhost/api/users/1/reject-friend-request?senderId=7`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to reject friend request');
            }

            // Assuming you want to update the list of pending requests after rejecting the request
            const updatedRequests = pendingRequests.filter(request => request.id !== requestId);
            setPendingRequests(updatedRequests);

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

    // Function to handle closing of notification
    const handleCloseNotification = () => {
        setNotificationOpen(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Box sx={{
            padding: '20px',
          }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{
                        backgroundImage: 'linear-gradient(to right, #FFA500, #FF6347, #4682B4)', // Example gradient from orange to crimson
                        color: 'teal[900]', // Text color
                        padding: '20px',
                        borderRadius: '5px',
                        marginBottom: '20px' // Add margin-bottom
                      }}>
                        <Typography variant="h4" gutterBottom>User Information</Typography>
                        <Typography variant="body1" gutterBottom><strong>Name:</strong> {userData.username}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Email:</strong> {userData.email}</Typography>
                        <Typography variant="body1" gutterBottom><strong>First Name:</strong> {userData.firstName}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Last Name:</strong> {userData.lastName}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Question:</strong> {userData.question}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Answer:</strong> {userData.answer}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Role:</strong> {userData.role}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Account Type:</strong> {userData.accountType}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Registration Time:</strong> {new Date(userData.registrationTime).toLocaleString()}</Typography>
                        <Typography variant="body1" gutterBottom><strong>User Statistics:</strong> {userData.userStatistic}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{
                        backgroundImage: 'linear-gradient(to right, #FFA500, #FF6347, #4682B4)', // Example gradient from orange to crimson
                        color: 'teal[900]', // Text color
                        padding: '20px',
                        borderRadius: '5px',
                        marginBottom: '20px' // Add margin-bottom
                      }}>
                        {/* <Typography variant="h4" gutterBottom>Friends</Typography>
                        <List>
                            {friends.map((friend) => (
                                <ListItem key={friend.id}>
                                    <ListItemText primary={friend.username} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                    <Paper elevation={3} sx={{
                        backgroundImage: 'linear-gradient(to right, #FFA500, #FF6347, #4682B4)', // Example gradient from orange to crimson
                        color: 'teal[900]', // Text color
                        padding: '20px',
                        borderRadius: '5px',
                        marginBottom: '20px' // Add margin-bottom
                      }}> */}
                        <Typography variant="h4" gutterBottom>Pending Friend Requests</Typography>
                        <List>
                            {pendingRequests.map((request) => (
                                <ListItem key={request.id}>
                                    <ListItemText primary={request.senderId} />
                                    <Button variant="contained" onClick={() => handleAcceptFriendRequest(request.id)}>Accept</Button>
                                    <Button variant="contained" onClick={() => handleRejectFriendRequest(request.id)}>Reject</Button>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            {/* Search input */}
            <TextField
                label="Search"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Button to trigger search */}
            <Button variant="contained" onClick={handleSearch}>Search</Button>
            {/* Display search results */}
            <List>
                {searchResults.map((result) => (
                    <ListItem key={result.id}>
                        <ListItemText primary={result.username} />
                        <Button variant="contained" onClick={() => handleSendFriendRequest(result.id)}>Add Friend</Button>
                    </ListItem>
                ))}
            </List>

            {/* Notification Snackbar */}
            <Snackbar
                open={notificationOpen}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                message={notificationMessage}
                severity={notificationType} // Add this line to set severity (for MUI v5)
                sx={{ bottom: '20px' }}
            />
        </Box>
    );
};

export default Profile;
