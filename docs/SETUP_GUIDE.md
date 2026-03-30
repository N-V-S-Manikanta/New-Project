# Setup Guide

## Prerequisites

- **Node.js** >= 18.0.0 — [Download](https://nodejs.org)
- **MongoDB** — [Local](https://www.mongodb.com/try/download/community) or [Atlas (cloud)](https://www.mongodb.com/cloud/atlas)
- **Git** — [Download](https://git-scm.com)

---

## 1. Clone the Repository

```bash
git clone https://github.com/N-V-S-Manikanta/New-Project.git
cd New-Project
```

---

## 2. Backend Setup

```bash
cd server
npm install
```

Create the environment file:
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/placement_tracker
JWT_SECRET=your_strong_secret_key_minimum_32_characters
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev       # Development (with auto-reload)
npm start         # Production
```

The API will be available at `http://localhost:5000`

---

## 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file (optional — uses proxy by default):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the React app:
```bash
npm start
```

The app will open at `http://localhost:3000`

---

## 4. MongoDB Atlas (Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or `0.0.0.0/0` for all)
5. Copy the connection string
6. Set `MONGODB_URI` in your `.env` file

Example URI:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/placement_tracker?retryWrites=true&w=majority
```

---

## 5. Creating an Admin Account

After starting the server, you can seed an admin user by connecting to MongoDB and inserting:

```javascript
// Using mongosh
use placement_tracker

db.students.insertOne({
  usn: "ADMIN001",
  name: "Placement Admin",
  email: "admin@college.edu",
  phone: "9999999999",
  branch: "CSE",
  batch: "2021-2025",
  role: "admin",
  placementStatus: "Not Placed",
  isActive: true
})
```

Then login with `ADMIN001` / `Torii@123` and the system will set the password automatically.

---

## 6. Running Tests

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

---

## Default Login

| Field | Value |
|-------|-------|
| USN | Any valid college USN (e.g. `1NC21CS001`) |
| Password | `Torii@123` |

> On first login with a new USN using the default password, the system automatically creates the student account.
