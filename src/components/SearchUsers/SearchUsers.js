import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, TextField, Button, List, ListItem, ListItemText, Snackbar, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SendFriendRequest from '../UserActions/SendRequest';
import './SearchUsers.css';
import Alert from '@mui/material/Alert';

const SearchUsers = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [notificationOpen, setNotificationOpen] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setSearchResults([]);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = async () => {
        if (!searchQuery) {
            setSearchResults([]);
            return;
        }

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

            const filteredResults = data.filter(user =>
                user.username.toLowerCase().includes(searchQuery.toLowerCase())
            );

            setSearchResults(filteredResults);
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

    const handleAvatarClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    return (
        <Box className="search-container" ref={searchRef}>
            <Paper className="search-paper" elevation={3}>
                <TextField
                    className="search-input"
                    label="Search"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    fullWidth
                />
                <Button variant="contained" onClick={handleSearch}>Search</Button>
                {searchResults.length > 0 && (
                    <List className="search-results">
                        {searchResults.map((result) => (
                            <ListItem className="list-item" key={result.id}>
                                <Avatar
                                    src={`https://example.com/avatars/${result.id}.png`} // Replace with your avatar URL logic
                                    alt={result.username}
                                    className="avatar"
                                    onClick={() => handleAvatarClick(result.id)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <ListItemText primary={result.username} />
                                <Button variant="contained" onClick={() => handleSendFriendRequest(result.id)}>Send Friend Request</Button>
                            </ListItem>
                        ))}
                    </List>
                )}
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
