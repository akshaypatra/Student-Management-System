
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

## 🧑‍💻 Author
Akshay Patra

