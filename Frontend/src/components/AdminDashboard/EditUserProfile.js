import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./EditUserProfile.css";
const EditUserProfile = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    mobile: "",
    gender: "",
    skills: "",
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/user/get-user/${email}`)
      .then((response) => setUser(response.data))
      .catch((error) => setError("Failed to load user details."));
  }, [email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSaveChanges = () => {
    axios
      .put(`http://localhost:8080/api/admin/edit-user-profile/${email}`, user)
      .then(() => {
        alert("User Profile Updated successfully!");
        navigate("/admin-dashboard");
      })
      .catch(() => setError("Failed to save changes."));
  };

  if (error) {
    return <div className="edit-user-error-message">{error}</div>;
  }

  return (
    <div className="edit-user-container">
      <h1>
        <center>Edit User Profile</center>
      </h1>
      <form className="edit-user-profile-form">
        <label>
          Full Name:
          <input
            type="text"
            name="fullName"
            value={user.fullName}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Mobile No:
          <input
            type="text"
            name="mobile"
            value={user.mobile}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Gender:
          <select
            name="gender"
            value={user.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label>
          Skills:
          <textarea
            name="skills"
            value={user.skills}
            onChange={handleInputChange}
            required
          ></textarea>
        </label>
        <button type="button" onClick={handleSaveChanges}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditUserProfile;