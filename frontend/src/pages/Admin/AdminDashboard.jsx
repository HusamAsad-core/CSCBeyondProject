import AdminSidebar from '../../components/admin/AdminSidebar';
import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  // FIXED: Hooks must be inside the function component
  const [stats, setStats] = useState({ totalUsers: 0, totalTeachers: 0, totalPlans: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  const cardStyle = {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  };

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '40px', backgroundColor: '#f4f7f6' }}>
        <header style={{ marginBottom: '30px' }}>
          <h1>Welcome, Admin</h1>
          <p>Manage your platform's users, instructors, and subscription plans here.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div className="stat-card" style={cardStyle}>
            <h3>Total Users</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalUsers}</p>
          </div>
          <div className="stat-card" style={cardStyle}>
            <h3>Active Teachers</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalTeachers}</p>
          </div>
          <div className="stat-card" style={cardStyle}>
            <h3>Active Plans</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalPlans}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;