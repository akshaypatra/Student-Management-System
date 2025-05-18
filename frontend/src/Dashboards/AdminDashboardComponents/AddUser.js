import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AddUser() {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle visibility

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible); // Toggle the password visibility
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Creating the payload
    const payload = {
      id: formData.id,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };
    const token = localStorage.getItem("access_token");


    try {
      // Sending a POST request to the API
      const response = await fetch("https://classify-backend-zstl.onrender.com/api/register/", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("User Registered successfully!");
        setFormData({ id: "", name: "", email: "", password: "", role: "" }); // Clear form after successful registration
      } else {
        alert(`Error: ${data.message || "Failed to register"}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred while registering the user. Please try again.");
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
          User Registration
        </h2>

        {/* User Registration Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="form-label"
              style={{ fontSize: "1.1rem" }}
            >
              Name
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
              htmlFor="id"
              className="form-label"
              style={{ fontSize: "1.1rem" }}
            >
              ID
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <select
              className="form-control form-control-lg"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option> {/* Default placeholder option */}
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="form-label"
              style={{ fontSize: "1.1rem" }}
            >
              Email Address
            </label>
            <input
              type="email"
              className="form-control form-control-lg"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="form-label"
              style={{ fontSize: "1.1rem" }}
            >
              Password
            </label>
            <div className="input-group">
              <input
                type={passwordVisible ? "text" : "password"}
                className="form-control form-control-lg"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="input-group-eye-button"
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer"}}
              >
                {passwordVisible ? (
                  <FaEyeSlash style={{ fontSize: "1.5rem" }} />
                ) : (
                  <FaEye style={{ fontSize: "1.5rem" }} />
                )}
              </button>
            </div>
          </div>

          <div className="d-grid mb-4">
            <button type="submit" className="btn btn-primary btn-lg">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
