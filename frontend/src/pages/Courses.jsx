import React, { useEffect, useMemo, useState } from "react";
import "./Courses.css";

const Courses = () => {
  const [activeTab, setActiveTab] = useState("all"); // all | opened | coming_soon
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // UI state
  const [search, setSearch] = useState("");
  const [enrollingId, setEnrollingId] = useState(null);

  const token = localStorage.getItem("token"); // for enroll endpoint (protected)

  const tabToQuery = (tab) => {
    if (tab === "opened") return "opened";
    if (tab === "coming_soon") return "coming_soon";
    return "all";
  };

  const resolveImageSrc = (logoPath) => {
    const raw = (logoPath || "").trim();
    if (!raw || raw === "null" || raw === "undefined") return null;
    if (raw.startsWith("http")) return raw;
    if (raw.startsWith("/")) return raw;
    return `/${raw}`;
  };

  const statusLabel = (status) => {
    if (status === "coming_soon") return "Coming Soon";
    if (status === "popular") return "Opened";
    return "Opened"; // active
  };

  // ✅ Live Demo always clickable (we'll implement later)
  const handleLiveDemo = (course) => {
    // Placeholder for later:
    console.log("Live demo clicked for course:", course.id);
    // Later you can navigate, open modal, etc.
  };

  // ✅ Enroll Now: only for non-coming_soon
  const handleEnroll = async (course) => {
    if (course.status === "coming_soon") return;

    if (!token) {
      alert("Please login first to enroll.");
      return;
    }

    setEnrollingId(course.id);
    try {
      const res = await fetch("http://localhost:5000/api/users/select-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course_id: course.id }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Failed to enroll.");
        return;
      }

      alert(`Successfully enrolled! Remaining slots: ${data.remainingSlots}`);
    } catch (e) {
      console.error("Enroll error:", e);
      alert("Server error while enrolling.");
    } finally {
      setEnrollingId(null);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const q = tabToQuery(activeTab);
        const res = await fetch(`http://localhost:5000/api/courses/public?filter=${q}`);
        const data = await res.json();
        if (data.success) setCourses(Array.isArray(data.data) ? data.data : []);
        else setCourses([]);
      } catch (e) {
        console.error("Failed to load courses:", e);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [activeTab]);

  const tabs = useMemo(
    () => [
      { key: "all", label: "All" },
      { key: "opened", label: "Opened" },
      { key: "coming_soon", label: "Coming Soon" },
    ],
    []
  );

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c) => {
      const title = (c.title || "").toLowerCase();
      const desc = (c.description || "").toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  }, [courses, search]);

  return (
    <div className="courses-page">
      <div className="courses-wrap">
        <h1 className="courses-title">
          Courses <span>List</span>
        </h1>

        <div className="courses-bar">
          <div className="courses-search">
            <span className="courses-search-icon">⌕</span>
            <input
              className="courses-search-input"
              placeholder="Search The Course Here"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="courses-tabs">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`courses-tab ${activeTab === t.key ? "active" : ""}`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="courses-sort">
            <span>Sort by :</span>
            <div className="courses-sort-box">
              Popular Class <span className="courses-sort-arrow">▾</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="courses-state">Loading courses...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="courses-state">No courses found.</div>
        ) : (
          <div className="courses-grid">
            {filteredCourses.map((course) => {
              const imgSrc = resolveImageSrc(course.logo_path);
              const shortDesc = (course.description || "").trim();
              const isComingSoon = course.status === "coming_soon";
              const isEnrollingThis = enrollingId === course.id;

              return (
                <div key={course.id} className="course-card">
                  <div className="course-card-top">
                    <img
                      className="course-logo"
                      src={imgSrc || "https://via.placeholder.com/140"}
                      alt={course.title}
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/140";
                      }}
                    />
                  </div>

                  <div className="course-card-body">
                    <h3 className="course-name">{course.title}</h3>

                    <p className="course-desc">
                      {shortDesc || "No description available."}
                    </p>

                    <div className="course-small-actions">
                      {/* Live Demo: always clickable */}
                      <button
                        type="button"
                        className="course-pill"
                        onClick={() => handleLiveDemo(course)}
                      >
                        Live Demo
                      </button>

                      {/* Enroll Now: disabled if coming soon */}
                      <button
                        type="button"
                        className="course-pill"
                        onClick={() => handleEnroll(course)}
                        disabled={isComingSoon || isEnrollingThis}
                        style={
                          isComingSoon || isEnrollingThis
                            ? {
                                opacity: 0.5,
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }
                            : undefined
                        }
                        title={isComingSoon ? "Coming soon — enrollment disabled" : "Enroll now"}
                      >
                        {isEnrollingThis ? "Enrolling..." : "Enroll Now"}
                      </button>
                    </div>

                    <button type="button" className="course-download">
                      Download Curriculum
                    </button>

                    <div className="course-status">{statusLabel(course.status)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
