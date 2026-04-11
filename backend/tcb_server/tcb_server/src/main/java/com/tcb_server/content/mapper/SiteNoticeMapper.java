package com.tcb_server.content.mapper;

import com.tcb_server.content.domain.SiteNotice;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface SiteNoticeMapper {
    SiteNotice findByCoachId(@Param("coachId") Long coachId);
    void upsert(SiteNotice notice);
}
