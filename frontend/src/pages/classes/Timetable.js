import { useState, useEffect } from "react";
import axios from "axios";
import { formatTime } from "../../utils/timeFormat";

export default function Timetable() {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [deleteId, setDeleteId] = useState(null);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Load dropdowns
  useEffect(() => {
    fetchClasses();
    fetchTeachers();
    fetchSubjects();
  }, []);

  const fetchClasses = async () => {
    const res = await axios.get(`${API_URL}/api/classes`);
    setClasses(res.data);
  };

  const fetchTeachers = async () => {
    const res = await axios.get(`${API_URL}/api/teachers`);
    setTeachers(res.data);
  };

  const fetchSubjects = async () => {
    const res = await axios.get(`${API_URL}/api/subjects`);
    setSubjects(res.data);
  };

  // Load timetable
  useEffect(() => {
    if (selectedClass && selectedSection) {
      fetchTimetable();
    }
  }, [selectedClass, selectedSection]);

  const fetchTimetable = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/timetable/${selectedClass}/${selectedSection}`
      );
      setTimetable(res.data);
    } catch (err) {
      setTimetable([]);
    }
  };

  // Open Modal for Add/Edit
  const openModal = (entry = null, day = "") => {
    setModalData(
      entry || {
        id: null,
        className: selectedClass,
        section: selectedSection,
        day,
        startTime: "",
        endTime: "",
        subjectId: "",
        teacherId: "",
      }
    );
    setShowModal(true);
  };

  // Save / Update
  const handleSave = async () => {
    try {
      if (modalData.id) {
        await axios.put(`${API_URL}/api/timetable/${modalData.id}`, modalData);
      } else {
        await axios.post(`${API_URL}/api/timetable`, modalData);
      }
      setShowModal(false);
      fetchTimetable();
    } catch (err) {
      console.error("❌ Save error:", err.message);
    }
  };

  // Delete
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/timetable/${deleteId}`);
      setDeleteId(null);
      fetchTimetable();
    } catch (err) {
      console.error("❌ Delete error:", err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📅 Class Timetable</h2>

      {/* Selectors */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Select Class</option>
          {[...new Set(classes.map((c) => c.name))].map((cls, i) => (
            <option key={i} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="border rounded px-3 py-2"
          disabled={!selectedClass}
        >
          <option value="">Select Section</option>
          {classes
            .filter((c) => c.name === selectedClass)
            .map((c, i) => (
              <option key={i} value={c.section}>
                {c.section}
              </option>
            ))}
        </select>
      </div>

      {/* Table */}
      {selectedClass && selectedSection && (
        <table className="w-full border border-gray-300 bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Day</th>
              <th className="border p-2 text-left">Periods</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => {
              const dayPeriods = timetable.filter((t) => t.day === day);
              return (
                <tr key={day} className="hover:bg-gray-50">
                  <td className="border p-2 font-bold">{day}</td>
                  <td className="border p-2">
                    {dayPeriods.length > 0 ? (
                      <ul className="space-y-1">
                        {dayPeriods.map((p) => (
                          <li
                            key={p.id}
                            className="flex justify-between items-center bg-gray-50 px-2 py-1 rounded"
                          >
                            <span>
                              {formatTime(p.startTime)} - {formatTime(p.endTime)}:{" "}
                              <b>{p.subjectName}</b> ({p.teacherName})
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => openModal(p)}
                                className="px-2 py-1 text-sm bg-yellow-500 text-white rounded"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => setDeleteId(p.id)}
                                className="px-2 py-1 text-sm bg-red-600 text-white rounded"
                              >
                                🗑
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="px-2">—</span>
                    )}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                        onClick={() => openModal(null, day)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        ➕ Add Period
                      </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {modalData.id ? "✏️ Edit Period" : "➕ Add Period"}
            </h3>

            <div className="space-y-3">
              <select
                value={modalData.subjectId}
                onChange={(e) =>
                  setModalData({ ...modalData, subjectId: e.target.value })
                }
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                value={modalData.teacherId}
                onChange={(e) =>
                  setModalData({ ...modalData, teacherId: e.target.value })
                }
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <input
                  type="time"
                  value={modalData.startTime}
                  onChange={(e) =>
                    setModalData({ ...modalData, startTime: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full"
                />
                <input
                  type="time"
                  value={modalData.endTime}
                  onChange={(e) =>
                    setModalData({ ...modalData, endTime: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-2">⚠️ Confirm Delete</h3>
            <p>Are you sure you want to delete this period?</p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
