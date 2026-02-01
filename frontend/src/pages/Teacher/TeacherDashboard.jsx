import React, { useEffect, useState } from 'react';
import TeacherSidebar from '../../components/teacher/TeacherSidebar';

import { useLocation } from 'react-router-dom';
const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem('token');
  const location = useLocation(); 

  // Helper to extract instructor_id
  const getInstructorId = () => {
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64)).id; 
    } catch (e) {
      return null;
    }
  };

  // FIX: Function moved INSIDE useEffect to remove dependency warning
  useEffect(() => {
    const fetchTeacherCourses = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/courses', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          const myId = getInstructorId();
          // Filter: show only courses for this instructor
          const myCourses = data.data.filter(c => c.instructor_id === myId || !c.instructor_id);
          setCourses(myCourses);
        }
      } catch (err) { console.error("Fetch error:", err); }
    };

    if (token) {
      fetchTeacherCourses();
    }
  }, [token]); // Now only 'token' is a dependency, which is correct

  // Check if we need to auto-open create mode (optional logic based on your previous code)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'add') {
      // Logic to redirect or open modal if you still use it
    }
  }, [location]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      <TeacherSidebar />
      <div style={{ flex: 1, padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h2>Teacher Dashboard</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {courses.length > 0 ? courses.map(course => (
            <div key={course.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <img src={course.logo_path || 'https://via.placeholder.com/50'} alt="logo" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ margin: 0 }}>{course.title}</h4>
                  <p style={{ fontSize: '12px', color: '#95a5a6' }}>Status: {course.status}</p>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#34495e', marginTop: '15px' }}>{course.description}</p>
            </div>
          )) : (
            <p>No courses found. Create one!</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Styles
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #dfe6e9' };
const addBtnStyle = { background: '#2980b9', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const saveBtnStyle = { background: '#27ae60', color: 'white', padding: '15px', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '20px', width: '100%', fontWeight: 'bold' };
const formCardStyle = { background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '40px' };
const courseCardStyle = { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };

export default TeacherDashboard;