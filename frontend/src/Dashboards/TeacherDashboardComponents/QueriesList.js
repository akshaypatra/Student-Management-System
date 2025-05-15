import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function QueriesList() {
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQueries = async () => {
      const token = localStorage.getItem("access_token");
      const teacherId = localStorage.getItem("id");

      try {
        const response = await fetch("http://127.0.0.1:8000/api/attendance/queries/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const filtered = data.filter((query) => query.teacher === teacherId);
          setQueries(filtered);
        } else {
          alert("Failed to fetch queries.");
        }
      } catch (error) {
        alert("Error fetching queries. Please try again.");
      }
    };

    fetchQueries();
  }, []);

  useEffect(() => {
    let filtered = [...queries];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((q) => q.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.student_name?.toLowerCase().includes(lowerSearch) ||
          q.student?.toLowerCase().includes(lowerSearch)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredQueries(filtered);
  }, [statusFilter, sortOrder, searchTerm, queries]);

  const handleQueryClick = (query) => {
    navigate(`/query-detail/${query.id}`, { state: { query } });
  };

  return (
    <div className="t-queries-container container py-4">
      <h2 className="mb-4">Student Queries</h2>

      {/* Filters */}
      <div className="t1-queries-filters-container">
        <select
          className="form-select w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          className="form-select w-auto"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>

        <input
          type="text"
          className="form-control w-auto"
          placeholder="Search by name or enrollment"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Query List */}
      {filteredQueries.length === 0 ? (
        <p className="text-muted">No queries found for selected filters.</p>
      ) : (
        <div className="t-queries-list-container ">
          {filteredQueries.map((query) => (
            <div
              key={query.id}
              className="t-queries-list"
              style={{ cursor: "pointer" }}
              onClick={() => handleQueryClick(query)}
            >
              <div className="d-flex justify-content-between">
                <h5>Query ID: {query.id}</h5>
                <span
                  className={`t-queries-status  badge ${
                    query.status === "approved"
                      ? "bg-success"
                      : query.status === "rejected"
                      ? "bg-danger"
                      : "bg-warning text-dark"
                  }`}
                >
                  {query.status}
                </span>
              </div>
              <p className="mb-1">
                <strong>From:</strong> {query.student_name} ({query.student})
              </p>
              <p className="mb-1">
                <strong>Message:</strong> {query.message.slice(0, 40)}...
              </p>
              <small>
                <strong>Date:</strong>{" "}
                {new Date(query.created_at).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
