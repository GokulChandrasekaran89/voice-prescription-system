package com.voiceprescription.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "doctor")   // ✅ MUST match database table name
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    private String specialization;

    /* ==========================
       DIGITAL SIGNATURE FIELD
       ========================== */
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String signature;   // ✅ Stores Base64 image string

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Patient> patients;

    /* ==========================
       GETTERS & SETTERS
       ========================== */

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    /* ===== Signature Getter/Setter ===== */

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public List<Patient> getPatients() { return patients; }
    public void setPatients(List<Patient> patients) {
        this.patients = patients;
    }
}