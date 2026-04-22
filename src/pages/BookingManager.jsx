import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEdit,
  FaCalendarCheck,
  FaInfoCircle,
  FaTimes,
  FaSave,
  FaFilter,
  FaTags,
} from "react-icons/fa";
import { getToken } from "../utils/auth";
import "./Style/BookingManager.css";
// import DevoteeNavbar from '../components/Navbar/DevoteeNavbar';

const BookingManager = ({ navbar }) => {
  const [bookings, setBookings] = useState([]);
  const [categories, setCategories] = useState([]); // System-wide categories
  const [modalSevas, setModalSevas] = useState([]); // Sevas filtered for the modal
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBooking, setEditingBooking] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  console.log(filterDate);

  const API_BASE = `${import.meta.env.base_url}/api`;

  useEffect(() => {
    fetchBookings();
    fetchCategories();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE}/bookings/all`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      console.log(data);

      if (res.ok) setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setCategories(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  // Function to fetch sevas when category changes in modal
  const handleModalCategoryChange = async (catName) => {
    try {
      const res = await fetch(`${API_BASE}/sevas/category/${catName}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setModalSevas(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = async (booking) => {
    setEditingBooking(booking);
    // Pre-load sevas for the current category of the booking

    await handleModalCategoryChange(booking.category);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/bookings/${editingBooking.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(editingBooking),
      });
      if (res.ok) {
        setEditingBooking(null);
        fetchBookings();
        alert("Booking updated successfully.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.devotee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.mobile.includes(searchTerm) ||
      b.seva_name.toLowerCase().includes(searchTerm.toLowerCase());

    // Convert DB UTC string to a Local Date string (YYYY-MM-DD)
    const dbDate = new Date(b.seva_date);
    const year = dbDate.getFullYear();
    const month = String(dbDate.getMonth() + 1).padStart(2, "0");
    const day = String(dbDate.getDate()).padStart(2, "0");
    const localDbDate = `${year}-${month}-${day}`;

    const matchesDate = filterDate === "" || localDbDate === filterDate;

    return matchesSearch && matchesDate;
  });

  return (
    <>
      {navbar}
      <div className="booking-manager-wrapper">
        <header className="manager-header">
          <div className="title-area">
            <FaCalendarCheck className="header-icon" />
            <h1>Seva Booking Management</h1>
          </div>

          <div className="filter-bar">
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search Devotee, Mobile or Seva..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="date-filter">
              <FaFilter />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="booking-table-container">
          <table className="temple-admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Devotee Details</th>
                <th>Seva Offering</th>
                <th>Seva Date</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td>
                    <div className="main-text">{b.devotee_name}</div>
                    <div className="sub-text">{b.mobile}</div>
                  </td>
                  <td>
                    <div className="main-text">{b.seva_name}</div>
                    <div className="category-tag">{b.category}</div>
                  </td>
                  <td>
                    <div className="date-highlight">
                      {new Date(b.seva_date).toLocaleDateString("en-IN")}
                    </div>
                    <small>
                      Booked: {new Date(b.booking_date).toLocaleDateString()}
                    </small>
                  </td>
                  <td className="price-col">₹{b.amount}</td>
                  <td>
                    <span
                      className={`pay-pill ${b.payment_mode?.toLowerCase().replace(/\s/g, "") || "cash"}`}
                    >
                      {b.payment_mode}
                    </span>
                  </td>
                  <td>
                    <button
                      className="edit-btn-circle"
                      onClick={() => handleEditClick(b)}
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editingBooking && (
          <div className="modal-overlay">
            <div className="temple-modal">
              <div className="modal-header">
                <h2>
                  <FaInfoCircle /> Modify Booking
                </h2>
                <FaTimes
                  className="close-icon"
                  onClick={() => setEditingBooking(null)}
                />
              </div>
              <form onSubmit={handleUpdate} className="edit-booking-form">
                <div className="info-static">
                  <p>
                    <strong>Devotee:</strong> {editingBooking.devotee_name}
                  </p>
                </div>

                {/* Change Category */}
                <div className="form-field">
                  <label>
                    <FaTags /> Update Seva Category
                  </label>
                  <select
                    value={editingBooking.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setEditingBooking({
                        ...editingBooking,
                        category: newCat,
                        seva_id: "",
                      });
                      handleModalCategoryChange(newCat);
                    }}
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Change Seva Type */}
                <div className="form-field">
                  <label>Update Seva Type</label>
                  <select
                    value={editingBooking.seva_id}
                    onChange={(e) => {
                      const selected = modalSevas.find(
                        (s) => s.seva_id === parseInt(e.target.value),
                      );
                      setEditingBooking({
                        ...editingBooking,
                        seva_id: e.target.value,
                        seva_name: selected?.seva_name,
                        amount:
                          parseFloat(selected?.price || 0) +
                          parseFloat(selected?.Priest_price || 0),
                      });
                    }}
                  >
                    <option value="">
                      Current Seva:{editingBooking.seva_name}
                    </option>
                    {modalSevas.map((s) => (
                      <option key={s.seva_id} value={s.seva_id}>
                        {s.seva_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Change Seva Performance Date</label>
                  <input
                    type="date"
                    // Safety check to prevent "split of undefined"
                    value={
                      editingBooking.seva_date
                        ? editingBooking.seva_date.split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        seva_date: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Update Payment Mode</label>
                  <select
                    value={editingBooking.payment_mode}
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        payment_mode: e.target.value,
                      })
                    }
                    readOnly
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI / QR">UPI / QR</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Seva Amount (₹)</label>
                  <input
                    type="number"
                    value={editingBooking.amount}
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        amount: e.target.value,
                      })
                    }
                    readOnly
                  />
                </div>

                <button type="submit" className="save-btn">
                  <FaSave /> UPDATE BOOKING
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BookingManager;



