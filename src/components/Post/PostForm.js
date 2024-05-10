import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// Assume Home component is imported
import Home from '../Home/Home';
import Post from './Post';

const FormWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  width: 800,
  textAlign: 'left',
  margin: 20,
  padding: 20,
  borderRadius: 15, // Add border radius for a consistent look
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Add shadow for depth
}));

const PostForm = (props) => {
  const { userId, refreshPosts } = props;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const token = localStorage.getItem('tokenKey');
   
  const savePost = async () => {
    try {
      const response = await fetch("http://localhost/api/posts", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem("tokenKey"),
        },
        body: JSON.stringify({
          userId: userId,
          title: title,
          content: content
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }
      
      // Assuming successful post creation, refresh the post list
      refreshPosts();
      
      // Clear the title and content fields after successful submission
      setTitle('');
      setContent('');
    } catch (error) {
      setError(error);
    }
  };

  const handleTitle = (value) => {
    setTitle(value);
  }

  const handleContent = (value) => {
    setContent(value);
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    savePost();
  }

  return (
    <FormWrapper>
      <form onSubmit={handleSubmit}>
        <TextField
          id="title"
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => handleTitle(e.target.value)}
          required
          fullWidth
          margin="normal"
        />

        <TextField
          label="Content"
          variant="outlined"
          multiline
          rows={4}
          value={content}
          onChange={(e) => handleContent(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
        >
          Post
        </Button >
      </form>
    </FormWrapper>
  );
};

export default PostForm;
