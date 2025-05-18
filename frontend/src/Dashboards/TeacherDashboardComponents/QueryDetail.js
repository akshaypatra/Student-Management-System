import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function QueryDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = location.state?.query;
  const [status, setStatus] = useState(query?.status);

  const handleStatusUpdate = async (newStatus) => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `https://classify-backend-zstl.onrender.com/api/attendance/queries/${query.id}/update-status/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        alert(`Query successfully ${newStatus}.`);
        setStatus(newStatus);
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      alert("An error occurred while updating the status.");
    }
  };

  if (!query) {
    return <p className="text-danger">No query data found.</p>;
  }

  return (
    <div className="t-query-detail-container">
      <div>
        <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
      <div className="t-query-detail-box-container">
        <div className="t-query-detail-box">
          <h3 className="mb-3">Query Details</h3>
          <p><strong>Query ID:</strong> {query.id}</p>
          <p><strong>Student Name:</strong> {query.student_name}</p>
          <p><strong>Student ID:</strong> {query.student}</p>
          <p><strong>Status:</strong>
            <span className={`t-queries-status badge ms-2 ${
              status === "approved"
                ? "bg-success"
                : status === "rejected"
                ? "bg-danger"
                : "bg-warning text-dark"
            }`}>
              {status}
            </span>
          </p>
          <p><strong>Message:</strong>
            <div className="t-query-detail-message-textarea">
              {query.message}
            </div>
          </p>
          <p><strong>Created At:</strong> {new Date(query.created_at).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(query.updated_at).toLocaleString()}</p>

          <div className="t-query-status-buttons-div mt-4 d-flex gap-3">
            <button
              className="btn btn-success"
              disabled={status === "approved"}
              onClick={() => handleStatusUpdate("approved")}
            >
              Approve
            </button>
            <button
              className="btn btn-danger"
              disabled={status === "rejected"}
              onClick={() => handleStatusUpdate("rejected")}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
