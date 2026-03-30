# College Placement Tracking System

A comprehensive full-stack web application to manage and track college student placements, built with React.js (frontend) and Node.js/Express (backend) with MongoDB.

## Features

- 🔐 **JWT Authentication** — Login with College USN, default password: `Torii@123`
- 📝 **Student Registration** — Register for placement drives with full profile
- 👤 **Student Profile** — View complete profile and placement records
- 🏢 **Company Profiles** — Browse companies visiting for campus recruitment
- 📊 **Analytics Dashboard** — Branch-wise stats, placement rates, company insights
- 📈 **Reports** — Detailed placement reports with CSV export
- 📱 **Responsive Design** — Works on mobile and desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, React Router v6, Chart.js |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Styling | Custom CSS (responsive) |

## Project Structure

```
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # UI Components (Login, Dashboard, etc.)
│       ├── services/       # API service layer
│       └── styles/         # CSS stylesheets
├── server/                 # Express backend
│   ├── models/             # Mongoose models (Student, Company, Placement, Event)
│   ├── routes/             # API routes (auth, students, companies, placements, reports)
│   ├── middleware/         # Auth & error handling middleware
│   └── index.js
├── docs/                   # Documentation
└── README.md
```

## Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd server
npm install
cp .env.example .env          # Edit with your MongoDB URI and JWT secret
npm run dev                   # Starts on http://localhost:5000
```

### Frontend Setup
```bash
cd client
npm install
npm start                     # Starts on http://localhost:3000
```

## Login Credentials

| Field | Value |
|-------|-------|
| Username | Your College USN (e.g. `1NC21CS001`) |
| Default Password | `Torii@123` |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/forgot-password` | Reset password |
| GET | `/api/students` | Get students |
| POST | `/api/students/register` | Register for placement |
| GET | `/api/companies` | Get company profiles |
| GET | `/api/placements` | Get placements |
| GET | `/api/reports/dashboard` | Dashboard analytics |
| GET | `/api/reports/export/placements` | Export placement data |

See [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) for full API reference.

## Deployment

- **Backend**: Deploy to [Render](https://render.com) or [Railway](https://railway.app)
- **Frontend**: Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)

See [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for step-by-step instructions.

## License

[MIT](LICENSE)
