package com.tcb_server.content.mapper;

import com.tcb_server.content.domain.CoachInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CoachInfoMapper {
    CoachInfo findById(@Param("id") Long id);
    CoachInfo findByUserId(@Param("userId") Long userId);
    List<CoachInfo> findAll();
    void save(CoachInfo coach);
    void update(CoachInfo coach);
    void delete(@Param("id") Long id);
}
