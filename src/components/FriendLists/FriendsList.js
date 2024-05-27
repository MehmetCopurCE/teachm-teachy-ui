import React, { useState, useEffect } from 'react';
import { Paper, Snackbar } from '@mui/material';
import UnfollowFriend from '../UserActions/Unfollow'; // Import the UnfollowFriend component
import './FriendsList.css'; // Import the CSS file

const FriendsList = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [friends, setFriends] = useState([]);
    const [notificationType, setNotificationType] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationOpen, setNotificationOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
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
                setLoading(false);
            } catch (error) {
                console.error('Error fetching friend list:', error.message);
                setError(error.message);
                setNotificationMessage(error.message);
                setNotificationOpen(true);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCloseNotification = () => {
        setNotificationOpen(false);
    };

    const removeFriendFromList = (friendId) => {
        setFriends(prevFriends => prevFriends.filter(friend => friend.friendId !== friendId));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Paper className="friends-list" elevation={3}>
            <h2 className="friends-title">Friends</h2>
            <ul className="friend-list">
                {friends.map((friend) => {
                    // Hesaplanan arkadaş sayısını alıyoruz
                    const friendCount = friends.filter(f => f.friendId === friend.friendId).length;
                    
                    return (
                        <li key={friend.friendId} className="friend-card">
                            <img 
                                src={`https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436180.jpg?t=st=1716757233~exp=1716760833~hmac=4bfa8f8a96f4610dbb2dfab9866964687642659632c79903e43f6e33bf94d03f&w=740`} 
                                alt={friend.friendUsername} 
                                className="profile-photo-lg"
                            />
                            <div className="card-info">
                                <h4 className="text-green">{friend.friendUsername}</h4>
                                <p>{friend.firstName} {friend.lastName}</p>
                                <p>Friends: {friendCount}</p>
                                <UnfollowFriend
                                    friendId={friend.friendId}
                                    removeFriendFromList={removeFriendFromList}
                                    setNotificationType={setNotificationType}
                                    setNotificationMessage={setNotificationMessage}
                                    setNotificationOpen={setNotificationOpen}
                                />
                            </div>
                        </li>
                    );
                })}
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
