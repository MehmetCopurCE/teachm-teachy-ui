import React, { useState, useRef, useEffect } from "react";
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
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Collapse from '@mui/material/Collapse';
import CommentIcon from '@mui/icons-material/Comment';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import { PostWithAuth, DeleteWithAuth } from "../../services/Httpservice";
import Comment from "../Comment/Comment"; // Import your Comment component

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
  const { title, content, userName, userId, postId, likes } = props;
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [commentList, setCommentList] = useState([]);

  const [likeCount, setLikeCount] = useState(likes ? likes.length : 0);
  const [isLiked, setIsLiked] = useState(false);
  const isInitialMount = useRef(true);
  const [likeId, setLikeId] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const checkLikes = () => {
    var likeControl = likes.find((like => "" + like.userId === userId));
    if (likeControl != null) {
      setLikeId(likeControl.id);
      setIsLiked(true);
    }
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      saveLike();
      setLikeCount(likeCount + 1)
    }
    else {
      deleteLike();
      setLikeCount(likeCount - 1)
    }

  }
  const saveLike = () => {
    fetch("/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: postId,
        userId: userId,
      }),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err))
  }

  const deleteLike = () => {
    fetch("/likes/" + likeId, {
      method: "DELETE",
    })

      .catch((err) => console.log(err))

  }


  return (
    <div className="postContainer">
      <CardWrapper>
        <CardHeader
          avatar={
            <Link to={{ pathname: '/users/' + userId }}>
              <AvatarWrapper sx={{ bgcolor: "orange" }} aria-label="recipe">
                {userName && userName.charAt(0).toUpperCase()}
              </AvatarWrapper>
            </Link>
          }

          title={title}

        />

        <ContentWrapper>
          <Typography variant="body2" color="text.secondary">
            {content}
          </Typography>
        </ContentWrapper>
        <CardActions disableSpacing>
          <IconButton
            onClick={handleLike}
            aria-label="add to favorites">
            <FavoriteIcon style={isLiked ? { color: "red" } : null} />

          </IconButton>
          {likeCount}
          <ExpandIconButton
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <CommentIcon />
          </ExpandIconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            {/* Render the list of Comment components here */}
            {commentList.map(comment => (
              <Comment key={comment.id} author={comment.author} content={comment.content} createdAt={comment.createdAt} />
            ))}
          </CardContent>
        </Collapse>
      </CardWrapper>
    </div>
  );
}
export default Post;
