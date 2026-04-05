import React from "react";
import "./Analytics.css";

const DoctorAnalytics = () => {
  return (
    <div className="dashboard">
      <h2>Doctor Analytics</h2>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Patients</h3>
          <p>120</p>
        </div>

        <div className="stat-card">
          <h3>Prescriptions Today</h3>
          <p>18</p>
        </div>

        <div className="stat-card">
          <h3>Pending Reviews</h3>
          <p>4</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorAnalytics;
