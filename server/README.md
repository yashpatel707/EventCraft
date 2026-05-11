# EventCraft Server

## Setup

1. Copy `.env.example` to `.env` and fill:
   - `MONGO_URI`: MongoDB connection (Atlas recommended)
   - `JWT_SECRET`: Random string
   - `RAZORPAY_KEY`, `RAZORPAY_SECRET`: Razorpay test keys (dashboard.razorpay.com)
   - `EMAIL`, `EMAIL_PASS`: Gmail app password for emails
2. `npm install`
3. `npm start`

## API

- POST /api/auth/register {email, password, role}
- POST /api/auth/login {email, password}
- Protected: /api/bookings, /api/payment/create-order

Port: 5000
