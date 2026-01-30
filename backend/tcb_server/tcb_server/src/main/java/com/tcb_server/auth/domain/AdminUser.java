package com.tcb_server.auth.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminUser {

    private Long id;
    private String loginId;
    private String password;
    private String name;
    private String role;
}
