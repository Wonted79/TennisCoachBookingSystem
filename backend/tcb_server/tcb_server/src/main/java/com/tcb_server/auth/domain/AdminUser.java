package com.tcb_server.auth.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminUser {

    private Long id;
    private String username;       // 로그인 ID (was loginId)
    private String passwordHash;   // BCrypt 해시 (was password)
    private String role;           // ADMIN or COACH
    private Boolean isTempPassword;

}
