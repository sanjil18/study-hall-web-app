package com.example.demo.Repository;

import com.example.demo.Model.Bookings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Bookings, Integer> {
    Bookings findBySeatNo(int seatNo);

    Bookings findByRegNo(String regNo);

    // Find all expired bookings (endTime < current time)
    List<Bookings> findByEndTimeBefore(LocalDateTime currentTime);

    // Find active booking for a student (regNo AND endTime >= current time)
    @Query("SELECT b FROM Bookings b WHERE b.regNo = :regNo AND b.endTime >= :currentTime")
    Bookings findActiveBookingByRegNo(@Param("regNo") String regNo, @Param("currentTime") LocalDateTime currentTime);
}