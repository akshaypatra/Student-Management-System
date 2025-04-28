import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function UpdateClassroom() {
    
  const { classroomId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    teacher: "",
    students: [],
  });

  const navigate=useNavigate();

  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentClassroom, setCurrentClassroom] = useState(null); // New state to hold the selected classroom

  // Fetch classrooms and set the current classroom based on the classroomId
  useEffect(() => {
    async function fetchClassrooms() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/attendance/classrooms/"
        );
        const data = await response.json();
        if (response.ok) {
          setClassrooms(data); // Store the list of classrooms
          // Now filter and set the specific classroom based on classroomId
          const classroom = data.find(
            (classroom) => classroom.id.toString() === classroomId
          );
          if (classroom) {
            setCurrentClassroom(classroom);
            setFormData({
              name: classroom.name,
              subject: classroom.subject.name,
              teacher: classroom.teacher,
              students: classroom.students.join(", "), // Convert students array to a comma-separated string for easier editing
            });
          } else {
            alert("Classroom not found.");
          }
          setLoading(false);
        } else {
          alert("Failed to fetch classrooms.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error during classroom fetch:", error);
        alert("An error occurred while fetching classrooms.");
        setLoading(false);
      }
    }

    fetchClassrooms();
  }, [classroomId]); // Refetch classrooms only if classroomId changes

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // No splitting here
  };

  // Handle form submit (update classroom)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare payload for updating the classroom
    const payload = {
      name: formData.name,
      subject: formData.subject,
      teacher: formData.teacher,
      students: formData.students.split(",").map((student) => student.trim()), // Now split it properly here
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/attendance/classrooms/${classroomId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
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
      console.error("Error during classroom update:", error);
      alert("An error occurred while updating the classroom.");
    }
  };

  // Handle delete request
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this classroom?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/attendance/classrooms/${classroomId}/delete/`,
          {
            method: "DELETE", // DELETE request to remove the classroom
          }
        );

        if (response.ok) {
          alert("Classroom deleted successfully!");
          setFormData({
            name: "",
            subject: "",
            teacher: "",
            students: [], 
          });
          navigate("/admin-dashboard");
        } else {
          alert("Error: Failed to delete the classroom.");
        }
      } catch (error) {
        console.error("Error during classroom delete:", error);
        alert("An error occurred while deleting the classroom.");
      }
    }
  };

  // Show a loading message if still fetching classrooms
  if (loading) {
    return <div>Loading classrooms...</div>;
  }

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card p-5 shadow"
        style={{ width: "100%", maxWidth: "550px" }}
      >
        {/* Heading */}
        <h2
          className="text-center mb-4 text-success fw-bold"
          style={{ fontSize: "2rem" }}
        >
          Update Classroom
        </h2>

        {/* Update Classroom Form */}
        <form onSubmit={handleSubmit}>
          {/* ID is not editable */}
          <div className="mb-4">
            <label
              htmlFor="id"
              className="form-label"
              style={{ fontSize: "1.1rem" }}
            >
              Classroom ID
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="id"
              name="id"
              value={classroomId} // The ID is passed as a prop and cannot be changed here
              readOnly
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="form-label"
              style={{ fontSize: "1.1rem" }}
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
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="subject"
              className="form-label"
              style={{ fontSize: "1.1rem" }}
            >
              Subject
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="teacher"
              className="form-label"
              style={{ fontSize: "1.1rem" }}
            >
              Teacher
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="teacher"
              name="teacher"
              value={formData.teacher}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="students"
              className="form-label"
              style={{ fontSize: "1.1rem" }}
            >
              Students (comma separated)
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="students"
              name="students"
              value={formData.students} 
              onChange={handleChange}
              required
            />
          </div>

          <div className="d-grid mb-4">
            <button type="submit" className="btn btn-success btn-lg">
              Update Classroom
            </button>
          </div>
        </form>

        {/* Delete Button */}
        <div className="d-grid">
          <button
            type="button"
            className="btn btn-danger btn-lg"
            onClick={handleDelete}
          >
            Delete Classroom
          </button>
        </div>
      </div>
    </div>
  );
}
