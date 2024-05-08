import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IconButton, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function Comment(props) {
  const { id, content, userId, userName, currentUser, handleEdit, handleDelete, refreshComments } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleEditChange = (event) => {
    setEditedContent(event.target.value);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`http://localhost/api/comments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("tokenKey"),
        },
        body: JSON.stringify({ content: editedContent })
      });

      if (!response.ok) {
        throw new Error('Failed to update comment');
      }

      setIsEditing(false);
      refreshComments();
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const response = await fetch(`http://localhost/api/comments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem("tokenKey"),
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      refreshComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "8px", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
        <Link style={{ textDecoration: "none", color: "black" }} to={{ pathname: '/users/' + userId }}>
          {userName}
        </Link>
      </div>
      {isEditing ? (
        <div style={{ flex: "1" }}>
          <textarea value={editedContent} onChange={handleEditChange} style={{ width: "100%", border: "none", outline: "none" }} />
        </div>
      ) : (
        <div style={{ flex: "1", overflowWrap: "break-word" }}>{content}</div>
      )}
      {parseInt(currentUser) === parseInt(userId) && (
        <div style={{ display: "flex", alignItems: "center" }}>
          {isEditing ? (
            <Button variant="contained" onClick={handleEditSubmit} style={{ marginLeft: "8px", alignSelf: "flex-end" }}>Save</Button>
          ) : (
            <>
              <IconButton onClick={() => setIsEditing(!isEditing)} style={{ marginRight: "8px" }}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleDeleteClick}>
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Comment;
