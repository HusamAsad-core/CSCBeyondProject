import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./CourseDetails.css";

const API_BASE = "http://localhost:5000";

const safeJson = (val, fallback) => {
  if (val === null || val === undefined) return fallback;
  if (Array.isArray(val) || typeof val === "object") return val;
  try {
    const parsed = JSON.parse(val);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const resolveImgSrc = (logoPath) => {
  if (!logoPath) return null;
  if (logoPath.startsWith("http")) return logoPath;
  if (logoPath.startsWith("/")) return logoPath;
  return `/${logoPath}`;
};

const splitTitle = (title) => {
  if (!title) return { a: "Course", b: "Details" };
  const parts = title.split(":");
  if (parts.length >= 2) return { a: parts[0].trim(), b: parts.slice(1).join(":").trim() };
  // fallback if no colon
  const words = title.trim().split(" ");
  if (words.length <= 2) return { a: title.trim(), b: "" };
  return { a: words.slice(0, 2).join(" "), b: words.slice(2).join(" ") };
};

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/courses/public/${id}`);
        const data = await response.json();
        if (data.success) setCourse(data.data);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const imgSrc = useMemo(() => resolveImgSrc(course?.logo_path), [course]);
  const objectives = useMemo(() => safeJson(course?.objectives_json, []), [course]);
  const content = useMemo(() => safeJson(course?.content_json, []), [course]);
  const projects = useMemo(() => safeJson(course?.projects_json, []), [course]);
  const tools = useMemo(() => safeJson(course?.tools_json, []), [course]);

  const titleParts = useMemo(() => splitTitle(course?.title), [course]);
  const aboutText = course?.about || course?.description || "";

  const toggleModule = (index) => {
    setExpandedModules((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (loading) {
    return (
      <div className="cd-page">
        <div className="cd-state">Loading...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="cd-page">
        <div className="cd-state">Course not found.</div>
      </div>
    );
  }

  return (
    <div className="cd-page">
      {/* ===================== HERO / BANNER ===================== */}
      <section className="cd-hero">
        <div className="cd-hero-bg" />
        <div className="cd-hero-inner">
          <div className="cd-hero-left">
            {imgSrc ? (
              <img
                className="cd-hero-logo"
                src={imgSrc}
                alt={course.title}
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              <div className="cd-hero-logo-fallback">EZY</div>
            )}
          </div>

          <div className="cd-hero-right">
            <h1 className="cd-hero-title">
              <span className="cd-hero-title-orange">{titleParts.a}</span>
              {titleParts.b ? <br /> : null}
              <span className="cd-hero-title-white">{titleParts.b}</span>
            </h1>
          </div>
        </div>
      </section>

      {/* ===================== ABOUT + CONTENT ===================== */}
      <section className="cd-dark">
        <div className="cd-container cd-two-cols">
          {/* LEFT: ABOUT */}
          <div className="cd-panel cd-panel-dark">
            <h2 className="cd-h2">About The Course</h2>
            <p className="cd-about">
              {aboutText ||
                "This course covers fundamentals through advanced topics with hands-on practice and real-world projects."}
            </p>

            <h3 className="cd-h3">Objectives</h3>

            <ul className="cd-objectives">
              {(objectives.length ? objectives : [
              ]).map((obj, i) => (
                <li key={i} className="cd-objective-item">
                  <span className="cd-check" aria-hidden="true">✓</span> <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: COURSE CONTENT CARD */}
          <div className="cd-panel cd-panel-light cd-content-card">
            <div className="cd-card-top">
              <h2 className="cd-h2 cd-h2-orange">Course Content</h2>
              <div className="cd-dots" aria-hidden="true">
                {Array.from({ length: 6 }).map((_, r) => (
                  <div key={r} className="cd-dots-row">
                    {Array.from({ length: 4 }).map((__, c) => (
                      <span key={c} className="cd-dot" />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="cd-modules">
              {(content.length ? content : [
              ]).map((item, idx) => {
                const title = typeof item === "string" ? item : item?.title || `Module ${idx + 1}`;
                const desc = typeof item === "string" ? "" : item?.description || "";
                const isExpanded = !!expandedModules[idx];

                return (
                  <div key={idx} className={`cd-module ${isExpanded ? "open" : ""}`}>
                    <button className="cd-module-btn" onClick={() => toggleModule(idx)} type="button">
                      <div className="cd-module-left">
                        <span className="cd-module-num">{String(idx + 1).padStart(2, "0")}</span>
                        <span className="cd-module-title">{title}</span>
                      </div>
                      <span className={`cd-caret ${isExpanded ? "up" : ""}`} aria-hidden="true">▾</span>
                    </button>

                    {isExpanded && desc ? (
                      <div className="cd-module-body">
                        <p>{desc}</p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PROJECTS ===================== */}
      <section className="cd-projects">
        <div className="cd-container">
          <div className="cd-section-title">
            <h2 className="cd-h2 cd-h2-orange">Projects</h2>
            <div className="cd-line" />
          </div>

          <div className="cd-project-grid">
            {(projects.length ? projects : [
            ]).map((p, i) => {
              const name = typeof p === "string" ? p : p?.title || `Project ${i + 1}`;
              const desc = typeof p === "string" ? "" : p?.description || "";
              return (
                <div key={i} className="cd-project-card">
                  <div className="cd-project-icon">
                    <span>A</span>
                  </div>
                  <div className="cd-project-text">
                    <h3>{name}</h3>
                    {desc ? <p>{desc}</p> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="cd-cta">
        <div className="cd-container">
          <div className="cd-cta-box">
            <div className="cd-cta-left">
              <h2>Wanna check more<br />about the course?</h2>
            </div>

            <div className="cd-cta-right">
              <div className="cd-cta-actions">
                <button
                  className="cd-btn cd-btn-dark"
                  type="button"
                  onClick={() => {
                    if (course.demo_url) window.open(course.demo_url, "_blank");
                    else alert("Demo URL not available.");
                  }}
                >
                  Demo
                </button>

                <button className="cd-btn cd-btn-orange" type="button">
                  Enroll Now
                </button>
              </div>

              <button
                className="cd-btn cd-btn-wide"
                type="button"
                onClick={() => {
                  if (course.curriculum_url) window.open(course.curriculum_url, "_blank");
                  else alert("Curriculum URL not available.");
                }}
              >
                Download Curriculum
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== TOOLS ===================== */}
      <section className="cd-tools">
        <div className="cd-container">
          <div className="cd-section-title">
            <h2 className="cd-h2 cd-h2-orange">Tools & Platforms</h2>
            <div className="cd-line" />
          </div>

          <div className="cd-tools-row">
            {(tools.length ? tools : ["UI", "MEAN", "Dev", "UI", "React", "Code"]).slice(0, 10).map((t, i) => {
              const name = typeof t === "string" ? t : t?.name || `Tool ${i + 1}`;
              return (
                <div key={i} className="cd-tool">
                  <span>{name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== FOOTER (matching screenshot style) ===================== */}
      <footer className="cd-footer">
        <div className="cd-container cd-footer-grid">
          <div className="cd-foot-brand">
            <div className="cd-foot-logo">
              <span className="cd-foot-mark" />
              <span className="cd-foot-name">EZY SKILLS</span>
            </div>

            <p className="cd-foot-text">
              Let us build your career together. Be the first person to transform
              yourself with our unique & world class corporate level trainings.
            </p>

            <div className="cd-news">
              <h4>Subscribe Our Newsletter</h4>
              <div className="cd-news-row">
                <input type="email" placeholder="Your Email address" />
                <button type="button">→</button>
              </div>
            </div>
          </div>

          <div className="cd-foot-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/faq">FAQ's</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="cd-foot-contact">
            <h4>Contact Us</h4>
            <div className="cd-foot-item">
              <span className="cd-ic" aria-hidden="true">•</span>
              <span>123 Main Street, City, Country</span>
            </div>
            <div className="cd-foot-item">
              <span className="cd-ic" aria-hidden="true">•</span>
              <span>info@ezyskills.com</span>
            </div>
            <div className="cd-foot-item">
              <span className="cd-ic" aria-hidden="true">•</span>
              <span>+1 234 567 8900</span>
            </div>
          </div>
        </div>

        <div className="cd-footer-bottom">
          <div className="cd-container cd-footer-bottom-inner">
            <p>© 2024 EZY Skills. All rights reserved.</p>
            <div className="cd-foot-social">
              <a href="#f" aria-label="facebook">f</a>
              <a href="#t" aria-label="twitter">t</a>
              <a href="#in" aria-label="linkedin">in</a>
              <a href="#y" aria-label="youtube">▶</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CourseDetails;
