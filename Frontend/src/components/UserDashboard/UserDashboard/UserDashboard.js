import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import EditUserProfile from "../EditProfile/EditUserProfile";
import PartnerList from "../FindPartnerList/PartnerList";
import FeedbackPage from "../FeedbackList/FeedbackPage";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [userEmail, setUserEmail] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [skillsCount, setSkillsCount] = useState(0);
  const [partnersCount, setPartnersCount] = useState(0);
  const [userProfile, setUserProfile] = useState({
    userName: "",
    mobileNo: "",
    skills: "",
    gender: "",
    age: "",
    address: "",
  });

  const socketUrl = "http://localhost:8080/ws";

  // Fetch user's email
  const fetchUserEmail = () => {
    axios
      .get("http://localhost:8080/api/user/get-welcome-email")
      .then((response) => {
        setUserEmail(response.data.email || "Unknown Email");
      })
      .catch((error) => {
        console.error("Error fetching email:", error);
        setUserEmail("Error fetching email");
      });
  };

  // Fetch user's profile
  const fetchUserProfile = () => {
    axios
      .get("http://localhost:8080/api/user/profile")
      .then((response) => {
        setUserProfile(response.data);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  };

  const fetchSkillsCount = () => {
    axios
      .get("http://localhost:8080/api/user/skills-count")
      .then((response) => {
        setSkillsCount(response.data.count || 0);
      })
      .catch((error) => {
        console.error("Error fetching skills count:", error);
      });
  };

  const fetchPartnersCount = () => {
    axios
      .get("http://localhost:8080/api/user/partners-count")
      .then((response) => {
        setPartnersCount(response.data.count || 0);
      })
      .catch((error) => {
        console.error("Error fetching partners count:", error);
      });
  };

  useEffect(() => {
    fetchSkillsCount();
    fetchPartnersCount();
  }, []);

  // Fetch unread notifications
  const fetchNotifications = useCallback(() => {
    if (userEmail) {
      axios
        .get(`http://localhost:8080/notifications/${userEmail}`)
        .then((response) => {
          setNotifications(response.data);
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
        });
    }
  }, [userEmail]);

  // Mark notification as read
  const markAsRead = (id) => {
    axios
      .post(`http://localhost:8080/notifications/read/${id}`)
      .then(() => {
        setNotifications(notifications.filter((n) => n.id !== id));
      })
      .catch((error) =>
        console.error("Error marking notification as read:", error)
      );
  };

  // WebSocket for real-time notifications
  useEffect(() => {
    if (userEmail) {
      const socket = new SockJS(socketUrl);
      const stompClient = Stomp.over(socket);

      stompClient.connect({}, () => {
        stompClient.subscribe(`/topic/notifications/${userEmail}`, (message) => {
          const newNotification = JSON.parse(message.body);
          setNotifications((prevNotifications) => [
            newNotification,
            ...prevNotifications,
          ]);
        });
      });

      return () => {
        if (stompClient) {
          stompClient.disconnect();
        }
      };
    }
  }, [userEmail]);

  // Fetch data on component load
  useEffect(() => {
    fetchUserEmail();
    fetchUserProfile();
  }, []);

  // Fetch notifications after email is available
  useEffect(() => {
    if (userEmail) {
      fetchNotifications();
    }
  }, [userEmail, fetchNotifications]);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="profile-section">
          <img
            src="assets/img/user.jpg"
            alt="User"
            className="profile-picture"
          />
          <p className="user-name">
            {userProfile.userName || "Loading Name..."}
          </p>
        </div>
        <ul className="menu-list">
          {["Dashboard", "Edit Profile", "Partners List"].map((menu) => (
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

      {/* Main Content */}
      <div className="main-content">
        <div className="User-navbar">
          <ul>
            <li>
              <a href="/user-dashboard">Home</a>
            </li>
            <li>
              <span>Welcome {userEmail || "Loading..."}</span>
            </li>
            <li>
              <div className="notification-container">
                <button
                  className="notification-bell"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  🔔
                  {notifications.length > 0 && (
                    <span className="notification-badge">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="notification-dropdown">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div key={notification.id} className="notification-item">
                          <p>{notification.message}</p>
                          {notification.status !== "READ" && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark As Read
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>No new notifications</p>
                    )}
                  </div>
                )}
              </div>
            </li>
            <li>
              <a href="/WelcomePage">Logout</a>
            </li>
          </ul>
        </div>

        {/* Render based on selected menu */}
        <div className="cards-container">
          {selectedMenu === "Dashboard" && (
            <>
              <div className="card">
                <h2>Total Skills</h2>
                <p>{skillsCount}</p>
              </div>
              <div className="card">
                <h2>Total Partners</h2>
                <p>{partnersCount}</p>
              </div>
            </>
          )}

          {selectedMenu === "Edit Profile" && (
            <EditUserProfile
              refreshData={() => {
                fetchUserEmail();
                fetchUserProfile();
              }}
            />
          )}

          {selectedMenu === "Partners List" && <PartnerList />}

          {selectedMenu === "Feedback" && <FeedbackPage />}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;