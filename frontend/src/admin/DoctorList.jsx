import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./admin.css";

function DoctorList() {

  const [doctors, setDoctors] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const res = await axios.get(
      "http://localhost:8080/api/admin/doctors",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setDoctors(res.data);
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    await axios.delete(
      `http://localhost:8080/api/admin/delete-doctor/${deleteId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setDeleteId(null);
    fetchDoctors();
  };

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <div className="admin-sidebar">
        <h2>🏥 Admin Panel</h2>
        <button onClick={() => navigate("/admin-dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/admin/doctors")}>Doctors</button>
        <button onClick={() => navigate("/admin/patients")}>Patients</button>
      </div>

      {/* CONTENT */}
      <div className="admin-content">

        <div className="page-header">
          <h2>🩺 Doctor Management</h2>
          <button
            className="primary-btn"
            onClick={() => navigate("/admin/doctors/create")}
          >
            ➕ Create Doctor
          </button>
        </div>

        <div className="doctor-grid">
          {doctors.map((doc) => (
            <div key={doc.id} className="doctor-card">

              <div className="doctor-avatar">
                {doc.name.charAt(0).toUpperCase()}
              </div>

              <h3>{doc.name}</h3>
              <p className="doctor-email">{doc.email}</p>
              <p className="doctor-spec">{doc.specialization}</p>

              <div className="card-actions">
                <button
                  className="edit-btn"
                  onClick={() =>
                    navigate(`/admin/doctors/edit/${doc.id}`)
                  }
                >
                  ✏ Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => setDeleteId(doc.id)}
                >
                  🗑 Delete
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* ================= GLASS CONFIRM MODAL ================= */}
{deleteId && (
  <div className="glass-overlay">
    <div className="glass-modal">
      <h3>Delete Doctor?</h3>
      <p>This action cannot be undone.</p>

      <div className="modal-actions">
        <button
          className="cancel-btn"
          onClick={() => setDeleteId(null)}
        >
          Cancel
        </button>

        <button
          className="delete-btn"
          onClick={confirmDelete}
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default DoctorList;