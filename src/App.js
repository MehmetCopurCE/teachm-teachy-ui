import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layouts/MainLayout.js'; // Import MainLayout component
import Login from './components/LoginSignup/LoginSignup.js';
import Home from './components/Home/Home.js';
import Profile from './components/Profile/Profile.js';
import { ReactComponent as Logo } from './logo.svg';


function App() {
  return (
    <div className="App" style={{ backgroundColor: "#f0f0f0", display: "flex" }}>
      <div>
      {/* Logo is an actual React component */}
      
      {/* added a placeholder logo for demo purposes.    */}
      <Logo />
    </div>
      <BrowserRouter>
        <Routes>
          {/* Define routes */}
          <Route path="/" element={<Login />} />
          <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
          <Route path="/home" element={<MainLayout><Home /></MainLayout>} />
          {/* Define other routes */}
        </Routes>
      </BrowserRouter>
      
    </div>
    
  );
}

export default App;
