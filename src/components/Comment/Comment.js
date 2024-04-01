import React from "react";

function Comment({ author, content, createdAt }) {
    return (
        <div className="comment">
            <div className="comment-author">{author}</div>
            <div className="comment-content">{content}</div>
            <div className="comment-date">{createdAt}</div>
        </div>
    );
}

export default Comment;
