package com.tcb_server.auth.controller;

import com.tcb_server.auth.domain.Reservation;
import com.tcb_server.auth.dto.ReservationRequest;
import com.tcb_server.auth.dto.ReservationResponse;
import com.tcb_server.auth.service.ReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/reservation")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ReservationRequest request, HttpSession session) {
        if (session == null || session.getAttribute("adminId") == null) {
            return ResponseEntity.status(401).body("인증이 필요합니다.");
        }
        try {
            log.info("POST /api/reservation - dayOfWeek={}, time={}", request.getDayOfWeek(), request.getTime());
            Reservation reservation = reservationService.save(request);
            return ResponseEntity.ok(ReservationResponse.from(reservation));
        } catch (Exception e) {
            log.error("예약 저장 실패: ", e);
            return ResponseEntity.internalServerError().body("저장 실패: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody ReservationRequest request, HttpSession session) {
        if (session == null || session.getAttribute("adminId") == null) {
            return ResponseEntity.status(401).body("인증이 필요합니다.");
        }
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
    public ResponseEntity<?> delete(@PathVariable Long id, HttpSession session) {
        if (session == null || session.getAttribute("adminId") == null) {
            return ResponseEntity.status(401).body("인증이 필요합니다.");
        }
        try {
            reservationService.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("예약 삭제 실패: ", e);
            return ResponseEntity.internalServerError().body("삭제 실패: " + e.getMessage());
        }
    }

    @GetMapping("/public")
    public ResponseEntity<?> getPublicReservations(@RequestParam(required = false) Long coachId) {
        try {
            List<Reservation> reservations = coachId != null
                    ? reservationService.findByCoachId(coachId)
                    : reservationService.findAll();
            List<java.util.Map<String, Object>> publicData = reservations.stream()
                    .map(r -> {
                        java.util.Map<String, Object> map = new java.util.HashMap<>();
                        map.put("coachId", r.getCoachId());
                        map.put("dayOfWeek", r.getDayOfWeek());
                        map.put("time", r.getTime());
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

    @GetMapping
    public ResponseEntity<?> getReservations(@RequestParam Long coachId) {
        try {
            List<Reservation> reservations = reservationService.findByCoachId(coachId);
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
