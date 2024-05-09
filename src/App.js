import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layouts/MainLayout.js'; // Import MainLayout component
import Login from './components/LoginSignup/LoginSignup.js';
import Home from './components/Home/Home.js';
import Profile from './components/Profile/Profile.js';

function App() {
  return (
    <div className="App" style={{ backgroundColor: "#f0f0f0" }}>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            {/* Define the /login route */}
            
            {/* Define other routes */}
            <Route path="/profile" element={<Profile userId={3} />} />
            <Route path="/home" element={<Home />} />
            <Route path="/loginsignup" element={<Login />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </div>
  );
}

export default App;