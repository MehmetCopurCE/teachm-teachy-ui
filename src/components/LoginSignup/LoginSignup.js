import React, { useState } from 'react';
import './LoginSignup.css';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import idcard_icon from '../Assets/id-card.png';
import question_icon from '../Assets/question.png';
import answer_icon from '../Assets/answer.png';
import { PostWithoutAuth } from '../services/Httpservice.js';


function LoginSignup() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    // let history = useHistory();


    const handleUsername = (value) => {
        setUsername(value)
    }

    const handlePassword = (value) => {
        setPassword(value)
    }

    const handleFirstName = (value) => {
        setFirstName(value)
    }

    const handleLastName = (value) => {
        setLastName(value)
    }

    const handleEmail = (value) => {
        setEmail(value)
    }

    const handleQuestion = (value) => {
        setQuestion(value)
    }

    const handleAnswer = (value) => {
        setAnswer(value)
    }

    const sendRegisterRequest = async (path) => {
        try {
            const res = await PostWithoutAuth(`/auth/${path}`, {
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
                email: email,
                question: question,
                answer: answer,
                accountPrivacy: accountPrivacy,
            })
                .then((res) => res.json())
                .then((result) => {
                    localStorage.setItem("tokenKey", result.accessToken);
                    localStorage.setItem("refreshKey", result.refreshToken);
                    localStorage.setItem("userId", result.userId);
                    localStorage.setItem("userName", username);
                    console.log(result); 
                    console.log(accountPrivacy);   
                })
                .catch((err) => console.log(err))
        } catch (error) {
            console.log(error);
        }
    }


    const sendLoginRequest = async (path) => {
        try {
            const res = await PostWithoutAuth(`/auth/${path}`, {
                username: username,
                password: password,
            });
    
            if (res.ok) {
                const result = await res.json();
                localStorage.setItem("tokenKey", result.accessToken);
                localStorage.setItem("refreshKey", result.refreshToken);
                localStorage.setItem("userId", result.userId);
                localStorage.setItem("userName", username);
                console.log(result);
    
                // Redirect to profile page
                window.location.href = "/home"; // Assuming your profile page route is '/profile'
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.log(error);
        }
    }
    


    const handleRegisterButton = (path) => {
        sendRegisterRequest(path)
        setUsername("")
        setPassword("")
        setFirstName("")
        setLastName("")
        setEmail("")
        setQuestion("")
        setAnswer("")
        setAccountPrivacy("")
        console.log(localStorage)
        
        // history.go("/auth")

    }

    const handleLoginButton = (path) => {
        sendLoginRequest(path)
        setUsername("")
        setPassword("")
    }

    const [action, setAction] = useState("register");

    const [accountPrivacy, setAccountPrivacy] = useState("Privacy");

    const handleAccountPrivacyChange = (e) => {
        setAccountPrivacy(e.target.value);
    };


    return (




        <div className='container'>
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>


                <div className={action === "login" ? "submit gray" : "submit"} onClick={() => { setAction("register") }}>Register</div>
                <div className={action === "register" ? "submit gray" : "submit"} onClick={() => { setAction("login") }}>Login</div>
                <div className="submit-container"> </div>
            </div>

            {action === "login" ? <div></div> :
                <div className="input">
                    <img src={idcard_icon} alt="" />
                    <input type="firstName" placeholder="First Name" value={firstName} onChange={(e) => handleFirstName(e.target.value)} />
                </div>
            }
            {action === "login" ? <div></div> :
                <div className="input">
                    <img src={idcard_icon} alt="" />
                    <input type="lastName" placeholder="Last Name" value={lastName} onChange={(e) => handleLastName(e.target.value)} />
                </div>
            }

            {action === "login" ? <div></div> :
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder="E-mail" value={email} onChange={(e) => handleEmail(e.target.value)} />
                </div>
            }

            <div className="input">
                <img src={user_icon} alt="" />
                <input type="username" placeholder="Username" value={username} onChange={(e) => handleUsername(e.target.value)} />
            </div>


            <div className="input">
                <img src={password_icon} alt="" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => handlePassword(e.target.value)} />
            </div>

            {action === "login" ? <div></div> :
                <div className="input">
                    <img src={question_icon} alt="" />
                    <input type="question" placeholder="Question" value={question} onChange={(e) => handleQuestion(e.target.value)} />
                </div>
            }
            {action === "login" ? <div></div> :
                <div className="input">
                    <img src={answer_icon} alt="" />
                    <input type="answer" placeholder="Answer" value={answer} onChange={(e) => handleAnswer(e.target.value)} />
                </div>
            }

            {action === "login" ? <div></div> :
                <div className="input">
                    <img src={answer_icon} alt="" />
                    <select value={accountPrivacy} onChange={handleAccountPrivacyChange}>
                        <option value="PRIVATE">Prıvate</option>
                        <option value="PUBLIC">Public</option>
                    </select>
                </div>
            }

            {action === "register" ? <div></div> :
                <div className="forgot-password">Forgot Password <span>Click Here</span></div>
            }

            <div className="submit" onClick={() => action === "login" ? handleLoginButton(action) : handleRegisterButton(action)}>{action}</div>

            <div className="functionalButton"> </div>

        </div>
    );
};


export default LoginSignup;



/*
import React, { useState } from 'react';
import './LoginSignup.css';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import idcard_icon from '../Assets/id-card.png';
import question_icon from '../Assets/question.png';
import answer_icon from '../Assets/answer.png';
import { PostWithoutAuth } from '../services/Httpservice.js';


function LoginSignup  ()  {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    // let history = useHistory();

    
    const handleUsername = (value) => {
        setUsername(value)
    }

    const handlePassword = (value) => {
        setPassword(value)
    }

    const handleFirstName = (value) => {
        setFirstName(value)
    }

    const handleLastName = (value) => {
        setLastName(value)
    }

    const handleEmail = (value) => {
        setEmail(value)
    }

    const handleQuestion = (value) => {
        setQuestion(value)
    }

    const handleAnswer = (value) => {
        setAnswer(value)
    }

    const sendRequest = (path) => {
        PostWithoutAuth(("/auth/" + path), {
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName,
            email: email,
            question: question,
            answer: answer,
            accountPrivacy: accountPrivacy,


        })
            .then((res) => res.json())
            .then((result) => {
                localStorage.setItem("tokenKey", result.accessToken);
                localStorage.setItem("refreshKey", result.refreshToken);
                localStorage.setItem("currentUser", result.userId);
                localStorage.setItem("username", username);
                localStorage.setItem("firstName", firstName);
                localStorage.setItem("lastName", lastName);
                localStorage.setItem("email", email);
                localStorage.setItem("question",question);
                localStorage.setItem( "answer", answer );
                localStorage.setItem("accountPrivacy", accountPrivacy);
            })
            .catch((err) => console.log(err))
    }

    const handleButton = (path) => {
        sendRequest(path)
        setUsername("")
        setPassword("")
        setFirstName("")
        setLastName("")
        setEmail("")
        setQuestion("")
        setAnswer("")
        setAccountPrivacy("")
        console.log(localStorage)
        // history.go("/auth")

    }

    const [action, setAction] = useState("Sign Up");

    const [accountPrivacy, setAccountPrivacy] = useState("Privacy");

    const handleAccountPrivacyChange = (e) => {
      setAccountPrivacy(e.target.value);
    };


    return (
        
    
    

        <div className='container'>
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>


            <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => { setAction("Sign Up") }}>Sign Up</div>
<div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => { setAction("Login") }}>Login</div>
<div className="submit-container"> </div> 
            </div>

            {action === "Login" ? <div></div> : 
            <div className="input">
                <img src={idcard_icon} alt="" />
                <input type="firstName" placeholder="First Name" value={firstName} onChange={(e) => handleFirstName(e.target.value)} />
            </div>
}
{action === "Login" ? <div></div> : 
            <div className="input">
                <img src={idcard_icon} alt="" />
                <input type="lastName" placeholder="Last Name" value={lastName} onChange={(e) => handleLastName(e.target.value)} />
            </div>
}

{action === "Login" ? <div></div> : 
            <div className="input">
                <img src={email_icon} alt="" />
                <input type="email" placeholder="E-mail" value={email} onChange={(e) => handleEmail(e.target.value)} />
            </div>
}

            <div className="input">
                <img src={user_icon} alt="" />
                <input type="username" placeholder="Username" value={username} onChange={(e) => handleUsername(e.target.value)} />
            </div>


            <div className="input">
                <img src={password_icon} alt="" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => handlePassword(e.target.value)} />
            </div>

{action === "Login" ? <div></div> : 
            <div className="input">
                <img src={question_icon} alt="" />
                <input type="question" placeholder="Question" value={question} onChange={(e) => handleQuestion(e.target.value)} />
            </div>
}
{action === "Login" ? <div></div> : 
            <div className="input">
                <img src={answer_icon} alt="" />
                <input type="answer" placeholder="Answer" value={answer} onChange={(e) => handleAnswer(e.target.value)} />
            </div>
}

{action === "Login" ? <div></div> : 
            <div className="input">
                <img src={answer_icon} alt="" />
                <select value={accountPrivacy} onChange={handleAccountPrivacyChange}>
                    <option value="Privacy">Privacy</option>
                    <option value="Public">Public</option>
                </select>
            </div>
}

{action === "Sign Up" ? <div></div> :
<div className="forgot-password">Forgot Password <span>Click Here</span></div>
}

<div className={action === "Login" ? "submit" : "submit"} onClick={() => handleButton(action)}>{action}</div>

<div className="functionalButton"> </div> 

    </div>
  );
};


export default LoginSignup;
*/
