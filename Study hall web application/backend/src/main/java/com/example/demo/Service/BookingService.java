package com.example.demo.Service;

import com.example.demo.Model.Bookings;
import com.example.demo.Repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    /**
     * Scheduled task to auto-delete expired bookings every minute
     */
    @Scheduled(fixedRate = 60000) // Runs every 60 seconds
    public void deleteExpiredBookings() {
        LocalDateTime now = LocalDateTime.now();
        List<Bookings> expiredBookings = bookingRepository.findByEndTimeBefore(now);

        if (!expiredBookings.isEmpty()) {
            bookingRepository.deleteAll(expiredBookings);
            System.out.println("🗑️ Deleted " + expiredBookings.size() + " expired booking(s) at " + now);
        }
    }

    /**
     * Attempts to book a seat using data provided in the Bookings object.
     * Auto-cleans expired bookings before validation.
     * Checks for existing seat booking and existing ACTIVE student booking.
     * 
     * @param newBooking The Bookings object containing regNo, seatNo, startTime,
     *                   endTime.
     * @return The saved Bookings object or null if booking fails.
     */
    public Bookings bookSeat(Bookings newBooking) {
        // 0. Auto-clean expired bookings first
        deleteExpiredBookings();

        LocalDateTime now = LocalDateTime.now();

        // 1. Check if the seat is already booked AND active
        Bookings existingSeatBooking = bookingRepository.findBySeatNo(newBooking.getSeatNo());
        if (existingSeatBooking != null && existingSeatBooking.getEndTime().isAfter(now)) {
            return null; // Seat is already booked and active
        }

        // If seat exists but expired, delete it first
        if (existingSeatBooking != null && existingSeatBooking.getEndTime().isBefore(now)) {
            bookingRepository.delete(existingSeatBooking);
        }

        // 2. Check if the student already has an ACTIVE booking
        Bookings activeStudentBooking = bookingRepository.findActiveBookingByRegNo(
                newBooking.getRegNo(),
                now);
        if (activeStudentBooking != null) {
            // Student has an active booking
            return null;
        }

        // 3. Set default timeLimit if not provided (for backward compatibility)
        if (newBooking.getTimeLimit() == null || newBooking.getTimeLimit().isEmpty()) {
            newBooking.setTimeLimit(newBooking.getStartTime() + " to " + newBooking.getEndTime());
        }

        return bookingRepository.save(newBooking);
    }

    /**
     * Get active booking for a student
     */
    public Bookings getActiveBookingByStudent(String regNo) {
        return bookingRepository.findActiveBookingByRegNo(regNo, LocalDateTime.now());
    }

    /**
     * Get any booking for a student (active or expired)
     */
    public Bookings getBookingByStudent(String regNo) {
        return bookingRepository.findByRegNo(regNo);
    }

    /**
     * Get booking by seat number
     */
    public Bookings getBookingById(int seatNo) {
        return bookingRepository.findBySeatNo(seatNo);
    }

    /**
     * Get all active bookings only
     */
    public List<Bookings> getAllActiveBookings() {
        deleteExpiredBookings(); // Clean up first
        return bookingRepository.findAll();
    }

    /**
     * Get all bookings (including expired)
     */
    public List<Bookings> getAllBookings() {
        return bookingRepository.findAll();
    }

    /**
     * Delete booking with ownership verification
     * 
     * @param seatNo The seat number to delete
     * @param regNo  The student's registration number (for verification)
     * @return true if deleted, false if not owned by student
     */
    public boolean deleteBookingWithVerification(int seatNo, String regNo) {
        Bookings booking = bookingRepository.findBySeatNo(seatNo);

        if (booking == null) {
            return false; // Booking doesn't exist
        }

        // Verify ownership
        if (!booking.getRegNo().equals(regNo)) {
            return false; // Not owned by this student
        }

        bookingRepository.deleteById(seatNo);
        return true;
    }

    /**
     * Delete booking without verification (for admin use)
     */
    public void deleteBooking(int seatNo) {
        bookingRepository.deleteById(seatNo);
    }
}