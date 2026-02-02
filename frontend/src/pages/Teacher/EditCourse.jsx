import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TeacherSidebar from "../../components/teacher/TeacherSidebar";

const API_BASE = "http://localhost:5000";

const safeParse = (val, fallback) => {
  if (val === null || val === undefined) return fallback;
  if (Array.isArray(val) || typeof val === "object") return val;
  try {
    const parsed = JSON.parse(val);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    about_text: "",
    logo_path: "",
    status: "active",
    objectives: "",
    category_id: "",
    curriculum: [],

    // NEW
    objectives_json: [],
    content_json: [],
    projects_json: [],
    tools_json: [],
    demo_url: "",
    curriculum_url: ""
  });

  // UI helpers
  const [objInput, setObjInput] = useState("");
  const [toolInput, setToolInput] = useState("");
  const [contentTitle, setContentTitle] = useState("");
  const [contentDesc, setContentDesc] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.success) {
          const c = data.data;
          setFormData({
            title: c.title || "",
            description: c.description || "",
            about_text: c.about_text || "",
            logo_path: c.logo_path || "",
            status: c.status || "active",
            objectives: c.objectives || "",
            category_id: c.category_id || "",
            curriculum: safeParse(c.curriculum, []),

            objectives_json: safeParse(c.objectives_json, []),
            content_json: safeParse(c.content_json, []),
            projects_json: safeParse(c.projects_json, []),
            tools_json: safeParse(c.tools_json, []),
            demo_url: c.demo_url || "",
            curriculum_url: c.curriculum_url || ""
          });
        } else {
          alert(data.message || "Failed to load course");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load course");
      }
    };

    if (token) load();
  }, [id, token]);

  const addObjective = () => {
    const val = objInput.trim();
    if (!val) return;
    setFormData(prev => ({ ...prev, objectives_json: [...prev.objectives_json, val] }));
    setObjInput("");
  };

  const removeObjective = (idx) => {
    setFormData(prev => ({ ...prev, objectives_json: prev.objectives_json.filter((_, i) => i !== idx) }));
  };

  const addTool = () => {
    const val = toolInput.trim();
    if (!val) return;
    setFormData(prev => ({ ...prev, tools_json: [...prev.tools_json, val] }));
    setToolInput("");
  };

  const removeTool = (idx) => {
    setFormData(prev => ({ ...prev, tools_json: prev.tools_json.filter((_, i) => i !== idx) }));
  };

  const addContentItem = () => {
    const t = contentTitle.trim();
    const d = contentDesc.trim();
    if (!t) return;

    setFormData(prev => ({
      ...prev,
      content_json: [...prev.content_json, { title: t, description: d }]
    }));
    setContentTitle("");
    setContentDesc("");
  };

  const removeContentItem = (idx) => {
    setFormData(prev => ({ ...prev, content_json: prev.content_json.filter((_, i) => i !== idx) }));
  };

  const addProject = () => {
    const t = projectTitle.trim();
    const d = projectDesc.trim();
    if (!t) return;

    setFormData(prev => ({
      ...prev,
      projects_json: [...prev.projects_json, { title: t, description: d }]
    }));
    setProjectTitle("");
    setProjectDesc("");
  };

  const removeProject = (idx) => {
    setFormData(prev => ({ ...prev, projects_json: prev.projects_json.filter((_, i) => i !== idx) }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        alert("Course updated!");
        navigate("/teacher/dashboard");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/courses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        alert("Course deleted!");
        navigate("/teacher/dashboard");
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fa" }}>
      <TeacherSidebar />

      <div style={{ flex: 1, padding: 40 }}>
        <h2 style={{ marginBottom: 16 }}>Edit Course</h2>

        <form
          onSubmit={handleUpdate}
          style={{
            display: "grid",
            gap: 14,
            maxWidth: 820,
            background: "white",
            padding: 25,
            borderRadius: 12,
            border: "1px solid #eee"
          }}
        >
          {/* Basic */}
          <div>
            <label style={{ fontWeight: "bold" }}>Title</label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd", marginTop: 6 }}
              required
            />
          </div>

          <div>
            <label style={{ fontWeight: "bold" }}>Short Description (cards)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd", marginTop: 6, minHeight: 80 }}
            />
          </div>

          <div>
            <label style={{ fontWeight: "bold" }}>About the Course (Course Page)</label>
            <textarea
              value={formData.about_text}
              onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
              style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd", marginTop: 6, minHeight: 120 }}
            />
          </div>

          <div>
            <label style={{ fontWeight: "bold" }}>Thumbnail Path</label>
            <input
              value={formData.logo_path}
              onChange={(e) => setFormData({ ...formData, logo_path: e.target.value })}
              style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd", marginTop: 6 }}
            />
          </div>

          <div>
            <label style={{ fontWeight: "bold" }}>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd", marginTop: 6 }}
            >
              <option value="active">Active</option>
              <option value="coming_soon">Coming Soon</option>
              <option value="popular">Popular</option>
            </select>
          </div>

          {/* URLs */}
          <div>
            <label style={{ fontWeight: "bold" }}>Demo URL</label>
            <input
              value={formData.demo_url}
              onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
              style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd", marginTop: 6 }}
              placeholder="https://..."
            />
          </div>

          <div>
            <label style={{ fontWeight: "bold" }}>Curriculum Download URL</label>
            <input
              value={formData.curriculum_url}
              onChange={(e) => setFormData({ ...formData, curriculum_url: e.target.value })}
              style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd", marginTop: 6 }}
              placeholder="https://..."
            />
          </div>

          {/* Objectives */}
          <div style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
            <label style={{ fontWeight: "bold" }}>Objectives (list)</label>

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <input
                value={objInput}
                onChange={(e) => setObjInput(e.target.value)}
                style={{ flex: 1, padding: 12, borderRadius: 8, border: "1px solid #ddd" }}
                placeholder="Add one objective"
              />
              <button type="button" onClick={addObjective} style={{ padding: 12, borderRadius: 8, cursor: "pointer" }}>
                Add
              </button>
            </div>

            {formData.objectives_json.length > 0 && (
              <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {formData.objectives_json.map((o, idx) => (
                  <span key={idx} style={{ background: "#f1f5f9", border: "1px solid #e5e7eb", padding: "6px 10px", borderRadius: 999 }}>
                    {o}{" "}
                    <button type="button" onClick={() => removeObjective(idx)} style={{ marginLeft: 6, cursor: "pointer" }}>
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
            <label style={{ fontWeight: "bold" }}>Course Content</label>

            <input
              value={contentTitle}
              onChange={(e) => setContentTitle(e.target.value)}
              style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd", marginTop: 8 }}
              placeholder="Title (e.g. 01 Introduction)"
            />
            <textarea
              value={contentDesc}
              onChange={(e) => setContentDesc(e.target.value)}
              style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd", marginTop: 8, minHeight: 80 }}
              placeholder="Optional description"
            />
            <button type="button" onClick={addContentItem} style={{ marginTop: 8, padding: 12, borderRadius: 8, cursor: "pointer" }}>
              Add Content Item
            </button>

            {formData.content_json.length > 0 && (
              <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                {formData.content_json.map((c, idx) => (
                  <div key={idx} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
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

          {/* Projects */}
          <div style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
            <label style={{ fontWeight: "bold" }}>Projects</label>

            <input
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd", marginTop: 8 }}
              placeholder="Project title"
            />
            <textarea
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd", marginTop: 8, minHeight: 80 }}
              placeholder="Optional description"
            />
            <button type="button" onClick={addProject} style={{ marginTop: 8, padding: 12, borderRadius: 8, cursor: "pointer" }}>
              Add Project
            </button>

            {formData.projects_json.length > 0 && (
              <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                {formData.projects_json.map((p, idx) => (
                  <div key={idx} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
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

          {/* Tools */}
          <div style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
            <label style={{ fontWeight: "bold" }}>Tools & Platforms</label>

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <input
                value={toolInput}
                onChange={(e) => setToolInput(e.target.value)}
                style={{ flex: 1, padding: 12, borderRadius: 8, border: "1px solid #ddd" }}
                placeholder="React, Angular, Node..."
              />
              <button type="button" onClick={addTool} style={{ padding: 12, borderRadius: 8, cursor: "pointer" }}>
                Add
              </button>
            </div>

            {formData.tools_json.length > 0 && (
              <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {formData.tools_json.map((t, idx) => (
                  <span key={idx} style={{ background: "#f1f5f9", border: "1px solid #e5e7eb", padding: "6px 10px", borderRadius: 999 }}>
                    {t}{" "}
                    <button type="button" onClick={() => removeTool(idx)} style={{ marginLeft: 6, cursor: "pointer" }}>
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <button
            type="submit"
            style={{
              padding: 14,
              cursor: "pointer",
              background: "#2980b9",
              color: "white",
              border: "none",
              borderRadius: 10,
              fontWeight: "bold"
            }}
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={handleDelete}
            style={{
              padding: 14,
              cursor: "pointer",
              background: "crimson",
              color: "white",
              border: "none",
              borderRadius: 10,
              fontWeight: "bold"
            }}
          >
            Delete Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
