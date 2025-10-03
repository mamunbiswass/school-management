// utils/admissionNo.js
export function generateAdmissionNo(schoolName, year, className, section, roll) {
  const schoolCode = schoolName
    .split(" ")
    .map((w) => w[0]?.toUpperCase())
    .join(""); // EKS
  return `${schoolCode}${year}${className}${section}${roll}`;
}
