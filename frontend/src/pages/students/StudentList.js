import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, CheckCircle, XCircle, FileText, UserX } from "lucide-react";
import { handleDownloadPDF } from "../../utils/handleDownloadPDF";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Load students + classes
  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/students`);
      setStudents(res.data);
    } catch (err) {
      showToast("error", "❌ Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/classes`);
      setClasses(res.data);
    } catch (err) {
      console.error("❌ Error loading classes:", err.message);
    }
  };

  // Toast
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  // Delete
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/students/${deleteId}`);
      setStudents(students.filter((s) => s.id !== deleteId));
      setDeleteId(null);
      showToast("success", "✅ Student deleted successfully");
    } catch (err) {
      showToast("error", "❌ Delete failed");
    }
  };

  // Edit
  const handleEditClick = (student) => {
    setEditStudent(student);
    setForm(student);

    // Sections filter by class
    const filtered = classes
      .filter((cls) => cls.name === student.className)
      .map((cls) => cls.section);
    setSections(filtered);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };

    if (name === "className") {
      const filtered = classes.filter((cls) => cls.name === value).map((cls) => cls.section);
      setSections(filtered);
      updatedForm.section = "";
    }

    setForm(updatedForm);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/api/students/${editStudent.id}`, form);
      setStudents(
        students.map((s) => (s.id === editStudent.id ? { ...s, ...form } : s))
      );
      setEditStudent(null);
      showToast("success", "✅ Student updated successfully");
    } catch (err) {
      showToast("error", "❌ Update failed");
    }
  };

  if (loading) return <p className="p-6">⏳ Loading students...</p>;

  return (
    <div className="p-6 relative">
      <h2 className="text-2xl font-semibold mb-4">📋 Student List</h2>

      {/* Student Table */}
      {students.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 bg-white shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Photo</th>
                <th className="border p-2">UID</th>
                <th className="border p-2">Admission No</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Section</th>
                <th className="border p-2">Roll</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="border p-2 text-center">
                    {s.photo ? (
                      <img
                        src={`${API_URL}${s.photo}`}
                        alt={s.name}
                        className="w-12 h-12 object-cover rounded-full mx-auto"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="border p-2">{s.uid}</td>
                  <td className="border p-2">{s.admissionNo}</td>
                  <td className="border p-2">{s.name}</td>
                  <td className="border p-2">{s.className}</td>
                  <td className="border p-2">{s.section}</td>
                  <td className="border p-2">{s.roll}</td>
                  <td className="border p-2">{s.phone}</td>
                  <td className="border p-2 text-center flex justify-center gap-3">
                    <button
                      onClick={() => handleEditClick(s)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteId(s.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(s.id, s.admissionNo)}
                      className="text-green-600 hover:text-green-800"
                      title="Download PDF"
                    >
                      <FileText size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Empty state
        <div className="flex flex-col items-center justify-center bg-white p-10 rounded-lg shadow-md mt-6">
          <UserX size={60} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Students Found
          </h3>
          <p className="text-gray-500 text-sm text-center max-w-sm">
            Currently there are no students added in the system. Please add new
            students to see them listed here.
          </p>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-2">⚠️ Confirm Delete</h3>
            <p>Are you sure you want to delete this student?</p>
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

      {/* Edit Modal */}
      {editStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <h3 className="text-lg font-bold mb-4">✏️ Edit Student</h3>

            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                name="uid"
                value={form.uid || ""}
                readOnly
                className="border rounded px-3 py-2 w-full bg-gray-100 cursor-not-allowed"
              />
              <input
                type="text"
                name="admissionNo"
                value={form.admissionNo || ""}
                readOnly
                className="border rounded px-3 py-2 w-full bg-gray-100 cursor-not-allowed"
              />
              <input
                type="text"
                name="name"
                value={form.name || ""}
                onChange={handleEditChange}
                className="border rounded px-3 py-2 w-full"
              />
              <select
                name="className"
                value={form.className || ""}
                onChange={handleEditChange}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">Select Class</option>
                {[...new Set(classes.map((cls) => cls.name))].map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
              <select
                name="section"
                value={form.section || ""}
                onChange={handleEditChange}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">Select Section</option>
                {sections.map((sec, i) => (
                  <option key={i} value={sec}>{sec}</option>
                ))}
              </select>
              <input
                type="number"
                name="roll"
                value={form.roll || ""}
                onChange={handleEditChange}
                className="border rounded px-3 py-2 w-full"
              />
              <input
                type="text"
                name="father"
                value={form.father || ""}
                onChange={handleEditChange}
                placeholder="Father's Name"
                className="border rounded px-3 py-2 w-full"
              />
              <input
                type="text"
                name="phone"
                value={form.phone || ""}
                onChange={handleEditChange}
                placeholder="Phone"
                className="border rounded px-3 py-2 w-full"
              />
              <input
                type="email"
                name="email"
                value={form.email || ""}
                onChange={handleEditChange}
                placeholder="Email"
                className="border rounded px-3 py-2 w-full"
              />
              <textarea
                name="address"
                value={form.address || ""}
                onChange={handleEditChange}
                placeholder="Address"
                className="border rounded px-3 py-2 w-full"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setEditStudent(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50
            ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
        >
          {toast.type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
