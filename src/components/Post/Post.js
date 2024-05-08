import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import { Link } from 'react-router-dom';
import Comment from "../Comment/Comment";
import Container from '@mui/material/Container';
import CommentForm from "../Comment/CommentForm";
import ReplyForm from "./ReplyForm";
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';

const CardWrapper = styled(Card)(({ theme }) => ({
  width: 800,
  textAlign: "left",
  margin: 20,
}));

const ContentWrapper = styled(CardContent)(({ theme }) => ({
  width: '100%',
}));

const AvatarWrapper = styled(Avatar)(({ theme }) => ({
  background: 'orange',
}));

const ExpandIconButton = styled(IconButton)(({ theme }) => ({
  transform: 'rotate(0deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function Post(props) {
  const { title, content, userName, userId, postId, postLikes,createdAt,originalPost,refreshPosts} = props;
  const [expanded, setExpanded] = useState(false);
  const [likeCounts, setLikeCounts] = useState(postLikes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [likeId, setLikeId] = useState(null); 
  const [error, setError] = useState(null);
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIDYiLCJpYXQiOjE3MTQxMTk3MjAsImV4cCI6MTcxNDEyMTUyMH0.1XYungi_EugLAlYoF0H9tCbZjiI6vm1vYDoPIyDDL2A";
    const [showReplyForm, setShowReplyForm] = useState(false); 
  const [isLoaded, setIsLoaded] = useState(false);
  const [commentList,setCommentList]=useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditedTitle(title);
    setEditedContent(content);
  };
  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`http://localhost/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem("tokenKey"),
        },
        body: JSON.stringify({
          title: editedTitle,
          content: editedContent
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      setIsEditing(false);
      refreshPosts();
    } catch (error) {
      setError(error);
    }
  };
 
  const handleReplyClick = () => {
    setShowReplyForm(true);
  };
    
  const handleExpandClick = () => {
    setExpanded(!expanded);
    refreshComments();
    console.log(commentList);
  };


const setCommentRefresh = () => {
  setRefresh(true);
}

const deletePost = async () => {
  try {
    const response = await fetch(`http://localhost/api/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete post');
    }

    // Assuming successful deletion, you might want to do something here like refresh the posts
    refreshPosts();
  } catch (error) {
    setError(error);
  }
};
const handleReplySubmit = async (replyData) => {
  try {
    const response = await fetch("http://localhost/api/posts/repost", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem("tokenKey"),
      },
      body: JSON.stringify({
        userId: localStorage.userId,
        originalPostId: postId,
        title: replyData.title,
        content: replyData.content,
      })
    });

    if (!response.ok) {
      throw new Error('Failed to submit reply');
    }

    // Assuming successful submission, close the reply form
    setShowReplyForm(false);
    refreshPosts();

    // Optionally, you can handle additional actions after successful submission
  } catch (error) {
    setError(error.message);
  }
};

const handleLike=()=>{
  if (userId == localStorage.userId) {
    console.log("Kendi postunu beğenemezsiniz.");
    return;
  }
  setIsLiked(!isLiked);
  if(!isLiked){
   saveLike();
   setLikeCounts(likeCounts+1);
  }else{
    deleteLike();
    setLikeCounts(likeCounts-1);
  }
}

const saveLike = async () => {
  try {
    const response = await fetch("http://localhost/likes", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem("tokenKey"),// Tokeni burada kullanıyoruz
      },
      body: JSON.stringify({
        userId: userId, // props'tan gelen userId değerini kullanıyoruz
        postId: postId,
      })
    });
    if (!response.ok) {
      throw new Error('Failed to create like');
    }
    const data = await response.json();
    var likeId2=data.id;
    setIsLiked(true);
    setLikeId(likeId2);
    console.log("Başarılı: ",userId, postId,likeId2,likeId); // Başarılı mesajı ve title ve content'i consola yazdır

    // Başlık ve içeriği temizle
  
   
  } catch (error) {
    setError(error);
    console.log(error);
  }
};

const deleteLike = async () => {
  try {
    const response = await fetch(`http://localhost/likes/`+likeId, {
      method: 'DELETE',
      headers: {
        
        Authorization: localStorage.getItem("tokenKey"), // Tokeni burada kullanıyoruz
      },
      body: JSON.stringify({
        likeId: likeId, // props'tan gelen userId değerini kullanıyoruz
      })
    });
    if (!response.ok) {
      throw new Error('Failed to delete like');

    }

    console.log("Silme işlemi başarılı: ", userId, postId,);

    // Gerekirse, silme işlemi başarılı olduğunda ek işlemler yapabilirsin.

  } catch (error) {
    setError(error);
    console.log(error,likeId);
    
  }
};

useEffect(() => {
  checkLikes();
}, []);

const checkLikes = () => {
  const likeControl = postLikes.find(like => like && like.userId ==userId);
  if (likeControl!=null) {
    setIsLiked(true);
    setLikeId(likeControl.id);
  }
};

const refreshComments = async () => {
  try {
    const response = await fetch(`http://localhost/api/comments?postId=${postId}`, {
      headers: {
        Authorization: localStorage.getItem("tokenKey"),
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    const commentData = await response.json();
    setCommentList(commentData);
    setIsLoaded(true);
  } catch (error) {
    console.error("Error fetching comments:", error);
    setError(error);
  }
};

useEffect(() => {
  checkLikes();
  refreshComments();
}, []);


useEffect(() => {
  handleReplySubmit();
}, []);

useEffect(() => {checkLikes()},[])
return (
  <div className="postContainer">
    <CardWrapper>
      <CardHeader
        avatar={
          <Link to={{ pathname: '/users/' + userId }}>
            <AvatarWrapper sx={{ bgcolor: "orange", textDecoration: "none" }} aria-label="recipe">
              {userName && userName.charAt(0).toUpperCase()}
            </AvatarWrapper>
          </Link>
        }
        title={userName}
      />

      <ContentWrapper>
        {isEditing ? (
          <>
            <TextField
              label="Title"
              fullWidth
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              variant="outlined"
              margin="normal"
            />
            <TextField
              label="Content"
              fullWidth
              multiline
              rows={4}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              variant="outlined"
              margin="normal"
            />
          </>
        ) : (
          <>
            <Typography variant="h7" className="postTitle" >
              <b>{title}</b>
            </Typography>
            <Typography variant="body2" >
              {content}
            </Typography>
          </>
        )}
        <div style={{ borderTop: '1px solid #ccc', marginTop: 10, paddingTop: 10 }}>
          <Typography variant="body2" color="text.secondary">
            {createdAt}
          </Typography>
        </div>
      </ContentWrapper>
      {originalPost && (
          <CardContent>
            <Card>
              <CardContent>
                <Typography variant="h7" >
                 <b>{originalPost.username}</b>
                </Typography>
                <Typography variant="body1">
                  {originalPost.title}
                </Typography>
                <Typography variant="body2">
                  {originalPost.content}
                </Typography>
                
              </CardContent>
            </Card>
          </CardContent>
        )}
      <CardActions disableSpacing>
        {userId !== parseInt(localStorage.userId, 10) && (
          <IconButton
            onClick={handleLike}
            aria-label="add to favorites"
          >
            <FavoriteIcon style={isLiked ? { color: "red" } : null} />
          </IconButton>
        )}
        {likeCounts} Likes
        <IconButton
          onClick={handleReplyClick}
          aria-label="reply"
        >
          <ReplyIcon />
        </IconButton>
        {userId === parseInt(localStorage.userId, 10) && (
          <>
            {isEditing ? (
              <>
                <Button onClick={handleEditSubmit} color="primary">
                  Save
                </Button>
                <Button onClick={handleEditCancel} color="secondary">
                  Cancel
                </Button>
              </>
            ) : (
              <IconButton onClick={handleEditClick} aria-label="edit">
                <EditIcon />
              </IconButton>
            )}
            <IconButton onClick={deletePost} aria-label="delete">
              <DeleteOutlineIcon />
            </IconButton>
          </>
        )}
        <ExpandIconButton
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandIconButton>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Container fixed>
          <h3>Comments</h3>
        
           {isLoaded ? commentList.map(comment => (
              <Comment
                key={comment.id}
                userId={comment.userId}
                userName={comment.userName}
                content={comment.content}
                id={comment.id}
                currentUser={localStorage.userId}
                refreshComments={refreshComments}
              />
            )) : "Loading"}
          <CommentForm userId={localStorage.userId} userName={localStorage.userName} postId={postId} setCommentRefresh={refreshComments}></CommentForm>
        </Container>
      </Collapse>

      {showReplyForm && (
        <Container fixed>
          <h3>Reply</h3>
          <ReplyForm onSubmit={handleReplySubmit} />
        </Container>
      )}
    </CardWrapper>
  </div>
);
}
export default Post;
