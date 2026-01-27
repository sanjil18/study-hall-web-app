package com.example.demo.Repository;

import com.example.demo.Model.Bookings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Bookings, Integer> {
    Bookings findBySeatNo(int seatNo);
    Bookings findByRegNo(String regNo);
}