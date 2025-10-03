import React from "react";
import "./css/StudentIDCard.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// 🔹 Date format helper
const formatDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function StudentIDCard({ school, student }) {
  return (
    <div className="id-card">
      {/* Header */}
      <div className="id-header">
        <img
          src={
            school.logo
              ? `${API_URL}/${school.logo}` // 🔹 notice the extra "/" added
              : "/no-logo.png"
          }
          alt="School Logo"
          className="school-logo"
        />
        <div className="school-info">
          <h2>{school.name}</h2>
          <p>{school.address}</p>
          <p>
            {school.phone} | {school.email}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="id-body">
        <div className="photo-box">
          <img
            src={
                student.photo
                ? `${API_URL}/${student.photo.replace(/^\/+/, "")}` // নিশ্চিত extra slash ঠিক আছে
                : "/no-photo.png"
            }
            alt={student.name}
            />
        </div>
        <div className="student-info">
          <p>
            <strong>Name:</strong> {student.name}
          </p>
          <p>
            <strong>Class:</strong> {student.className} - {student.section},{" "}
            <strong>Roll:</strong> {student.roll}
          </p>
          <p>
            <strong>Admission No:</strong> {student.admissionNo}
          </p>
          <p>
            <strong>DOB:</strong> {formatDate(student.dob)}
          </p>
          <p>
            <strong>Blood Group:</strong> {student.bloodGroup || "N/A"}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="id-footer">
        <p>If found, please return to {school.name}</p>
      </div>
    </div>
  );
}
