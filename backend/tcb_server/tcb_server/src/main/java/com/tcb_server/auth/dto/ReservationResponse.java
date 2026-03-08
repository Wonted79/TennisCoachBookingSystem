package com.tcb_server.auth.dto;

import com.tcb_server.auth.domain.Reservation;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReservationResponse {
    private Long id;
    private Long adminId;
    private LocalDateTime reservationAt;
    private String content;
    private String status;

    public static ReservationResponse from(Reservation reservation) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .adminId(reservation.getAdminId())
                .reservationAt(reservation.getReservationAt())
                .content(reservation.getContent())
                .status(reservation.getStatus())
                .build();
    }
}
