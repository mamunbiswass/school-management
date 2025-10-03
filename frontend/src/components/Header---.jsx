import { Bell, Menu } from "lucide-react";

export default function Header({ toggleSidebar }) {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-20">
      {/* Left: Hamburger for Mobile */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg md:text-xl font-bold">School Management</h1>
      </div>

      {/* Right: Notification + Avatar */}
      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer">
          <Bell size={22} />
          <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs px-1 rounded-full">
            3
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-bold text-sm">
          A
        </div>
      </div>
    </header>
  );
}
