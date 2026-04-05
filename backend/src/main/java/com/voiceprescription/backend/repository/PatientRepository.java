package com.voiceprescription.backend.repository;

import com.voiceprescription.backend.model.Patient;
import com.voiceprescription.backend.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByPhoneAndDoctor(String phone, Doctor doctor);

    List<Patient> findByDoctorId(Long doctorId);

    List<Patient> findByDoctor(Doctor doctor);
}