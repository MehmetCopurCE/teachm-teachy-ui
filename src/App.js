import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layouts/MainLayout.js'; // Import MainLayout component
import Login from './components/LoginSignup/LoginSignup.js';
import Home from './components/Home/Home.js';
import Profile from './components/Profile/Profile.js';
import PendingList from './components/FriendLists/PendingList.js';
import UserCard from './components/UserCard/UserCard.js';
import { ReactComponent as Logo } from './logo.svg';
import FriendsList from './components/FriendLists/FriendsList.js';


function App() {
  return (
    <div className="App" style={{ backgroundColor: "#f0f0f0", display: "flex" }}>
      <div>
      {/* Logo is an actual React component */}
      
      {/* added a placeholder logo for demo purposes.    */}
      
      
    </div>
      <BrowserRouter>
        <Routes>
          {/* Define routes */}
          <Route path="/" element={<Login />} />
          <Route path="/profile" element={<Profile userId={3} />} />
          <Route path="/" element={<PendingList />} />
                <Route path="/profile/:userId" element={<UserCard />} />
          <Route path="/home" element={<Home />} />
          <Route path ="/friendslist" element={<FriendsList />} />
          {/* Define other routes */}
        </Routes>
      </BrowserRouter>
      
    </div>
    
  );
}

export default App;
