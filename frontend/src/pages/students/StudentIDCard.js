import React from "react";
import StudentIDCardList from "../../components/StudentIDCardList";

export default function StudentIDCard({ student }) {
  return (
    <div className="student">
      {/* Bulk All Student ID Card List */}
      <StudentIDCardList />

      {/* চাইলে Single Student এর কার্ড টেস্ট করতে পারেন */}
      {/* <StudentIDCard school={schoolObj} student={studentObj} /> */}
    </div>
  );
}
