import React, { useEffect, useState } from 'react';
import baseUrl from '../BaseUrl';
const ClassDetails = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const teacherId = localStorage.getItem('id'); // Example: "T111"

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch(`${baseUrl}/api/attendance/classrooms/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(cls => cls.teacher === teacherId);
        setClassrooms(filtered);
      })
      .catch((err) => console.error('Failed to fetch classrooms:', err));
  }, [teacherId]);

  const handleClassClick = (cls) => {
    setSelectedClass(cls);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Classes</h2>
      {classrooms.length === 0 ? (
        <p>No classes assigned to you.</p>
      ) : (
        <div style={{ marginBottom: '20px' }}>
          {classrooms.map((cls) => (
            <button
              key={cls.id}
              onClick={() => handleClassClick(cls)}
              style={{ margin: '8px', padding: '10px 20px', cursor: 'pointer' }}
            >
              {cls.name} - {cls.subject.name}
            </button>
          ))}
        </div>
      )}

      {selectedClass && (
        <div style={{ marginTop: '30px' }}>
          <h3>Class: {selectedClass.name}</h3>
          <p><strong>Subject:</strong> {selectedClass.subject.name} ({selectedClass.subject.code})</p>
          <h4>Enrolled Students:</h4>
          <ul>
            {selectedClass.students.map((enrollNo, index) => (
              <li key={index}>{enrollNo}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClassDetails;
