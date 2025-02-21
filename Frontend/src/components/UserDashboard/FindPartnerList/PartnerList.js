import axios from "axios";
import React, { useEffect, useState } from "react";
import CreateLink from './CreateLink';
import "./PartnerList.css"; // Custom CSS for Partner List

const PartnerList = () => {
  const [partners, setPartners] = useState([]);
  const [error, setError] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [searchSkill, setSearchSkill] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/partners/get-all-partners")
      .then((response) => {
        console.log("Partner data:", response.data);
        setPartners(response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching partners:", error);
        setError("Failed to fetch partner list.");
      });
  }, []);

  const handleCreateLinkClick = (partnerEmail) => {
    setSelectedPartner(partnerEmail); // Set the selected partner's email
  };

  const handleSearchChange = (e) => {
    setSearchSkill(e.target.value);
  };

  const filteredPartners = partners.filter((partner) =>
    partner.skills.toLowerCase().includes(searchSkill.toLowerCase())
  );

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (selectedPartner) {
    const selectedPartnerData = partners.find(partner => partner.email === selectedPartner);
    return (
      <CreateLink
        partnerEmail={selectedPartner} // Pass the selected partner's email
        partnerSkills={selectedPartnerData?.skills} // Pass the selected partner's skills
        onBack={() => setSelectedPartner(null)} // Allow navigating back to the partner list
      />
    );
  }

  if (partners.length === 0) {
    return <div className="loading">Loading partner list...</div>;
  }

  return (
    <div className="partner-list-container">
      <h2>Find Partners</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by skill..."
          value={searchSkill}
          onChange={handleSearchChange}
        />
      </div>
      <div className="partner-cards">
        {filteredPartners.map((partner, index) => (
          <div className="partner-card" key={index}>
            <div className="partner-image-container">
              <img
                src={`assets/img/${partner.gender === "Female" ? "femaleuser.png" : "maleuser.png"}`}
                alt="Partner"
                className="partner-image"
              />
            </div>
            <div className="partner-details">
              <p><strong>{partner.fullName || "Profile Not Updated"}</strong></p>
              <p>Email: {partner.email}</p>
              <p>Skills: {partner.skills || "Not specified"}</p>
              <p>Location: {partner.location || "Not specified"}</p>
              <p>Mobile: {partner.mobile || "Not provided"}</p>

              <button
                className="create-link-button"
                onClick={() => handleCreateLinkClick(partner.email)}
              >
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerList;