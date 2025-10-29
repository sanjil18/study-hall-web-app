import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import BookSeat from "./pages/BookSeat";
import Profile from "./pages/Profile";
import Preview from "./pages/Preview";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
      <Routes>
        
        
          <Route path="/" element={<Preview />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home/book-seat" element={<BookSeat />} />
          <Route path="/profile" element={<Profile />} />

      
      </Routes>
    </Router>
  );
}

export default App;
