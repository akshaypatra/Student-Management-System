
## ⚙️ Tech Stack

| Layer     | Tool                         |
|-----------|------------------------------|
| Backend   | Django, Django REST Framework |
| Auth      | JWT (SimpleJWT)              |
| Database  | MySQL                        |

---

## 🔗 API Endpoints

Base URL: `http://127.0.0.1:8000`

| Method | Endpoint                          | Description                          | Required Payload (JSON)                                                                                                                                       | Response Example                                                                                                                                         |
|--------|-----------------------------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| POST   | `/api/register/`                  | Register a new user (student/teacher) | `{ "id": "T001", "name": "Alice", "email": "alice@example.com", "password": "pass123", "role": "teacher" }`                                                  | `{ "message": "User registered successfully." }`                                                                                                          |
| POST   | `/api/login/`                     | Login and receive JWT token          | `{ "id": "T001", "password": "pass123" }`                                                                                                                    | `{ "access": "...", "refresh": "..." }`                                                                                                                  |
| GET    | `/api/students/`                  | Get all students (Auth required)     | Header: `Authorization: Bearer <access_token>`                                                                                                               | `[{"id": "S001", "name": "John", "email": "john@example.com"}]`                                                                                          |
| GET    | `/api/teachers/`                  | Get all teachers (Auth required)     | Header: `Authorization: Bearer <access_token>`                                                                                                               | `[{"id": "T001", "name": "Alice", "email": "alice@example.com"}]`                                                                                        |
| DELETE | `/api/delete-user/<str:user_id>/` | Delete specified user (Auth required) | Header: `Authorization: Bearer <access_token>`                                                                                                               | `{ "detail": "User deleted successfully." }`                                                                                                              |

---




| **Category**          | **Endpoint**                                 | **Method** | **Description**                           |
| --------------------- | -------------------------------------------- | ---------- | ----------------------------------------- |
| 🔹 Classroom          | `/classrooms/create/`                        | POST       | Create a new classroom                    |
|                       | `/classrooms/`                               | GET        | Get a list of all classrooms              |
|                       | `/classrooms/<int:classroom_id>/`            | GET        | Get details of a specific classroom       |
|                       | `/classrooms/<int:classroom_id>/update/`     | PUT/PATCH  | Update details of a specific classroom    |
|                       | `/classrooms/<int:classroom_id>/delete/`     | DELETE     | Delete a specific classroom               |
| 🔸 Attendance         | `/mark/`                                     | POST       | Mark attendance for students              |
|                       | `/classrooms/<int:classroom_id>/attendance/` | GET        | Get attendance records for a classroom    |
|                       | `/update/`                                   | PUT/PATCH  | Update existing attendance                |
| 🟢 Queries            | `/queries/create/`                           | POST       | Student creates a new query               |
|                       | `/queries/`                                  | GET        | Admin/faculty view all queries            |
|                       | `/queries/<int:pk>/update-status/`           | PUT/PATCH  | Update the status of a query (admin side) |
|                       | `/queries/student-status/`                   | GET        | Student views their query status          |
| 🔵 Subject Management | `/subjects/create/`                          | POST       | Create a new subject                      |
|                       | `/subjects/`                                 | GET        | Get a list of all subjects                |
|                       | `/subjects/delete/<int:subject_id>/`         | DELETE     | Delete a specific subject                 |
|                       | `/subjects/update/<int:subject_id>/`         | PUT/PATCH  | Update a specific subject                 |



## 🧑‍💻 Author
Akshay Patra

