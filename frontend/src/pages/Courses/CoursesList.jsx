import React, { useEffect, useMemo, useState } from "react";
import "./CoursesList.css";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_BASE = "http://localhost:5000";

const normalizeStatusLabel = (status) => {
  if (status === "coming_soon") return "Coming Soon";
  if (status === "popular") return "Opened";
  return "Opened";
};

const resolveImgSrc = (logoPath) => {
  if (!logoPath) return null;
  if (logoPath.startsWith("http")) return logoPath;
  if (logoPath.startsWith("/")) return logoPath;
  return `/${logoPath}`;
};

const CoursesList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("opened"); // opened | coming_soon | all
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  const [enrolledIds, setEnrolledIds] = useState(new Set());

  // Search state (from URL)
  const urlSearch = (searchParams.get("search") || "").trim();
  const [searchText, setSearchText] = useState(urlSearch);

  useEffect(() => {
    setSearchText(urlSearch);
  }, [urlSearch]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/courses/public`);
      const data = await res.json();
      if (data.success) {
        setCourses(Array.isArray(data.data) ? data.data : []);
      }
    } catch (e) {
      console.error("Fetch courses error:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEnrollments = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/users/my-enrollments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const ids = new Set(data.data.map((r) => Number(r.course_id)));
        setEnrolledIds(ids);
      }
    } catch (e) {
      console.error("Fetch enrollments error:", e);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchMyEnrollments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter by tab + search text
  const filteredCourses = useMemo(() => {
    let list = courses;

    // tab filter
    if (activeTab === "coming_soon") {
      list = list.filter((c) => c.status === "coming_soon");
    } else if (activeTab === "opened") {
      list = list.filter((c) => c.status === "active" || c.status === "popular");
    }

    // search filter
    const q = (urlSearch || "").toLowerCase();
    if (q) {
      list = list.filter((c) => {
        const t = String(c.title || "").toLowerCase();
        const d = String(c.description || "").toLowerCase();
        const cat = String(c.category_name || "").toLowerCase();
        return t.includes(q) || d.includes(q) || cat.includes(q);
      });
    }

    return list;
  }, [courses, activeTab, urlSearch]);

  const handleEnroll = async (courseId, courseStatus) => {
    if (!token) {
      alert("Please login first.");
      return;
    }
    if (courseStatus === "coming_soon") return;

    try {
      const res = await fetch(`${API_BASE}/api/users/select-course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course_id: courseId }),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || "Enroll failed");
        return;
      }

      setEnrolledIds((prev) => {
        const next = new Set(prev);
        next.add(Number(courseId));
        return next;
      });
    } catch (e) {
      console.error("Enroll error:", e);
      alert("Enroll error");
    }
  };

  const goDetails = (id) => {
    navigate(`/courses/${id}`);
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const q = (searchText || "").trim();
    if (!q) {
      setSearchParams({});
      return;
    }
    setSearchParams({ search: q });
  };

  return (
    <div className="courses-list-page">
      <div className="courses-list-header">
        <h1 className="courses-title">
          Courses <span>List</span>
        </h1>

        {/* Search bar (returned) */}
        <form className="courses-searchbar" onSubmit={onSearchSubmit}>
          <input
            className="courses-search-input"
            placeholder="Search course"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button className="courses-search-btn" type="submit">
            Search
          </button>
        </form>

        <div className="courses-tabs">
          <button className={activeTab === "all" ? "tab active" : "tab"} onClick={() => setActiveTab("all")}>
            All
          </button>

          <button className={activeTab === "opened" ? "tab active" : "tab"} onClick={() => setActiveTab("opened")}>
            Opened
          </button>

          <button
            className={activeTab === "coming_soon" ? "tab active" : "tab"}
            onClick={() => setActiveTab("coming_soon")}
          >
            Coming Soon
          </button>
        </div>
      </div>

      {loading ? (
        <p className="loading">Loading courses...</p>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map((course) => {
            const imgSrc = resolveImgSrc(course.logo_path);
            const isComingSoon = course.status === "coming_soon";
            const isEnrolled = enrolledIds.has(Number(course.id));

            return (
              <div key={course.id} className="figma-card">
                <div className="figma-card-top" onClick={() => goDetails(course.id)} style={{ cursor: "pointer" }}>
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={course.title}
                      className="figma-card-img"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/180";
                      }}
                    />
                  ) : (
                    <div className="figma-card-img placeholder" />
                  )}
                </div>

                <div className="figma-card-body">
                  <h3 className="figma-card-title" onClick={() => goDetails(course.id)} style={{ cursor: "pointer" }}>
                    {course.title}
                  </h3>

                  <p className="figma-card-desc">{course.description || "No description."}</p>

                  <div className="figma-status">{normalizeStatusLabel(course.status)}</div>

                  <div className="figma-actions">
                    <button className="btn-live" onClick={() => goDetails(course.id)}>
                      View
                    </button>

                    <button
                      className={`btn-enroll ${isComingSoon ? "disabled" : ""}`}
                      onClick={() => handleEnroll(course.id, course.status)}
                      disabled={isComingSoon || isEnrolled}
                      title={isComingSoon ? "Coming soon" : ""}
                    >
                      {isEnrolled ? "Enrolled" : "Enroll Now"}
                    </button>
                  </div>

                  <button className="btn-download" type="button" onClick={() => goDetails(course.id)}>
                    Download Curriculum
                  </button>

                  {(userRole === "admin" || userRole === "instructor") && (
                    <div className="figma-meta">
                      <span>Instructor: {course.instructor_name || "—"}</span>
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
