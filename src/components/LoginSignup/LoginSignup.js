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
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [action, setAction] = useState("register");
    const [accountPrivacy, setAccountPrivacy] = useState("PRIVATE");

    const handleAccountPrivacyChange = (e) => {
        setAccountPrivacy(e.target.value);
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    const sendRequest = async (path, data) => {
        try {
            const res = await PostWithoutAuth(`/auth/${path}`, data);
            if (res.ok) {
                const result = await res.json();
                localStorage.setItem("tokenKey", result.accessToken);
                localStorage.setItem("refreshKey", result.refreshToken);
                localStorage.setItem("userId", result.userId);
                localStorage.setItem("userName", username);
                console.log(result);

                window.location.href = "/home";
            } else {
                throw new Error('Request failed');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = (path) => {
        const data = {
            username,
            password,
            firstName,
            lastName,
            email,
            question,
            answer,
            accountPrivacy,
        };
        sendRequest(path, data);
        setUsername("");
        setPassword("");
        setFirstName("");
        setLastName("");
        setEmail("");
        setQuestion("");
        setAnswer("");
        setAccountPrivacy("PRIVATE");
    };

    return (
        <div className='container'>
            <div className="glassy">
                <div className="header">{action === "login" ? "We've Missed You!" : "Join Teach Community"}</div>
                <div className="inputs">
                    {action !== "login" && (
                        <>
                            <div className="input">
                                <img src={idcard_icon} alt="First Name" />
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={handleInputChange(setFirstName)}
                                />
                            </div>
                            <div className="input">
                                <img src={idcard_icon} alt="Last Name" />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={handleInputChange(setLastName)}
                                />
                            </div>
                            <div className="input">
                                <img src={email_icon} alt="E-mail" />
                                <input
                                    type="email"
                                    placeholder="E-mail"
                                    value={email}
                                    onChange={handleInputChange(setEmail)}
                                />
                            </div>
                        </>
                    )}
                    <div className="input">
                        <img src={user_icon} alt="Username" />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={handleInputChange(setUsername)}
                        />
                    </div>
                    <div className="input">
                        <img src={password_icon} alt="Password" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handleInputChange(setPassword)}
                        />
                    </div>
                    {action !== "login" && (
                        <>
                            <div className="input">
                                <img src={question_icon} alt="Question" />
                                <input
                                    type="text"
                                    placeholder="Question"
                                    value={question}
                                    onChange={handleInputChange(setQuestion)}
                                />
                            </div>
                            <div className="input">
                                <img src={answer_icon} alt="Answer" />
                                <input
                                    type="text"
                                    placeholder="Answer"
                                    value={answer}
                                    onChange={handleInputChange(setAnswer)}
                                />
                            </div>
                            <div className="input">
                                <img src={answer_icon} alt="Account Privacy" />
                                <select value={accountPrivacy} onChange={handleAccountPrivacyChange}>
                                    <option value="PRIVATE">PRIVATE</option>
                                    <option value="PUBLIC">PUBLIC</option>
                                </select>
                            </div>
                        </>
                    )}
                    <div className="submit" onClick={() => handleSubmit(action === "login" ? "login" : "register")}>
                        {action === "login" ? "Login" : "Register"}
                    </div>
                    <div className="forgot-password" onClick={() => setAction(action === "login" ? "register" : "login")}>
                        {action === "login" ? "Don't have an account? Register" : "Already have an account? Login"}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginSignup;
