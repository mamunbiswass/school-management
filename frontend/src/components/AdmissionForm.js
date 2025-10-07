import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function AdmissionForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState(null);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [school, setSchool] = useState(null);
  const [toast, setToast] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchClasses();
    fetchSchool();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/classes`);
      setClasses(res.data);
    } catch (err) {
      console.error("Class fetch error:", err);
    }
  };

  const fetchSchool = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/school`);
      setSchool(res.data);
    } catch {
      setSchool({ name: "My School" });
    }
  };

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });

      if (name === "className") {
        const filtered = classes
          .filter((c) => c.name === value)
          .map((c) => c.section);
        setSections(filtered);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );

      await axios.post(`${API_URL}/api/students`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("success", "🎉 Student admitted successfully!");
      setFormData({});
      setPreview(null);
      setStep(1);
    } catch (err) {
      console.error("Submit error:", err.message);
      showToast("error", "❌ Failed to submit admission form");
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Helper Input/Select renderer
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
    <div className="relative max-w-5xl mx-auto bg-white shadow-lg p-8 rounded-xl mt-8 mb-8">
      {/* School Header */}
      <div className="flex flex-col items-center mb-6 border-b pb-4">
        {school?.logo && (
          <img
            src={`${API_URL}${school.logo}`}
            alt="School Logo"
            className="w-20 h-20 object-contain mb-2"
          />
        )}
        <h1 className="text-2xl font-bold text-blue-700">{school?.name}</h1>
        <p className="text-gray-600 text-sm">{school?.address}</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center mb-8">
        {["Basic Info", "Parent Info", "Other Info"].map((label, index) => (
          <div key={index} className="flex-1 text-center relative">
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

      {/* Animated Form Steps */}
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold mb-4 text-blue-700">
                Step 1: Basic & Academic Info
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput("Aadhaar No", "uid", "text", { required: true })}
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
                <div className="flex flex-col col-span-2">
                  <label className="mb-1 text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    onChange={handleChange}
                    value={formData.address || ""}
                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 transition"
                    required
                  ></textarea>
                </div>
                <div className="flex flex-col col-span-2">
                  <label className="mb-1 text-sm font-medium text-gray-700">
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
              </div>

              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Next →
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold mb-4 text-blue-700">
                Step 2: Parent & Health Info
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput("Father's Name", "father")}
                {renderInput("Mother's Name", "mother")}
                {renderInput("Phone", "phone", "text", { required: true })}
                {renderInput("Email", "email", "email")}
                {renderSelect("Blood Group", "bloodGroup", [
                  "A+",
                  "A-",
                  "B+",
                  "B-",
                  "O+",
                  "O-",
                  "AB+",
                  "AB-",
                ])}
                {renderInput("Emergency Contact", "emergencyContact")}
                <div className="flex flex-col col-span-2">
                  <label className="mb-1 text-sm font-medium text-gray-700">
                    Health Info / Allergies
                  </label>
                  <textarea
                    name="healthInfo"
                    onChange={handleChange}
                    value={formData.healthInfo || ""}
                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 transition"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-between mt-8">
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

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold mb-4 text-blue-700">
                Step 3: Other Info
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="flex flex-col col-span-2">
                  <label className="mb-1 text-sm font-medium text-gray-700">
                    Hobbies / Interests
                  </label>
                  <textarea
                    name="hobbies"
                    onChange={handleChange}
                    value={formData.hobbies || ""}
                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 transition"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-gray-400 text-white rounded-lg"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  ✅ Submit Admission
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 px-5 py-3 rounded-lg shadow-lg text-white text-sm transition transform duration-300 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
