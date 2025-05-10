# 🎓 Classify : Smart Student Management System

A full-stack web application for educational institutions to streamline **attendance**, **classroom management**, and **student-teacher communication**.

## 🚀 Features

### 🛠️ Admin Panel
- Register users (students, teachers, admins)
- Manage user roles and permissions
- Create classrooms and assign teachers
- Monitor all classroom activities

### 👨‍🏫 Teacher Dashboard
- Mark student attendance (daily/period-wise)
- View detailed attendance analytics
- Respond to student queries and update requests

### 👨‍🎓 Student Portal
- View real-time attendance data
- Submit attendance correction requests
- Track personal attendance analytics

---

## 📊 Attendance Analytics
- Per-student and per-class attendance visualization
- Daily present count and trends
- Export attendance to CSV
- Highlight irregular attendance patterns

---

## 🧰 Tech Stack

| Layer         | Technology                     |
|---------------|---------------------------------|
| Frontend      | React.js, Bootstrap, Axios      |
| Backend       | Django, Django REST Framework   |
| Database      | PostgreSQL / MySQL              |
| Authentication| JWT (Token-based Auth)          |
| File Export   | PapaParse for CSV               |

---


## Note :  Project Screenshots are added in Project details file


## ✅ Setup Instructions

### Backend (Django)

```bash
git clone https://github.com/your-repo.git
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver

```


### Frontend (Rect)

```bash
cd frontend
npm install
npm start
```