import React, { useState, useEffect } from 'react';
import { Paper, Snackbar, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import UnfollowFriend from '../UserActions/Unfollow';
import './FriendsList.css';

const FriendsList = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [friends, setFriends] = useState([]);
    const [friendsCount, setFriendsCount] = useState({});
    const [notificationType, setNotificationType] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationOpen, setNotificationOpen] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchFriendsData = async () => {
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

                // Fetch user details for each friend to get avatar URL
                const friendsDetailsPromises = filteredFriends.map(friend =>
                    fetch(`http://localhost/api/users/${friend.friendId}`, {
                        headers: {
                            'Authorization': token,
                            'Content-Type': 'application/json'
                        },
                    })
                        .then(response => response.json())
                        .then(data => ({
                            ...friend,
                            avatarUrl: data.avatarUrl
                        }))
                );

                const friendsDetails = await Promise.all(friendsDetailsPromises);
                setFriends(friendsDetails);
                setLoading(false);

                // Fetch friends count for each friend
                const friendsCountPromises = filteredFriends.map(friend =>
                    fetch(`http://localhost/api/users/${friend.friendId}/friends`, {
                        headers: {
                            'Authorization': token,
                            'Content-Type': 'application/json'
                        },
                    })
                        .then(response => response.json())
                        .then(data => ({ friendId: friend.friendId, count: data.length }))
                );

                const friendsCountData = await Promise.all(friendsCountPromises);
                const friendsCountMap = {};
                friendsCountData.forEach(item => {
                    friendsCountMap[item.friendId] = item.count;
                });
                setFriendsCount(friendsCountMap);

            } catch (error) {
                console.error('Error fetching friend list:', error.message);
                setError(error.message);
                setNotificationMessage(error.message);
                setNotificationOpen(true);
                setLoading(false);
            }
        };

        fetchFriendsData();
    }, []);

    const handleCloseNotification = () => {
        setNotificationOpen(false);
    };

    const removeFriendFromList = (friendId) => {
        setFriends(prevFriends => prevFriends.filter(friend => friend.friendId !== friendId));
        setFriendsCount(prevFriendsCount => {
            const newCount = { ...prevFriendsCount };
            delete newCount[friendId];
            return newCount;
        });
    };

    const handleAvatarClick = (friendId) => {
        navigate(`/profile/${friendId}`); // Navigate to the user profile page
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Paper className="friends-list" elevation={3}>
            <h2 className="friends-title">Friends</h2>
            <ul className="friend-list">
                {friends.map((friend) => (
                    <li key={friend.friendId} className="friend-card">
                        <Avatar
                            src={friend.avatarUrl}
                            alt={friend.friendUsername}
                            className="profile-photo-lg"
                            onClick={() => handleAvatarClick(friend.friendId)}
                            style={{ cursor: 'pointer' }}
                        />
                        <div className="card-info">
                            <h4 className="text-green">{friend.friendUsername}</h4>
                            <p>{friend.firstName} {friend.lastName}</p>
                            <p>{friendsCount[friend.friendId] ? `${friendsCount[friend.friendId]} Friends` : '0 Friends'}</p>

                            <UnfollowFriend
                                friendId={friend.friendId}
                                removeFriendFromList={removeFriendFromList}
                                setNotificationType={setNotificationType}
                                setNotificationMessage={setNotificationMessage}
                                setNotificationOpen={setNotificationOpen}
                            />
                        </div>
                    </li>
                ))}
            </ul>
            <Snackbar
                open={notificationOpen}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                message={notificationMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Paper>
    );
};

export default FriendsList;
