package com.tcb_server.auth.service;

import com.tcb_server.auth.domain.AdminUser;
import com.tcb_server.auth.dto.LoginRequest;
import com.tcb_server.auth.dto.LoginResponse;
import com.tcb_server.auth.dto.RegisterRequest;
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

        // COACH면 coach_profile 조회하여 profileId와 displayName 결정
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
                .isTempPassword(user.getIsTempPassword())
                .build();
    }

    /** COACH 계정 회원가입 (role=COACH, is_temp_password=TRUE 고정) */
    public String register(RegisterRequest request) {
        if (adminUserMapper.existsByUsername(request.getUsername())) {
            return "이미 사용 중인 아이디입니다.";
        }
        AdminUser newUser = new AdminUser();
        newUser.setUsername(request.getUsername());
        newUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        newUser.setRole("COACH");
        newUser.setIsTempPassword(false);
        adminUserMapper.save(newUser);
        return null;
    }

    /** 비밀번호 변경 - 현재 비밀번호 확인 후 변경 */
    public String changePassword(String username, String currentPassword, String newPassword) {
        AdminUser user = adminUserMapper.findByUsername(username);
        if (user == null) {
            return "존재하지 않는 아이디입니다.";
        }
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            return "현재 비밀번호가 올바르지 않습니다.";
        }
        adminUserMapper.updatePassword(user.getId(), passwordEncoder.encode(newPassword));
        return null;
    }
}
