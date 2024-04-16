import React, { useState } from 'react';
import axios from 'axios';


const SendFriendRequest = () => {
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSendRequest = async () => {
    setLoading(true);
    try {
      // Make POST request to send friend request
      await axios.post('http://localhost/api/users/5/send-friend-request?friendId=3', { recipient });
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Send Friend Request</h2>
      <input
        type="text"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Enter recipient username or ID"
      />
      <button onClick={handleSendRequest} disabled={loading || !recipient}>
        {loading ? 'Sending...' : 'Send Request'}
      </button>
      {error && <p>Error: {error}</p>}
      {success && <p>Friend request sent successfully!</p>}
    </div>
  );
};

export default SendFriendRequest;
