import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./admin.css";

function EditDoctor() {

  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    specialization: ""
  });

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/admin/doctors",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const foundDoctor = res.data.find(d => d.id == id);

      if (foundDoctor) {
        setDoctor(foundDoctor);
      }

    } catch (error) {
      console.error(error);
      navigate("/admin"); // only on real error
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    await axios.put(
      `http://localhost:8080/api/admin/update-doctor/${id}`,
      doctor,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Doctor Updated Successfully");
    navigate("/admin/doctors");
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

        <h2>Edit Doctor</h2>

        <form className="doctor-form" onSubmit={handleUpdate}>

          <input
            value={doctor.name}
            onChange={(e) =>
              setDoctor({ ...doctor, name: e.target.value })
            }
            placeholder="Doctor Name"
            required
          />

          <input
            value={doctor.email}
            onChange={(e) =>
              setDoctor({ ...doctor, email: e.target.value })
            }
            placeholder="Email"
            required
          />

          <input
            value={doctor.specialization}
            onChange={(e) =>
              setDoctor({ ...doctor, specialization: e.target.value })
            }
            placeholder="Specialization"
            required
          />

          <button type="submit" className="primary-btn">
            Update Doctor
          </button>

        </form>

      </div>
    </div>
  );
}

export default EditDoctor;