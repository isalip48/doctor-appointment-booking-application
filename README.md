<create_file>
<path>README.md</path>
<description>Creating comprehensive README.md file in the project root</description>
<content># 🏥 DocSync - Doctor Appointment Booking System

A full-stack web application for booking doctor appointments with AI-powered medical assistance, built with Spring Boot and React Native Web.

[![Deploy Backend](https://github.com/isalip48/doctor-appointment-booking-application/actions/workflows/deploy.yml/badge.svg)](https://github.com/isalip48/doctor-appointment-booking-application/actions/workflows/deploy.yml)

## 🌐 Live Demo

- **Frontend:** [https://doctor-appointment-booking-applicat-gamma.vercel.app](https://doctor-appointment-booking-applicat-gamma.vercel.app)
- **Backend API:** [https://doctor-appointment-booking-application-production.up.railway.app/api](https://doctor-appointment-booking-application-production.up.railway.app/api)

## ✨ Features

### Patient Features
- 🔍 **Smart Search**: Search doctors by name, specialty, or hospital
- 📅 **Real-time Availability**: View and book available time slots
- 🆔 **Guest Booking**: Book appointments using NIC/Phone without creating an account
- 📱 **My Bookings**: Track all your appointments in one place
- 🤖 **AI Medical Assistant**: Get specialist recommendations based on symptoms (powered by Google Gemini)
- 📄 **Medical Report Analysis**: Upload and analyze medical reports with AI

### Admin Features
- 📊 **Dashboard**: Overview of doctors, hospitals, slots, and bookings
- 🏥 **Hospital Management**: Add and manage hospitals
- 👨‍⚕️ **Doctor Management**: Add doctors manually or via CSV import
- ⏰ **Slot Generation**: Bulk generate appointment slots with customizable duration
- 📋 **Booking Management**: View and manage all patient bookings
- 📈 **Analytics**: Track system usage and statistics

## 🛠️ Tech Stack

### Backend
- **Framework:** Spring Boot 3.5.10
- **Language:** Java 21
- **Database:** PostgreSQL
- **ORM:** Hibernate/JPA
- **Build Tool:** Maven
- **Deployment:** Railway

### Frontend
- **Framework:** React Native Web (Expo)
- **Routing:** Expo Router
- **Styling:** Tailwind CSS (NativeWind)
- **State Management:** React Query
- **HTTP Client:** Axios
- **AI Integration:** Google Gemini API
- **Deployment:** Vercel

### DevOps
- **CI/CD:** GitHub Actions
- **Version Control:** Git & GitHub
- **Backend Hosting:** Railway
- **Frontend Hosting:** Vercel
- **Database:** Railway PostgreSQL

## 📁 Project Structure
```
doctor-appointment-booking-application/
├── backend/                          # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/appointment/booking/
│   │   │   │       ├── config/       # CORS, security configs
│   │   │   │       ├── controller/   # REST endpoints
│   │   │   │       ├── entity/       # JPA entities
│   │   │   │       ├── repository/   # Data access layer
│   │   │   │       └── service/      # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                         # React Native Web frontend
│   ├── app/                         # Expo Router pages
│   │   ├── (tabs)/                  # Tab navigation
│   │   │   ├── index.tsx           # Landing page
│   │   │   ├── search.tsx          # Search page
│   │   │   ├── results.tsx         # Search results
│   │   │   ├── my-bookings.tsx     # User bookings
│   │   │   ├── ai-assistant.tsx    # AI medical assistant
│   │   │   └── medical-reports.tsx # Report analyzer
│   │   └── admin/                   # Admin panel
│   │       ├── login.tsx
│   │       ├── dashboard.tsx
│   │       ├── doctors.tsx
│   │       ├── hospitals.tsx
│   │       ├── slots.tsx
│   │       └── bookings.tsx
│   ├── components/                  # Reusable components
│   ├── api/                        # API client and services
│   ├── assets/                     # Images, fonts
│   ├── package.json
│   ├── app.json
│   └── vercel.json
│
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD pipeline
│
└── README.md
🚀 Getting Started
Prerequisites

Java 21 or higher
Node.js 18 or higher
PostgreSQL 14 or higher
Maven 3.8 or higher
npm or yarn

Backend Setup

Clone the repository

bash   git clone https://github.com/isalip48/doctor-appointment-booking-application.git
   cd doctor-appointment-booking-application

Configure database
Create a PostgreSQL database:

sql   CREATE DATABASE appointment_db;
Update backend/src/main/resources/application.properties:
properties   spring.datasource.url=jdbc:postgresql://localhost:5432/appointment_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password

Run the backend

bash   cd backend
   ./mvnw spring-boot:run
Backend will start at: http://localhost:8080
Frontend Setup

Install dependencies

bash   cd frontend
   npm install

Configure environment
Create frontend/.env:

env   EXPO_PUBLIC_API_URL=http://localhost:8080/api
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

Run the frontend

bash   npx expo start
```

   Press `w` to open in web browser at: `http://localhost:8081`

## 📋 API Endpoints

### Public Endpoints

#### Search & Booking
```
GET    /api/slots/search?query={query}&type={type}&date={date}
POST   /api/bookings
GET    /api/bookings/patient?nic={nic}&phone={phone}
GET    /api/bookings/{id}
```

### Admin Endpoints

#### Dashboard
```
GET    /api/admin/dashboard/stats
```

#### Hospitals
```
GET    /api/admin/hospitals
POST   /api/admin/hospitals
PUT    /api/admin/hospitals/{id}
DELETE /api/admin/hospitals/{id}
```

#### Doctors
```
GET    /api/admin/doctors
POST   /api/admin/doctors
PUT    /api/admin/doctors/{id}
DELETE /api/admin/doctors/{id}
POST   /api/admin/doctors/import-csv
```

#### Slots
```
GET    /api/admin/slots
POST   /api/admin/slots/generate
DELETE /api/admin/slots/{id}
```

#### Bookings
```
GET    /api/admin/bookings
PUT    /api/admin/bookings/{id}/status
DELETE /api/admin/bookings/{id}
🔐 Admin Access
Default Credentials:

Username: admin
Password: admin123

Access: Navigate to /admin/login on the frontend.
⚠️ Important: Change these credentials in production!
📊 Database Schema
Main Tables
hospitals

id (Primary Key)
name
address
phone
created_at

doctors

id (Primary Key)
name
specialization
hospital_id (Foreign Key)
phone
email
experience
qualifications
created_at

time_slots

id (Primary Key)
doctor_id (Foreign Key)
slot_date
start_time
end_time
is_booked
created_at

bookings

id (Primary Key)
slot_id (Foreign Key)
patient_nic
patient_phone
patient_name
patient_email
status (PENDING, CONFIRMED, CANCELLED)
created_at

🎨 Features Deep Dive
AI Medical Assistant
The AI assistant helps patients identify which medical specialist they should consult based on their symptoms.
How it works:

Patient describes symptoms in natural language
AI asks clarifying questions (max 2 questions)
AI recommends appropriate specialist (e.g., Cardiologist, Dermatologist)
Patient can then search for that specialty

Technology: Google Gemini 2.5 Flash API
Medical Report Analyzer
Upload medical reports (PDF/images) and get AI-powered analysis.
Features:

Extract key findings from reports
Identify abnormal values
Recommend appropriate specialist
Professional, empathetic responses

Slot Generation System
Admins can bulk-generate appointment slots:
Configuration:

Select doctor
Choose date
Set start time (e.g., 09:00)
Set end time (e.g., 17:00)
Set slot duration (e.g., 30 minutes)

Example: 09:00-17:00 with 30-min slots generates 16 slots automatically.
Guest Booking System
Patients can book without creating an account:
Required Information:

National ID (NIC)
Phone Number
Name
Email

Booking Retrieval: Use NIC + Phone to view all bookings.
🚀 Deployment
Automated Deployment (CI/CD)
Every push to main branch automatically:

✅ Runs backend tests
✅ Deploys backend to Railway
✅ Builds frontend
✅ Deploys frontend to Vercel

GitHub Actions Workflow: .github/workflows/deploy.yml
Manual Deployment
Deploy Backend to Railway
bashcd backend
railway login
railway up --detach
Deploy Frontend to Vercel
bashcd frontend
vercel --prod
🔧 Environment Variables
Backend (Railway)
envDATABASE_URL=postgresql://...
PGUSER=postgres
PGPASSWORD=your_password
PORT=8080
Frontend (Vercel)
envEXPO_PUBLIC_API_URL=https://your-backend-url.railway.app/api
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
🧪 Testing
Backend Tests
bashcd backend
./mvnw test
Frontend Tests
bashcd frontend
npm test
📦 Building for Production
Backend
bashcd backend
./mvnw clean package
java -jar target/booking-application.jar
Frontend
bashcd frontend
npx expo export --platform web
Output: frontend/dist/
🤝 Contributing

Fork the repository
Create a feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

📝 CSV Import Format
Doctor Import Template
csvname,specialization,hospitalName,phone,email,experience,qualifications
Dr. John Doe,Cardiologist,Apollo Hospital,+94771234567,john@hospital.lk,10 years,MBBS MD
Dr. Jane Smith,Dermatologist,Asiri Hospital,+94772345678,jane@hospital.lk,8 years,MBBS MD
Note: Hospital must exist before importing doctors.

👨‍💻 Author
Isali Perera

GitHub: @isalip48

🙏 Acknowledgments

Spring Boot
React Native
Expo
Google Gemini AI
Railway
Vercel

📞 Support
For support, email isalinethra16@gmail.com or open an issue on GitHub.