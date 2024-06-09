// Home.js
import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Post from "../Post/Post";
import PostForm from "../Post/PostForm";
import SearchUsers from "../SearchUsers/SearchUsers";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timestamp, setTimestamp] = useState('');

  const token = localStorage.getItem('tokenKey');
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

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
        const sortedPosts = postData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 
        setPosts(sortedPosts);
      } catch (error) {
        setError(error);
      }
    };

    fetchPosts()
      .then(() => setLoading(false))
      .catch(error => {
        setError(error);
        setLoading(false);
      });

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
      const sortedPosts = postData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 
      setPosts(sortedPosts);
    } catch (error) {
      setError(error);
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
      <Navbar />
      <SearchUsers />  
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1', marginRight: '20px' }}>
          <div style={{ marginLeft: '20px', marginBottom: '20px' }}>
            <PostForm userId={userId} refreshPosts={refreshPosts} />
          </div>
          <div className="post-list">
            {posts.map(post => (
              <div key={post.id} style={{ marginBottom: '20px' }}>
                <Post
                  postId={post.id}
                  title={post.title}
                  content={post.content}
                  postLikes={post.postLikes}
                  userId={post.userId}
                  userName={post.username}
                  repostTitle={post.repostTitle}
                  repostContent={post.repostContent}
                  createdAt={new Date(post.createdAt).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  originalPost={post.originPost}
                  refreshPosts={refreshPosts}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
