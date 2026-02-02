import React, { useEffect, useMemo, useState } from "react";
import "./Pricing.css";

const API_BASE = "http://localhost:5000";

/**
 * IMPORTANT:
 * Change this to your real plans endpoint.
 * Examples:
 *   /api/plans
 *   /api/pricing-plans
 *   /api/pricing
 */
const PLANS_ENDPOINT = "/api/plans";

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

const CheckIcon = () => (
  <svg
    className="pc-check"
    width="56"
    height="56"
    viewBox="0 0 56 56"
    fill="none"
    aria-hidden="true"
  >
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

  // modal
  const [showModal, setShowModal] = useState(false);
  const [chosenPlanName, setChosenPlanName] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}${PLANS_ENDPOINT}`);
      const data = await res.json();

      // Support either {success,data} OR direct array
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep order like figma: recommended in middle if 3 plans, otherwise by price
  const displayPlans = useMemo(() => {
    const list = Array.isArray(plans) ? [...plans] : [];

    // sort by price ascending first
    list.sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0));

    // if exactly 3, place recommended in the middle (if exists)
    if (list.length === 3) {
      const recIdx = list.findIndex((p) => Number(p?.is_recommended) === 1);
      if (recIdx > -1 && recIdx !== 1) {
        const rec = list.splice(recIdx, 1)[0];
        list.splice(1, 0, rec);
      }
    }

    return list;
  }, [plans]);

  const choosePlan = async (plan) => {
    if (!token) {
      // mimic “Log in” expectation
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

  return (
    <div className="pricing-page">
      {/* TOP BLUE SECTION */}
      <section className="pricing-hero">
        <div className="pricing-inner">
          <h1 className="pricing-title">
            Our <span>Pricing</span>
          </h1>

          {/* CARDS */}
          {loading ? (
            <div className="pricing-loading">Loading plans...</div>
          ) : displayPlans.length === 0 ? (
            <div className="pricing-empty">
              No plans found. Make sure <b>PLANS_ENDPOINT</b> is correct in <b>Pricing.jsx</b>.
            </div>
          ) : (
            <div className="pricing-cards">
              {displayPlans.map((plan, idx) => {
                const features = safeJson(plan.features, []);
                const isMiddle = displayPlans.length === 3 && idx === 1;
                const tagText = plan.name || "Plan";

                return (
                  <div key={plan.id} className={`p-card ${isMiddle ? "p-card--middle" : ""}`}>
                    {/* TOP TAG */}
                    <div className="p-tag">{tagText}</div>

                    {/* ORANGE PRICE HEADER */}
                    <div className="p-top">
                      <div className="p-price">
                        <span className="p-currency">₹</span>
                        <span className="p-amount">{formatMoney(plan.price)}</span>
                        <span className="p-plus">+ Tax</span>
                      </div>
                      <div className="p-sub">(Exclusive of GST &amp; Taxes)</div>
                    </div>

                    {/* BODY */}
                    <div className="p-body">
                      {/* Features as points */}
                      <ul className="p-points">
                        {Array.isArray(features) && features.length > 0 ? (
                          features.map((f, i) => (
                            <li key={i}>
                              <span className="p-bullet" aria-hidden="true" />
                              <span className="p-point-text">{String(f)}</span>
                            </li>
                          ))
                        ) : (
                          <>
                            <li>
                              <span className="p-bullet" aria-hidden="true" />
                              <span className="p-point-text">Course limit: {plan.course_limit}</span>
                            </li>
                          </>
                        )}
                      </ul>

                      <button
                        type="button"
                        className="p-btn"
                        onClick={() => choosePlan(plan)}
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Choose Plan"}
                      </button>

                      <div className="p-brand">#EzySkills</div>
                    </div>

                    {/* dotted decorations */}
                    <div className="p-dots p-dots--left" />
                    <div className="p-dots p-dots--right" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* wave shape like figma */}
        <div className="pricing-wave" />
      </section>

      {/* SUCCESS MODAL */}
      {showModal && (
        <div
          className="pc-modal-overlay"
          onClick={() => setShowModal(false)}
          role="presentation"
        >
          <div className="pc-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="pc-modal-inner">
              <div className="pc-icon-wrap">
                <CheckIcon />
              </div>

              <div className="pc-title">Plan chosen</div>
              <div className="pc-subtitle">
                You selected <b>{chosenPlanName}</b>.
              </div>

              <button className="pc-close" type="button" onClick={() => setShowModal(false)}>
                Done
              </button>
            </div>

            <button
              className="pc-x"
              type="button"
              aria-label="Close"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
