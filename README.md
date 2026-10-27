# FleetGuard IS – Fleet Maintenance & Roadworthiness Tracker
A lightweight, role-based MERN stack web application built for fleet management, maintenance scheduling, and vehicle roadworthiness tracking. Developed as a Continuous Assessment artifact for the B9IS130 Web Development module.

# 1. Project Overview
FleetGuard IS provides small-to-medium logistics operators with a centralized platform to manage vehicle compliance, track mechanical defects, and monitor repair expenditures.

-> Full-Stack JavaScript Architecture: Built using the complete MERN stack (MongoDB, Express,React, Node.js).
-> Cloud Database Integration: Connected to a cloud-hosted MongoDB Atlas M0 cluster via Mongoose.
-> Role-Based Access Control (RBAC): Distinct permissions enforced across Manager and Technician roles.
-> Complete CRUD Capabilities: Create, Read, Update, and Delete operations implemented across Vehicles and Work Orders.
-> Third-Party External API Consumption: Automated currency normalization to EUR using the Frankfurter FX API.
-> RESTful Security: Stateless session tokens via JSON Web Tokens (JWT) and salted password hashing with bcryptjs.

# 2. System Architecture & Tech Stack

- Layer         Technology                          
Frontend        React 19 (Vite), React Router,  Axios, Lucide React    
                                                 
Backend         Node.js, Express.js                 
Database        MongoDB Atlas 
External API    Frankfurter API 
Authentication  JWT (jsonwebtoken) & bcryptjs

# 3. Local Setup Instructions

- Prerequisites
Node.js (v18+ or v24+)
Free MongoDB Atlas Cluster
Git
- Run the Backend API
In your first terminal tab:
cd server
npm install
npm run dev
API will run at http://localhost:5000.
- Run the Frontend Client
In your second terminal tab:
cd client
npm install
npm run dev
Application will be accessible at http://localhost:5173.


# 4. Directory Layout

webdevproject/
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js            # Axios instance with JWT interceptor & base URL
│   │   ├── components/
│   │   │   └── Navbar.jsx          # Role-aware responsive navigation bar
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # User authentication state provider
│   │   ├── pages/
│   │   │   ├── Login.jsx           # JWT credential sign-in
│   │   │   ├── Register.jsx        # Account registration with role assignment
│   │   │   ├── Technicians.jsx     # Manager-only staff directory & account deletion
│   │   │   ├── Vehicles.jsx        # Fleet inventory management & status cycling
│   │   │   └── WorkOrders.jsx      # Ticket log with live FX rate normalization
│   │   ├── App.jsx                 # Client-side routes & ProtectedRoute guards
│   │   ├── index.css               # Global theme & responsive table styling
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── server/
    ├── src/
    │   ├── config/
    │   │   └── db.js               # MongoDB Atlas connection handler
    │   ├── controllers/
    │   │   ├── authController.js   # Auth logic & staff directory management
    │   │   ├── vehicleController.js# Vehicle CRUD operations
    │   │   └── workOrderController.js # Work orders & currency conversion hooks
    │   ├── middleware/
    │   │   └── auth.js             # JWT verification & requireManager checks
    │   ├── models/
    │   │   ├── User.js             # User accounts & role schema
    │   │   ├── Vehicle.js          # Fleet registration & roadworthiness schema
    │   │   └── WorkOrder.js        # Maintenance ticket schema with EUR fields
    │   ├── routes/
    │   │   ├── authRoutes.js       # Auth & user management endpoints
    │   │   ├── vehicleRoutes.js    # Fleet routes
    │   │   └── workOrderRoutes.js  # Maintenance order routes
    │   ├── services/
    │   │   └── currencyService.js  # Frankfurter FX API client
    │   └── server.js               # Express application entry point
    ├── .env
    └── package.json