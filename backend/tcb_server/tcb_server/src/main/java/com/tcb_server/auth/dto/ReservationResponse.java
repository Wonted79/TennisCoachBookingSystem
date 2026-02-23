package com.tcb_server.auth.dto;

import com.tcb_server.auth.domain.Reservation;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class ReservationResponse {
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

    public static ReservationResponse from(Reservation reservation) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .adminId(reservation.getAdminId())
                .reservationDate(reservation.getReservationDate())
                .reservationTime(reservation.getReservationTime())
                .name(reservation.getName())
                .phone(reservation.getPhone())
                .applyDate(reservation.getApplyDate())
                .registerDate(reservation.getRegisterDate())
                .changeDate(reservation.getChangeDate())
                .amount(reservation.getAmount())
                .repaymentDate(reservation.getRepaymentDate())
                .status(reservation.getStatus())
                .build();
    }
}
