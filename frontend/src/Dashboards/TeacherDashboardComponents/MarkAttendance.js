import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const MarkAttendance = () => {
  const { classId, className } = useParams();
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceStatus, setAttendanceStatus] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
          const token = localStorage.getItem("access_token");
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/attendance/classrooms/${classId}/attendance/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
        const data = await response.json();
        const formattedStudents = data.attendance.map((s) => ({
          enrollment_number: s.enrollment_number,
          student_name: s.student_name,
        }));
        setStudents(formattedStudents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, [classId]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      classroom_id: parseInt(classId),
      date: selectedDate,
      attendance: students.map((student) => ({
        student_id: student.enrollment_number,
        status: attendanceStatus[student.enrollment_number] || 'absent',
      })),
    };
    console.log('Payload:', payload);
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch('http://127.0.0.1:8000/api/attendance/mark/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Attendance marked successfully!');
      } else {
        alert('Error marking attendance');
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('Network error while marking attendance');
    }
  };

  if (loading) return <p>Loading students...</p>;

  return (
    <div className='mark-attendance-container'>
      <h1>Mark Attendance of {className}</h1>
      
      <label className='mark-attendance-select-date-label'>
        Select Date:{" "}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </label>

      <div className='mark-attendance-table-container'>
        <table border="1" cellPadding="8" style={{ marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Enrollment No.</th>
              <th>Name</th>
              <th>Mark Attendance</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.enrollment_number}>
                <td>{index + 1}</td> {/* Serial Number */}
                <td>{student.enrollment_number}</td>
                <td>{student.student_name}</td>
                <td>
                <div className='mark-attendance-buttons-div'>
                  <button
                    style={{
                      backgroundColor: attendanceStatus[student.enrollment_number] === 'present' ? 'lightgreen' : '',
                    }}
                    onClick={() => handleStatusChange(student.enrollment_number, 'present')}
                  >
                    ✅ Present
                  </button>
                  <button
                    style={{
                      marginLeft: '10px',
                      backgroundColor: attendanceStatus[student.enrollment_number] === 'absent' ? '#f88' : '',
                    }}
                    onClick={() => handleStatusChange(student.enrollment_number, 'absent')}
                  >
                    ❌ Absent
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className='mark-attendance-submit-button' style={{ marginTop: '1rem' }} onClick={handleSubmit}>
        Submit Attendance
      </button>
    </div>
  );
};

export default MarkAttendance;
