package com.tcb_server.auth.mapper;

import com.tcb_server.auth.domain.Reservation;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface ReservationMapper {

    void save(Reservation reservation);
    void update(Reservation reservation);
    void delete(@Param("id") Long id);
    Reservation findById(@Param("id") Long id);
    List<Reservation> findByAdminId(@Param("adminId") Long adminId);
    List<Reservation> findByAdminIdAndDateRange(
            @Param("adminId") Long adminId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
    List<Reservation> findByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
