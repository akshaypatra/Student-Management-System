import React, { useState } from 'react';
import { BsChatSquareText } from "react-icons/bs";

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent successfully!');
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-5 shadow" style={{ width: '100%', maxWidth: '550px' }}>
        
        {/* Heading */}
        <h2 className="text-center mb-4 text-primary fw-bold" style={{ fontSize: '2rem' }}>
         Contact Us  <BsChatSquareText /> 
        </h2>

        {/* Contact Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="form-label" style={{ fontSize: '1.1rem' }}>
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
            <label htmlFor="email" className="form-label" style={{ fontSize: '1.1rem' }}>
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
            <label htmlFor="message" className="form-label" style={{ fontSize: '1.1rem' }}>
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
              Send Message
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default Contact;
