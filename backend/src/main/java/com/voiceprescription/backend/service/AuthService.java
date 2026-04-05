package com.voiceprescription.backend.service;

import com.voiceprescription.backend.model.Doctor;
import com.voiceprescription.backend.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private DoctorRepository doctorRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Register doctor
    public Doctor registerDoctor(Doctor doctor) {

        // Encode password before saving
        doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));

        return doctorRepo.save(doctor);
    }
}