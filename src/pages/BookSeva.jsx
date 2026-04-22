import React, { useState, useEffect } from "react";
import {
  FaPray,
  FaSearch,
  FaUserCheck,
  FaCalendarAlt,
  FaOm,
  FaPrint,
  FaCreditCard,
  FaTrash,
  FaCheckCircle,
  FaMoneyCheck,
} from "react-icons/fa";
import { getToken, getUserId } from "../utils/auth";
import "./Style/BookSeva.css";
import DevooteeNavbar from "../components/Navbar/DevoteeNavbar";
import { MdGroup } from "react-icons/md";

const BookSeva = () => {
  const [categories, setCategories] = useState([]);
  const [sevas, setSevas] = useState([]);
  const [devotees, setDevotees] = useState([]);

  const [selectedDevotee, setSelectedDevotee] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSevas, setSelectedSevas] = useState([]);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [checkInfo, setCheckInfo] = useState({ number: "", date: "" });
  const [TransactionInfo, setTransactionInfo] = useState({
    number: "",
    date: "",
  });
  const [devoteeSearch, setDevoteeSearch] = useState("");
  const [sevaSearch, setSevaSearch] = useState("");
  const [receipt, setReceipt] = useState(null);

  const API_BASE = `${import.meta.env.base_url}/api`;
  const today = new Date().toISOString().split("T")[0];

  const formatCurrency = (num) => parseFloat(num).toFixed(2);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [catRes, devRes] = await Promise.all([
        fetch(`${API_BASE}/categories`, {
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

  const handleCategoryChange = async (catName) => {
    setSelectedCategory(catName);
    const res = await fetch(`${API_BASE}/sevas/category/${catName}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (res.ok) setSevas(await res.json());
  };

  const toggleSevaSelection = (seva) => {
    const isAlreadySelected = selectedSevas.find(
      (s) => s.seva_id === seva.seva_id,
    );
    if (isAlreadySelected) {
      setSelectedSevas(selectedSevas.filter((s) => s.seva_id !== seva.seva_id));
    } else {
      const baseRate =
        parseFloat(seva.price || 0) + parseFloat(seva.Priest_price || 0);
      setSelectedSevas([
        ...selectedSevas,
        {
          ...seva,
          quantity: 1,
          rate: baseRate,
          individual_seva_date: today,
          courier_charge: 0,
          category_name: selectedCategory, // Store the category at time of selection
        },
      ]);
    }
  };

  const updateSevaDetails = (sevaId, field, value) => {
    setSelectedSevas(
      selectedSevas.map((s) =>
        s.seva_id === sevaId ? { ...s, [field]: value } : s,
      ),
    );
  };

  // CORRECTED CALCULATION LOGIC
  const calculateTotal = () => {
    return selectedSevas.reduce((sum, s) => {
      const baseCost = parseFloat(s.rate || 0) * parseInt(s.quantity || 1);
      // Only add courier charge if that specific row is Shashwata Seva
      const courierCost =
        s.category_name === "Shashwata  Seva"
          ? parseFloat(s.courier_charge || 0) * parseInt(s.quantity || 1)
          : 0;
      return sum + baseCost + courierCost;
    }, 0);
  };

  const amountToWords = (amount) => {
    const numValue = Math.floor(parseFloat(amount));
    if (numValue === 0) return "";
    const a = [
      "",
      "One ",
      "Two ",
      "Three ",
      "Four ",
      "Five ",
      "Six ",
      "Seven ",
      "Eight ",
      "Nine ",
      "Ten ",
      "Eleven ",
      "Twelve ",
      "Thirteen ",
      "Fourteen ",
      "Fifteen ",
      "Sixteen ",
      "Seventeen ",
      "Eighteen ",
      "Nineteen ",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const convert = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + " " + a[n % 10];
      if (n < 1000)
        return a[Math.floor(n / 100)] + "Hundred " + convert(n % 100);
      if (n < 100000)
        return convert(Math.floor(n / 1000)) + "Thousand " + convert(n % 1000);
      if (n < 10000000)
        return convert(Math.floor(n / 100000)) + "Lakh " + convert(n % 100000);
      return (
        convert(Math.floor(n / 10000000)) + "Crore " + convert(n % 10000000)
      );
    };
    const paise = Math.round((parseFloat(amount) - numValue) * 100);
    let result = convert(numValue) + "Rupees ";
    if (paise > 0) result += "and " + convert(paise) + "Paise ";
    return "** " + result + "Only **";
  };

  const handleBooking = async (e) => {
    if (!confirm("confirm booking?")) return;
    e.preventDefault();
    if (!selectedDevotee || selectedSevas.length === 0)
      return alert("Missing Selection");

    if (paymentMode === "Cheque" && (!checkInfo.number || !checkInfo.date))
      return alert("Please enter Cheque details");
    if (
      (paymentMode === "UPI" || paymentMode === "Bank Transfer") &&
      (!TransactionInfo.number || !TransactionInfo.date)
    )
      return alert("Please enter Transaction details");

    try {
      const totalAmt = calculateTotal();
      const paymentPayload = {
        payment_method: paymentMode === "UPI / QR" ? "UPI" : paymentMode,
        amount: totalAmt,
        cheque_no: paymentMode === "Cheque" ? checkInfo.number : null,
        cheque_date: paymentMode === "Cheque" ? checkInfo.date : null,
        transaction_id:
          paymentMode === "UPI" || paymentMode === "Bank Transfer"
            ? TransactionInfo.number
            : null,
        transaction_date:
          paymentMode === "UPI" || paymentMode === "Bank Transfer"
            ? TransactionInfo.date
            : null,
      };

      const paymentResponse = await fetch(
        `${API_BASE}/bookings/payment_details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(paymentPayload),
        },
      );

      if (!paymentResponse.ok) throw new Error("Payment failed to record");
      const paymentData = await paymentResponse.json();
      const paymentIdFromDb = paymentData.payment?.id;

      const promises = selectedSevas.map((seva) => {
        const rowCourier =
          seva.category_name === "Shashwata  Seva"
            ? parseFloat(seva.courier_charge || 0)
            : 0;
        const payload = {
          devotee_id: selectedDevotee.id,
          seva_id: seva.seva_id,
          booking_date: today,
          seva_date: seva.individual_seva_date,
          amount:
            parseFloat(seva.rate) * parseInt(seva.quantity) +
            rowCourier * parseInt(seva.quantity),
          payment_method: paymentPayload.payment_method,
          payment_id: paymentIdFromDb,
          user_id: getUserId(),
          Quantity: Number(seva.quantity),
          courier_charges: rowCourier,
        };
        return fetch(`${API_BASE}/bookings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(payload),
        });
      });

      const results = await Promise.all(promises);
      if (results.every((res) => res.ok)) {
        setReceipt({
          devotee: selectedDevotee,
          sevas: selectedSevas,
          payment_method: paymentMode,
          checkInfo: paymentMode === "Cheque" ? checkInfo : null,
          TransactionInfo:
            paymentMode === "UPI" || paymentMode === "Bank Transfer"
              ? TransactionInfo
              : null,
          total_amount: totalAmt,
          booking_date: today,
        });
        alert("All Sevas Booked Successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during booking.");
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

  const filteredSevas = sevas.filter((s) =>
    s.seva_name.toLowerCase().includes(sevaSearch.toLowerCase()),
  );

  // Helper to check if the table should show the courier column header
  const hasShashwataInSelection = selectedSevas.some(
    (s) => s.category_name === "Shashwata  Seva",
  );

  return (
    <>
      <DevooteeNavbar />
      <div className="book-seva-page">
        <header className="page-header">
          <FaOm className="om-header-icon" />
          <h1>Seva Booking Portal</h1>
        </header>

        {/* ... Devotee Search Section remains same ... */}
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
              <p className="sub-text">{selectedDevotee.mobile}</p>
              <button
                className="change-btn"
                onClick={() => {
                  setSelectedDevotee(null);
                  setSelectedSevas([]);
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
              <h3>2. Select Sevas</h3>
              <div className="f-group">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value="">Choose Category </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className="search-input-wrapper"
                style={{ marginBottom: "15px", marginTop: "15px" }}
              >
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search Seva..."
                  value={sevaSearch}
                  onChange={(e) => setSevaSearch(e.target.value)}
                />
              </div>

              <div className="seva-list">
                {filteredSevas.map((s) => {
                  const isSelected = selectedSevas.find(
                    (item) => item.seva_id === s.seva_id,
                  );
                  return (
                    <div
                      key={s.seva_id}
                      className={`seva-option ${isSelected ? "active" : ""}`}
                      onClick={() => toggleSevaSelection(s)}
                    >
                      <span>{s.seva_name}</span>
                      <div className="price-side">
                        <span>
                          ₹
                          {formatCurrency(
                            parseFloat(s.price || 0) +
                              parseFloat(s.Priest_price || 0),
                          )}
                        </span>
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

          {selectedSevas.length > 0 && (
            <section className="booking-card summary-section animate-fade">
              <h3>3. Booking Summary</h3>
              <div className="summary-grid-container wide-table">
                <table className="summary-grid">
                  <thead>
                    <tr>
                      <th className="col-name-1">Seva Name</th>
                      <th className="date-input">Seva Date</th>
                      <th>Qty</th>
                      <th>Rate</th>
                      {hasShashwataInSelection && <th>Courier (Per Item)</th>}
                      <th>Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSevas.map((s) => {
                      const isShashwata = s.category_name === "Shashwata  Seva";
                      const rowTotal =
                        parseFloat(s.rate || 0) * parseInt(s.quantity || 1) +
                        (isShashwata
                          ? parseFloat(s.courier_charge || 0) *
                            parseInt(s.quantity || 1)
                          : 0);
                      return (
                        <tr key={s.seva_id}>
                          <td className="col-name-1">
                            <div className="seva-name-display-1">
                              {s.seva_name}
                            </div>
                          </td>
                          <td>
                            <input
                              type="date"
                              className="grid-input-date"
                              value={s.individual_seva_date}
                              min={today}
                              onChange={(e) =>
                                updateSevaDetails(
                                  s.seva_id,
                                  "individual_seva_date",
                                  e.target.value,
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="grid-input-small"
                              value={s.quantity}
                              min="1"
                              onChange={(e) =>
                                updateSevaDetails(
                                  s.seva_id,
                                  "quantity",
                                  e.target.value,
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="grid-input-small"
                              value={s.rate}
                              readOnly={parseFloat(s.price) > 0}
                              onChange={(e) =>
                                updateSevaDetails(
                                  s.seva_id,
                                  "rate",
                                  e.target.value,
                                )
                              }
                            />
                          </td>
                          {hasShashwataInSelection && (
                            <td>
                              {isShashwata ? (
                                <input
                                  type="number"
                                  className="grid-input-small"
                                  placeholder="₹"
                                  value={s.courier_charge}
                                  onChange={(e) =>
                                    updateSevaDetails(
                                      s.seva_id,
                                      "courier_charge",
                                      e.target.value,
                                    )
                                  }
                                />
                              ) : (
                                <span className="muted-text">-</span>
                              )}
                            </td>
                          )}
                          <td className="total-cell">
                            ₹{formatCurrency(rowTotal)}
                          </td>
                          <td>
                            <FaTrash
                              className="remove-icon"
                              onClick={() => toggleSevaSelection(s)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Grand Total Display */}
              <div className="summary-box">
                <div className="summary-total">
                  <span style={{ fontSize: "20px" }}>Grand Total:</span>
                  <span className="amount">
                    ₹{formatCurrency(calculateTotal())}
                  </span>
                </div>
                <div className="amount-words">
                  {amountToWords(calculateTotal())}
                </div>
              </div>

              {/* Payment Section remains same ... */}
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
                {/* UPI/Cheque inputs... */}
                {paymentMode === "Cheque" && (
                  <div className="cheque-inputs animate-fade">
                    <div className="f-group">
                      <label>
                        <FaMoneyCheck className="cheque" /> Cheque No
                      </label>
                      <input
                        type="text"
                        value={checkInfo.number}
                        onChange={(e) =>
                          setCheckInfo({ ...checkInfo, number: e.target.value })
                        }
                      />
                    </div>
                    <div className="f-group">
                      <label>
                        <FaCalendarAlt className="cheque" /> Cheque Date
                      </label>
                      <input
                        type="date"
                        value={checkInfo.date}
                        onChange={(e) =>
                          setCheckInfo({ ...checkInfo, date: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}
                {(paymentMode === "UPI" || paymentMode === "Bank Transfer") && (
                  <div className="cheque-inputs animate-fade">
                    <div className="f-group">
                      <label>
                        <FaMoneyCheck className="cheque" /> Transaction ID
                      </label>
                      <input
                        type="text"
                        value={TransactionInfo.number}
                        onChange={(e) =>
                          setTransactionInfo({
                            ...TransactionInfo,
                            number: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="f-group">
                      <label>
                        <FaCalendarAlt className="cheque" /> Trans. Date
                      </label>
                      <input
                        type="date"
                        value={TransactionInfo.date}
                        onChange={(e) =>
                          setTransactionInfo({
                            ...TransactionInfo,
                            date: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
              <button className="book-btn" onClick={handleBooking}>
                <FaPray /> CONFIRM BOOKING
              </button>
            </section>
          )}
        </div>

        {/* Receipt Overlay */}
        {receipt && (
          <div className="receipt-overlay">
            <div className="receipt-box multi-receipt" id="print-area">
              <div className="temple-receipt-header">
                <FaOm />
                <h2>Shri Temple Trust</h2>
                <p>Seva Receipt</p>
              </div>
              <div className="receipt-content">
                <p>
                  <strong>Devotee:</strong> {receipt.devotee.name}
                </p>
                <p>
                  <strong>Phone:</strong> {receipt.devotee.mobile}
                </p>
                <p>
                  <strong>Payment:</strong> {receipt.payment_method}
                </p>
                <table className="receipt-table">
                  <thead>
                    <tr>
                      <th>Seva</th>
                      <th>Date</th>
                      <th>Qty</th>
                      <th>Courier</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receipt.sevas.map((s, i) => {
                      const isShashwata = s.category_name === "Shashwata  Seva";
                      const cCharge = isShashwata
                        ? parseFloat(s.courier_charge || 0) *
                          parseInt(s.quantity)
                        : 0;
                      const rowTotal =
                        parseFloat(s.rate) * parseInt(s.quantity) + cCharge;
                      return (
                        <tr key={i}>
                          <td>{s.seva_name}</td>
                          <td>
                            {new Date(
                              s.individual_seva_date,
                            ).toLocaleDateString("en-GB")}
                          </td>
                          <td>{s.quantity}</td>
                          <td>₹{formatCurrency(cCharge)}</td>
                          <td>₹{formatCurrency(rowTotal)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="total-line">
                  <strong>Grand Total:</strong>{" "}
                  <span>₹{formatCurrency(receipt.total_amount)}</span>
                </div>
                <div className="amount-words">
                  {amountToWords(receipt.total_amount)}
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

export default BookSeva;



