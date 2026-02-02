import React, { useEffect, useMemo, useState } from 'react';
import './MyCourses.css';

const API_BASE = 'http://localhost:5000';

const resolveImgSrc = (logoPath) => {
  if (!logoPath) return null;
  if (logoPath.startsWith('http')) return logoPath;
  if (logoPath.startsWith('/')) return logoPath;
  return `/${logoPath}`;
};

const MyCourses = () => {
  const token = localStorage.getItem('token');
  const [enrollments, setEnrollments] = useState([]); // [{course_id, status}]
  const [courses, setCourses] = useState([]);         // all public courses
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    const res = await fetch(`${API_BASE}/api/users/my-enrollments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return await res.json();
  };

  const fetchCourses = async () => {
    const res = await fetch(`${API_BASE}/api/courses/public`);
    return await res.json();
  };

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const [enr, all] = await Promise.all([fetchEnrollments(), fetchCourses()]);
        if (enr.success) setEnrollments(enr.data || []);
        if (all.success) setCourses(all.data || []);
      } catch (e) {
        console.error('MyCourses error:', e);
      } finally {
        setLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myCourseList = useMemo(() => {
    const ids = new Set(enrollments.map(e => Number(e.course_id)));
    return courses.filter(c => ids.has(Number(c.id)));
  }, [enrollments, courses]);

  // ✅ NEW: Live Demo handler (we’ll link it properly later)
  const openLiveDemo = (courseId) => {
    // For now, just go to a placeholder route you can build later:
    // Example: /course-demo/26
    window.location.href = `/course-demo/${courseId}`;
  };

  return (
    <div className="my-courses-page">
      <div className="my-courses-header">
        <h2>My Courses</h2>
        <p>These are the courses you enrolled in.</p>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : myCourseList.length === 0 ? (
        <p className="empty">You have not enrolled in any course yet.</p>
      ) : (
        <div className="grid">
          {myCourseList.map(course => {
            const imgSrc = resolveImgSrc(course.logo_path);

            return (
              <div className="card" key={course.id}>
                <div className="top">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={course.title}
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/180'; }}
                    />
                  ) : (
                    <div className="placeholder" />
                  )}
                </div>

                <div className="body">
  <h3>{course.title}</h3>
  <p>{course.description || 'No description.'}</p>
  <span className="badge">Enrolled</span>

  <div className="actions">
    <button className="demo-btn">Live Demo</button>
  </div>
</div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
