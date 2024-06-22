import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios

const Login = () => {

  axios.defaults.withCredentials = true;

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      const response = await axios.post('https://cine-berry-api.vercel.app/api/users/login', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Handle login failure
      if (!response.data.token) {
        throw new Error('Failed to login');
      }

      // Store the token in local storage
      localStorage.setItem('token', response.data.token);
      // Redirect to profile page after successful login
      navigate('/profile');
    } catch (error) {
      console.error('Error logging in:', error.message);
      setError('Failed to login'); // Handle error (e.g., display error message)
    }
  };

  return (
    <div className="container">
      <div className="heading">Login</div>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="form">
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
          value="Login" 
        />
      </form>
      <span className="login-link">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </span>
    </div>
  );
};

export default Login;
