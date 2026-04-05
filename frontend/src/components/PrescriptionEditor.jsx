import { useState } from "react";
import axios from "axios";

function PrescriptionForm({ dictatedText }) {
  const [patientName, setPatientName] = useState("");
  const [content, setContent] = useState("");

  const doctor = JSON.parse(localStorage.getItem("doctor"));
  const token = localStorage.getItem("token");

  const savePrescription = async () => {
 
    await axios.post(
      "http://localhost:8080/api/prescriptions",
      {
        patientName,
        content: dictatedText || content,
        doctorId: doctor.id
      },
      { 
        headers: {  
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Prescription saved");
  };

  return (
    <div>
      <h3>📝 Prescription</h3>

      <input
        placeholder="Patient Name"
        onChange={e => setPatientName(e.target.value)}
      />

      <br /><br />

      <textarea
        rows="5"
        cols="60"
        value={dictatedText || content}
        onChange={e => setContent(e.target.value)}
      />

      <br /><br />

      <button onClick={savePrescription}>
        Save Prescription
      </button>
    </div>
  );
}

export default PrescriptionForm;
