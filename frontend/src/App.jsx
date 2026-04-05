import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ================= DOCTOR IMPORTS ================= */
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrescriptionForm from "./pages/PrescriptionForm";
import PatientList from "./pages/PatientList";
import AddPatientByVoice from "./components/AddPatientByVoice";

/* ================= ADMIN IMPORTS ================= */
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import DoctorList from "./admin/DoctorList";
import CreateDoctor from "./admin/CreateDoctor";
import EditDoctor from "./admin/EditDoctor";   // ✅ ADD THIS
import AdminPatientList from "./admin/PatientList";
import CreatePatient from "./admin/CreatePatient";
import EditPatient from "./admin/EditPatient";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= DOCTOR ROUTES ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-patient-voice" element={<AddPatientByVoice />} />
        <Route path="/prescription/new" element={<PrescriptionForm />} />
        <Route path="/patients" element={<PatientList />} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Doctor Management */}
        <Route path="/admin/doctors" element={<DoctorList />} />
        <Route path="/admin/doctors/create" element={<CreateDoctor />} />
        <Route path="/admin/doctors/edit/:id" element={<EditDoctor />} />  {/* ✅ FIX */}

        {/* Patient Management */}
        <Route path="/admin/patients" element={<AdminPatientList />} />
        <Route path="/admin/patients/create" element={<CreatePatient />} />
        <Route path="/admin/patients/edit/:id" element={<EditPatient />} />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;