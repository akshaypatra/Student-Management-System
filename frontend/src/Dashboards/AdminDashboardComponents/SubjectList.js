import React, { useState, useEffect } from 'react';


export default function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  
  

  const fetchSubjects = async () => {
    try {
      // const token = localStorage.getItem('access_token');
      const response = await fetch("http://127.0.0.1:8000/api/attendance/subjects/", {
        method: 'GET',
        // headers: { 'Authorization': `Bearer ${token}` },
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

  return (
    <div className='subject-container'>
      {subjects.length === 0 ? (
        <p>No subjects added yet.</p>
      ) : (
        <ul className='subject-list-container'>
          {subjects.map((subject, index) => (
            <li className='subject-list' key={index}>
              {subject.code}<br></br>
              {subject.name}
            </li> 
          ))}
        </ul>
      )}
      
    </div>
  );
}
