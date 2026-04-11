package com.tcb_server.auth.mapper;

import com.tcb_server.auth.domain.Reservation;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReservationMapper {

    void save(Reservation reservation);
    void update(Reservation reservation);
    void delete(@Param("id") Long id);
    Reservation findById(@Param("id") Long id);
    List<Reservation> findByCoachId(@Param("coachId") Long coachId);
    List<Reservation> findAll();
}
