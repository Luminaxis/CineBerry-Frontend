import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './VideoPlayer.css';
import Button from './Buttons';

const VideoPlayer = () => {

  axios.defaults.withCredentials = true;

  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoWrapperRef = useRef(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('https://cine-berry-api.vercel.app/api/videos');
        setVideos(response.data);
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
      const response = await axios.post('https://cine-berry-api.vercel.app/api/users/login', {
        email,
        password,
      });

      localStorage.setItem('authToken', response.data.token); // Store token in localStorage
      console.log('Login successful');
    } catch (error) {
      console.error('Login error:', error.message);
    }
  };

  return (
    <div className="video-container">
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
              <source src={`https://cine-berry-api.vercel.app${video.videoPath}`} type="video/mp4" />
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
