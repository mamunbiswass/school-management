import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherList() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/teachers");
      setTeachers(res.data);
    } catch (err) {
      console.error("Failed to fetch teachers", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">👨‍🏫 Teacher List</h2>
      <table className="w-full border-collapse border border-gray-300 bg-white shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Subject</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Department</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((t) => (
            <tr key={t._id}>
              <td className="border p-2">{t.name}</td>
              <td className="border p-2">{t.subject}</td>
              <td className="border p-2">{t.phone}</td>
              <td className="border p-2">{t.email}</td>
              <td className="border p-2">{t.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
