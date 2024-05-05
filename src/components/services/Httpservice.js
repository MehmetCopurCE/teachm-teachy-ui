export const PostWithAuth = async (url, body) => {
    const request = await fetch("/api" + url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("tokenKey"),
        },
        body: JSON.stringify(body),
    });
    return request;
  };
  
  export const PostWithoutAuth = async (url, body) => {
    const request = await fetch("http://localhost:80/api" + url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        
    });
    console.log(body);
    return request;
  };
  
  export const PutWithAuth = async (url, body) => {
    const request = await fetch("/api" + url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("tokenKey"),
        },
        body: JSON.stringify(body),
    });
    return request;
  };
  
  export const GetWithAuth = async (url) => {
    const request = await fetch("/api" + url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("tokenKey"),
        },
    });
    return request;
  };
  
  export const DeleteWithAuth = async (url) => {
    const request = await fetch("/api" + url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("tokenKey"),
        },
    });
    return request;
  };
  
  export const RefreshToken = async () => {
    const request = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId: localStorage.getItem("userId"),
            refreshToken: localStorage.getItem("refreshKey"),
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
    return request;
  };