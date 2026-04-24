package com.tcb_server.auth.mapper;

import com.tcb_server.auth.domain.AdminUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AdminUserMapper {

    AdminUser findByUsername(@Param("username") String username);

    AdminUser findByEmail(@Param("email") String email);

    boolean existsByUsername(@Param("username") String username);

    boolean existsByEmail(@Param("email") String email);

    void save(AdminUser adminUser);

    void updatePassword(@Param("id") Long id, @Param("passwordHash") String passwordHash);
}
