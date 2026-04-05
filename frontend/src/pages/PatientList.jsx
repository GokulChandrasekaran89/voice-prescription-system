import { useEffect, useState } from "react";
import axios from "axios";

function PatientList() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:8080/api/patients", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setPatients(res.data);
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to load patients");
    });
  }, []);

  return (
    <div>
      <h2>Patient List</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Blood Group</th>
            <th>Temperature</th>
            <th>Created At</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.age}</td>
              <td>{p.gender}</td>
              <td>{p.phone}</td>
              <td>{p.email}</td>
              <td>{p.address}</td>
              <td>{p.bloodGroup}</td>
              <td>{p.temperature}</td>
              <td>{p.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PatientList;
