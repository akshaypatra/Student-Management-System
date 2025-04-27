import React, { useState, useEffect } from 'react';

export default function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [formData, setFormData] = useState({ code: '', name: '' });

  const fetchSubjects = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/attendance/subjects/", {
        method: 'GET',
      });
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const openForm = (subject) => {
    setSelectedSubject(subject);
    setFormData({ code: subject.code, name: subject.name });
  };

  const closeForm = () => {
    setSelectedSubject(null);
    setFormData({ code: '', name: '' });
  };

  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/attendance/subjects/update/${selectedSubject.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Subject updated successfully!');
        fetchSubjects();
        closeForm();
      } else {
        alert('Failed to update subject');
      }
    } catch (error) {
      console.error('Error updating subject:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/attendance/subjects/delete/${selectedSubject.id}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Subject deleted successfully!');
        fetchSubjects();
        closeForm();
      } else {
        alert('Failed to delete subject');
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  return (
    <div className='subject-container'>
      {subjects.length === 0 ? (
        <p>No subjects added yet.</p>
      ) : (
        <ul className='subject-list-container'>
          {subjects.map((subject, index) => (
            <li className='subject-list' key={index} onClick={() => openForm(subject)}>
              {subject.code}<br />
              {subject.name}
            </li>
          ))}
        </ul>
      )}

      {/* Overlay Form */}
      {selectedSubject && (
        <div className="subject-overlay">
          <div className="subject-overlay-form">
            <h2>Edit Subject</h2>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="Subject Code"
            />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Subject Name"
            />
            <div className="subject-form-buttons">
              <button className='subject-update-button' onClick={handleUpdate}>Update</button>
              <button onClick={handleDelete} className="subject-delete-button">Delete</button>
              <button onClick={closeForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
