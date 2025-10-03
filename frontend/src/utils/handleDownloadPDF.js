// src/utils/handleDownloadPDF.js
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import React from "react";
import { createRoot } from "react-dom/client";
import AdmissionFormTemplate from "../components/AdmissionFormTemplate";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const handleDownloadPDF = async (studentId, admissionNo) => {
  try {
    // Student data fetch
    const res = await fetch(`${API_URL}/api/students/${studentId}`);
    const student = await res.json();

    // School info fetch
    const schoolRes = await fetch(`${API_URL}/api/school`);
    const school = await schoolRes.json();

    // Create hidden container
    const container = document.createElement("div");
    container.style.width = "210mm";
    container.style.minHeight = "297mm";
    container.style.padding = "20px";
    container.style.background = "white";
    container.style.position = "absolute";
    container.style.left = "-9999px"; // screen এ দেখাবে না
    document.body.appendChild(container);

    // Render React component
    const root = createRoot(container);
    root.render(<AdmissionFormTemplate school={school} student={student} />);

    // Wait a bit to render
    await new Promise((r) => setTimeout(r, 500));

    // Convert to canvas
    const canvas = await html2canvas(container, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // pdf.save(`AdmissionForm_${admissionNo}.pdf`);
   pdf.autoPrint();
window.open(pdf.output("bloburl"), "_blank");



    // cleanup
    root.unmount();
    document.body.removeChild(container);
  } catch (err) {
    console.error("❌ PDF Generate Error:", err);
    alert("Failed to generate PDF");
  }
};
