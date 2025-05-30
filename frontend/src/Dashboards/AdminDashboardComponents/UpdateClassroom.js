import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import baseUrl from "../BaseUrl";
export default function UpdateClassroom() {
  const { classroomId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    teacher: "",
    students: [],
  });


  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClassroom() {
      const token = localStorage.getItem('access_token'); 
      try {
        const response = await fetch(
          `${baseUrl}/api/attendance/classrooms/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();

        const classroom = data.find(
          (classroom) => classroom.id.toString() === classroomId
        );

        if (classroom) {
          setFormData({
            name: classroom.name,
            subject: classroom.subject.name,
            teacher: classroom.teacher,
            students: classroom.students || [],
          });
        } else {
          alert("Classroom not found.");
        }

        // Get teachers list with token from localStorage
        
        const teacherRes = await fetch(`${baseUrl}/api/teachers/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const teacherData = await teacherRes.json();
        setTeachers(teacherData);

      } catch (error) {
        console.error("Error fetching classroom:", error);
        alert("An error occurred while fetching the classroom.");
      } finally {
        setLoading(false);
      }
    }

    fetchClassroom();
  }, [classroomId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStudentChange = (index, value) => {
    const updatedStudents = [...formData.students];
    updatedStudents[index] = value;
    setFormData({ ...formData, students: updatedStudents });
  };

  const handleAddStudent = () => {
    setFormData({ ...formData, students: [...formData.students, ""] });
  };

  const handleRemoveStudent = (index) => {
    const updatedStudents = formData.students.filter((_, i) => i !== index);
    setFormData({ ...formData, students: updatedStudents });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      teacher: formData.teacher,
      students: formData.students.map((s) => s.trim()).filter(Boolean),
    };

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${baseUrl}/api/attendance/classrooms/${classroomId}/update/`,
        {
          method: "PUT",
          headers: { 
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Classroom updated successfully!");
      } else {
        alert(`Error: ${data.message || "Failed to update classroom"}`);
      }
    } catch (error) {
      console.error("Error during update:", error);
      alert("An error occurred while updating the classroom.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this classroom?");
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `${baseUrl}/api/attendance/classrooms/${classroomId}/delete/`,
          { method: "DELETE",
            headers: { 
            'Authorization': `Bearer ${token}`}
           }
        );

        if (response.ok) {
          alert("Classroom deleted successfully!");
          navigate("/admin-dashboard");
        } else {
          alert("Failed to delete the classroom.");
        }
      } catch (error) {
        console.error("Error deleting classroom:", error);
        alert("An error occurred while deleting the classroom.");
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" id="classroom-update-container" style={{ minHeight: "100vh" }}>
      <div className="card p-5 shadow" id="classroom-update-container-1" style={{ width: "100%", maxWidth: "600px" }}>
        <h2 className="text-center mb-4 text-success fw-bold">Classroom Details</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label">Classroom ID</label>
            <input type="text" className="form-control" value={classroomId} readOnly />
          </div>

          <div className="mb-4">
            <label className="form-label">Classroom Name</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} readOnly />
          </div>

          <div className="mb-4">
            <label className="form-label">Subject</label>
            <input type="text" className="form-control" name="subject" value={formData.subject} onChange={handleChange} readOnly  />
          </div>

          <div className="mb-4">
            <label className="form-label">Teacher</label>
            <select
              name="teacher"
              className="form-control"
              value={formData.teacher}
              onChange={handleChange}
              required
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} ({teacher.email})
                </option>
              ))}
            </select>
          </div>

          <div className="classroom-update-students-container">
            <label className="form-label">  Students </label>
            <div id="classroom-update-students-innercontainer">
            {formData.students.map((student, index) => (
              <div className="input-group mb-2"  key={index}>
                <input
                  type="text"
                  className="form-control"
                  value={student}
                  onChange={(e) => handleStudentChange(index, e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => handleRemoveStudent(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            </div>
            <button type="button" className="btn btn-outline-primary" onClick={handleAddStudent}>
              Add Student
            </button>
          </div>

          <div className="d-grid mb-3">
            <button type="submit" className="btn btn-success btn-lg">Update Classroom</button>
          </div>
        </form>

        <div className="d-grid">
          <button type="button" className="btn btn-danger btn-lg" onClick={handleDelete}>Delete Classroom</button>
        </div>
      </div>
    </div>
  );
}
