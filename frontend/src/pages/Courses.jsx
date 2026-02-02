import React, { useEffect, useMemo, useState } from "react";
import "./Courses.css";

const Courses = () => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [activeTab, setActiveTab] = useState("all");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [enrollingId, setEnrollingId] = useState(null);

  const token = localStorage.getItem("token");

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  const tabToQuery = (tab) => {
    const queryMap = {
      all: "all",
      opened: "opened",
      coming_soon: "coming_soon",
    };
    return queryMap[tab] || "all";
  };

  const resolveImageSrc = (logoPath) => {
    if (!logoPath || logoPath === "null" || logoPath === "undefined") {
      return null;
    }
    if (logoPath.startsWith("http")) return logoPath;
    return logoPath.startsWith("/") ? logoPath : `/${logoPath}`;
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      coming_soon: "Coming Soon",
      popular: "Popular",
      active: "Opened",
    };
    return statusLabels[status] || "Opened";
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================
  const handleLiveDemo = (course) => {
    console.log("🎥 Live demo requested for:", course.title);
    // TODO: Implement live demo functionality
    alert(`Opening live demo for ${course.title}...`);
  };

  const handleEnroll = async (course) => {
    // Prevent enrollment for coming soon courses
    if (course.status === "coming_soon") {
      alert("⏳ This course is coming soon. Enrollment not available yet.");
      return;
    }

    // Check authentication
    if (!token) {
      alert("🔐 Please login to enroll in this course.");
      return;
    }

    setEnrollingId(course.id);

    try {
      const response = await fetch("http://localhost:5000/api/users/select-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course_id: course.id }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(
          `✅ Successfully enrolled in ${course.title}!\n\n📊 Remaining slots: ${data.remainingSlots}`
        );
      } else {
        alert(`❌ ${data.error || "Failed to enroll in the course."}`);
      }
    } catch (error) {
      console.error("❌ Enrollment error:", error);
      alert("⚠️ An error occurred while enrolling. Please try again.");
    } finally {
      setEnrollingId(null);
    }
  };

  const handleDownloadCurriculum = (course) => {
    console.log("📥 Download curriculum for:", course.title);
    // TODO: Implement actual download
    alert(`📄 Downloading curriculum for ${course.title}...`);
  };

  // ============================================
  // FETCH COURSES
  // ============================================
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const query = tabToQuery(activeTab);
        const response = await fetch(
          `http://localhost:5000/api/courses/public?filter=${query}`
        );
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          setCourses(data.data);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("❌ Failed to fetch courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [activeTab]);

  // ============================================
  // TABS CONFIGURATION
  // ============================================
  const tabs = useMemo(
    () => [
      { key: "all", label: "All" },
      { key: "opened", label: "Opened" },
      { key: "coming_soon", label: "Coming Soon" },
    ],
    []
  );

  // ============================================
  // FILTERED COURSES
  // ============================================
  const filteredCourses = useMemo(() => {
    const searchQuery = search.trim().toLowerCase();
    if (!searchQuery) return courses;

    return courses.filter((course) => {
      const title = (course.title || "").toLowerCase();
      const description = (course.description || "").toLowerCase();
      return title.includes(searchQuery) || description.includes(searchQuery);
    });
  }, [courses, search]);

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="courses-page">
      <div className="courses-wrap">
        {/* PAGE TITLE */}
        <h1 className="courses-title">
          Courses <span>List</span>
        </h1>

        {/* CONTROL BAR */}
        <div className="courses-bar">
          {/* SEARCH */}
          <div className="courses-search">
            <span className="courses-search-icon">🔍</span>
            <input
              type="text"
              className="courses-search-input"
              placeholder="Search here"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* TABS */}
          <div className="courses-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`courses-tab ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* SORT */}
          <div className="courses-sort">
            <span>Sort by:</span>
            <div className="courses-sort-box">
              Popular Class
              <span className="courses-sort-arrow">▼</span>
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        {loading ? (
          <div className="courses-state">⏳ Loading courses...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="courses-state">
            {search
              ? "🔍 No courses found matching your search."
              : "📚 No courses available at the moment."}
          </div>
        ) : (
          <div className="courses-grid">
            {filteredCourses.map((course) => {
              const imageSrc = resolveImageSrc(course.logo_path);
              const description = course.description || "No description available.";
              const isComingSoon = course.status === "coming_soon";
              const isEnrolling = enrollingId === course.id;

              return (
                <div key={course.id} className="course-card">
                  {/* BLUE HEADER WITH LOGO */}
                  <div className="course-card-top">
                    <img
                      className="course-logo"
                      src={imageSrc || "https://via.placeholder.com/120?text=No+Logo"}
                      alt={`${course.title} logo`}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/120?text=Error";
                      }}
                    />
                  </div>

                  {/* WHITE CARD BODY */}
                  <div className="course-card-body">
                    {/* TITLE */}
                    <h3 className="course-name">{course.title}</h3>

                    {/* DESCRIPTION */}
                    <p className="course-desc">{description}</p>

                    {/* ACTION PILLS */}
                    <div className="course-small-actions">
                      <button
                        type="button"
                        className="course-pill"
                        onClick={() => handleLiveDemo(course)}
                        title="View live demo"
                      >
                        Live Demo
                      </button>

                      <button
                        type="button"
                        className="course-pill"
                        onClick={() => handleEnroll(course)}
                        disabled={isComingSoon || isEnrolling}
                        title={
                          isComingSoon
                            ? "Coming soon - enrollment disabled"
                            : isEnrolling
                            ? "Processing enrollment..."
                            : "Enroll in this course"
                        }
                      >
                        {isEnrolling ? "Enrolling..." : "Enroll Now"}
                      </button>
                    </div>

                    {/* DOWNLOAD BUTTON */}
                    <button
                      type="button"
                      className="course-download"
                      onClick={() => handleDownloadCurriculum(course)}
                      title="Download course curriculum"
                    >
                      Download Curriculum
                    </button>

                    {/* STATUS */}
                    <div className="course-status">{getStatusLabel(course.status)}</div>
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
