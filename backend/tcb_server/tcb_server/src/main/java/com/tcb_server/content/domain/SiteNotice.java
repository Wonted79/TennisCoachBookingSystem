package com.tcb_server.content.domain;

import lombok.Data;

@Data
public class SiteNotice {
    private Long id;
    private Long coachId;
    private String content;
}
