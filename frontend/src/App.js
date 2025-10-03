import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";

// Students
import AddStudent from "./pages/students/AddStudent";
import StudentList from "./pages/students/StudentList";
import PromoteStudents from "./pages/students/PromoteStudents";
import StudentAttendance from "./pages/students/StudentAttendance";
import StudentResults from "./pages/students/StudentResults";
import StudentProfile from "./pages/students/StudentProfile";
import StudentIDCardList from "./components/StudentIDCardList.js";

// Teachers
import AddTeacher from "./pages/teachers/AddTeacher";
import TeacherList from "./pages/teachers/TeacherList";
import TeacherAttendance from "./pages/teachers/TeacherAttendance";
import TeacherPayroll from "./pages/teachers/TeacherPayroll";

// Classes & Subjects
import ManageClasses from "./pages/classes/ManageClasses";
import ManageSections from "./pages/classes/ManageSections";
import Subjects from "./pages/classes/Subjects.js";
import Timetable from "./pages/classes/Timetable";

// Exams
import ExamSchedule from "./pages/exams/ExamSchedule";
import MarksEntry from "./pages/exams/MarksEntry";
import ReportCards from "./pages/exams/ReportCards";
import GradeAnalysis from "./pages/exams/GradeAnalysis";

// Fees
import FeeCollection from "./pages/fees/FeeCollection";
import PendingFees from "./pages/fees/PendingFees";
import Expenses from "./pages/fees/Expenses";
import IncomeReport from "./pages/fees/IncomeReport";

// Library
import LibraryBooks from "./pages/library/LibraryBooks";
import LibraryIssue from "./pages/library/LibraryIssue";
import LibraryDue from "./pages/library/LibraryDue";

// Transport
import BusRoutes from "./pages/transport/BusRoutes";
import Drivers from "./pages/transport/Drivers";
import TransportFees from "./pages/transport/TransportFees";

// Hostel
import HostelRooms from "./pages/hostel/HostelRooms";
import HostelAllotment from "./pages/hostel/HostelAllotment";
import HostelFees from "./pages/hostel/HostelFees";

// Administration
import RolesPermissions from "./pages/admin/RolesPermissions";
import AdminSettings from "./pages/admin/AdminSettings";
import UserManagement from "./pages/admin/UserManagement";

// General
import Dashboard from "./pages/Dashboard";
import GeneralSettings from "./pages/settings/GeneralSettings";

import SchoolProfile from "./pages/SchoolProfile.js";


function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard */}
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        {/* Students */}
        <Route
          path="/students/add"
          element={
            <Layout>
              <AddStudent />
            </Layout>
          }
        />
        <Route
          path="/students/list"
          element={
            <Layout>
              <StudentList />
            </Layout>
          }
        />
        <Route
          path="/students/promote"
          element={
            <Layout>
              <PromoteStudents />
            </Layout>
          }
        />
        <Route
          path="/students/attendance"
          element={
            <Layout>
              <StudentAttendance />
            </Layout>
          }
        />
        <Route
          path="/students/results"
          element={
            <Layout>
              <StudentResults />
            </Layout>
          }
        />
        <Route
          path="/students/profile"
          element={
            <Layout>
              <StudentIDCardList />
            </Layout>
          }
        />

        {/* Teachers */}
        <Route
          path="/teachers/add"
          element={
            <Layout>
              <AddTeacher />
            </Layout>
          }
        />
        <Route
          path="/teachers/list"
          element={
            <Layout>
              <TeacherList />
            </Layout>
          }
        />
        <Route
          path="/teachers/attendance"
          element={
            <Layout>
              <TeacherAttendance />
            </Layout>
          }
        />
        <Route
          path="/teachers/payroll"
          element={
            <Layout>
              <TeacherPayroll />
            </Layout>
          }
        />

        {/* Classes & Subjects */}
        <Route
          path="/classes/manage"
          element={
            <Layout>
              <ManageClasses />
            </Layout>
          }
        />
        <Route
          path="/classes/sections"
          element={
            <Layout>
              <ManageSections />
            </Layout>
          }
        />
        <Route
          path="/classes/subjects"
          element={
            <Layout>
              <Subjects />
            </Layout>
          }
        />
        <Route
          path="/classes/timetable"
          element={
            <Layout>
              <Timetable />
            </Layout>
          }
        />

        {/* Exams */}
        <Route
          path="/exams/schedule"
          element={
            <Layout>
              <ExamSchedule />
            </Layout>
          }
        />
        <Route
          path="/exams/marks"
          element={
            <Layout>
              <MarksEntry />
            </Layout>
          }
        />
        <Route
          path="/exams/reports"
          element={
            <Layout>
              <ReportCards />
            </Layout>
          }
        />
        <Route
          path="/exams/grades"
          element={
            <Layout>
              <GradeAnalysis />
            </Layout>
          }
        />

        {/* Fees */}
        <Route
          path="/fees/collect"
          element={
            <Layout>
              <FeeCollection />
            </Layout>
          }
        />
        <Route
          path="/fees/pending"
          element={
            <Layout>
              <PendingFees />
            </Layout>
          }
        />
        <Route
          path="/fees/expenses"
          element={
            <Layout>
              <Expenses />
            </Layout>
          }
        />
        <Route
          path="/fees/income"
          element={
            <Layout>
              <IncomeReport />
            </Layout>
          }
        />

        {/* Library */}
        <Route
          path="/library/books"
          element={
            <Layout>
              <LibraryBooks />
            </Layout>
          }
        />
        <Route
          path="/library/issue"
          element={
            <Layout>
              <LibraryIssue />
            </Layout>
          }
        />
        <Route
          path="/library/due"
          element={
            <Layout>
              <LibraryDue />
            </Layout>
          }
        />

        {/* Transport */}
        <Route
          path="/transport/routes"
          element={
            <Layout>
              <BusRoutes />
            </Layout>
          }
        />
        <Route
          path="/transport/drivers"
          element={
            <Layout>
              <Drivers />
            </Layout>
          }
        />
        <Route
          path="/transport/fees"
          element={
            <Layout>
              <TransportFees />
            </Layout>
          }
        />

        {/* Hostel */}
        <Route
          path="/hostel/rooms"
          element={
            <Layout>
              <HostelRooms />
            </Layout>
          }
        />
        <Route
          path="/hostel/allotment"
          element={
            <Layout>
              <HostelAllotment />
            </Layout>
          }
        />
        <Route
          path="/hostel/fees"
          element={
            <Layout>
              <HostelFees />
            </Layout>
          }
        />

        {/* Administration */}
        <Route
          path="/admin/roles"
          element={
            <Layout>
              <RolesPermissions />
            </Layout>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <Layout>
              <AdminSettings />
            </Layout>
          }
        />
        <Route
          path="/admin/users"
          element={
            <Layout>
              <UserManagement />
            </Layout>
          }
        />

        {/* General Settings */}
        <Route
          path="/settings"
          element={
            <Layout>
              <GeneralSettings />
            </Layout>
          }
        />

        <Route
          path="/school-profile"
          element={
            <Layout>
              <SchoolProfile />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
