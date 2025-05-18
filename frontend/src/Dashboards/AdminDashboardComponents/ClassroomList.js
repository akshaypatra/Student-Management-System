import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ClassroomList() {
  const [classrooms, setClassrooms] = useState([]);
  const [filteredClassrooms, setFilteredClassrooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get(
        "https://classify-backend-zstl.onrender.com/api/attendance/classrooms/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClassrooms(res.data);
      setFilteredClassrooms(res.data);
    } catch (error) {
      console.error("Error fetching classrooms", error);
    }
  };

  const handleClassroomClick = (classroomId) => {
    navigate(`/update-classroom/${classroomId}`);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = classrooms.filter((classroom) =>
      classroom.subject.name.toLowerCase().includes(query) ||
      classroom.name.toLowerCase().includes(query) ||
      classroom.teacher.toString().includes(query)
    );
    setFilteredClassrooms(filtered);
  };

  return (
    <div className="classroom-container">
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by subject..."
          value={searchQuery}
          onChange={handleSearch}
          className="classroom-search"
          
        />
      </div>

      <div className="classroom-list-container">
        {filteredClassrooms.length > 0 ? (
          filteredClassrooms.map((classroom) => (
            <div
              key={classroom.id}
              className="classroom-list"
              onClick={() => handleClassroomClick(classroom.id)}
              style={{ cursor: "pointer" }}
            >
              <h3>{classroom.name}</h3>
              <p>
                <strong>Subject:</strong> {classroom.subject.name}
              </p>
              <p>
                <strong>Teacher ID:</strong> {classroom.teacher}
              </p>
            </div>
          ))
        ) : (
          <p>No classrooms available.</p>
        )}
      </div>
    </div>
  );
}
