import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function App() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-0 ml-20">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <main className="p-6">
          <h2 className="text-lg font-semibold">Welcome to Dashboard</h2>
          <p className="text-gray-600 mt-2">
            Manage students, teachers, and classes from here.
          </p>
        </main>
      </div>
    </div>
  );
}

export default App;
