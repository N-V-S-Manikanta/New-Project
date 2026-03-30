# API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-backend.render.com/api`

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Routes

### POST /auth/login
Login with USN and password.

**Request Body:**
```json
{
  "usn": "1NC21CS001",
  "password": "Torii@123"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": "...",
    "usn": "1NC21CS001",
    "name": "John Doe",
    "email": "john@college.edu",
    "branch": "CSE",
    "role": "student",
    "placementStatus": "Not Placed"
  }
}
```

---

### POST /auth/forgot-password
Reset password to default.

**Request Body:**
```json
{
  "usn": "1NC21CS001",
  "email": "john@college.edu"
}
```

---

### POST /auth/change-password *(Protected)*
Change current password.

**Request Body:**
```json
{
  "currentPassword": "Torii@123",
  "newPassword": "NewPass@456"
}
```

---

### GET /auth/me *(Protected)*
Get current user profile.

---

## Student Routes

### GET /students *(Protected)*
Get students list. Admin gets all; students get only their own.

### GET /students/:id *(Protected)*
Get student by ID.

### POST /students/register *(Protected)*
Register/update profile for placement drive.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@college.edu",
  "phone": "9876543210",
  "branch": "CSE",
  "batch": "2021-2025",
  "cgpa": 8.5,
  "skills": ["Java", "Python", "React"]
}
```

### PUT /students/:id *(Protected)*
Update student profile.

### GET /students/:id/placements *(Protected)*
Get all placements for a student.

---

## Company Routes

### GET /companies *(Protected)*
Get all active companies.

### GET /companies/:id *(Protected)*
Get company details by ID.

### POST /companies *(Admin only)*
Add a new company.

**Request Body:**
```json
{
  "name": "TCS",
  "description": "Leading IT company",
  "industry": "IT Services",
  "website": "https://tcs.com",
  "salaryPackage": {
    "minimum": 3.5,
    "maximum": 7.0,
    "currency": "LPA"
  },
  "eligibleBranches": ["CSE", "ISE", "ECE"],
  "minimumCGPA": 6.5,
  "jobProfile": "Software Engineer",
  "location": "Bangalore",
  "recruitmentPeriod": {
    "start": "2025-01-01",
    "end": "2025-03-31"
  }
}
```

### PUT /companies/:id *(Admin only)*
Update company details.

### DELETE /companies/:id *(Admin only)*
Deactivate company.

---

## Placement Routes

### GET /placements *(Protected)*
Get placements. Admin gets all; students get own.

### GET /placements/:id *(Protected)*
Get placement by ID.

### POST /placements *(Admin only)*
Record a placement.

**Request Body:**
```json
{
  "student": "<student_id>",
  "company": "<company_id>",
  "package": 6.5,
  "jobProfile": "Software Engineer",
  "location": "Bangalore",
  "placementDate": "2025-02-15",
  "status": "Offer Letter Received"
}
```

### PUT /placements/:id *(Admin only)*
Update placement record.

---

## Report Routes

### GET /reports/dashboard *(Protected)*
Get comprehensive dashboard analytics.

**Response:**
```json
{
  "summary": {
    "totalStudents": 120,
    "placedStudents": 85,
    "notPlacedStudents": 35,
    "placementPercentage": "70.83",
    "totalCompanies": 15,
    "totalPlacements": 90
  },
  "branchStats": [...],
  "packageDistribution": [...],
  "companyStats": [...],
  "monthlyTrend": [...]
}
```

### GET /reports/branch/:branch *(Protected)*
Get detailed report for a specific branch (CSE, ISE, ECE, etc.)

### GET /reports/events *(Protected)*
Get event attendance report.

### GET /reports/export/placements *(Protected)*
Export all placement data as JSON (convert to CSV in frontend).

---

## Error Responses

| Code | Description |
|------|-------------|
| 400 | Bad Request — Validation error |
| 401 | Unauthorized — Invalid/expired token |
| 403 | Forbidden — Insufficient permissions |
| 404 | Not Found |
| 500 | Internal Server Error |
