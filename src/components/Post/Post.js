import React from "react";
import "./Post.scss";
function Post(props){
  const {title,content}=props;
  return(
    <div className="postContainer">
      {title}
      {content}

    </div>
  );
}
export default Post;