import React, { useEffect, useState } from 'react';
import TeacherSidebar from '../../components/teacher/TeacherSidebar';

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [instructorEdits, setInstructorEdits] = useState({}); // courseId -> instructor_id input
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole'); // "admin" | "instructor"

  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        setCourses(data.data);

        // preload current instructor_id into inputs (admin only)
        if (userRole === 'admin') {
          const map = {};
          data.data.forEach(c => { map[c.id] = c.instructor_id || ""; });
          setInstructorEdits(map);
        }
      } else {
        console.error("Failed:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (token) fetchCourses();
    // eslint-disable-next-line
  }, [token]);

  const updateInstructor = async (courseId) => {
    const newInstructorId = instructorEdits[courseId];

    if (!newInstructorId) {
      alert("Please enter instructor_id");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/courses/${courseId}/instructor`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ instructor_id: Number(newInstructorId) })
      });

      const data = await res.json();
      if (data.success) {
        alert("Instructor updated!");
        fetchCourses();
      } else {
        alert(data.message || "Failed to update instructor");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update instructor");
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      <TeacherSidebar />

      <div style={{ flex: 1, padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h2>Course Management</h2>

          <button
            onClick={() => window.location.href = "/teacher/create-course"}
            style={{
              background: '#27ae60',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            + Create Course
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {courses.length > 0 ? courses.map(course => (
            <div key={course.id} style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <img
                  src={course.logo_path || 'https://via.placeholder.com/60'}
                  alt="logo"
                  style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/60'; }}
                />
                <div>
                  <h4 style={{ margin: 0 }}>{course.title}</h4>
                  <p style={{ fontSize: '12px', color: '#7f8c8d', marginTop: 6 }}>
                    Status: <b>{course.status}</b>
                  </p>
                  <p style={{ fontSize: '12px', color: '#95a5a6', marginTop: 4 }}>
                    Instructor: {course.instructor_name || course.instructor_id || "—"}
                  </p>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: '#34495e', marginTop: '15px' }}>
                {course.description || "No description."}
              </p>

              {/* ✅ Admin-only: edit instructor_id by ID */}
              {userRole === "admin" && (
                <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                  <label style={{ fontSize: 12, color: "#7f8c8d" }}>
                    Change instructor_id (Admin only)
                  </label>
                  <div style={{ display: "flex", gap: 10 }}>
                    <input
                      type="number"
                      value={instructorEdits[course.id] ?? ""}
                      onChange={(e) =>
                        setInstructorEdits(prev => ({ ...prev, [course.id]: e.target.value }))
                      }
                      placeholder="Instructor ID"
                      style={{
                        flex: 1,
                        padding: 10,
                        borderRadius: 10,
                        border: "1px solid #dfe6e9"
                      }}
                    />
                    <button
                      onClick={() => updateInstructor(course.id)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "none",
                        background: "#8e44ad",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "bold"
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => window.location.href = `/teacher/courses/${course.id}/edit`}
                style={{
                  marginTop: 12,
                  width: '100%',
                  padding: '12px',
                  background: '#2980b9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Edit Course
              </button>
            </div>
          )) : (
            <p>No courses found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
