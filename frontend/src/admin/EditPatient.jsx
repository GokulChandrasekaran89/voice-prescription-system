import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./admin.css";

function EditPatient() {

  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [patient, setPatient] = useState(state?.patient);

  const handleChange = (e) => {
    setPatient({
      ...patient,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {
    await axios.put(
      `http://localhost:8080/api/admin/patient/${id}`,
      patient,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Patient Updated");
    navigate("/admin/patients");
  };

  return (
    <div className="admin-layout">

      <div className="admin-sidebar">
        <h2>🏥 Admin Panel</h2>
      </div>

      <div className="admin-content">

        <h2>Edit Patient</h2>

        <div className="admin-form">

          {Object.keys(patient).map(field =>
            field !== "id" && field !== "doctor" ? (
              <input
                key={field}
                name={field}
                value={patient[field]}
                onChange={handleChange}
              />
            ) : null
          )}

          <button
            className="primary-btn"
            onClick={handleUpdate}
          >
            Update Patient
          </button>

        </div>

      </div>
    </div>
  );
}

export default EditPatient;