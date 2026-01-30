import { useLocation } from 'react-router-dom'; // FIX 1: Add this missing import
import TeacherSidebar from '../../components/teacher/TeacherSidebar';
import React, { useEffect, useState, useCallback } from 'react'; // Add useCallback

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const location = useLocation(); // Add this

  // Check if we came from the "+ Create Course" button in the header
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'add') {
      setIsAdding(true);
    }
  }, [location]);
  
  // State matches your CourseController req.body
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    objectives: '',
    category_id: 1, // Default category
    logo_path: '',
    curriculum: [''] // Starts with one empty lesson
  });

  const token = localStorage.getItem('token');

  // Helper to extract instructor_id from token (JWT)
  const getInstructorId = () => {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64)).id; 
  };

  const fetchTeacherCourses = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const myId = getInstructorId();
        const myCourses = data.data.filter(c => c.instructor_id === myId || !c.instructor_id);
        setCourses(myCourses);
      }
    } catch (err) { console.error("Fetch error:", err); }
  }, [token]);

  useEffect(() => { 
    fetchTeacherCourses(); 
  }, [fetchTeacherCourses]);

  // Handle adding/removing curriculum lessons
  const handleLessonChange = (index, value) => {
    const updated = [...newCourse.curriculum];
    updated[index] = value;
    setNewCourse({ ...newCourse, curriculum: updated });
  };

  const addLessonField = () => setNewCourse({ ...newCourse, curriculum: [...newCourse.curriculum, ''] });

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    
    const courseData = {
      ...newCourse,
      instructor_id: getInstructorId(),
      // Ensure curriculum is an array of strings (the controller handles JSON.stringify)
      curriculum: newCourse.curriculum.filter(lesson => lesson.trim() !== "")
    };

    try {
      const res = await fetch('http://localhost:5000/api/courses/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(courseData)
      });

      const data = await res.json();
      if (data.success) {
        alert("Course content saved successfully!");
        setIsAdding(false);
        setNewCourse({ title: '', description: '', objectives: '', category_id: 1, logo_path: '', curriculum: [''] });
        fetchTeacherCourses();
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      alert("System error: Could not connect to server.");
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      <TeacherSidebar />
      <div style={{ flex: 1, padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h2>Teacher Dashboard</h2>
          <button onClick={() => setIsAdding(!isAdding)} style={addBtnStyle}>
            {isAdding ? 'Cancel' : '+ Create Course'}
          </button>
        </div>

        {isAdding && (
          <div style={formCardStyle}>
            <h3>Course Content</h3>
            <form onSubmit={handleCreateCourse}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <input style={inputStyle} type="text" placeholder="Course Title" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} required />
                  <input style={inputStyle} type="text" placeholder="Logo/Thumbnail URL" value={newCourse.logo_path} onChange={e => setNewCourse({...newCourse, logo_path: e.target.value})} />
                  <textarea style={{...inputStyle, height: '100px'}} placeholder="Description" value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} required />
                  <textarea style={{...inputStyle, height: '80px'}} placeholder="Learning Objectives (What will students learn?)" value={newCourse.objectives} onChange={e => setNewCourse({...newCourse, objectives: e.target.value})} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label>Curriculum (Lessons)</label>
                  {newCourse.curriculum.map((lesson, idx) => (
                    <input key={idx} style={inputStyle} type="text" placeholder={`Lesson ${idx + 1}`} value={lesson} onChange={e => handleLessonChange(idx, e.target.value)} required />
                  ))}
                  <button type="button" onClick={addLessonField} style={{ background: '#ecf0f1', border: '1px dashed #bdc3c7', padding: '10px', cursor: 'pointer' }}>+ Add Lesson</button>
                </div>
              </div>
              <button type="submit" style={saveBtnStyle}>Publish Course Content</button>
            </form>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {courses.map(course => (
            <div key={course.id} style={courseCardStyle}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <img src={course.logo_path || 'https://via.placeholder.com/50'} alt="logo" style={{ width: '50px', height: '50px', borderRadius: '8px' }} />
                <div>
                  <h4 style={{ margin: 0 }}>{course.title}</h4>
                  <p style={{ fontSize: '12px', color: '#95a5a6' }}>By {course.instructor_name || 'Me'}</p>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#34495e', marginTop: '15px' }}>{course.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Styles
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #dfe6e9' };
const addBtnStyle = { background: '#2980b9', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const saveBtnStyle = { background: '#27ae60', color: 'white', padding: '15px', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '20px', width: '100%', fontWeight: 'bold' };
const formCardStyle = { background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '40px' };
const courseCardStyle = { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };

export default TeacherDashboard;