package com.tcb_server.content.controller;

import com.tcb_server.content.domain.CoachInfo;
import com.tcb_server.content.domain.SiteNotice;
import com.tcb_server.content.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicContentController {

    private final ContentService contentService;

    @GetMapping("/coaches")
    public ResponseEntity<List<Map<String, Object>>> getCoaches() {
        List<CoachInfo> coaches = contentService.getAllCoaches();
        List<Map<String, Object>> result = coaches.stream().map(c -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("name", c.getName());
            map.put("phone", c.getPhone());
            map.put("profileImageUrl", c.getProfileImageUrl());
            map.put("introduction", c.getIntroduction());
            map.put("education", splitLines(c.getEducation()));
            map.put("awards", splitLines(c.getAwards()));
            map.put("certifications", splitLines(c.getCertifications()));
            return map;
        }).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/coach")
    public ResponseEntity<Map<String, Object>> getCoachInfo(@RequestParam Long coachId) {
        CoachInfo info = contentService.getCoach(coachId);
        Map<String, Object> result = new HashMap<>();
        if (info != null) {
            result.put("id", info.getId());
            result.put("name", info.getName());
            result.put("phone", info.getPhone());
            result.put("profileImageUrl", info.getProfileImageUrl());
            result.put("introduction", info.getIntroduction());
            result.put("education", splitLines(info.getEducation()));
            result.put("awards", splitLines(info.getAwards()));
            result.put("certifications", splitLines(info.getCertifications()));
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/notice")
    public ResponseEntity<Map<String, String>> getNotice(@RequestParam Long coachId) {
        SiteNotice notice = contentService.getNotice(coachId);
        Map<String, String> result = new HashMap<>();
        result.put("content", notice != null ? notice.getContent() : "");
        return ResponseEntity.ok(result);
    }

    private List<String> splitLines(String text) {
        if (text == null || text.isBlank()) return List.of();
        return Arrays.stream(text.split("\n"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }
}
