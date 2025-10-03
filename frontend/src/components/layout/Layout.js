import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  DollarSign,
  Bus,
  BedDouble,
  ShieldCheck,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  CreditCard,
  ClipboardList,
  FileText,
  UserCheck,
  UserPlus,
  GraduationCap,
  Briefcase,
} from "lucide-react";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menus = [
    { title: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },

    {
      title: "Students",
      icon: <Users size={20} />,
      submenu: [
        { title: "Add Student", path: "/students/add", icon: <UserPlus size={16} /> },
        { title: "Student List", path: "/students/list", icon: <ClipboardList size={16} /> },
        { title: "Promote Students", path: "/students/promote", icon: <GraduationCap size={16} /> },
        { title: "Attendance", path: "/students/attendance", icon: <Calendar size={16} /> },
        { title: "Results / Grades", path: "/students/results", icon: <FileText size={16} /> },
        { title: "ID Card / Profile", path: "/students/profile", icon: <CreditCard size={16} /> },
      ],
    },
    {
      title: "Teachers",
      icon: <BookOpen size={20} />,
      submenu: [
        { title: "Add Teacher", path: "/teachers/add", icon: <UserPlus size={16} /> },
        { title: "Teacher List", path: "/teachers/list", icon: <ClipboardList size={16} /> },
        { title: "Attendance", path: "/teachers/attendance", icon: <Calendar size={16} /> },
        { title: "Salary / Payroll", path: "/teachers/payroll", icon: <DollarSign size={16} /> },
      ],
    },
    {
      title: "Classes & Subjects",
      icon: <BookOpen size={20} />,
      submenu: [
        { title: "Manage Classes", path: "/classes/manage", icon: <ClipboardList size={16} /> },
        { title: "Manage Sections", path: "/classes/sections", icon: <ClipboardList size={16} /> },
        { title: "Subjects", path: "/classes/subjects", icon: <BookOpen size={16} /> },
        { title: "Timetable", path: "/classes/timetable", icon: <Calendar size={16} /> },
      ],
    },
    {
      title: "Exams & Results",
      icon: <Calendar size={20} />,
      submenu: [
        { title: "Exam Schedule", path: "/exams/schedule", icon: <Calendar size={16} /> },
        { title: "Marks Entry", path: "/exams/marks", icon: <FileText size={16} /> },
        { title: "Report Cards", path: "/exams/reports", icon: <FileText size={16} /> },
        { title: "Grade Analysis", path: "/exams/grades", icon: <GraduationCap size={16} /> },
      ],
    },
    {
      title: "Fees & Accounts",
      icon: <DollarSign size={20} />,
      submenu: [
        { title: "Fee Collection", path: "/fees/collect", icon: <DollarSign size={16} /> },
        { title: "Pending Fees", path: "/fees/pending", icon: <ClipboardList size={16} /> },
        { title: "Expenses", path: "/fees/expenses", icon: <Briefcase size={16} /> },
        { title: "Income Report", path: "/fees/income", icon: <FileText size={16} /> },
      ],
    },
    {
      title: "Library",
      icon: <BookOpen size={20} />,
      submenu: [
        { title: "Books", path: "/library/books", icon: <BookOpen size={16} /> },
        { title: "Issue/Return", path: "/library/issue", icon: <ClipboardList size={16} /> },
        { title: "Students with Due Books", path: "/library/due", icon: <FileText size={16} /> },
      ],
    },
    {
      title: "Transport",
      icon: <Bus size={20} />,
      submenu: [
        { title: "Bus Routes", path: "/transport/routes", icon: <Bus size={16} /> },
        { title: "Drivers", path: "/transport/drivers", icon: <Users size={16} /> },
        { title: "Fee Collection", path: "/transport/fees", icon: <DollarSign size={16} /> },
      ],
    },
    {
      title: "Hostel",
      icon: <BedDouble size={20} />,
      submenu: [
        { title: "Rooms", path: "/hostel/rooms", icon: <BedDouble size={16} /> },
        { title: "Allotment", path: "/hostel/allotment", icon: <ClipboardList size={16} /> },
        { title: "Hostel Fees", path: "/hostel/fees", icon: <DollarSign size={16} /> },
      ],
    },
    {
      title: "Administration",
      icon: <ShieldCheck size={20} />,
      submenu: [
        { title: "Roles & Permissions", path: "/admin/roles", icon: <ShieldCheck size={16} /> },
        { title: "Settings", path: "/admin/settings", icon: <Settings size={16} /> },
        { title: "User Management", path: "/admin/users", icon: <Users size={16} /> },
        { title: "School Profile", path: "/school-profile", icon: <CreditCard size={16} /> },
      ],
    },
    { title: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } bg-blue-900 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4">
          <span className={`${!isOpen && "hidden"} text-lg font-bold`}>
            🏫 School
          </span>
          <button onClick={toggleSidebar}>
            <Menu size={22} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {menus.map((menu, idx) => (
            <div key={idx}>
              <button
                onClick={() =>
                  menu.submenu
                    ? setOpenMenu(openMenu === idx ? null : idx)
                    : null
                }
                className="flex items-center w-full px-4 py-2 hover:bg-blue-700 transition"
              >
                <span>{menu.icon}</span>
                {isOpen && (
                  <span className="ml-3 flex-1 text-left">{menu.title}</span>
                )}
                {menu.submenu &&
                  isOpen &&
                  (openMenu === idx ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  ))}
              </button>

              {/* Submenu */}
              {menu.submenu && openMenu === idx && isOpen && (
                <div className="ml-10">
                  {menu.submenu.map((sub, subIdx) => (
                    <a
                      key={subIdx}
                      href={sub.path}
                      className="flex items-center gap-2 px-2 py-1 text-sm hover:text-yellow-300"
                    >
                      {sub.icon}
                      {sub.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold">School Management</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">👤 Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
