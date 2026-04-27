package com.tcb_server.content.service;

import com.tcb_server.content.domain.CoachInfo;
import com.tcb_server.content.domain.SiteNotice;
import com.tcb_server.content.mapper.CoachInfoMapper;
import com.tcb_server.content.mapper.SiteNoticeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContentService {

    private final CoachInfoMapper coachInfoMapper;
    private final SiteNoticeMapper siteNoticeMapper;

    // ── 코치 프로필 ──────────────────────────────────

    public List<CoachInfo> getAllCoaches() {
        return coachInfoMapper.findAll();
    }

    public CoachInfo getCoach(Long id) {
        return coachInfoMapper.findById(id);
    }

    public CoachInfo getCoachByUserId(Long userId) {
        return coachInfoMapper.findByUserId(userId);
    }

    public CoachInfo getCoachByUsername(String username) {
        return coachInfoMapper.findByUsername(username);
    }

    /** COACH 계정의 프로필 최초 생성 */
    @Transactional
    public CoachInfo createCoachProfile(Long userId, String name, String phone) {
        CoachInfo coach = new CoachInfo();
        coach.setUserId(userId);
        coach.setName(name);
        coach.setPhone(phone);
        coach.setProfileImageUrl("");
        coach.setIntroduction("");
        coach.setEducation("");
        coach.setAwards("");
        coach.setCertifications("");
        coachInfoMapper.save(coach);
        return coach;
    }

    @Transactional
    public void updateCoach(Long id, String name, String phone, String profileImageUrl,
                            String introduction, String education, String awards, String certifications) {
        CoachInfo coach = new CoachInfo();
        coach.setId(id);
        coach.setName(name);
        coach.setPhone(phone);
        coach.setProfileImageUrl(profileImageUrl);
        coach.setIntroduction(introduction);
        coach.setEducation(education);
        coach.setAwards(awards);
        coach.setCertifications(certifications);
        coachInfoMapper.update(coach);
    }

    @Transactional
    public void deleteCoach(Long id) {
        coachInfoMapper.delete(id);
    }

    // ── 공지사항 (코치 1:1) ──────────────────────────

    public SiteNotice getNotice(Long coachId) {
        return siteNoticeMapper.findByCoachId(coachId);
    }

    @Transactional
    public void updateNotice(Long coachId, String content) {
        SiteNotice notice = new SiteNotice();
        notice.setCoachId(coachId);
        notice.setContent(content);
        siteNoticeMapper.upsert(notice);
    }
}
