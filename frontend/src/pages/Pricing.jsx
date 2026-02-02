import React, { useEffect, useMemo, useState } from "react";
import "./Pricing.css";

const API_BASE = "http://localhost:5000";
const PLANS_ENDPOINT = "/api/plans";

// Utility functions
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

const formatMoney = (value) => {
  if (value === null || value === undefined) return "";
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
};

// Icon components
const BuildingIcon = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <rect x="10" y="8" width="28" height="32" rx="2" stroke="#334155" strokeWidth="2.5" fill="none"/>
    <line x1="14" y1="14" x2="18" y2="14" stroke="#334155" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="22" y1="14" x2="26" y2="14" stroke="#334155" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="30" y1="14" x2="34" y2="14" stroke="#334155" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="14" y1="20" x2="18" y2="20" stroke="#334155" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="22" y1="20" x2="26" y2="20" stroke="#334155" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="30" y1="20" x2="34" y2="20" stroke="#334155" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="14" y1="26" x2="18" y2="26" stroke="#334155" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="22" y1="26" x2="26" y2="26" stroke="#334155" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="30" y1="26" x2="34" y2="26" stroke="#334155" strokeWidth="2.5" strokeLinecap="round"/>
    <rect x="20" y="32" width="8" height="8" fill="#334155"/>
  </svg>
);

const PeopleIcon = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="16" r="6" stroke="#334155" strokeWidth="2.5" fill="none"/>
    <path d="M12 38c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <circle cx="36" cy="18" r="4" stroke="#334155" strokeWidth="2.5" fill="none"/>
    <path d="M42 38c0-3.314-2.686-6-6-6" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <rect x="8" y="12" width="32" height="28" rx="2" stroke="#334155" strokeWidth="2.5" fill="none"/>
    <line x1="8" y1="20" x2="40" y2="20" stroke="#334155" strokeWidth="2.5"/>
    <line x1="16" y1="8" x2="16" y2="16" stroke="#334155" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="32" y1="8" x2="32" y2="16" stroke="#334155" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="16" cy="28" r="1.5" fill="#334155"/>
    <circle cx="24" cy="28" r="1.5" fill="#334155"/>
    <circle cx="32" cy="28" r="1.5" fill="#334155"/>
    <circle cx="16" cy="34" r="1.5" fill="#334155"/>
    <circle cx="24" cy="34" r="1.5" fill="#334155"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" opacity="0.18" />
    <path
      d="M18.5 28.5L25.2 35.2L39 21.4"
      stroke="currentColor"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Pricing = () => {
  const token = localStorage.getItem("token");

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [chosenPlanName, setChosenPlanName] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch plans from API
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}${PLANS_ENDPOINT}`);
      const data = await res.json();

      if (data?.success && Array.isArray(data.data)) {
        setPlans(data.data);
      } else if (Array.isArray(data)) {
        setPlans(data);
      } else {
        setPlans([]);
      }
    } catch (e) {
      console.error("Pricing fetch error:", e);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Sort plans and place recommended in middle if 3 plans
  const displayPlans = useMemo(() => {
    const list = Array.isArray(plans) ? [...plans] : [];
    list.sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0));

    if (list.length === 3) {
      const recIdx = list.findIndex((p) => Number(p?.is_recommended) === 1);
      if (recIdx > -1 && recIdx !== 1) {
        const rec = list.splice(recIdx, 1)[0];
        list.splice(1, 0, rec);
      }
    }

    return list;
  }, [plans]);

  // Choose plan handler
  const choosePlan = async (plan) => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/update-plan`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId: plan.id }),
      });

      const data = await res.json();
      if (!data?.success) {
        alert(data?.error || "Failed to choose plan");
        return;
      }

      setChosenPlanName(plan.name || "Plan");
      setShowModal(true);
    } catch (e) {
      console.error("choosePlan error:", e);
      alert("Choose plan failed");
    } finally {
      setSaving(false);
    }
  };

  // Get appropriate icon for feature
  const getFeatureIcon = (featureText) => {
    const text = String(featureText).toLowerCase();
    
    if (text.includes("college") || text.includes("university") || text.includes("student") || text.includes("group")) {
      return <BuildingIcon />;
    }
    if (text.includes("individual") || text.includes("person") || text.includes("people")) {
      return <PeopleIcon />;
    }
    return <CalendarIcon />;
  };

  return (
    <div className="pricing-page">
      <section className="pricing-hero">
        <div className="pricing-container">
          <h1 className="pricing-title">
            Our <span className="highlight">Pricing</span>
          </h1>

          {loading ? (
            <div className="pricing-loading">Loading plans...</div>
          ) : displayPlans.length === 0 ? (
            <div className="pricing-empty">
              No plans found. Make sure <b>PLANS_ENDPOINT</b> is correct.
            </div>
          ) : (
            <div className="pricing-grid">
              {displayPlans.map((plan, idx) => {
                const features = safeJson(plan.features, []);
                const isMiddle = displayPlans.length === 3 && idx === 1;

                return (
                  <div 
                    key={plan.id} 
                    className={`pricing-card ${isMiddle ? "elevated" : ""}`}
                  >
                    {/* Plan name tag */}
                    <div className="plan-tag">{plan.name || "Plan"}</div>

                    {/* Orange header with price */}
                    <div className="card-header">
                      <div className="price-display">
                        <span className="currency">₹</span>
                        <span className="amount">{formatMoney(plan.price)}</span>
                        <span className="tax-label">+ Tax</span>
                      </div>
                      <div className="tax-note">(Exclusive of GST &amp; Taxes)</div>
                    </div>

                    {/* White body with features */}
                    <div className="card-body">
                      <ul className="features-list">
                        {Array.isArray(features) && features.length > 0 ? (
                          features.map((feature, i) => (
                            <li key={i} className="feature-item">
                              <div className="feature-icon">
                                {getFeatureIcon(feature)}
                              </div>
                              <span className="feature-text">{String(feature)}</span>
                            </li>
                          ))
                        ) : (
                          <li className="feature-item">
                            <div className="feature-icon">
                              <CalendarIcon />
                            </div>
                            <span className="feature-text">
                              Course limit: {plan.course_limit}
                            </span>
                          </li>
                        )}
                      </ul>

                      <button
                        type="button"
                        className="choose-button"
                        onClick={() => choosePlan(plan)}
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Choose Plan"}
                      </button>

                      <div className="brand-tag">#Razorpay</div>
                    </div>

                    {/* Decorative dots */}
                    <div className="dots-decoration dots-left" />
                    <div className="dots-decoration dots-right" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Wave separator */}
        <div className="wave-separator" />
      </section>

      {/* Success Modal */}
      {showModal && (
        <div 
          className="modal-overlay" 
          onClick={() => setShowModal(false)}
        >
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>

            <div className="modal-icon">
              <CheckIcon />
            </div>

            <h2 className="modal-title">Plan Chosen</h2>
            <p className="modal-subtitle">
              You selected <b>{chosenPlanName}</b>.
            </p>

            <button
              className="modal-button"
              type="button"
              onClick={() => setShowModal(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;