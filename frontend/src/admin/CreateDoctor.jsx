import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./admin.css";

function CreateDoctor() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
  });

  const [listeningField, setListeningField] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("adminTheme") === "dark"
  );

  const recognitionRef = useRef(null);
  const commandRecognitionRef = useRef(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ================= SAVE THEME ================= */
  useEffect(() => {
    localStorage.setItem("adminTheme", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* ================= EMAIL FORMAT ================= */
  const formatEmailVoice = (text) => {
    return text
      .toLowerCase()
      .replace(/\s+at\s+/g, "@")
      .replace(/\s+dot\s+/g, ".")
      .replace(/\s+underscore\s+/g, "_")
      .replace(/\s+/g, "");
  };

  /* ================= FIELD VOICE ================= */
  const toggleVoice = (field) => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    if (listeningField === field) {
      recognitionRef.current?.stop();
      setListeningField(null);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;

      if (field === "email") {
        setForm(prev => ({
          ...prev,
          email: formatEmailVoice(transcript)
        }));
      } else {
        setForm(prev => ({
          ...prev,
          [field]: prev[field] + " " + transcript
        }));
      }
    };

    recognition.onend = () => setListeningField(null);

    recognition.start();
    recognitionRef.current = recognition;
    setListeningField(field);
  };

  /* ================= GLOBAL VOICE COMMAND ================= */
  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const speech =
        event.results[event.results.length - 1][0].transcript.toLowerCase();

      if (
        speech.includes("save doctor") ||
        speech.includes("submit doctor") ||
        speech.includes("create doctor")
      ) {
        handleSubmit();
      }
    };

    recognition.start();
    commandRecognitionRef.current = recognition;

    return () => recognition.stop();

  }, [form]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {

    if (!form.name || !form.email || !form.password || !form.specialization) {
      alert("Please fill all fields before saving.");
      return;
    }

    await axios.post(
      "http://localhost:8080/api/admin/create-doctor",
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Doctor Created Successfully!");
    navigate("/admin/doctors");
  };

  return (
    <div className={`admin-layout ${darkMode ? "dark" : ""}`}>

      <div className="admin-sidebar">
        <h2>🏥 Admin Panel</h2>
        <button onClick={() => navigate("/admin-dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/admin/doctors")}>Doctors</button>
        <button onClick={() => navigate("/admin/patients")}>Patients</button>

        <div className="theme-toggle">
          🌙 Dark Mode
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </div>
      </div>

      <div className="admin-content">
        <h2>Create Doctor 👨‍⚕️</h2>

        <div className="admin-form">

          {/* NAME */}
          <div className="floating-row">
            <div className="floating-input">
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />
              <label>Doctor Name</label>
            </div>
            <button
              type="button"
              className={`mic-btn ${listeningField === "name" ? "listening" : ""}`}
              onClick={() => toggleVoice("name")}
            >
              🎤
            </button>
          </div>

          {/* EMAIL */}
          <div className="floating-row">
            <div className="floating-input">
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
              <label>Email</label>
            </div>
            <button
              type="button"
              className={`mic-btn ${listeningField === "email" ? "listening" : ""}`}
              onClick={() => toggleVoice("email")}
            >
              🎤
            </button>
          </div>

          {/* PASSWORD */}
          <div className="floating-row">
            <div className="floating-input">
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
              <label>Password</label>
            </div>
          </div>

          {/* SPECIALIZATION */}
          <div className="floating-row">
            <div className="floating-input">
              <input
                value={form.specialization}
                onChange={(e) =>
                  setForm({ ...form, specialization: e.target.value })
                }
                required
              />
              <label>Specialization</label>
            </div>
            <button
              type="button"
              className={`mic-btn ${listeningField === "specialization" ? "listening" : ""}`}
              onClick={() => toggleVoice("specialization")}
            >
              🎤
            </button>
          </div>

          <button className="primary-btn" onClick={handleSubmit}>
            Save Doctor
          </button>

        </div>
      </div>
    </div>
  );
}

export default CreateDoctor;