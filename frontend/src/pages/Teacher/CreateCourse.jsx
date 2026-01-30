import React, { useState } from 'react';

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    logo_path: '',
    status: 'active',
    objectives: '',
    curriculum: '' // You can store this as a string or JSON
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving Course:", formData);
    // Add your fetch logic here
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px' }}>
      <h2>Create New Course</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="Course Title" onChange={e => setFormData({...formData, title: e.target.value})} required />
        <input type="text" placeholder="Logo Path (URL)" onChange={e => setFormData({...formData, logo_path: e.target.value})} />
        <textarea placeholder="Description" onChange={e => setFormData({...formData, description: e.target.value})} />
        <textarea placeholder="Learning Objectives" onChange={e => setFormData({...formData, objectives: e.target.value})} />
        <select onChange={e => setFormData({...formData, status: e.target.value})}>
          <option value="active">Active</option>
          <option value="coming_soon">Coming Soon</option>
        </select>
        <button type="submit" style={{ background: '#f39c12', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>
          Create Course
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;