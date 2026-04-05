package com.voiceprescription.backend.controller;

import com.voiceprescription.backend.model.Doctor;
import com.voiceprescription.backend.payload.LoginRequest;
import com.voiceprescription.backend.payload.LoginResponse;
import com.voiceprescription.backend.security.jwt.JwtUtils;
import com.voiceprescription.backend.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    // =========================
    // Register
    // =========================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Doctor doctor) {
        Doctor savedDoctor = authService.registerDoctor(doctor);
        return ResponseEntity.ok(savedDoctor);
    }

    // =========================
    // Login
    // =========================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        // 1️⃣ Authenticate using Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2️⃣ Generate JWT
        String token = jwtUtils.generateJwtToken(request.getEmail());

        // 3️⃣ Return safe response
        return ResponseEntity.ok(
                new LoginResponse(request.getEmail(), token)
        );
    }
}