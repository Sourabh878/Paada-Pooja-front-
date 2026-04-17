import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaBell,
  FaSearch,
  FaCalendarAlt,
  FaClock,
  FaTimes,
  FaSave,
  FaEye,
  FaFilter,
} from "react-icons/fa";
import { getToken } from "../utils/auth";
import AdminNavbar from "../components/Navbar/AdminNavbar";
import "./Style/EventDetailsView.css";

const EventDetailsView = () => {
  const [events, setEvents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [viewRemark, setViewRemark] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [evRes, brRes] = await Promise.all([
        fetch(`${process.env.base_url}/api/EventMaster`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        fetch(`${process.env.base_url}/api/TempleBranches/all`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
      ]);

      if (evRes.ok) {
        const data = await evRes.json();
        const processedData = data.map((event) => ({
          ...event,
          function_date: event.function_date
            ? event.function_date.split("T")[0]
            : null,
          reminder_date: event.reminder_date
            ? event.reminder_date.split("T")[0]
            : null,
        }));
        setEvents(processedData);

        const localToday = new Date().toISOString().split("T")[0];
        setReminders(
          processedData.filter((e) => e.reminder_date === localToday),
        );
      }
      if (brRes.ok) setBranches(await brRes.json());
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Helper: Calculate Days Difference
  const getDaysCount = (targetDate) => {
    if (!targetDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(targetDate);
    eventDate.setHours(0, 0, 0, 0);

    const diffTime = eventDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // --- Filter Logic ---
  const filteredEvents = events.filter((e) => {
    const days = getDaysCount(e.function_date);
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.display_branch_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriod =
      filterPeriod === "ALL" || e.periodicity === filterPeriod;

    let matchesStatus = true;
    if (filterStatus === "PENDING") matchesStatus = days >= 0;
    if (filterStatus === "FINISHED") matchesStatus = days < 0;

    return matchesSearch && matchesPeriod && matchesStatus;
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.base_url}/api/EventMaster/${editingData.event_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(editingData),
        },
      );
      if (res.ok) {
        setIsModalOpen(false);
        fetchInitialData();
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleDelete = async (event_id) => {
    //  e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.base_url}/api/EventMaster/${event_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );
      if (res.ok) {
        alert("Deleted Succesfully");
        fetchInitialData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="event_wrapper">
      <AdminNavbar />

      {reminders.length > 0 && (
        <div className="reminder-ticker">
          <div className="ticker-content">
            <FaBell className="bell-ring" />
            <strong>Alerts:</strong>
            {reminders.map((r) => (
              <span key={r.event_id} className="ticker-item">
                {r.title}{" "}
                <button
                  onClick={() =>
                    setReminders(
                      reminders.filter((rem) => rem.event_id !== r.event_id),
                    )
                  }
                >
                  Read
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="view-page-container">
        <header className="view-header">
          <h2>
            <FaCalendarAlt /> Temple Event Ledger
          </h2>

          <div className="controls-row">
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <FaFilter />
              <select onChange={(e) => setFilterPeriod(e.target.value)}>
                <option value="ALL">All Periods</option>
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
                <option value="ONCE">ONCE</option>
              </select>

              <select onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="FINISHED">Finished</option>
              </select>
            </div>
          </div>
        </header>

        <div className="table-wrapper">
          <table className="event-table">
            <thead>
              <tr>
                <th>Branch</th>
                <th>Event Title</th>
                <th>Function Date</th>
                <th>Days Count</th>
                <th>Periodicity</th>
                <th>Reminder Date</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => {
                const days = getDaysCount(event.function_date);
                return (
                  <tr key={event.event_id}>
                    <td className="branch-cell">{event.display_branch_name}</td>
                    <td>
                      <strong>{event.title}</strong>
                    </td>
                    <td>{event.function_date || "N/A"}</td>
                    <td>
                      <span
                        className={`days-badge ${days >= 0 ? "pending" : "finished"}`}
                      >
                        {days >= 0 ? `+${days} Days` : `${days} Days`}
                      </span>
                    </td>
                    <td>{event.periodicity}</td>
                    <td>{event.reminder_date || "None"}</td>
                    <td>
                      <button
                        className="read-btn"
                        onClick={() => setViewRemark(event.remarks)}
                      >
                        <FaEye /> Read
                      </button>
                    </td>
                    <td className="event-actions">
                      <button
                        className="event-edit-btn"
                        onClick={() => {
                          setEditingData(event);
                          setIsModalOpen(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="event-del-btn"
                        onClick={() => {
                          handleDelete(event.event_id);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- UPDATE MODAL --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Edit Event</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="modal-body">
              <div className="m-grid">
                <div className="m-field full">
                  <label>Title</label>
                  <input
                    type="text"
                    value={editingData.title}
                    onChange={(e) =>
                      setEditingData({ ...editingData, title: e.target.value })
                    }
                  />
                </div>
                <div className="m-field">
                  <label>Function Date</label>
                  <input
                    type="date"
                    value={editingData.function_date}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        function_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="m-field">
                  <label>Reminder Date</label>
                  <input
                    type="date"
                    value={editingData.reminder_date}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        reminder_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="m-field full">
                  <label>Remarks</label>
                  <textarea
                    value={editingData.remarks}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        remarks: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <button type="submit" className="save-btn">
                <FaSave /> Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- REMARK MODAL --- */}
      {viewRemark !== null && (
        <div className="modal-overlay">
          <div className="modal-card remark-view">
            <h3>Event Remarks</h3>
            <p>{viewRemark || "No description provided."}</p>
            <button
              className="event-close-btn"
              onClick={() => setViewRemark(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailsView;



