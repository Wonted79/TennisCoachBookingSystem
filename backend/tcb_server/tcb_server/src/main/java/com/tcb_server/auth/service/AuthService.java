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

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminUserMapper adminUserMapper;
    private final CoachInfoMapper coachInfoMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final PasswordResetService passwordResetService;

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
                .isTempPassword(user.getIsTempPassword())
                .build();
    }

    /** ADMIN이 코치 계정을 생성하고 임시 비밀번호를 이메일로 전송 */
    public String createCoachAccount(String username, String email) {
        if (adminUserMapper.existsByUsername(username)) {
            return "이미 사용 중인 아이디입니다.";
        }
        if (adminUserMapper.existsByEmail(email)) {
            return "이미 사용 중인 이메일입니다.";
        }

        String tempPassword = generateTempPassword();

        AdminUser newUser = new AdminUser();
        newUser.setUsername(username);
        newUser.setEmail(email);
        newUser.setPasswordHash(passwordEncoder.encode(tempPassword));
        newUser.setRole("COACH");
        newUser.setIsTempPassword(true);
        adminUserMapper.save(newUser);

        try {
            emailService.sendTempPassword(email, username, tempPassword);
        } catch (Exception e) {
            return "계정이 생성되었으나 이메일 발송에 실패했습니다. 임시 비밀번호: " + tempPassword;
        }
        return null;
    }

    /** 비밀번호 변경 1단계: username + email 일치 확인 후 인증번호 발송 */
    public String sendPasswordResetCode(String username, String email) {
        AdminUser user = adminUserMapper.findByUsername(username);
        if (user == null) {
            return "존재하지 않는 아이디입니다.";
        }
        if (!email.equalsIgnoreCase(user.getEmail())) {
            return "아이디와 이메일이 일치하지 않습니다.";
        }
        String code = passwordResetService.generateAndStoreCode(email);
        try {
            emailService.sendVerificationCode(email, code);
        } catch (Exception e) {
            return "이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.";
        }
        return null;
    }

    /** 비밀번호 변경 2단계: 인증번호 검증 */
    public String verifyPasswordResetCode(String email, String code) {
        if (!passwordResetService.verifyCode(email, code)) {
            return "인증번호가 올바르지 않거나 만료되었습니다.";
        }
        return null;
    }

    /** 비밀번호 변경 3단계: 새 비밀번호 저장 */
    public String resetPasswordByEmail(String email, String newPassword) {
        if (!passwordResetService.isVerified(email)) {
            return "인증이 완료되지 않았거나 만료되었습니다. 처음부터 다시 시도해주세요.";
        }
        AdminUser user = adminUserMapper.findByEmail(email);
        if (user == null) {
            return "사용자를 찾을 수 없습니다.";
        }
        adminUserMapper.updatePassword(user.getId(), passwordEncoder.encode(newPassword));
        passwordResetService.clear(email);
        return null;
    }

    private String generateTempPassword() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(10);
        for (int i = 0; i < 10; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
