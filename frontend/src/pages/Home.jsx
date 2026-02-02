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
import bordersImg from "../assets/images/borders.png";

import achievementsImg from "../assets/images/our_achievments.png";

import teacherCardImg from "../assets/images/teacher_card.png";
import iso9001 from "../assets/images/certifications/ISO9001.png";
import iso27001 from "../assets/images/certifications/ISO27001.png";
import iso200001 from "../assets/images/certifications/ISO200001.png";
import iso29993 from "../assets/images/certifications/ISO29993.png";
import collaborationsImg from "../assets/images/collaboration_co.png";

const API_BASE = "http://localhost:5000";

const resolveImgSrc = (logoPath) => {
  if (!logoPath) return null;
  if (logoPath.startsWith("http")) return logoPath;
  if (logoPath.startsWith("/")) return logoPath;
  return `/${logoPath}`;
};

const Home = () => {
  const navigate = useNavigate();

  // ----------------------------
  // Search (works -> goes to /courses?search=)
  // ----------------------------
  const [searchTerm, setSearchTerm] = useState("");

  const onSearch = (e) => {
    e.preventDefault();
    const q = (searchTerm || "").trim();
    if (!q) return navigate("/courses");
    navigate(`/courses?search=${encodeURIComponent(q)}`);
  };

  // ----------------------------
  // Slider (AI cards) auto move
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
        // Must return all public courses
        const res = await fetch(`${API_BASE}/api/courses/public`);
        const data = await res.json();

        if (data?.success && Array.isArray(data?.data)) {
          // Prefer status === "popular", fallback to first 4 opened courses
          const list = data.data;

          const popularOnly = list.filter((c) => c.status === "popular");
          const opened = list.filter((c) => c.status === "active" || c.status === "popular");

          const picked =
            (popularOnly.length ? popularOnly : opened).slice(0, 4);

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
  // Mentors (horizontal scroll like cards)
  // ----------------------------
  const mentors = useMemo(
    () => [
      {
        name: "Sandeep",
        field: ".Net & Azure",
        description:
          "Sandeep is a Software Developer and expert in .NET & Azure. He has 14+ years of training 500+ students to accomplish their goals & dreams.",
      },
      {
        name: "Sudhansu",
        field: "Cloud & Cyber Security, Forensic",
        description:
          "Sudhansu is a Software Developer expert in cloud security, Cyber Security, Data Center & Forensics for more than 15 years.",
      },
      {
        name: "Ruchika Tuteja",
        field: "UI/UX Trainer",
        description:
          "I have 8 years of experience in Fullstack development. I have worked on multiple projects and provide real-time simulation of various development.",
      },
    ],
    []
  );

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

          {/* Pills like your screenshot */}
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

      {/* AI PLATFORM (Figma-like) */}
      <section className="platform-intro">
        <div className="platform-row">
          <div className="platform-left">
            <h2 className="platform-title">
              World’s First AI Based <br />
              <span className="text-orange">Online Learning Platform</span>
            </h2>

            {/* HORIZONTAL DOTS (like Figma) */}
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

              {/* Keep the dots UNDER the cards, but ensure NO purple */}
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

      <img src={bordersImg} alt="" className="section-divider" />

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
              const imgSrc = resolveImgSrc(c.logo_path);
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
                        onError={(e) => (e.currentTarget.style.display = "none")}
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

                    <div className="popular-card-btn">
                      View course
                    </div>
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


      {/* MENTORS */}
      <section className="mentors-section">
        <h2 className="mentors-title">
          Meet Our Professional <br />
          <span className="text-orange">Mentors & Trainers</span>
        </h2>

        <div className="mentors-container">
          <div className="mentors-slider">
            {mentors.map((mentor, index) => (
              <div key={index} className="mentor-card">
                <div className="mentor-card-header">
                  <img
                    src={teacherCardImg}
                    alt={mentor.name}
                    className="mentor-img"
                  />
                  <div className="mentor-header-info">
                    <h4 className="mentor-name">{mentor.name}</h4>
                    <p className="mentor-field">{mentor.field}</p>
                  </div>
                </div>

                <hr className="mentor-divider" />
                <p className="mentor-desc">{mentor.description}</p>
              </div>
            ))}
          </div>
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
