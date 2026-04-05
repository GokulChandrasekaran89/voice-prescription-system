package com.voiceprescription.backend.service;

import com.voiceprescription.backend.model.Doctor;
import com.voiceprescription.backend.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Doctor not found"));

        return new User(
                doctor.getEmail(),
                doctor.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority("ROLE_DOCTOR"))
        );
    }
}