import AdmissionForm from "../../components/AdmissionForm";

export default function AddStudent() {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">➕ New Admission</h2>
      <AdmissionForm />
    </div>
  );
}
