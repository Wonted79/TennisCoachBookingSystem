package com.tcb_server.auth.service;

import com.tcb_server.auth.domain.AdminUser;
import com.tcb_server.auth.dto.LoginRequest;
import com.tcb_server.auth.dto.LoginResponse;
import com.tcb_server.auth.mapper.AdminUserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class
AuthService {

    private final AdminUserMapper adminUserMapper;

    public LoginResponse login(LoginRequest request) {
        AdminUser user = adminUserMapper.findByLoginId(request.getLoginId());

        if (user == null) {
            return null;
        }

        if (!user.getPassword().equals(request.getPassword())) {
            return null;
        }

        return LoginResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .role(user.getRole())
                .build();
    }
}
