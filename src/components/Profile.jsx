import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCamera, FaArrowLeft } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [uploadError, setUploadError] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const profileResponse = await fetch('https://cine-berry-api.vercel.app/api/users/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile');
        }
        const profileData = await profileResponse.json();
        setUser(profileData);

        const videosResponse = await fetch(`https://cine-berry-api.vercel.app/api/videos/user/${profileData._id}`);
        if (!videosResponse.ok) {
          throw new Error('Failed to fetch videos');
        }
        const videosData = await videosResponse.json();
        setVideos(videosData);
      } catch (error) {
        console.error('Error fetching profile:', error.message);
        setError(error.message);
        if (error.message === 'No token found') {
          navigate('/login');
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setVideoPreview(videoURL);
    }
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) {
      const avatarURL = URL.createObjectURL(file);
      setAvatarPreview(avatarURL);
    }
  };

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    setUploadError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('title', videoTitle);

      const response = await fetch('https://cine-berry-api.vercel.app/api/videos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload video');
      }

      const newVideo = await response.json();
      setVideos([...videos, newVideo]);
      setSelectedFile(null);
      setVideoTitle('');
      setVideoPreview(null);
    } catch (error) {
      console.error('Error uploading video:', error.message);
      setUploadError(error.message);
    }
  };

  const handleUpdateAvatar = async (e) => {
    e.preventDefault();
    setUploadError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await fetch('https://cine-berry-api.vercel.app/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to update avatar');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error) {
      console.error('Error updating avatar:', error.message);
      setUploadError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('https://cine-berry-api.vercel.app/api/users/logout', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <div className="ad-space">
        <p>Ad Space</p>
      </div>
      <div className="back-button">
        <Link to="/" >
          <FaArrowLeft />
        </Link>
      </div>
      <div className="logout-button">
        <button onClick={handleLogout} id="logout-btn">Logout</button>
      </div>
      <div className="profile-header">
        <div className="profile-pic">
          <img src={avatarPreview || `https://cine-berry-api.vercel.app${user.avatar}`} alt="Profile" className="profile-avatar" />
          <label htmlFor="avatar-upload" className="camera-icon">
            <FaCamera />
          </label>
          <input id="avatar-upload" type="file" onChange={handleAvatarFileChange} style={{ display: 'none' }} />
        </div>
        {avatarFile && (
          <form onSubmit={handleUpdateAvatar} className="update-avatar-form">
            <button type="submit">Update Avatar</button>
          </form>
        )}
        <h2 className="profile-name">{user.username}</h2>
      </div>
      <div className="upload-video-form">
        <button className="upload-video-btn" onClick={() => document.getElementById('video-upload').click()}>Upload Video</button>
        <input id="video-upload" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
        {selectedFile && (
          <>
            <video className="video-preview" controls>
              <source src={videoPreview} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <form onSubmit={handleUploadVideo}>
              <input
                type="text"
                placeholder="Video Title"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                required
              />
              <button type="submit">Upload Video</button>
            </form>
          </>
        )}
        {uploadError && <p className="error">{uploadError}</p>}
      </div>
      <div className="profile-videos">
        {videos.map((video) => (
          <div key={video._id} className="profile-video-wrapper">
            <video className="profile-video" controls>
              <source src={`https://cine-berry-api.vercel.app${video.videoPath}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p className="video-title">{video.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
