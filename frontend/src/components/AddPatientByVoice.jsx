import React, { useEffect, useRef, useState } from "react";
import "./addPatientVoice.css";

const AddPatientByVoice = () => {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);

  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    bloodGroup: "",
    temperature: "",
    pressure: "", // ✅ NEW FIELD
  });

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript
          .toLowerCase()
          .trim();

      console.log("Voice:", transcript);
      parseVoiceInput(transcript);
    };

    recognition.onerror = (e) => {
      console.error("Speech error", e);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    if (!listening) {
      recognitionRef.current.start();
      setListening(true);
    } else {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const parseVoiceInput = (text) => {
    if (text.includes("name")) {
      setPatient((p) => ({ ...p, name: text.replace("name", "").trim() }));

    } else if (text.includes("age")) {
      setPatient((p) => ({ ...p, age: text.replace(/\D/g, "") }));

    } else if (text.includes("gender")) {
      setPatient((p) => ({ ...p, gender: text.replace("gender", "").trim() }));

    } else if (text.includes("phone")) {
      setPatient((p) => ({ ...p, phone: text.replace(/\D/g, "") }));

    } else if (text.includes("email")) {
      setPatient((p) => ({
        ...p,
        email: text.replace("email", "").replace(/\s/g, ""),
      }));

    } else if (text.includes("address")) {
      setPatient((p) => ({
        ...p,
        address: text.replace("address", "").trim(),
      }));

    } else if (text.includes("blood")) {
      setPatient((p) => ({
        ...p,
        bloodGroup: text.replace("blood group", "").toUpperCase().trim(),
      }));

    } else if (text.includes("temperature")) {
      setPatient((p) => ({
        ...p,
        temperature: text.replace(/\D/g, ""),
      }));

    }
    // ✅ PRESSURE VOICE SUPPORT
    else if (text.includes("pressure")) {

      let value = text.replace("pressure", "").trim();

      // Convert "120 over 80" → "120/80"
      value = value.replace("over", "/");
      value = value.replace("slash", "/");

      // Remove unwanted characters except numbers and /
      value = value.replace(/[^0-9/]/g, "");

      setPatient((p) => ({
        ...p,
        pressure: value,
      }));
    }
  };

  const savePatient = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("❌ Please login again");
        return;
      }

      const res = await fetch("http://localhost:8080/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patient),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      alert("✅ Patient saved successfully");

      // Reset form
      setPatient({
        name: "",
        age: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        bloodGroup: "",
        temperature: "",
        pressure: "", // ✅ RESET
      });

    } catch (err) {
      console.error(err);
      alert("❌ Failed to save patient");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>🎙️ Add Patient by Voice</h2>

      <button onClick={toggleListening}>
        {listening ? "🛑 Stop Listening" : "▶ Start Listening"}
      </button>

      <p style={{ color: listening ? "green" : "red" }}>
        Listening: {listening ? "ON" : "OFF"}
      </p>

      <div className="form-grid">
        <input
          placeholder="Name"
          value={patient.name}
          onChange={(e) =>
            setPatient({ ...patient, name: e.target.value })
          }
        />

        <input
          placeholder="Age"
          value={patient.age}
          onChange={(e) =>
            setPatient({ ...patient, age: e.target.value })
          }
        />

        <input
          placeholder="Gender"
          value={patient.gender}
          onChange={(e) =>
            setPatient({ ...patient, gender: e.target.value })
          }
        />

        <input
          placeholder="Phone"
          value={patient.phone}
          onChange={(e) =>
            setPatient({ ...patient, phone: e.target.value })
          }
        />

        <input
          placeholder="Email"
          value={patient.email}
          onChange={(e) =>
            setPatient({ ...patient, email: e.target.value })
          }
        />

        <input
          placeholder="Address"
          value={patient.address}
          onChange={(e) =>
            setPatient({ ...patient, address: e.target.value })
          }
        />

        <input
          placeholder="Blood Group"
          value={patient.bloodGroup}
          onChange={(e) =>
            setPatient({ ...patient, bloodGroup: e.target.value })
          }
        />

        <input
          placeholder="Temperature"
          value={patient.temperature}
          onChange={(e) =>
            setPatient({ ...patient, temperature: e.target.value })
          }
        />

        {/* ✅ NEW PRESSURE INPUT */}
        <input
          placeholder="Blood Pressure (e.g. 120/80)"
          value={patient.pressure}
          onChange={(e) =>
            setPatient({ ...patient, pressure: e.target.value })
          }
        />
      </div>

      <br />

      <button
        style={{ background: "green", color: "white", padding: "10px" }}
        onClick={savePatient}
      >
        💾 Save Patient
      </button>
    </div>
  );
};

export default AddPatientByVoice;