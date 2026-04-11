package com.tcb_server.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {

    private Long id;
    private String displayName;   // ADMIN → username, COACH → coach_profile.name
    private String role;
    private Long coachProfileId;  // COACH일 때 coach_profile.id (null이면 프로필 미설정)
    private Boolean isTempPassword;
}
