import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Trash2, Edit } from "lucide-react";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    code: "",
    className: "",
    section: "",
    teacher: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Fetch
  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/subjects`);
      setSubjects(res.data);
    } catch (err) {
      console.error("❌ Subject fetch error:", err);
    }
  };
  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/classes`);
      setClasses(res.data);
    } catch (err) {
      console.error("❌ Class fetch error:", err);
    }
  };
  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/teachers`);
      setTeachers(res.data);
    } catch (err) {
      console.error("❌ Teacher fetch error:", err);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchClasses();
    fetchTeachers();
  }, []);

  // Toast
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Save Subject
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/subjects/${editingId}`, form);
        showToast("success", "✅ Subject updated successfully!");
      } else {
        await axios.post(`${API_URL}/api/subjects`, form);
        showToast("success", "✅ Subject added successfully!");
      }
      setForm({ name: "", code: "", className: "", section: "", teacher: "" });
      setEditingId(null);
      setShowModal(false);
      fetchSubjects();
    } catch (err) {
      console.error("❌ Error saving subject:", err);
      showToast("error", "❌ Error saving subject!");
    }
  };

  // Delete
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/subjects/${deleteId}`);
      showToast("success", "🗑️ Subject deleted successfully!");
      setDeleteId(null);
      fetchSubjects();
    } catch (err) {
      console.error("❌ Error deleting subject:", err);
      showToast("error", "❌ Error deleting subject!");
    }
  };

  // Edit
  const handleEdit = (subject) => {
    setForm({
      name: subject.name,
      code: subject.code,
      className: subject.className,
      section: subject.section,
      teacher: subject.teacher || "",
    });
    setEditingId(subject.id);
    setShowModal(true);
  };

  return (
    <div className="p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📚 Subject Management</h2>
        <button
          onClick={() => {
            setForm({ name: "", code: "", className: "", section: "", teacher: "" });
            setEditingId(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          ➕ Add Subject
        </button>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md hidden md:table">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm uppercase text-left">
              <th className="py-3 px-4 border">Name</th>
              <th className="py-3 px-4 border">Code</th>
              <th className="py-3 px-4 border">Class</th>
              <th className="py-3 px-4 border">Section</th>
              <th className="py-3 px-4 border">Teacher</th>
              <th className="py-3 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{s.name}</td>
                <td className="border px-4 py-2">{s.code}</td>
                <td className="border px-4 py-2">{s.className}</td>
                <td className="border px-4 py-2">{s.section}</td>
                <td className="border px-4 py-2">{s.teacher || "-"}</td>
                <td className="border p-2">
                  <div className="flex gap-2 justify-start">
                    <button
                      onClick={() => handleEdit(s)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-yellow-600"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(s.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-red-700"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Card View */}
        <div className="block md:hidden">
          {subjects.map((s) => (
            <div key={s.id} className="bg-white border rounded-lg shadow p-4 space-y-2">
              <p><strong>Name:</strong> {s.name}</p>
              <p><strong>Code:</strong> {s.code}</p>
              <p><strong>Class:</strong> {s.className}</p>
              <p><strong>Section:</strong> {s.section}</p>
              <p><strong>Teacher:</strong> {s.teacher || "-"}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(s)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-yellow-600"
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  onClick={() => setDeleteId(s.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-red-700"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {editingId ? "✏️ Edit Subject" : "➕ Add Subject"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                placeholder="Subject Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border rounded px-3 py-2 w-full"
                required
              />
              <input
                placeholder="Subject Code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="border rounded px-3 py-2 w-full"
                required
              />

              {/* Class Dropdown */}
              <select
                value={form.className}
                onChange={(e) => setForm({ ...form, className: e.target.value, section: "" })}
                className="border rounded px-3 py-2 w-full"
                required
              >
                <option value="">Select Class</option>
                {[...new Set(classes.map((c) => c.name))].map((cls, i) => (
                  <option key={i} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>

              {/* Section Dropdown */}
              <select
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
                className="border rounded px-3 py-2 w-full"
                disabled={!form.className}
                required
              >
                <option value="">Select Section</option>
                {classes
                  .filter((c) => c.name === form.className)
                  .map((c, i) => (
                    <option key={i} value={c.section}>
                      {c.section}
                    </option>
                  ))}
              </select>

              {/* Teacher Dropdown */}
              <select
                value={form.teacher}
                onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm">
            <h3 className="text-lg font-bold mb-2">⚠️ Confirm Delete</h3>
            <p>Are you sure you want to delete this subject?</p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50
            ${
              toast.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
        >
          {toast.type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
