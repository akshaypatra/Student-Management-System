import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const EnrolledClasses = () => {
    
  const [filteredClasses, setFilteredClasses] = useState([]);
  const studentId = localStorage.getItem('id');
  const navigate=useNavigate();

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/attendance/classrooms/');
        const allClasses = response.data;

        const matchedClasses = allClasses.filter(cls =>
          cls.students.includes(studentId)
        );

        setFilteredClasses(matchedClasses);
      } catch (error) {
        console.error('Error fetching classrooms:', error);
      }
    };

    if (studentId) {
      fetchClassrooms();
    }
  }, [studentId]);

  const handleNavigate = (classId) => {
    navigate(`/attendance/${classId}`);
  };

  return (
    <div className="enrolled-classes-container" >
      <h2 className="text-xl font-semibold mb-4">Your Classes</h2>
      {filteredClasses.length > 0 ? (
        <div className="enrolled-classes-list-contianer">
          {filteredClasses.map(cls => (
            <button
              key={cls.id}
              onClick={() => handleNavigate(cls.id)}
              className="enrolled-classes-list-button"
            >
              <p>{cls.subject.name}</p> 
              <p>Class ID: {cls.id}</p>
            </button>
          ))}
        </div>
      ) : (
        <p>No classes found for your ID.</p>
      )}
    </div>
  );
};

export default EnrolledClasses;
