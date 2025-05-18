import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ClassList = () => {
  const [classrooms, setClassrooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const teacherId = localStorage.getItem('id');
    const token = localStorage.getItem("access_token");
    fetch('https://classify-backend-zstl.onrender.com/api/attendance/classrooms/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const filteredClasses = data.filter(cls => String(cls.teacher) === teacherId);
        setClassrooms(filteredClasses);
      })
      .catch(err => console.error('Error:', err));
  }, []);

  return (
    <div className='class-list-container'>
      <h2>Your Classes</h2>
      <div className='class-list-inner-container'>
      {classrooms.length === 0 ? (
        <p>No classes assigned to you.</p>
      ) : (
        classrooms.map(cls => (
          <button
            className='classlist-button'
            key={cls.id}
            onClick={() => navigate(`/classroom/${cls.id}/${cls.name}`)}
            style={{ margin: '10px', padding: '10px' }}
          >
            {cls.name || `Class ${cls.id}`}
          </button>
        ))
      )}
      </div>
    </div>
  );
};

export default ClassList;
