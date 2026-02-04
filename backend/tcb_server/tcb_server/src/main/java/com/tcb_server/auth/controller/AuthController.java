package com.tcb_server.auth.controller;

import com.tcb_server.auth.dto.LoginRequest;
import com.tcb_server.auth.dto.LoginResponse;
import com.tcb_server.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        log.info("login request loginId: {}", request.getLoginId());
        log.info("login request password: {}", request.getPassword());
        LoginResponse response = authService.login(request);

        if (response == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(response);
    }
}
