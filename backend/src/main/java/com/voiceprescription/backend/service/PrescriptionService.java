package com.voiceprescription.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.voiceprescription.backend.model.Patient;
import com.voiceprescription.backend.model.Prescription;
import com.voiceprescription.backend.repository.PatientRepository;
import com.voiceprescription.backend.repository.PrescriptionRepository;

@Service
public class PrescriptionService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    public Prescription createPrescription(
            String name,
            int age,
            String gender,
            String bloodGroup,
            String symptoms,
            String diagnosis,
            String medicines
    ) {

        Patient p = new Patient();
        p.setName(name);
        p.setAge(age);
        p.setGender(gender);
        p.setBloodGroup(bloodGroup);
        p.setSymptoms(symptoms);

        Patient savedPatient = patientRepository.save(p);

        Prescription prescription = new Prescription();
        prescription.setDiagnosis(diagnosis);
        prescription.setMedicines(medicines);
        prescription.setPatient(savedPatient);

        return prescriptionRepository.save(prescription);
    }
}