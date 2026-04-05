import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./admin.css";

function AdminPatientList() {

  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const res = await axios.get(
      "http://localhost:8080/api/admin/patients",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPatients(res.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?"))
      return;

    await axios.delete(
      `http://localhost:8080/api/admin/patient/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchPatients();
  };

  return (
    <div className="admin-layout">

      <div className="admin-sidebar">
        <h2>🏥 Admin Panel</h2>
        <button onClick={() => navigate("/admin-dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/admin/doctors")}>Doctors</button>
        <button onClick={() => navigate("/admin/patients")}>Patients</button>
      </div>

      <div className="admin-content">

        <h2>👥 Patient List</h2>

        <button
          className="primary-btn"
          onClick={() => navigate("/admin/patients/create")}
        >
          ➕ Create Patient
        </button>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Doctor</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {patients.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.gender}</td>
                <td>{p.phone}</td>
                <td>{p.doctor?.name}</td>
                <td>
                  <button
                    className="primary-btn"
                    onClick={() =>
                      navigate(`/admin/patients/edit/${p.id}`, {
                        state: { patient: p }
                      })
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="danger-btn"
                    style={{ marginLeft: "8px" }}
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default AdminPatientList;