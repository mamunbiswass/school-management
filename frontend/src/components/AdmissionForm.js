import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode } from "lucide-react";
import AadhaarQRModal from "./AadhaarQRModal";

export default function AdmissionForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [toast, setToast] = useState(null);
  const [aadhaarExists, setAadhaarExists] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/classes`);
      setClasses(res.data);
    } catch (err) {
      console.error("Class fetch error:", err);
    }
  };

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // ✅ Aadhaar validation + DB check
  const handleAadhaarChange = async (e) => {
    const value = e.target.value.replace(/\D/g, ""); // only digits
    setFormData({ ...formData, uid: value });

    if (value.length === 12) {
      try {
        const res = await axios.get(`${API_URL}/api/students/check-aadhaar/${value}`);
        if (res.data.exists) {
          showToast("error", "⚠️ Aadhaar already admitted!");
          setAadhaarExists(true);
        } else {
          showToast("success", "✅ Aadhaar is valid and available");
          setAadhaarExists(false);
        }
      } catch {
        showToast("error", "❌ Error checking Aadhaar");
      }
    } else {
      setAadhaarExists(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files?.length) {
      setFormData({ ...formData, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      const updated = { ...formData, [name]: value };
      if (name === "className") {
        const filtered = classes
          .filter((c) => c.name === value)
          .map((c) => c.section);
        setSections(filtered);
      }
      setFormData(updated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (aadhaarExists) {
      showToast("error", "❌ Duplicate Aadhaar! Admission not allowed.");
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      await axios.post(`${API_URL}/api/students`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("success", "🎉 Student admitted successfully!");
      setFormData({});
      setPreview(null);
      setStep(1);
    } catch {
      showToast("error", "❌ Failed to submit admission form");
    }
  };

  const handleAadhaarScan = (data) => {
    setFormData((prev) => ({
      ...prev,
      uid: data.uid,
      name: data.name,
      dob: data.dob,
      gender: data.gender,
      address: data.address,
    }));
    showToast("success", "📥 Aadhaar QR data auto-filled!");
  };

  const renderInput = (label, name, type = "text", extra = {}) => (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        onChange={handleChange}
        value={formData[name] || ""}
        className="border rounded-lg px-3 h-10 focus:ring-2 focus:ring-blue-300 transition"
        {...extra}
      />
    </div>
  );

  const renderSelect = (label, name, options, extra = {}) => (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        onChange={handleChange}
        value={formData[name] || ""}
        className="border rounded-lg px-3 h-10 focus:ring-2 focus:ring-blue-300 transition"
        {...extra}
      >
        <option value="">Select {label}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg p-8 rounded-xl mt-8 mb-8 relative">
      {/* Progress Bar */}
      <div className="flex items-center mb-6">
        {["Basic", "Parent", "Other"].map((label, index) => (
          <div key={index} className="flex-1 text-center">
            <div
              className={`h-2 rounded-full ${
                step > index ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></div>
            <p
              className={`text-sm mt-1 ${
                step === index + 1
                  ? "font-semibold text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Aadhaar Field */}
      <div className="flex items-end gap-2 mb-8">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700">
            Aadhaar Number
          </label>
          <input
            type="text"
            name="uid"
            value={formData.uid || ""}
            onChange={handleAadhaarChange}
            maxLength={12}
            placeholder="Enter or scan Aadhaar"
            className={`border rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-200 ${
              aadhaarExists ? "border-red-500" : ""
            }`}
          />
        </div>
        <button
          type="button"
          onClick={() => setQrOpen(true)}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          title="Scan Aadhaar QR"
        >
          <QrCode size={22} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {/* Step 1 - Basic Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {renderInput("Full Name", "name", "text", { required: true })}
              {renderSelect("Gender", "gender", ["Male", "Female", "Other"], {
                required: true,
              })}
              {renderInput("Date of Birth", "dob", "date", { required: true })}
              {renderSelect(
                "Class",
                "className",
                [...new Set(classes.map((cls) => cls.name))],
                { required: true }
              )}
              {renderSelect("Section", "section", sections, {
                disabled: !formData.className,
                required: true,
              })}
              {renderInput("Roll No", "roll", "number")}
              {renderInput("Previous School", "prevSchool")}
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  name="address"
                  onChange={handleChange}
                  value={formData.address || ""}
                  className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-200"
                ></textarea>
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Photo
                </label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="mt-2 w-28 h-28 object-cover rounded border"
                  />
                )}
              </div>

              <div className="col-span-2 flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Next →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2 - Parent & Guardian Info */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {renderInput("Father's Name", "father")}
              {renderInput("Mother's Name", "mother")}
              {renderInput("Phone", "phone", "text", { required: true })}
              {renderInput("Email", "email", "email")}
              {renderInput("Guardian Name", "guardian")}
              {renderInput("Guardian Relation", "guardianRelation")}
              {renderInput("Guardian Phone", "guardianPhone")}
              {renderInput("Admission Date", "admissionDate", "date", {
                value:
                  formData.admissionDate ||
                  new Date().toISOString().split("T")[0],
              })}
              

              <div className="col-span-2 flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2 bg-gray-400 text-white rounded-lg"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Next →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3 - Other Info */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {renderSelect("Caste", "caste", [
                "General",
                "OBC",
                "SC",
                "ST",
                "Minority",
              ])}
              {renderSelect("Religion", "religion", [
                "Hindu",
                "Muslim",
                "Christian",
                "Sikh",
                "Other",
              ])}
              {renderSelect("Mother Tongue", "motherTongue", [
                "Bengali",
                "Hindi",
                "English",
                "Tamil",
                "Other",
              ])}
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Hobbies / Interests
                </label>
                <textarea
                  name="hobbies"
                  value={formData.hobbies || ""}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-200"
                ></textarea>
              </div>
              <div className="col-span-2 flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-gray-400 text-white rounded-lg"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={aadhaarExists}
                  className={`px-6 py-2 rounded-lg text-white transition ${
                    aadhaarExists
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  ✅ Submit Admission
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* QR Modal */}
      <AadhaarQRModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        onScan={handleAadhaarScan}
      />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 px-5 py-3 rounded-lg shadow-lg text-white text-sm ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
