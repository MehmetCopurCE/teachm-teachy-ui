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

    const token = localStorage.getItem('tokenKey');
    const userId = localStorage.getItem('userId'); // Assuming the server provides the userId upon login
    console.log('Token:', token);
    console.log('UserId:', userId);

    useEffect(() => {
        console.log("useEffect called");
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`http://localhost/api/users/${userId}`, {
                    headers: {
                        'Authorization': localStorage.getItem('tokenKey'),
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
                console.log('Token:', token);
            }
        };
      
        const fetchFriendsList = async () => {
            try {
                const response = await fetch(`http://localhost/api/users/${userId}/friends`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('tokenKey'),
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch friend list');
                
                }

                const data = await response.json();
                setFriends(data);
            } catch (error) {
                console.error('Error fetching friend list:', error);
            }
        };
          
        const fetchPendingRequests = async () => {
            try {
                const response = await fetch(`http://localhost/api/users/${userId}/friend-requests`, {
                    headers: {
                        'Authorization': localStorage.getItem('tokenKey'),
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch pending friend requests');
                }

                const data = await response.json();
                setPendingRequests(data);
                console.log(data);
            } catch (error) {
                console.error('Failed to fetch pending friend requests:', error);
            }
        };

        fetchUserProfile();
        fetchFriendsList();
        fetchPendingRequests();
    }, [token, userId]);

    // Function to handle search
    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost/api/users`, {
                headers: {
                    'Authorization': localStorage.getItem('tokenKey'),
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

    const handleSendFriendRequest = async (userId) => {
        try {
            const response = await fetch(`http://localhost/api/users/${userId}/send-friend-request`, {
                method: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('tokenKey'),
                },
            });
    
            if (response.ok) {
                setNotificationType('success');
                setNotificationMessage('Friend request sent successfully!');
                setNotificationOpen(true);
            } else {
                throw new Error('Failed to send friend request');
            }
        } catch (error) {
            console.error('Failed to send friend request:', error);
            setNotificationType('error');
            setNotificationMessage('Failed to send friend request');
            setNotificationOpen(true);
        }
    };
    
    
    const handleAcceptFriendRequest = async (userId, senderId) => {
        try {
            await fetch(`http://localhost/api/users/${userId}/accept-friend-request?senderId=${senderId}`, {
                method: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('tokenKey'),
                },
            });
    
          
            const updatedRequestsResponse = await fetch(`http://localhost/api/users/${userId}/friend-requests`, {
                headers: {
                    'Authorization':localStorage.getItem('tokenKey'),
                },
            });
            const updatedRequestsData = await updatedRequestsResponse.json();
    
            // Update the state with the updated list of pending requests
            setPendingRequests(updatedRequestsData);
    
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
            await fetch(`http://localhost/api/users/${userId}/reject-friend-request?senderId=${senderId}`, {
                method: 'POST',
                headers: {
                    'Authorization':localStorage.getItem('tokenKey'),
                },
            });
    
            // Fetch the updated list of pending requests
            const updatedRequestsResponse = await fetch(`http://localhost/api/users/${userId}/friend-requests`, {
                headers: {
                    'Authorization':localStorage.getItem('tokenKey'),
                },
            });
            const updatedRequestsData = await updatedRequestsResponse.json();
    
            // Update the state with the updated list of pending requests
            setPendingRequests(updatedRequestsData);
    
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
                        <Typography variant="h4" gutterBottom>Pending Friend Requests</Typography>
                        <List>
  {Array.isArray(pendingRequests) && pendingRequests.map((request) => (
    <ListItem key={request.senderId}>
      <ListItemText primary={request.senderId} />
      <Button variant="contained" onClick={() => handleAcceptFriendRequest(userId, request.senderId)}>Accept</Button>
      <Button variant="contained" onClick={() => handleRejectFriendRequest(userId, request.senderId)}>Reject</Button>
    </ListItem>
  ))}
</List>

                    </Paper>
                </Grid>
            </Grid>

            <Paper elevation={3} sx={{
                backgroundImage: 'linear-gradient(to right, #FFA500, #FF6347, #4682B4)', // Example gradient from orange to crimson
                color: 'teal[900]', // Text color
                padding: '20px',
                borderRadius: '5px',
                marginBottom: '20px' // Add margin-bottom
              }}>
                <Typography variant="h4" gutterBottom>Friends</Typography>
                <List>
                    {friends.map((friend) => (
                        <ListItem key={friend.friendId}>
                            <ListItemText primary={friend.friendUsername} />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* Search input */}
            <TextField
                label="Search"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                    // Trigger search function as the user types
                    handleSearch();
                }}
            />
            {/* Other JSX code */}
            <List>
                {searchResults.map((result) => (
                    <ListItem key={result.id}>
                        <ListItemText primary={result.username} />
                        <Button variant="contained" onClick={() => handleSendFriendRequest(result.id)}>Add Friend</Button>
                    </ListItem>
                ))}
            </List>
            {/* Other JSX code */}
        </Box>
    );
};

export default Profile;