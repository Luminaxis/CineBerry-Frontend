import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';
import { Link } from 'react-router-dom';

const SignUp = () => {

  axios.defaults.withCredentials = true;

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://cine-berry-api.vercel.app/api/users/register', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 201) {
        // Redirect to login page after successful signup
        window.location.href = '/login'; // Redirect using window.location.href
      } else {
        throw new Error('Failed to sign up');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      // Handle error (e.g., display error message)
    }
  };

  return (
    <div className="container">
      <div className="heading">Sign Up</div>
      <form onSubmit={handleSubmit} className="form">
        <input 
          required 
          className="input" 
          type="text" 
          name="username" 
          id="username" 
          placeholder="UserName" 
          value={formData.username} 
          onChange={handleChange} 
        />
        <input 
          required 
          className="input" 
          type="email" 
          name="email" 
          id="email" 
          placeholder="E-mail" 
          value={formData.email} 
          onChange={handleChange} 
        />
        <input 
          required 
          className="input" 
          type="password" 
          name="password" 
          id="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange} 
        />
        <input 
          className="login-button" 
          type="submit" 
          value="Sign Up" 
        />
      </form>
      <span className="login-link">
        Already have an account? <Link to="/login">Login</Link>
      </span>
    </div>
  );
};

export default SignUp;
