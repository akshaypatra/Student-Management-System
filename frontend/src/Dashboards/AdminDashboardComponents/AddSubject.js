import React from 'react'
import { useState } from 'react';

export default function AddSubject() {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Creating the payload
    const payload = {
      code: formData.code,
      name: formData.name,
    };
    const token = localStorage.getItem("access_token");

    try {
      // Sending a POST request to the API
      const response = await fetch("https://classify-backend-zstl.onrender.com/api/attendance/subjects/create/", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("Subject created successfully!");
        setFormData({ code: "", name: "" }); // Clear form after successful registration
      } else {
        alert(`Error: ${data.message || "Failed to create"}`);
      }
    } catch (error) {
      console.error("Error during creation :", error);
      alert("An error occurred while creating the subject. Please try again.");
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
        {/* Heading */}
        <h2
          className="text-center mb-4 text-primary fw-bold"
          style={{ fontSize: "2rem" }}
        >
          Add Subject
        </h2>

        {/* subject Form */}
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
            <label
              htmlFor="code"
              className="form-label"
              style={{ fontSize: "1.1rem" }}
            >
              Subject Code
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="form-label"
              style={{ fontSize: "1.1rem" }}
            >
              Subject Name
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
