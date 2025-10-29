package com.example.demo.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "bookings")
public class Bookings {

    @Id
    @Column(name = "SeatNo")  // Match exact column name
    private int seatNo;

    @Column(name = "Timel.init")  // Match exact column name
    private String timeLimit;

    @Column(name = "Reg_No")  // Match exact column name
    private String regNo;

    // Getters and setters
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