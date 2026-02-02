import React, { useState, useEffect } from 'react';
import './CreateCourse.css';

const CreateCourse = () => {
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    about_text: '',
    logo_path: '',
    status: 'active',
    objectives: '',         // keep your old field (optional)
    category_id: '',
    curriculum: [],         // keep old field (optional)

    // NEW JSON fields for CourseDetails page
    objectives_json: [],    // ["obj1","obj2"]
    content_json: [],       // [{title,description}] or ["x"]
    projects_json: [],      // [{title,description}] or ["x"]
    tools_json: [],         // ["React","Node"]
    demo_url: '',
    curriculum_url: ''
  });

  // helpers
  const [objInput, setObjInput] = useState('');
  const [toolInput, setToolInput] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [contentDesc, setContentDesc] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
          if (data.data.length > 0 && !formData.category_id) {
            setFormData(prev => ({ ...prev, category_id: data.data[0].id }));
          }
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      return payload.id;
    } catch (e) { return null; }
  };

  const addObjective = () => {
    const val = objInput.trim();
    if (!val) return;
    setFormData(prev => ({
      ...prev,
      objectives_json: [...(prev.objectives_json || []), val]
    }));
    setObjInput('');
  };

  const removeObjective = (idx) => {
    setFormData(prev => ({
      ...prev,
      objectives_json: prev.objectives_json.filter((_, i) => i !== idx)
    }));
  };

  const addTool = () => {
    const val = toolInput.trim();
    if (!val) return;
    setFormData(prev => ({
      ...prev,
      tools_json: [...(prev.tools_json || []), val]
    }));
    setToolInput('');
  };

  const removeTool = (idx) => {
    setFormData(prev => ({
      ...prev,
      tools_json: prev.tools_json.filter((_, i) => i !== idx)
    }));
  };

  const addContentItem = () => {
    const t = contentTitle.trim();
    const d = contentDesc.trim();
    if (!t) return;

    setFormData(prev => ({
      ...prev,
      content_json: [...(prev.content_json || []), { title: t, description: d }]
    }));
    setContentTitle('');
    setContentDesc('');
  };

  const removeContentItem = (idx) => {
    setFormData(prev => ({
      ...prev,
      content_json: prev.content_json.filter((_, i) => i !== idx)
    }));
  };

  const addProject = () => {
    const t = projectTitle.trim();
    const d = projectDesc.trim();
    if (!t) return;

    setFormData(prev => ({
      ...prev,
      projects_json: [...(prev.projects_json || []), { title: t, description: d }]
    }));
    setProjectTitle('');
    setProjectDesc('');
  };

  const removeProject = (idx) => {
    setFormData(prev => ({
      ...prev,
      projects_json: prev.projects_json.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const instructorId = getUserIdFromToken();

    const finalData = {
      ...formData,
      instructor_id: instructorId
    };

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
      } else {
        alert(data.message || data.error || "Failed to create course");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to create course");
    }
  };

  return (
    <div className="create-course-page">
      <div className="create-course-card">
        <h2 className="create-course-title">Create Course</h2>

        <form onSubmit={handleSubmit} className="course-form">
          {/* Basic fields */}
          <div className="input-group">
            <label>Course Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Category</label>
              <select
                className="course-select"
                value={formData.category_id}
                onChange={e => setFormData({ ...formData, category_id: e.target.value })}
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
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="popular">Popular</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Thumbnail Path</label>
            <input
              type="text"
              value={formData.logo_path}
              onChange={e => setFormData({ ...formData, logo_path: e.target.value })}
            />
          </div>

          <div className="input-group">
            <label>Short Description (cards)</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Course Page fields */}
          <hr style={{ margin: "18px 0", opacity: 0.25 }} />

          <div className="input-group">
            <label>About the Course (Course Page)</label>
            <textarea
              value={formData.about_text}
              onChange={e => setFormData({ ...formData, about_text: e.target.value })}
              placeholder="Write the long About section shown in CourseDetails page..."
              style={{ minHeight: 110 }}
            />
          </div>

          <div className="input-group">
            <label>Demo URL</label>
            <input
              type="text"
              value={formData.demo_url}
              onChange={e => setFormData({ ...formData, demo_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="input-group">
            <label>Curriculum Download URL</label>
            <input
              type="text"
              value={formData.curriculum_url}
              onChange={e => setFormData({ ...formData, curriculum_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          {/* Objectives builder */}
          <div className="input-group">
            <label>Objectives (list)</label>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                type="text"
                value={objInput}
                onChange={(e) => setObjInput(e.target.value)}
                placeholder="Add one objective and click Add"
              />
              <button type="button" onClick={addObjective} style={{ padding: "10px 14px", cursor: "pointer" }}>
                Add
              </button>
            </div>

            {formData.objectives_json?.length > 0 && (
              <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {formData.objectives_json.map((o, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: "#f1f5f9",
                      border: "1px solid #e5e7eb",
                      padding: "6px 10px",
                      borderRadius: 999,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8
                    }}
                  >
                    {o}
                    <button type="button" onClick={() => removeObjective(idx)} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Course Content builder */}
          <div className="input-group">
            <label>Course Content (list)</label>

            <input
              type="text"
              value={contentTitle}
              onChange={(e) => setContentTitle(e.target.value)}
              placeholder="Content title (e.g. 01 Introduction)"
              style={{ marginBottom: 8 }}
            />
            <textarea
              value={contentDesc}
              onChange={(e) => setContentDesc(e.target.value)}
              placeholder="Optional description"
              style={{ minHeight: 70, marginBottom: 10 }}
            />

            <button type="button" onClick={addContentItem} style={{ padding: "10px 14px", cursor: "pointer" }}>
              Add Content Item
            </button>

            {formData.content_json?.length > 0 && (
              <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                {formData.content_json.map((c, idx) => (
                  <div key={idx} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#fff" }}>
                    <div style={{ fontWeight: 800 }}>{c.title}</div>
                    {c.description && <div style={{ marginTop: 4, color: "#6b7280", fontSize: 13 }}>{c.description}</div>}
                    <button type="button" onClick={() => removeContentItem(idx)} style={{ marginTop: 8, cursor: "pointer" }}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Projects builder */}
          <div className="input-group">
            <label>Projects (list)</label>

            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Project title"
              style={{ marginBottom: 8 }}
            />
            <textarea
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              placeholder="Optional description"
              style={{ minHeight: 70, marginBottom: 10 }}
            />

            <button type="button" onClick={addProject} style={{ padding: "10px 14px", cursor: "pointer" }}>
              Add Project
            </button>

            {formData.projects_json?.length > 0 && (
              <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                {formData.projects_json.map((p, idx) => (
                  <div key={idx} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#fff" }}>
                    <div style={{ fontWeight: 800 }}>{p.title}</div>
                    {p.description && <div style={{ marginTop: 4, color: "#6b7280", fontSize: 13 }}>{p.description}</div>}
                    <button type="button" onClick={() => removeProject(idx)} style={{ marginTop: 8, cursor: "pointer" }}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tools builder */}
          <div className="input-group">
            <label>Tools & Platforms (list)</label>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                type="text"
                value={toolInput}
                onChange={(e) => setToolInput(e.target.value)}
                placeholder="Add tool (React, Angular, Node...)"
              />
              <button type="button" onClick={addTool} style={{ padding: "10px 14px", cursor: "pointer" }}>
                Add
              </button>
            </div>

            {formData.tools_json?.length > 0 && (
              <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {formData.tools_json.map((t, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: "#f1f5f9",
                      border: "1px solid #e5e7eb",
                      padding: "6px 10px",
                      borderRadius: 999,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8
                    }}
                  >
                    {t}
                    <button type="button" onClick={() => removeTool(idx)} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn-submit-course">Publish Course</button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
