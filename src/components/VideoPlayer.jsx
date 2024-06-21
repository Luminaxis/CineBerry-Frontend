import React, { useState, useRef, useEffect } from 'react';
import './VideoPlayer.css';
import Button from './Buttons';

const VideoPlayer = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoWrapperRef = useRef(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('https://cine-berry-api.vercel.app/api/videos');
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    if (videos.length) {
      const shuffledVideos = [...videos].sort(() => Math.random() - 0.5);
      setVideos(shuffledVideos);
    }
  }, [videos.length]);

  const handleVideoClick = (index) => {
    const videoElement = document.querySelector(`#video-${index}`);
    if (videoElement) {
      videoElement.muted = !videoElement.muted;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = videoWrapperRef.current.scrollTop;
      const videoHeight = videoWrapperRef.current.clientHeight;
      const newVideoIndex = Math.round(scrollTop / videoHeight);

      if (newVideoIndex !== currentVideoIndex) {
        setCurrentVideoIndex(newVideoIndex);
      }
    };

    const videoWrapper = videoWrapperRef.current;
    videoWrapper.addEventListener('scroll', handleScroll);

    return () => {
      videoWrapper.removeEventListener('scroll', handleScroll);
    };
  }, [currentVideoIndex]);

  useEffect(() => {
    const videoElement = document.querySelector(`#video-${currentVideoIndex}`);
    if (videoElement) {
      videoElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentVideoIndex]);

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('https://cine-berry-api.vercel.app/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token); // Store token in localStorage
      // Handle successful login and redirect or update UI
      console.log('Login successful');
    } catch (error) {
      console.error('Login error:', error.message);
      // Handle login error state, display error message to the user, etc.
    }
  };

  return (
    <div className="video-container">
      <div className="ad-space">
        <p>Ad Space</p>
      </div>
      <div className="video-wrapper" ref={videoWrapperRef}>
        {videos.map((video, index) => (
          <div key={video._id} className="video-content">
            <video
              id={`video-${index}`}
              className="video"
              autoPlay={index === currentVideoIndex}
              loop
              muted
              onClick={() => handleVideoClick(index)}
            >
              <source src={`https://cine-berry-api.vercel.app/${video.videoPath}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="video-overlay">
              <div className="user-avatar">
                <img src={`https://cine-berry-api.vercel.app${video.user.avatar}`} alt="User Avatar" />
              </div>
              <div className="video-title">
                <p>{video.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button />
    </div>
  );
};

export default VideoPlayer;
