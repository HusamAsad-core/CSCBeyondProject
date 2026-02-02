import React, { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';

const CreateTeacher = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    image_path: '' // NEW (optional)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:5000/api/admin/create-teacher', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    if (data.success) alert("Teacher account created!");
    else alert(data.message);
  };

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '40px' }}>
        <h2>Add New Instructor</h2>

        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}
        >
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          {/* NEW optional field */}
          <input
            type="text"
            placeholder="Image Path (optional) e.g. /uploads/teachers/a.png"
            value={formData.image_path}
            onChange={(e) => setFormData({ ...formData, image_path: e.target.value })}
          />

          <button
            type="submit"
            style={{
              background: '#f39c12',
              color: 'white',
              padding: '10px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTeacher;
