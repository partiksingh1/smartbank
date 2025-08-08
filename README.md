# SmartBank Backend API

A secure, full-featured digital banking platform built with Spring Boot, providing REST APIs for user management, account operations, and transaction processing.

## 🏗️ Architecture Overview

SmartBank follows a layered architecture with clear separation of concerns:

- **Controllers** - Handle HTTP requests and responses
- **Services** - Business logic implementation
- **Repositories** - Data access layer
- **DTOs** - Data transfer objects for API communication
- **Entities** - Database models with JPA annotations
- **Security** - JWT-based authentication and authorization

## 🚀 Core Features

### User Management
- **User Registration** - Create new user accounts with validation
- **Authentication** - JWT-based login system
- **Profile Management** - View user details and account information
- **Password Security** - Encrypted password storage using Spring Security

### Account Operations
- **Account Creation** - Create different types of bank accounts (SAVINGS, CURRENT, etc.)
- **Balance Management** - Real-time balance tracking
- **Account Lookup** - Retrieve account details by user or account number
- **Multi-Account Support** - Users can have different account types

### Transaction Processing
- **Money Transfers** - Transfer funds between accounts
- **Transaction History** - Complete audit trail of all transactions
- **Transaction Status** - Track PENDING, SUCCESS, FAILED transactions
- **Transaction Types** - Support for DEPOSIT, WITHDRAWAL, TRANSFER operations

### Security Features
- **JWT Authentication** - Stateless token-based security
- **Password Encryption** - BCrypt password hashing
- **Email Verification** - Password reset via email
- **CORS Support** - Cross-origin resource sharing enabled

## 🛠️ Tech Stack

| Technology        | Purpose                                |
|-------------------|----------------------------------------|
| **Spring Boot 3.5.4** | Main framework with Java 17           |
| **Spring Security** | Authentication & authorization        |
| **Spring Data JPA** | Database operations                   |
| **PostgreSQL**     | Primary database                       |
| **JWT (JJWT)**     | Token-based authentication            |
| **ModelMapper**    | DTO-Entity mapping                    |
| **Lombok**         | Reduce boilerplate code               |
| **Jakarta Validation** | Input validation                   |
| **SpringDoc OpenAPI** | API documentation                   |
| **Spring Mail**    | Email notifications                    |


## 🔒 Security Implementation
- **JWT Authentication Flow**
- **User logs in with email/password**
- **Server validates credentials**
-**JWT token generated with user claims**
-**Token sent in response**
-**Client includes token in Authorization header**
-**JwtFilter validates token on protected endpoints**

## 📁 Project Structure

```text
server/src/main/java/com/smartbank/
├── SmartBankApplication.java      # Main application class
├── config/                        # Configuration classes
├── controller/                    # REST controllers
├── dto/                          # Data Transfer Objects
├── entity/                       # JPA entities
├── exception/                    # Custom exceptions
├── repository/                   # Data repositories
├── security/                     # Security configuration
└── service/                      # Business logic
```

## 🔄 Business Logic
#### Transaction Processing
- Validation - Amount, account existence, sufficient balance
- Atomic Operations - Database transactions ensure consistency
- Audit Trail - All transactions logged with timestamps
- Status Tracking - Real-time transaction status updates
- Account Management
- Auto-generation - Unique account numbers
- Balance Calculation - Real-time balance updates
- Account Types - Support for different banking products

## 🚦 Error Handling
- Global Exception Handler - Centralized error responses
- Custom Exceptions - Domain-specific error types
- Validation Messages - User-friendly error messages
- HTTP Status Codes - Proper REST response codes

