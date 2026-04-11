package com.tcb_server.auth.dto;

import com.tcb_server.auth.domain.BookingDay;
import com.tcb_server.auth.domain.Reservation;
import com.tcb_server.auth.domain.ReservationStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReservationResponse {
    private Long id;
    private Long coachId;
    private BookingDay dayOfWeek;
    private String time;
    private String content;
    private ReservationStatus status;

    public static ReservationResponse from(Reservation reservation) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .coachId(reservation.getCoachId())
                .dayOfWeek(reservation.getDayOfWeek())
                .time(reservation.getTime())
                .content(reservation.getContent())
                .status(reservation.getStatus())
                .build();
    }
}
