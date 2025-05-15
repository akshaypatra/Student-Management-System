import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Queries() {
  const navigate = useNavigate();
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [expandedMessageIds, setExpandedMessageIds] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateOrder, setDateOrder] = useState("Newest");

  useEffect(() => {
    const fetchQueries = async () => {
      const token = localStorage.getItem("access_token");
      const studentId = localStorage.getItem("id");

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/attendance/queries/student-status/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const studentQueries = data.filter(
            (query) => String(query.student) === studentId
          );
          setQueries(studentQueries);
        } else {
          alert("Failed to fetch queries.");
        }
      } catch (error) {
        alert("An error occurred while fetching queries.");
      }
    };

    fetchQueries();
  }, []);

  useEffect(() => {
    let filtered = [...queries];

    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (query) => query.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredQueries(filtered);
  }, [queries, statusFilter, dateOrder]);

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <span className="status-pending">{status}</span>;
      case "approved":
        return <span className="status-approved">{status}</span>;
      case "rejected":
        return <span className="status-rejected">{status}</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const toggleMessage = (id) => {
    setExpandedMessageIds((prev) =>
      prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]
    );
  };

  const getTruncatedMessage = (text, limit = 30) => {
    return text.length <= limit ? text : text.slice(0, limit) + "...";
  };

  return (
    <div className="s-queries-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="s-queries-header">Queries</h2>
        
        <button
          className="s-queries-button btn btn-primary"
          onClick={() => navigate("/query-form")}
        >
          Send Query
        </button>
      </div>
      {/* Filters */}
        <div className="s-queries-filters-container">
          <div>
            <label className="form-label">Filter by Status:</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="form-label">Sort by Date:</label>
            <select
              className="form-select"
              value={dateOrder}
              onChange={(e) => setDateOrder(e.target.value)}
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>
        </div>

      {filteredQueries.length === 0 ? (
        <p className="text-muted">No queries found.</p>
      ) : (
        <div className="s-queries-list-container">
          {filteredQueries.map((query) => (
            <div className="s-queries-list-container-1" key={query.id}>
              <div className="s-queries-list-container-card-body">
                <h5 className="card-title">Query ID: {query.id}</h5>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(query.created_at).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {new Date(query.created_at).toLocaleTimeString()}
                </p>
                <p>
                  <strong>To:</strong> {query.teacher_name}
                </p>
                <div>
                  <strong>Status:</strong> {getStatusBadge(query.status)}
                </div>
                <p
                  className="card-text mt-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleMessage(query.id)}
                >
                  <strong>Message:</strong>{" "}
                  {expandedMessageIds.includes(query.id)
                    ? query.message
                    : getTruncatedMessage(query.message)}
                  {query.message.length > 30 && (
                    <span className="text-primary ms-1">
                      {expandedMessageIds.includes(query.id)
                        ? " (Show less)"
                        : " (Read more...)"}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
