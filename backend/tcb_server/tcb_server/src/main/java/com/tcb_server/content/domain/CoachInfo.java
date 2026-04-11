package com.tcb_server.content.domain;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CoachInfo {
    private Long id;
    private Long userId;             // FK → users.id
    private String name;
    private String phone;
    private String profileImageUrl;
    private String introduction;
    private String education;
    private String awards;           // was achievements
    private String certifications;
    private LocalDateTime updatedAt;
}
