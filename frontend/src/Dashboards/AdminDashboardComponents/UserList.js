import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

export default function UserList() {
  const [selectedRole, setSelectedRole] = useState('');
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Search state


  const navigate = useNavigate();

  // Fetch functions
  const fetchStudents = async () => {
    const token = localStorage.getItem('access_token');
    const response = await fetch("http://127.0.0.1:8000/api/students/", {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    const studentData = data.filter(user => user.role === 'student');
    setStudents(studentData);
  };

  const fetchTeachers = async () => {
    const token = localStorage.getItem('access_token');
    const response = await fetch("http://127.0.0.1:8000/api/teachers/", {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    const teacherData = data.filter(user => user.role === 'teacher');
    setTeachers(teacherData);
  };

  // Handle user deletion
  const handleDelete = async (userId) => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`http://127.0.0.1:8000/api/delete-user/${userId}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (response.ok) {
      alert('User deleted successfully!');
      setShowModal(false); 
      setSelectedUser(null); 
      
      selectedRole === 'student' ? fetchStudents() : fetchTeachers();
    } else {
      alert('Failed to delete the user');
    }
  };

  useEffect(() => {
    if (selectedRole === 'student') fetchStudents();
    else if (selectedRole === 'teacher') fetchTeachers();
  }, [selectedRole]);

  // Filter students and teachers based on search query
  const filteredUsers = (selectedRole === 'student' ? students : teachers).filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.includes(searchQuery)
  );

  return (
    <div className="userlist-container">
      
      {/* Role selection buttons */}
      <div className="userlist-button-container">
        <button className="userlist-btn-1" onClick={() => { setSelectedRole('student'); setShowModal(true); }}>
          Students
        </button>
        <button className="userlist-btn-2" onClick={() => { setSelectedRole('teacher'); setShowModal(true); }}>
          Teachers
        </button>
        <button className="userlist-btn-3" onClick={() =>  navigate('/register')}>
          Add User
        </button>
      </div>

      {/* User List Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">
                  {selectedRole === 'student' ? 'List Of Students ' : 'List of Teachers'}
                </h2>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {/* Search Bar */}
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="   Search by name,email or id ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => { setSelectedUser(user); }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Deletion Modal */}
      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title" >Confirm Deletion</h2>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setSelectedUser(null)}></button>
              </div>
              <div className="delete-modal-body">
                <p>Are you sure you want to delete the user?</p>
                <p><strong>ID:</strong> {selectedUser.id}</p>
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedUser(null)}>
                  Close
                </button>
                <button type="button" className="btn btn-danger" onClick={() => handleDelete(selectedUser.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
