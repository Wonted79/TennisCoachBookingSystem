package com.tcb_server.auth.service;

import com.tcb_server.auth.domain.Reservation;
import com.tcb_server.auth.dto.ReservationRequest;
import com.tcb_server.auth.mapper.ReservationMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationService {
    private final ReservationMapper reservationMapper;

    @Transactional
    public Reservation save(ReservationRequest request) {
        Reservation reservation = new Reservation();
        reservation.setAdminId(request.getAdminId());
        reservation.setReservationDate(request.getReservationDate());
        reservation.setReservationTime(request.getReservationTime());
        reservation.setName(request.getName());
        reservation.setPhone(request.getPhone());
        reservation.setApplyDate(request.getApplyDate());
        reservation.setRegisterDate(request.getRegisterDate());
        reservation.setChangeDate(request.getChangeDate());
        reservation.setAmount(request.getAmount());
        reservation.setRepaymentDate(request.getRepaymentDate());
        reservation.setStatus(request.getStatus() != null ? request.getStatus() : "BOOKED");

        log.info("Saving reservation: name={}, date={}, time={}, adminId={}",
                reservation.getName(), reservation.getReservationDate(),
                reservation.getReservationTime(), reservation.getAdminId());

        reservationMapper.save(reservation);

        log.info("Reservation saved with id={}", reservation.getId());
        return reservation;
    }

    @Transactional
    public Reservation update(Long id, ReservationRequest request) {
        Reservation reservation = reservationMapper.findById(id);
        if (reservation == null) return null;
        reservation.setName(request.getName());
        reservation.setPhone(request.getPhone());
        reservation.setApplyDate(request.getApplyDate());
        reservation.setRegisterDate(request.getRegisterDate());
        reservation.setChangeDate(request.getChangeDate());
        reservation.setAmount(request.getAmount());
        reservation.setRepaymentDate(request.getRepaymentDate());
        reservation.setStatus(request.getStatus());
        reservationMapper.update(reservation);
        return reservation;
    }

    @Transactional
    public void delete(Long id) {
        reservationMapper.delete(id);
    }

    public Reservation findById(Long id) {
        return reservationMapper.findById(id);
    }

    public List<Reservation> findByAdminId(Long adminId) {
        return reservationMapper.findByAdminId(adminId);
    }

    public List<Reservation> findByAdminIdAndDateRange(Long adminId, LocalDate startDate, LocalDate endDate) {
        return reservationMapper.findByAdminIdAndDateRange(adminId, startDate, endDate);
    }

    public List<Reservation> findByDateRange(LocalDate startDate, LocalDate endDate) {
        return reservationMapper.findByDateRange(startDate, endDate);
    }
}
