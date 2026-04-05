import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    // ==========================
    // 1️⃣ TRY ADMIN LOGIN FIRST
    // ==========================
    try {
      const adminRes = await axios.post(
        "http://localhost:8080/api/admin/login",
        { email, password }
      );

      console.log("Admin login success:", adminRes.data);

      // Save token properly
      localStorage.setItem("token", adminRes.data.token || adminRes.data);
      localStorage.setItem("role", "ADMIN");

      setLoading(false);
      navigate("/admin-dashboard");
      return;

    } catch (adminError) {
      console.log("Admin login failed:", adminError.response?.data);
    }

    // ==========================
    // 2️⃣ TRY DOCTOR LOGIN
    // ==========================
    try {
      const doctorRes = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password }
      );

      console.log("Doctor login success:", doctorRes.data);

      localStorage.setItem("token", doctorRes.data.token);
      localStorage.setItem("doctor", JSON.stringify(doctorRes.data.doctor));
      localStorage.setItem("role", "DOCTOR");

      setLoading(false);
      navigate("/dashboard");

    } catch (doctorError) {
      console.log("Doctor login failed:", doctorError.response?.data);
      setLoading(false);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">🩺 Voice Prescription System</h1>
        <p className="login-subtitle">
          Dictate prescriptions using your voice
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          className="login-input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        <button
          onClick={handleLogin}
          className="login-button"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

export default Login;