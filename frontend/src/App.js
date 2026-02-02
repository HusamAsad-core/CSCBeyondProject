import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import MyCourses from "./pages/Courses/MyCourses";

// Teacher Pages
import CreateCourse from "./pages/Teacher/CreateCourse";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import EditCourse from "./pages/Teacher/EditCourse";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateTeacher from "./pages/Admin/CreateTeacher";
import ManageUsers from "./pages/Admin/ManageUsers";
import ManagePlans from "./pages/Admin/ManagePlans";

// Courses pages
import CoursesList from "./pages/Courses/CoursesList";
import CourseDetails from "./pages/Courses/CourseDetails";

// ✅ Pricing page
import Pricing from "./pages/Pricing";

function App() {
  const userRole = localStorage.getItem("userRole"); // admin | instructor | student
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Header />

      <main className="content-area">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CoursesList />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin */}
          <Route path="/admin" element={userRole === "admin" ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin/create-teacher" element={userRole === "admin" ? <CreateTeacher /> : <Navigate to="/login" />} />
          <Route path="/admin/users" element={userRole === "admin" ? <ManageUsers /> : <Navigate to="/login" />} />
          <Route path="/admin/plans" element={userRole === "admin" ? <ManagePlans /> : <Navigate to="/login" />} />

          {/* Teacher (Instructor + Admin) */}
          <Route
            path="/teacher/dashboard"
            element={userRole === "instructor" || userRole === "admin" ? <TeacherDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/teacher/create-course"
            element={userRole === "instructor" || userRole === "admin" ? <CreateCourse /> : <Navigate to="/login" />}
          />
          <Route
            path="/teacher/courses/:id/edit"
            element={userRole === "instructor" || userRole === "admin" ? <EditCourse /> : <Navigate to="/login" />}
          />

          {/* Student/Logged-in */}
          <Route path="/my-courses" element={token ? <MyCourses /> : <Navigate to="/login" />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;
