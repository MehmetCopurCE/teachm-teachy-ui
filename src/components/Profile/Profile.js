import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, TextField, Button, Grid, Paper, Snackbar } from '@mui/material';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [friends, setFriends] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('tokenKey');
        const userId = localStorage.getItem('userId');

        setUserId(userId);
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`http://localhost/api/users/${userId}`, {
                    headers: {
                        'Authorization': localStorage.getItem('tokenKey'),
                        'Content-Type': 'application/json' 
                    },
                });
        
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
        
                const userData = await response.json(); // Rename data to userData
                setUserId(userData); // Set userId with userData, not the response
                setLoading(false);
                
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        
        const fetchFriendsList = async () => {
            try {
                const response = await fetch(`http://localhost/api/users/${userId}/friends`, {
                    headers: {
                        'Authorization': localStorage.getItem('tokenKey'),
                        'Content-Type': 'application/json'
                    },
                });
        
                if (!response.ok) {
                    throw new Error('Failed to fetch friend list');
                }
        
                const data = await response.json();
                // you can't be friends with yourself, apparently. 
                const filteredFriends = data.filter(friend => friend.friendId !== parseInt(userId));
                setFriends(filteredFriends);
            } catch (error) {
                console.error('Error fetching friend list:', error);
            }
        };
        
        const fetchPendingRequests = async () => {
            try {
                const response = await fetch(`http://localhost/api/users/${userId}/friend-requests`, {
                    headers: {
                        'Authorization': localStorage.getItem('tokenKey'),
                        'Content-Type': 'application/json' 
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
        fetchFriendsList();
        fetchPendingRequests();
    }, [userId]);

    // Sending friend request to user that is searched by logged user
    const handleSendFriendRequest = async (friendId) => {
        try {
            console.log("Sending friend request to friendId:", friendId);
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('tokenKey');
            console.log("Authorization token:", token);
    
            const response = await fetch(`http://localhost/api/users/${userId}/send-friend-request?friendId=${friendId}`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json' // Add Content-Type header if necessary
                },
            });
    
            const responseData = await response.json(); // Parse response JSON
    
            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to send friend request');
            }
    
            setNotificationType('success');
            setNotificationMessage('Friend request sent successfully!');
           
            setNotificationOpen(true);
        } catch (error) {
            console.error('Failed to send friend request:', error.message);
            setNotificationType('error');
            setNotificationMessage(error.message || 'Failed to send friend request');
            setNotificationOpen(true);
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
                    'Content-Type': 'application/json' // Add Content-Type header if necessary
                },
            });
            const responseData = await response.json(); // Parse response JSON

            if (!response.ok) {
                throw new Error('Failed to accept friend request');
            }
    
            // Remove the accepted friend request from the pending list
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
                    'Content-Type': 'application/json' // Add Content-Type header if necessary
                },
            });
            const responseData = await response.json(); // Parse response JSON
            
            if (!response.ok) {
                throw new Error('Failed to reject friend request');
            }
    
            // Remove the accepted friend request from the pending list
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

            const searchResults = data.filter(user =>
                user.username.toLowerCase().includes(searchQuery.toLowerCase())
            );

            setSearchResults(searchResults);
        } catch (error) {
            console.error('Failed to fetch user data for search:', error);
        }
    };

    return (
        <Box sx={{ padding: '20px' }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ background: 'linear-gradient(to right, #FFA500, #FF6347, #4682B4)', color: '#FFF', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
                        <Typography variant="h4" gutterBottom>User Information</Typography>
                        <Typography variant="body1" gutterBottom><strong>Name:</strong> {userId?.username}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Email:</strong> {userId?.email}</Typography>
                        <Typography variant="body1" gutterBottom><strong>First Name:</strong> {userId?.firstName}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Last Name:</strong> {userId?.lastName}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Security Question:</strong> {userId?.question}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Answer:</strong> {userId?.answer}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Role:</strong> {userId?.role}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Account Type:</strong> {userId?.accountType}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Registration Time:</strong> {new Date(userId?.registrationTime).toLocaleString()}</Typography>
                        <Typography variant="body1" gutterBottom><strong>User Statistics:</strong> {userId?.userStatistic}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ background: 'linear-gradient(to right, #FFA500, #FF6347, #4682B4)', color: '#FFF', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
                        <Typography variant="h4" gutterBottom>Pending Friend Requests</Typography>
                        <List>
                            {Array.isArray(pendingRequests) && pendingRequests.map((request) => (
                                <ListItem key={request.senderId}>
                                    <ListItemText primary={request.senderId} />
                                    <Button variant="contained" onClick={() => handleAcceptFriendRequest(request.senderId)}>Accept</Button>
                                    <Button variant="contained" onClick={() => handleRejectFriendRequest(request.senderId)}>Reject</Button>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            <Paper elevation={3} sx={{ background: 'linear-gradient(to right, #FFA500, #FF6347, #4682B4)', color: '#FFF', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
                <Typography variant="h4" gutterBottom>Friends</Typography>
                <List>
                    {friends.map((friend) => (
                        <ListItem key={friend.friendId}>
                            <ListItemText primary={friend.friendUsername} />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <TextField
                label="Search"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch();
                }}
            />
 <Button variant="contained" onClick={handleSearch}>Search</Button>
            <List>
                {searchResults.map((result) => (
                    <ListItem key={result.id}>
                        <ListItemText primary={result.username} />
                        <Button variant="contained" onClick={() => handleSendFriendRequest(result.id)}>Send Friend Request</Button>
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