import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaFolder, FaWallet, FaHome } from "react-icons/fa";
import { getToken } from "../../utils/auth";
import "../Style/AddCategory.css";

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [propertyCategories, setPropertyCategories] = useState([]); // New State
  const [newName, setNewName] = useState({
    category: "",
    location: "",
    property: "",
  }); // Updated State

  const API_BASE = `${import.meta.env.VITE_API_URL}/api`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, locRes, propRes] = await Promise.all([
        fetch(`${API_BASE}/categories`, { headers }),
        fetch(`${API_BASE}/locations`, { headers }),
        fetch(`${API_BASE}/properties/pcat`, { headers }), // New Fetch
      ]);

      if (catRes.ok) setCategories(await catRes.json());
      if (locRes.ok) setLocations(await locRes.json());
      if (propRes.ok) setPropertyCategories(await propRes.json());
    } catch (err) {
      console.error("errrr:", err);
    }
  };

  const handleAdd = async (type) => {
    // Map the internal state key to the API endpoint
    const endpointMap = {
      category: "categories",
      location: "locations",
      property: "properties/pcat",
    };

    const endpoint = endpointMap[type];
    const value = newName[type];

    if (!value) return;

    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name: value }),
      });
      if (res.ok) {
        setNewName({ ...newName, [type]: "" });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Delete this item?")) return;

    const endpointMap = {
      category: "categories",
      location: "locations",
      property: "properties/pcat",
    };

    const endpoint = endpointMap[type];
    try {
      const res = await fetch(`${API_BASE}/${endpoint}/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="configuration-container">
      <header className="page-header">
        <h2>Dashboard Configuration</h2>
        <p>Manage system-wide dropdown options for Sevas and Assets.</p>
      </header>

      <div className="responsive-content-stack">
        {/* Seva Category Management */}
        <section className="management-card">
          <div className="card-top">
            <FaFolder className="icon" /> <h2>Seva Categories</h2>
          </div>
          <div className="inline-add-form">
            <input
              type="text"
              placeholder="e.g. Nitya Pooja"
              value={newName.category}
              onChange={(e) =>
                setNewName({ ...newName, category: e.target.value })
              }
            />
            <button onClick={() => handleAdd("category")}>
              <FaPlus />
            </button>
          </div>
          <ul className="config-list">
            {categories.map((cat) => (
              <li key={cat.id}>
                {cat.name}
                <button
                  onClick={() => handleDelete("category", cat.id)}
                  className="delete-icon"
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Ledger Heads Management */}
        <section className="management-card">
          <div className="card-top">
            <FaWallet className="icon" /> <h2>Ledger Heads</h2>
          </div>
          <div className="inline-add-form">
            <input
              type="text"
              placeholder="e.g. Bank A"
              value={newName.location}
              onChange={(e) =>
                setNewName({ ...newName, location: e.target.value })
              }
            />
            <button onClick={() => handleAdd("location")}>
              <FaPlus />
            </button>
          </div>
          <ul className="config-list">
            {locations.map((loc) => (
              <li key={loc.id}>
                {loc.name}
                <button
                  onClick={() => handleDelete("location", loc.id)}
                  className="delete-icon"
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Property Category Management - NEW SECTION */}
        <section className="management-card">
          <div className="card-top">
            <FaHome className="icon" /> <h2>Property Categories</h2>
          </div>
          <div className="inline-add-form">
            <input
              type="text"
              placeholder="e.g. Land, Building"
              value={newName.property}
              onChange={(e) =>
                setNewName({ ...newName, property: e.target.value })
              }
            />
            <button onClick={() => handleAdd("property")}>
              <FaPlus />
            </button>
          </div>
          <ul className="config-list">
            {propertyCategories.map((prop) => (
              <li key={prop.p_id}>
                {prop.p_name}
                <button
                  onClick={() => handleDelete("property", prop.p_id)}
                  className="delete-icon"
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AddCategory;



