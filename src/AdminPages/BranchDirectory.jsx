import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaChevronRight,
} from "react-icons/fa";
import { getToken } from "../utils/auth";
import AdminNavbar from "../components/Navbar/AdminNavbar";
import "./Style/BranchDirectory.css";

const BranchDirectory = () => {
  const { id } = useParams(); // Main Temple ID
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBranches();
  }, [id]);

  const fetchBranches = async () => {
    try {
      const res = await fetch(`${import.meta.env.base_url}/api/TempleBranches/all`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = await res.json();
      console.log(data);
      setBranches(data);
    } catch (err) {
      console.error("Error loading branches");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="loading">Consulting Branch Records...</div>;

  return (
    <>
      <AdminNavbar />
      <div className="detail-wrapper">
        <div className="header-nav wide-nav">
          <div className="nav-left">
            <h2 className="directory-title">Temple Branches</h2>
          </div>
        </div>

        <div className="branch-grid">
          {branches.length > 0 ? (
            branches.map((branch) => (
              <div
                key={branch.id}
                className="branch-card glass-card"
                onClick={() => navigate(`/admin/BranchDetails/${branch.id}`)}
              >
                {console.log(branch.image_url)}
                <div className="branch-card-image">
                  <img
                    src={
                      branch.image_url ||
                      "https://via.placeholder.com/400x250?text=No+Image+Available"
                    }
                    alt={branch.branch_name}
                  />
                </div>

                <div className="branch-card-content">
                  <div className="branch-names">
                    <h4>{branch.branch_name}</h4>
                    <p className="kannada-text">{branch.k_name}</p>
                  </div>

                  <div className="branch-meta">
                    <span>
                      <FaMapMarkerAlt /> {branch.address.substring(0, 45)}...
                    </span>
                  </div>

                  <div className="branch-card-footer">
                    <span className="view-link">
                      View Details <FaChevronRight />
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data-message">
              <p>No sub-temple branches found for this location.</p>
              <button
                onClick={() => navigate(`/admin/temple/${id}/add-branch`)}
              >
                Add First Branch
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BranchDirectory;
