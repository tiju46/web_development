# FleetGuard IS – Fleet Maintenance & Roadworthiness Tracker
A lightweight, role-based MERN stack web application built for fleet management, maintenance scheduling, and vehicle roadworthiness tracking,schedule mechanical repairs, manage technician staff directories, and normalize cross-border maintenance expenditures in real time

# Table of Contents
1. Overview

2. System Architecture & Tech Stack

3. Frontend Views & Features

    - Login View (Login.jsx)

    - Create Account View (Register.jsx)

    - Navigation Bar (Navbar.jsx)

    - Fleet Inventory Dashboard (Vehicles.jsx)

    - Add / Edit / Delete Vehicle

    - Work Orders & Maintenance Hub (WorkOrders.jsx)

    - Add / Edit / Delete Work Order

    - Multi-Currency Conversion (Frankfurter FX API)

    - Staff & Personnel Directory (Technicians.jsx)

4. Local Setup Instructions 

5. Directory Layout

6. Backend Architecture

7. Database Schemas (MongoDB Atlas)

8. Cloud Deployment (Render + Vercel)

9. References & AI Disclosure

# 1. Overview
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

# 3. Frontend Views & Features

# 3.1 Login View — Login.jsx
Allows registered personnel to authenticate and receive an encrypted JWT session.

Workflow:
User enters registered email address and password.

Frontend dispatches a POST request to /api/auth/login.

Backend compares submitted credentials with the hashed password using bcrypt.compare.

On success:

Returns a signed JWT token and sanitized user profile payload.

AuthContext stores credentials in localStorage.

The user is automatically redirected to the Fleet Inventory Dashboard (/vehicles).

Error Handling:
Visual alert banners for incorrect password or non-existent email accounts.

Network and server-down feedback messaging.

# 3.2 Create Account View — Register.jsx
Allows new personnel to register with designated operational privileges.

Fields:
Full Name

Work Email Address

Password

Role Selection (Manager or Technician)

# 3.3 Navigation Bar — Navbar.jsx
Persistent top-level navigation that dynamically adapts links and actions based on the active user session.   
Features:
Displays application branding (FleetGuard IS) with truck icon.  
Role-aware route switching (displays Technicians tab exclusively to Managers). 
Visual User Badge:
    Blue shield icon for Manager.   
    Green wrench icon for Technician.
Red logout action clearing active tokens from memory and storage

# 3.4 Fleet Inventory Dashboard — Vehicles.jsx
The primary hub for monitoring asset health, roadworthiness, and mileage across all registered vehicles.   
Features:
    Tabular display of vehicle registration numbers, make, model, year, and mileage.   
    Dynamic status badges:
        Green for Roadworthy
        Orange for Under Maintenance
        Red for Grounded
    Row-level edit controls allowing authorized updates to vehicle parameters.
    Restricts vehicle registration and deletion actions to Manager profiles.   
# 3.5 Add / Edit / Delete Vehicle
Admins and authorized users can modify fleet records directly using interactive form cards.

# 3.6 Work Orders & Maintenance Hub — WorkOrders.jsx
The operational workshop board where repair tickets are logged, tracked, and cost-audited.   Features:
    Displays target vehicle details (populated via Mongoose relations).   
    Lists diagnostic descriptions, original currency amounts, normalized EUR values, and status lifecycle markers.   
    One-click workflow triggers enabling Technicians to step ticket statuses (Pending-> In Progress -> Completed).   
    Automatic vehicle status synchronization.   
# 3.7 Add / Edit / Delete Work Order
Enables comprehensive ticket tracking and financial auditing.

# 4. Local Setup Instructions

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


# 5. Directory Layout

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


# 6. Backend Architecture

The backend is built as a RESTful Express.js application designed for stateless scalability and secure data access.

Core Modules:
- server.js: Express entry point configuring CORS, JSON body parsing, and routing trees.   
- config/db.js: MongoDB Atlas cloud connection initialization via Mongoose.   
- middleware/auth.js: Validates incoming Bearer JWT tokens and checks administrative role authorization.   
- controllers/authController.js: Handles registration,  password hashing, login token generation, directory retrieval, and user account deletion. 
- controllers/vehicleController.js: Manages full CRUD operations for fleet vehicle assets.   
- controllers/workOrderController.js: Coordinates repair logs, triggers FX conversions, and synchronizes vehicle status.   
- services/currencyService.js: Consumes the external Frankfurter FX API.   

# 7. Database Schemas (MongoDB Atlas)

User Schema (User.js)
Vehicle Schema (Vehicle.js)
Work Order Schema (WorkOrder.js)

# 8. Cloud Deployment (Render + Vercel)