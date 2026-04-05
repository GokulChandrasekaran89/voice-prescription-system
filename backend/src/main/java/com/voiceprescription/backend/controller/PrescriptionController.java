package com.voiceprescription.backend.controller;

import com.voiceprescription.backend.model.*;
import com.voiceprescription.backend.dto.PrescriptionRequest;
import com.voiceprescription.backend.repository.*;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionController {

    private final PrescriptionRepository prescriptionRepo;
    private final DoctorRepository doctorRepo;
    private final PatientRepository patientRepo;

    public PrescriptionController(
            PrescriptionRepository prescriptionRepo,
            DoctorRepository doctorRepo,
            PatientRepository patientRepo
    ) {
        this.prescriptionRepo = prescriptionRepo;
        this.doctorRepo = doctorRepo;
        this.patientRepo = patientRepo;
    }

    @PostMapping
    public ResponseEntity<?> createPrescription(
            @RequestBody PrescriptionRequest request,
            @AuthenticationPrincipal UserDetails user) {

        Doctor doctor = doctorRepo
                .findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Patient patient = patientRepo
                .findByPhoneAndDoctor(request.getPhone(), doctor)
                .orElseGet(() -> {
                    Patient p = new Patient();
                    p.setName(request.getPatientName());
                    p.setPhone(request.getPhone());
                    p.setEmail(request.getEmail());
                    p.setAge(request.getAge());
                    p.setBloodGroup(request.getBloodGroup());
                    p.setTemperature(request.getTemperature());
                    p.setDoctor(doctor);
                    return patientRepo.save(p);
                });

        Prescription prescription = new Prescription();
        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setDiagnosis(request.getDiagnosis());
        prescription.setMedicines(request.getMedicines());

        prescriptionRepo.save(prescription);

        return ResponseEntity.ok("Prescription saved successfully");
    }

    @GetMapping
    public List<Prescription> getMyPrescriptions(
            @AuthenticationPrincipal UserDetails user) {

        Doctor doctor = doctorRepo
                .findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return prescriptionRepo.findByDoctor(doctor);
    }
}