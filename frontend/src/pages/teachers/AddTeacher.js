import React, { useState } from "react";
import axios from "axios";

const AddTeacher = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    aadhaar: "",
    phone: "",
    altPhone: "",
    email: "",
    address: "",
    employeeId: "",
    subject: "",
    qualification: "",
    designation: "",
    department: "",
    joiningDate: "",
    salary: "",
    classAssignment: "",
    experience: "",
    healthInfo: "",
    emergencyContact: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/teachers`,
        formData
      );

      setMessage("✅ Teacher added successfully!");
      console.log("Saved Teacher:", res.data);
      setFormData({
        name: "",
        dob: "",
        gender: "",
        aadhaar: "",
        phone: "",
        altPhone: "",
        email: "",
        address: "",
        employeeId: "",
        subject: "",
        qualification: "",
        designation: "",
        department: "",
        joiningDate: "",
        salary: "",
        classAssignment: "",
        experience: "",
        healthInfo: "",
        emergencyContact: "",
      });
    } catch (error) {
      console.error("❌ Error adding teacher:", error);
      setMessage("❌ Failed to add teacher. Check console for details.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">👨‍🏫 Add Teacher</h2>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          type="text"
          name="aadhaar"
          placeholder="Aadhaar Number"
          value={formData.aadhaar}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="altPhone"
          placeholder="Alternate Phone"
          value={formData.altPhone}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email ID"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="employeeId"
          placeholder="Employee ID"
          value={formData.employeeId}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="qualification"
          placeholder="Qualification"
          value={formData.qualification}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="designation"
          placeholder="Designation"
          value={formData.designation}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="joiningDate"
          value={formData.joiningDate}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="classAssignment"
          placeholder="Class Assignment"
          value={formData.classAssignment}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="experience"
          placeholder="Experience"
          value={formData.experience}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
        />
        <textarea
          name="healthInfo"
          placeholder="Health Info"
          value={formData.healthInfo}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
        />
        <textarea
          name="emergencyContact"
          placeholder="Emergency Contact"
          value={formData.emergencyContact}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
        />

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Save Teacher
        </button>
      </form>
    </div>
  );
};

export default AddTeacher;
