import React, { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  AlertTriangle,
  MoreVertical,
} from "lucide-react";
import axios from "axios";

export default function ManageClasses() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    section: "",
    teacher: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [mode, setMode] = useState("class"); // "class" or "section"
  const [showMenu, setShowMenu] = useState(null); // kebab menu state

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
    fetchStudents();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/classes`);
      setClasses(res.data);
    } catch (err) {
      console.error("❌ Fetch error:", err);
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

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/students`);
      setStudents(res.data);
    } catch (err) {
      console.error("❌ Student fetch error:", err);
    }
  };

  // Group classes by name
  const groupedClasses = classes.reduce((acc, cls) => {
    const className = cls.name.toUpperCase();
    if (!acc[className]) acc[className] = [];
    acc[className].push({ ...cls, section: cls.section.toUpperCase() });
    return acc;
  }, {});

  const handleSave = async () => {
    setErrorMsg("");
    if (!formData.name) {
      setErrorMsg("⚠️ Class name is required.");
      return;
    }

    let section = formData.section ? formData.section.toUpperCase() : "";

    // ➕ New class হলে section default "A"
    if (mode === "class") {
      section = "A";
    }

    const className = formData.name.toUpperCase();

    // Duplicate validation
    const duplicate = classes.find(
      (c) =>
        c.name.toUpperCase() === className &&
        c.section.toUpperCase() === section &&
        (!editingClass || editingClass.id !== c.id) // ✅ id (MySQL)
    );
    if (duplicate) {
      setErrorMsg("⚠️ This class & section already exists!");
      return;
    }

    try {
      const payload = {
        ...formData,
        name: className,
        section,
      };

      if (editingClass) {
        await axios.put(`${API_URL}/api/classes/${editingClass.id}`, payload); // ✅ id
      } else {
        await axios.post(`${API_URL}/api/classes`, payload);
      }
      fetchClasses();
      setShowModal(false);
    } catch (err) {
      console.error("❌ Save error:", err);
      setErrorMsg("Failed to save class. Try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this class/section?")) {
      try {
        await axios.delete(`${API_URL}/api/classes/${id}`); // ✅ id
        fetchClasses();
      } catch (err) {
        console.error("❌ Delete error:", err);
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">🏫 Manage Classes</h2>
        <button
          onClick={() => {
            setMode("class");
            setEditingClass(null);
            setFormData({ name: "", section: "", teacher: "" });
            setErrorMsg("");
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          <Plus size={18} /> Add Class
        </button>
      </div>

      {/* Table */}
      <div className="space-y-6">
        {Object.keys(groupedClasses).length === 0 && (
          <div className="text-center text-gray-500 py-6 bg-white rounded-lg shadow">
            No classes found. Please add a class.
          </div>
        )}

        {Object.keys(groupedClasses).map((className) => (
          <div
            key={className}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* Class Header */}
            <div className="px-4 py-3 bg-gray-100 border-b flex justify-between items-center relative">
              <h3 className="text-lg font-bold">{className}</h3>

              <div className="flex items-center gap-2">
                {/* Add Section Button */}
                <button
                  onClick={() => {
                    setMode("section");
                    setEditingClass(null);
                    setFormData({ name: className, section: "", teacher: "" });
                    setErrorMsg("");
                    setShowModal(true);
                  }}
                  className="flex items-center gap-1 text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  <Plus size={14} /> Add Section
                </button>

                {/* 3-dot menu */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setShowMenu((prev) =>
                        prev === className ? null : className
                      )
                    }
                    className="p-2 hover:bg-gray-200 rounded"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {showMenu === className && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
                      <button
                        onClick={() => {
                          setEditingClass(
                            classes.find(
                              (c) => c.name.toUpperCase() === className
                            )
                          );
                          setMode("class");
                          setFormData({
                            name: className,
                            section: "",
                            teacher: "",
                          });
                          setErrorMsg("");
                          setShowModal(true);
                          setShowMenu(null);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        ✏️ Edit Class
                      </button>
                      <button
                        onClick={() => {
                          const classIds = classes
                            .filter(
                              (c) => c.name.toUpperCase() === className
                            )
                            .map((c) => c.id); // ✅ id
                          if (
                            window.confirm(
                              `Delete class ${className}? (This will remove all its sections too)`
                            )
                          ) {
                            classIds.forEach((id) => handleDelete(id));
                          }
                          setShowMenu(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                      >
                        🗑️ Delete Class
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sections Table */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="p-3 border">Section</th>
                  <th className="p-3 border">Teacher</th>
                  <th className="p-3 border text-center">Students</th>
                  <th className="p-3 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedClasses[className].map((cls) => (
                  <tr key={cls.id} className="hover:bg-gray-50">
                    <td className="p-3 border font-medium">{cls.section}</td>
                    <td className="p-3 border">{cls.teacher || "-"}</td>
                    <td className="p-3 border text-center flex justify-center items-center gap-1">
                      <Users size={16} />{" "}
                      {
                        students.filter(
                          (stu) =>
                            stu.className.toUpperCase() ===
                              cls.name.toUpperCase() &&
                            stu.section.toUpperCase() ===
                              cls.section.toUpperCase()
                        ).length
                      }
                    </td>
                    <td className="p-3 border text-center justify-center gap-3">
                      <button
                        onClick={() => {
                          setEditingClass(cls);
                          setMode("section");
                          setFormData({
                            name: cls.name,
                            section: cls.section,
                            teacher: cls.teacher,
                          });
                          setErrorMsg("");
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cls.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {editingClass
                ? "✏️ Edit Section"
                : mode === "class"
                ? "➕ Add Class"
                : "➕ Add Section"}
            </h3>

            {errorMsg && (
              <div className="mb-3 flex items-center gap-2 text-red-600 text-sm">
                <AlertTriangle size={16} /> {errorMsg}
              </div>
            )}

            <div className="space-y-3">
              {/* Class Name */}
              <input
                type="text"
                placeholder="Class Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value.toUpperCase(),
                  })
                }
                className="border rounded px-3 py-2 w-full"
                disabled={mode === "section"}
              />

              {/* Section Dropdown (only for section mode) */}
              {mode === "section" && (
                <select
                  value={formData.section}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      section: e.target.value.toUpperCase(),
                    })
                  }
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="">Select Section</option>
                  {["A", "B", "C", "D", "E", "F"]
                    .filter(
                      (s) =>
                        !groupedClasses[formData.name]?.some(
                          (cls) => cls.section.toUpperCase() === s
                        )
                    )
                    .map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                </select>
              )}

              {/* Teacher Dropdown */}
              <select
                value={formData.teacher}
                onChange={(e) =>
                  setFormData({ ...formData, teacher: e.target.value })
                }
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.name}> {/* ✅ id */}
                    {t.name}
                  </option>
                ))}
              </select>
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
    </div>
  );
}
