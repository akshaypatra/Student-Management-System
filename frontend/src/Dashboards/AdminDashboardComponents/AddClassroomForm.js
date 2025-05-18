import React, { useEffect, useState } from "react";

export default function AddClassroomForm() {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    teacher: "",
    students_excel: null,
  });

  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    // Fetch teachers with token
    const token = localStorage.getItem("access_token");
    // Fetch subjects
    fetch("http://127.0.0.1:8000/api/attendance/subjects/", {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setSubjects)
      .catch((err) => console.error("Failed to fetch subjects:", err));

    
    fetch("http://127.0.0.1:8000/api/teachers/", {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setTeachers)
      .catch((err) => console.error("Failed to fetch teachers:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "students_excel") {
      setFormData({ ...formData, students_excel: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("subject", formData.subject); // subject ID
    submissionData.append("teacher", formData.teacher); // teacher ID
    submissionData.append("students_excel", formData.students_excel);
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/attendance/classrooms/create/",
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          method: "POST",
          body: submissionData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Classroom added successfully!");
        setFormData({
          name: "",
          subject: "",
          teacher: "",
          students_excel: null,
        });
      } else {
        alert(`Error: ${data.message || "Failed to create classroom"}`);
      }
    } catch (error) {
      console.error("Error during classroom creation:", error);
      alert("An error occurred while creating the classroom.");
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card p-5 shadow"
        style={{ width: "100%", maxWidth: "550px" }}
      >
        <h2
          className="text-center mb-4 text-primary fw-bold"
          style={{ fontSize: "2rem" }}
        >
          Add Classroom
        </h2>

        <form onSubmit={handleSubmit} className="add-classroom-form" encType="multipart/form-data">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="form-label"
              style={{ fontSize: "1.3rem" }}
            >
              Classroom Name
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g  TYCORE5-ADL"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="subject"
              className="form-label"
              style={{ fontSize: "1.3rem" }}
            >
              Select Subject
            </label>
            <select
              className="form-select form-select-lg"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="">-- Choose Subject --</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="teacher"
              className="form-label"
              style={{ fontSize: "1.3rem" }}
            >
              Select Teacher
            </label>
            <select
              className="form-select form-select-lg"
              id="teacher"
              name="teacher"
              value={formData.teacher}
              onChange={handleChange}
              required
            >
              <option value="">-- Choose Teacher --</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="students_excel"
              className="form-label"
              style={{ fontSize: "1.3rem" }}
            >
              Upload Students Excel File
            </label>
            <div className="input-group input-group-lg">
              <input
                type="file"
                className="form-control"
                id="students_excel"
                name="students_excel"
                accept=".xlsx, .xls"
                onChange={handleChange}
                required
              />
              
            </div>
            <div className="form-text text-muted mt-1">
              Accepted formats: .xlsx, .xls
            </div>
          </div>

          <div className="d-grid mb-4">
            <button type="submit" className="btn btn-primary btn-lg">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
