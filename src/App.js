import React from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Profile from './components/Profile/Profile';
import ProfileIcon from "./components/Profile/ProfileIcon";
import Login from './components/LoginSignup/LoginSignup';

function App() {
  return (
    <div className="App" style={{ backgroundColor: "	#ff9248" }}>
      <BrowserRouter>
        <Navbar />
        {/* Links to different pages */}
        <nav>
          <ul>
            
            {/* Include ProfileIcon component */}
            <li><ProfileIcon /></li>
          </ul>
        </nav>
        {/* Routes for different pages */}
        <Routes>
  {/* Default route redirects to login/signup page */}
  <Route path="/" element={<Login />} />
  {/* Other routes */}
  <Route path="/profile" element={<Profile userId={3} />} />
  <Route path="/home" element={<Home />} />
  <Route path="/loginsignup" element={<Login />} />
</Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;