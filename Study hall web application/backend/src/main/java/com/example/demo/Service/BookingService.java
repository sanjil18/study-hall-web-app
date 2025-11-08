package com.example.demo.Service;

import com.example.demo.Model.Bookings;
import com.example.demo.Repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public Bookings bookSeat(String Reg_No, int seatNo) {
        // Check if the seat is already booked by any student
        Bookings existingBooking = bookingRepository.findBySeatNo(seatNo);
        if (existingBooking != null) {
            return null; // Seat is already booked
        }

        // Create a new booking
        Bookings newBooking = new Bookings();
        newBooking.setRegNo(Reg_No);
        newBooking.setSeatNo(seatNo);
        return bookingRepository.save(newBooking);
    }

    public Bookings getBookingByStudent(String Reg_No) {
        return bookingRepository.findByRegNo(Reg_No);
    }
    public Bookings GetBookingById(int id)
    {
        return bookingRepository.findBySeatNo(id);
    }
    public List<Bookings> getAllBookings()
    {
         return bookingRepository.findAll();
    }
    public void DeleteSeat(int id)
    {
        bookingRepository.deleteById(id);
    }
}
