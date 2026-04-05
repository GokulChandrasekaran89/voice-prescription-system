import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import "./admin.css";

function AdminDashboard() {

  const navigate = useNavigate();

  const [doctorCount, setDoctorCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [chartData, setChartData] = useState([]);

  const token = localStorage.getItem("token");

  /* =========================
     AUTH CHECK
  ========================= */
  useEffect(() => {

    if (!token) {
      window.location.href = "/";
      return;
    }

    fetchAnalytics();

  }, []);

  /* =========================
     FETCH DATA
  ========================= */
  const fetchAnalytics = async () => {
    try {

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const doctorsRes = await axios.get(
        "http://localhost:8080/api/admin/doctors",
        config
      );

      const patientsRes = await axios.get(
        "http://localhost:8080/api/admin/patients",
        config
      );

      setDoctorCount(doctorsRes.data.length);
      setPatientCount(patientsRes.data.length);

      const doctorPatientMap = {};

      patientsRes.data.forEach(p => {
        const doctorName = p.doctor?.name || "Unassigned";
        doctorPatientMap[doctorName] =
          (doctorPatientMap[doctorName] || 0) + 1;
      });

      const formattedData = Object.keys(doctorPatientMap).map(name => ({
        name,
        patients: doctorPatientMap[name]
      }));

      setChartData(formattedData);

    } catch (error) {

      console.error("Analytics error:", error);

      // If token invalid → logout fully
      localStorage.clear();
      window.location.href = "/";
    }
  };

  /* =========================
     LOGOUT (FIXED)
  ========================= */
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <div className="admin-sidebar">
        <h2>🏥 Admin Panel</h2>

        <button onClick={() => navigate("/admin-dashboard")}>
          Dashboard
        </button>

        <button onClick={() => navigate("/admin/doctors")}>
          Doctors
        </button>

        <button onClick={() => navigate("/admin/patients")}>
          Patients
        </button>

        <button
          className="danger-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* CONTENT */}
      <div className="admin-content">

        <h1>📊 Admin Analytics Dashboard</h1>

        <div className="admin-cards">

          <div className="admin-card">
            <h3>Total Doctors</h3>
            <h2>{doctorCount}</h2>
          </div>

          <div className="admin-card">
            <h3>Total Patients</h3>
            <h2>{patientCount}</h2>
          </div>

        </div>

        <div
          style={{
            marginTop: "40px",
            height: "400px",
            background: "white",
            padding: "20px",
            borderRadius: "12px"
          }}
        >
          <h3>Patients Per Doctor</h3>

          <div style={{ width: "100%", height: "320px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="patients" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;