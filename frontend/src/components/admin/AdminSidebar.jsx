import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar" style={{ width: '250px', background: '#2c3e50', color: 'white', height: '100vh', padding: '20px' }}>
      <h2 style={{ color: '#f39c12' }}>EzySkills Admin</h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
        <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>📊 Dashboard Home</Link>
        <Link to="/admin/users" style={{ color: 'white', textDecoration: 'none' }}>👥 Manage Users</Link>
        <Link to="/admin/plans" style={{ color: 'white', textDecoration: 'none' }}>💰 Pricing Plans</Link>
        <Link to="/admin/create-teacher" style={{ color: 'white', textDecoration: 'none' }}>👨‍🏫 Add Teacher</Link>
        <Link to="/" style={{ color: '#bdc3c7', textDecoration: 'none', marginTop: '20px' }}>← Back to Site</Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;