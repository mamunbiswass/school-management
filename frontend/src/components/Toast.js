import React, { useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // 3 sec auto close
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-green-100" />,
      bg: "bg-green-600",
    },
    error: {
      icon: <XCircle className="w-5 h-5 text-red-100" />,
      bg: "bg-red-600",
    },
    warn: {
      icon: <AlertTriangle className="w-5 h-5 text-yellow-100" />,
      bg: "bg-yellow-600",
    },
    info: {
      icon: <Info className="w-5 h-5 text-blue-100" />,
      bg: "bg-blue-600",
    },
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div
        className={`flex items-center gap-3 text-white px-4 py-3 rounded shadow-lg ${styles[type].bg}`}
      >
        {/* Icon */}
        {styles[type].icon}

        {/* Message */}
        <span className="flex-1">{message}</span>

        {/* Close Button */}
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
