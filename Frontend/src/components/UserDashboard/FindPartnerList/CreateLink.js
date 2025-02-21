import React, { useState, useEffect } from "react";
import './CreateLink.css';

const CreateLink = ({ partnerEmail, partnerSkills, onBack }) => {
  const [formData, setFormData] = useState({
    partnerEmail: partnerEmail,
    connectionDate: "",
    message: "",
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/connections/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setSuccessMessage("Connection request sent successfully");
      setTimeout(() => setSuccessMessage(null), 3000);

      setFormData({
        partnerEmail: partnerEmail,
        connectionDate: "",
        message: "",
      });
      setError(null);
    } catch (error) {
      console.error("Error creating connection:", error);
      setError("Failed to create connection. Please try again.");
      setSuccessMessage(null);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const success = queryParams.get("success");
    const connectionId = queryParams.get("connectionId");

    if (success === "true" && connectionId) {
      setSuccessMessage(`Connection successful with ID: ${connectionId}`);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, []);

  return (
    <div className="create-link-container">
      <h2>Create Connection</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="partnerEmail">Partner Email:</label>
          <input type="email" id="partnerEmail" name="partnerEmail" value={formData.partnerEmail} readOnly />
        </div>

        <div className="form-group">
          <label htmlFor="connectionDate">Connection Date:</label>
          <input
            type="date"
            id="connectionDate"
            name="connectionDate"
            value={formData.connectionDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Send Connection Request</button>
        <button type="button" onClick={onBack} className="back-button">Back to Partner List</button>
      </form>
    </div>
  );
};

export default CreateLink;