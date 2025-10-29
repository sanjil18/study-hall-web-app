package com.example.demo.RestController;

import com.example.demo.Model.Bookings;
import com.example.demo.Service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/bookSeat")
    public Bookings bookSeat(@RequestParam String Reg_No, @RequestParam int SeatNo) {
        return bookingService.bookSeat(Reg_No, SeatNo);
    }

    /*@GetMapping("/getBooking/{regno}")
    public Bookings getBookingByStudent(@RequestParam String regNo) {
        return bookingService.getBookingByStudent(regNo);
    } */


    @GetMapping("/getBooking/{id}")
    public Bookings getBookingById(@PathVariable int id)
    {
        return bookingService.GetBookingById(id);
    }

    @GetMapping("/getAllBooking")
    public List<Bookings> getAllBooking()
    {
        return bookingService.getAllBookings();
    }
    @DeleteMapping("/delete/{id}")
    public void DeleteBooking(@PathVariable int id)
    {
        bookingService.DeleteSeat(id);
    }
}
