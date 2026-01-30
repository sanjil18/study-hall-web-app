package com.example.demo.RestController;

import com.example.demo.Model.Bookings;
import com.example.demo.Service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // *** FIXED: Now uses @RequestBody for clean JSON mapping ***
    @PostMapping("/bookSeat")
    public Bookings bookSeat(@RequestBody Bookings bookingRequest) {
        return bookingService.bookSeat(bookingRequest);
    }

    /* Commented-out section preserved, though typically removed */

    @GetMapping("/getBooking/{id}")
    public Bookings getBookingById(@PathVariable int id) {
        // Using standardized service method name
        return bookingService.getBookingById(id);
    }

    @GetMapping("/getAllBooking")
    public List<Bookings> getAllBooking() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/booked-seats")
    public List<Integer> getBookedSeats() {
        return bookingService.getAllBookings()
                .stream()
                .map(Bookings::getSeatNo)
                .collect(java.util.stream.Collectors.toList());
    }

    @DeleteMapping("/delete/{id}")
    public void deleteBooking(@PathVariable int id) {
        // Using standardized service method name
        bookingService.deleteBooking(id);
    }
}