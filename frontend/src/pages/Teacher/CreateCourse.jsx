import React, { useState, useEffect } from 'react';
import './CreateCourse.css';

const CreateCourse = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    logo_path: '',
    status: 'active', 
    objectives: '',
    category_id: '', 
    curriculum: []
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
          // Set initial category so it's not empty
          if (data.data.length > 0 && !formData.category_id) {
            setFormData(prev => ({ ...prev, category_id: data.data[0].id }));
          }
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      return payload.id;
    } catch (e) { return null; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const instructorId = getUserIdFromToken();

    const finalData = {
      ...formData,
      instructor_id: instructorId
    };

    // DEBUG: Look at your browser console when you click submit!
    console.log("SENDING TO BACKEND:", finalData);

    try {
      const response = await fetch('http://localhost:5000/api/courses/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalData)
      });
      const data = await response.json();
      if (data.success) {
        alert(`Course Published! Status: ${formData.status}`);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="create-course-page">
      <div className="create-course-card">
        <h2 className="create-course-title">Create Course</h2>
        <form onSubmit={handleSubmit} className="course-form">
          <div className="input-group">
            <label>Course Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Category</label>
              <select 
                className="course-select"
                value={formData.category_id}
                onChange={e => setFormData({...formData, category_id: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Course Status</label>
              <select 
                className="course-select"
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="popular">Popular</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Thumbnail Path</label>
            <input type="text" value={formData.logo_path} onChange={e => setFormData({...formData, logo_path: e.target.value})} />
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <button type="submit" className="btn-submit-course">Publish Course</button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;