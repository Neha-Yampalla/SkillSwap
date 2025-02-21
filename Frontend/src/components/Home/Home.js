import React from 'react';
import './Home.css';
import Chatbot from './Chatbot/Chatbot'; // Import the Chatbot component

const Home = () => {
  return (
    <div className="home-container">
      <nav className="main-nav">
        <ul>
          <li><a href="/" className='home-name'>SkillSwap</a></li>
          <li><a href="/">Home</a></li>
          <li><a href="/feedback-list">Feedback List</a></li>
          <li><a href="/WelcomePage">Login</a></li>
          <li><a href="/registration">Registration</a></li>
        </ul>
      </nav>
      <div className="img-container">
        <img 
          src="assets/img/skill-Swap-banner.png"
          alt="SkillSwap Banner"
          className="home-bg"
        />
      </div>
      <div className="categories-container">
        <h2 className="section-title">
          Explore by our <span className="highlight">category</span>
        </h2>
        <div className="categories-grid">
          <div className="category-card">
            <div className="icon-container">
              <img src="assets/img/skills.png" alt="Skills Icon" className="icon" />
            </div>
            <p>Find popular skills.</p>
          </div>
          <div className="category-card active">
            <div className="icon-container">
              <img src="assets/img/appointments.png" alt="Appointment Icon" className="icon" />
            </div>
            <p>Book Skill Sessions Online.</p>
          </div>
          <div className="category-card">
            <div className="icon-container">
              <img src="assets/img/profile.png" alt="Profile Icon" className="icon" />
            </div>
            <p>Profile Management.</p>
          </div>
          <div className="category-card">
            <div className="icon-container">
              <img src="assets/img/alerts.png" alt="Alerts Icon" className="icon" />
            </div>
            <p>Skill Alerts.</p>
          </div>
        </div>
      </div>
      <div className='foot'>
        <footer> <p>© 2024 SkillSwap. All rights reserved.</p></footer>
      </div>

      {/* Add the Chatbot component */}
      <Chatbot />
    </div>
  );
};

export default Home;