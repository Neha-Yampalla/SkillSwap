import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user/get-all-users")
      .then((response) => {
        console.log("User data:", response.data);
        const fetchedUsers = response.data || [];
        setUsers(fetchedUsers);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError("Failed to fetch user list.");
      });
  }, []);

  const deleteUser = (userEmail) => {
    if (window.confirm(`Are you sure you want to delete the user with email ${userEmail}?`)) {
      axios
        .delete(`http://localhost:8080/api/admin/delete-user?email=${userEmail}`)
        .then(() => {
          alert("User deleted successfully!");
          setUsers((prevUsers) => prevUsers.filter((user) => user.email !== userEmail));
        })
        .catch((error) => {
          console.error(`Error deleting user with email ${userEmail}:`, error);
          alert("Failed to delete the user. Please try again later.");
        });
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (users.length === 0) {
    return <div className="loading">Loading user list...</div>;
  }

  return (
    <div className="user-list-container">
      <h1>User List</h1>
      <div className="user-cards">
        {users.map((user, index) => (
          <div className="user-card" key={index}>
            <div className="user-image-container">
              <img
                src={`assets/img/${user.gender === "Female" ? "femaleuser.png" : "maleuser.png"}`}
                alt="User"
                className="user-image"
              />
            </div>
            <div className="user-details">
              <p><strong>Full Name:</strong> {user.fullName || "Profile Not Updated"}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Mobile:</strong> {user.mobile || "Not provided"}</p>
              <p><strong>Gender:</strong> {user.gender || "Not specified"}</p>
              <p><strong>Skills:</strong> {user.skills || "Not specified"}</p>

              <button
                className="delete-user-button"
                onClick={() => deleteUser(user.email)}
              >
                Delete User
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;