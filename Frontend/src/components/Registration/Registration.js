import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Registration.css';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const bodyElement = document.body;
    bodyElement.style.backgroundImage = "url('assets/img/regist1.jpg')";
    bodyElement.style.backgroundSize = 'cover';
    bodyElement.style.backgroundRepeat = 'no-repeat';
    bodyElement.style.backgroundPosition = 'center';
    bodyElement.style.height = '100vh';

    return () => {
      bodyElement.style.backgroundImage = '';
      bodyElement.style.backgroundSize = '';
      bodyElement.style.backgroundRepeat = '';
      bodyElement.style.backgroundPosition = '';
      bodyElement.style.height = '';
    };
  }, []);

  const handleValidation = () => {
    let valid = true;

    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Invalid email format. Please include "@"');
      valid = false;
    } else {
      setEmailError('');
    }

    // Validate password
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      valid = false;
    }

    // Validate confirm password
    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords don't match");
      valid = false;
    } else {
      setConfirmPasswordError('');
    }

    return valid;
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    if (!handleValidation()) return;

    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        email: email.trim(),
        username: name.trim(),
        password,
        confirmPassword,
      });

      if (response.data.status === 'OK') {
        alert('Registration successful!');
        navigate('/user-login');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        if (errorMessage === 'Username already exists! Please log in.') {
          setShowLoginPrompt(true);
        } else {
          setErrorMessages([errorMessage]);
        }
      } else {
        setErrorMessages(['An unexpected error occurred']);
      }
    }
  };

  return (
    <div className="registration-container">
      <h2>Registration</h2>
      {showLoginPrompt && (
        <div className="registration-login-prompt">
          <p>
            Email already exists! Please <a href="/user-login">Login here</a>
          </p>
        </div>
      )}
      <form onSubmit={handleRegistration} className="registration-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          {emailError && <small className="error-message">{emailError}</small>}
        </div>
        <div className="form-group">
          <label htmlFor="name">Username</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your username (3-50 characters)"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password (min 6 characters)"
          />
          {passwordError && <small className="error-message">{passwordError}</small>}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
          />
          {confirmPasswordError && (
            <small className="error-message">{confirmPasswordError}</small>
          )}
        </div>
        <button type="submit">Register</button>
      </form>
      <div className="registration-login-link">
        <p>
          Already have an account?{' '}
          <a href="/user-login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Registration;