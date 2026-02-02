// src/pages/Courses/CoursesList.jsx
import React, { useEffect, useMemo, useState } from 'react';
import './CoursesList.css';
import { useNavigate } from "react-router-dom";

const API_BASE = 'http://localhost:5000';

const normalizeStatusLabel = (status) => {
  if (status === 'coming_soon') return 'Coming Soon';
  if (status === 'popular') return 'Opened';
  return 'Opened'; // active => Opened
};

const resolveImgSrc = (logoPath) => {
  if (!logoPath) return null;
  if (logoPath.startsWith('http')) return logoPath;
  if (logoPath.startsWith('/')) return logoPath;       // e.g. /uploads/x.png
  return `/${logoPath}`;                               // fallback
};

const CoursesList = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('opened'); // opened | coming_soon | all
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Set of enrolled course IDs (numbers)
  const [enrolledIds, setEnrolledIds] = useState(new Set());

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // ✅ This endpoint MUST return all courses (active + coming_soon + popular)
      const res = await fetch(`${API_BASE}/api/courses/public`);
      const data = await res.json();
      if (data.success) {
        setCourses(Array.isArray(data.data) ? data.data : []);
      }
    } catch (e) {
      console.error('Fetch courses error:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEnrollments = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/users/my-enrollments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const ids = new Set(data.data.map(r => Number(r.course_id)));
        setEnrolledIds(ids);
      }
    } catch (e) {
      console.error('Fetch enrollments error:', e);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchMyEnrollments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCourses = useMemo(() => {
    if (activeTab === 'all') return courses;

    if (activeTab === 'coming_soon') {
      return courses.filter(c => c.status === 'coming_soon');
    }

    // opened tab
    return courses.filter(c => c.status === 'active' || c.status === 'popular');
  }, [courses, activeTab]);

  const handleEnroll = async (courseId, courseStatus) => {
    if (!token) {
      alert('Please login first.');
      return;
    }

    if (courseStatus === 'coming_soon') return;

    try {
      const res = await fetch(`${API_BASE}/api/users/select-course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ course_id: courseId })
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Enroll failed');
        return;
      }

      // ✅ update UI immediately
      setEnrolledIds(prev => {
        const next = new Set(prev);
        next.add(Number(courseId));
        return next;
      });

    } catch (e) {
      console.error('Enroll error:', e);
      alert('Enroll error');
    }
  };

  const handleLiveDemo = (course) => {
    // always clickable
    alert(`Live Demo clicked for: ${course.title}\n(you said you'll handle this later)`);
  };

  const goToCourseDetails = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="courses-list-page">
      <div className="courses-list-header">
        <h1 className="courses-title">
          Courses <span>List</span>
        </h1>

        <div className="courses-tabs">
          <button
            className={activeTab === 'all' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>

          <button
            className={activeTab === 'opened' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('opened')}
          >
            Opened
          </button>

          <button
            className={activeTab === 'coming_soon' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('coming_soon')}
          >
            Coming Soon
          </button>
        </div>
      </div>

      {loading ? (
        <p className="loading">Loading courses...</p>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map(course => {
            const imgSrc = resolveImgSrc(course.logo_path);
            const isComingSoon = course.status === 'coming_soon';
            const isEnrolled = enrolledIds.has(Number(course.id));

            return (
              <div
                key={course.id}
                className="figma-card"
                onClick={() => goToCourseDetails(course.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="figma-card-top">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={course.title}
                      className="figma-card-img"
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/180'; }}
                    />
                  ) : (
                    <div className="figma-card-img placeholder" />
                  )}
                </div>

                <div className="figma-card-body">
                  <h3 className="figma-card-title">{course.title}</h3>

                  <p className="figma-card-desc">
                    {course.description || 'No description.'}
                  </p>

                  <div className="figma-status">
                    {normalizeStatusLabel(course.status)}
                  </div>

                  <div className="figma-actions">
                    <button
                      className="btn-live"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLiveDemo(course);
                      }}
                    >
                      Live Demo
                    </button>

                    <button
                      className={`btn-enroll ${isComingSoon ? 'disabled' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnroll(course.id, course.status);
                      }}
                      disabled={isComingSoon || isEnrolled}
                      title={isComingSoon ? 'Coming soon' : ''}
                    >
                      {isEnrolled ? 'Enrolled' : 'Enroll Now'}
                    </button>
                  </div>

                  <button
                    className="btn-download"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Download Curriculum (you can wire this later)');
                    }}
                  >
                    Download Curriculum
                  </button>

                  {/* Optional small footer info */}
                  {(userRole === 'admin' || userRole === 'instructor') && (
                    <div className="figma-meta">
                      <span>Instructor: {course.instructor_name || '—'}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CoursesList;
