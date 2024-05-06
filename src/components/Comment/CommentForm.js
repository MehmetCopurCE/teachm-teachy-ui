import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CardContent, InputAdornment, OutlinedInput, Avatar, Button } from "@mui/material";


function CommentForm({ userId, userName, postId, setCommentRefresh }) {
  const [content, setContent] = useState("");

  const token = localStorage.getItem('tokenKey');
 
 
  const saveComment = () => {
   const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIDYiLCJpYXQiOjE3MTQxMTk3MjAsImV4cCI6MTcxNDEyMTUyMH0.1XYungi_EugLAlYoF0H9tCbZjiI6vm1vYDoPIyDDL2A";
  
    fetch("http://localhost/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("tokenKey"),
      },
      body: JSON.stringify({
        content: content,
        postId: postId,
        userId: userId,
        
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create comment");
        }
        setCommentRefresh();
        setContent("");
      })
      .catch((error) => {
        console.error("Error creating comment:", error);
      });
  };
  

  const handleSubmit = () => {
    saveComment();
    setContent("");
    setCommentRefresh();
  };

  const handleChange = (value) => {
    setContent(value);
  };

  return (
    <CardContent style={{ display: "flex", alignItems: "center" }}>
      <OutlinedInput
        id="outlined-adornment-amount"
        multiline
        inputProps={{ maxLength: 250 }}
        fullWidth
        onChange={(e) => handleChange(e.target.value)}
        startAdornment={
          <InputAdornment position="start">
            <Link to={{ pathname: "/users/" + userId }} style={{ textDecoration: "none", boxShadow: "none" }}>
              <Avatar aria-label="recipe" sx={{ width: 24, height: 24, bgcolor: "orange" }}>
              {userName && userName.charAt(0).toUpperCase()}
              </Avatar>
            </Link>
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <Button
              variant="contained"
              style={{
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                color: "white",
              }}
              onClick={handleSubmit}
            >
              Comment
            </Button>
          </InputAdornment>
        }
        value={content}
        style={{ color: "black", backgroundColor: "white" }}
      />
    </CardContent>
  );
}

export default CommentForm;
