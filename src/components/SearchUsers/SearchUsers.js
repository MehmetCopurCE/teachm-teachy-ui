import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, TextField, Button, List, ListItem, ListItemText, Snackbar, Avatar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SendFriendRequest from '../UserActions/SendRequest';
import Unfollow from '../UserActions/Unfollow';
import ResendFriendRequest from '../UserActions/SendRequest'; // Updated import
import UnfollowFriend from '../UserActions/Unfollow';
import './SearchUsers.css';

const SearchUsers = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [friends, setFriends] = useState([]);
    const [rejectedList, setRejectedList] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
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

    useEffect(() => {
        const fetchFriendsAndRejected = async () => {
            try {
                const token = localStorage.getItem('tokenKey');
                const userId = localStorage.getItem('userId');

                if (!userId || !token) {
                    throw new Error('User ID or Token is missing');
                }

                const friendsResponse = await fetch(`http://localhost/api/users/${userId}/friends`, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                });

                if (!friendsResponse.ok) {
                    throw new Error('Failed to fetch friend list');
                }

                const friendsData = await friendsResponse.json();
                setFriends(friendsData);

                const rejectedResponse = await fetch(`http://localhost/api/users/${userId}/rejected-requests`, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                });

                if (!rejectedResponse.ok) {
                    throw new Error('Failed to fetch rejected list');
                }

                const rejectedData = await rejectedResponse.json();
                setRejectedList(rejectedData);

                // Initialize sent requests from localStorage or set it to an empty array
                const savedSentRequests = JSON.parse(localStorage.getItem('sentRequests')) || [];
                setSentRequests(savedSentRequests);

            } catch (error) {
                console.error('Error fetching friends or rejected list:', error.message);
                setNotificationMessage(error.message);
                setNotificationType('error');
                setNotificationOpen(true);
            }
        };

        fetchFriendsAndRejected();
    }, []);

    const handleSearch = async () => {
        if (!searchQuery) {
            setSearchResults([]);
            return;
        }

        try {
            const token = localStorage.getItem('tokenKey');
            const response = await fetch('http://localhost/api/users', {
                headers: {
                    'Authorization': token,
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
            setSentRequests(prevRequests => {
                const updatedRequests = [...prevRequests, id];
                localStorage.setItem('sentRequests', JSON.stringify(updatedRequests)); // Save to localStorage
                return updatedRequests;
            });
            setFriends(prevFriends => prevFriends.filter(friend => friend.friendId !== id));
        } catch (error) {
            console.error('Failed to send friend request:', error.message);
        }
    };

    const handleUnfollow = async (id) => {
        try {
            await Unfollow(id, setNotificationType, setNotificationMessage, setNotificationOpen);
            setFriends(prevFriends => prevFriends.filter(friend => friend.friendId !== id));
        } catch (error) {
            console.error('Failed to unfollow friend:', error.message);
        }
    };

    const handleResendFriendRequest = async (id) => {
        try {
            await ResendFriendRequest(id, setNotificationType, setNotificationMessage, setNotificationOpen); // Updated function call
            setSentRequests(prevRequests => {
                const updatedRequests = [...prevRequests, id];
                localStorage.setItem('sentRequests', JSON.stringify(updatedRequests)); // Save to localStorage
                return updatedRequests;
            });
            setFriends(prevFriends => prevFriends.filter(friend => friend.friendId !== id));
        } catch (error) {
            console.error('Failed to resend friend request:', error.message);
        }
    };

    const handleAvatarClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    const determineRelationshipStatus = (userId) => {
        if (friends.some(friend => friend.friendId === userId)) {
            return 'following';
        } else if (rejectedList.some(request => request.senderId === userId)) {
            return 'rejected';
        } else if (sentRequests.includes(userId)) {
            return 'sent';
        } else {
            return 'none';
        }
    };

    const removeFriendFromList = (friendId) => {
        setFriends(friends.filter(friend => friend.friendId !== friendId));
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
                                {determineRelationshipStatus(result.id) === 'following' && (
                                    <>
                                        <span>Following</span>
                                        <UnfollowFriend
                                            friendId={result.id}
                                            removeFriendFromList={removeFriendFromList}
                                            setNotificationType={setNotificationType}
                                            setNotificationMessage={setNotificationMessage}
                                           
                                            setNotificationOpen={setNotificationOpen}
                                            />
                                        </>
                                    )}
                                    {determineRelationshipStatus(result.id) === 'rejected' && (
                                        <>
                                            <span>Rejected</span>
                                            <Button variant="contained" color="primary" onClick={() => handleResendFriendRequest(result.id)}>Oops! Follow Again</Button>
                                        </>
                                    )}
                                    {determineRelationshipStatus(result.id) === 'sent' && (
                                        <>
                                            <span>Request Sent</span>
                                        </>
                                    )}
                                    {determineRelationshipStatus(result.id) === 'none' && (
                                        <Button variant="contained" color="primary" onClick={() => handleSendFriendRequest(result.id)}>Follow</Button>
                                    )}
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
    