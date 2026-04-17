import React, { useState, useEffect } from "react";
import {
  FaProjectDiagram,
  FaUserTie,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRupeeSign,
  FaInfoCircle,
  FaSave,
  FaCheckDouble,
  FaEnvelope,
  FaBook,
  FaAlignLeft,
} from "react-icons/fa";
import { getToken } from "../utils/auth";
import AdminNavbar from "../components/Navbar/AdminNavbar";
import "./Style/ProjectRegistry.css";

const ProjectRegistry = () => {
  const [branches, setBranches] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Comprehensive Project State
  const [projectData, setProjectData] = useState({
    project_name: "",
    project_details: "",
    commence_date: "",
    estimated_end_date: "",
    coordinator_name: "",
    phone: "",
    email: "",
    address: "",
    project_cost: "",
    ledger_id: "",
    branch_id: "",
    has_stages: false,
  });

  // Stages State
  const [stages, setStages] = useState([
    {
      stage_name: "Project Proposed",
      start_date: "",
      end_date: "",
      remarks: "",
    },
    {
      stage_name: "Project Approved",
      start_date: "",
      end_date: "",
      remarks: "",
    },
    { stage_name: "Work Started", start_date: "", end_date: "", remarks: "" },
    { stage_name: "Work Ended", start_date: "", end_date: "", remarks: "" },
    {
      stage_name: "Work Implemented/Delivered",
      start_date: "",
      end_date: "",
      remarks: "",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${getToken()}` };
        const [brRes, ldRes] = await Promise.all([
          fetch(`${process.env.base_url}/api/TempleBranches/all`, { headers }),
          fetch(`${process.env.base_url}/api/locations`, { headers }),
        ]);
        if (brRes.ok) setBranches(await brRes.json());
        if (ldRes.ok) setLedgers(await ldRes.json());
      } catch (err) {
        console.error("Data fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const handleStageChange = (index, field, value) => {
    const updatedStages = [...stages];
    updatedStages[index][field] = value;
    setStages(updatedStages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Data Cleaning: Convert empty strings to null for PostgreSQL DATE compatibility
    const cleanDate = (date) => (date === "" ? null : date);

    const payload = {
      ...projectData,
      commence_date: cleanDate(projectData.commence_date),
      estimated_end_date: cleanDate(projectData.estimated_end_date),
      ledger_id: projectData.ledger_id ? parseInt(projectData.ledger_id) : null,
      project_cost: parseFloat(projectData.project_cost) || 0,
      stages: projectData.has_stages
        ? stages.map((s) => ({
            ...s,
            start_date: cleanDate(s.start_date),
            end_date: cleanDate(s.end_date),
          }))
        : [],
    };

    try {
      const res = await fetch(`${process.env.base_url}/api/projects/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Project Registry successful!");
        window.location.reload();
      }
    } catch (err) {
      alert("Registration failed: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="project-page-wrapper">
      <AdminNavbar />
      <div className="project-container">
        <header className="project-header">
          <FaProjectDiagram className="p-icon" />
          <div>
            <h1>Project Registry</h1>
            <p>Detailed tracking of Temple Projects & Social Initiatives</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="project-form-glass">
          {/* --- Section 1: Core Project Info --- */}
          <div className="form-section">
            <h3>
              <FaInfoCircle /> Project Definition
            </h3>
            <div className="p-grid">
              <div className="p-field full">
                <label>Project Name</label>
                <input
                  type="text"
                  required
                  value={projectData.project_name}
                  onChange={(e) =>
                    setProjectData({
                      ...projectData,
                      project_name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="p-field full">
                <label>
                  <FaAlignLeft /> Project Details / Scope
                </label>
                <textarea
                  className="p-details"
                  rows="3"
                  value={projectData.project_details}
                  onChange={(e) =>
                    setProjectData({
                      ...projectData,
                      project_details: e.target.value,
                    })
                  }
                  placeholder="Describe the project objective..."
                />
              </div>
              <div className="p-field">
                <label>
                  <FaCalendarAlt /> Commence Date
                </label>
                <input
                  type="date"
                  value={projectData.commence_date}
                  onChange={(e) =>
                    setProjectData({
                      ...projectData,
                      commence_date: e.target.value,
                    })
                  }
                />
              </div>
              <div className="p-field">
                <label>
                  <FaCalendarAlt /> Estimated End Date
                </label>
                <input
                  type="date"
                  value={projectData.estimated_end_date}
                  onChange={(e) =>
                    setProjectData({
                      ...projectData,
                      estimated_end_date: e.target.value,
                    })
                  }
                />
              </div>
              <div className="p-field">
                <label>Branch Location</label>
                <select
                  required
                  value={projectData.branch_id}
                  onChange={(e) =>
                    setProjectData({
                      ...projectData,
                      branch_id: e.target.value,
                    })
                  }
                >
                  <option value="">Select Branch</option>
                  <option value="0">Main Branch</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.branch_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* --- Section 2: Management & Finance --- */}
          <div className="form-section">
            <h3>
              <FaUserTie /> Coordinator & Financials
            </h3>
            <div className="p-grid">
              <div className="p-field">
                <label>Project Head Name</label>
                <input
                  type="text"
                  value={projectData.coordinator_name}
                  onChange={(e) =>
                    setProjectData({
                      ...projectData,
                      coordinator_name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="p-field">
                <label>
                  <FaPhone /> Phone
                </label>
                <input
                  type="tel"
                  value={projectData.phone}
                  onChange={(e) =>
                    setProjectData({ ...projectData, phone: e.target.value })
                  }
                />
              </div>
              <div className="p-field">
                <label>
                  <FaEnvelope /> Email
                </label>
                <input
                  type="email"
                  value={projectData.email}
                  onChange={(e) =>
                    setProjectData({ ...projectData, email: e.target.value })
                  }
                />
              </div>
              <div className="p-field">
                <label>
                  <FaRupeeSign /> Project Cost
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={projectData.project_cost}
                  onChange={(e) =>
                    setProjectData({
                      ...projectData,
                      project_cost: e.target.value,
                    })
                  }
                />
              </div>
              <div className="p-field full">
                <label>
                  <FaMapMarkerAlt /> Communication Address
                </label>
                <input
                  type="text"
                  value={projectData.address}
                  onChange={(e) =>
                    setProjectData({ ...projectData, address: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* --- Section 3: Lifecycle Toggle --- */}
          <div className="form-section stages-toggle-sec">
            <label className="toggle-container">
              <input
                type="checkbox"
                checked={projectData.has_stages}
                onChange={(e) =>
                  setProjectData({
                    ...projectData,
                    has_stages: e.target.checked,
                  })
                }
              />
              <span className="slider"></span>
              Track Project Lifecycle Stages
            </label>
          </div>

          {projectData.has_stages && (
            <div className="stages-timeline">
              <h4>Project Timeline Stages</h4>
              {stages.map((stage, index) => (
                <div key={index} className="stage-row">
                  <div className="stage-name-label">
                    <FaCheckDouble /> {stage.stage_name}
                  </div>
                  <div className="stage-inputs-row">
                    <input
                      type="date"
                      value={stage.start_date}
                      onChange={(e) =>
                        handleStageChange(index, "start_date", e.target.value)
                      }
                      placeholder="Start Date"
                    />
                    <input
                      type="date"
                      value={stage.end_date}
                      onChange={(e) =>
                        handleStageChange(index, "end_date", e.target.value)
                      }
                      placeholder="End Date"
                    />
                    <input
                      type="text"
                      value={stage.remarks}
                      onChange={(e) =>
                        handleStageChange(index, "remarks", e.target.value)
                      }
                      placeholder="Remarks..."
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-field full">
            <label>
              <FaBook /> Account Ledger
            </label>
            <select
              required
              value={projectData.ledger_id}
              onChange={(e) =>
                setProjectData({ ...projectData, ledger_id: e.target.value })
              }
            >
              <option value="">Select Ledger</option>
              {ledgers.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="project-submit-btn"
            disabled={loading}
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <FaSave /> Save Project Details
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectRegistry;



