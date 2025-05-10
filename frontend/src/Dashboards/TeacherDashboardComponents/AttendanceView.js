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

  const classStrength = attendanceData.length;

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

  const getDailyPresentCounts = () => {
    const presentCounts = {};
    allDates.forEach((date) => {
      let count = 0;
      attendanceData.forEach((student) => {
        if (student.attendance_dates?.[date] === "present") {
          count++;
        }
      });
      presentCounts[date] = count;
    });
    return presentCounts;
  };

  const handleUpdateAttendance = (studentId, date, currentStatus) => {
    // Toggle status logic
    let newStatus = null;
    if (currentStatus === "present") newStatus = "absent";
    else if (currentStatus === "absent") newStatus = "present";
    else newStatus = "present"; // If not marked yet, mark as present

    fetch(`http://127.0.0.1:8000/api/attendance/update/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        classroom_id: parseInt(classId),
        date: date,
        updates: [
          {
            student_id: studentId,
            status: newStatus,
          },
        ],
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update attendance");
        return res.json();
      })
      .then(() => {
        // Update local state
        setAttendanceData((prevData) =>
          prevData.map((student) => {
            if (student.enrollment_number === studentId) {
              const updatedDates = {
                ...student.attendance_dates,
                [date]: newStatus,
              };
              return { ...student, attendance_dates: updatedDates };
            }
            return student;
          })
        );
      })
      .catch((err) => alert("Error updating attendance: " + err.message));
  };

  const handleDeleteAttendance = (date) => {
    if (
      !window.confirm(
        `Are you sure you want to delete attendance for ${formatDate(date)}?`
      )
    ) {
      return;
    }

    fetch(`http://127.0.0.1:8000/api/attendance/update/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        delete: true,
        classroom_id: parseInt(classId),
        date: date,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete attendance");
        return res.json();
      })
      .then((data) => {
        // Refresh attendance view
        setAttendanceData((prevData) =>
          prevData.map((student) => {
            if (student.attendance_dates && student.attendance_dates[date]) {
              const newDates = { ...student.attendance_dates };
              delete newDates[date];
              return { ...student, attendance_dates: newDates };
            }
            return student;
          })
        );

        setAllDates((prevDates) => prevDates.filter((d) => d !== date));
      })
      .catch((err) => alert("Error deleting attendance: " + err.message));
  };

  return (
    <div>
      <h2 className="attendance-sheet-h2">Attendance Sheet : {className}</h2>
      <hr></hr>
      <h3 className="attendance-sheet-h3">Class Strength : {classStrength}</h3>

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
              {/* Header with DELETE on click */}
              {allDates.map((date) => (
                <th
                  key={date}
                  style={{ cursor: "pointer" }}
                  title="Click to delete attendance for this date"
                  onClick={() => handleDeleteAttendance(date)}
                >
                  {formatDate(date)} 
                </th>
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
                      <td
                        key={date}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleUpdateAttendance(
                            student.enrollment_number,
                            date,
                            status
                          )
                        }
                        title="Click to toggle"
                      >
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
            {/* Total Present Row */}
            <tr>
              <td colSpan="6" style={{ fontWeight: "bold" }}>
                Total Present
              </td>
              {allDates.map((date) => {
                const dailyPresents = getDailyPresentCounts()[date] || 0;
                return (
                  <td key={date} style={{ fontWeight: "bold" }}>
                    {dailyPresents}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="attendance-export-buttons">
        <button
          onClick={() =>
            navigate(`/classrooms/${classId}/mark-attendance/${className}`)
          }
        >
          Mark Attendance
        </button>
        <button onClick={exportToCSV}>Export to CSV</button>
      </div>
    </div>
  );
};

export default AttendanceView;
