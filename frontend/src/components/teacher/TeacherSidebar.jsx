import React from 'react';
import { Link } from 'react-router-dom';

const TeacherSidebar = () => {
  return (
    <div style={{ width: '250px', background: '#2c3e50', color: 'white', minHeight: '100vh', padding: '20px' }}>
      <h2 style={{ color: '#f39c12', fontSize: '1.5rem', marginBottom: '30px' }}>EzySkills Admin</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ padding: '10px 0' }}><Link to="/teacher/dashboard" style={{ color: 'white', textDecoration: 'none' }}>📚 My Courses</Link></li>
        <li style={{ padding: '10px 0', marginTop: '40px' }}><Link to="/" style={{ color: '#bdc3c7', textDecoration: 'none' }}>← Back to Site</Link></li>
      </ul>
    </div>
  );
};

export default TeacherSidebar;