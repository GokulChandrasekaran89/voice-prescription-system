package com.voiceprescription.backend.controller;

import com.voiceprescription.backend.model.Admin;
import com.voiceprescription.backend.model.Doctor;
import com.voiceprescription.backend.model.Patient;
import com.voiceprescription.backend.repository.AdminRepository;
import com.voiceprescription.backend.repository.DoctorRepository;
import com.voiceprescription.backend.repository.PatientRepository;
import com.voiceprescription.backend.security.jwt.JwtUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private DoctorRepository doctorRepo;

    @Autowired
    private PatientRepository patientRepo;

    @Autowired
    private AdminRepository adminRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;
    @PostMapping("/login")
    public String login(@RequestBody Admin request) {

        Optional<Admin> adminOptional =
                adminRepo.findByEmail(request.getEmail());

        if (adminOptional.isEmpty()) {
            throw new RuntimeException("Admin not found");
        }

        Admin admin = adminOptional.get();

        if (!passwordEncoder.matches(
                request.getPassword(),
                admin.getPassword())) {

            throw new RuntimeException("Invalid password");
        }

        return jwtUtils.generateJwtToken(admin.getEmail());
    }
    @PostMapping("/create-doctor")
    public Doctor createDoctor(@RequestBody Doctor doctor) {

        doctor.setPassword(
                passwordEncoder.encode(doctor.getPassword()));

        return doctorRepo.save(doctor);
    }
    @PutMapping("/update-doctor/{id}")
    public Doctor updateDoctor(@PathVariable Long id,
                               @RequestBody Doctor updatedDoctor) {

        Doctor doctor = doctorRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        doctor.setName(updatedDoctor.getName());
        doctor.setEmail(updatedDoctor.getEmail());
        doctor.setSpecialization(updatedDoctor.getSpecialization());

        return doctorRepo.save(doctor);
    }

    /* =====================================================
       DELETE DOCTOR
       ===================================================== */
    @DeleteMapping("/delete-doctor/{id}")
    public String deleteDoctor(@PathVariable Long id) {

        if (!doctorRepo.existsById(id)) {
            throw new RuntimeException("Doctor not found");
        }

        doctorRepo.deleteById(id);

        return "Doctor deleted successfully";
    }

    /* =====================================================
       CREATE PATIENT (Assign Doctor)
       ===================================================== */
    @PostMapping("/create-patient/{doctorId}")
    public Patient createPatient(@PathVariable Long doctorId,
                                 @RequestBody Patient patient) {

        Doctor doctor = doctorRepo.findById(doctorId)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        patient.setDoctor(doctor);

        return patientRepo.save(patient);
    }

    /* =====================================================
       GET ALL DOCTORS
       ===================================================== */
    @GetMapping("/doctors")
    public List<Doctor> getAllDoctors() {
        return doctorRepo.findAll();
    }

    /* =====================================================
       GET ALL PATIENTS
       ===================================================== */
    @GetMapping("/patients")
    public List<Patient> getAllPatients() {
        return patientRepo.findAll();
    }

    /* =====================================================
       GET PATIENTS BY DOCTOR
       ===================================================== */
    @GetMapping("/doctor/{doctorId}/patients")
    public List<Patient> getPatientsByDoctor(
            @PathVariable Long doctorId) {

        Doctor doctor = doctorRepo.findById(doctorId)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        return patientRepo.findByDoctor(doctor);
    }

    /* =====================================================
       UPDATE PATIENT
       ===================================================== */
    @PutMapping("/patient/{id}")
    public Patient updatePatient(@PathVariable Long id,
                                 @RequestBody Patient updatedPatient) {

        Patient patient = patientRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        patient.setName(updatedPatient.getName());
        patient.setAge(updatedPatient.getAge());
        patient.setGender(updatedPatient.getGender());
        patient.setPhone(updatedPatient.getPhone());
        patient.setEmail(updatedPatient.getEmail());
        patient.setAddress(updatedPatient.getAddress());
        patient.setBloodGroup(updatedPatient.getBloodGroup());
        patient.setTemperature(updatedPatient.getTemperature());
        patient.setPressure(updatedPatient.getPressure());
        patient.setSymptoms(updatedPatient.getSymptoms());

        // Optional: change doctor if provided
        if (updatedPatient.getDoctor() != null) {
            Doctor doctor = doctorRepo.findById(
                            updatedPatient.getDoctor().getId())
                    .orElseThrow(() ->
                            new RuntimeException("Doctor not found"));
            patient.setDoctor(doctor);
        }

        return patientRepo.save(patient);
    }

    /* =====================================================
       DELETE PATIENT
       ===================================================== */
    @DeleteMapping("/patient/{id}")
    public String deletePatient(@PathVariable Long id) {

        if (!patientRepo.existsById(id)) {
            throw new RuntimeException("Patient not found");
        }

        patientRepo.deleteById(id);

        return "Patient deleted successfully";
    }
}