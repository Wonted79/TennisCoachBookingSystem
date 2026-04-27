package com.tcb_server.auth.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Tag(name = "Util", description = "유틸리티 API (개발용)")
@RestController
@RequestMapping("/api/util")
@RequiredArgsConstructor
public class UtilController {

    private final BCryptPasswordEncoder passwordEncoder;

    @Operation(summary = "비밀번호 BCrypt 인코딩", description = "평문 비밀번호를 BCrypt로 암호화하여 반환합니다. users 테이블에 직접 삽입할 때 사용합니다.")
    @PostMapping("/encode-password")
    public ResponseEntity<?> encodePassword(@RequestParam String password) {
        String encoded = passwordEncoder.encode(password);
        return ResponseEntity.ok(Map.of("encoded", encoded));
    }
}
