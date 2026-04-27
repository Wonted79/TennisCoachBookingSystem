package com.tcb_server.auth.service;

import com.tcb_server.auth.domain.AdminUser;
import com.tcb_server.auth.dto.LoginRequest;
import com.tcb_server.auth.dto.LoginResponse;
import com.tcb_server.auth.mapper.AdminUserMapper;
import com.tcb_server.content.domain.CoachInfo;
import com.tcb_server.content.mapper.CoachInfoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminUserMapper adminUserMapper;
    private final CoachInfoMapper coachInfoMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        AdminUser user = adminUserMapper.findByUsername(request.getUsername());
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return null;
        }

        Long coachProfileId = null;
        String displayName = user.getUsername();

        if ("COACH".equals(user.getRole())) {
            CoachInfo profile = coachInfoMapper.findByUserId(user.getId());
            if (profile != null) {
                coachProfileId = profile.getId();
                if (profile.getName() != null && !profile.getName().isBlank()) {
                    displayName = profile.getName();
                }
            }
        }

        return LoginResponse.builder()
                .id(user.getId())
                .displayName(displayName)
                .role(user.getRole())
                .coachProfileId(coachProfileId)
                .build();
    }

    /**
     * ADMIN이 코치 계정 생성. 성공 시 생성된 user ID 반환.
     * 중복 아이디면 IllegalStateException 발생.
     */
    public Long createCoachAccount(String username, String password) {
        if (adminUserMapper.existsByUsername(username)) {
            throw new IllegalStateException("이미 사용 중인 아이디입니다.");
        }
        AdminUser newUser = new AdminUser();
        newUser.setUsername(username);
        newUser.setPasswordHash(passwordEncoder.encode(password));
        newUser.setRole("COACH");
        adminUserMapper.save(newUser);
        return newUser.getId();
    }
}
