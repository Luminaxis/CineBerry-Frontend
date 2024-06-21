import React, { useState } from 'react';
import './SignUp.css';
import { Link } from 'react-router-dom';

const SignUp = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/users/register', { // Adjusted the URL to remove localhost
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to sign up');
      }
      // Redirect to login page after successful signup
      window.location.href = '/login'; // Redirect using window.location.href
    })
    .catch(error => {
      console.error('Error signing up:', error);
      // Handle error (e.g., display error message)
    });
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
