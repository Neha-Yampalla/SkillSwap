import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from './FeedbackPage.module.css';

const FeedbackPage = () => {
  const { sessionId } = useParams();  // Get sessionId from the URL
  const navigate = useNavigate();  // Initialize the navigate function

  const [userName, setUserName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [rating, setRating] = useState(1); // Default rating
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true); // To track loading state

  // Fetch user's name and partner's name using sessionId
  useEffect(() => {
    if (isNaN(sessionId)) {
      alert("Invalid session ID");
      return;
    }

    // Fetch the user's name
    axios
      .get(`http://localhost:8080/feedback/user/${sessionId}`)
      .then((response) => {
        setUserName(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user name:", error);
      });

    // Fetch the partner's name
    axios
      .get(`http://localhost:8080/feedback/partner/${sessionId}`)
      .then((response) => {
        setPartnerName(response.data);
      })
      .catch((error) => {
        console.error("Error fetching partner name:", error);
      })
      .finally(() => {
        setIsLoading(false); // Set loading to false once data is fetched
      });
  }, [sessionId]);

  // Handle feedback submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const feedbackData = {
      userName,
      partnerName,
      rating,
      comment,
    };

    axios
      .post("http://localhost:8080/feedback/add", feedbackData)
      .then((response) => {
        alert("Feedback submitted successfully!");
        navigate('/user-dashboard');  // Navigate to the user dashboard after successful submission
      })
      .catch((error) => {
        console.error("Error submitting feedback:", error);
        alert("Failed to submit feedback.");
      });
  };

  // Loading state while waiting for the API responses
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles['feedback-page']}>
      <h2>Submit Your Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>User's Name</label>
          <input type="text" value={userName} readOnly />
        </div>
        <div>
          <label>Partner's Name</label>
          <input type="text" value={partnerName} readOnly />
        </div>

        <div>
          <label>Rating</label>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`${styles.star} ${rating >= star ? styles.filled : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div>
          <label>Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
          />
        </div>
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackPage;