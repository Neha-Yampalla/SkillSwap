import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const EditUserProfile = () => {
    const [profile, setProfile] = useState({
        userName: "",
        mobileNo: "",
        skills: "",
        gender: "",
        age: "",
        address: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    // Fetch the existing profile on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/user/profile");
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                } else {
                    setError("Failed to fetch profile.");
                }
            } catch (err) {
                setError("An error occurred while fetching the profile.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Handle input field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch("http://localhost:8080/api/user/edit-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(profile),
            });

            if (response.ok) {
                alert('Profile updated successfully');
                navigate('/user-dashboard');
            } else {
                setError("Failed to update profile");
            }
        } catch (err) {
            setError("An error occurred while updating the profile.");
            console.error(err);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="edit-profile-container">
            <h2>Update Your Profile</h2>
            {successMessage && <div className="success">{successMessage}</div>}
            <form onSubmit={handleSubmit} className="edit-profile-form">
                <div className="form-group">
                    <label htmlFor="userName">Name:</label>
                    <input
                        type="text"
                        id="userName"
                        name="userName"
                        value={profile.userName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="mobileNo">Mobile Number:</label>
                    <input
                        type="tel"
                        id="mobileNo"
                        name="mobileNo"
                        value={profile.mobileNo}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="skills">Skills:</label>
                    <input
                        type="text"
                        id="skills"
                        name="skills"
                        value={profile.skills}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="gender">Gender:</label>
                    <input
                        type="text"
                        id="gender"
                        name="gender"
                        value={profile.gender}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="age">Age:</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={profile.age}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <textarea
                        id="address"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Save Changes</button>
            </form>
        </div>
    );
};

export default EditUserProfile;