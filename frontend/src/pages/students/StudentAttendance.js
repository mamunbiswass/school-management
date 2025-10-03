// src/pages/StudentAttendance.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users } from "lucide-react";

export default function StudentAttendance() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendance, setAttendance] = useState({});
  const [toast, setToast] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // 🔹 Load classes
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/classes`);
      setClasses(res.data);
    } catch (err) {
      console.error("❌ Class fetch error:", err);
    }
  };

  // 🔹 Load students whenever class + section selected
  useEffect(() => {
    if (selectedClass && selectedSection) {
      fetchStudents();
    }
  }, [selectedClass, selectedSection]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/students?className=${selectedClass}&section=${selectedSection}`
      );
      setStudents(res.data);

      // Init attendance
      const init = {};
      res.data.forEach((s) => {
        init[s._id] = "Present";
      });
      setAttendance(init);
    } catch (err) {
      console.error("❌ Student fetch error:", err);
    }
  };

  // 🔹 Show toast
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  // 🔹 Attendance change
  const handleAttendanceChange = (id, status) => {
    setAttendance({ ...attendance, [id]: status });
  };

  // 🔹 Bulk Mark
  const markAll = (status) => {
    const updated = {};
    students.forEach((s) => {
      updated[s._id] = status;
    });
    setAttendance(updated);
  };

  // 🔹 Save Attendance
  const saveAttendance = async () => {
    try {
      await axios.post(`${API_URL}/api/attendance`, {
        date,
        className: selectedClass,
        section: selectedSection,
        records: attendance,
      });
      showToast(
        "success",
        `✅ Attendance saved for ${selectedClass}-${selectedSection}`
      );
    } catch (err) {
      console.error("❌ Save error:", err);
      showToast("error", "❌ Failed to save attendance");
    }
  };

  // 🔹 Summary
  const summary = {
    total: students.length,
    present: Object.values(attendance).filter((s) => s === "Present").length,
    absent: Object.values(attendance).filter((s) => s === "Absent").length,
    late: Object.values(attendance).filter((s) => s === "Late").length,
    leave: Object.values(attendance).filter((s) => s === "Leave").length,
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">📅 Student Attendance</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        {/* Class Dropdown */}
        <select
          value={selectedClass}
          onChange={(e) => {
            const className = e.target.value;
            setSelectedClass(className);

            // ওই class এর সব section বের করো
            const filteredSections = classes
              .filter((c) => c.name === className)
              .map((c) => c.section);
            setSections(filteredSections);

            setSelectedSection("");
            setStudents([]); // আগের student clear করো
          }}
          className="border rounded px-3 py-2"
        >
          <option value="">Select Class</option>
          {[...new Set(classes.map((cls) => cls.name))].map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Section Dropdown */}
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="border rounded px-3 py-2"
          disabled={!selectedClass}
        >
          <option value="">Select Section</option>
          {sections.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Date */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>

      {/* Summary */}
      {students.length > 0 && (
        <div className="mb-4 flex gap-6 text-sm">
          <span>👥 Total: {summary.total}</span>
          <span className="text-green-600">✅ Present: {summary.present}</span>
          <span className="text-red-600">❌ Absent: {summary.absent}</span>
          <span className="text-orange-600">⏰ Late: {summary.late}</span>
          <span className="text-blue-600">📝 Leave: {summary.leave}</span>
        </div>
      )}

      {/* Bulk Actions */}
      {students.length > 0 && (
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => markAll("Present")}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Mark All Present
          </button>
          <button
            onClick={() => markAll("Absent")}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Mark All Absent
          </button>
          <button
            onClick={() => markAll("Late")}
            className="px-3 py-1 bg-orange-500 text-white rounded"
          >
            Mark All Late
          </button>
          <button
            onClick={() => markAll("Leave")}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Mark All Leave
          </button>
        </div>
      )}

      {/* Table */}
      {students.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 bg-white shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Roll</th>
              <th className="border p-2">Photo</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Admission No</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id}>
                <td className="border p-2">{s.roll}</td>
                <td className="border p-2 text-center">
                  {s.photo ? (
                    <img
                      src={`${API_URL}${s.photo}`}
                      alt={s.name}
                      className="w-10 h-10 rounded-full mx-auto"
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="border p-2">{s.name}</td>
                <td className="border p-2">{s.admissionNo}</td>
                <td className="border p-2">
                  <select
                    value={attendance[s._id]}
                    onChange={(e) =>
                      handleAttendanceChange(s._id, e.target.value)
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="Present">✅ Present</option>
                    <option value="Absent">❌ Absent</option>
                    <option value="Late">⏰ Late</option>
                    <option value="Leave">📝 Leave</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No students loaded.</p>
      )}

      {/* Save Button */}
      {students.length > 0 && (
        <button
          onClick={saveAttendance}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save Attendance
        </button>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
