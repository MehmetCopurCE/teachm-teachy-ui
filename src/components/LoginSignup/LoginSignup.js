import React, { useState } from 'react';
import './LoginSignup.css';
import user_icon from '../Assets/user.png';
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png';
import idcard_icon from '../Assets/id-card.png';
import question_icon from '../Assets/question.png';
import answer_icon from '../Assets/answer.png';

const LoginSignup = () => {
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
      </div>

      {action === "Login" ? <div></div> :
        <div className="input">
          <img src={idcard_icon} alt="" />
          <input type="firstname" placeholder="First Name" />
        </div>
      }

      {action === "Login" ? <div></div> :
        <div className="input">
          <img src={idcard_icon} alt="" />
          <input type="lastname" placeholder="Last Name" />
        </div>
      }

      <div className="inputs">
        {action === "Login" ? <div></div> :
          <div className="input">
            <img src={email_icon} alt="" />
            <input type="email" placeholder="E-mail" />
          </div>
        }

        <div className="input">
          <img src={user_icon} alt="" />
          <input type="username" placeholder="Username" />
        </div>

        <div className="input">
          <img src={password_icon} alt="" />
          <input type="password" placeholder="Password" />
        </div>

        {action === "Login" ? <div></div> :
          <div className="input">
            <img src={question_icon} alt="" />
            <input type="question" placeholder="Question" />
          </div>
        }

        {action === "Login" ? <div></div> :
          <div className="input">
            <img src={answer_icon} alt="" />
            <input type="answer" placeholder="Answer" />
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

      </div>


      {action === "Sign Up" ? <div></div> :
        <div className="forgot-password">Forgot Password <span>Click Here</span></div>
      }

      <div className="submit-container">
        <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => { setAction("Sign Up") }}>Sign Up</div>
        <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => { setAction("Login") }}>Login</div>
      </div>
    </div>
  );
};

export default LoginSignup;
