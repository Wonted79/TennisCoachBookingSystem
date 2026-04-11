package com.tcb_server.auth.dto;

import com.tcb_server.auth.domain.BookingDay;
import com.tcb_server.auth.domain.ReservationStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReservationRequest {
    private Long coachId;
    private BookingDay dayOfWeek;
    private String time;
    private String content;
    private ReservationStatus status;
}
