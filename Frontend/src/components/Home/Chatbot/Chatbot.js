import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! How can I assist you today? Please select an option below.' },
  ]);
  const [selectedOption, setSelectedOption] = useState(null);
  const chatbotBodyRef = useRef(null);

  // Predefined Questions and Answers
  const questionsAndAnswers = {
    login: [
      { question: 'How do I log in?', answer: 'Use your registered email and password to log in on the login page.' },
      { question: 'What if I forget my password?', answer: 'Click on the "Forgot Password" link on the login page and follow the instructions.' },
      { question: 'Can I stay logged in?', answer: 'Yes, you can enable the "Remember Me" option during login to stay logged in on the device.' },
      { question: 'What do I do if my login is not working?', answer: 'Make sure your credentials are correct or reset your password if necessary.' },
      { question: 'How can I log out?', answer: 'You can log out by clicking the "Logout" button in your account settings.' },
      { question: 'Can I use social media to log in?', answer: 'Yes, we offer options to log in using Facebook, Google, and other social media accounts.' },
      { question: 'Why am I being redirected to the login page?', answer: 'You may have been logged out due to inactivity or a session timeout.' },
      { question: 'Can I log in with a mobile number?', answer: 'Currently, login is supported via email and password only.' },
    ],
    register: [
      { question: 'How do I register?', answer: 'To register, visit the registration page and fill in your details.' },
      { question: 'What do I need to register?', answer: 'You will need your name, email, phone number, and password to complete registration.' },
      { question: 'Can I register without an email?', answer: 'An email address is required for registration to receive confirmation and notifications.' },
      { question: 'What should I do if I have issues registering?', answer: 'Please check if your details are correct or contact support for assistance.' },
      { question: 'Can I register using my social media account?', answer: 'Yes, you can register using Facebook, Google, or other social media accounts.' },
      { question: 'Is registration free?', answer: 'Yes, registration is completely free.' },
      { question: 'Do I need a referral to register?', answer: 'No, referrals are not required for registration.' },
      { question: 'How do I update my registration details?', answer: 'You can update your details through your profile page after logging in.' },
    ],
    skills: [
      { question: 'How do I find popular skills?', answer: 'Browse through the skills section on the homepage to find popular skills.' },
      { question: 'Can I add new skills?', answer: 'Yes, you can add new skills from your profile page.' },
      { question: 'How do I update my skills?', answer: 'You can update your skills from your profile page.' },
      { question: 'Can I delete a skill?', answer: 'Yes, you can delete a skill from your profile page.' },
      { question: 'How do I search for skills?', answer: 'Use the search bar on the homepage to search for specific skills.' },
      { question: 'Can I see the skills of other users?', answer: 'Yes, you can view the skills of other users by visiting their profiles.' },
      { question: 'How do I endorse a skill?', answer: 'You can endorse a skill by clicking the endorse button on the user’s profile.' },
      { question: 'Can I see who endorsed my skills?', answer: 'Yes, you can see who endorsed your skills from your profile page.' },
    ],
    sessions: [
      { question: 'How do I book a skill session?', answer: 'Log in to your account, select a skill, and book an available slot.' },
      { question: 'Can I change my session?', answer: 'Yes, you can reschedule your session by logging into your account.' },
      { question: 'Can I cancel my session?', answer: 'Yes, you can cancel your session from the sessions section.' },
      { question: 'What if I miss my session?', answer: 'Please reschedule as soon as possible to avoid any inconvenience.' },
      { question: 'How can I choose a skill expert?', answer: 'Browse through the list of skill experts and select the one that suits your needs.' },
      { question: 'Can I book multiple sessions?', answer: 'Yes, you can book multiple sessions with different skill experts.' },
      { question: 'What should I do if the skill expert is unavailable?', answer: 'You can select an alternative time slot or book with another skill expert.' },
      { question: 'Do I need to pay for the session upfront?', answer: 'Payment may be required during the booking process, depending on the skill expert or service.' },
    ],
  };

  // Toggle chatbot visibility
  const toggleChatbot = () => setIsOpen(!isOpen);

  // Close chatbot and reset state
  const closeChatbot = () => {
    setIsOpen(false);
    setMessages([
      { sender: 'bot', text: 'Hi! How can I assist you today? Please select an option below.' },
    ]);
    setSelectedOption(null);
  };

  // Scroll to the bottom of the chat when messages are updated
  useEffect(() => {
    if (chatbotBodyRef.current) {
      chatbotBodyRef.current.scrollTop = chatbotBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle question selection
  const handleQuestionClick = (qa) => {
    setMessages([  // Clear previous history and show the current question and answer only
      { sender: 'user', text: qa.question },
      { sender: 'bot', text: qa.answer },
    ]);
  };

  // Set the selected option (login, register, etc.)
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setMessages([  // Reset message history when a new option is selected
      { sender: 'user', text: `I want to know about ${option}.` },
      { sender: 'bot', text: `Here are some questions about ${option}:` },
    ]);
  };

  // Handle "Back" option to go back to main menu
  const handleBack = () => {
    setSelectedOption(null);
    setMessages([
      { sender: 'bot', text: 'Please select an option below.' },
    ]);
  };

  return (
    <>
      {/* Chatbot Trigger */}
      <div className="chatbot-trigger">
        <button className="open-chatbot-btn" onClick={toggleChatbot}>
          <i className="fas fa-comments"></i>
        </button>
      </div>
      {/* Chatbot Container */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            Chat Assistant
            <button className="close-btn" onClick={closeChatbot}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="chatbot-body" ref={chatbotBodyRef}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-footer">
            {selectedOption ? (
              <>
                <button className="back-btn" onClick={handleBack}>
                  Back
                </button>
                {questionsAndAnswers[selectedOption].map((qa, i) => (
                  <button
                    key={i}
                    className="chatbot-question-btn"
                    onClick={() => handleQuestionClick(qa)}
                  >
                    {qa.question}
                  </button>
                ))}
              </>
            ) : (
              <div className="options">
                <button className="chatbot-option-btn" onClick={() => handleOptionSelect('login')}>
                  Login
                </button>
                <button className="chatbot-option-btn" onClick={() => handleOptionSelect('register')}>
                  Register
                </button>
                <button className="chatbot-option-btn" onClick={() => handleOptionSelect('skills')}>
                  Skills
                </button>
                <button className="chatbot-option-btn" onClick={() => handleOptionSelect('sessions')}>
                  Sessions
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;