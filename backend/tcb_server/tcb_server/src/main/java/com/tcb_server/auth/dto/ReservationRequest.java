package com.tcb_server.auth.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReservationRequest {
    private Long adminId;
    private LocalDateTime reservationAt;
    private String content;
    private String status;
}
