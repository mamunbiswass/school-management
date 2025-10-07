import React from "react";
import "./css/AdmissionForm.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function AdmissionFormTemplate({ school, student }) {
  const getImageURL = (path) => {
    if (!path) return "/no-photo.png";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  return (
    <div className="admission-sheet" id="admission-sheet">
      {/* ===== HEADER ===== */}
      <header className="admission-header">
        <div className="school-logo-box">
          {school.logo ? (
            <img
              src={getImageURL(school.logo)}
              alt="School Logo"
              className="school-logo"
            />
          ) : (
            <div className="no-logo">No Logo</div>
          )}
        </div>

        <div className="school-details">
          <h1>{school.name}</h1>
          <p>{school.address}</p>
          <p className="muted">
            📞 {school.phone} | ✉️ {school.email}
          </p>
        </div>

        <div className="student-photo-box">
          {student.photo ? (
            <img
              src={getImageURL(student.photo)}
              alt={student.name}
              className="student-photo"
            />
          ) : (
            <div className="no-photo">No Photo</div>
          )}
        </div>
      </header>

      {/* ===== TITLE ===== */}
      <div className="form-title">
        <h2>STUDENT ADMISSION FORM</h2>
      </div>

      {/* ===== BASIC INFO ===== */}
      <section>
        <h3 className="section-title">Basic Information</h3>
        <table className="info-table">
          <tbody>
            <tr>
              <th>Admission No</th>
              <td>{student.admissionNo}</td>
              <th>Aadhaar / UID</th>
              <td>{student.uid}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{student.name}</td>
              <th>Gender</th>
              <td>{student.gender}</td>
            </tr>
            <tr>
              <th>Date of Birth</th>
              <td colSpan={3}>
                {student.dob} {student.age ? `(Age: ${student.age})` : ""}
              </td>
            </tr>
            <tr>
              <th>Address</th>
              <td colSpan={3}>{student.address}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ===== ACADEMIC INFO ===== */}
      <section>
        <h3 className="section-title">Academic Details</h3>
        <table className="info-table">
          <tbody>
            <tr>
              <th>Class</th>
              <td>{student.className}</td>
              <th>Section</th>
              <td>{student.section}</td>
            </tr>
            <tr>
              <th>Roll No</th>
              <td>{student.roll}</td>
              <th>Admission Date</th>
              <td>{student.admissionDate}</td>
            </tr>
            <tr>
              <th>Previous School</th>
              <td>{student.prevSchool}</td>
              <th>Transfer Certificate</th>
              <td>{student.transferCert}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ===== PARENT INFO ===== */}
      <section>
        <h3 className="section-title">Parent & Guardian Information</h3>
        <table className="info-table">
          <tbody>
            <tr>
              <th>Father's Name</th>
              <td>{student.father}</td>
              <th>Occupation</th>
              <td>{student.fatherOccupation}</td>
            </tr>
            <tr>
              <th>Mother's Name</th>
              <td>{student.mother}</td>
              <th>Occupation</th>
              <td>{student.motherOccupation}</td>
            </tr>
            <tr>
              <th>Phone</th>
              <td>{student.phone}</td>
              <th>Email</th>
              <td>{student.email}</td>
            </tr>
            <tr>
              <th>Guardian</th>
              <td>{student.guardian}</td>
              <th>Relation</th>
              <td>{student.guardianRelation}</td>
            </tr>
            <tr>
              <th>Guardian Phone</th>
              <td colSpan={3}>{student.guardianPhone}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ===== HEALTH INFO ===== */}
      <section>
        <h3 className="section-title">Health Information</h3>
        <table className="info-table">
          <tbody>
            <tr>
              <th>Blood Group</th>
              <td>{student.bloodGroup}</td>
              <th>Emergency Contact</th>
              <td>{student.emergencyContact}</td>
            </tr>
            <tr>
              <th>Health Notes</th>
              <td colSpan={3}>{student.healthInfo}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ===== OTHER INFO ===== */}
      <section>
        <h3 className="section-title">Other Details</h3>
        <table className="info-table">
          <tbody>
            <tr>
              <th>Caste</th>
              <td>{student.caste}</td>
              <th>Religion</th>
              <td>{student.religion}</td>
            </tr>
            <tr>
              <th>Nationality</th>
              <td>{student.nationality}</td>
              <th>Mother Tongue</th>
              <td>{student.motherTongue}</td>
            </tr>
            <tr>
              <th>Hobbies</th>
              <td colSpan={3}>{student.hobbies}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ===== SIGNATURE ===== */}
      <div className="signature-area">
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

      {/* ===== FOOTER ===== */}
      <footer className="admission-footer">
        <p>Generated by — School Management System</p>
        <small className="muted">
          Note: Please attach required documents (Aadhar copy, TC, photograph)
          with this form.
        </small>
      </footer>
    </div>
  );
}
