import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

const RejectedList = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rejectedList, setRejectedList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
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

                const rejectedListWithUsernames = await Promise.all(data.map(async (request) => {
                    const senderProfileResponse = await fetch(`http://localhost/api/users/${request.senderId}`, {
                        headers: {
                            'Authorization': token,
                            'Content-Type': 'application/json'
                        },
                    });

                    if (!senderProfileResponse.ok) {
                        throw new Error(`Failed to fetch profile for sender ID ${request.senderId}`);
                    }

                    const senderProfile = await senderProfileResponse.json();
                    return {
                        ...request,
                        senderName: senderProfile.username,
                    };
                }));

                setRejectedList(rejectedListWithUsernames);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const calculateTimeAgo = (timestamp) => {
        const now = new Date();
        const date = new Date(timestamp);
        const elapsed = now - date;

        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);

        if (weeks > 0) {
            return `${weeks}w ago`;
        } else if (days > 0) {
            return `${days}d ago`;
        } else if (hours > 0) {
            return `${hours}h ago`;
        } else if (minutes > 0) {
            return `${minutes}m ago`;
        } else {
            return 'Just now';
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <RejectedListContent rejectedList={rejectedList} calculateTimeAgo={calculateTimeAgo} />
    );
};

const RejectedListContent = ({ rejectedList, calculateTimeAgo }) => (
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
                    <ListItemText primary={request.senderName} />
                    <Typography variant="body2" color="textSecondary">{calculateTimeAgo(request.createdAt)}</Typography>
                </ListItem>
            ))}
        </List>
    </Paper>
);

export default RejectedList;
