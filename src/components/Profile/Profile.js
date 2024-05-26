import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Paper, Tabs, Tab } from '@mui/material';
import SearchUsers from '../SearchUsers/SearchUsers.js';
import FriendsList from '../FriendLists/FriendsList.js';
import RejectedList from '../FriendLists/RejectedList.js';
import PendingList from '../FriendLists/PendingList.js';
import Navbar from "../Navbar/Navbar";
import './Profile.css'; // Import the CSS file
import ProfileCard from '../ProfileCard/ProfileCard.js';

const Profile = () => {
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [userId, setUserId] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [activeActivityTab, setActiveActivityTab] = useState(0);
    const [friends, setFriends] = useState([]);
    const [loadingFriends, setLoadingFriends] = useState(true);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const token = localStorage.getItem('tokenKey');
                const userId = localStorage.getItem('userId');

                if (!userId || !token) {
                    throw new Error('User ID or Token is missing');
                }

                const response = await fetch(`http://localhost/api/users/${userId}/friends`, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch friend list');
                }

                const friendsData = await response.json();
                const filteredFriends = friendsData.filter(friend => friend.friendId !== parseInt(userId));
                setFriends(filteredFriends);
                setLoadingFriends(false);
            } catch (error) {
                console.error('Error fetching friend list:', error.message);
                setNotificationMessage(error.message);
                setNotificationOpen(true);
                setLoadingFriends(false);
            }
        };

        fetchFriends();
    }, []);

    const handleCloseNotification = () => {
        setNotificationOpen(false);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleActivityTabChange = (event, newValue) => {
        setActiveActivityTab(newValue);
    };

    return (
        <div>
            <Navbar />
            <Box sx={{ padding: '20px' }}>
                <Paper className="profile-header" elevation={3}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                backgroundColor: '#ddd',
                                marginBottom: '10px',
                                marginTop: '10px'
                            }}></div>
                        </div>
                        <div>
                            <ProfileCard/>
                        </div>
                    </div>
                </Paper>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="Comments" />
                    <Tab label="Posts" />
                    <Tab label="Friends" />
                </Tabs>
                <Paper className="content" elevation={3}>
                    {activeTab === 0 && (
                        <div className="comments">
                            <h3>Comments</h3>
                            {/* Example comments */}
                            <div className="comment-item">User commented on "Post Title"...</div>
                            <div className="comment-item">User commented on "Post Title"...</div>
                        </div>
                    )}
                    {activeTab === 1 && (
                        <div className="posts">
                            <h3>Posts</h3>
                            {/* Example posts */}
                            <div className="post-item">
                                <h4>Post Title</h4>
                                <p>Post Content...</p>
                                <div className="post-actions">
                                    <button>Like</button>
                                    <button>Comment</button>
                                    <button>Share</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 2 && (
                        <div className="friends">
                            <h3>Friends</h3>
                            <FriendsList friends={friends} />
                        </div>
                    )}
                </Paper>
                {activeTab === 2 && (
                    <>
                        <Tabs
                            value={activeActivityTab}
                            onChange={handleActivityTabChange}
                            indicatorColor="secondary"
                            textColor="secondary"
                            centered
                            className="activity-tabs"
                        >
                            <Tab label="Pending" />
                            <Tab label="Rejected" />
                            <Tab label="Search" />
                        </Tabs>
                        <Paper className="content" elevation={3}>
                            {activeActivityTab === 0 && (
                                <div className="pending">
                                    <h3>Pending Requests</h3>
                                    <PendingList />
                                </div>
                            )}
                            {activeActivityTab === 1 && (
                                <div className="rejected">
                                    <h3>Rejected Requests</h3>
                                    <RejectedList />
                                </div>
                            )}
                            {activeActivityTab === 2 && (
                                <div className="search-users">
                                    <h3>Search Users</h3>
                                    <SearchUsers />
                                </div>
                            )}
                        </Paper>
                    </>
                )}
            </Box>
            <Snackbar
                open={notificationOpen}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                message={notificationMessage}
                severity={notificationType}
                sx={{ bottom: '20px' }}
            />
        </div>
    );
};

export default Profile;
