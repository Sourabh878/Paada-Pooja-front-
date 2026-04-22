import React, { useState, useEffect } from "react";
import {
  FaBuilding,
  FaSearch,
  FaUserCheck,
  FaCalendarAlt,
  FaOm,
  FaPrint,
  FaCreditCard,
  FaTrash,
  FaCheckCircle,
  FaMoneyCheck,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { getToken, getUserId } from "../utils/auth";
import "./Style/BookSeva.css"; // Using your existing CSS for identical UI
import DevooteeNavbar from "../components/Navbar/DevoteeNavbar";

const BookProperty = () => {
  const [categories, setCategories] = useState([]);
  const [assets, setAssets] = useState([]);
  const [devotees, setDevotees] = useState([]);

  const [selectedDevotee, setSelectedDevotee] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [checkInfo, setCheckInfo] = useState({ number: "", date: "" });
  const [transactionInfo, setTransactionInfo] = useState({
    number: "",
    date: "",
  });
  const [devoteeSearch, setDevoteeSearch] = useState("");
  const [assetSearch, setAssetSearch] = useState("");
  const [receipt, setReceipt] = useState(null);

  const API_BASE = `${import.meta.env.VITE_API_URL}/api`;
  const today = new Date().toISOString().split("T")[0];

  const formatCurrency = (num) => parseFloat(num).toFixed(2);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [catRes, devRes] = await Promise.all([
        fetch(`${API_BASE}/properties/pcat`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        fetch(`${API_BASE}/devotees`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
      ]);
      if (catRes.ok) setCategories(await catRes.json());
      if (devRes.ok) setDevotees(await devRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleCategoryChange = async (catId) => {
    setSelectedCategory(catId);
    const res = await fetch(`${API_BASE}/properties/category/${catId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (res.ok) setAssets(await res.json());
  };

  const toggleAssetSelection = (asset) => {
    const isAlreadySelected = selectedAssets.find((a) => a.id === asset.id);
    if (isAlreadySelected) {
      setSelectedAssets(selectedAssets.filter((a) => a.id !== asset.id));
    } else {
      setSelectedAssets([
        ...selectedAssets,
        {
          ...asset,
          no_of_days: 1,
          rate: parseFloat(asset.rental_rate || 0),
          individual_event_date: today,
        },
      ]);
    }
  };

  const updateAssetDetails = (assetId, field, value) => {
    setSelectedAssets(
      selectedAssets.map((a) =>
        a.id === assetId ? { ...a, [field]: value } : a,
      ),
    );
  };

  const calculateTotal = () => {
    return selectedAssets.reduce(
      (sum, a) => sum + parseFloat(a.rate || 0) * parseInt(a.no_of_days || 1),
      0,
    );
  };

  const handleBooking = async (e) => {
    if (!confirm("Confirm Property Booking?")) return;
    e.preventDefault();

    if (!selectedDevotee || selectedAssets.length === 0)
      return alert("Missing Selection");

    try {
      const totalAmt = calculateTotal();

      const paymentPayload = {
        payment_method: paymentMode,
        amount: totalAmt,
        cheque_no: paymentMode === "Cheque" ? checkInfo.number : null,
        cheque_date: paymentMode === "Cheque" ? checkInfo.date : null,
        transaction_id:
          paymentMode === "UPI" || paymentMode === "Bank Transfer"
            ? transactionInfo.number
            : null,
        transaction_date:
          paymentMode === "UPI" || paymentMode === "Bank Transfer"
            ? transactionInfo.date
            : null,
      };

      // 1. Record Payment
      const pRes = await fetch(`${API_BASE}/properties/payment_details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(paymentPayload),
      });
      const pData = await pRes.json();
      const paymentId = pData.payment?.id;

      // 2. Record individual Property Bookings
      const promises = selectedAssets.map((asset) => {
        const payload = {
          asset_id: asset.id,
          devotee_id: selectedDevotee.id,
          booking_date: today,
          event_date: asset.individual_event_date,
          amount_paid: parseFloat(asset.rate) * parseInt(asset.no_of_days),
          payment_id: paymentId,
          no_of_days: Number(asset.no_of_days),
          function_type: asset.function_type,
          // created_by: getUserId()
        };

        return fetch(`${API_BASE}/properties/property-bookings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(payload),
        });
      });

      await Promise.all(promises);

      setReceipt({
        devotee: selectedDevotee,
        assets: selectedAssets,
        payment_method: paymentMode,
        checkInfo: paymentMode === "Cheque" ? checkInfo : null,
        transactionInfo:
          paymentMode === "UPI" || paymentMode === "Bank Transfer"
            ? transactionInfo
            : null,
        total_amount: totalAmt,
        booking_date: today,
      });
      alert("Properties Booked Successfully!");
    } catch (err) {
      console.error(err);
      alert("Error processing booking.");
    }
  };

  const filteredDevotees =
    devoteeSearch.length > 2
      ? devotees.filter(
          (d) =>
            d.mobile.includes(devoteeSearch) ||
            d.name.toLowerCase().includes(devoteeSearch.toLowerCase()),
        )
      : [];

  const filteredAssets = assets.filter((a) =>
    a.asset_name.toLowerCase().includes(assetSearch.toLowerCase()),
  );

  return (
    <>
      <DevooteeNavbar />
      <div className="book-seva-page">
        <header className="page-header">
          <FaOm className="om-header-icon" />
          <h1>Property Booking Portal</h1>
        </header>

        <section className="booking-card devotee-section">
          <h3>1. Devotee Search</h3>
          {!selectedDevotee ? (
            <>
              <div className="search-input-wrapper">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Mobile or Name..."
                  value={devoteeSearch}
                  onChange={(e) => setDevoteeSearch(e.target.value)}
                />
              </div>
              <div className="devotee-results">
                {filteredDevotees.map((d) => (
                  <div
                    key={d.id}
                    className="devotee-row"
                    onClick={() => setSelectedDevotee(d)}
                  >
                    <span>
                      {d.name} ({d.mobile})
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="selected-confirmation">
              <p>
                <FaUserCheck color="green" />{" "}
                <strong>{selectedDevotee.name}</strong>
              </p>
              <button
                className="change-btn"
                onClick={() => {
                  setSelectedDevotee(null);
                  setSelectedAssets([]);
                }}
              >
                Change Devotee
              </button>
            </div>
          )}
        </section>

        <div className="booking-grid full-width-grid">
          {selectedDevotee && (
            <section className="booking-card seva-section animate-fade">
              <h3>2. Select Properties</h3>
              <div className="f-group">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value="">Choose Category</option>
                  {categories.map((c) => (
                    <option key={c.p_id} value={c.p_id}>
                      {c.p_name}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className="search-input-wrapper"
                style={{ margin: "15px 0" }}
              >
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search Property..."
                  value={assetSearch}
                  onChange={(e) => setAssetSearch(e.target.value)}
                />
              </div>

              <div className="seva-list">
                {filteredAssets.map((a) => {
                  const isSelected = selectedAssets.find(
                    (item) => item.id === a.id,
                  );
                  return (
                    <div
                      key={a.id}
                      className={`seva-option ${isSelected ? "active" : ""}`}
                      onClick={() => toggleAssetSelection(a)}
                    >
                      <div className="asset-info-main">
                        <strong>{a.asset_name}</strong>
                        <small>
                          <FaMapMarkerAlt /> {a.location}
                        </small>
                      </div>
                      <div className="price-side">
                        <span>₹{formatCurrency(a.rental_rate)}</span>
                        {isSelected && (
                          <FaCheckCircle style={{ marginLeft: "10px" }} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {selectedAssets.length > 0 && (
            <section className="booking-card summary-section animate-fade">
              <h3>3. Booking Summary</h3>
              <div className="summary-grid-container wide-table">
                <table className="summary-grid">
                  <thead>
                    <tr>
                      <th className="col-name">Property Name</th>
                      <th className="function_type">Function Type</th>
                      <th className="date-input">Event Date</th>
                      <th>days</th>
                      <th>Rate</th>
                      <th>Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAssets.map((a) => (
                      <tr key={a.id}>
                        <td className="col-name">{a.asset_name}</td>
                        <td className="date-input">
                          <input
                            type="date"
                            className="grid-input-date"
                            value={a.individual_event_date}
                            min={today}
                            onChange={(e) =>
                              updateAssetDetails(
                                a.id,
                                "individual_event_date",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="f-type"
                            value={a.function_type}
                            onChange={(e) =>
                              updateAssetDetails(
                                a.id,
                                "function_type",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="grid-input-small"
                            value={a.no_of_days}
                            min="1"
                            onChange={(e) =>
                              updateAssetDetails(
                                a.id,
                                "no_of_days",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="grid-input-small"
                            value={a.rate}
                            onChange={(e) =>
                              updateAssetDetails(a.id, "rate", e.target.value)
                            }
                          />
                        </td>
                        <td className="total-cell">
                          ₹
                          {formatCurrency(
                            parseFloat(a.rate || 0) *
                              parseInt(a.no_of_days || 1),
                          )}
                        </td>
                        <td>
                          <FaTrash
                            className="remove-icon"
                            onClick={() => toggleAssetSelection(a)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="summary-box">
                <div className="summary-total">
                  <span style={{ fontSize: "20px" }}>Grand Total:</span>
                  <span className="amount">
                    ₹{formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>

              <div className="payment-details-container">
                <div className="f-group">
                  <label>
                    <FaCreditCard /> Payment Mode
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="payment-select"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                {paymentMode === "Cheque" && (
                  <div className="cheque-inputs animate-fade">
                    <input
                      type="text"
                      placeholder="Cheque Number"
                      value={checkInfo.number}
                      onChange={(e) =>
                        setCheckInfo({ ...checkInfo, number: e.target.value })
                      }
                    />
                    <input
                      type="date"
                      value={checkInfo.date}
                      onChange={(e) =>
                        setCheckInfo({ ...checkInfo, date: e.target.value })
                      }
                    />
                  </div>
                )}
                {/* ... Add Transaction Inputs for UPI/Bank similar to Seva page ... */}
              </div>

              <button className="book-btn" onClick={handleBooking}>
                <FaCheckCircle /> CONFIRM BOOKING
              </button>
            </section>
          )}
        </div>

        {receipt && (
          <div className="receipt-overlay">
            <div className="receipt-box multi-receipt" id="print-area">
              <div className="temple-receipt-header">
                <FaOm />
                <h2>Shri Temple Trust</h2>
                <p>Property Booking Receipt</p>
              </div>
              <div className="receipt-content">
                <p>
                  <strong>Devotee:</strong> {receipt.devotee.name}
                </p>
                <p>
                  <strong>Booking Date:</strong>{" "}
                  {new Date(receipt.booking_date).toLocaleDateString("en-GB")}
                </p>
                <table className="receipt-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Date</th>
                      <th>Qty</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receipt.assets.map((a, i) => (
                      <tr key={i}>
                        <td>{a.asset_name}</td>
                        <td>
                          {new Date(a.individual_event_date).toLocaleDateString(
                            "en-GB",
                          )}
                        </td>
                        <td>{a.no_of_days}</td>
                        <td>
                          ₹
                          {formatCurrency(
                            parseFloat(a.rate) * parseInt(a.no_of_days),
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="total-line">
                  <strong>Total Amount:</strong>{" "}
                  <span>₹{formatCurrency(receipt.total_amount)}</span>
                </div>
              </div>
              <div className="receipt-buttons no-print">
                <button onClick={() => window.print()} className="print-btn">
                  <FaPrint /> Print
                </button>
                <button onClick={() => setReceipt(null)} className="close-btn">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BookProperty;



