import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#04bf65", "#f87171"]; // green = present, red = absent

const AttendanceComponent = () => {
  const { classId } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/attendance/classrooms/${classId}/`
        );
        setClassInfo({
          classroom: response.data.classroom,
          subject: response.data.subject,
          teacher: response.data.teacher,
        });

        const studentEnrollment = localStorage.getItem("id");
        const matchedStudent = response.data.attendance.find(
          (student) => student.enrollment_number === studentEnrollment
        );

        setStudentData(matchedStudent || null);
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
      }
    };

    fetchAttendance();
  }, [classId]);

  const processMonthlyData = (attendance_dates) => {
    const monthly = {};

    for (const [date, status] of Object.entries(attendance_dates)) {
      const month = new Date(date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      if (!monthly[month]) monthly[month] = { month, present: 0, absent: 0 };
      monthly[month][status]++;
    }

    return Object.values(monthly);
  };

  return (
    <div className="attendance-component-container">
      {classInfo && studentData ? (
        <>
          <h1 className="attendance-component-container-h1">
            {classInfo.classroom}
          </h1>
          <h2 className="attendance-component-container-h2">
            <strong>Subject:</strong> {classInfo.subject}
          </h2>

          <div className="border p-4 rounded shadow">
            <h3 className="attendance-component-container-h3">
              <strong>Name : </strong>
              {studentData.student_name} ({studentData.enrollment_number})
            </h3>
            <hr></hr>

            {/* Pie Chart - Attendance Summary */}
            <div className="attendance-component-piechart-container">
              <h4 className="text-md font-semibold mb-2">
                Attendance Percentage
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart className="attendance-container-piechart">
                  <Pie
                    dataKey="value"
                    data={[
                      {
                        name: "Present",
                        value: Object.values(
                          studentData.attendance_dates
                        ).filter((val) => val === "present").length,
                      },
                      {
                        name: "Absent",
                        value: Object.values(
                          studentData.attendance_dates
                        ).filter((val) => val === "absent").length,
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(1)}%`
                    }
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => {
                      
                      
                      return [`${value} days `, name];
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart - Monthly Attendance */}
            <div className="attendance-component-barchart-container">
              <h4 className="text-md font-semibold mb-2">
                Monthly Attendance Summary
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  className="attendance-container-barchart"
                  data={processMonthlyData(studentData.attendance_dates)}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#04bf65" name="Present" />
                  <Bar dataKey="absent" fill="#f87171" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Attendance Table - Date-wise */}
            <div className="mt-10">
              <h4 className="text-md font-semibold mb-2">
                Detailed Attendance
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-4 py-2 border">Date</th>
                      <th className="px-4 py-2 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(studentData.attendance_dates).map(
                      ([date, status]) => (
                        <tr
                          key={date}
                          className={
                            status === "present"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          <td className="px-3 py-2 border">{date}</td>
                          <td className="px-3 py-2 border font-medium">
                            {status === "present" ? "✅ Present" : "❌ Absent"}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading or student not found...</p>
      )}
    </div>
  );
};

export default AttendanceComponent;
