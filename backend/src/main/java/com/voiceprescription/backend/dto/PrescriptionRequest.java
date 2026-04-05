package com.voiceprescription.backend.dto;

public class PrescriptionRequest {

    private String patientName;
    private String phone;
    private String email;
    private int age;
    private String bloodGroup;
    private double temperature;
    private String diagnosis;
    private String medicines;

    // Getters & Setters

    public String getPatientName() { return patientName; }

    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPhone() { return phone; }

    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public int getAge() { return age; }

    public void setAge(int age) { this.age = age; }

    public String getBloodGroup() { return bloodGroup; }

    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public double getTemperature() { return temperature; }

    public void setTemperature(double temperature) { this.temperature = temperature; }

    public String getDiagnosis() { return diagnosis; }

    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getMedicines() { return medicines; }

    public void setMedicines(String medicines) { this.medicines = medicines; }
}