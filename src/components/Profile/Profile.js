import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Paper, Tabs, Tab } from '@mui/material';

import FriendsList from '../FriendLists/FriendsList.js';
import RejectedList from '../FriendLists/RejectedList.js';
import PendingList from '../FriendLists/PendingList.js';
import Navbar from "../Navbar/Navbar";
import ProfileCard from '../ProfileCard/ProfileCard.js';
import './Profile.css'; // Import the CSS file

const Profile = () => {
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [activeTab, setActiveTab] = useState(0);
    const [friends, setFriends] = useState([]);
    const [loadingFriends, setLoadingFriends] = useState(true);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);

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

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const commentsData = await fetchCommentsByUserId(userId);
                setComments(commentsData);
            } catch (error) {
                setNotificationMessage('Failed to fetch comments');
                setNotificationType('error');
                setNotificationOpen(true);
            }
        };

        if (activeTab === 0) {
            fetchComments();
        }
    }, [activeTab]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const postsData = await fetchPostsByUserId(userId);
                setPosts(postsData);
            } catch (error) {
                setNotificationMessage('Failed to fetch posts');
                setNotificationType('error');
                setNotificationOpen(true);
            }
        };

        if (activeTab === 1) {
            fetchPosts();
        }
    }, [activeTab]);

    const fetchCommentsByUserId = async (userId) => {
        try {
            const token = localStorage.getItem('tokenKey');
            const response = await fetch(`http://localhost/api/comments?userId=${userId}`, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }

            const commentsData = await response.json();
            return commentsData;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    };

    const fetchPostsByUserId = async (userId) => {
        try {
            const token = localStorage.getItem('tokenKey');
            const response = await fetch(`http://localhost/api/posts?userId=${userId}`, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

            const postsData = await response.json();
            return postsData;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    };

    const handleCloseNotification = () => {
        setNotificationOpen(false);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <div>
            <Navbar />
            <Box sx={{ padding: '20px' }}>
                <ProfileCard/>
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
                    <Tab label="Follow Requests" />
                    <Tab label="Rejected Requests" />
                </Tabs>
                <Paper className="content" elevation={3}>
                    {activeTab === 0 && (
                        <div className="comments">
                            <h3>Comments</h3>
                            {comments.length > 0 ? (
                                comments.map(comment => (
                                    <div key={comment.id} className="comment-item">
                                        {comment.content}
                                    </div>
                                ))
                            ) : (
                                <div>You have no comments yet...</div>
                            )}
                        </div>
                    )}
                    {activeTab === 1 && (
                        <div className="posts">
                            <h3>Posts</h3>
                            {posts.length > 0 ? (
                                posts.map(post => (
                                    <div key={post.id} className="post-item">
                                        <h4>{post.title}</h4>
                                        <p>{post.content}</p>
                                        <div className="post-actions">
                                            
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>You have no posts yet...</div>
                            )}
                        </div>
                    )}
                    {activeTab === 2 && (
                        <div className="friends">
                           
                            <FriendsList friends={friends} />
                            
                        </div>
                    )}
                    {activeTab === 3 && (
                        <div className="follow-requests">

                            <PendingList />
                        </div>
                    )}
                    {activeTab === 4 && (
                        <div className="rejected-requests">
                           
                            <RejectedList />
                        </div>
                    )}
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
