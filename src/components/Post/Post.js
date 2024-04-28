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
  const { title, content, userName, userId, postId, postLikes} = props;
  const [expanded, setExpanded] = useState(false);
  const [likeCounts, setLikeCounts] = useState(postLikes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [likeId, setLikeId] = useState(null); 
  const [error, setError] = useState(null);
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIDYiLCJpYXQiOjE3MTQxMTk3MjAsImV4cCI6MTcxNDEyMTUyMH0.1XYungi_EugLAlYoF0H9tCbZjiI6vm1vYDoPIyDDL2A";
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [commentList,setCommentList]=useState([]);
  const [refresh, setRefresh] = useState(false);
 
    
  const handleExpandClick = () => {
    setExpanded(!expanded);
    refreshComments();
    console.log(commentList);
  };


const setCommentRefresh = () => {
  setRefresh(true);
}

const handleLike=()=>{
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

    setIsLoaded(true);
    const commentData=await response.json();
    setCommentList(commentData);
  } catch (error) {
    setError(error);
  }
};

useEffect(()=>{
  refreshComments();
})

useEffect(() => {checkLikes()},[])
  return (
    <div className="postContainer">
      <CardWrapper>
        <CardHeader
          avatar={
            <Link to={{ pathname: '/users/' + userId }}>
              <AvatarWrapper sx={{ bgcolor: "orange", textDecoration:"none" }} aria-label="recipe">
                {userName && userName.charAt(0).toUpperCase()}
                
              </AvatarWrapper>
            </Link>
          }
          title={userName}
        />

        <ContentWrapper>
        <Typography variant="h6" color="textPrimary" gutterBottom>
      {title}
    </Typography>
          <Typography variant="body2" color="text.secondary">
            
            {content}
          </Typography>
        </ContentWrapper>
        <CardActions disableSpacing>
          <IconButton
           onClick={handleLike}
            aria-label="add to favorites"
          >
            <FavoriteIcon style={isLiked ? { color: "red" } : null} />
          </IconButton>
          {likeCounts}
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
            {error ? "error" :
              isLoaded ? commentList.map(comment => (
                <Comment
                  key={comment.id}
                  author={comment.author}
                  content={comment.content}
                  createdAt={comment.createdAt}
                />
              )) : "Loading"}
                <CommentForm userId = {userId} userName = {userName} postId = {postId} setCommentRefresh={setCommentRefresh}></CommentForm>
           
          </Container>
        </Collapse>
      </CardWrapper>
    </div>
  );
}

export default Post;
