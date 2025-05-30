import React, { useState, useEffect } from "react";
import baseUrl from "../BaseUrl";
export default function QueriesForm() {
  const [formData, setFormData] = useState({
    teacher: "",
    message: "",
  });
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch(`${baseUrl}/api/teachers/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTeachers(data);
        } else {
          alert("Failed to fetch teachers");
        }
      } catch (error) {
        alert("An error occurred while fetching teachers. Please try again.");
      }
    };

    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`${baseUrl}/api/attendance/queries/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Query sent successfully!");
        setFormData({ teacher: "", message: "" });
      } else {
        alert(`Error: ${data.message || "Failed to send query"}`);
      }
    } catch (error) {
      alert("An error occurred while sending the query. Please try again.");
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
          Send a Query
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label" style={{ fontSize: "1.1rem" }}>
              Search Teacher
            </label>
            <input
              type="text"
              className="form-control form-control-lg mb-2"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="form-control form-control-lg"
              name="teacher"
              value={formData.teacher}
              onChange={handleChange}
              required
            >
              <option value="">Select a teacher</option>
              {filteredTeachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.id}-{teacher.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="message"
              className="form-label"
              style={{ fontSize: "1.1rem" }}
            >
              Message
            </label>
            <textarea
              className="form-control form-control-lg"
              id="message"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="d-grid mb-4">
            <button type="submit" className="btn btn-primary btn-lg">
              Send Query
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
