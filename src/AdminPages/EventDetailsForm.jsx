import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaHistory,
  FaBullhorn,
  FaMapMarkerAlt,
  FaClock,
  FaAlignLeft,
  FaSave,
  FaArrowRight,
} from "react-icons/fa";
import { getToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/Navbar/AdminNavbar";
import "./Style/EventDetailsForm.css";

const EventDetailsForm = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    branch_id: "",
    title: "",
    event_type: "FUNCTION",
    periodicity: "YEARLY",
    specific_date_mithi: "",
    remarks: "",
    reminder_date: "",
    reminder_time_from: "",
    reminder_time_to: "",
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/TempleBranches/all`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setBranches(await res.json());
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.remarks.length > 300)
      return alert("Remarks exceed 300 characters");

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/EventMaster`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Event Scheduled Successfully!");
        navigate("/admin/EventDirectory");
      }
    } catch (err) {
      alert("Error saving event");
    }
    setLoading(false);
  };

  return (
    <div className="event-page-wrapper">
      <AdminNavbar />

      <div className="event-container">
        <header className="event-header">
          <div className="header-icon">
            <FaCalendarAlt />
          </div>
          <div>
            <h1>Annual Functions & Meetings</h1>
            <p>Schedule and manage temple occasions across branches</p>
          </div>
          <button
            className="view-list-btn"
            onClick={() => navigate("/admin/EventDirectory")}
          >
            View All Events <FaArrowRight />
          </button>
        </header>

        <form className="event-glass-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Branch Selection */}
            <div className="input-group full-width">
              <label>
                <FaMapMarkerAlt /> Target Branch
              </label>
              <select
                value={formData.branch_id}
                onChange={(e) =>
                  setFormData({ ...formData, branch_id: e.target.value })
                }
                required
              >
                <option value="">-- Select Temple Branch --</option>

                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.branch_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="input-group full-width">
              <label>Event Title</label>
              <input
                type="text"
                placeholder="e.g. Maha Shivaratri Celebration"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            {/* Type & Periodicity */}
            <div className="input-group">
              <label>
                <FaBullhorn /> Event Type
              </label>
              <select
                value={formData.event_type}
                onChange={(e) =>
                  setFormData({ ...formData, event_type: e.target.value })
                }
              >
                <option value="FUNCTION">FUNCTION</option>
                <option value="OCCASION">OCCASION</option>
                <option value="MEETING">MEETING</option>
              </select>
            </div>

            <div className="input-group">
              <label>
                <FaHistory /> Periodicity
              </label>
              <select
                value={formData.periodicity}
                onChange={(e) =>
                  setFormData({ ...formData, periodicity: e.target.value })
                }
              >
                <option value="DAILY">DAILY</option>
                <option value="WEEKLY">WEEKLY</option>
                <option value="MONTHLY">MONTHLY</option>
                <option value="YEARLY">YEARLY</option>
                <option value="ONCE">ONCE</option>
              </select>
            </div>

            {/* Specific Date / Mithi */}
            <div className="input-group fix-input">
              <label>Specific Date / Mithi</label>
              <input
                type="text"
                placeholder="e.g. Chaitra Shukla Pratipada"
                value={formData.specific_date_mithi}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specific_date_mithi: e.target.value,
                  })
                }
              />
            </div>

            <div className="input-group">
              <label>Function Date</label>
              <input
                type="date"
                value={formData.function_date}
                onChange={(e) =>
                  setFormData({ ...formData, function_date: e.target.value })
                }
              />
            </div>

            {/* Reminder Date */}
            <div className="input-group">
              <label>Reminder Date</label>
              <input
                type="date"
                value={formData.reminder_date}
                onChange={(e) =>
                  setFormData({ ...formData, reminder_date: e.target.value })
                }
              />
            </div>

            {/* Remarks */}
            <div className="input-group full-width">
              <label>
                <FaAlignLeft /> Remarks ({formData.remarks.length}/300)
              </label>
              <textarea
                rows="3"
                maxLength="300"
                placeholder="Additional details or instructions..."
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
              />
            </div>
          </div>

          <button type="submit" className="event-submit-btn" disabled={loading}>
            {loading ? (
              "Processing..."
            ) : (
              <>
                <FaSave /> Save Event Details
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventDetailsForm;



