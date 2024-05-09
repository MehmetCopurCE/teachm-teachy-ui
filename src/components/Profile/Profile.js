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
    const [rejectedRequests, setRejectedRequests] = useState([]);
    const [rejectedList, setRejectedList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('tokenKey');
                const userId = localStorage.getItem('userId');
                setUserId(userId);
    
                // Fetch user profile
                const userProfileResponse = await fetch(`http://localhost/api/users/${userId}`, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                });
    
                if (!userProfileResponse.ok) {
                    throw new Error('Failed to fetch user data');
                }
    
                const userData = await userProfileResponse.json();
                setUserId(userData);
                setLoading(false);
    
                // Fetch friends list
                const friendsListResponse = await fetch(`http://localhost/api/users/${userId}/friends`, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                });
    
                if (!friendsListResponse.ok) {
                    throw new Error('Failed to fetch friend list');
                }
    
                const friendsData = await friendsListResponse.json();
                const filteredFriends = friendsData.filter(friend => friend.friendId !== parseInt(userId));
                setFriends(filteredFriends);
    
                // Fetch pending friend requests
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
                const requestsWithAge = pendingRequestsData.map(request => ({
                    ...request,
                    age: calculateAge(request.createdAt)
                }));
                setPendingRequests(requestsWithAge);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
                setLoading(false);
            }
        };
    
        fetchData();
    }, [userId]);

    const fetchRejectedList = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('tokenKey');
            
            const response = await fetch(`http://localhost/api/users/${userId}/rejected-requests`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch rejected list');
            }
            
            const data = await response.json();
            
            // Assuming the response data is an array of objects representing rejected friend requests
            setRejectedList(data);
        } catch (error) {
            console.error('Error fetching rejected list:', error.message);
            // Handle error if needed
        }
    };
    
    // Call the function to fetch rejected list
    fetchRejectedList();
    
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
    
            // Remove the rejected friend request from the pending list
            setPendingRequests(prevRequests => prevRequests.filter(request => request.senderId !== senderId));
    
            // Add the rejected friend request to the rejected list (if needed)
            // Modify this part based on how you want to handle rejected requests
            setRejectedRequests(prevRejected => [
                ...prevRejected,
                { senderId, timestamp: responseData.timestamp } // Assuming responseData includes timestamp
            ]);
    
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
    
    const calculateAge = (createdAt) => {
        const requestDate = new Date(createdAt); // Convert createdAt timestamp to Date object
        const currentDate = new Date(); // Get the current date
        const timeDifference = currentDate - requestDate; // Calculate the time difference in milliseconds
    
        // Convert milliseconds to seconds, minutes, hours, and days
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
    
        // Determine the appropriate time unit to display
        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
            return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
        }
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
      {/* Rejected List */}
      <Paper elevation={3} sx={{
                background: 'linear-gradient(to right, rgba(192, 192, 192, 0.3), rgba(70, 130, 180, 0.3))',
                color: '#000',
                padding: '20px',
                borderRadius: '5px',
                marginBottom: '20px'
            }}>
                <Typography variant="h4" gutterBottom>Rejected Friend Requests</Typography>
                <List>
                    {rejectedList.map((request) => (
                        <ListItem key={request.senderId}>
                            <ListItemText primary={request.senderId} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        {/* User Information */}
        <Paper elevation={3} sx={{
            background: 'linear-gradient(to right, rgba(192, 192, 192, 0.3), rgba(70, 130, 180, 0.3))',
            color: '#000',
            padding: '20px',
            borderRadius: '5px',
            marginBottom: '20px'
        }}>
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

        {/* Pending Friend Requests */}
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
                        <ListItemText primary={request.senderId} />
                        <Button variant="contained" onClick={() => handleAcceptFriendRequest(request.senderId)}>Accept</Button>
                        <Button variant="contained" onClick={() => handleRejectFriendRequest(request.senderId)}>Reject</Button>
                    </ListItem>
                ))}
            </List>
        </Paper>
 {/* Rejected Friend Requests */}
 <Paper elevation={3} sx={{
                background: 'linear-gradient(to right, rgba(192, 192, 192, 0.3), rgba(70, 130, 180, 0.3))',
                color: '#000',
                padding: '20px',
                borderRadius: '5px',
                marginBottom: '20px'
            }}>
                <Typography variant="h4" gutterBottom>Rejected Friend Requests</Typography>
                <List>
                    {rejectedRequests.map((request) => (
                        <ListItem key={request.senderId}>
                            {/* Render rejected friend request information */}
                        </ListItem>
                    ))}
                </List>
            </Paper>
        {/* Friends */}
        <Paper elevation={3} sx={{
            background: 'linear-gradient(to right, rgba(192, 192, 192, 0.3), rgba(70, 130, 180, 0.3))',
            color: '#000',
            padding: '20px',
            borderRadius: '5px',
            marginBottom: '20px'
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

        {/* Search */}
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