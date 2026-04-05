package com.voiceprescription.backend.repository;

import com.voiceprescription.backend.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    List<Prescription> findByDoctor(Doctor doctor);
    List<Prescription> findByPatient(Patient patient);
}
