import React, { useState, useEffect } from "react";
import {
  FaBuilding,
  FaGem,
  FaCloudUploadAlt,
  FaSave,
  FaTrash,
  FaInfoCircle,
  FaImages,
  FaHistory,
  FaShieldAlt,
} from "react-icons/fa";
import { getToken } from "../utils/auth";
import "./Style/AssetManagement.css";
import AdminNavbar from "../components/Navbar/AdminNavbar";

const AssetManagement = () => {
  const [assetType, setAssetType] = useState("PROPERTY"); // PROPERTY or ORNAMENT
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [propCat, setPropCat] = useState([]);

  useEffect(() => {
    FetchpropCat();
  }, []);

  // Initializing state with snake_case to match your PostgreSQL Schema
  const [formData, setFormData] = useState({
    asset_code: "",
    asset_name: "",
    description: "",
    purchase_type: "Purchased", // Options: Purchased, Donation, Heritage
    purchase_date: "",
    purchase_cost: "",
    current_value: "",

    // Property specific
    property_type: "",
    location: "",
    total_area_sqft: "",
    rental_rate: "",
    electricity_meter_no: "",
    maintenance_status: "Good",

    // Ornament specific
    material_type: "Gold",
    purity: "",
    gross_weight: "",
    net_weight: "",
    stone_weight: "",
    stone_details: "",
    O_length: "",
    locker_no: "",

    // Insurance
    policy_number: "",
    insured_value: "",
    expiry_date: "",

    // Donor details
    donor_name: "",
    donor_phone: "",
    donor_address: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const FetchpropCat = async () => {
    const propcat = await fetch(`${import.meta.env.base_url}/api/properties/pcat`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await propcat.json();

    if (!data || data.length == 0) {
      console.log("NO DATA");
    } else {
      setPropCat(data);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const fileObjects = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: assetType === "PROPERTY" ? "HALL_VIEW" : "FRONT_VIEW",
    }));
    setSelectedFiles((prev) => [...prev, ...fileObjects]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      // 1️⃣ Core Asset Fields
      data.append("asset_code", formData.asset_code);
      data.append("asset_name", formData.asset_name);
      data.append("description", formData.description);
      data.append("purchase_type", formData.purchase_type);
      data.append("purchase_date", formData.purchase_date || "");
      data.append("purchase_cost", formData.purchase_cost || 0);
      data.append("asset_type", assetType);

      // 2️⃣ Donor Fields (Only if Donation)
      if (formData.purchase_type === "Donation") {
        data.append("donor_name", formData.donor_name);
        data.append("donor_phone", formData.donor_phone);
        data.append("donor_address", formData.donor_address);
      }

      // 3️⃣ Type-Specific Fields
      if (assetType === "PROPERTY") {
        data.append("property_type", formData.property_type);
        data.append("location", formData.location);
        data.append("total_area_sqft", formData.total_area_sqft || 0);
        data.append("rental_rate", formData.rental_rate || 0);
      } else {
        data.append("material_type", formData.material_type);
        data.append("purity", formData.purity);
        data.append("gross_weight", formData.gross_weight || 0);
        data.append("net_weight", formData.net_weight || 0);
        data.append("stone_weight", formData.stone_weight || 0);
        data.append("locker_no", formData.locker_no);
      }

      // 4️⃣ Insurance Fields
      data.append("policy_number", formData.policy_number);
      data.append("insured_value", formData.insured_value || 0);
      data.append("expiry_date", formData.expiry_date || "");

      // 5️⃣ Image Upload
      selectedFiles.forEach((fileObj, index) => {
        data.append("images", fileObj.file);
        data.append(
          `image_metadata_${index}`,
          JSON.stringify({
            type: fileObj.type,
            is_primary: index === 0,
          }),
        );
      });

      const res = await fetch(`${import.meta.env.base_url}/api/assets`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: data,
      });

      if (!res.ok) throw new Error("Failed to create asset");

      alert("Asset recorded successfully!");

      // Reset AFTER success
      setFormData({
        asset_code: "",
        asset_name: "",
        description: "",
        purchase_type: "Purchased",
        purchase_date: "",
        purchase_cost: "",
        current_value: "",
        property_type: "",
        location: "",
        total_area_sqft: "",
        rental_rate: "",
        electricity_meter_no: "",
        maintenance_status: "Good",
        material_type: "Gold",
        purity: "",
        gross_weight: "",
        net_weight: "",
        stone_weight: "",
        stone_details: "",
        O_length: "",
        locker_no: "",
        policy_number: "",
        insured_value: "",
        expiry_date: "",
        donor_name: "",
        donor_phone: "",
        donor_address: "",
      });

      setSelectedFiles([]);
    } catch (err) {
      console.error(err);
      alert("Error creating asset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="asset-mgmt-wrapper">
        <div className="registry-header">
          <h1>Asset Management</h1>
          <p>Digital Registry for Permanent and Mobile Assets</p>
        </div>

        <div className="dynamic-tab-container">
          <button
            className={assetType === "PROPERTY" ? "tab-btn active" : "tab-btn"}
            onClick={() => setAssetType("PROPERTY")}
          >
            <FaBuilding /> Fixed Assets
          </button>
          <button
            className={assetType === "ORNAMENT" ? "tab-btn active" : "tab-btn"}
            onClick={() => setAssetType("ORNAMENT")}
          >
            <FaGem /> Gold & Ornaments
          </button>
        </div>

        <form onSubmit={handleSubmit} className="registry-form">
          {/* BLOCK 1: PRIMARY ASSET DATA */}
          <div className="form-card">
            <div className="card-header">
              <FaInfoCircle /> Primary Identification
            </div>
            <div className="input-row">
              <div className="input-field">
                <label>Unique Asset Code *</label>
                <input
                  type="text"
                  name="asset_code"
                  value={formData.asset_code}
                  onChange={handleInputChange}
                  placeholder="e.g. PROP-001"
                  required
                />
              </div>
              <div className="input-field">
                <label>Asset Name *</label>
                <input
                  type="text"
                  name="asset_name"
                  value={formData.asset_name}
                  onChange={handleInputChange}
                  placeholder="Formal Registry Name"
                  required
                />
              </div>
            </div>

            <div className="input-row">
              <div className="input-field">
                <label>Acquisition Method</label>
                <select
                  name="purchase_type"
                  value={formData.purchase_type}
                  onChange={handleInputChange}
                >
                  <option value="Purchased">Purchased</option>
                  <option value="Donation">Donation (Vikas / Dana)</option>
                  <option value="Heritage">Heritage Asset</option>
                </select>
              </div>
              <div className="input-field">
                <label>Acquisition Date</label>
                <input
                  type="date"
                  name="purchase_date"
                  value={formData.purchase_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* DYNAMIC DONOR SECTION - ONLY RENDERS IF PURCHASE_TYPE IS DONATION */}
            {formData.purchase_type === "Donation" && (
              <div className="donor-highlight-box">
                <div className="box-title"> Donor Details</div>
                <div className="input-row">
                  <div className="input-field">
                    <label>Donor Full Name</label>
                    <input
                      type="text"
                      name="donor_name"
                      value={formData.donor_name}
                      onChange={handleInputChange}
                      placeholder="Sri/Smt Name"
                    />
                  </div>
                  <div className="input-field">
                    <label>Donor Phone</label>
                    <input
                      type="tel"
                      name="donor_phone"
                      value={formData.donor_phone}
                      onChange={handleInputChange}
                      placeholder="Contact Number"
                    />
                  </div>
                </div>
                <div className="input-field full-width">
                  <label>Donor Address</label>
                  <textarea
                    name="donor_address"
                    value={formData.donor_address}
                    onChange={handleInputChange}
                    placeholder="Full residential address"
                  ></textarea>
                </div>
              </div>
            )}

            <div className="input-field full-width">
              <label>General Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Identification marks, history, etc."
              ></textarea>
            </div>
          </div>

          {/* BLOCK 2: TYPE-SPECIFIC TECHNICAL DATA */}
          <div className="form-card accent-border">
            <div className="card-header">
              {assetType === "PROPERTY" ? (
                <>
                  <FaBuilding /> Property Specifications
                </>
              ) : (
                <>
                  <FaGem /> Ornament Specifications
                </>
              )}
            </div>

            {assetType === "PROPERTY" ? (
              <>
                <div className="input-row">
                  <div className="input-field">
                    <label>Property Category</label>
                    <select
                      name="property_type"
                      value={formData.property_type}
                      id="property_type"
                      onChange={handleInputChange}
                    >
                      <option value="">Select Category</option>

                      {propCat.map((cat) => (
                        <option key={cat.p_id} value={cat.p_name}>
                          {cat.p_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="input-field">
                    <label>Total Area (SqFt)</label>
                    <input
                      type="number"
                      name="total_area_sqft"
                      value={formData.total_area_sqft}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-field">
                    <label>Electric Meter Number</label>
                    <input
                      type="text"
                      name="electricity_meter_no"
                      value={formData.electricity_meter_no}
                      onChange={handleInputChange}
                      placeholder="RR Number"
                    />
                  </div>
                  <div className="input-field">
                    <label>Base Rental Rate (₹)</label>
                    <input
                      type="number"
                      name="rental_rate"
                      value={formData.rental_rate}
                      onChange={handleInputChange}
                      placeholder="Rate per day"
                    />
                  </div>
                </div>
                <div className="input-field full-width">
                  <label>Location / Boundary Details</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Survey No, Ward, Village"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="input-row">
                  <div className="input-field">
                    <label>Material Type</label>
                    <select
                      name="material_type"
                      value={formData.material_type}
                      onChange={handleInputChange}
                    >
                      <option value="Gold">Gold</option>
                      <option value="Silver">Silver</option>
                      <option value="Platinum">Platinum</option>
                    </select>
                  </div>
                  <div className="input-field">
                    <label>Purity (Karat/Grade)</label>
                    {/* <input type="text" name="purity" value={formData.purity} onChange={handleInputChange} placeholder="22K, 24K, 925" /> */}
                    <select
                      name="purity"
                      id="purity"
                      value={formData.purity}
                      onChange={handleInputChange}
                    >
                      <option value="24k">24k</option>
                      <option value="22k">22k</option>
                      <option value="18k">18k</option>
                      <option value="14k">14k</option>
                      <option value="10k">10k</option>
                    </select>
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-field">
                    <label>Net Weight (g)</label>
                    <input
                      type="number"
                      step="0.001"
                      name="net_weight"
                      value={formData.net_weight}
                      onChange={handleInputChange}
                      placeholder="0.000"
                    />
                  </div>{" "}
                  <div className="input-field">
                    <label>Stone Weight (g)</label>
                    <input
                      type="number"
                      step="0.001"
                      name="stone_weight"
                      value={formData.stone_weight}
                      onChange={handleInputChange}
                      placeholder="0.000"
                    />
                  </div>
                  <div className="input-field">
                    <label>Gross Weight (g)</label>
                    <input
                      type="number"
                      step="0.001"
                      name="gross_weight"
                      value={formData.gross_weight}
                      onChange={handleInputChange}
                      placeholder="0.000"
                    />
                  </div>
                  <div className="input-field">
                    <label>Length (Inch)</label>
                    <input
                      type="number"
                      step="0.001"
                      name="O_length"
                      value={formData.O_length}
                      onChange={handleInputChange}
                      placeholder="0.000"
                    />
                  </div>
                  <div className="input-field">
                    <label>Vault / Locker ID</label>
                    <input
                      type="text"
                      name="locker_no"
                      value={formData.locker_no}
                      onChange={handleInputChange}
                      placeholder="Box Number"
                    />
                  </div>
                </div>
                <div className="input-field full-width">
                  <label>Stone / Diamond Details</label>
                  <textarea
                    name="stone_details"
                    value={formData.stone_details}
                    onChange={handleInputChange}
                    placeholder="Weight and count of stones"
                  ></textarea>
                </div>
              </>
            )}
          </div>

          {/* BLOCK 3: INSURANCE & VALUE */}
          <div className="form-card">
            <div className="card-header">
              <FaShieldAlt /> Valuation & Insurance
            </div>
            <div className="input-row">
              <div className="input-field">
                <label>Initial Cost (₹)</label>
                <input
                  type="number"
                  name="purchase_cost"
                  value={formData.purchase_cost}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-field">
                <label>Current Value (₹)</label>
                <input
                  type="number"
                  name="current_value"
                  value={formData.current_value}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="input-row">
              <div className="input-field">
                <label>Policy Number</label>
                <input
                  type="text"
                  name="policy_number"
                  value={formData.policy_number}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-field">
                <label>Insurance Value</label>
                <input
                  type="text"
                  name="insured_value"
                  value={formData.insured_value}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-field">
                <label>Policy Expiry Date</label>
                <input
                  type="date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* BLOCK 4: IMAGE GALLERY */}
          <div className="form-card">
            <div className="card-header">
              <FaImages /> Media Documentation
            </div>
            <div className="upload-zone">
              <input
                type="file"
                multiple
                id="file-input"
                hidden
                onChange={handleFileChange}
              />
              <label htmlFor="file-input">
                <FaCloudUploadAlt size={40} />
                <p>Drag and drop or click to upload multiple asset photos</p>
              </label>
            </div>
            <div className="preview-strip">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="preview-item">
                  <img src={file.preview} alt="preview" />
                  <button type="button" onClick={() => removeFile(idx)}>
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              "Recording to Ledger..."
            ) : (
              <>
                <FaSave /> REGISTER ASSET PERMANENTLY
              </>
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default AssetManagement;
