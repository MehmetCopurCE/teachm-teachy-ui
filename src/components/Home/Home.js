import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Post from "../Post/Post";
import Comment from "../Comment/Comment";
import PostForm from "../Post/PostForm";

function Home() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timestamp, setTimestamp] = useState('');
  

  const token = localStorage.getItem('tokenKey');
  const userId = localStorage.getItem('userId'); // Assuming the server provides the userId upon login
  console.log('Token:', token);
  console.log('UserId:', userId);
  const userName=localStorage.getItem('userName')


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost/api/posts", {
          headers: {
            Authorization: localStorage.getItem("tokenKey"),
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
            Authorization: localStorage.getItem("tokenKey"),
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
  
  const refreshPosts = async () => {
    try {
      const response = await fetch("http://localhost/api/posts", {
        headers: {
          Authorization: localStorage.getItem("tokenKey"),
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const postData = await response.json();
      setPosts(postData);
       // Postlar alındığında setLoading(false) çağır
    } catch (error) {
      setError(error);
       // Hata oluştuğunda setLoading(false) çağır
    }
  };

  useEffect(() => {
    refreshPosts();
  }, []);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  

  


  return (
    <div className="home">
      <Link to="/profile" className="profile-icon-link">
        {/* Profile icon */}
      </Link>
      <h2>Posts</h2>
      <p>Current version timestamp: {timestamp}</p>
      <PostForm userId={userId} refreshPosts={refreshPosts}   />

      {posts.map(post => (
        <div key={post.id}>
         <Post
            postId={post.id}
            title={post.title}
            content={post.content}
            postLikes={post.postLikes}
            userId={userId}
            userName={userName}
           
          />
        </div>
      ))}
    </div>
  );
}

export default Home;
