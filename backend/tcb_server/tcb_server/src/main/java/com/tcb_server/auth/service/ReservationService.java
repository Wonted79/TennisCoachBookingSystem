package com.tcb_server.auth.service;

import com.tcb_server.auth.domain.Reservation;
import com.tcb_server.auth.domain.ReservationStatus;
import com.tcb_server.auth.dto.ReservationRequest;
import com.tcb_server.auth.mapper.ReservationMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationService {
    private final ReservationMapper reservationMapper;

    @Transactional
    public Reservation save(ReservationRequest request) {
        Reservation reservation = new Reservation();
        reservation.setCoachId(request.getCoachId());
        reservation.setDayOfWeek(request.getDayOfWeek());
        reservation.setTime(request.getTime());
        reservation.setContent(request.getContent());
        reservation.setStatus(request.getStatus() != null ? request.getStatus() : ReservationStatus.BOOKED);

        log.info("Saving reservation: dayOfWeek={}, time={}, coachId={}",
                reservation.getDayOfWeek(), reservation.getTime(), reservation.getCoachId());

        reservationMapper.save(reservation);

        log.info("Reservation saved with id={}", reservation.getId());
        return reservation;
    }

    @Transactional
    public Reservation update(Long id, ReservationRequest request) {
        Reservation reservation = reservationMapper.findById(id);
        if (reservation == null) return null;
        reservation.setContent(request.getContent());
        reservation.setStatus(request.getStatus());
        reservationMapper.update(reservation);
        return reservation;
    }

    @Transactional
    public void delete(Long id) {
        reservationMapper.delete(id);
    }

    public List<Reservation> findByCoachId(Long coachId) {
        return reservationMapper.findByCoachId(coachId);
    }

    public List<Reservation> findAll() {
        return reservationMapper.findAll();
    }
}
