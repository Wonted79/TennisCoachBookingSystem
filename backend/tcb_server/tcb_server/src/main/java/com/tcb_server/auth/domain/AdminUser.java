package com.tcb_server.auth.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminUser {

    private Long id;
    private String username;
    private String email;
    private String passwordHash;
    private String role;           // ADMIN or COACH
    private Boolean isTempPassword;

}
