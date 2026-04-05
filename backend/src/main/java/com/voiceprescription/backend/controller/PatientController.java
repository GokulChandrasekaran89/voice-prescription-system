package com.voiceprescription.backend.controller;

import com.voiceprescription.backend.model.Patient;
import com.voiceprescription.backend.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {

    @Autowired
    private PatientService patientService;

    // CREATE PATIENT
    @PostMapping("/{doctorId}")
    public Patient createPatient(@RequestBody Patient patient,
                                 @PathVariable Long doctorId) {
        return patientService.savePatient(patient, doctorId);
    }

    // GET PATIENTS BY DOCTOR
    @GetMapping("/doctor/{doctorId}")
    public List<Patient> getPatientsByDoctor(@PathVariable Long doctorId) {
        return patientService.getPatientsByDoctor(doctorId);
    }
}