import axios from "axios";
import React, { useEffect, useState } from "react";
import UserList from "./UserList";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [adminEmail, setAdminEmail] = useState("");
  const [usersCount, setUsersCount] = useState(0);

  // New user state variables
  const [newUserFullName, setNewUserFullName] = useState("");
  const [newUserMobile, setNewUserMobile] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [gender, setGender] = useState("");
  const [skills, setSkills] = useState("");

  const defaultPassword = "defaultPassword123"; // Default password for new users

  // Fetch admin email
  const fetchAdminEmail = () => {
    axios
      .get("http://localhost:8080/api/admin/get-welcome-email")
      .then((response) => {
        setAdminEmail(response.data.email || "Unknown Email");
      })
      .catch((error) => {
        console.error("Error fetching email:", error);
        setAdminEmail("Error fetching email");
      });
  };

  // Fetch total users count
  const fetchUsersCount = () => {
    axios
      .get("http://localhost:8080/api/admin/users")
      .then((response) => {
        setUsersCount(response.data || 0);
      })
      .catch((error) => {
        console.error("Error fetching users count:", error);
      });
  };

  // Handle adding user
  const handleAddUser = (e) => {
    e.preventDefault();
    const newUser = {
      fullName: newUserFullName,
      mobile: newUserMobile,
      email: newUserEmail,
      gender: gender,
      skills: skills,
      password: defaultPassword,
    };

    axios
      .post("http://localhost:8080/api/admin/add-user", newUser)
      .then((response) => {
        alert("User added successfully");
        fetchUsersCount(); // Refresh the user count
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        alert("Error adding user");
      });
  };

  // Initial data fetch
  useEffect(() => {
    fetchAdminEmail();
    fetchUsersCount();
  }, []);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="profile-section">
          <img src="assets/img/admin.png" alt="Admin" className="profile-picture" />
          <p className="admin-email">{adminEmail || "Loading Email..."}</p>
        </div>
        <ul className="menu-list">
          {["Dashboard", "Users", "Add Users", "Manage Users"].map((menu) => (
            <li
              key={menu}
              className={selectedMenu === menu ? "menu-item active" : "menu-item"}
              onClick={() => handleMenuClick(menu)}
            >
              {menu}
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content">
        <div className="Admin-navbar">
          <ul>
            <li><a href="/admin-dashboard">Home</a></li>
            <li><span>Welcome {adminEmail || "Loading..."}</span></li>
            <li><a href="/WelcomePage">Logout</a></li>
          </ul>
        </div>

        <div className="cards-container">
          {selectedMenu === "Dashboard" && (
            <>
              <div className="card">
                <h2>Total Users</h2>
                <p>{usersCount}</p>
              </div>
            </>
          )}

          {selectedMenu === "Manage Users" && (
            <>
              <UserList />
            </>
          )}

          
          {selectedMenu === "Add Users" && (
            <>
              <div className="form-container">
                <form onSubmit={handleAddUser} className="form">
                  <div className="form-group">
                    <label htmlFor="userEmail">User's Email</label>
                    <input
                      type="email"
                      id="userEmail"
                      placeholder="Enter user's email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="userFullName">User's Full Name</label>
                    <input
                      type="text"
                      id="userFullName"
                      placeholder="Enter user's full name"
                      value={newUserFullName}
                      onChange={(e) => setNewUserFullName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="userMobile">Mobile Number</label>
                    <input
                      type="text"
                      id="userMobile"
                      placeholder="Enter user mobile number"
                      value={newUserMobile}
                      onChange={(e) => setNewUserMobile(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="userGender">Gender</label>
                    <select
                      id="userGender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="skills">Skills</label>
                    <textarea
                      id="skills"
                      placeholder="Enter skills"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                    ></textarea>
                  </div>

                  <button type="submit">Add User</button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;