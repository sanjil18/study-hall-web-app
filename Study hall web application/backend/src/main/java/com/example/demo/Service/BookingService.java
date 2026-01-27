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

    /**
     * Attempts to book a seat using data provided in the Bookings object.
     * Checks for existing seat booking and existing student booking.
     * @param newBooking The Bookings object containing regNo and seatNo.
     * @return The saved Bookings object or null if booking fails.
     */
    public Bookings bookSeat(Bookings newBooking) {
        // 1. Check if the seat is already booked (SeatNo is the primary key)
        if (bookingRepository.findBySeatNo(newBooking.getSeatNo()) != null) {
            return null; // Seat is already booked
        }

        // 2. Check if the student already has a booking
        if (bookingRepository.findByRegNo(newBooking.getRegNo()) != null) {
            // Student has an existing booking (Assuming one booking per student)
            return null;
        }

        // 3. Set default timeLimit if not provided (Crucial for non-null columns)
        if (newBooking.getTimeLimit() == null || newBooking.getTimeLimit().isEmpty()) {
            // Use a default or current timestamp string
            newBooking.setTimeLimit("N/A - Set upon booking");
        }

        return bookingRepository.save(newBooking);
    }

    public Bookings getBookingByStudent(String regNo) {
        return bookingRepository.findByRegNo(regNo);
    }

    // Standardized method name
    public Bookings getBookingById(int id) {
        // Since ID is SeatNo, findBySeatNo is used.
        return bookingRepository.findBySeatNo(id);
    }

    public List<Bookings> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Standardized method name (was DeleteSeat)
    public void deleteBooking(int id) {
        bookingRepository.deleteById(id);
    }
}