# 🛒 MERN Stack eCommerce Platform

A full-stack, responsive, and feature-rich eCommerce web application built using the MERN stack (MongoDB, Express.js, React, Node.js). It includes user authentication, product management, a shopping cart, and secure checkout powered by Razorpay.

## ✨ Features

- **Modern Frontend Interface**: Built with React 19, Vite, and styled with Tailwind CSS & Radix UI primitives.
- **State Management**: Scalable global state management using Redux Toolkit and `redux-persist` for local storage persistence.
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing and OTP-based email verification via Nodemailer.
- **Product Management**: Dynamic grid display, advanced filtering (by category, price, brand) and searching.
- **Image Hosting**: Cloudinary integration for scalable product image and media asset management via Multer.
- **Dynamic Cart**: Real-time cart updates, quantity management, and secure order processing.
- **Payment Gateway Integration**: Built-in Razorpay checkout flow securely handled via the backend.
- **Admin & User Dashboards**: Order history tracking and an admin interface to manage/process orders.

## 🛠️ Tech Stack

### Frontend (`/client`)
- **Framework**: React 19
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4, Radix UI Components
- **State**: Redux Toolkit & React-Redux, Redux-Persist
- **Routing**: React Router DOM
- **Data Fetching**: Axios
- **Notifications**: Sonner

### Backend (`/server`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JsonWebToken (JWT), Bcrypt
- **Media**: Cloudinary, Multer, DataURI
- **Payments**: Razorpay Node SDK
- **Mailing**: Nodemailer

---

## 🚀 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.
You will also need a [MongoDB](https://www.mongodb.com/) cluster, a [Cloudinary](https://cloudinary.com/) account, and a [Razorpay](https://razorpay.com/) test account.

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd ecomerce
```

### 2. Backend Setup (`/server`)

Open a terminal and navigate to the `server` directory:

```bash
cd server
npm install
```

**Environment Variables:**
Create a `.env` file in the `server` directory and add the following keys. Replace the placeholders with your actual credentials:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string

# Auth
JWT_SECRET=your_secret_key

# Email (Nodemailer)
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# Media (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payments (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**Start the Server:**
```bash
npm run dev
```
The backend server will start running on `http://localhost:3000`.

### 3. Frontend Setup (`/client`)

Open a *new* terminal window and navigate to the `client` directory:

```bash
cd client
npm install
```

**Environment Variables:**
Create a `.env` file in the `client` directory:

```env
VITE_BASE_URL=http://localhost:3000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```
*(Note: `VITE_RAZORPAY_KEY_ID` must match the key you provided to the backend.)*

**Start the Client:**
```bash
npm run dev
```
The frontend application will start running on `http://localhost:5173`.

---

## 🏗️ Project Structure

```text
ecomerce/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components (ProductCard, Navbar, UI Library)
│   │   ├── pages/          # Page Views (Home, Cart, Order, Profile)
│   │   ├── redux/          # Redux Store & Slices
│   │   └── App.jsx         # App Routing
│   ├── .env                # React Environment Variables (VITE_BASE_URL...)
│   └── package.json        
├── server/                 # Node.js + Express Backend
│   ├── config/             # DB & Cloudinary Configuration
│   ├── controllers/        # Route Handlers (cart, order, user, payment)
│   ├── middlewares/        # Auth & Multer middleware
│   ├── models/             # Mongoose Schemas (User, Product, Order)
│   ├── routes/             # API Endpoints
│   ├── .env                # Express Environment Variables (MONGO_URI...)
│   └── server.js           # Server Entry Point
└── README.md
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📄 License
This project is licensed under the ISC License.
