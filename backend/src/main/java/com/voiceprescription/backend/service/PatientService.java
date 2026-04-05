package com.voiceprescription.backend.service;

import com.voiceprescription.backend.model.Patient;
import com.voiceprescription.backend.model.Doctor;
import com.voiceprescription.backend.repository.PatientRepository;
import com.voiceprescription.backend.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    // SAVE PATIENT WITH DOCTOR
    public Patient savePatient(Patient patient, Long doctorId) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        patient.setDoctor(doctor); // 🔥 VERY IMPORTANT

        return patientRepository.save(patient);
    }

    public List<Patient> getPatientsByDoctor(Long doctorId) {
        return patientRepository.findByDoctorId(doctorId);
    }
}