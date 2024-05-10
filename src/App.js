import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Profile from './components/Profile/Profile';
import ProfileIcon from "./components/Profile/ProfileIcon";
import Login from './components/LoginSignup/LoginSignup';

function App() {
  return (
    <div className="App" style={{ backgroundColor: "#ff9248", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} /> 
          <Route path="/profile" element={<Profile userId={3} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/loginsignup" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
