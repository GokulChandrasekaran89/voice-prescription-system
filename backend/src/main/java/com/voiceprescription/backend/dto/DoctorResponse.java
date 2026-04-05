package com.voiceprescription.backend.dto;

public class DoctorResponse {

    private Long id;
    private String name;
    private String email;
    private String specialization;

    public DoctorResponse(Long id, String name, String email, String specialization) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.specialization = specialization;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getSpecialization() { return specialization; }
}
