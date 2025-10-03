import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { QrCode, X } from "lucide-react";

export default function QrScanner({ onScan }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Open Scanner Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full shadow"
        title="Scan Aadhaar QR"
      >
        <QrCode className="w-6 h-6 text-gray-700" />
      </button>

      {/* Scanner Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md relative p-4">
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-lg font-semibold mb-3 text-center">
              📷 Scan Aadhaar QR
            </h2>

            {/* QR Scanner */}
            <div className="relative border-4 border-green-500 rounded-lg overflow-hidden">
              <Scanner
                onScan={(results) => {
                  if (results?.length > 0) {
                    const value = results[0]?.rawValue; // ✅ Aadhaar QR XML string
                    if (value && typeof onScan === "function") {
                      onScan(value); // Pass full XML string to parent
                    }
                    setOpen(false);
                  }
                }}
                onError={(error) => console.error("Scanner Error:", error?.message)}
                constraints={{ facingMode: "environment" }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
