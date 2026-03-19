<<<<<<< HEAD
# 🏦 NovaBank — Banking Management System

A full-stack Banking Management System built with **Java Spring Boot** (backend) and **React** (frontend), with MySQL as the database.

---

## 🛠 Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Backend     | Java 17, Spring Boot 3.2, Spring Security |
| Auth        | JWT (JSON Web Tokens)               |
| Database    | MySQL 8+                            |
| ORM         | Spring Data JPA / Hibernate         |
| Frontend    | React 18, React Router v6           |
| Styling     | Custom CSS (no framework)           |
| HTTP Client | Axios                               |

---

## 📁 Project Structure

```
banking-system/
├── backend/                  # Spring Boot application
│   ├── src/main/java/com/banking/
│   │   ├── controller/       # REST API endpoints
│   │   ├── service/          # Business logic
│   │   ├── repository/       # JPA repositories
│   │   ├── model/            # Entity classes
│   │   ├── dto/              # Request/Response DTOs
│   │   ├── security/         # JWT filter & utility
│   │   └── config/           # Security configuration
│   └── pom.xml
│
└── frontend/                 # React application
    ├── src/
    │   ├── pages/            # Login, Register, Dashboard, Accounts, Transfer, Transactions, Settings
    │   ├── components/       # Sidebar
    │   ├── services/         # Axios API calls
    │   └── context/          # Auth context (global state)
    └── package.json
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8+

---

### 1. Database Setup

```sql
CREATE DATABASE banking_db;
```

---

### 2. Backend Setup

1. Open `backend/src/main/resources/application.properties`
2. Update your MySQL credentials:
```properties
spring.datasource.username=root
spring.datasource.password=your_password
```
3. Run the backend:
```bash
cd backend
mvn spring-boot:run
```
Backend starts at: `http://localhost:8080`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```
Frontend starts at: `http://localhost:3000`

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint              | Description      |
|--------|-----------------------|------------------|
| POST   | /api/auth/register    | Register user    |
| POST   | /api/auth/login       | Login user       |

### Accounts
| Method | Endpoint                              | Description           |
|--------|---------------------------------------|-----------------------|
| POST   | /api/accounts/create                  | Create account        |
| GET    | /api/accounts/my-accounts             | Get user accounts     |
| POST   | /api/accounts/deposit                 | Deposit funds         |
| POST   | /api/accounts/withdraw                | Withdraw funds        |
| POST   | /api/accounts/transfer                | Transfer funds        |
| GET    | /api/accounts/{accNo}/transactions    | Get transactions      |

---

## ✨ Features

- ✅ User Registration & Login with JWT Authentication
- ✅ Open multiple bank accounts (Savings, Checking, Fixed Deposit)
- ✅ Deposit & Withdraw funds
- ✅ Fund transfer between accounts
- ✅ Full transaction history with filtering
- ✅ Role-based access (Customer / Admin)
- ✅ Responsive professional UI
- ✅ Secure password hashing (BCrypt)
- ✅ CORS configured for React frontend

---

## 🎯 Key Concepts Demonstrated

- Spring Boot REST APIs
- Spring Security + JWT
- JPA/Hibernate with MySQL
- Service Layer pattern
- DTO pattern (Request/Response separation)
- React Context API for state management
- Protected routes
- Axios interceptors for auth headers

---

=======
# banking-management-system
>>>>>>> 2e13e5f8ec99242891ef910f38323101b8e532cd
