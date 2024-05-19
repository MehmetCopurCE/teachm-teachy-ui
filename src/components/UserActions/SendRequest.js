const SendFriendRequest = async (friendId, setNotificationType, setNotificationMessage, setNotificationOpen) => {
    try {
        console.log("Sending friend request to friendId:", friendId);
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('tokenKey');
        console.log("Authorization token:", token);

        const response = await fetch(`http://localhost/api/users/${userId}/send-friend-request?friendId=${friendId}`, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to send friend request');
        }

        console.log('Friend request sent successfully!');
        setNotificationType('success');
        setNotificationMessage('Friend request sent successfully!');
        setNotificationOpen(true);
        return responseData;
    } catch (error) {
        console.error('Failed to send friend request:', error.message);
        setNotificationType('error');
        setNotificationMessage(error.message || 'Failed to send friend request');
        setNotificationOpen(true);
        throw error;
    }
};

export default SendFriendRequest;
