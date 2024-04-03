import React, { useState, useEffect } from "react";
import Container from '@mui/material/Container';
import Post from "../Post/Post";



function Home() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]);

    useEffect(() => {
        // Token burada tanımlanmalıdır
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIDEiLCJpYXQiOjE3MTIxNjIxMzQsImV4cCI6MTcxMjE2MzkzNH0.9aIF6MVfnDRoWXtwGCO4jn_rl_jYbSceDZPWW6uiZU4';

        fetch("http://localhost/api/posts", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(
            (result) => {
                setIsLoaded(true);
                setPostList(result);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }, []);

   

    if (error) {
        return <div> Error </div>;
    } else if (!isLoaded) {
        return <div> Loading...</div>;
    } else {
        return (
            <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px',backgroundColor:"#f0f5ff" }}>
             

              {postList.map(post => (
                <Post likes={post.postLikes} userId={post.userId} userName={post.userName} key={post.id}  postId={post.postId}  title={post.title} content={post.content} />
              ))}
              
            </Container>
        );
    }
}

export default Home;
