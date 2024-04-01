// App.js
import React from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
// commented out 
import Navbar from './components/Navbar/Navbar';
//import Home from './components/Home/Home';
import Profile from './components/Profile/Profile';
//it will be commited soon
//import LoginSignup from './components/LoginSignup/LoginSignup'; //commented out for now


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        {/* Links to different pages */}
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </nav>
        {/* Routes for different pages */}
        <Routes>
  {/* <Route path="/" element={<Home />} />  */
  <Route path="/profile" element={<Profile userId={5} />} /> }
     {/* <Route path="/login" element={<LoginSignup />} /> */}
  </Routes>

        </BrowserRouter>
      </div>
    );
  }

export default App;
