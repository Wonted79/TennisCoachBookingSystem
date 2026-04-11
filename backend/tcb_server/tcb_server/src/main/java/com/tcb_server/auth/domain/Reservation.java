package com.tcb_server.auth.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class Reservation {
    private Long id;
    private Long coachId;
    private BookingDay dayOfWeek;
    private String time;
    private String content;
    private ReservationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
