import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Home from '../Home/Home';


import Post from './Post'; // Assuming Post component is in the same directory

const FormWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper, // Match the background color of other posts
  width: 800, // Match the width of other posts
  textAlign: 'left', // Align text left to match other posts
  margin: 20,
  padding: 20, // Add padding for better visual separation
}));

const PostForm = (props) => {
  const { userId ,refreshPosts} = props;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('tokenKey');
   
 
   
   

  const savePost = async () => {
    try {
      const response = await fetch("http://localhost/api/posts", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem("tokenKey"), // Tokeni burada kullanıyoruz
        },
        body: JSON.stringify({
          userId: userId, // props'tan gelen userId değerini kullanıyoruz
          title: title,
          content: content
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }
      const newPost=await response.json();
      setPosts([...posts,newPost])

      console.log("Başarılı: ", title, content); // Başarılı mesajı ve title ve content'i consola yazdır

      // Başlık ve içeriği temizle
      setTitle('');
      setContent('');
      refreshPosts();
     
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
  const handleSubmit = () => {
    savePost();
    setContent("");
    setTitle("");
    
   
    // Yeni post oluşturulduktan sonra posts listesini yenile

  }



  return (
    <div>
      <FormWrapper>
        <form onSubmit={handleSubmit}>
          <TextField
            id="title" // veya name="title"
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
            onClick={handleSubmit}
          >
            Post
          </Button >
        </form>
      </FormWrapper>
      <div>

      </div>
    </div>
  );
};


export default PostForm;
