package com.tcb_server.auth.controller;

import com.tcb_server.auth.domain.Reservation;
import com.tcb_server.auth.dto.ReservationRequest;
import com.tcb_server.auth.dto.ReservationResponse;
import com.tcb_server.auth.service.ReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/reservation")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ReservationRequest request) {
        try {
            log.info("POST /api/reservation - reservationAt={}", request.getReservationAt());
            Reservation reservation = reservationService.save(request);
            return ResponseEntity.ok(ReservationResponse.from(reservation));
        } catch (Exception e) {
            log.error("예약 저장 실패: ", e);
            return ResponseEntity.internalServerError().body("저장 실패: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody ReservationRequest request) {
        try {
            Reservation reservation = reservationService.update(id, request);
            if (reservation == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(ReservationResponse.from(reservation));
        } catch (Exception e) {
            log.error("예약 수정 실패: ", e);
            return ResponseEntity.internalServerError().body("수정 실패: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            reservationService.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("예약 삭제 실패: ", e);
            return ResponseEntity.internalServerError().body("삭제 실패: " + e.getMessage());
        }
    }

    @GetMapping("/public/week")
    public ResponseEntity<?> getPublicWeekReservations(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<Reservation> reservations = reservationService.findByDateRange(startDate, endDate);
            // 일반 사용자에게는 상태와 날짜/시간만 반환 (개인정보 제외)
            List<java.util.Map<String, Object>> publicData = reservations.stream()
                    .map(r -> {
                        java.util.Map<String, Object> map = new java.util.HashMap<>();
                        map.put("reservationAt", r.getReservationAt());
                        map.put("status", r.getStatus());
                        return map;
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(publicData);
        } catch (Exception e) {
            log.error("공개 예약 조회 실패: ", e);
            return ResponseEntity.internalServerError().body("조회 실패: " + e.getMessage());
        }
    }

    @GetMapping("/week")
    public ResponseEntity<?> getWeekReservations(
            @RequestParam Long adminId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<Reservation> reservations = reservationService.findByAdminIdAndDateRange(adminId, startDate, endDate);
            List<ReservationResponse> responses = reservations.stream()
                    .map(ReservationResponse::from)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("예약 조회 실패: ", e);
            return ResponseEntity.internalServerError().body("조회 실패: " + e.getMessage());
        }
    }
}
