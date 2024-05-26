import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Paper } from '@mui/material';
import Navbar from "../Navbar/Navbar";
import ProfileCard from '../ProfileCard/ProfileCard';
import './Profile.css'; // Ensure this file includes the new CSS styles

const Profile = () => {
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [notificationOpen, setNotificationOpen] = useState(false);
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

    return (
        <div>
            <Navbar />
            <Box className="container">
                <Paper className="profile-card">
                    <div className="profile-header">
                        <div className="main-profile">
                            <div className="profile-image" />
                            <div className="profile-names">
                                <ProfileCard />
                                <span className="page-title">Front-End Developer</span>
                            </div>
                        </div>
                    </div>
                    <div className="profile-body">
                        <div className="profile-actions">
                            <button className="follow">Follow</button>
                            <button>Message</button>
                            <div className="bio">
                                <div className="bio-header">Bio</div>
                                <p>Lorem ipsum dolor sit amet...</p>
                            </div>
                        </div>
                        <div className="account-info">
                            <div className="data">
                                <div className="data-item">
                                    <span className="value">104</span>
                                    <span className="label">Posts</span>
                                </div>
                                <div className="data-item">
                                    <span className="value">21K</span>
                                    <span className="label">Followers</span>
                                </div>
                                <div className="data-item">
                                    <span className="value">53</span>
                                    <span className="label">Following</span>
                                </div>
                            </div>
                            <div className="data">
                                <div className="data-item">
                                    <span className="value">41K</span>
                                    <span className="label">Likes</span>
                                </div>
                                <div className="data-item">
                                    <span className="value">12K</span>
                                    <span className="label">Comments</span>
                                </div>
                                <div className="data-item">
                                    <span className="value">2K</span>
                                    <span className="label">Saved</span>
                                </div>
                            </div>
                            <div className="last-post">
                                <div className="post-cover">
                                    <span className="last-badge">Latest</span>
                                </div>
                                <h4 className="post-title">3D layers</h4>
                                <button className="post-CTA">View</button>
                            </div>
                        </div>
                    </div>
                </Paper>
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
