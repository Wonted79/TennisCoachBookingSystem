package com.tcb_server.auth.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class Reservation {
    private Long id;
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
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
