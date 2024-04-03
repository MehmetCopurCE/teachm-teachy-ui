import React from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Profile from './components/Profile/Profile';
import ProfileIcon from "./components/Profile/ProfileIcon";

function App() {
  return (
    <div className="App" style={{ backgroundColor: "	#ff9248" }}>
      <BrowserRouter>
        <Navbar />
        {/* Links to different pages */}
        <nav>
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            {/* Include ProfileIcon component */}
            <li><ProfileIcon /></li>
          </ul>
        </nav>
        {/* Routes for different pages */}
        <Routes>
          <Route path="/profile" element={<Profile userId={3} />} />
          |<Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
