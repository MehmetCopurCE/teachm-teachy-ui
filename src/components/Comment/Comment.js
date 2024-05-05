import React from "react";
import { Link } from "react-router-dom";

function Comment(props) {
  const { content, userId, userName } = props;

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "8px", marginBottom: "8px" }}>
      <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
        <Link style={{ textDecoration: "none", color: "black" }} to={{ pathname: '/users/' + userId }}>
          {userName}
        </Link>
      </div>
      <div>{content}</div>
    </div>
  );
}

export default Comment;
