import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
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

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/courses/public/${id}`);
        const data = await res.json();
        if (data.success) setCourse(data.data);
      } catch (e) {
        console.error("CourseDetails error:", e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const imgSrc = useMemo(() => resolveImgSrc(course?.logo_path), [course]);

  const objectives = useMemo(
    () => safeJson(course?.objectives_json, []),
    [course]
  );
  const content = useMemo(
    () => safeJson(course?.content_json, []),
    [course]
  );
  const projects = useMemo(
    () => safeJson(course?.projects_json, []),
    [course]
  );
  const tools = useMemo(
    () => safeJson(course?.tools_json, []),
    [course]
  );

  if (loading) return <div className="course-details-wrap">Loading...</div>;
  if (!course) return <div className="course-details-wrap">Course not found.</div>;

  return (
    <div className="course-details-wrap">
      <div className="course-details-card">
        {/* HERO */}
        <div className="hero">
          <div className="hero-left">
            <div className="hero-badge">Course Page</div>
            <div className="hero-title">
              <span className="hero-title-strong">{course.title}</span>
            </div>
            <div className="hero-sub">
              Instructor: <b>{course.instructor_name || "—"}</b> • Category:{" "}
              <b>{course.category_name || "—"}</b>
            </div>
          </div>

          <div className="hero-right">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={course.title}
                className="hero-logo"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              <div className="hero-logo-fallback" />
            )}
          </div>
        </div>

        {/* MAIN */}
        <div className="grid2">
          {/* ABOUT */}
          <div className="panel">
            <div className="panel-title">About the Course</div>
            <div className="panel-text">
              {course.about || course.description || "No details provided yet."}
            </div>

            {Array.isArray(objectives) && objectives.length > 0 && (
              <>
                <div className="panel-subtitle">Objectives</div>
                <ul className="checklist">
                  {objectives.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* COURSE CONTENT */}
          <div className="panel">
            <div className="panel-title">Course Content</div>

            {Array.isArray(content) && content.length > 0 ? (
              <div className="content-list">
                {content.map((item, idx) => {
                  const title =
                    typeof item === "string" ? item : item?.title || `Item ${idx + 1}`;
                  const desc =
                    typeof item === "string" ? "" : item?.description || "";

                  return (
                    <div className="content-row" key={idx}>
                      <div className="content-index">{String(idx + 1).padStart(2, "0")}</div>
                      <div className="content-body">
                        <div className="content-title">{title}</div>
                        {desc && <div className="content-desc">{desc}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="panel-muted">No content list yet.</div>
            )}
          </div>
        </div>

        {/* PROJECTS */}
        <div className="section">
          <div className="section-title">{course.title} Projects</div>
          {Array.isArray(projects) && projects.length > 0 ? (
            <div className="projects-grid">
              {projects.map((p, i) => (
                <div className="project-card" key={i}>
                  <div className="project-dot" />
                  <div className="project-name">
                    {typeof p === "string" ? p : p?.title || `Project ${i + 1}`}
                  </div>
                  {typeof p === "object" && p?.description && (
                    <div className="project-desc">{p.description}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="section-muted">No projects yet.</div>
          )}
        </div>

        {/* CTA */}
        <div className="cta">
          <div className="cta-left">
            <div className="cta-title">Wanna check more about the course?</div>
          </div>
          <div className="cta-right">
            <button
              className="cta-btn"
              type="button"
              onClick={() => {
                if (course.demo_url) window.open(course.demo_url, "_blank");
                else alert("Demo URL not set yet.");
              }}
            >
              Demo
            </button>

            <button
              className="cta-btn outline"
              type="button"
              onClick={() => {
                if (course.curriculum_url) window.open(course.curriculum_url, "_blank");
                else alert("Curriculum URL not set yet.");
              }}
            >
              Download Curriculum
            </button>
          </div>
        </div>

        {/* TOOLS */}
        <div className="section">
          <div className="section-title">Tools & Platforms</div>
          {Array.isArray(tools) && tools.length > 0 ? (
            <div className="tools-row">
              {tools.map((t, i) => (
                <div className="tool-pill" key={i}>
                  {typeof t === "string" ? t : t?.name || `Tool ${i + 1}`}
                </div>
              ))}
            </div>
          ) : (
            <div className="section-muted">No tools yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
