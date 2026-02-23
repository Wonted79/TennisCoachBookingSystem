package com.tcb_server.auth.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ReservationRequest {
    private Long adminId;
    private LocalDate reservationDate;
    private String reservationTime;
    private String name;
    private String phone;
    private LocalDate applyDate;
    private LocalDate registerDate;
    private LocalDate changeDate;
    private Integer amount;
    private LocalDate repaymentDate;
    private String status;
}
