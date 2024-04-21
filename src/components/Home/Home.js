import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Post from "../Post/Post";
import Comment from "../Comment/Comment";


function Home() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timestamp, setTimestamp] = useState('');

  const token ='eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIDExIiwiaWF0IjoxNzEyMTY0Njc4LCJleHAiOjE3MTIxNjY0Nzh9.PGhipU2Gq8AJBJDFCOJP7ft9uz-iuUq18gnilKC2tIk';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost/api/posts", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const postData = await response.json();
        setPosts(postData);
      } catch (error) {
        setError(error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch("http://localhost/api/comments", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }

        const commentData = await response.json();
        setComments(commentData);
      } catch (error) {
        setError(error);
      }
    };

    Promise.all([fetchPosts(), fetchComments()])
      .then(() => setLoading(false))
      .catch(error => {
        setError(error);
        setLoading(false);
      });

    // Set static timestamp
    const currentTimestamp = new Date().toLocaleString();
    setTimestamp(currentTimestamp);
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="home">
      <Link to="/profile" className="profile-icon-link">
        
      </Link>
      <h2>Posts</h2>
      <p>Current version timestamp: {timestamp}</p>
      {posts.map(post => (
        <div key={post.id}>
          <Post title={post.title} content={post.content} />
          <h3>Comments</h3>
          {comments
            .filter(comment => comment.postId === post.id)
            .map(comment => (
              <Comment key={comment.id} author={comment.author} content={comment.content} />
            ))}
        </div>
      ))}
    </div>
  );
}

export default Home;
