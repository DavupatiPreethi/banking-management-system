# 🏦 NovaBank — Banking Management System

A full-stack digital banking application built with Spring Boot and React.

## 🚀 Live Demo

- **Frontend:** https://banking-management-system-khaki.vercel.app
- **Backend API:** https://banking-management-system-0qjj.onrender.com

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2, Spring Security |
| Auth | JWT (JSON Web Tokens) |
| Database | PostgreSQL (Render) |
| ORM | Spring Data JPA / Hibernate |
| Frontend | React 18, React Router v6 |
| Styling | Custom CSS (no framework) |
| HTTP Client | Axios |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

## ✨ Features

- 🔐 JWT Authentication (Register / Login / Auto logout on expiry)
- 🏦 Multiple Account Types (Savings, Checking, Fixed Deposit)
- 💰 Deposit & Withdrawal
- ↔ Fund Transfers between accounts
- 📊 Transaction History with Search, Filter & Pagination
- ⬇ Export Transactions as CSV
- 🔑 Change Password
- 📱 Responsive UI

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| POST | /api/auth/change-password | Change password |

### Accounts
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/accounts/create | Create account |
| GET | /api/accounts/my-accounts | Get user accounts |
| POST | /api/accounts/deposit | Deposit funds |
| POST | /api/accounts/withdraw | Withdraw funds |
| POST | /api/accounts/transfer | Transfer funds |
| GET | /api/accounts/{accNo}/transactions | Get transactions |

## 🏃 Run Locally

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 📁 Project Structure
```
banking-management-system/
├── backend/
│   ├── src/main/java/com/banking/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   ├── dto/
│   │   ├── security/
│   │   └── config/
│   └── src/main/resources/
└── frontend/
    └── src/
        ├── pages/
        ├── components/
        ├── services/
        └── context/
```

## 🎯 Key Concepts Demonstrated

- Spring Boot REST APIs
- Spring Security + JWT
- JPA/Hibernate with PostgreSQL
- Service Layer pattern
- DTO pattern
- React Context API
- Protected routes
- Axios interceptors

## 👩‍💻 Developer

Built by **Preethi Davupati**
