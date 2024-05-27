import React, { useState, useEffect } from 'react';
import { List, ListItem, Typography, Card, CardContent, Avatar } from '@mui/material';
import { red } from '@mui/material/colors';
import { Link } from 'react-router-dom';

function CommentsByUser({ userId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommentsByUser = async () => {
      try {
        const response = await fetch(`http://localhost/api/comments?userId=${userId}`, {
          headers: {
            'Authorization': localStorage.getItem("tokenKey"),
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }

        const data = await response.json();
        setComments(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCommentsByUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <List>
      {comments.map(comment => (
        <ListItem key={comment.id}>
          <Card style={{ width: '100%', margin: '10px 0' }}>
            <CardContent>
              <Typography variant="h6">
                <Avatar sx={{ bgcolor: red[500] }}>
                  {comment.userName.charAt(0).toUpperCase()}
                </Avatar>
                <Link to={`/profile/${comment.userId}`}>{comment.userName}</Link>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {comment.createdAt}
              </Typography>
              <Typography variant="body1">
                {comment.content}
              </Typography>
            </CardContent>
          </Card>
        </ListItem>
      ))}
    </List>
  );
}

export default CommentsByUser;
