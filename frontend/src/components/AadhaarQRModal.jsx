import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function AadhaarQRModal({ open, onClose, onScan }) {
  const parseAadhaarXML = (xmlText) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const data = xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0];
      if (!data) return null;

      const uid = data.getAttribute("uid");
      const name = data.getAttribute("name");
      const dob = data.getAttribute("dob");
      const gender = data.getAttribute("gender");
      const house = data.getAttribute("house") || "";
      const street = data.getAttribute("street") || "";
      const po = data.getAttribute("po") || "";
      const dist = data.getAttribute("dist") || "";
      const state = data.getAttribute("state") || "";
      const address = `${house} ${street}, ${po}, ${dist}, ${state}`;

      return {
        uid,
        name,
        dob,
        gender: gender === "M" ? "Male" : gender === "F" ? "Female" : "Other",
        address,
      };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (open) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        (decodedText) => {
          const parsed = parseAadhaarXML(decodedText);
          if (parsed) {
            onScan(parsed);
            scanner.clear();
            onClose();
          } else {
            alert("⚠️ Invalid Aadhaar QR!");
          }
        },
        (err) => console.warn("QR Scan Error:", err)
      );

      return () => {
        scanner.clear().catch(() => {});
      };
    }
  }, [open, onScan, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md relative">
        <h2 className="text-lg font-bold text-blue-700 text-center mb-4">
          📸 Scan Aadhaar QR Code
        </h2>
        <div id="qr-reader" className="rounded-md overflow-hidden" />
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black"
        >
          ✖
        </button>
      </div>
    </div>
  );
}
