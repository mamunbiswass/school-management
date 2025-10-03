import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Phone, Mail, UserRound, Globe } from "lucide-react";

export default function SchoolProfile() {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const [school, setSchool] = useState(null);
  const [formData, setFormData] = useState({});
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchSchoolInfo();
  }, []);

  const fetchSchoolInfo = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/school`);
      setSchool(res.data);
      setFormData(res.data);
    } catch (err) {
      showToast("error", "❌ Failed to load school info");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!school?.id) {
      showToast("error", "Invalid school data");
      return;
    }

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        form.append(key, value || "")
      );
      if (logo) form.append("logo", logo);

      await axios.put(`${API_URL}/api/school/${school.id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("success", "✅ School info updated!");
      fetchSchoolInfo();
    } catch (err) {
      showToast("error", "❌ Update failed");
    }
  };

  const handleDeleteLogo = async () => {
    if (!window.confirm("Delete school logo?")) return;
    try {
      await axios.delete(`${API_URL}/api/school/${school.id}/logo`);
      showToast("success", "🗑️ Logo removed!");
      fetchSchoolInfo();
    } catch (err) {
      showToast("error", "❌ Failed to delete logo");
    }
  };

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        ⏳ Loading school info...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* ===== Left: Edit Form ===== */}
      <div className="bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          🏫 School Profile Settings
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">School Name</label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Principal */}
          <div>
            <label className="block text-sm font-medium mb-1">Principal</label>
            <input
              type="text"
              value={formData.principal || ""}
              onChange={(e) =>
                setFormData({ ...formData, principal: e.target.value })
              }
              className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              value={formData.address || ""}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
              rows="2"
            ></textarea>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium mb-1">Website URL</label>
            <input
              type="url"
              value={formData.website || ""}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">School Logo</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files[0])}
                className="w-full"
              />
              {formData.logo && (
                <div className="flex flex-col items-center">
                  <img
                    src={`${API_URL}/${formData.logo}`}
                    alt="School Logo"
                    className="w-20 h-20 object-cover rounded border shadow"
                  />
                  <button
                    type="button"
                    onClick={handleDeleteLogo}
                    className="text-red-600 text-xs mt-1 hover:underline"
                  >
                    🗑 Delete Logo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
          >
            💾 Save Changes
          </button>
        </div>
      </div>

      {/* ===== Right: Visiting Card Style Preview ===== */}
      <div className="bg-white shadow-lg rounded-xl p-6 flex items-center">
        {/* Logo Left */}
        <div className="w-28 h-28 rounded-lg overflow-hidden shadow border bg-gray-50 flex items-center justify-center">
          {logo ? (
            <img
              src={URL.createObjectURL(logo)}
              alt="Preview Logo"
              className="w-full h-full object-cover"
            />
          ) : formData.logo ? (
            <img
              src={`${API_URL}/${formData.logo}`}
              alt="School Logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-sm">No Logo</span>
          )}
        </div>

        {/* Details Right */}
        <div className="ml-6 flex-1">
          <h3 className="text-xl font-bold text-gray-800">
            {formData.name || "School Name"}
          </h3>
          <p className="text-sm text-gray-600 mb-3 italic">
            {formData.principal ? `Principal: ${formData.principal}` : ""}
          </p>

          <div className="space-y-1 text-sm text-gray-700">
            <p className="flex items-center gap-2">
              <MapPin size={14} /> {formData.address || "No address"}
            </p>
            <p className="flex items-center gap-2">
              <Phone size={14} /> {formData.phone || "No phone"}
            </p>
            <p className="flex items-center gap-2">
              <Mail size={14} /> {formData.email || "No email"}
            </p>
            <p className="flex items-center gap-2">
              <Globe size={14} />{" "}
              {formData.website ? (
                <a
                  href={formData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600"
                >
                  {formData.website}
                </a>
              ) : (
                "No website"
              )}
            </p>
          </div>
        </div>
      </div>

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
          {toast.msg}
        </div>
      )}
    </div>
  );
}
