import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./prescription.css";

function Prescription() {

  const { state } = useLocation();
  const navigate = useNavigate();

  const patient = state?.patient;

  const doctor = (() => {
    try {
      const stored = localStorage.getItem("doctor");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const [disease, setDisease] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "", duration: "" }
  ]);

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const activeFieldRef = useRef(null);

  /* =========================
     FORM VALIDATION
  ========================= */
  const isFormValid = () => {

    if (!disease.trim()) {
      alert("Please enter disease name.");
      return false;
    }

    const hasCompleteMedicine = medicines.some(m =>
      m.name.trim() &&
      m.dosage.trim() &&
      m.frequency.trim() &&
      m.duration.trim()
    );

    if (!hasCompleteMedicine) {
      alert("Please fill at least one complete medicine.");
      return false;
    }

    for (let m of medicines) {

      const anyFieldFilled =
        m.name.trim() ||
        m.dosage.trim() ||
        m.frequency.trim() ||
        m.duration.trim();

      const allFieldsFilled =
        m.name.trim() &&
        m.dosage.trim() &&
        m.frequency.trim() &&
        m.duration.trim();

      if (anyFieldFilled && !allFieldsFilled) {
        alert("Please complete all medicine fields.");
        return false;
      }
    }

    return true;
  };

  /* =========================
     VOICE RECOGNITION
  ========================= */
  const startVoice = (index, field) => {

    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;

      if (activeFieldRef.current?.type === "disease") {
        setDisease(prev => (prev + " " + transcript).trim());
      } else {
        const { rowIndex, fieldName } = activeFieldRef.current;
        const updated = [...medicines];
        updated[rowIndex][fieldName] =
          (updated[rowIndex][fieldName] + " " + transcript).trim();
        setMedicines(updated);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;

    activeFieldRef.current =
      field === "disease"
        ? { type: "disease" }
        : { type: "medicine", rowIndex: index, fieldName: field };

    setListening(true);
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  /* =========================
     MEDICINE LOGIC
  ========================= */
  const addMedicineRow = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", frequency: "", duration: "" }
    ]);
  };

  const deleteMedicineRow = (index) => {
    const updated = medicines.filter((_, i) => i !== index);
    setMedicines(
      updated.length
        ? updated
        : [{ name: "", dosage: "", frequency: "", duration: "" }]
    );
  };

  const handleChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  /* =========================
     PDF GENERATION
  ========================= */
  const generatePDF = () => {

    if (!patient) return;
    if (!isFormValid()) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("VOICE PRESCRIPTION SYSTEM", 20, 20);

    doc.setFontSize(12);

    doc.text(
      `Doctor: Dr. ${doctor?.name || "N/A"} ${
        doctor?.specialization ? "(" + doctor.specialization + ")" : ""
      }`,
      20,
      35
    );

    doc.text(`Patient Name: ${patient.name}`, 20, 50);
    doc.text(`Age: ${patient.age}`, 20, 60);
    doc.text(`Gender: ${patient.gender}`, 20, 70);
    doc.text(`Phone: ${patient.phone}`, 20, 80);

    doc.line(20, 85, 190, 85);

    doc.text(`Disease: ${disease}`, 20, 100);

    autoTable(doc, {
      startY: 110,
      head: [["Medicine", "Dosage", "Frequency", "Duration"]],
      body: medicines
        .filter(m =>
          m.name.trim() &&
          m.dosage.trim() &&
          m.frequency.trim() &&
          m.duration.trim()
        )
        .map(m => [
          m.name,
          m.dosage,
          m.frequency,
          m.duration
        ])
    });

    const finalY = doc.lastAutoTable.finalY || 160;

    if (doctor?.signature) {
      try {
        const format = doctor.signature.includes("png") ? "PNG" : "JPEG";

        doc.addImage(
          doctor.signature,
          format,
          130,
          finalY + 20,
          50,
          25
        );
      } catch (err) {
        console.error("Signature render failed:", err);
      }
    }

    doc.text(`Dr. ${doctor?.name || ""}`, 140, finalY + 50);

    doc.text(
      `Date: ${new Date().toLocaleDateString()}`,
      20,
      280
    );

    doc.save(`Prescription_${patient.name}.pdf`);
  };

  /* =========================
     NO PATIENT CASE
  ========================= */
  if (!patient) {
    return (
      <div style={{ padding: "40px" }}>
        <h3>No patient selected</h3>
        <button onClick={() => navigate("/dashboard")}>
          Go Back
        </button>
      </div>
    );
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="prescription-page">

      <h2>📝 Prescription</h2>

      <div className="patient-card">
        <p><b>Name:</b> {patient.name}</p>
        <p><b>Age:</b> {patient.age}</p>
        <p><b>Gender:</b> {patient.gender}</p>
        <p><b>Phone:</b> {patient.phone}</p>
        <p><b>Doctor:</b> Dr. {doctor?.name}</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Disease Name"
          value={disease}
          onChange={(e) => setDisease(e.target.value)}
        />

        {!listening ? (
          <button onClick={() => startVoice(null, "disease")}>
            🎤 Start
          </button>
        ) : (
          <button onClick={stopVoice}>
            ⏹ Stop
          </button>
        )}
      </div>

      <table className="medicine-table">
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Dosage</th>
            <th>Frequency</th>
            <th>Duration</th>
            <th>Voice</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {medicines.map((med, index) => (
            <tr key={index}>
              <td>
                <input
                  value={med.name}
                  onChange={(e) =>
                    handleChange(index, "name", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  value={med.dosage}
                  onChange={(e) =>
                    handleChange(index, "dosage", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  value={med.frequency}
                  onChange={(e) =>
                    handleChange(index, "frequency", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  value={med.duration}
                  onChange={(e) =>
                    handleChange(index, "duration", e.target.value)
                  }
                />
              </td>
              <td>
                {!listening ? (
                  <button onClick={() => startVoice(index, "name")}>
                    🎤
                  </button>
                ) : (
                  <button onClick={stopVoice}>⏹</button>
                )}
              </td>
              <td>
                <button onClick={() => deleteMedicineRow(index)}>
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button onClick={addMedicineRow}>
          ➕ Add Medicine
        </button>

        <button
          onClick={generatePDF}
          style={{ marginLeft: "15px" }}
        >
          📄 Generate PDF
        </button>
      </div>

    </div>
  );
}

export default Prescription;