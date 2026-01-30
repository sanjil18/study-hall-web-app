package com.example.demo.RestController;

import com.example.demo.Model.Bookings;
import com.example.demo.Service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    /**
     * Book a seat - returns proper JSON responses for success and errors
     */
    @PostMapping("/bookSeat")
    public ResponseEntity<?> bookSeat(@RequestBody Bookings bookingRequest) {
        Bookings savedBooking = bookingService.bookSeat(bookingRequest);

        if (savedBooking == null) {
            // Check specific failure reason
            Bookings existingSeat = bookingService.getBookingById(bookingRequest.getSeatNo());
            Bookings activeStudentBooking = bookingService.getActiveBookingByStudent(bookingRequest.getRegNo());

            Map<String, String> errorResponse = new HashMap<>();

            if (existingSeat != null) {
                errorResponse.put("error",
                        "Seat " + bookingRequest.getSeatNo() + " is already booked by another student.");
            } else if (activeStudentBooking != null) {
                errorResponse.put("error", "You already have an active booking for seat "
                        + activeStudentBooking.getSeatNo() + ". Please cancel it first.");
            } else {
                errorResponse.put("error", "Failed to book seat. Please try again.");
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }

        return ResponseEntity.ok(savedBooking);
    }

    @GetMapping("/getBooking/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable int id) {
        Bookings booking = bookingService.getBookingById(id);
        if (booking == null) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Booking not found for seat " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/getAllBooking")
    public List<Bookings> getAllBooking() {
        return bookingService.getAllActiveBookings();
    }

    @GetMapping("/booked-seats")
    public List<Integer> getBookedSeats() {
        return bookingService.getAllActiveBookings()
                .stream()
                .map(Bookings::getSeatNo)
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Delete booking with ownership verification
     * Expects regNo as query parameter: /delete/{id}?regNo=xxx
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteBooking(
            @PathVariable int id,
            @RequestParam String regNo) {
        boolean deleted = bookingService.deleteBookingWithVerification(id, regNo);

        Map<String, String> response = new HashMap<>();

        if (!deleted) {
            Bookings booking = bookingService.getBookingById(id);
            if (booking == null) {
                response.put("error", "Booking not found.");
            } else {
                response.put("error", "You can only delete your own bookings.");
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        response.put("message", "Booking deleted successfully.");
        return ResponseEntity.ok(response);
    }
}