package com.voiceprescription.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.voiceprescription.backend.model.Doctor;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByEmail(String email);
}
