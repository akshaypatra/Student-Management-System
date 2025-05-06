import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Papa from "papaparse"; // Import PapaParse for CSV export
import { useNavigate } from "react-router-dom";

const AttendanceView = () => {
  const navigate = useNavigate();
  const { classId, className } = useParams();
  const [attendanceData, setAttendanceData] = useState([]);
  const [allDates, setAllDates] = useState([]);

  // Format a date string (YYYY-MM-DD) to "4th April 2025"
  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "long" });
    const year = dateObj.getFullYear();

    // Add ordinal suffix
    const ordinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return `${ordinal(day)} ${month} ${year}`;
  };

  useEffect(() => {
    fetch(
      `http://127.0.0.1:8000/api/attendance/classrooms/${classId}/attendance/`
    )
      .then((res) => res.json())
      .then((data) => {
        setAttendanceData(data.attendance);

        // Get all unique dates
        const datesSet = new Set();
        data.attendance.forEach((student) => {
          if (student.attendance_dates) {
            Object.keys(student.attendance_dates).forEach((date) =>
              datesSet.add(date)
            );
          }
        });

        const sortedDates = Array.from(datesSet).sort();
        setAllDates(sortedDates);
      })
      .catch((err) => console.error("Error:", err));
  }, [classId]);

  const calculateStats = (student) => {
    let present = 0;
    let absent = 0;

    allDates.forEach((date) => {
      const status = student.attendance_dates?.[date];
      if (status === "present") present++;
      else if (status === "absent") absent++;
    });

    const percentage =
      allDates.length > 0
        ? ((present / allDates.length) * 100).toFixed(1)
        : "0.0";

    return { present, absent, percentage };
  };

  // Export data to CSV
  const exportToCSV = () => {
    const csvData = [];
    const headers = [
      "S.No.",
      "Enrollment No.",
      "Name",
      "Present Days",
      "Absent Days",
      "Attendance %",
      ...allDates.map((date) => formatDate(date)),
    ];
    csvData.push(headers);

    attendanceData.forEach((student, index) => {
      const { present, absent, percentage } = calculateStats(student);
      const row = [
        index + 1,
        student.enrollment_number,
        student.student_name,
        present,
        absent,
        `${percentage}%`,
        ...allDates.map((date) =>
          student.attendance_dates?.[date] === "present"
            ? "✅"
            : student.attendance_dates?.[date] === "absent"
            ? "❌"
            : "-"
        ),
      ];
      csvData.push(row);
    });

    // Convert the data into CSV and download
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "attendance.csv";
    link.click();
  };

  return (
    <div>
      <h2>Attendance for Class {className}</h2>

      <div className="attendance-view-container">
        <table border="1" cellPadding="8" className="attendance-view-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Enrollment No.</th>
              <th>Name</th>
              <th>Present Days</th>
              <th>Absent Days</th>
              <th>Attendance %</th>
              {allDates.map((date) => (
                <th key={date}>{formatDate(date)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((student, index) => {
              const { present, absent, percentage } = calculateStats(student);
              return (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.enrollment_number}</td>
                  <td>{student.student_name}</td>
                  <td>{present}</td>
                  <td>{absent}</td>
                  <td>{percentage}%</td>
                  {allDates.map((date) => {
                    const status = student.attendance_dates?.[date];
                    return (
                      <td key={date}>
                        {status === "present"
                          ? "✅"
                          : status === "absent"
                          ? "❌"
                          : "-"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="attendance-export-buttons">
        <button
          onClick={() => navigate(`/classrooms/${classId}/mark-attendance/${className}`)}
        >
          Mark Attendance
        </button>
        <button onClick={exportToCSV}>Export to CSV</button>
      </div>
    </div>
  );
};

export default AttendanceView;
