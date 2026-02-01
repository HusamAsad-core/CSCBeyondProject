import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateCourse from './pages/Teacher/CreateCourse';


// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import CreateTeacher from './pages/Admin/CreateTeacher';
import ManageUsers from './pages/Admin/ManageUsers';
import ManagePlans from './pages/Admin/ManagePlans';
import TeacherDashboard from './pages/Teacher/TeacherDashboard';

function App() {
  const userRole = localStorage.getItem('userRole');

  return (
    <Router>
      <Header /> {/* Changed from Navbar to Header to match your file name */}
      
      <main className="content-area">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin" element={userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin/create-teacher" element={userRole === 'admin' ? <CreateTeacher /> : <Navigate to="/login" />} />
          <Route path="/admin/users" element={userRole === 'admin' ? <ManageUsers /> : <Navigate to="/login" />} />
          <Route path="/admin/plans" element={userRole === 'admin' ? <ManagePlans /> : <Navigate to="/login" />} />

          {/* Teacher Routes - Accessible by Teacher AND Admin */}
          <Route 
            path="/teacher/dashboard" 
            element={(userRole === 'teacher' || userRole === 'admin') ? <TeacherDashboard /> : <Navigate to="/login" />} 
          />
          <Route path="/teacher/create-course" 
            element={userRole === 'instructor' || userRole === 'admin' ? <CreateCourse /> : <Navigate to="/login" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer /> 
    </Router>
  );
}
export default App;