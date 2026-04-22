import React, { useEffect, useState } from "react";
import { FaBuilding, FaGem, FaEye } from "react-icons/fa";
import { getToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

import "./Style/AssetDirectory.css";
import AdminNavbar from "../components/Navbar/AdminNavbar";

const AssetDirectory = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/assets`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (!res.ok) throw new Error("Failed to fetch assets");

      const data = await res.json();
      setAssets(data);
      console.log("Fetched assets:", data);
    } catch (err) {
      console.error(err);
      alert("Error loading assets");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading Temple Registry...</div>;
  }

  return (
    <div className="directory-wrapper">
      <AdminNavbar />
      <h1 className="directory-title">🛕 Temple Asset Registry</h1>

      <div className="asset-grid">
        {assets.length === 0 ? (
          <p>No assets found in registry.</p>
        ) : (
          assets.map((asset) => (
            <div key={asset.id} className="asset-card">
              {/* Image Preview */}
              <div className="slider">
                <img
                  src={asset.primary_image || "/placeholder.jpg"}
                  alt="asset"
                />
              </div>

              {/* Asset Info */}
              <div className="asset-info">
                <h3>
                  {asset.asset_type === "PROPERTY" ? <FaBuilding /> : <FaGem />}{" "}
                  {asset.asset_name}
                </h3>

                <p>
                  <strong>Code:</strong> {asset.asset_code}
                </p>
                <p>
                  <strong>Type:</strong> {asset.asset_type}
                </p>
                <p>
                  <strong>Purchase Cost:</strong> ₹{asset.purchase_cost}
                </p>

                {asset.asset_type === "PROPERTY" ? (
                  <>
                    <p>
                      <strong>Category:</strong> {asset.property_type}
                    </p>
                    <p>
                      <strong>Rental Rate:</strong> ₹{asset.rental_rate}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Material:</strong> {asset.material_type}
                    </p>
                    <p>
                      <strong>Weight:</strong> {asset.gross_weight} g
                    </p>
                  </>
                )}
              </div>

              {/* View Button */}
              <button
                className="view-btn"
                onClick={() => navigate(`/admin/assets/${asset.id}`)}
              >
                <FaEye /> View Full Record
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssetDirectory;
