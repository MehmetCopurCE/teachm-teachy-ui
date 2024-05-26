import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Paper } from '@mui/material';
import ProfileCard from '../ProfileCard/ProfileCard.js';
import SearchUsers from '../SearchUsers/SearchUsers.js';
import FriendsList from '../FriendLists/FriendsList.js';
import RejectedList from '../FriendLists/RejectedList.js';
import PendingList from '../FriendLists/PendingList.js';
import Navbar from "../Navbar/Navbar";
import './Profile.css'; // Import the CSS file

const Profile = () => {
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [notificationOpen, setNotificationOpen] = useState(false);   
    const [userId, setUserId] = useState(null);

    const handleCloseNotification = () => {
        setNotificationOpen(false);
    };

    return (
        <div>
            <Navbar />
            <Box sx={{ padding: '20px' }}>
                <Paper className="profile-header" elevation={3}>
                    <ProfileCard userId={userId} />
                </Paper>
                <div className="tabs">
                    <div className="tab">Posts</div>
                    <div className="tab">Comments</div>
                    <div className="tab">Friends</div>
                    <div className="tab">Activity</div>
                </div>
                <Paper className="content" elevation={3}>
                    <div className="activity-feed">
                        <h3>Activity Feed</h3>
                        {/* Example activities */}
                        <div className="activity-item">User commented on a post...</div>
                        <div className="activity-item">User liked a post...</div>
                        <div className="activity-item">User added a new friend...</div>
                    </div>
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
                    <div className="comments">
                        <h3>Comments</h3>
                        {/* Example comments */}
                        <div className="comment-item">User commented on "Post Title"...</div>
                        <div className="comment-item">User commented on "Post Title"...</div>
                    </div>
                    <div className="friends">
                        <h3>Friends</h3>
                        <FriendsList />
                        <RejectedList />
                        <PendingList />
                    </div>
                    <div className="search-users">
                        <h3>Search Users</h3>
                        <SearchUsers />
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
