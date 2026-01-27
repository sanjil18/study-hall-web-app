package com.example.demo.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "bookings")
public class Bookings {

    @Id
    @Column(name = "SeatNo")
    private int seatNo;

    @Column(name = "Timel.init")
    private String timeLimit; // Consider using LocalDateTime for better date/time handling

    @Column(name = "Reg_No")
    private String regNo;

    // Getters and setters (Crucial for Jackson JSON mapping)
    public int getSeatNo() {
        return seatNo;
    }

    public void setSeatNo(int seatNo) {
        this.seatNo = seatNo;
    }

    public String getTimeLimit() {
        return timeLimit;
    }

    public void setTimeLimit(String timeLimit) {
        this.timeLimit = timeLimit;
    }

    public String getRegNo() {
        return regNo;
    }

    public void setRegNo(String regNo) {
        this.regNo = regNo;
    }
}