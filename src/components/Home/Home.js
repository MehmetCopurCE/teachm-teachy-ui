import React, { useState, useEffect } from "react";
import Post from "../Post/Post";

function Home() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]);

    useEffect(() => {
        // Token burada tanımlanmalıdır
        const token = 'YOUR_TOKEN_HERE';

        fetch("http://localhost/posts", {
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
            <div className="container">
                Home!!
                {postList.map(post => (
                    <Post key={post.id} title={post.title} content={post.content} />
                ))}
            </div>
        );
    }
}

export default Home;
