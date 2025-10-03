import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; // animation
// import AddressSelector from "./AddressSelector";

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
    const res = await axios.get(`${API_URL}/api/classes`);
    setClasses(res.data);
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
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      await axios.post(`${API_URL}/api/students`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("success", "✅ Student admitted successfully!");
      setFormData({});
      setPreview(null);
      setStep(1);
    } catch (err) {
      console.error("❌ Submit error:", err.message);
      showToast("error", "❌ Failed to submit admission form");
    }
  };

  const [address, setAddress] = useState({});

  const handleAddressChange = (data) => {
    setAddress(data); // এখানে district, ps, po, village থাকবে
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
        className="border rounded px-3 h-10 focus:ring focus:ring-blue-200"
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
        className="border rounded px-3 h-10 focus:ring focus:ring-blue-200"
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
    <div className="relative max-w-5xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded-lg overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="flex items-center mb-8">
          {["Basic", "Parent", "Other"].map((label, index) => (
            <div key={index} className="flex-1">
              <div
                className={`h-2 rounded-full ${
                  step > index ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></div>
              <p
                className={`text-center text-sm mt-1 ${
                  step === index + 1
                    ? "font-bold text-blue-600"
                    : "text-gray-500"
                }`}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Step Content with Animation */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-6">
                Step 1: Basic & Academic Info
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput("Aadhaar No", "uid", "text", { required: true })}
                {renderInput("Full Name", "name", "text", { required: true })}
                {renderSelect("Gender", "gender", ["Male", "Female", "Other"], {
                  required: true,
                })}
                {renderInput("Date of Birth", "dob", "date", { required: true })}
                <div className="flex flex-col col-span-2">
                  <label className="mb-1 text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    onChange={handleChange}
                    value={formData.address || ""}
                    className="border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                    required
                  ></textarea>
                </div>
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
                    Photo
                  </label>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handleChange}
                    className="border rounded px-3 py-2"
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
              
                {/* <AddressSelector onChange={handleAddressChange} /> */}


              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded"
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
            >
              <h2 className="text-xl font-bold mb-6">
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
                    className="border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-400 text-white rounded"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded"
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
            >
              <h2 className="text-xl font-bold mb-6">Step 3: Other Info</h2>
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
                    className="border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-400 text-white rounded"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded"
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
          className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50
          ${toast.type === "success" ? "bg-green-600" : "bg-red-600"} text-white`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
