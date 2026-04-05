package com.voiceprescription.backend.controller;
import com.voiceprescription.backend.dto.DoctorResponse;
import com.voiceprescription.backend.model.Doctor;
import com.voiceprescription.backend.model.Patient;
import com.voiceprescription.backend.repository.DoctorRepository;
import com.voiceprescription.backend.repository.PatientRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/doctor")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorController {
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    public DoctorController(DoctorRepository doctorRepository,
                            PatientRepository patientRepository) {
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }
    @GetMapping("/me")
    public DoctorResponse getDoctorProfile(Authentication authentication) {
        String email = authentication.getName();
        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return new DoctorResponse(
                doctor.getId(),
                doctor.getName(),
                doctor.getEmail(),
                doctor.getSpecialization()
        );
    }
    @GetMapping("/patients")
    public List<Patient> getMyPatients(Authentication authentication) {
        String email = authentication.getName();
        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return patientRepository.findByDoctorId(doctor.getId());
    }
}
