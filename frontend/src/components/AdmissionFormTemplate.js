import React from "react";
import "./css/AdmissionForm.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function AdmissionFormTemplate({ school, student }) {
  return (
    <div className="sheet" id="admission-sheet">
      {/* Header */}
      <div className="header">
        {/* School Logo */}
        <div className="logo">
          {school.logo ? (
            
            <img src={`${API_URL}${student.photo}`} alt="student" />
          ) : (
            <div className="no-logo">No Logo</div>
          )}
        </div>

        {/* School Info */}
        <div className="school-info">
          <h1>{school.name}</h1>
          <p>{school.address}</p>
          <p className="muted">
            Phone: {school.phone} | Email: {school.email}
          </p>
        </div>

        {/* Student Photo */}
        <div className="photo-box">
          {student.photo ? (
            <img
              src={`${API_URL}${student.photo.startsWith("/") ? student.photo : "/" + student.photo}`}
              alt={student.name}
              className="student-img"
            />
          ) : (
            <div className="no-photo">No Photo</div>
          )}
        </div>

      </div>

      <hr className="divider" />
      <div className="title">
        <h2>STUDENT ADMISSION FORM</h2>
      </div>

      {/* ===== Basic Info ===== */}
      <h3 className="section-title">Basic Info</h3>
      <table className="info">
        <tbody>
          <tr>
            <td className="label">Admission No</td>
            <td>{student.admissionNo}</td>
            <td className="label">Aadhaar / UID</td>
            <td>{student.uid}</td>
          </tr>
          <tr>
            <td className="label">Name</td>
            <td>{student.name}</td>
            <td className="label">Gender</td>
            <td>{student.gender}</td>
          </tr>
          <tr>
            <td className="label">Date of Birth</td>
            <td colSpan={3}>
              {student.dob} {student.age ? `(Age: ${student.age})` : ""}
            </td>
          </tr>
          <tr>
            <td className="label">Address</td>
            <td colSpan={3}>{student.address}</td>
          </tr>
        </tbody>
      </table>

      {/* ===== Academic Info ===== */}
      <h3 className="section-title">Academic Info</h3>
      <table className="info">
        <tbody>
          <tr>
            <td className="label">Class</td>
            <td>{student.className}</td>
            <td className="label">Section</td>
            <td>{student.section}</td>
          </tr>
          <tr>
            <td className="label">Roll No</td>
            <td>{student.roll}</td>
            <td className="label">Admission Date</td>
            <td>{student.admissionDate}</td>
          </tr>
          <tr>
            <td className="label">Previous School</td>
            <td>{student.prevSchool}</td>
            <td className="label">Transfer Certificate</td>
            <td>{student.transferCert}</td>
          </tr>
        </tbody>
      </table>

      {/* ===== Parent Info ===== */}
      <h3 className="section-title">Parent & Guardian Info</h3>
      <table className="info">
        <tbody>
          <tr>
            <td className="label">Father's Name</td>
            <td>{student.father}</td>
            <td className="label">Occupation</td>
            <td>{student.fatherOccupation}</td>
          </tr>
          <tr>
            <td className="label">Mother's Name</td>
            <td>{student.mother}</td>
            <td className="label">Occupation</td>
            <td>{student.motherOccupation}</td>
          </tr>
          <tr>
            <td className="label">Phone</td>
            <td>{student.phone}</td>
            <td className="label">Email</td>
            <td>{student.email}</td>
          </tr>
          <tr>
            <td className="label">Guardian</td>
            <td>{student.guardian}</td>
            <td className="label">Relation</td>
            <td>{student.guardianRelation}</td>
          </tr>
          <tr>
            <td className="label">Guardian Phone</td>
            <td colSpan={3}>{student.guardianPhone}</td>
          </tr>
        </tbody>
      </table>

      {/* ===== Health Info ===== */}
      <h3 className="section-title">Health Info</h3>
      <table className="info">
        <tbody>
          <tr>
            <td className="label">Blood Group</td>
            <td>{student.bloodGroup}</td>
            <td className="label">Emergency Contact</td>
            <td>{student.emergencyContact}</td>
          </tr>
          <tr>
            <td className="label">Health Info</td>
            <td colSpan={3}>{student.healthInfo}</td>
          </tr>
        </tbody>
      </table>

      {/* ===== Other Info ===== */}
      <h3 className="section-title">Other Info</h3>
      <table className="info">
        <tbody>
          <tr>
            <td className="label">Caste</td>
            <td>{student.caste}</td>
            <td className="label">Religion</td>
            <td>{student.religion}</td>
          </tr>
          <tr>
            <td className="label">Nationality</td>
            <td>{student.nationality}</td>
            <td className="label">Mother Tongue</td>
            <td>{student.motherTongue}</td>
          </tr>
          <tr>
            <td className="label">Hobbies</td>
            <td colSpan={3}>{student.hobbies}</td>
          </tr>
        </tbody>
      </table>

      {/* Signature */}
      <div className="sigs">
        <div className="sig">
          <div className="line"></div>
          Guardian / Parent
        </div>
        <div className="sig">
          <div className="line"></div>
          Class Teacher
        </div>
        <div className="sig">
          <div className="line"></div>
          Principal
        </div>
      </div>

      <div className="footer small">
        <div>Generated by — School Management System</div>
        <div className="muted">
          Note: Please attach required documents (Aadhar copy, Transfer
          Certificate, photograph) with this form.
        </div>
      </div>
    </div>
  );
}
