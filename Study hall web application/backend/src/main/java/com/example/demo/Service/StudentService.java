package com.example.demo.Service;

import com.example.demo.Model.Bookings;
import com.example.demo.Model.Student;
import com.example.demo.Repository.BookingRepository;
import com.example.demo.Repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private BookingService bookingService;

    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    public Student login(String regNo, String password) {
        Student student = studentRepository.findByRegNo(regNo);
        if (student != null && student.getPassword().equals(password)) {
            return student;
        }
        return null;
    }

    public void DeleteStudent(String regNo) {
        Bookings booking = bookingRepository.findByRegNo(regNo);

        // *** CRITICAL FIX: Only try to delete booking if one exists ***
        if (booking != null) {
            // Use the updated service method name
            bookingService.deleteBooking(booking.getSeatNo());
        }

        // Delete the student record
        studentRepository.deleteById(regNo);
    }
}