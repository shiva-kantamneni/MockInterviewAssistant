import React from "react";
import "./styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const user = {
    name: "Shivaram",
    email: "shivaram@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
  };
  const navigate = useNavigate();
  const handleStart=()=>{
    navigate('/interview');
  }

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div>
          <h2>Welcome, {user.name} 👋</h2>
          <p>Ready to ace your next interview?</p>
        </div>
        <img className="avatar" src={user.avatar} alt="User Avatar" />
      </div>

      {/* Main Cards */}
      <div className="cards-section">
        {/* Quick Start */}
       


        <div className="card">
          <h3>🎯 Quick Start</h3>
          <p>Start a mock interview </p>
          <button className="start-btn" onClick={handleStart}>Start Interview</button>
        </div>

        {/* Interview History */}
        <div className="card">
          <h3>🕓 Interview History</h3>
          <ul>
            <li>Frontend (May 30) - 78%</li>
            <li>React (May 27) - 85%</li>
            <li>JavaScript (May 25) - 66%</li>
          </ul>
          <a href="#" className="view-all">View All</a>
        </div>

        {/* User Profile */}
        <div className="card">
          <h3>👤 Your Profile</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <button className="edit-btn">Edit Profile</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
