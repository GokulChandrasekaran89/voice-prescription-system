import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./admin.css";

function CreatePatient() {

  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    bloodGroup: "",
    temperature: "",
    pressure: ""
  });

  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ================= LOAD DOCTORS ================= */
  useEffect(() => {
    axios.get("http://localhost:8080/api/admin/doctors", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setDoctors(res.data));
  }, []);

  /* ================= SMART VOICE ================= */
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript.toLowerCase();
      }

      console.log("Voice:", transcript);

      parseVoiceInput(transcript);
      detectDoctorFromVoice(transcript);

      // Save command
      if (
        transcript.includes("save patient") ||
        transcript.includes("submit") ||
        transcript.includes("create patient")
      ) {
        recognition.stop();
        handleSubmit();
      }
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;

  }, [doctors, doctorId, patient]);

  /* ================= PARSE PATIENT DATA ================= */
  const parseVoiceInput = (text) => {

    const updated = { ...patient };

    if (text.includes("name")) {
      updated.name = text.split("name")[1]?.split("age")[0]?.trim() || updated.name;
    }

    if (text.includes("age")) {
      const match = text.match(/age\s(\d+)/);
      if (match) updated.age = match[1];
    }

    if (text.includes("male")) updated.gender = "Male";
    if (text.includes("female")) updated.gender = "Female";

    if (text.includes("phone")) {
      const match = text.match(/phone\s(\d+)/);
      if (match) updated.phone = match[1];
    }

    if (text.includes("address")) {
      updated.address = text.split("address")[1]?.trim() || updated.address;
    }

    if (text.includes("blood")) {
      updated.bloodGroup = text.split("blood group")[1]?.trim() || updated.bloodGroup;
    }

    if (text.includes("temperature")) {
      const match = text.match(/temperature\s(\d+)/);
      if (match) updated.temperature = match[1];
    }

    if (text.includes("pressure")) {
      const match = text.match(/pressure\s(\d+)\s?over\s?(\d+)/);
      if (match) updated.pressure = `${match[1]}/${match[2]}`;
    }

    setPatient(updated);
  };

  /* ================= DOCTOR VOICE DETECTION ================= */
  const detectDoctorFromVoice = (text) => {

    if (!text.includes("doctor")) return;

    doctors.forEach(doc => {
      const doctorName = doc.name.toLowerCase();

      if (text.includes(doctorName)) {
        setDoctorId(doc.id);
        console.log("Doctor assigned:", doc.name);
      }
    });
  };

  /* ================= START / STOP ================= */
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition not supported");
      return;
    }

    if (!listening) {
      recognitionRef.current.start();
      setListening(true);
    } else {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {

    if (!doctorId) {
      alert("Please assign doctor");
      return;
    }

    await axios.post(
      `http://localhost:8080/api/admin/create-patient/${doctorId}`,
      patient,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("✅ Patient Created Successfully");
    navigate("/admin/patients");
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

        <h2>🎤 Smart Voice Create Patient</h2>

        <button
          className={`voice-btn ${listening ? "listening" : ""}`}
          onClick={toggleListening}
          style={{ marginBottom: "20px" }}
        >
          {listening ? "🔴 Stop Listening" : "🎙 Start Voice Input"}
        </button>

        <div className="admin-form">

          <select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            required
          >
            <option value="">Assign Doctor</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>

          {Object.keys(patient).map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field}
              value={patient[field]}
              onChange={(e) =>
                setPatient({ ...patient, [field]: e.target.value })
              }
            />
          ))}

          <button
            type="button"
            className="primary-btn"
            style={{ marginTop: "15px" }}
            onClick={handleSubmit}
          >
            Save Patient
          </button>

        </div>

      </div>
    </div>
  );
}

export default CreatePatient;