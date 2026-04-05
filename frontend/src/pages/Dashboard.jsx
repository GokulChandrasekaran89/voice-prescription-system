import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./dashboard.css";
import Analytics from "./Analytics";

function Dashboard() {
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  /* ==============================
     FETCH DOCTOR INFO
  ============================== */
  const fetchDoctor = async () => {
    try {
      if (!token) {
        navigate("/");
        return;
      }

      const res = await axios.get(
        "http://localhost:8080/api/doctor/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDoctor(res.data);

      // ✅ Save doctor for Prescription page fallback
      localStorage.setItem("doctor", JSON.stringify(res.data));

    } catch (error) {
      console.error("Doctor fetch error:", error);

      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/");
      }
    }
  };

  /* ==============================
     FETCH DOCTOR'S PATIENTS
  ============================== */
  const fetchPatients = async () => {
    try {
      if (!token) return;

      const res = await axios.get(
        "http://localhost:8080/api/doctor/patients",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPatients(res.data || []);
    } catch (error) {
      console.error("Patient fetch error:", error);
      setPatients([]);
    }
  };

  /* ==============================
     LOAD ON PAGE OPEN
  ============================== */
  useEffect(() => {
    fetchDoctor();
    fetchPatients();
  }, []);

  /* ==============================
     REFRESH WHEN RETURNING
  ============================== */
  useEffect(() => {
    fetchPatients();
  }, [location.pathname]);

  /* ==============================
     SEARCH FILTER
  ============================== */
  const filteredPatients = patients.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search)
  );

  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>🩺 V-Prescription</h2>

        <nav>
          <button className="nav-btn">🏠 Home</button>

          <button
            className="nav-btn"
            onClick={() => navigate("/add-patient-voice")}
          >
            🎤 Add Patient
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            🚪 Logout
          </button>

          <label className="dark-toggle">
            🌙 Dark Mode
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          </label>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="content">
        
        {/* TOP BAR */}
        <div className="topbar">
          <span>Dashboard</span>
          <span>👨‍⚕️ {doctor?.name || "Doctor"}</span>
        </div>

        {/* HEADER CARD */}
        {doctor && (
          <div className="header-card">
            <h2>👨‍⚕️ Dr. {doctor.name}</h2>
            <p>{doctor.specialization}</p>
          </div>
        )}

        {/* SEARCH */}
        <input
          className="search-box"
          type="text"
          placeholder="🔍 Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABLE */}
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Blood</th>
              <th>Temp</th>
              <th>Pressure</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.age}</td>
                  <td>{p.gender}</td>
                  <td>{p.phone}</td>
                  <td>{p.bloodGroup}</td>
                  <td>{p.temperature}</td>
                  <td>{p.pressure || "—"}</td>
                  <td>
                    <button
                      className="prescription-btn"
                      onClick={() =>
                        navigate("/prescription/new", {
                          state: { patient: p, doctor }, // ✅ PASS DOCTOR
                        })
                      }
                    >
                      📝 Prescription
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </main>
    </div>
  );
}

export default Dashboard;