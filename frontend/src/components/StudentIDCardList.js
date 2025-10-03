import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentIDCard from "./StudentIDCard";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function StudentIDCardList() {
  const [students, setStudents] = useState([]);
  const [school, setSchool] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchSchool();
    fetchStudents();
  }, []);

  const fetchSchool = async () => {
    const res = await axios.get(`${API_URL}/api/school`);
    setSchool(res.data);
  };

  const fetchStudents = async () => {
    const res = await axios.get(`${API_URL}/api/students`);
    setStudents(res.data);
  };

  // Print all cards in a PDF
  const printAll = async () => {
    const element = document.getElementById("id-cards-print");
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("Student_ID_Cards.pdf");
  };

  if (!school) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4">
        🏫 {school.name} – Student ID Cards
      </h2>

      <div id="id-cards-print" className="id-card-grid">
        {students.map((s) => (
          <StudentIDCard key={s.id} school={school} student={s} />
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={printAll}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Download All as PDF
        </button>
      </div>
    </div>
  );
}
