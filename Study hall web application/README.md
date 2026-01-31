# 📚 Study Hall Booking System

A modern web application for managing study hall seat bookings with real-time availability, automated expiration, and user authentication.

---

## ✨ Features

### Core Functionality
- 🔐 **User Authentication** - Secure login with registration number
- 🪑 **Interactive Seat Booking** - Visual seat selection (1-150 seats)
- ⏰ **Time-Based Booking** - Set start and end times for reservations
- 🔄 **Auto-Expiration** - Bookings automatically deleted after end time (every 60 seconds)
- ✏️ **Update Bookings** - Modify your existing reservations
- 🗑️ **Owner-Only Access** - Only book owners can delete their bookings

### User Experience
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Clean, intuitive interface with Vite + React
- ⚡ **Real-Time Updates** - Instant booking status
- 🚫 **Smart Validation** - One active booking per student

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18+ with Vite
- **Routing**: React Router DOM v7
- **Styling**: CSS3 with modern features
- **Build Tool**: Vite (ESNext, fast HMR)
- **Web Server**: Nginx (Alpine-based)

### Backend
- **Framework**: Spring Boot 3.5.6
- **Language**: Java 17
- **ORM**: Hibernate/JPA with auto-update schema
- **Scheduling**: Spring `@Scheduled` tasks
- **Build Tool**: Maven 3.9.6

### Database
- **DBMS**: MySQL 8.0
- **Connection Pool**: HikariCP (default)
- **Schema Management**: Hibernate DDL auto-update

---

## 📦 Installation

### Prerequisites
- Docker & Docker Compose
- Git
- MySQL client (optional, for manual DB access)

### Quick Start

```bash
# Clone repository
git clone https://github.com/sanjil18/study-hall-web-app.git
cd study-hall-web-app/Study\ hall\ web\ application

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Access application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8080 (internal only)
# MySQL: localhost:3310
```

---

## 🏗️ Project Structure

```
study-hall-web-app/
├── frontend/
│   ├── src/
│   │   ├── Components/     # Reusable UI components
│   │   ├── pages/          # Route pages (Home, BookSeat, Profile, Login)
│   │   ├── api/            # API configuration
│   │   └── App.jsx         # Root component
│   ├── Dockerfile          # Multi-stage build
│   └── package.json
│
├── backend/
│   ├── src/main/java/com/example/demo/
│   │   ├── Model/          # JPA entities (Bookings, Student)
│   │   ├── Repository/     # Data access layer
│   │   ├── Service/        # Business logic + scheduled tasks
│   │   ├── RestController/ # REST API endpoints
│   │   └── DemoApplication.java
│   ├── Dockerfile          # Multi-stage build
│   └── pom.xml
│
├── compose.yml             # Docker Compose orchestration
├── nginx.conf              # Nginx reverse proxy config
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
- `POST /login` - User login
- `POST /signup` - User registration

### Bookings
- `POST /bookings/bookSeat` - Create booking
- `GET /bookings/booked-seats` - Get all active seat numbers
- `GET /bookings/getAllBooking` - Get all active bookings
- `DELETE /bookings/delete/{id}?regNo={regNo}` - Delete booking (owner only)

---

## 🎯 Key Features Explained

### Auto-Expiration System
```java
@Scheduled(fixedRate = 60000) // Runs every 60 seconds
public void deleteExpiredBookings() {
    LocalDateTime now = LocalDateTime.now();
    List<Bookings> expiredBookings = bookingRepository.findByEndTimeBefore(now);
    bookingRepository.deleteAll(expiredBookings);
}
```

### Ownership Verification
- Backend validates `regNo` before allowing deletion
- Returns `403 Forbidden` for unauthorized attempts
- Frontend sends `regNo` from localStorage with every delete request

### Single Booking Per Student
- System checks for **active bookings only** (not expired)
- Allows new booking after previous one expires
- Clear error messages when attempting multiple bookings

---

## 🧪 Testing

### Manual Test Cases

1. **Book a Seat**
   - Login → Click "Book New Seat"
   - Enter seat number (1-150), start/end time
   - Verify success message

2. **Auto-Expiration**
   - Book with end time 2 minutes in future
   - Wait 2-3 minutes
   - Refresh page → booking should disappear

3. **Single Booking Enforcement**
   - Book seat #1
   - Try booking seat #2
   - Should show error: "You already have an active booking"

4. **Owner-Only Delete**
   - Login as User A, book seat
   - Login as User B, try to delete User A's seat
   - Should fail with permission error

---

## 🚀 Deployment

### Production (AWS/Cloud)
```bash
# Pull latest images
docker-compose pull

# Deploy with latest code
docker-compose up -d --remove-orphans

# Monitor logs
docker-compose logs -f backend
```

### Environment Variables
Configure in `compose.yml`:
- `CORS_ALLOWED_ORIGINS` - Allowed frontend origins
- `SPRING_DATASOURCE_URL` - MySQL connection
- `MYSQL_ROOT_PASSWORD` - Database password

---

## 📝 Database Schema

### `bookings` Table
| Column | Type | Description |
|--------|------|-------------|
| SeatNo | INT (PK) | Seat number (1-150) |
| Reg_No | VARCHAR | Student registration number |
| TimeLimit | VARCHAR | Legacy format string |
| start_time | DATETIME | Booking start time |
| end_time | DATETIME | Booking end time |

### `students` Table
| Column | Type | Description |
|--------|------|-------------|
| Reg_No | VARCHAR (PK) | Registration number |
| password | VARCHAR | Hashed password |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

## 📄 License

This project is for educational purposes.

---

## 👨‍💻 Author

**Sanjil Raj**
- GitHub: [@sanjil18](https://github.com/sanjil18)

---

## 🙏 Acknowledgments

- Spring Boot community
- React team
- Docker documentation
