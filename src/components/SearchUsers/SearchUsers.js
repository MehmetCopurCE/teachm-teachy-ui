import React, { useState, useEffect } from 'react';
import { Box, Paper, TextField, Button, List, ListItem, ListItemText, Snackbar, Alert } from '@mui/material';
import SendFriendRequest from '../UserActions/SendRequest';

const SearchUsers = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [notificationOpen, setNotificationOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost/api/users', {
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

        fetchData();
    }, [searchQuery]);

    const handleSearch = async () => {
        try {
            const response = await fetch('http://localhost/api/users', {
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

    const handleSendFriendRequest = async (id) => {
        try {
            await SendFriendRequest(id, setNotificationType, setNotificationMessage, setNotificationOpen);
        } catch (error) {
            console.error('Failed to send friend request:', error.message);
        }
    };
    
    return (
        <Box sx={{ padding: '20px' }}>
            <Paper elevation={3} sx={{
                background: 'linear-gradient(to right, rgba(192, 192, 192, 0.3), rgba(70, 130, 180, 0.3))',
                color: '#000',
                padding: '20px',
                borderRadius: '5px',
                marginBottom: '20px'
            }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
            </Paper>
            <Snackbar open={notificationOpen} autoHideDuration={6000} onClose={() => setNotificationOpen(false)}>
                <Alert onClose={() => setNotificationOpen(false)} severity={notificationType}>
                    {notificationMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SearchUsers;
