# 🏨 QuickStay — Hotel Booking Platform

A full-stack hotel booking web application built with **React**, **Node.js**, **Express**, and **MongoDB**. QuickStay allows users to search and book hotel rooms, while hotel owners can manage their properties, rooms, and bookings through a dedicated dashboard.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [User Roles](#user-roles)
- [Screenshots / Pages](#screenshots--pages)
- [Deployment](#deployment)

---

## ✨ Features

### For Guests / Users
- 🔍 **Browse & Search Rooms** — Filter available rooms by city, dates, and guest count
- 🏠 **Room Details** — View room images, amenities, pricing, and hotel info with an interactive map
- 📅 **Book Rooms** — Real-time availability checking before booking
- 💳 **Two Payment Options** — Pay at hotel (free booking) or pay online via **Stripe**
- 📋 **My Bookings** — View all personal bookings with status and payment info
- 🔐 **Auth System** — Register, login, and session management with JWT
- 🕵️ **Recent Search History** — Automatically saves the last 5 searched cities per user

### For Hotel Owners
- 🏢 **Hotel Registration** — Register a hotel with details, amenities, location, and images
- 🛏️ **Room Management** — Add, edit, toggle availability, and delete rooms
- 📊 **Owner Dashboard** — View total bookings, total revenue, and recent booking list
- 📷 **Image Uploads** — Upload room and hotel images via Cloudinary
- 🗺️ **Map Integration** — Hotel location displayed via Leaflet maps

### General
- 📬 **Newsletter Subscription** — Email subscription powered by Nodemailer
- ⭐ **Reviews & Ratings** — Users can rate and review hotels
- 📱 **Responsive Design** — Mobile-friendly UI built with Tailwind CSS
- 🔔 **Toast Notifications** — Real-time feedback using `react-hot-toast`

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Vite 7 | Build tool & dev server |
| React Router DOM 7 | Client-side routing |
| Tailwind CSS 4 | Utility-first styling |
| Axios | HTTP requests |
| React Leaflet | Interactive hotel location maps |
| React Hot Toast | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Token (JWT) | Authentication |
| bcryptjs | Password hashing |
| Stripe | Online payment processing |
| Cloudinary + Multer | Image upload & cloud storage |
| Nodemailer | Email (newsletter) |
| dotenv | Environment variable management |

---

## 📁 Project Structure

```
QuickStay-main/
├── client/                         # React frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/                 # Images, icons, and static assets
│   │   ├── components/             # Reusable UI components
│   │   │   ├── ExclusiveOffer.jsx
│   │   │   ├── FeaturedDestination.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── HotelCard.jsx
│   │   │   ├── HotelReg.jsx        # Hotel registration modal
│   │   │   ├── LocationMap.jsx     # Leaflet map component
│   │   │   ├── Navbar.jsx
│   │   │   ├── NewsLetter.jsx
│   │   │   ├── RecommendedHotel.jsx
│   │   │   ├── StarRating.jsx
│   │   │   ├── Testimonial.jsx
│   │   │   ├── Title.jsx
│   │   │   └── hotelOwner/
│   │   │       ├── Navbar.jsx      # Owner-specific navbar
│   │   │       └── Sidebar.jsx     # Owner dashboard sidebar
│   │   ├── context/
│   │   │   └── AppContext.jsx      # Global state (user, token, rooms)
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── AllRooms.jsx        # Room listing with filters
│   │   │   ├── RoomDetails.jsx     # Single room detail + booking
│   │   │   ├── MyBookings.jsx      # User's booking history
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── hotelOwner/
│   │   │       ├── Layout.jsx      # Owner layout wrapper
│   │   │       ├── Dashboard.jsx   # Revenue & booking stats
│   │   │       ├── AddRoom.jsx     # Add new room form
│   │   │       ├── ListRoom.jsx    # Manage existing rooms
│   │   │       └── EditRoom.jsx    # Edit room details
│   │   ├── App.jsx                 # Route definitions
│   │   ├── main.jsx                # App entry point
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json                 # Vercel SPA routing config
│   └── package.json
│
└── server/                         # Node.js backend
    ├── configs/
    │   ├── db.js                   # MongoDB connection
    │   ├── cloudinary.js           # Cloudinary + multer setup
    │   └── nodemailer.js           # Email config
    ├── controllers/
    │   ├── authController.js       # Register, login, getMe
    │   ├── bookingController.js    # Booking + Stripe logic
    │   ├── hotelController.js      # Hotel CRUD
    │   ├── roomController.js       # Room CRUD
    │   └── reviewController.js     # Review system
    ├── middleware/
    │   └── authMiddleware.js       # JWT protect + isOwner guard
    ├── models/
    │   ├── User.js
    │   ├── Hotel.js
    │   ├── Room.js
    │   ├── Booking.js
    │   └── Review.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   ├── hotelRoutes.js
    │   ├── roomRouter.js
    │   ├── bookingRoutes.js
    │   └── reviewRoutes.js
    ├── server.js                   # Express app entry point
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A **MongoDB** database (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- A **Cloudinary** account (for image uploads)
- A **Stripe** account (for online payments)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/QuickStay.git
cd QuickStay
```

### 2. Set Up the Backend (Server)

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory (see [Environment Variables](#environment-variables) section below).

Start the development server:

```bash
npm run server     # with nodemon (hot reload)
# or
npm start          # production
```

The server will run at **http://localhost:3000**

### 3. Set Up the Frontend (Client)

```bash
cd client
npm install
```

Create a `.env` file inside the `client/` directory:

```env
VITE_API_URL=http://localhost:3000
```

Start the React development server:

```bash
npm run dev
```

The client will run at **http://localhost:5173**

---

## 🔐 Environment Variables

### Server — `server/.env`

```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/quickstay

# JWT
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# App URLs
CLIENT_URL=http://localhost:5173
PORT=3000

# Nodemailer (optional, for newsletter)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Client — `client/.env`

```env
VITE_API_URL=http://localhost:3000
```

---

## 📡 API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Create a new user account |
| POST | `/login` | ❌ | Login and receive JWT token |
| GET | `/me` | ✅ | Get current authenticated user |

### User — `/api/user`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PATCH | `/become-owner` | ✅ | Upgrade user role to hotel owner |
| PATCH | `/recent-searches` | ✅ | Save a recently searched city (max 5) |

### Hotels — `/api/hotels`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ❌ | Get all active hotels |
| POST | `/register` | ✅ | Register a new hotel |
| GET | `/owner` | ✅ Owner | Get the authenticated owner's hotel |

### Rooms — `/api/rooms`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ❌ | Get all available rooms |
| POST | `/` | ✅ Owner | Create a new room (with image upload) |
| GET | `/owner` | ✅ Owner | Get all rooms for the owner's hotel |
| POST | `/toggle-availability` | ✅ Owner | Toggle a room's availability status |
| PUT | `/update-room` | ✅ Owner | Update room details |
| DELETE | `/delete-room` | ✅ Owner | Delete a room |

### Bookings — `/api/booking`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/check-availability` | ❌ | Check if a room is available for given dates |
| POST | `/book` | ✅ | Create a booking (Pay at Hotel) |
| GET | `/user` | ✅ | Get all bookings for the logged-in user |
| GET | `/hotel` | ✅ Owner | Get all bookings for the owner's hotel |
| POST | `/stripe-session` | ✅ | Create a Stripe checkout session |
| POST | `/verify-stripe` | ✅ | Confirm and verify a Stripe payment |

### Reviews — `/api/reviews`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ | Submit a review for a hotel |

---

## 👥 User Roles

QuickStay supports three user roles:

| Role | Access |
|---|---|
| `user` | Browse rooms, make bookings, view their own bookings |
| `hotelOwner` | Everything a user can do + manage hotel, rooms, and view bookings/revenue dashboard |
| `admin` | Full access (same as hotelOwner in the current implementation) |

A regular user can **self-upgrade** to `hotelOwner` by registering their hotel through the Hotel Registration modal in the UI.

---

## 🗺️ Screenshots / Pages

| Route | Page |
|---|---|
| `/` | Home — Hero, featured destinations, exclusive offers, testimonials |
| `/rooms` | All Rooms — filterable room listing |
| `/rooms/:id` | Room Details — images, amenities, booking form, hotel map |
| `/my-bookings` | User's booking history |
| `/login` | Login page |
| `/register` | Register page |
| `/owner` | Owner Dashboard — stats & recent bookings |
| `/owner/add-room` | Add new room |
| `/owner/list-room` | Manage existing rooms |
| `/owner/edit-room/:id` | Edit a specific room |

---

## ☁️ Deployment

### Client — Vercel

The client includes a `vercel.json` that redirects all routes to `index.html` for proper SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

Deploy with:
```bash
vercel --prod
```

Set `VITE_API_URL` to your production backend URL in Vercel's environment variables.

### Server — Render / Railway / any Node.js host

The server is configured to accept requests from:
- `http://localhost:5173` (development)
- `https://quickstay-client.onrender.com` (production)

Update the CORS `origin` array in `server/server.js` to match your deployed client URL.

---

## 📦 Scripts

### Server
```bash
npm run server    # Development (nodemon)
npm start         # Production
```

### Client
```bash
npm run dev       # Development server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint check
```

---

## 📄 License

This project is licensed under the **ISC License**.

---

> Built with ❤️ by Ishaan
