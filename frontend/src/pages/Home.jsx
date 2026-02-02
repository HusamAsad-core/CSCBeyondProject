// Home.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

// --- ASSETS (keep your exact paths) ---
import heroGirl from "../assets/images/hero-girl.png";
import bestSellerBox from "../assets/images/icons/best_seller.png";
import orangeCircle from "../assets/images/shapes/orange_circle.png";

import slide1 from "../assets/images/slides/ai_based_course_selector.png";
import slide2 from "../assets/images/slides/ai_based_scenarios.png";
import slide3 from "../assets/images/slides/ai_based_quizs_tests.png";
import slide4 from "../assets/images/slides/ai_based_gamification.png";

import collaborativeImg from "../assets/images/collaborative.png";
import collegeIcon from "../assets/images/icons/Colleges_Universities.png";
import corporateIcon from "../assets/images/icons/Corporates.png";
import professionalIcon from "../assets/images/icons/Idividual_working_professionals.png";
import startupIcon from "../assets/images/icons/startups.png";

import howItWorksImg from "../assets/images/how_it_works.png";
import achievementsImg from "../assets/images/our_achievments.png";

import teacherCardImg from "../assets/images/teacher_card.png";
import iso9001 from "../assets/images/certifications/ISO9001.png";
import iso27001 from "../assets/images/certifications/ISO27001.png";
import iso200001 from "../assets/images/certifications/ISO200001.png";
import iso29993 from "../assets/images/certifications/ISO29993.png";
import collaborationsImg from "../assets/images/collaboration_co.png";

const API_BASE = "http://localhost:5000";

/**
 * Use this ONLY for files that are served from your backend:
 * server.js has:  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
 *
 * So DB should store either:
 *   - "/uploads/teacher1.png"   (recommended)
 * or
 *   - "uploads/teacher1.png"
 */
const resolveBackendImg = (imgPath) => {
  if (!imgPath) return null;
  if (imgPath.startsWith("http")) return imgPath;

  // ensure a single leading slash
  const normalized = imgPath.startsWith("/") ? imgPath : `/${imgPath}`;
  return `${API_BASE}${normalized}`;
};

/**
 * Course logos are currently working in your UI without backend prefix.
 * So keep them FRONTEND-relative unless you later move them to /uploads.
 */
const resolveCourseLogo = (logoPath) => {
  if (!logoPath) return null;
  if (logoPath.startsWith("http")) return logoPath;
  if (logoPath.startsWith("/")) return logoPath;
  return `/${logoPath}`;
};

const Home = () => {
  const navigate = useNavigate();

  // ----------------------------
  // Search
  // ----------------------------
  const [searchTerm, setSearchTerm] = useState("");

  const onSearch = (e) => {
    e.preventDefault();
    const q = (searchTerm || "").trim();
    if (!q) return navigate("/courses");
    navigate(`/courses?search=${encodeURIComponent(q)}`);
  };

  // ----------------------------
  // AI Slider (auto move)
  // ----------------------------
  const slides = useMemo(
    () => [
      { img: slide1, title: "AI Based", highlight: "Course Selector" },
      { img: slide2, title: "AI Based", highlight: "Scenarios" },
      { img: slide3, title: "AI Based", highlight: "Quizes/Tests" },
      { img: slide4, title: "AI Based", highlight: "Gamification" },
    ],
    []
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);
  const isHoveringRef = useRef(false);

  const startAuto = () => {
    stopAuto();
    intervalRef.current = setInterval(() => {
      if (isHoveringRef.current) return;
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 2600);
  };

  const stopAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => {
    startAuto();
    return () => stopAuto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------
  // Popular Courses (fetch ONLY 4)
  // ----------------------------
  const [popularCourses, setPopularCourses] = useState([]);
  const [popularLoading, setPopularLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setPopularLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/courses/public`);
        const data = await res.json();

        if (data?.success && Array.isArray(data?.data)) {
          const list = data.data;

          const popularOnly = list.filter((c) => c.status === "popular");
          const opened = list.filter(
            (c) => c.status === "active" || c.status === "popular"
          );

          const picked = (popularOnly.length ? popularOnly : opened).slice(0, 4);
          setPopularCourses(picked);
        } else {
          setPopularCourses([]);
        }
      } catch (e) {
        console.error("Fetch popular courses error:", e);
        setPopularCourses([]);
      } finally {
        setPopularLoading(false);
      }
    };

    run();
  }, []);

  // ----------------------------
  // Instructors (from users table where role='instructor')
  // NOTE: this endpoint must exist in backend:
  // GET  /api/users/instructors
  // returns: { success:true, data:[{id, username, bio, image_path}] }
  // ----------------------------
  const [instructors, setInstructors] = useState([]);
  const [instructorsLoading, setInstructorsLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setInstructorsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/users/instructors`);
        const data = await res.json();

        if (data?.success && Array.isArray(data?.data)) {
          setInstructors(data.data);
        } else {
          setInstructors([]);
        }
      } catch (e) {
        console.error("Fetch instructors error:", e);
        setInstructors([]);
      } finally {
        setInstructorsLoading(false);
      }
    };

    run();
  }, []);

  return (
    <div className="home-wrapper">
      {/* HERO SECTION */}
      <section className="hero-container">
        <div className="hero-left">
          <h1 className="hero-title">
            Skill Your Way <br />
            Up To Success <br />
            With Us
          </h1>

          <p className="hero-subtitle">
            Get the skills you need for the future of work.
          </p>

          <form className="hero-search-wrapper" onSubmit={onSearch}>
            <input
              type="text"
              placeholder="Search the course you want"
              className="hero-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="hero-search-btn" type="submit">
              Search
            </button>
          </form>

          <div className="hero-pills">
            <button type="button" className="hero-pill active">
              IT Field
            </button>
            <button type="button" className="hero-pill">
              Coding
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-image-relative">
            <img src={orangeCircle} alt="" className="hero-bg-shape" />
            <img src={heroGirl} alt="Hero" className="main-hero-img" />
            <img
              src={bestSellerBox}
              alt="Best Seller"
              className="best-seller-overlay-large"
            />
          </div>
        </div>
      </section>

      {/* AI PLATFORM */}
      <section className="platform-intro">
        <div className="platform-row">
          <div className="platform-left">
            <h2 className="platform-title">
              World’s First AI Based <br />
              <span className="text-orange">Online Learning Platform</span>
            </h2>

            {/* If you want the dotted decoration */}
            <div className="dots-divider-horizontal" aria-hidden="true" />
          </div>

          <div
            className="platform-right"
            onMouseEnter={() => (isHoveringRef.current = true)}
            onMouseLeave={() => (isHoveringRef.current = false)}
          >
            <div className="ai-carousel">
              <div
                className="ai-track"
                style={{
                  transform: `translateX(-${activeIndex * 308}px)`,
                }}
              >
                {slides.map((s, i) => (
                  <div
                    key={i}
                    className={`ai-card ${i === activeIndex ? "active" : ""}`}
                  >
                    <div className="ai-card-top">
                      <img
                        src={s.img}
                        alt={`${s.title} ${s.highlight}`}
                        className="ai-card-img"
                      />
                    </div>

                    <div className="ai-card-text">
                      <div className="ai-card-title">{s.title}</div>
                      <div className="ai-card-highlight">{s.highlight}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ai-dots">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`ai-dot ${i === activeIndex ? "on" : ""}`}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO CAN JOIN */}
      <section className="who-join-section">
        <div className="who-join-content">
          <div className="who-join-left">
            <h4 className="section-tag-orange">WHO CAN JOIN</h4>

            <h2 className="who-join-title">
              Skill Development <br /> Schemes For All
            </h2>

            <div className="who-join-grid">
              <div className="join-card">
                <img src={collegeIcon} alt="Colleges" />
                <div className="join-info">
                  <span className="join-number">01</span>
                  <p>Colleges/Universities</p>
                </div>
              </div>

              <div className="join-card">
                <img src={professionalIcon} alt="Professionals" />
                <div className="join-info">
                  <span className="join-number">02</span>
                  <p>Individual/Working Professionals</p>
                </div>
              </div>

              <div className="join-card">
                <img src={startupIcon} alt="Startups" />
                <div className="join-info">
                  <span className="join-number">03</span>
                  <p>Startups</p>
                </div>
              </div>

              <div className="join-card">
                <img src={corporateIcon} alt="Corporates" />
                <div className="join-info">
                  <span className="join-number">04</span>
                  <p>Corporates</p>
                </div>
              </div>
            </div>
          </div>

          <div className="who-join-right">
            <img
              src={collaborativeImg}
              alt="Collaborative"
              className="collaborative-img"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-works-outer">
        <div className="how-works-container">
          <div className="how-works-pill">How It Works</div>

          <div className="how-works-blue-box">
            <img
              src={howItWorksImg}
              alt="Process Flow"
              className="how-works-main-img"
            />
          </div>

          <img src={orangeCircle} alt="" className="how-works-circle-decor" />
        </div>
      </section>

      {/* POPULAR COURSES (ONLY 4) */}
      <section className="popular-courses-section">
        <h2 className="popular-title">
          Popular <span className="text-orange">Courses</span>
        </h2>

        {popularLoading ? (
          <div className="popular-loading">Loading...</div>
        ) : (
          <div className="popular-courses-grid">
            {popularCourses.map((c) => {
              const imgSrc = resolveCourseLogo(c.logo_path);

              return (
                <button
                  key={c.id}
                  type="button"
                  className="popular-course-card"
                  onClick={() => navigate(`/courses/${c.id}`)}
                >
                  <div className="popular-card-top">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={c.title}
                        className="popular-card-logo"
                        onError={(e) => {
                          // fallback to blank block if missing
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="popular-card-logo-fallback" />
                    )}
                  </div>

                  <div className="popular-card-body">
                    <div className="popular-card-title">{c.title}</div>
                    <div className="popular-card-desc">
                      {c.description || "No description."}
                    </div>

                    <div className="popular-card-btn">View course</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="view-all-container">
          <button className="view-all-btn" onClick={() => navigate("/courses")}>
            View All Courses
          </button>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="achievements-section">
        <h2 className="achievements-title">
          Our <span className="text-orange">Achievements</span>
        </h2>

        <div className="achievements-container">
          <div className="achievements-left">
            <img
              src={achievementsImg}
              alt="Achievements"
              className="achievements-main-img"
            />
          </div>

          <div className="achievements-right">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <h3 className="stat-number">100</h3>
                  <p className="stat-label">
                    Students <br /> Trained
                  </p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <h3 className="stat-number">50</h3>
                  <p className="stat-label">
                    Courses <br /> Available
                  </p>
                </div>
              </div>

              <div className="stat-card stat-card-full">
                <div className="stat-header">
                  <h3 className="stat-number text-blue">70%</h3>
                  <p className="stat-label">
                    Students Secured <br /> Jobs in Level 1 Companies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MENTORS (from DB instructors) */}
      <section className="mentors-section">
        <h2 className="mentors-title">
          Meet Our Professional <br />
          <span className="text-orange">Mentors & Trainers</span>
        </h2>

        <div className="mentors-container">
          {instructorsLoading ? (
            <div className="popular-loading">Loading...</div>
          ) : (
            <div className="mentors-slider">
              {instructors.map((u) => {
                const imgSrc = resolveBackendImg(u.image_path);

                return (
                  <div key={u.id} className="mentor-card">
                    <div className="mentor-card-header">
                      <img
                        src={imgSrc || teacherCardImg}
                        alt={u.username || "Instructor"}
                        className="mentor-img"
                        onError={(e) => {
                          e.currentTarget.src = teacherCardImg;
                        }}
                      />

                      <div className="mentor-header-info">
                        <h4 className="mentor-name">
                          {u.username || "Instructor"}
                        </h4>
                      </div>
                    </div>

                    <hr className="mentor-divider" />

                    <p className="mentor-desc">{u.bio || "No bio available."}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="certifications-section">
        <h2 className="cert-title">
          Our <span className="text-orange">Certifications</span>
        </h2>

        <div className="cert-logos-row">
          <img src={iso27001} alt="ISO 27001" />
          <img src={iso9001} alt="ISO 9001" />
          <img src={iso200001} alt="ISO 200001" />
          <img src={iso29993} alt="ISO 29993" />
        </div>
      </section>

      {/* COLLABORATIONS */}
      <section className="collaborations-section">
        <h2 className="collab-title">
          Our <span className="text-orange">Collaborations</span>
        </h2>

        <div className="collab-img-container">
          <img
            src={collaborationsImg}
            alt="Our Collaborations"
            className="collab-main-img"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
