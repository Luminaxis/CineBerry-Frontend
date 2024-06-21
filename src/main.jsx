import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import VideoPlayer from './components/VideoPlayer';
import Profile from './components/Profile';
import Login from './components/Login';
import SignUp from './components/SignUp';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
          <Route index element={<VideoPlayer />} />
          <Route path="profile" element={<Profile/>} />
          <Route path="login" element={<Login/>} />
          <Route path="signup" element={<SignUp/>} />
      </Routes>
    </Router>
  </React.StrictMode>
);
