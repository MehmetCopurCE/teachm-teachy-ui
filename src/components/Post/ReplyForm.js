import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function ReplyForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content });
    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="Content"
        variant="outlined"
        multiline
        rows={4}
        fullWidth
        margin="normal"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button type="submit" variant="contained" color="primary">
        Reply
      </Button>
    </form>
  );
}

export default ReplyForm;
