package com.voiceprescription.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescription")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🎤 Voice → text diagnosis
    private String diagnosis;

    @Column(length = 2000)
    private String medicines;

    private LocalDateTime createdAt = LocalDateTime.now();

    // 🔗 Many prescriptions → one patient
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    // 🔗 Many prescriptions → one doctor
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    // getters & setters
    public Long getId() { return id; }
    public String getDiagnosis() { return diagnosis; }
    public String getMedicines() { return medicines; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Patient getPatient() { return patient; }
    public Doctor getDoctor() { return doctor; }

    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
    public void setMedicines(String medicines) { this.medicines = medicines; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }
}
