package com.tcb_server.auth.mapper;

import com.tcb_server.auth.domain.AdminUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AdminUserMapper {

    AdminUser findByLoginId(@Param("loginId") String loginId);
}
